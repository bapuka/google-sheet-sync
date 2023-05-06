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