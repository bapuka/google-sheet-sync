### To use API
```
import { init } from '../index';

const auth = {
    email: '**@***.iam.gserviceaccount.com',
    key: '-----BEGIN PRIVATE KEY-----\n************\n-----END PRIVATE KEY-----\n',
    scopes: ["https://www.googleapis.com/auth/spreadsheets"]
  }
const gsapi = init(auth, '******')

// Then call api function
gsapi.googlesheetsync.getSheetId("<SheetId>")
```

#### Header example
```
var sheet_separator: number = 2

var columns = [
    { field: 'test1', header: 'Test1'},
    { field: 'test2', header: 'Test2'},
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
```

#### MergedHeader example
```

var sheet_separator: number = 2

var columns = [
    { field: 'test1', header: 'Test1'},
    { field: 'test2', header: 'Test2'},
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
await gsapi.googlesheetsync.mergeCells(sheet_id, sheet_separator, 1, col_bg, col_fg, mergedColumns)
await gsapi.googlesheetsync.prepareHeader(sheet_id, mergedColumns, sheet_separator, 1, col_bg, col_fg, true)
```

![Merged Header](/src/test/images/mergedColumn.png "MergedHeader")

#### Format example
```
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
```
![Format Number](/src/test/images/formatNumber.png "FormatNumber")