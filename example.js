const SspLib = require('./src/index');
let channels = [{ value: 0, country_code: 'XXX' }];

let serialPortConfig = {
  baudrate: 9600, // default: 9600
  databits: 8, // default: 8
  stopbits: 2, // default: 2
  parity: 'none' // default: 'none'
};

let eSSP = new SspLib({
  id: 0x00,
  debug: false, // default: false
  timeout: 5000, // default: 3000
  encryptAllCommand: true, // default: true
  fixedKey: '0000000000000000' // default: '0123456701234567'
});


eSSP.on('OPEN', () => {
  console.log('Port opened!');
});

eSSP.on('CLOSE', () => {
  console.log('Port closed!');
});

eSSP.on('READ_NOTE', result => {
  console.log('READ_NOTE', result);
  console.log(channels[result.channel]);

  if (channels[result.channel].value === 500) {
    eSSP.command('REJECT_BANKNOTE');
  }
  if (channels[result.channel].value === 1000) {
    eSSP.command('PAYOUT_AMOUNT', {
      amount: 10000,
      country_code: 'RUB',
      test: false
    });
  }
});

eSSP.on('NOTE_REJECTED', result => {
  console.log('NOTE_REJECTED', result);

  eSSP.command('LAST_REJECT_CODE')
    .then(result => {
      console.log(result);
    });
});


eSSP.open('COM1', serialPortConfig)
  .then(() => eSSP.command('SYNC'))
  .then(() => eSSP.command('HOST_PROTOCOL_VERSION', { version: 6 }))
  .then(() => eSSP.initEncryption())
  .then(() => eSSP.command('GET_SERIAL_NUMBER'))
  .then(result => {
    console.log('SERIAL NUMBER:', result.info.serial_number);
    return;
  })
  .then(() => eSSP.command('SETUP_REQUEST'))
  .then(result => {
    for (let i = 0; i < result.info.channel_value.length; i++) {
      channels[result.info.channel_value[i]] = {
        value: result.info.expanded_channel_value[i],
        country_code: result.info.expanded_channel_country_code[i]
      };
    }
    return;
  })
  .then(() => eSSP.command('SET_DENOMINATION_ROUTE', { route: 'payout', value: 10000, country_code: 'RUB' }))
  .then(() => eSSP.enable())
  .then(() => {
    console.log('GO!!!');
  })
  .catch(error => {
    console.log(error);
  });
