const SerialPort = require('serialport');
const aesjs = require('aes-js');
const EventEmitter = require('events');
const bigintCryptoUtils = require('bigint-crypto-utils');
const { parseData, CRC16, randHexArray, argsToByte, int64LE } = require('./utils');
const commandList = require('./command');
const chalk = require('chalk');
const semver = require('semver');
const pkg = require('../package.json');
const ESSPProtocolParser = require('./parser');

module.exports = class SSP extends EventEmitter {
  constructor(param) {
    super();

    if (!semver.satisfies(process.version, pkg.engines.node)) {
      throw new Error(`Version Node.js must be ${pkg.engines.node}`);
    }

    this.eventEmitter = new EventEmitter();

    this.debug = param.debug || false;
    this.id = param.id || 0;
    this.timeout = param.timeout || 3000;
    this.encryptAllCommand = param.encryptAllCommand || true;
    this.keys = {
      fixedKey: param.fixedKey || '0123456701234567',
      generatorKey: null,
      modulusKey: null,
      hostRandom: null,
      hostIntKey: null,
      slaveIntKey: null,
      key: null
    };
    this.sequence = 0x80;
    this.count = 0;
    this.currentCommand = null;
    this.aesEncryption = null;
    this.enabled = false;
    this.polling = false;
    this.unit_type = null;
  }

  open(port, param = {}) {
    return new Promise((resolve, reject) => {
      this.port = new SerialPort(port, {
        baudRate: param.baudRate || 9600,
        databits: param.databits || 8,
        stopbits: param.stopbits || 2,
        parity: param.parity || 'none',
        highWaterMark: param.highWaterMark || 64 * 1024,
        autoOpen: true
      });

      const parser = this.port.pipe(new ESSPProtocolParser({ id: this.id }));
      parser.on('data', buffer => {
        if (this.debug) { console.log('COM ->', chalk.yellow(buffer.toString('hex')), chalk.green(this.currentCommand)); }
        this.eventEmitter.emit(this.currentCommand, buffer);
      });

      this.port.on('error', (error) => {
        reject(error);
        this.emit('CLOSE');
      });

      this.port.on('close', (error) => {
        reject(error);
        this.emit('CLOSE');
      });

      this.port.on('open', () => {
        resolve();
        this.emit('OPEN');
      });
    });
  }

  close() {
    if (this.port !== undefined) {
      this.port.close();
    }
  }

  getSequence() {
    this.sequence = this.sequence === 0x00 ? 0x80 : 0x00;
    return this.id | this.sequence;
  }

  initEncryption() {
    return Promise.all([
      bigintCryptoUtils.prime(16),
      bigintCryptoUtils.prime(16),
      bigintCryptoUtils.randBetween(BigInt(2) ** BigInt(16))
    ])
      .then(res => {
        this.keys.generatorKey = res[0];
        this.keys.modulusKey = res[1];
        this.keys.hostRandom = res[2];
        this.keys.hostIntKey = this.keys.generatorKey ** this.keys.hostRandom % this.keys.modulusKey;
        return;
      })
      .then(() => this.exec('SET_GENERATOR', int64LE(this.keys.generatorKey)))
      .then(() => this.exec('SET_MODULUS', int64LE(this.keys.modulusKey)))
      .then(() => this.exec('REQUEST_KEY_EXCHANGE', int64LE(this.keys.hostIntKey)))
      .then(() => {
        this.count = 0;
        return;
      });
  }

  getPacket(command, args) {
    let STX = 0x7F;
    let STEX = 0x7E;

    if (commandList[command].args && args.length === 0) { throw new Error('args missings'); }

    let LENGTH = args.length + 1;
    let SEQ_SLAVE_ID = this.getSequence();
    let DATA = [commandList[command].code].concat(...args);

    // Encrypted packet
    if (this.aesEncryption !== null && (commandList[command].encrypted || this.encryptAllCommand)) {
      let eCOUNT = Buffer.alloc(4);
      eCOUNT.writeUInt32LE(this.count, 0);
      let eCommandLine = [DATA.length].concat([...eCOUNT], DATA);
      let ePACKING = randHexArray(Math.ceil((eCommandLine.length + 2) / 16) * 16 - (eCommandLine.length + 2));
      eCommandLine = eCommandLine.concat(ePACKING);
      eCommandLine = eCommandLine.concat(CRC16(eCommandLine));

      let eDATA = [...this.aesEncryption.encrypt(eCommandLine)];

      DATA = [STEX].concat(eDATA);
      LENGTH = DATA.length;
    }

    let tmp = [SEQ_SLAVE_ID].concat(LENGTH, DATA);
    let comandLine = Buffer.from([STX].concat(tmp, CRC16(tmp)).join(',').replace(/,127/g, ',127,127').split(','));

    if (this.debug) { console.log('COM <-', chalk.cyan(comandLine.toString('hex')), chalk.green(this.currentCommand), this.count); }

    return comandLine;
  }

  getPromise(command, buffer) {
    this.currentCommand = command;

    return new Promise((resolve) => {
      this.port.write(buffer);
      this.port.drain(() => {
        if (command === 'SYNC') { this.sequence = 0x80; }
        return resolve(this.newEvent(command));
      });
    })
      .then(res => {
        return res.status === 'TIMEOUT' ? this.getPromise(command, buffer) : res;
      });
  }

  exec(command, args = []) {
    command = command.toUpperCase();
    if (commandList[command] === undefined) { throw new Error('command not found'); }
    let buffer = Buffer.from(this.getPacket(command, args));
    return this.getPromise(command, buffer);
  }

  newEvent(command) {
    return new Promise((resolve) => {
      let timeout = true;
      this.eventEmitter.once(command, buffer => {
        timeout = false;
        if (Buffer.isBuffer(buffer)) {
          resolve(this.parsePacket(buffer));
        } else if (buffer === 'TIMEOUT') {
          if (this.debug) { console.log(chalk.red('TIMEOUT ' + command)); }

          resolve({
            success: false,
            status: 'TIMEOUT',
            command: this.currentCommand,
            info: {}
          });
        }
      });

      setTimeout(() => {
        if (timeout) {
          this.eventEmitter.emit(this.currentCommand, 'TIMEOUT');
          this.currentCommand = null;
        }
      }, parseInt(this.timeout));
    })
      .then(res => new Promise((resolve) => {
        setTimeout(() => {
          resolve(res);
        }, 100);
      }));
  }

  parsePacket(buffer) {
    buffer = [...buffer];
    if (buffer[0] === 0x7F) {
      buffer = buffer.slice(1);
      let DATA = buffer.slice(2, buffer[1] + 2);
      let CRC = CRC16(buffer.slice(0, buffer[1] + 2));

      if (CRC[0] !== buffer[buffer.length - 2] || CRC[1] !== buffer[buffer.length - 1]) {
        return { success: false, error: 'Wrong CRC16' };
      }
      if (this.keys.key !== null && DATA[0] === 0x7E) {
        DATA = this.aesEncryption.decrypt(Buffer.from(DATA.slice(1)));
        if (this.debug) { console.log('Decrypted:', chalk.red(Buffer.from(DATA).toString('hex'))); }
        let eLENGTH = DATA[0];
        let eCOUNT = Buffer.from(DATA.slice(1, 5)).readInt32LE();
        DATA = DATA.slice(5, eLENGTH + 5);
        this.count = eCOUNT;
      }

      let parsedData = parseData(DATA, this.currentCommand, this.protocol_version, this.unit_type);

      if (this.debug) {
        console.log(parsedData);
      }

      if (this.currentCommand === 'REQUEST_KEY_EXCHANGE') {
        this.createHostEncryptionKeys(parsedData.info.key);
      } else if (this.currentCommand === 'SETUP_REQUEST') {
        this.protocol_version = parsedData.info.protocol_version;
        this.unit_type = parsedData.info.unit_type;
      } else if (this.currentCommand === 'UNIT_DATA') {
        this.unit_type = parsedData.info.unit_type;
      }

      return parsedData;
    }
    return { success: false, error: 'Unknown response' };
  }

  createHostEncryptionKeys(data) {
    if (this.keys.key === null) {
      this.keys.slaveIntKey = Buffer.from(data).readBigInt64LE();
      this.keys.key = this.keys.slaveIntKey ** this.keys.hostRandom % this.keys.modulusKey;
      this.encryptKey = Buffer.concat([
        int64LE(Buffer.from(this.keys.fixedKey, 'hex').readBigInt64BE()),
        int64LE(this.keys.key)
      ]);

      this.aesEncryption = new aesjs.ModeOfOperation.ecb(this.encryptKey, null, 0);
      this.count = 0;
      if (this.debug) {
        console.log('AES encrypt key:', chalk.red('0x' + Buffer.from(this.encryptKey).toString('hex')));
        console.log('');
        console.log(this.keys);
        console.log('');
      }
    }
  }

  enable() {
    return this.command('ENABLE')
      .then(res => {
        if (res.status === 'OK') {
          this.enabled = true;
          if (!this.polling) this.poll(true);
        }
        return res;
      });
  }

  disable() {
    return this.command('DISABLE')
      .then(res => {
        if (res.status === 'OK') {
          this.enabled = false;
          this.poll(false)
            .then(() => {
              this.emit('DISABLED');
            });
        }
        return res;
      });
  }

  command(command, args) {
    if (this.enabled) {
      let result = null;

      return this.poll(false)
        .then(() => this.exec(command, argsToByte(command, args, this.protocol_version)))
        .then(res => {
          result = res;
          if (!this.polling) return this.poll(true);
          return () => { };
        })
        .then(() => result);
    }
    return this.exec(command, argsToByte(command, args, this.protocol_version));
  }

  poll(status = true) {
    if (status) {
      this.polling = true;
      return this.exec('POLL')
        .then(result => {
          if (result.info) {
            let res = result.info;
            if (!Array.isArray(result.info)) res = [result.info];

            res.forEach((info) => {
              this.emit(info.name, info);
              // Device reports disabled event on each poll during smart epmy or dispensing, so need to encounter that
              // Maybe there is better solution, but found no clue in docs
              if (res.length === 1 && info.name === 'DISABLED') {
                this.poll(false);
              }
            });
          }

          if (this.polling) {
            this.poll();
          } else {
            this.eventEmitter.emit('POLL_STOP');
          }
          return;
        });
    }
    if (this.polling !== false) {
      this.polling = false;
      return new Promise((resolve) => {
        this.eventEmitter.once('POLL_STOP', () => {
          resolve();
        });
      });
    }
    return new Promise((resolve) => { resolve(); });
  }
};
