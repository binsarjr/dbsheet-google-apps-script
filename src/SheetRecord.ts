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
  toObject(data, columns?: string[]) {
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
  toArrayFormatted(data, columns?: string[]) {
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
  private fieldOperation(rowValue: string, operation: Partial<FieldOperation>) {
    let result = false

    if (operation.equal) result = equal(operation.equal, rowValue)
    if (operation?.not?.equal) result = !equal(operation?.not?.equal, rowValue)

    if (operation.like) result = like(operation.like).test(rowValue)
    if (operation?.not?.like)
      result = !like(operation?.not?.like).test(rowValue)

    if (operation.ilike) result = like(operation.ilike, true).test(rowValue)
    if (operation?.not?.ilike)
      result = !like(operation?.not?.ilike, true).test(rowValue)

    if (operation.greaterThan)
      result = greaterThan(rowValue, operation.greaterThan)
    if (operation?.not?.greaterThan)
      result = !greaterThan(rowValue, operation?.not?.greaterThan)

    if (operation.greaterThanOrEqual)
      result = greaterThanOrEqual(rowValue, operation.greaterThanOrEqual)
    if (operation?.not?.greaterThanOrEqual)
      result = !greaterThanOrEqual(rowValue, operation?.not?.greaterThanOrEqual)

    if (operation.lessThan) result = lessThan(rowValue, operation.lessThan)
    if (operation?.not?.lessThan)
      result = !lessThan(rowValue, operation?.not?.lessThan)

    if (operation.lessThanOrEqual)
      result = lessThanOrEqual(rowValue, operation.lessThanOrEqual)
    if (operation?.not?.lessThanOrEqual)
      result = !lessThanOrEqual(rowValue, operation?.not?.lessThanOrEqual)

    if (operation.in) result = Boolean(operation.in.includes(rowValue))
    if (operation?.not?.in)
      result = !Boolean(operation?.not?.in.includes(rowValue))
    return result
  }
  /**
   * find anything
   *
   * @param $limit number
   */
  find(operations?: Operation) {
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
        if (operations)
          Object.keys(operations).forEach((key) => {
            let item = operations[key]
            // Cek apakah key yang diinputkan ada di header atau tidak
            if (rowHeader.includes(key)) {
              // cek tipe data
              if (typeof item === 'object') {
                if (!this.fieldOperation(row[key], item)) {
                  fail()
                }
              } else {
                // apabila string maka beri operasi equal
                if (!(item === row[key])) {
                  fail() // batalkan apabila data tidak sama/sesuai
                }
              }
            }

            if (key == '$limit') {
              if (rows.length == item) hasReachedTheLimit = true
            }
          })

        if (hasReachedTheLimit) break
        next && rows.push(row)
      }
    }
    return rows
  }

  findOne(operations?: Operation) {
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

  delete(operations?: Operation) {
    this.find(operations).forEach((row, i) => {
      this.sheet.deleteRow(row._rowPosition - i)
    })
  }
}
