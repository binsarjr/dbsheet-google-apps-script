class Database {
  sheetID: string
  sheetApp: GoogleAppsScript.Spreadsheet.Spreadsheet
  constructor(sheetID) {
    this.sheetID = sheetID
    this.sheetApp = SpreadsheetApp.openById(this.sheetID)
  }

  hasHeader(sheetName) {
    let sheet = this.sheetApp.getSheetByName(sheetName)
    try {
      return Boolean(
        sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues() !== null,
      )
    } catch (e) {
      return false
    }
  }

  createSheet(sheetName, columns, replaceColumn = false) {
    let sheet = replaceColumn
      ? this.sheetApp.getSheetByName(sheetName)
      : this.sheetApp.insertSheet(sheetName)
    if (columns.includes('_id'))
      throw new TypeError(
        "_id field auto added. Don't add it for data stability",
      )
    columns = prepend('_id', columns)
    sheet.getRange(1, 1, 1, columns.length).setValues([columns])
  }
  createSheetIfNotExists(sheetName, columns) {
    let exist = Boolean(this.sheetApp.getSheetByName(sheetName))
    if (!(exist && this.hasHeader(sheetName)))
      this.createSheet(sheetName, columns, exist)
  }
  dropSheet(sheetName) {
    this.sheetApp.deleteSheet(this.sheetApp.getSheetByName(sheetName))
  }
  dropSheetIfExists(sheetName) {
    if (this.sheetApp.getSheetByName(sheetName)) this.dropSheet(sheetName)
  }

  sheet(sheetName) {
    return new SheetRecord(this.sheetID, sheetName)
  }
}
