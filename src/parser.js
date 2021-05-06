const Debug = require('debug');
const { Transform } = require('stream');
const debug = Debug('essp:parser');
const { CRC16 } = require('./utils');

const PACKET_STX = 0;
const PACKET_SEQ_SLAVE_ID = 1;
const PACKET_LENGTH = 2;
const PACKET_DATA = 3;
const PACKET_CRCL = 4;
const PACKET_CRCH = 5;

const packetTemplate = {
  stx: 0,
  seqSlaveId: 0,
  length: 0,
  data: null,
  crcl: 0,
  crch: 0
};

class ESSPProtocolParser extends Transform {
  constructor(options) {
    const { id, other } = options;
    super({
      ...other,
      objectMode: true
    });

    this.id = id || 0x00;
    this.buffer = Buffer.alloc(0);
    this.packet = { ...packetTemplate };
    this.dataPosition = 0;
    this.packetStartFound = false;
    this.state = PACKET_STX;
    this.prevByte = null;
  }

  _transform(chunk, encoding, cb) {
    const data = Buffer.concat([this.buffer, chunk]);

    for (const [i, byte] of data.entries()) {
      if (this.packetStartFound) {
        // Unstuffing bytes
        if (this.prevByte === 0x7F && byte === 0x7F) {
          debug('Skipped stuffed byte');
          this.prevByte = null; // in case more then 2 of 0x7F in a row are stuffed
          continue;
        }

        switch (this.state) {
          case PACKET_SEQ_SLAVE_ID: {
            const seqId = byte & 0x7F;
            if (seqId === this.id) {
              this.packet.seqSlaveId = byte;
              this.state = PACKET_LENGTH;
            } else {
              debug(`Unknown byte "${byte}" received at state "${this.state}"`);
              this.resetState();
            }
            break;
          }

          case PACKET_LENGTH:
            this.packet.length = byte;
            this.state = PACKET_DATA;
            break;

          case PACKET_DATA:
            if (this.packet.data === null) {
              this.packet.data = Buffer.alloc(this.packet.length);
              this.dataPosition = 0;
            }

            this.packet.data[this.dataPosition] = byte;
            this.dataPosition += 1;

            if (this.dataPosition >= this.packet.length) {
              this.state = PACKET_CRCL;
            }
            break;

          case PACKET_CRCL:
            this.packet.crcl = byte;
            this.state = PACKET_CRCH;
            break;

          case PACKET_CRCH: {
            const [crcl, crch] = CRC16([this.packet.seqSlaveId, this.packet.length, ...this.packet.data]);
            this.packet.crch = byte;

            let increment = 1;
            if (this.packet.crcl === crcl && this.packet.crch === crch) {
              this.push(Buffer.from([this.packet.stx, this.packet.seqSlaveId, this.packet.length, ...this.packet.data, this.packet.crcl, this.packet.crch]));
              if (crch === 0x7F) increment = 2; // Fix for byte stuffing
            } else {
              debug(`Checksum "${[crcl, crch]}" doesn't match received CheckSum "${[this.packet.crcl, this.packet.crch]}"`);
            }

            this.resetState();
            this.buffer = data.slice(i + increment);
            break;
          }

          default:
            debug(`Should never reach this state "${this.state}`);
        }
      } else if (byte === 0x7F) {
        this.packetStartFound = true;
        this.packet.stx = byte;
        this.state = PACKET_SEQ_SLAVE_ID;
      } else {
        debug(`Unknown byte "${byte}" received at state "${this.state}"`);
      }

      this.prevByte = byte;
    }

    cb();
  }

  resetState() {
    this.state = PACKET_STX;
    this.packet = { ...packetTemplate };
    this.dataPosition = 0;
    this.packetStartFound = false;
    this.buffer = Buffer.alloc(0);
    this.prevByte = null;
  }

  _flush(cb) {
    this.resetState();
    cb();
  }
}

module.exports = ESSPProtocolParser;
