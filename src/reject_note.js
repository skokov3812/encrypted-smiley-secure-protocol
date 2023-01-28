module.exports = {
  0: {
    name: 'NOTE_ACCEPTED',
    description: 'The banknote has been accepted. No reject has occured.',
  },
  1: {
    name: 'LENGTH_FAIL',
    description: "A validation fail: The banknote has been read but it's length registers over the max length parameter.",
  },
  2: {
    name: 'AVERAGE_FAIL',
    description: 'Internal validation failure - banknote not recognised.',
  },
  3: {
    name: 'COASTLINE_FAIL',
    description: 'Internal validation failure - banknote not recognised.',
  },
  4: {
    name: 'GRAPH_FAIL',
    description: 'Internal validation failure - banknote not recognised.',
  },
  5: {
    name: 'BURIED_FAIL',
    description: 'Internal validation failure - banknote not recognised.',
  },
  6: {
    name: 'CHANNEL_INHIBIT',
    description: 'This banknote has been inhibited for acceptance in the dataset configuration.',
  },
  7: {
    name: 'SECOND_NOTE_DETECTED',
    description: 'A second banknote was inserted into the validator while the first one was still being transported through the banknote path.',
  },
  8: {
    name: 'REJECT_BY_HOST',
    description: 'The host system issues a Reject command when this banknote was held in escrow.',
  },
  9: {
    name: 'CROSS_CHANNEL_DETECTED',
    description: 'This bank note was identified as exisiting in two or more seperate channel definitions in the dataset.',
  },
  10: {
    name: 'REAR_SENSOR_ERROR',
    description: 'An inconsistency in a position sensor detection was seen',
  },
  11: {
    name: 'NOTE_TOO_LONG',
    description: 'The banknote failed dataset length checks.',
  },
  12: {
    name: 'DISABLED_BY_HOST',
    description: 'The bank note was validated on a channel that has been inhibited for acceptance by the host system.',
  },
  13: {
    name: 'SLOW_MECH',
    description: 'The internal mechanism was detected as moving too slowly for correct validation.',
  },
  14: {
    name: 'STRIM_ATTEMPT',
    description: 'The internal mechanism was detected as moving too slowly for correct validation.',
  },
  15: {
    name: 'FRAUD_CHANNEL',
    description: 'Obselete response.',
  },
  16: {
    name: 'NO_NOTES_DETECTED',
    description: 'A banknote detection was initiated but no banknotes were seen at the validation section.',
  },
  17: {
    name: 'PEAK_DETECT_FAIL',
    description: 'Internal validation fail. Banknote not recognised.',
  },
  18: {
    name: 'TWISTED_NOTE_REJECT',
    description: 'Internal validation fail. Banknote not recognised.',
  },
  19: {
    name: 'ESCROW_TIME-OUT',
    description: 'A banknote held in escrow was rejected due to the host not communicating within the timeout period.',
  },
  20: {
    name: 'BAR_CODE_SCAN_FAIL',
    description: 'Internal validation fail. Banknote not recognised.',
  },
  21: {
    name: 'NO_CAM_ACTIVATE',
    description: 'A banknote did not reach the internal note path for validation during transport.',
  },
  22: {
    name: 'SLOT_FAIL_1',
    description: 'Internal validation fail. Banknote not recognised.',
  },
  23: {
    name: 'SLOT_FAIL_2',
    description: 'Internal validation fail. Banknote not recognised.',
  },
  24: {
    name: 'LENS_OVERSAMPLE',
    description: 'The banknote was transported faster than the system could sample the note.',
  },
  25: {
    name: 'WIDTH_DETECTION_FAIL',
    description: 'The banknote failed a measurement test.',
  },
  26: {
    name: 'SHORT_NOTE_DETECT',
    description: 'The banknote measured length fell outside of the validation parameter for minimum length.',
  },
  27: {
    name: 'PAYOUT_NOTE',
    description: 'The reject code cammand was issued after a note was payed out using a note payout device.',
  },
  28: {
    name: 'DOUBLE_NOTE_DETECTED',
    description: 'Mote than one banknote was detected as overlayed during note entry.',
  },
  29: {
    name: 'UNABLE_TO_STACK',
    description: "The bank was unable to reach it's correct stacking position during transport",
  },
}
