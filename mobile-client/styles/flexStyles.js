import { StyleSheet } from 'react-native'

const flex = StyleSheet.create({
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
  },
});

const flexStyles = StyleSheet.create({
  row: {
    ...flex.row,
  },
  column: {
    ...flex.column,
  },
  rowLeft: {
    ...flex.row,
    justifyContent: 'flex-start',
  },
  rowCenter: {
    ...flex.row,
    justifyContent: 'center',
  },
  rowRight: {
    ...flex.row,
    justifyContent: 'flex-end',
  },
  columnLeft: {
    ...flex.column,
    alignItems: 'flex-start',
  },
  columnCenter: {
    ...flex.column,
    alignItems: 'center',
  },
  columnRight: {
    ...flex.column,
    alignItems: 'flex-end',
  },
});

export default flexStyles;