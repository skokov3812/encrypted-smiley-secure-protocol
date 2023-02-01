module.exports = {
  RESET: {
    code: 1,
    encrypted: false,
    args: false,
    device: ['NV9USB', 'NV10USB', 'BV20', 'BV50', 'BV100', 'NV200', 'SMART Hopper', 'SMART Payout', 'NV11'],
    description: 'Command to instruct the slave to perform a hard reset at any point within its operational status.',
  },
  SET_CHANNEL_INHIBITS: {
    code: 2,
    encrypted: false,
    args: true,
    device: ['NV9USB', 'NV10USB', 'BV20', 'BV50', 'BV100', 'NV200', 'NV11'],
    description:
      'Variable length command, used to control which channels are enabled. The command byte is followed by 2 data bytes, these bytes are combined to create the INHIBIT_REGISTER, each bit represents the state of a channel (LSB= channel 1, 1=enabled, 0=disabled). At power up all channels are inhibited and the validator is disabled.',
  },
  DISPLAY_ON: {
    code: 3,
    encrypted: false,
    args: false,
    device: ['NV9USB', 'NV10USB', 'NV200', 'NV11'],
    description:
      'Use this command to re-enabled a disabled bezel illumination function (using the Display Off command). The Bezel will only be illuminated when the device is enabled even if this command is sent.',
  },
  DISPLAY_OFF: {
    code: 4,
    encrypted: false,
    args: false,
    device: ['NV9USB', 'NV10USB', 'NV200', 'NV11'],
    description: 'This command will force the device bezel to not be illuminated even if the device is enabled.',
  },
  SETUP_REQUEST: {
    code: 5,
    encrypted: false,
    args: false,
    device: ['NV9USB', 'NV10USB', 'BV20', 'BV50', 'BV100', 'NV200', 'SMART Hopper', 'NV11'],
    description:
      'The device responds with an array of data the format of which depends upon the device, the dataset installed and the protocol version set.',
  },
  HOST_PROTOCOL_VERSION: {
    code: 6,
    encrypted: false,
    args: true,
    device: ['NV9USB', 'NV10USB', 'BV20', 'BV50', 'BV100', 'NV200', 'SMART Hopper', 'SMART Payout', 'NV11'],
    description:
      'Dual byte command, the first byte is the command; the second byte is the version of the protocol that is implemented on the host. So for example, to enable events on BNV to protocol version 6, send 06, 06. The device will respond with OK if the device supports version 6, or FAIL (0xF8) if it does not.',
    example: "SSP.command('HOST_PROTOCOL_VERSION', {version: 6})",
  },
  POLL: {
    code: 7,
    encrypted: false,
    args: false,
    device: ['NV9USB', 'NV10USB', 'BV20', 'BV50', 'BV100', 'NV200', 'SMART Hopper', 'SMART Payout', 'NV11'],
    description:
      'The poll command returns the list of events that have occurred within the device since the last poll. The format of the events depends on the protocol version set within the device. Note that more than one event can occur within a poll response so ensure that the full return array is scanned.',
  },
  REJECT_BANKNOTE: {
    code: 8,
    encrypted: false,
    args: false,
    device: ['NV9USB', 'NV10USB', 'BV20', 'BV50', 'BV100', 'NV200', 'NV11'],
    description:
      'A command to reject a note held in escrow in the banknote validator. For devices apart form NV11; if there is no note in escrow to be rejected, the device replies with COMMAND CANNOT BE PROCESSED (0xF5).',
  },
  DISABLE: {
    code: 9,
    encrypted: false,
    args: false,
    device: ['NV9USB', 'NV10USB', 'BV20', 'BV50', 'BV100', 'NV200', 'SMART Hopper', 'NV11'],
    description:
      'The peripheral will switch to its disabled state, it will not execute any more commands or perform any actions until enabled, any poll commands will report disabled.',
  },
  ENABLE: {
    code: 10,
    encrypted: false,
    args: false,
    device: ['NV9USB', 'NV10USB', 'BV20', 'BV50', 'BV100', 'NV200', 'SMART Hopper', 'NV11'],
    description: 'Send this command to enable a disabled device.',
  },
  GET_SERIAL_NUMBER: {
    code: 12,
    encrypted: false,
    args: false,
    device: ['NV9USB', 'NV10USB', 'BV20', 'BV50', 'BV100', 'NV200', 'SMART Hopper', 'SMART Payout', 'NV11'],
    description: 'This command returns a 4-byte big endian array representing the unique factory programmed serial number of the device.',
  },
  UNIT_DATA: {
    code: 13,
    encrypted: false,
    args: false,
    device: ['NV9USB', 'NV10USB', 'BV20', 'BV50', 'BV100', 'NV200', 'NV11'],
    description:
      'Returns, Unit type (1 Byte integer), Firmware Version (4 bytes ASCII string), Country Code (3 Bytes ASCII string), Value Multiplier (3 bytes integer), Protocol Version (1 Byte, integer)',
  },
  CHANNEL_VALUE_REQUEST: {
    code: 14,
    encrypted: false,
    args: false,
    device: ['NV9USB', 'NV10USB', 'BV20', 'BV50', 'BV100', 'NV200', 'NV11'],
    description:
      'Returns channel value data for a banknote validator. Formatted as: byte 0 - the highest channel used the a value byte representing each of the denomination values. The real value is obtained by multiplying by the value multiplier. If the validator is greater than or equal to protocol version 6 then the channel values response will be given as: Highest Channel, Value Per Channel (0 for expanded values),3 Byte ASCI country code for each channel, 4- byte Full channel Value for each channel.',
  },
  CHANNEL_SECURITY_DATA: {
    code: 15,
    encrypted: false,
    args: false,
    device: ['NV9USB', 'NV10USB', 'BV20', 'BV50', 'BV100', 'NV200', 'NV11'],
    description:
      'Command which returns a number of channels byte (the highest channel used) and then 1 to n bytes which give the security of each channel up to the highest one, a zero indicates that the channel is not implemented. (1 = low, 2 = std, 3 = high, 4 = inhibited).',
  },
  CHANNEL_RE_TEACH_DATA: {
    code: 16,
    encrypted: false,
    args: false,
    device: ['NV9USB', 'NV10USB', 'BV20', 'BV50', 'BV100', 'NV200', 'NV11'],
    description:
      'This is a vestigial command and may be deprecated in future versions. Do not use. If it is supported in a device it will return all zeros.',
  },
  SYNC: {
    code: 17,
    encrypted: false,
    args: false,
    device: ['NV9USB', 'NV10USB', 'BV20', 'BV50', 'BV100', 'NV200', 'SMART Hopper', 'SMART Payout', 'NV11'],
    description:
      'A command to establish communications with a slave device. A Sync command resets the seq bit of the packet so that the slave device expects the next seq bit to be 0. The host then sets its next seq bit to 0 and the seq sequence is synchronised.',
  },
  LAST_REJECT_CODE: {
    code: 23,
    encrypted: false,
    args: false,
    device: ['NV9USB', 'NV10USB', 'BV20', 'BV50', 'BV100', 'NV200', 'NV11'],
    description:
      'Returns a single byte that indicates the reason for the last banknote reject. The codes are shown in the table below. Specifics of note validation are not shown to protect integrity of manufacturers security.',
  },
  HOLD: {
    code: 24,
    encrypted: false,
    args: false,
    device: ['NV9USB', 'NV10USB', 'BV20', 'BV50', 'BV100', 'NV200', 'NV11'],
    description:
      'This command may be sent to BNV when Note Read has changed from 0 to >0 (valid note seen) if the user does not wish to accept the note with the next command. This command will also reset the 10-second time-out period after which a note held would be rejected automatically, so it should be sent before this time-out if an escrow function is required. If there is no note in escrow to hold, the device will reply with COMMAND CANNOT BE PROCESSED (0xF5)',
  },
  GET_FIRMWARE_VERSION: {
    code: 32,
    encrypted: false,
    args: false,
    device: ['NV9USB', 'NV10USB', 'BV20', 'BV50', 'BV100', 'NV200', 'SMART Hopper', 'NV11'],
    description: 'Returns the full firmware version ascii data array for this device.',
  },
  GET_DATASET_VERSION: {
    code: 33,
    encrypted: false,
    args: false,
    device: ['NV9USB', 'NV10USB', 'BV20', 'BV50', 'BV100', 'NV200', 'NV11'],
    description: 'Returns a string of ascii codes giving the full dataset version of the device.',
  },
  GET_ALL_LEVELS: {
    code: 34,
    encrypted: false,
    args: false,
    device: ['SMART Hopper', 'SMART Payout'],
    description:
      'Use this command to return all the stored levels of denominations in the device (including those at zero level). This gives a faster response than sending each individual denomination level request.',
  },
  GET_BAR_CODE_READER_CONFIGURATION: {
    code: 35,
    encrypted: false,
    args: false,
    device: ['NV9USB', 'NV200'],
    description: 'Returns the set-up data for the device bar code readers.',
  },
  SET_BAR_CODE_CONFIGURATION: {
    code: 36,
    encrypted: false,
    args: true,
    device: ['NV9USB', 'NV200'],
    description:
      'This command allows the host to set-up the bar code reader(s) configuration on the device. 3 bytes of data define the configuration. In this example we enable both readers with format interleaved 1 of 5 for 18 characters.',
    example: "SSP.command('SET_BAR_CODE_CONFIGURATION', {enable: 'top', numChar: 6}) //enable: none|top|bottom|both   numChar(min:6 max:24)",
  },
  GET_BAR_CODE_INHIBIT_STATUS: {
    code: 37,
    encrypted: false,
    args: false,
    device: ['NV9USB', 'NV200'],
    description: 'Command to return the current bar code/currency inhibit status.',
  },
  SET_BAR_CODE_INHIBIT_STATUS: {
    code: 38,
    encrypted: false,
    args: true,
    device: ['NV9USB', 'NV200'],
    description:
      'Sets up the bar code inhibit status register. A single data byte representing a bit register is sent. Bit 0 is Currency read enable (0 = enable, 1= disable) Bit 1 is the Bar code enable (0 = enable, 1 = disable). All other bits are not used and set to 1. This example shows a request to a device to have currency enabled, bar code enabled.',
    example: "SSP.command('SET_BAR_CODE_INHIBIT_STATUS', {currencyRead: true, barCode: true})",
  },
  GET_BAR_CODE_DATA: {
    code: 39,
    encrypted: false,
    args: false,
    device: ['NV9USB', 'NV200'],
    description:
      'Command to obtain last valid bar code ticket data, send in response to a Bar Code Ticket Validated event. This command will return a variable length data steam, a generic response (OK) followed by a status byte, a bar code data length byte, then a stream of bytes of the ticket data in ASCII.',
  },
  SET_REFILL_MODE: {
    code: 48,
    encrypted: false,
    args: true,
    device: ['SMART Payout'],
    description:
      'A command sequence to set or reset the facility for the payout to reject notes that are routed to the payout store but the firmware determines that they are un-suitable for storage. In default mode, they would be rerouted to the stacker. In refill mode they will be rejected from the front of the NV200.',
  },
  PAYOUT_AMOUNT: {
    code: 51,
    encrypted: true,
    args: true,
    device: ['SMART Hopper', 'SMART Payout'],
    description:
      'A command to set the monetary value to be paid by the payout unit. Using protocol version 6, the host also sends a pre-test option byte (TEST_PAYOUT_AMOUT 0x19, PAYOUT_AMOUNT 0x58), which will determine if the command amount is tested or paid out. This is useful for multi-payout systems so that the ability to pay a split down amount can be tested before committing to actual payout.',
    example: "SSP.command('PAYOUT_AMOUNT', {amount: 100, country_code: 'RUB', test: false})",
  },
  SET_DENOMINATION_LEVEL: {
    code: 52,
    encrypted: false,
    args: true,
    device: ['SMART Hopper'],
    description:
      'A command to increment the level of coins of a denomination stored in the hopper. The command is formatted with the command byte first, amount of coins to add as a 2-byte little endian, the value of coin as 2-byte little endian and (if using protocol version 6) the country code of the coin as 3 byte ASCII. The level of coins for a denomination can be set to zero by sending a zero level for that value. Note that protocol 6 version commands have been expanded to use a 4-byte coin value. The command data is formatted as byte 0 and byte 1 give the number of coins to add. In protocol version 5, the denomination is then sent as a two byte value. In protocol version greater than 5, the denomination is sent as 4 byte value plus 3 bytes ascii country code. In this example we want to increase the level of .50c coin by 20 using protocol version 5.',
  },
  GET_DENOMINATION_LEVEL: {
    code: 53,
    encrypted: false,
    args: true,
    device: ['SMART Hopper', 'SMART Payout'],
    description:
      'This command returns the level of a denomination stored in a payout device as a 2 byte value. In protocol versions greater or equal to 6, the host adds a 3 byte ascii country code to give mulit-currency functionality. Send the requested denomination to find its level. In this case a request to find the amount of 0.10c coins in protocol version 5.',
    example: "SSP.command('GET_DENOMINATION_LEVEL', {amount: 100, country_code: 'RUB'})",
  },
  COMMUNICATION_PASS_THROUGH: {
    code: 55,
    encrypted: false,
    args: false,
    device: ['SMART Hopper'],
    description:
      'Used with SMART Hopper only. This command sets USB pass through mode. SMART Hopper then works only as USB to serial converter to allow direct communication (firmware/dataset update) with devices connected to SMART Hopper UARTS. This command was implemented in firmware versions greater or equal to 6.16.',
  },
  HALT_PAYOUT: {
    code: 56,
    encrypted: true,
    args: false,
    device: ['SMART Hopper', 'SMART Payout'],
    description:
      'A command to stop the execution of an existing payout. The device will stop payout at the earliest convenient place and generate a Halted event giving the value paid up to that point.',
  },
  SET_DENOMINATION_ROUTE: {
    code: 59,
    encrypted: false,
    args: true,
    device: ['SMART Hopper', 'SMART Payout', 'NV11'],
    description:
      'This command will configure the denomination to be either routed to the cashbox on detection or stored to be made available for later possible payout.',
    example: "SSP.command('SET_DENOMINATION_ROUTE', {route: 'payout', value: 10000, country_code: 'RUB'}) //route: payout|cashbox",
  },
  GET_DENOMINATION_ROUTE: {
    code: 60,
    encrypted: true,
    args: true,
    device: ['SMART Hopper', 'SMART Payout', 'NV11'],
    description:
      'This command allows the host to determine the route of a denomination. Note protocol versions: For protocol versions less than 6 a value only data array is sent. For protocol version greater or equal to 6, a 3 byte country code is also sent to allow multi-currency functionality to the payout. Please note that there exists a difference in the data format between SMART Payout and SMART Hopper for protocol versions less than 6. In these protocol versions the value was determined by a 2 byte array rather than 4 byte array For NV11 devices the host must send the required note value in the same form that the device is set to report by (see Set Value Reporting Type command).',
  },
  FLOAT_AMOUNT: {
    code: 61,
    encrypted: true,
    args: true,
    device: ['SMART Hopper', 'SMART Payout'],
    description:
      'A command to float the hopper unit to leave a requested value of money, with a requested minimum possible payout level. All monies not required to meet float value are routed to cashbox. Using protocol version 6, the host also sends a pre-test option byte (TEST_FLOAT_AMOUT 0x19, FLOAT_AMOUNT 0x58), which will determine if the command amount is tested or floated. This is useful for multi-payout systems so that the ability to pay a split down amount can be tested before committing to actual float.',
    example: "SSP.command('FLOAT_AMOUNT', {min_possible_payout: 10, amount: 100, country_code: 'RUB', test: false})",
  },
  GET_MINIMUM_PAYOUT: {
    code: 62,
    encrypted: false,
    args: false,
    device: ['SMART Hopper', 'SMART Payout'],
    description: 'A command to request the minimum possible payout amount that this device can provide',
  },
  EMPTY_ALL: {
    code: 63,
    encrypted: true,
    args: false,
    device: ['SMART Hopper', 'SMART Payout', 'NV11'],
    description:
      'This command will direct all stored monies to the cash box without reporting any value and reset all the stored counters to zero. See Smart Empty command to record the value emptied.',
  },
  SET_COIN_MECH_INHIBITS: {
    code: 64,
    encrypted: false,
    args: true,
    device: ['SMART Hopper'],
    description: 'This command is used to enable or disable acceptance of individual coin values from a coin acceptor connected to the hopper.',
    example: "SSP.command('SET_COIN_MECH_INHIBITS', {amount: 100, inhibited: true})",
  },
  GET_NOTE_POSITIONS: {
    code: 65,
    encrypted: false,
    args: false,
    device: ['NV11'],
    description:
      'This command will return the number of notes in the Note Float and the value in each position. The way the value is reported is specified by the Set Reporting Type command. The value can be reported by its value or by the channel number of the bill validator. The first note in the table is the first note that was paid into the Note Float. The Note Float is a LIFO system, so the note that is last in the table is the only one that is available to be paid out or moved into the stacker.',
  },
  PAYOUT_NOTE: {
    code: 66,
    encrypted: false,
    args: false,
    device: ['NV11'],
    description:
      'The Note Float will payout the last note that was stored. This is the note that is in the highest position in the table returned by the Get Note Positions Command. If the payout is possible the Note Float will reply with generic response OK. If the payout is not possible the reply will be generic response COMMAND CANNOT BE PROCESSED, followed by an error code shown in the table below',
  },
  STACK_NOTE: {
    code: 67,
    encrypted: false,
    args: false,
    device: ['NV11'],
    description:
      'The Note Float will stack the last note that was stored. This is the note that is in the highest position in the table returned by the Get Note Positions Command. If the stack operation is possible the Note Float will reply with generic response OK. If the stack is not possible the reply will be generic response command cannot be processed, followed by an error code as shown in the table.',
  },
  FLOAT_BY_DENOMINATION: {
    code: 68,
    encrypted: true,
    args: true,
    device: ['SMART Hopper', 'SMART Payout'],
    description:
      'A command to float (leave in device) the requested quantity of individual denominations. The quantities of denominations to leave are sent as a 2 byte little endian array; the money values as 4-byte little endian array and the country code as a 3-byte ASCII array. The host also adds an option byte to the end of the command array (TEST_PAYOUT_AMOUT 0x19 or PAYOUT_AMOUNT 0x58). This will allow a pre-test of the ability to float to the requested levels before actual float executes.',
    example:
      "SSP.command('FLOAT_BY_DENOMINATION', {value: [{number: 1, denomination: 100, country_code: 'RUB'}, {number: 1, denomination: 500, country_code: 'RUB'}], test: false})",
  },
  SET_VALUE_REPORTING_TYPE: {
    code: 69,
    encrypted: false,
    args: true,
    device: ['NV11'],
    description:
      'This will set the method of reporting values of notes. There are two options, by a four-byte value of the note or by the channel number of the value from the banknote validator. If the channel number is used then the actual value must be determined using the data from the Validator command Unit Data. The default operation is by 4-byte value. Send 0x00 to set Report by value, 0x01 to set Report By Channel.',
    example: "SSP.command('SET_VALUE_REPORTING_TYPE', {reportBy: 'channel'}) // reportBy: value|channel",
  },
  PAYOUT_BY_DENOMINATION: {
    code: 70,
    encrypted: true,
    args: true,
    device: ['SMART Hopper', 'SMART Payout'],
    description:
      'A command to payout the requested quantity of individual denominations. The quantities of denominations to pay are sent as a 2 byte little endian array; the money values as 4-byte little endian array and the country code as a 3-byte ASCII array. The host also adds an option byte to the end of the command array (TEST_PAYOUT_AMOUT 0x19 or PAYOUT_AMOUNT 0x58). This will allow a pre-test of the ability to payout the requested levels before actual payout executes.',
    example:
      "SSP.command('PAYOUT_BY_DENOMINATION', {value: [{number: 1, denomination: 100, country_code: 'RUB'}, {number: 1, denomination: 500, country_code: 'RUB'}], test: false})",
  },
  SET_COIN_MECH_GLOBAL_INHIBIT: {
    code: 73,
    encrypted: false,
    args: false,
    device: ['SMART Hopper'],
    description:
      'This command allows the host to enable/disable the attached coin mech in one command rather than by each individual value with previous firmware versions. Send this command and one Mode data byte: Data byte = 0x00 - mech disabled. Date byte = 0x01 - mech enabled.',
  },
  SET_GENERATOR: {
    code: 74,
    encrypted: false,
    args: true,
    device: ['NV9USB', 'NV10USB', 'BV20', 'BV50', 'BV100', 'NV200', 'SMART Hopper', 'SMART Payout', 'NV11'],
    description:
      'Eight data bytes are a 64 bit number representing the Generator this must be a 64bit prime number. The slave will reply with OK or PARAMETER_OUT_OF_RANGE if the number is not prime.',
  },
  SET_MODULUS: {
    code: 75,
    encrypted: false,
    args: true,
    device: ['NV9USB', 'NV10USB', 'BV20', 'BV50', 'BV100', 'NV200', 'SMART Hopper', 'SMART Payout', 'NV11'],
    description:
      'Eight data bytes are a 64 bit number representing the modulus this must be a 64 bit prime number. The slave will reply with OK or PARAMETER_OUT_OF_RANGE if the number is not prime.',
  },
  REQUEST_KEY_EXCHANGE: {
    code: 76,
    encrypted: false,
    args: true,
    device: ['NV9USB', 'NV10USB', 'BV20', 'BV50', 'BV100', 'NV200', 'SMART Hopper', 'SMART Payout', 'NV11'],
    description:
      'The eight data bytes are a 64 bit number representing the Host intermediate key. If the Generator and Modulus have been set the slave will calculate the reply with the generic response and eight data bytes representing the slave intermediate key. The host and slave will then calculate the key. If Generator and Modulus are not set then the slave will reply FAIL.',
  },
  SET_BAUD_RATE: {
    code: 77,
    encrypted: false,
    args: true,
    device: ['SMART Hopper', 'SMART Payout', 'NV11'],
    description:
      'This command has two data bytes to allow communication speed to be set on a device. The first byte is the speed to change to (see table below).',
    example: "SSP.command('SET_BAUD_RATE', {baudrate: 9600, reset_to_default_on_reset: true})",
  },
  GET_BUILD_REVISION: {
    code: 79,
    encrypted: false,
    args: false,
    device: ['NV200', 'SMART Hopper', 'SMART Payout', 'NV11'],
    description:
      'A command to return the build revision information of a device. The command returns 3 bytes of information representing the build of the product. Byte 0 is the product type, next two bytes make up the revision number(0-65536). For NV200 and NV9USB, the type byte is 0, for Note Float, byte is 3 and for SMART Payout the byte is 6.',
  },
  SET_HOPPER_OPTIONS: {
    code: 80,
    encrypted: false,
    args: false,
    device: ['SMART Hopper'],
    description:
      'The host can set the following options for the SMART Hopper. These options do not persist in memory and after a reset they will go to their default values. This command is valid only when using protocol version 6 or greater.',
  },
  GET_HOPPER_OPTIONS: {
    code: 81,
    encrypted: false,
    args: false,
    device: ['SMART Hopper'],
    description: 'This command returns 2 option register bytes described in Set Hopper Options command.',
  },
  SMART_EMPTY: {
    code: 82,
    encrypted: true,
    args: false,
    device: ['SMART Hopper', 'SMART Payout', 'NV11'],
    description:
      'Empties payout device of contents, maintaining a count of value emptied. The current total value emptied is given is response to a poll command. All coin counters will be set to 0 after running this command. Use Cashbox Payout Operation Data command to retrieve a breakdown of the denomination routed to the cashbox through this operation.',
  },
  CASHBOX_PAYOUT_OPERATION_DATA: {
    code: 83,
    encrypted: false,
    args: false,
    device: ['SMART Hopper', 'SMART Payout', 'NV11'],
    description:
      'Can be sent at the end of a SMART Empty, float or dispense operation. Returns the amount emptied to cashbox from the payout in the last dispense, float or empty command. The quantity of denominations in the response is sent as a 2 byte little endian array; the note values as 4-byte little endian array and the country code as a 3-byte ASCII array. Each denomination in the dataset will be reported, even if 0 coins of that denomination are emptied. As money is emptied from the device, the value is checked. An additional 4 bytes will be added to the response giving a count of object that could not be validated whilst performing the operation. The response is formatted as follows: byteParameter byte 0The number denominations (n) in this response (max 20) byte 1 to byte 1 + (9*n)The individual denomination level (see description below) byte 1 to byte 1 + (9*n) + 1 to byte 1 to byte 1 + (9*n) + 4 The number of un-validated objects moved. Individual level requests: byte 0 and byte 1 number of coins of this denomination moved to cashbox in operation byte 2 to byte 5 The denomination value byte 6 to byte 8 The ascii denomination country code',
  },
  CONFIGURE_BEZEL: {
    code: 84,
    encrypted: false,
    args: true,
    device: ['NV200'],
    description:
      'This command allows the host to configure a supported BNV bezel. If the bezel is not supported the command will return generic response COMMAND NOT KNOWN 0xF2.',
    example: "SSP.command('CONFIGURE_BEZEL', {RGB: '0000ff', volatile: true})",
  },
  POLL_WITH_ACK: {
    code: 86,
    encrypted: true,
    args: false,
    device: ['NV9USB', 'NV10USB', 'BV20', 'BV50', 'BV100', 'NV200', 'SMART Hopper', 'NV11'],
    description:
      'A command that behaves in the same way as the Poll command but with this command, the specified events (see table below) will need to be acknowledged by the host using the EVENT ACK command (0x56). The events will repeat until the EVENT ACK command is sent and the BNV will not allow any further note actions until the event has been cleared by the EVENT ACK command. If this command is not supported by the slave device, then generic response 0xF2 will be returned and standard poll command (0x07) will have to be used.',
  },
  EVENT_ACK: {
    code: 87,
    encrypted: true,
    args: false,
    device: ['NV9USB', 'NV10USB', 'BV20', 'BV50', 'BV100', 'NV200', 'SMART Hopper', 'NV11'],
    description: 'This command will clear a repeating Poll ACK response and allow further note operations.',
  },
  GET_COUNTERS: {
    code: 88,
    encrypted: false,
    args: false,
    device: ['NV9USB', 'SMART Payout', 'NV11'],
    description:
      'A command to return a global note activity counter set for the slave device. The response is formatted as in the table below and the counter values are persistent in memory after a power down- power up cycle. These counters are note set independent and will wrap to zero and begin again if their maximum value is reached. Each counter is made up of 4 bytes of data giving a max value of 4294967295.',
  },
  RESET_COUNTERS: {
    code: 89,
    encrypted: false,
    args: false,
    device: ['NV9USB', 'SMART Payout', 'NV11'],
    description: 'Resets the note activity counters described in Get Counters command to all zero values.',
  },
  COIN_MECH_OPTIONS: {
    code: 90,
    encrypted: false,
    args: true,
    device: ['SMART Hopper'],
    description:
      'The host can set the following options for the SMART Hopper. These options do not persist in memory and after a reset they will go to their default values.',
  },
  DISABLE_PAYOUT_DEVICE: {
    code: 91,
    encrypted: false,
    args: false,
    device: ['SMART Payout', 'NV11'],
    description: 'All accepted notes will be routed to the stacker and payout commands will not be accepted.',
  },
  ENABLE_PAYOUT_DEVICE: {
    code: 92,
    encrypted: false,
    args: true,
    device: ['SMART Payout', 'NV11'],
    description:
      'A command to enable the attached payout device for storing/paying out notes. A successful enable will return OK, If there is a problem the reply will be generic response COMMAND_CANNOT_BE_PROCESSED, followed by an error code.',
    example:
      "SSP.command('ENABLE_PAYOUT_DEVICE', {REQUIRE_FULL_STARTUP: true, OPTIMISE_FOR_PAYIN_SPEED: true}) //nv11 args: GIVE_VALUE_ON_STORED|NO_HOLD_NOTE_ON_PAYOUT    Payout args: REQUIRE_FULL_STARTUP|OPTIMISE_FOR_PAYIN_SPEED",
  },
  SET_FIXED_ENCRYPTION_KEY: {
    code: 96,
    encrypted: true,
    args: false,
    device: ['SMART Hopper', 'SMART Payout', 'NV11'],
    description:
      'A command to allow the host to change the fixed part of the eSSP key. The eight data bytes are a 64 bit number representing the fixed part of the key. This command must be encrypted.',
    example: "SSP.command('SET_FIXED_ENCRYPTION_KEY', { fixedKey: '0000000000000000' })",
  },
  RESET_FIXED_ENCRYPTION_KEY: {
    code: 97,
    encrypted: false,
    args: false,
    device: ['SMART Hopper', 'SMART Payout', 'NV11'],
    description:
      'Resets the fixed encryption key to the device default. The device may have extra security requirements before it will accept this command (e.g. The Hopper must be empty) if these requirements are not met, the device will reply with Command Cannot be Processed. If successful, the device will reply OK, then reset. When it starts up the fixed key will be the default.',
  },
}
