import { init } from '../index';
const auth = {
    email: '***@****.iam.gserviceaccount.com',
    key: '**********',
    scopes: ["https://www.googleapis.com/auth/spreadsheets"]
}
const gsapi = init(auth, '1w2QR3rBeF2cNR8pSVzvNI1MMwIOqX1idQ_Dg4uYIvwY')
var row_pointer: number = 2
var row_start = row_pointer - 1

var columns = [
    { field: 'test1', header: 'Header1' },
    { field: 'test2', header: 'Header2' },
]

var sum_bg = {
    red: 72.0,
    green: 56.0,
    blue: 80.0
}, sum_fg = {
    red: 234.0,
    green: 232.0,
    blue: 232.0
}

var mergedColumns = [
    { field: 'sum', header: 'summary', rowIndex: row_pointer - 1, colIndex: 2, bg: sum_bg, fg: sum_fg, mergeRowStart: row_pointer - 1, mergeRowEnd: row_pointer, mergeColStart: 1, mergeColEnd: 3 },
]

const sheet_id = await gsapi.googlesheetsync.getSheetId("test")

var col_bg = {
    red: 20.0,
    green: 20.0,
    blue: 20.0
}, col_fg = {
    red: 234.0,
    green: 232.0,
    blue: 232.0
}

await gsapi.googlesheetsync.prepareHeader(sheet_id, columns, row_pointer, 1, col_bg, col_fg, false)
await gsapi.googlesheetsync.mergeCells(sheet_id, mergedColumns)
await gsapi.googlesheetsync.prepareHeader(sheet_id, mergedColumns, row_pointer, 1, {}, {}, true)
row_pointer++

var sheet_data = [{
    col1: "value1",
    col2: "value2",
}]

await gsapi.googlesheetsync.syncData(sheet_id, sheet_data, row_pointer)
row_pointer += sheet_data.length

console.log(`border: ${row_start}, ${row_pointer}, 1, ${1 + columns.length}`)
await gsapi.googlesheetsync.formatCellBorders(sheet_id, row_start, row_pointer, 1, 1 + columns.length)