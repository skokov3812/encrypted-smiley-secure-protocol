const serialport = require('serialport');
const aesjs = require('aes-js');
const { Int64LE } = require("int64-buffer");
const bigInt = require('big-integer');
const events = require('events');
const randomPrime = require('random-prime').randomPrime;
const { parseData, CRC16, randHexArray, argsToByte } = require('./utils');
const commandList = require('./command');
const chalk = require('chalk');

let eventEmitter = new events.EventEmitter();


module.exports = class SSP extends events {
  constructor(param){
    super();
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
  }

  open(port, param = {}) {
    return new Promise((resolve, reject) => {
      this.port = new serialport(port, {
        baudRate: param.baudRate || 9600,
        databits: param.databits || 8,
        stopbits: param.stopbits || 2,
        parity: param.parity || 'none',
        parser: serialport.parsers.raw,
        autoOpen: true
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

        let tmpBuffer = [];
        this.port.on('data', buffer => {
          let tmpArray = [...buffer];
					
          if(this.debug)
            console.log('COM ->', chalk.gray(buffer.toString('hex')), '| RAW');

          if(tmpBuffer.length == 1){
            if((tmpArray[0] == this.id | 0x80) || (tmpArray[0] == this.id | 0x00)){
              tmpBuffer = [0x7f].concat(tmpArray);
            } else {
              tmpBuffer = [];
            }
          } else {
            if(tmpBuffer.length == 0){
              let startByte = -1;

              for(let i=0; i<tmpArray.length; i++){
                if(tmpArray[i] == 0x7f && startByte == -1 && ((tmpArray[i+1] == this.id | 0x80) || (tmpArray[i+1] == this.id | 0x00))){
                  startByte = i;
                }
              }

              if(startByte != -1){
                tmpBuffer = tmpArray.slice(startByte, tmpArray.length);
              } else if(tmpArray[tmpArray.length-1] == 0x7f){
                tmpBuffer = [0x7f];
              }
            } else {
              tmpBuffer = tmpBuffer.concat(tmpArray);
            }
          }

          let double7F = (tmpBuffer.join(',').match(/,127,127/g) || []).length;

          if(tmpBuffer.length >= tmpBuffer[2]+5+double7F){
            if(this.debug)
              console.log('COM ->', chalk.yellow(Buffer.from(tmpBuffer.slice(0, tmpBuffer[2]+5+double7F)).toString('hex')), chalk.green(this.currentCommand));

            eventEmitter.emit(this.currentCommand, Buffer.from(tmpBuffer.slice(0, tmpBuffer[2]+5+double7F).join(',').replace(/,127,127/g, ',127').split(','), tmpBuffer[2]));
            tmpBuffer = tmpBuffer.slice(tmpBuffer[2]+5+double7F);
          }
        });
      });
    });
  }

  close(){
    if(this.port != undefined){
      this.port.close();
    }
  }

  getSequence(){
    this.sequence = this.sequence == 0x00 ? 0x80 : 0x00;
    return this.id | this.sequence;
  }

  initEncryption(){
    this.keys.generatorKey = randomPrime(100000);
    this.keys.modulusKey = randomPrime(this.keys.generatorKey);
    this.keys.hostRandom = randomPrime(this.keys.modulusKey);
    this.keys.hostIntKey = bigInt(this.keys.generatorKey).pow(this.keys.hostRandom).mod(this.keys.modulusKey);
		
    return this.exec('SET_GENERATOR', Int64LE(this.keys.generatorKey).buffer)
      .then(() => this.exec('SET_MODULUS', Int64LE(this.keys.modulusKey).buffer))
      .then(() => this.exec('REQUEST_KEY_EXCHANGE', Int64LE(this.keys.hostIntKey).buffer))
      .then(() => {
        this.count = 0;
        return;
      });
  }

  getPacket(command, args) {
    let STX = 0x7F;
    let STEX = 0x7E;

    if(commandList[command].args && args.length == 0)
      throw new Error("args missings");

    let LENGTH = args.length + 1;
    let SEQ_SLAVE_ID = this.getSequence();
    let DATA = [commandList[command].code].concat(args);

    //Encrypted packet
    if(this.aesEncryption != null && (commandList[command].encrypted || this.encryptAllCommand)){

      let eCOUNT = Buffer.alloc(4);
      eCOUNT.writeUInt32LE(this.count, 0);
      let eCommandLine = [DATA.length].concat([...eCOUNT], DATA);
      let ePACKING = randHexArray(Math.ceil((eCommandLine.length + 2) / 16) * 16 - (eCommandLine.length + 2));
      eCommandLine = eCommandLine.concat(ePACKING);
      eCommandLine = eCommandLine.concat( CRC16(eCommandLine) );

      let eDATA = [...this.aesEncryption.encrypt(eCommandLine)];
			
      DATA = [STEX].concat(eDATA);
      LENGTH = DATA.length;
    }

    let tmp = [SEQ_SLAVE_ID].concat(LENGTH, DATA);
    let comandLine = Buffer.from([STX].concat(tmp, CRC16(tmp)).join(',').replace(/,127/g, ',127,127').split(','));

    if(this.debug)
      console.log('COM <-', chalk.cyan(comandLine.toString('hex')), chalk.green(this.currentCommand), this.count);

    return comandLine;
  }

  exec(command, args = []) {
    command = command.toUpperCase();
    if(commandList[command] == undefined)
      throw new Error("command not found");

    this.currentCommand = command;
    let buffer = Buffer.from(this.getPacket(command, args));

    return new Promise((resolve) => {
      this.port.write(buffer, () => {
        this.port.drain();

        if(command == 'SYNC')
          this.sequence = 0x80;
      });
      resolve(this.newEvent(command));
    })
      .then(res => {
        return res.status == 'TIMEOUT' ? this.exec(command, args) : res;
      });

  }

  newEvent(command){
    return new Promise((resolve) => {
      let timeout = true;
      eventEmitter.once(command, buffer => {
        timeout = false;
        if(Buffer.isBuffer(buffer)){
          resolve(this.parsePacket(buffer));
        } else if(buffer == 'TIMEOUT'){
          if(this.debug)
            console.log(chalk.red('TIMEOUT ' + command));

          resolve({
            success: false,
            status: 'TIMEOUT',
            command: this.currentCommand,
            info: {}
          });
        }
      });

      setTimeout(() => {
        if(timeout){
          eventEmitter.emit(this.currentCommand, 'TIMEOUT');
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
    if(buffer[0] == 0x7F){
      buffer = buffer.slice(1);
      let DATA = buffer.slice(2, buffer[1] + 2);
      let CRC = CRC16(buffer.slice(0, buffer[1] + 2));

      if(CRC[0] != buffer[buffer.length-2] || CRC[1] != buffer[buffer.length-1]) {
        return { success: false, error: 'Wrong CRC16' };
      } else {
        if(this.keys.key != null && DATA[0] == 0x7E){
          DATA = this.aesEncryption.decrypt(Buffer.from(DATA.slice(1)));
          if(this.debug)
            console.log('Decrypted:', chalk.red(Buffer.from(DATA).toString('hex')));
          let eLENGTH = DATA[0];
          let eCOUNT = Buffer.from(DATA.slice(1, 5)).readInt32LE();
          DATA = DATA.slice(5, eLENGTH+5);
          this.count = eCOUNT;
        }

        let parsedData = parseData(DATA, this.currentCommand, this.protocol_version);

        if(this.debug){
          console.log(parsedData);
        }

        if(this.currentCommand == 'REQUEST_KEY_EXCHANGE') {
          this.createHostEncryptionKeys(parsedData.info.key);
        } else if(this.currentCommand == 'SETUP_REQUEST'){
          this.protocol_version = parsedData.info.protocol_version;
        }

        return parsedData;
      }
    } else {
      return { success: false, error: 'Unknown response' };
    }
  }
  createHostEncryptionKeys(data) {
    if (this.keys.key == null) {
      this.keys.slaveIntKey = bigInt(Int64LE(data).toString());
      this.keys.key = this.keys.slaveIntKey.pow(this.keys.hostRandom).mod(this.keys.modulusKey);
      this.encryptKey = Int64LE(this.keys.fixedKey, 16).buffer.concat(Int64LE(this.keys.key).buffer);
      this.aesEncryption = new aesjs.ModeOfOperation.ecb(Buffer.from(this.encryptKey), null, 0);
      this.count = 0;
      if(this.debug){
        console.log('AES encrypt key:', chalk.red('0x'+Buffer.from(this.encryptKey).toString('hex')) );
        console.log('');
        console.log(this.keys);
        console.log('');
      }
    }
  }

  enable(){
    return this.command('ENABLE')
      .then(res => {
        if(res.status == 'OK'){
          this.enabled = true;
          this.poll(true);
        }
        return res;
      });
  }

  disable(){
    return this.command('DISABLE')
      .then(res => {
        if(res.status == 'OK'){
          this.enabled = false;
          this.poll(false)
            .then(() => {
              this.emit('DISABLED');
            });
        }
        return res;
      });
  }

  command(command, args){
    if(this.enabled){
      let result = null;

      return this.poll(false)
        .then(() => this.exec(command, argsToByte(command, args, this.protocol_version)))
        .then(res => {
          result = res;
          return this.poll(true);
        })
        .then(() => result);
    } else {
      return this.exec(command, argsToByte(command, args, this.protocol_version));
    }
		
  }

  poll(status = true){
    if(status){
      this.polling = true;
      return this.exec('POLL')
        .then(result => {
          if(result.info && result.info.code){
            this.emit(result.info.name, result.info);
					
            if(result.info.name == 'DISABLED'){
              this.poll(false);
            }
          }

          if(this.polling){
            this.poll();
          } else {
            eventEmitter.emit('POLL_STOP');
          }
          return;
        });
    } else {
      if(this.polling != false){
        this.polling = false;
        return new Promise((resolve) => {
          eventEmitter.once('POLL_STOP', () => {
            resolve();
          });
        });
      } else {
        return new Promise((resolve) => { resolve(); });
      }
    }
  }
};
