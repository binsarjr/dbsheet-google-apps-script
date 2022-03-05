function uuid() {
  return Utilities.getUuid()
}
function prepend(value, array) {
  var newArray = array.slice()
  newArray.unshift(value)
  return newArray
}

function getColumns(sheet) {
  return sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
}
