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

function equal(a: string | number, b: string | number) {
  return a == b
}

const like = (data: string, ignoreCase?: boolean) => {
  // escape spesial characters regex
  '.+*?^$()[]{}|'.split('').forEach((c) => {
    let toString = new RegExp('\\' + c, 'g')
    data = data.replace(toString, '\\' + c)
  })
  if (/^%.*%$/.test(data)) {
    data = data.replace(/^%/, '')
    data = data.replace(/%$/, '')
  } else {
    data = data.replace(/^%(.*)/, '.*$1$')
    data = data.replace(/(.*)%$/, '$1.*$')
  }

  return new RegExp(data, ignoreCase ? 'i' : '')
}

function greaterThan(a: string | number, b: string | number) {
  return a > b
}
function greaterThanOrEqual(a: string | number, b: string | number) {
  return a >= b
}
function lessThan(a: string | number, b: string | number) {
  return a < b
}
function lessThanOrEqual(a: string | number, b: string | number) {
  return a <= b
}
