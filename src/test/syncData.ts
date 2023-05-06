import { init } from '../index';
const auth = {
    email: '***@****.iam.gserviceaccount.com',
    key: '**********',
    scopes: ["https://www.googleapis.com/auth/spreadsheets"]
}
const gsapi = init(auth, '*****************')
var sheet_separator: number = 2

var columns = [
    { field: 'test1', header: 'Test1' },
    { field: 'test2', header: 'Test2' },
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
    { field: 'sum', header: 'summary', rowIndex: sheet_separator - 1, colIndex: 2, bg: sum_bg, fg: sum_fg, mergeRowStart: sheet_separator - 1, mergeRowEnd: sheet_separator, mergeColStart: 1, mergeColEnd: 3 },
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

await gsapi.googlesheetsync.prepareHeader(sheet_id, columns, sheet_separator, 1, col_bg, col_fg, false)
await gsapi.googlesheetsync.mergeCells(sheet_id, mergedColumns)
await gsapi.googlesheetsync.prepareHeader(sheet_id, mergedColumns, sheet_separator, 1, {}, {}, true)
sheet_separator++

var sheet_data = [{
    col1: "value1",
    col2: "value2",
}]

await gsapi.googlesheetsync.syncData(sheet_id, sheet_data, sheet_separator)