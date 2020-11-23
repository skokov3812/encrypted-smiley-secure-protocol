# encrypted-smiley-secure-protocol
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fskokov3812%2Fencrypted-smiley-secure-protocol.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fskokov3812%2Fencrypted-smiley-secure-protocol?ref=badge_shield)

Node.JS library Encrypted Smiley ® Secure Protocol (eSSP, SSP)

**Supported devices:** NV9USB, NV10USB, BV20, BV50, BV100, NV200, SMART Hopper, SMART Payout, NV11


```js
const sspLib = require('encrypted-smiley-secure-protocol');

let eSSP = new sspLib({
    id: 0x00,
    debug: false,
    timeout: 3000,
    fixedKey: '0123456701234567'
});
```

## Methods
All methods use Promise
- ```eSSP.open('COM1')``` - Connect device
- ```eSSP.close()``` - Disconnect device
- ```eSSP.initEncryption()``` - Initializing Diffie-Hellman key exchange and enable encryption
- ```eSSP.enable()``` - Enable device and start listen events
- ```eSSP.disable()``` - Disable device and stop listen events
- ```eSSP.command('COMMAND_NAME')``` - Execute command and get answer


## Command
```js
eSSP.command('GET_SERIAL_NUMBER')
.then(result => {
    console.log('Serial number:', result.info.serial_number)
    return;
})
```
See [all supported commands](#supported-commands)


## Event
```js
eSSP.on('READ_NOTE', result => {
    console.log(result)
})
```
See [all supported events](#supported-events)


## Example
```js
const sspLib = require('encrypted-smiley-secure-protocol');

let eSSP = new sspLib({
    id: 0,
    debug: false,
    timeout: 3000,
    fixedKey: '0123456701234567'
});

eSSP.on('OPEN', () => {
    console.log('open');

    eSSP.command('SYNC')
    .then(() => eSSP.command('HOST_PROTOCOL_VERSION', { version: 6 }))
    .then(() => eSSP.initEncryption())
    .then(() => eSSP.command('GET_SERIAL_NUMBER'))
    .then(result => {
        console.log('SERIAL NUMBER:', result.info.serial_number)
        return;
    })
    .then(() => eSSP.enable())
    .then(result => {
        if(result.status == 'OK'){
            console.log('Device is active')
        }
		return;
    })
})

eSSP.on('NOTE_REJECTED', result => {
    console.log('NOTE_REJECTED', result);

    eSSP.command('LAST_REJECT_CODE')
    .then(result => {
        console.log(result)
    })
})

eSSP.open('COM1');
```

### Supported Commands:

Command name						|	Option Required	|	Encryption Required	|	Description
------------------------------------|-------------------|-----------------------|-------------------
RESET								|			|	optional	|	Command to instruct the slave to perform a hard reset at any point within its operational status.
[SET_CHANNEL_INHIBITS](#SET_CHANNEL_INHIBITS)					|	**yes**	|	optional	|	Variable length command, used to control which channels are enabled.
DISPLAY_ON							|			|	optional	|	Use this command to re-enabled a disabled bezel illumination function (using the Display Off command).
DISPLAY_OFF							|			|	optional	|	This command will force the device bezel to not be illuminated even if the device is enabled.
SETUP_REQUEST						| 			|	optional	|	The device responds with an array of data the format of which depends upon the device, the dataset installed and the protocol version set.
[HOST_PROTOCOL_VERSION](#HOST_PROTOCOL_VERSION)					|	**yes**	|	optional	|	Set version of the protocol that is implemented on the host
POLL								|			|	optional	|	The poll command returns the list of events that have occurred within the device since the last poll.
REJECT_BANKNOTE						|			|	optional	|	A command to reject a note held in escrow in the banknote validator.
DISABLE								|			|	optional	|	The peripheral will switch to its disabled state, it will not execute any more commands or perform any actions until enabled, any poll commands will report disabled.
ENABLE								|			|	optional	|	Send this command to enable a disabled device.
GET_SERIAL_NUMBER					|			|	optional	|	This command returns the unique factory programmed serial number of the device.
UNIT_DATA							|			|	optional	|	Returns: Unit type, Firmware Version, Country Code, Value Multiplier, Protocol Version.
CHANNEL_VALUE_REQUEST				|			|	optional	|	Returns channel value data for a banknote validator.
CHANNEL_SECURITY_DATA				|			|	optional	|	The command returns the security settings of the channels
CHANNEL_RE_TEACH_DATA				|			|	optional	|	This is a vestigial command and may be deprecated in future versions.
SYNC								|			|	optional	|	A command to establish communications with a slave device.
LAST_REJECT_CODE					|			|	optional	|	Returns a single byte that indicates the reason for the last banknote reject.
HOLD								|			|	optional	|	This command may be sent to BNV when Note Read has changed from 0 to >0 (valid note seen) if the user does not wish to accept the note with the next command. This command will also reset the 10-second time-out period after which a note held would be rejected automatically, so it should be sent before this time-out if an escrow function is required.
GET_FIRMWARE_VERSION				|			|	optional	|	Returns the firmware version
GET_DATASET_VERSION					|			|	optional	|	Returns the dataset version of the device.
GET_ALL_LEVELS						|			|	optional	|	Use this command to return all the stored levels of denominations in the device (including those at zero level).
GET_BAR_CODE_READER_CONFIGURATION	|			|	optional	|	Returns the set-up data for the device bar code readers.
[SET_BAR_CODE_CONFIGURATION](#SET_BAR_CODE_CONFIGURATION)		|	**yes**	|	optional	|	This command allows the host to set-up the bar code reader(s) configuration on the device. Possible value: enable[none/top/bottom/both] numChar[min:6 max:24]
GET_BAR_CODE_INHIBIT_STATUS			|			|	optional	|	Command to return the current bar code/currency inhibit status.
[SET_BAR_CODE_INHIBIT_STATUS](#SET_BAR_CODE_INHIBIT_STATUS)		|	**yes**	|	optional	|	Sets up the bar code inhibit status register.
GET_BAR_CODE_DATA					|			|	optional	|	Command to obtain last valid bar code ticket data, send in response to a Bar Code Ticket Validated event.
[SET_REFILL_MODE](#SET_REFILL_MODE)								|	**yes**	|	optional	|	A command sequence to set or reset the facility for the payout to reject notes that are routed to the payout store but the firmware determines that they are un-suitable for storage.
[PAYOUT_AMOUNT](#PAYOUT_AMOUNT)									|	**yes**	|	**yes**		|	A command to set the monetary value to be paid by the payout unit.
[SET_DENOMINATION_LEVEL](#SET_DENOMINATION_LEVEL)				|	**yes**	|	optional	|	A command to increment the level of coins of a denomination stored in the hopper.
[GET_DENOMINATION_LEVEL](#GET_DENOMINATION_LEVEL)				|	**yes**	|	optional	|	This command returns the level of a denomination stored in a payout device.
COMMUNICATION_PASS_THROUGH			|			|	optional	|	Used with SMART Hopper only. This command sets USB pass through mode.
HALT_PAYOUT							|			|	**yes**		|	A command to stop the execution of an existing payout.
[SET_DENOMINATION_ROUTE](#SET_DENOMINATION_ROUTE)				|	**yes**	|	optional	|	This command will configure the denomination to be either routed to the cashbox on detection or stored to be made available for later possible payout. Possible value: route[payout/cashbox]
[GET_DENOMINATION_ROUTE](#GET_DENOMINATION_ROUTE)				|			|	**yes**		|	This command allows the host to determine the route of a denomination.
[FLOAT_AMOUNT](#FLOAT_AMOUNT)									|	**yes**	|	optional	|	A command to float the hopper unit to leave a requested value of money, with a requested minimum possible payout level. All monies not required to meet float value are routed to cashbox.
GET_MINIMUM_PAYOUT					|			|	**yes**		|	A command to request the minimum possible payout amount that this device can provide
EMPTY_ALL							|			|	**yes**		|	This command will direct all stored monies to the cash box without reporting any value and reset all the stored counters to zero.
[SET_COIN_MECH_INHIBITS](#SET_COIN_MECH_INHIBITS)				|	**yes**	|	optional	|	This command is used to enable or disable acceptance of individual coin values from a coin acceptor connected to the hopper.
GET_NOTE_POSITIONS					|			|	optional	|	This command will return the number of notes in the Note Float and the value in each position.
PAYOUT_NOTE							|			|	optional	|	The Note Float will payout the last note that was stored.
STACK_NOTE							|			|	optional	|	The Note Float will stack the last note that was stored.
[FLOAT_BY_DENOMINATION](#FLOAT_BY_DENOMINATION)					|	**yes**	|	**yes**		|	A command to float (leave in device) the requested quantity of individual denominations.
[SET_VALUE_REPORTING_TYPE](#SET_VALUE_REPORTING_TYPE)			|	**yes**	|	optional	|	This will set the method of reporting values of notes.
[PAYOUT_BY_DENOMINATION](#PAYOUT_BY_DENOMINATION)				|	**yes**	|	**yes**		|	A command to payout the requested quantity of individual denominations.
[SET_COIN_MECH_GLOBAL_INHIBIT](#SET_COIN_MECH_GLOBAL_INHIBIT)		|	**yes**	|	optional	|	This command allows the host to enable/disable the attached coin mech in one command rather than by each individual value with previous firmware versions.
[SET_BAUD_RATE](#SET_BAUD_RATE)									|	**yes**	|	optional	|	Set the communication speed with the device.
GET_BUILD_REVISION					|			|	optional	|	A command to return the build revision information of a device.
[SET_HOPPER_OPTIONS](#SET_HOPPER_OPTIONS)						|	**yes**	|	optional	|	The host can set the following options for the SMART Hopper.
GET_HOPPER_OPTIONS					|			|	optional	|	This command returns option described in SET_HOPPER_OPTIONS command.
SMART_EMPTY							|			|	**yes**		|	Empties payout device of contents, maintaining a count of value emptied.
CASHBOX_PAYOUT_OPERATION_DATA		|			|	optional	|	Can be sent at the end of a SMART Empty, float or dispense operation.
[CONFIGURE_BEZEL](#CONFIGURE_BEZEL)								|	**yes**	|	optional	|	This command allows the host to configure a supported BNV bezel.
POLL_WITH_ACK						|			|	**yes**		|	A command that behaves in the same way as the POLL command but with this command, the specified events (see table below) will need to be acknowledged by the host using the EVENT_ACK command. The events will repeat until the EVENT_ACK command is sent and the BNV will not allow any further note actions until the event has been cleared by the EVENT_ACK command.
EVENT_ACK							|			|	**yes**		|	This command will clear a repeating Poll ACK response and allow further note operations.
GET_COUNTERS						|			|	optional	|	A command to return a global note activity counter set for the slave device.
RESET_COUNTERS						|			|	optional	|	Resets the note activity counters described in Get Counters command to all zero values.
[COIN_MECH_OPTIONS](#COIN_MECH_OPTIONS)							|	**yes**	|	optional	|	The host can set the following options for the SMART Hopper.
DISABLE_PAYOUT_DEVICE				|			|	optional	|	All accepted notes will be routed to the stacker and payout commands will not be accepted.
[ENABLE_PAYOUT_DEVICE](#ENABLE_PAYOUT_DEVICE)					|	**yes**	|	optional	|	A command to enable the attached payout device for storing/paying out notes.
[SET_FIXED_ENCRYPTION_KEY](#SET_FIXED_ENCRYPTION_KEY)			|	**yes**	|	**yes**		|	A command to allow the host to change the fixed part of the eSSP key.
RESET_FIXED_ENCRYPTION_KEY			|			|	optional	|	Resets the fixed encryption key to the device default.


### Example commands with options:
###### SET_CHANNEL_INHIBITS
```js
eSSP.command('SET_CHANNEL_INHIBITS', {
    channels: [1,1,1,0,0,0,0,0] // channel 1-3 enable
})
```

###### HOST_PROTOCOL_VERSION
```js
eSSP.command('HOST_PROTOCOL_VERSION', {
    version: 6
})
```

###### SET_BAR_CODE_CONFIGURATION
```js
eSSP.command('SET_BAR_CODE_CONFIGURATION', {
    enable: 'top',    // none|top|bottom|both
    numChar: 6        // min:6  max:24
})
```

###### SET_BAR_CODE_INHIBIT_STATUS
```js
eSSP.command('SET_BAR_CODE_INHIBIT_STATUS', {
    currencyRead: true,
    barCode: true
})
```

###### SET_REFILL_MODE
```js
eSSP.command('SET_REFILL_MODE', {
    mode: 'on' // on|off|get
})
```

###### PAYOUT_AMOUNT
```js
eSSP.command('PAYOUT_AMOUNT', {
    amount: 10000,
    country_code: 'RUB',
    test: false
})
```

###### SET_DENOMINATION_LEVEL
```js
eSSP.command('SET_DENOMINATION_LEVEL', {
    value: 1,
    denomination: 10000,
    country_code: 'RUB'
})
```

###### GET_DENOMINATION_LEVEL
```js
eSSP.command('GET_DENOMINATION_LEVEL', {
    amount: 100,
    country_code: 'RUB'
})
```

###### SET_DENOMINATION_ROUTE
```js
eSSP.command('SET_DENOMINATION_ROUTE', {
    route: 'payout', // payout|cashbox
    value: 10000,
    country_code: 'RUB'
})
```

###### GET_DENOMINATION_ROUTE
```js
eSSP.command('GET_DENOMINATION_ROUTE', {
    isHopper: false, // true/false
    value: 10000,
    country_code: 'RUB'
})
```

###### FLOAT_AMOUNT
```js
eSSP.command('FLOAT_AMOUNT', {
    min_possible_payout: 1000,
    amount: 10000,
    country_code: 'RUB',
    test: false
})
```

###### SET_COIN_MECH_INHIBITS
```js
eSSP.command('SET_COIN_MECH_INHIBITS', {
    amount: 100,
    inhibited: true
})
```

###### FLOAT_BY_DENOMINATION
```js
eSSP.command('FLOAT_BY_DENOMINATION', {
    value: [
        {
            number: 1,
            denomination: 10000,
            country_code: 'RUB'
        }, {
            number: 1,
            denomination: 50000,
            country_code: 'RUB'
        }
    ],
    test: false
})
```

###### SET_VALUE_REPORTING_TYPE
```js
eSSP.command('SET_VALUE_REPORTING_TYPE', {
    reportBy: 'channel' // value|channel
})
```

###### PAYOUT_BY_DENOMINATION
```js
eSSP.command('PAYOUT_BY_DENOMINATION', {
    value: [
        {
            number: 1,
            denomination: 10000,
            country_code: 'RUB'
        }, {
            number: 1,
            denomination: 50000,
            country_code: 'RUB'
        }
    ],
    test: false
})
```

###### SET_COIN_MECH_GLOBAL_INHIBIT
```js
eSSP.command('SET_COIN_MECH_GLOBAL_INHIBIT', {
    enable: true
})
```

###### SET_BAUD_RATE
```js
eSSP.command('SET_BAUD_RATE', {
    baudrate: 9600, // 9600|38400|115200
    reset_to_default_on_reset: true
})
```

###### SET_HOPPER_OPTIONS
```js
eSSP.command('SET_HOPPER_OPTIONS', {
    payMode: true,
    levelCheck: true,
    motorSpeed: true,
    cashBoxPayAcive: true
})
```

###### CONFIGURE_BEZEL
```js
eSSP.command('CONFIGURE_BEZEL', {
    RGB: '0000ff', // RGB in hex
    volatile: true
})
```

###### COIN_MECH_OPTIONS
```js
eSSP.command('COIN_MECH_OPTIONS', {
    ccTalk: false
})
```

###### ENABLE_PAYOUT_DEVICE
```js
// for Payout
eSSP.command('ENABLE_PAYOUT_DEVICE', {
    REQUIRE_FULL_STARTUP: true,
    OPTIMISE_FOR_PAYIN_SPEED: true
})

// for NV11
eSSP.command('ENABLE_PAYOUT_DEVICE', {
    GIVE_VALUE_ON_STORED: true,
    NO_HOLD_NOTE_ON_PAYOUT: true
})
```

###### SET_FIXED_ENCRYPTION_KEY
```js
eSSP.command('SET_FIXED_ENCRYPTION_KEY', {
    fixedKey: '0000000000000000'
})
```


### Supported Events:

Event name							|   Description
------------------------------------|------------------
OPEN								|	Port open
CLOSE                               |   Port close
READ_NOTE							|	A note is in the process of being scanned by the device (channel 0) or a valid note has been scanned and is in escrow (channel N)
CREDIT_NOTE							|	A note has passed through the device, past the point of possible recovery and the host can safely issue its credit amount.
NOTE_REJECTING						|	The note is in the process of being rejected from the validator.
NOTE_REJECTED						|	The note has been rejected from the validator and is available for the user to retrieve.
NOTE_STACKED						|	The note has exited the device on the host side or has been placed within its note stacker.
SAFE_NOTE_JAM						|	The note is stuck in a position not retrievable from the front of the device (user side).
UNSAFE_NOTE_JAM						|	The note is stuck in a position where the user could possibly remove it from the front of the device.
DISABLED							|	The device is not active and unavailable for normal validation functions.
STACKER_FULL						|	The banknote stacker unit attached to this device has been detected as at its full limit
FRAUD_ATTEMPT						|	The device has detected an attempt to tamper with the normal validation/stacking/payout process.
BAR_CODE_TICKET_VALIDATED			|	A validated barcode ticket has been scanned and is available at the escrow point of the device.
CASHBOX_REPLACED					|	A device with a detectable cashbox has detected that it has been replaced.
CASHBOX_REMOVED						|	A device with a detectable cashbox has detected that it has been removed.
NOTE_CLEARED_TO_CASHBOX				|	At power up, a note was detected as being moved into the stacker unit or host exit of the device.
NOTE_CLEARED_FROM_FRONT				|	At power-up, a note was detected as being rejected out of the front of the device.
NOTE_PATH_OPEN						|	The device has detected that its note transport path has been opened.
COIN_CREDIT							|	A coin has been detected as added to the system via the attached coin mechanism.
CASHBOX_PAID						|	This is given at the end of a payout cycle.
INCOMPLETE_FLOAT					|	The device has detected a discrepancy on power-up that the last float request was interrupted (possibly due to a power failure).
INCOMPLETE_PAYOUT					|	The device has detected a discrepancy on power-up that the last payout request was interrupted (possibly due to a power failure).
NOTE_STORED_IN_PAYOUT				|	The note has been passed into the note store of the payout unit.
DISPENSING							|	The device is in the process of paying out a requested value.
TIME_OUT							|	The device has been unable to complete a request.
FLOATED								|	The device has completed its float command and the final value floated to the cashbox is given in the event data.
FLOATING							|   The device is in the process of executing a float command and the value paid to the cashbox at the poll time is given in the event data.
HALTED								|   This event is given when the host has requested a halt to the device.
JAMMED								|   The device has detected that coins are jammed in its mechanism and cannot be removed other than by manual intervention.
DISPENSED							|   The device has completed its pay-out request.
BAR_CODE_TICKET_ACKNOWLEDGE			|   The bar code ticket has been passed to a safe point in the device stacker.
NOTE_HELD_IN_BEZEL					|   Reported when a dispensing note is held in the bezel of the payout device.
NOTE_DISPENSED_AT_POWER-UP			|   Reported when a note has been dispensed as part of the power-up procedure.
NOTE_STACKING						|   The note is being moved from the escrow position to the host exit section of the device.
NOTE_PAID_INTO_STORE_AT_POWER-UP	|   Reported when a note has been detected as paid into the payout store as part of the power-up procedure.
NOTE_PAID_INTO_STACKER_AT_POWER-UP	|   Reported when a note has been detected as paid into the cashbox stacker as part of the power-up procedure.
NOTE_TRANSFERED_TO_STACKER			|   Reported when a note has been successfully moved from the payout store into the stacker cashbox.
NOTE_FLOAT_ATTACHED					|   Reported when a note float unit has been detected as removed from its validator.
NOTE_FLOAT_REMOVED					|   Reported when a note float unit has been detected as removed from its validator.
PAYOUT_OUT_OF_SERVICE				|   This event is given if the payout goes out of service during operation.
COIN_MECH_RETURN_PRESSED			|   The attached coin mechanism has been detected as having is reject or return button pressed.
COIN_MECH_JAMMED					|   The attached coin mechanism has been detected as having a jam.
EMPTIED								|   The device has completed its Empty process in response to an Empty command from the host.
EMPTYING							|   The device is in the process of emptying its content to the system cashbox in response to an Empty command.
COIN_MECH_ERROR						|   The attached coin mechanism has generated an error.
INITIALISING						|   This event is given only when using the Poll with ACK command.
CHANNEL_DISABLE						|   The device has had all its note channels inhibited and has become disabled for note insertion.
SMART_EMPTIED						|   The device has completed its Smart Empty command.
SMART_EMPTYING      				|   The device is in the process of carrying out its Smart Empty command from the host.
ERROR_DURING_PAYOUT					|   Returned if an error is detected whilst moving a note inside the SMART Payout unit.
JAM_RECOVERY						|   The SMART Payout unit is in the process of recovering from a detected jam.


## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fskokov3812%2Fencrypted-smiley-secure-protocol.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fskokov3812%2Fencrypted-smiley-secure-protocol?ref=badge_large)