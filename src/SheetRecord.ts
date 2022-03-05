class SheetRecord {
  sheetID: string
  sheet: GoogleAppsScript.Spreadsheet.Sheet
  constructor(sheetID: string, sheetName: string) {
    this.sheetID = sheetID
    this.sheet = SpreadsheetApp.openById(this.sheetID).getSheetByName(sheetName)
  }
  /**
   * Convert array format that given from spreadsheet to object
   */
  toObject(data, columns = null) {
    if (!columns) columns = getColumns(this.sheet)

    let result = {
      _rowPosition: 0,
    }
    columns.forEach((column, i) => {
      result[column] = data[i]
    })
    return result
  }
  /**
   * Convert any object to array formatted for spreadsheet
   */
  toArrayFormatted(data, columns = null) {
    if (!columns) columns = getColumns(this.sheet)

    let result = []
    // _id wajib ada
    !Object.keys(data).includes('_id') && (data['_id'] = null)
    Object.keys(data).forEach((key) => {
      let indexof = columns.indexOf(key)
      if (key == '_id') data[key] = uuid()
      result[indexof] = data[key]
    })

    return result
  }

  /**
   * find anything
   *
   * @param $limit number
   */
  find(operations = {}) {
    let lastRow = this.sheet.getLastRow()
    let rows = []
    if (lastRow > 1) {
      let rowHeader = getColumns(this.sheet)
      for (let last = 2; last <= lastRow; last++) {
        this.sheet.getRange(1, 1, 1, 1)

        let row = this.toObject(
          this.sheet
            .getRange(last, 1, 1, this.sheet.getLastColumn())
            .getValues()[0],
          rowHeader,
        )
        // private obj if needed in future
        row._rowPosition = last

        let next = true
        let hasReachedTheLimit = false
        const fail = function () {
          next = false
        }
        Object.keys(operations).forEach((key) => {
          let item = operations[key]
          // Cek apakah key yang diinputkan ada di header atau tidak
          if (rowHeader.includes(key)) {
            // cek tipe data
            if (typeof item === 'string') {
              // apabila string maka beri operasi equal
              if (!(item === row[key])) {
                fail() // batalkan apabila data tidak sama/sesuai
              }
            } else {
              // do it something with object
            }
          }

          if (key == '$limit') {
            if (rows.length == item) hasReachedTheLimit = true
          }
        })

        next && !hasReachedTheLimit && rows.push(row)
      }
    }
    return rows
  }

  findOne(operations = {}) {
    let data = this.find({ ...operations, $limit: 1 })
    return data.length ? data[0] : null
  }

  /**
   * Tambah data bisa berupa objek dalam array atau objek
   * data objek harus sama dengan nama kolom di sheet
   */
  insert(data) {
    if (!Array.isArray(data)) data = [data]
    let newRecords = data.map((item) =>
      this.toArrayFormatted(item, getColumns(this.sheet)),
    )
    this.sheet
      .getRange(
        this.sheet.getLastRow() + 1,
        1,
        newRecords.length,
        this.sheet.getLastColumn(),
      )
      .setValues(newRecords)
  }

  update(_id: string, data) {
    let oldData = this.findOne({ _id })
    if (!oldData) throw new RangeError('not found')
    let futureData = { ...oldData, ...data }
    this.sheet
      .getRange(oldData._rowPosition, 1, 1, this.sheet.getLastColumn())
      .setValues([this.toArrayFormatted(futureData)])
  }

  delete(operations = {}) {
    this.find(operations).forEach((row, i) => {
      this.sheet.deleteRow(row._rowPosition - i)
    })
  }
}
