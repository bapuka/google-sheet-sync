import { init } from '../index';
const auth = {
    email: '***@****.iam.gserviceaccount.com',
    key: '**********',
    scopes: ["https://www.googleapis.com/auth/spreadsheets"]
}
const gsapi = init(auth, '*****************')
var row_pointer: number = 2
var row_start = row_pointer - 1

var columns = [
    { field: 'name', header: 'Name' },
    { field: 'position', header: 'Position' },
    { field: 'salary_monthly', header: 'Monthly Salary' },
    { field: 'salary_annual', header: 'Annual Salary' },
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
    { field: 'employee', header: 'Employee', rowIndex: row_pointer - 1, colIndex: 1, bg: sum_bg, fg: sum_fg, mergeRowStart: row_pointer - 1, mergeRowEnd: row_pointer, mergeColStart: 1, mergeColEnd: 5 },
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
    .then(async () => {
        console.log(`mergedHeader row: ${row_pointer}`)
        await gsapi.googlesheetsync.prepareHeader(sheet_id, mergedColumns, row_pointer, 1, col_bg, col_fg, true)

        row_pointer++

        var sheet_data = [{
            col1: "John Collins",
            col2: "Chief",
            col3: 5800,
            col4: 69600
        }]

        await gsapi.googlesheetsync.syncData(sheet_id, sheet_data, row_pointer)
            .then(async () => {
                row_pointer += sheet_data.length

                await gsapi.googlesheetsync.formatCellBorders(sheet_id, row_start, row_pointer, 1, 1 + columns.length)


                var numberFormats = [
                    { startRowIndex: row_start + 2, endRowIndex: row_pointer, startColIndex: 3, endColIndex: 6 },
                ]

                await gsapi.googlesheetsync.formatNumberRange(sheet_id, numberFormats)
            })
    })


