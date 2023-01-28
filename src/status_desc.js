module.exports = {
  176: {
    name: 'JAM_RECOVERY',
    description:
      'The SMART Payout unit is in the process of recovering from a detected jam. This process will typically move five notes to the cash box; this is done to minimise the possibility the unit will go out of service',
  },
  177: {
    name: 'ERROR_DURING_PAYOUT',
    description:
      'Returned if an error is detected whilst moving a note inside the SMART Payout unit. The cause of error (1 byte) indicates the source of the condition; 0x00 for note not being correctly detected as it is routed to cashbox or for payout, 0x01 if note is jammed in transport. In the case of the incorrect detection, the response to Cashbox Payout Operation Data request would report the note expected to be paid out.',
  },
  179: {
    name: 'SMART_EMPTYING',
    description:
      'The device is in the process of carrying out its Smart Empty command from the host. The value emptied at the poll point is given in the event data.',
  },
  180: {
    name: 'SMART_EMPTIED',
    description: 'The device has completed its Smart Empty command. The total amount emptied is given in the event data.',
  },
  181: {
    name: 'CHANNEL_DISABLE',
    description: 'The device has had all its note channels inhibited and has become disabled for note insertion.',
  },
  182: {
    name: 'INITIALISING',
    description:
      'This event is given only when using the Poll with ACK command. It is given when the BNV is powered up and setting its sensors and mechanisms to be ready for Note acceptance. When the event response does not contain this event, the BNV is ready to be enabled and used.',
  },
  183: {
    name: 'COIN_MECH_ERROR',
    description: 'The attached coin mechanism has generated an error. Its code is given in the event data.',
  },
  194: {
    name: 'EMPTYING',
    description: 'The device is in the process of emptying its content to the system cashbox in response to an Empty command.',
  },
  195: {
    name: 'EMPTIED',
    description: 'The device has completed its Empty process in response to an Empty command from the host.',
  },
  196: {
    name: 'COIN_MECH_JAMMED',
    description: 'The attached coin mechanism has been detected as having a jam.',
  },
  197: {
    name: 'COIN_MECH_RETURN_PRESSED',
    description: 'The attached coin mechanism has been detected as having is reject or return button pressed.',
  },
  198: {
    name: 'PAYOUT_OUT_OF_SERVICE',
    description:
      'This event is given if the payout goes out of service during operation. If this event is detected after a poll, the host can send the ENABLE PAYOUT DEVICE command to determine if the payout unit comes back into service.',
  },
  199: {
    name: 'NOTE_FLOAT_REMOVED',
    description: 'Reported when a note float unit has been detected as removed from its validator.',
  },
  200: {
    name: 'NOTE_FLOAT_ATTACHED',
    description: 'Reported when a note float unit has been detected as removed from its validator.',
  },
  201: {
    name: 'NOTE_TRANSFERED_TO_STACKER',
    description: 'Reported when a note has been successfully moved from the payout store into the stacker cashbox.',
  },
  202: {
    name: 'NOTE_PAID_INTO_STACKER_AT_POWER-UP',
    description: 'Reported when a note has been detected as paid into the cashbox stacker as part of the power-up procedure.',
  },
  203: {
    name: 'NOTE_PAID_INTO_STORE_AT_POWER-UP',
    description: 'Reported when a note has been detected as paid into the payout store as part of the power-up procedure.',
  },
  204: {
    name: 'NOTE_STACKING',
    description: 'The note is being moved from the escrow position to the host exit section of the device.',
  },
  205: {
    name: 'NOTE_DISPENSED_AT_POWER-UP',
    description: 'Reported when a note has been dispensed as part of the power-up procedure.',
  },
  206: {
    name: 'NOTE_HELD_IN_BEZEL',
    description: 'Reported when a dispensing note is held in the bezel of the payout device.',
  },
  209: {
    name: 'BAR_CODE_TICKET_ACKNOWLEDGE',
    description: 'The bar code ticket has been passed to a safe point in the device stacker.',
  },
  210: {
    name: 'DISPENSED',
    description: 'The device has completed its pay-out request. The final value paid is given in the event data.',
  },
  213: {
    name: 'JAMMED',
    description:
      'The device has detected that coins are jammed in its mechanism and cannot be removed other than by manual intervention. The value paid at the jam point is given in the event data.',
  },
  214: {
    name: 'HALTED',
    description:
      'This event is given when the host has requested a halt to the device. The value paid at the point of halting is given in the event data.',
  },
  215: {
    name: 'FLOATING',
    description:
      'The device is in the process of executing a float command and the value paid to the cashbox at the poll time is given in the event data.',
  },
  216: {
    name: 'FLOATED',
    description: 'The device has completed its float command and the final value floated to the cashbox is given in the event data.',
  },
  217: {
    name: 'TIME_OUT',
    description: 'The device has been unable to complete a request. The value paid up until the time-out point is given in the event data.',
  },
  218: {
    name: 'DISPENSING',
    description: 'The device is in the process of paying out a requested value. The value paid at the poll is given in the vent data.',
  },
  219: {
    name: 'NOTE_STORED_IN_PAYOUT',
    description: 'The note has been passed into the note store of the payout unit.',
  },
  220: {
    name: 'INCOMPLETE_PAYOUT',
    description:
      'The device has detected a discrepancy on power-up that the last payout request was interrupted (possibly due to a power failure). The amounts of the value paid and requested are given in the event data.',
  },
  221: {
    name: 'INCOMPLETE_FLOAT',
    description:
      'The device has detected a discrepancy on power-up that the last float request was interrupted (possibly due to a power failure). The amounts of the value paid and requested are given in the event data.',
  },
  222: {
    name: 'CASHBOX_PAID',
    description:
      'This is given at the end of a payout cycle. It shows the value of stored coins that were routed to the cashbox that were paid into the cashbox during the payout cycle.',
  },
  223: {
    name: 'COIN_CREDIT',
    description:
      'A coin has been detected as added to the system via the attached coin mechanism. The value of the coin detected is given in the event data.',
  },
  224: {
    name: 'NOTE_PATH_OPEN',
    description: 'The device has detected that its note transport path has been opened.',
  },
  225: {
    name: 'NOTE_CLEARED_FROM_FRONT',
    description:
      'At power-up, a note was detected as being rejected out of the front of the device. The channel value, if known is given in the data byte.',
  },
  226: {
    name: 'NOTE_CLEARED_TO_CASHBOX',
    description:
      'At power up, a note was detected as being moved into the stacker unit or host exit of the device. The channel number of the note is given in the data byte if known.',
  },
  227: {
    name: 'CASHBOX_REMOVED',
    description: 'A device with a detectable cashbox has detected that it has been removed.',
  },
  228: {
    name: 'CASHBOX_REPLACED',
    description: 'A device with a detectable cashbox has detected that it has been replaced.',
  },
  229: {
    name: 'BAR_CODE_TICKET_VALIDATED',
    description: 'A validated barcode ticket has been scanned and is available at the escrow point of the device.',
  },
  230: {
    name: 'FRAUD_ATTEMPT',
    description: 'The device has detected an attempt to tamper with the normal validation/stacking/payout process.',
  },
  231: {
    name: 'STACKER_FULL',
    description: 'The banknote stacker unit attached to this device has been detected as at its full limit',
  },
  232: {
    name: 'DISABLED',
    description: 'The device is not active and unavailable for normal validation functions.',
  },
  233: {
    name: 'UNSAFE_NOTE_JAM',
    description: 'The note is stuck in a position where the user could possibly remove it from the front of the device.',
  },
  234: {
    name: 'SAFE_NOTE_JAM',
    description: 'The note is stuck in a position not retrievable from the front of the device (user side)',
  },
  235: {
    name: 'NOTE_STACKED',
    description: 'The note has exited the device on the host side or has been placed within its note stacker.',
  },
  236: {
    name: 'NOTE_REJECTED',
    description: 'The note has been rejected from the validator and is available for the user to retrieve.',
  },
  237: {
    name: 'NOTE_REJECTING',
    description: 'The note is in the process of being rejected from the validator',
  },
  238: {
    name: 'CREDIT_NOTE',
    description:
      'A note has passed through the device, past the point of possible recovery and the host can safely issue its credit amount. The byte value is the channel number of the note to credit.',
  },
  239: {
    name: 'READ_NOTE',
    description:
      'A note is in the process of being scanned by the device (byte value 0) or a valid note has been scanned and is in escrow (byte value gives the channel number)',
  },
  240: {
    name: 'OK',
    description: 'Returned when a command from the host is understood and has been, or is in the process of, being executed.',
  },
  241: {
    name: 'SLAVE_RESET',
    description: 'The device has undergone a power reset.',
  },
  242: {
    name: 'COMMAND_NOT_KNOWN',
    description: 'Returned when an invalid command is received by a peripheral.',
  },
  243: {
    name: 'WRONG_NO_PARAMETERS',
    description: 'A command was received by a peripheral, but an incorrect number of parameters were received.',
  },
  244: {
    name: 'PARAMETER_OUT_OF_RANGE',
    description: 'One of the parameters sent with a command is out of range.',
  },
  245: {
    name: 'COMMAND_CANNOT_BE_PROCESSED',
    description:
      'A command sent could not be processed at that time. E.g. sending a dispense command before the last dispense operation has completed.',
  },
  246: {
    name: 'SOFTWARE_ERROR',
    description:
      'Reported for errors in the execution of software e.g. Divide by zero. This may also be reported if there is a problem resulting from a failed remote firmware upgrade, in this case the firmware upgrade should be redone.',
  },
  248: {
    name: 'FAIL',
    description: 'Command failure',
  },
  250: {
    name: 'KEY_NOT_SET',
    description: 'The slave is in encrypted communication mode but the encryption keys have not been negotiated.',
  },
}
