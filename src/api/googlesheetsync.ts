import { sheets_v4 } from 'googleapis';
import papa from 'papaparse';

type Header = {
    field?: object,
    header?: string,
}

type MergedHeader = {
    field?: object,
    header?: string,
    rowIndex?: number,
    colIndex?: number,
    bg?: {},
    fg?: {},
    mergeRowStart?: number,
    mergeRowEnd?: number,
    mergeColStart?: number,
    mergeColEnd?: number
}

type Formats = {
    startRowIndex?: number,
    endRowIndex?: number,
    startColIndex?: number,
    endColIndex?: number
}

export default (sheets: sheets_v4.Sheets, spreadsheetId: string) => {
    return {
        async getSheetId(sheet_name: string) {
            var sheet_id: number = 0;
            const request = {
                spreadsheetId: spreadsheetId,
                ranges: [sheet_name],
                includeGridData: false,                
            };

            const res = await sheets.spreadsheets.get(request)
            const sheet_data = res?.data?.sheets
            sheet_data?.find(sheet => {
                if (sheet) {
                    console.log('Sheet ID: ', sheet?.properties?.sheetId!)
                    sheet_id = sheet?.properties?.sheetId!
                    console.log("Returning sheet ID: ", sheet_id)
                    return sheet_id
                }
            })
            return sheet_id
        },

        async prepareHeader(sheet_id: number, columns: {}[], rowIndex: number, colIndex: number, bg: {}, fg: {}, isMerged: boolean) {
            if (isMerged) {
                var mergedRequests =
                    buildMergedHeaderRowRequest(sheet_id, columns)
                var mergedRequest = {
                    spreadsheetId: spreadsheetId,
                    resource: {
                        requests: mergedRequests
                    }
                };
                await sheets.spreadsheets.batchUpdate(mergedRequest)

            } else {

                var requests = [
                    buildHeaderRowRequest(sheet_id, columns, rowIndex, colIndex, bg, fg)
                ];

                var request = {
                    spreadsheetId: spreadsheetId,
                    resource: {
                        requests: requests
                    }
                };

                await sheets.spreadsheets.batchUpdate(request)

            }

        },

        async mergeCells(sheet_id: number, columns: {}[]) {

            var mergeRequests = buildMergeCellsRequest(sheet_id, columns)

            var mergeRequest = {
                spreadsheetId: spreadsheetId,
                resource: {
                    requests: mergeRequests
                }
            };

            await sheets.spreadsheets.batchUpdate(mergeRequest)

        },

        async syncData(sheet_id: number, data: any[], rowIndex: number) {

            try {
                let converted_result = papa.unparse(data, {
                    header: false,
                    delimiter: ';'
                })
                // console.log(`Received data: ${converted_result}`)
                var requests = {
                    requests: [
                        {
                            pasteData: {
                                coordinate: {
                                    sheetId: sheet_id,
                                    rowIndex: rowIndex,
                                    columnIndex: 1,
                                },
                                delimiter: ";",
                                type: "PASTE_VALUES",
                                data: converted_result,
                            }
                        }
                    ]
                }

                sheets.spreadsheets.batchUpdate(
                    {
                        spreadsheetId: spreadsheetId,
                        requestBody: requests,
                    }
                );

            } catch (reason) {
                console.log("error: ", reason)
            }

            return
        },

        async formatCellBorders (sheet_id: number, startRowIndex: number, endRowIndex: number, startColIndex: number, endColumnIndex: number) {
            const requests = {
              requests: [
                {
                  updateBorders: {
                    range: {
                      sheetId: sheet_id,
                      startRowIndex: startRowIndex,
                      endRowIndex: endRowIndex,
                      startColumnIndex: startColIndex,
                      endColumnIndex: endColumnIndex
                    },
                    top: {
                      style: "SOLID",
                      width: 1,
                      color: {
                        red: 234.0,
                        green: 232.0,
                        blue: 232.0
                      },
                    },
                    bottom: {
                      style: "SOLID",
                      width: 1,
                      color: {
                        red: 234.0,
                        green: 232.0,
                        blue: 232.0
                      },
                    },
                    left: {
                      style: "SOLID",
                      width: 1,
                      color: {
                        red: 234.0,
                        green: 232.0,
                        blue: 232.0
                      },
                    },
                    right: {
                      style: "SOLID",
                      width: 1,
                      color: {
                        red: 234.0,
                        green: 232.0,
                        blue: 232.0
                      },
                    },
                    innerHorizontal: {
                      style: "SOLID",
                      width: 1,
                      color: {
                        red: 234.0,
                        green: 232.0,
                        blue: 232.0
                      }
                    },
                    innerVertical: {
                      style: "SOLID",
                      width: 1,
                      color: {
                        red: 234.0,
                        green: 232.0,
                        blue: 232.0
                      }
                    }
                  }
                }
              ]
            };
            sheets.spreadsheets.batchUpdate(
              {
                spreadsheetId: spreadsheetId,
                requestBody: requests,
              }
            );
        
          },

          async formatNumberRange (sheet_id: number, formats: Formats[]) {
            var numberFormats =
              await buildFormatNumberRequest(sheet_id, formats)
            var formatRequest = {
              spreadsheetId: spreadsheetId,
              resource: {
                requests: numberFormats
              }
            };
            
            await sheets.spreadsheets.batchUpdate(formatRequest)
            
          }

    }

}

const buildMergedHeaderRowRequest = (sheetId: number, mergedColumns: MergedHeader[]) => {
    var mergedCells = mergedColumns.map(function (column) {
        return {
            updateCells: {
                start: {
                    sheetId: sheetId,
                    rowIndex: column.rowIndex,
                    columnIndex: column.colIndex
                },
                rows: [
                    {
                        values: [{
                            userEnteredValue: {
                                stringValue: column.header
                            },
                            userEnteredFormat: {
                                backgroundColor: column.bg,
                                horizontalAlignment: "CENTER",
                                textFormat: {
                                    bold: true,
                                    fontSize: 11,
                                    foregroundColor: column.fg,
                                }
                            }
                        }]
                    }
                ],
                fields: 'userEnteredValue,userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)'
            }

        }
    });

    return mergedCells

}

const buildHeaderRowRequest = (sheetId: number, columns: Header[], rowIndex: number, colIndex: number, backgroundColor: {}, foregroundColor: {}) => {

    // Return request for plain columns
    var cells = columns.map(function (column) {
        return {
            userEnteredValue: {
                stringValue: column.header
            },
            userEnteredFormat: {
                backgroundColor,
                horizontalAlignment: "CENTER",
                textFormat: {
                    bold: true,
                    fontSize: 11,
                    foregroundColor,
                }
            }
        }
    });

    return {
        updateCells: {
            start: {
                sheetId: sheetId,
                rowIndex: rowIndex,
                columnIndex: colIndex
            },
            rows: [
                {
                    values: cells
                }
            ],
            fields: 'userEnteredValue,userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)'
        },
    };
}

const buildMergeCellsRequest = (sheet_id: number, mergedColumns: MergedHeader[]) => {

    var mergeCells = mergedColumns.map((column) => {
        return {
            mergeCells: {
                range: {
                    sheetId: sheet_id,
                    startRowIndex: column.mergeRowStart,
                    endRowIndex: column.mergeRowEnd,
                    startColumnIndex: column.mergeColStart,
                    endColumnIndex: column.mergeColEnd
                },
                mergeType: "MERGE_ALL"
            },
        }
    });
    return mergeCells
}

const buildFormatNumberRequest = async (sheet_id: number, formats: Formats[]) => {
    var numberFormatRequest = formats.map((item) => {
      return {
        repeatCell: {
          range: {
            sheetId: sheet_id,
            startRowIndex: item.startRowIndex,
            endRowIndex: item.endRowIndex,
            startColumnIndex: item.startColIndex,
            endColumnIndex: item.endColIndex
          },
          cell: {
            userEnteredFormat: {
              numberFormat: {
                type: "NUMBER",
                pattern: "#,##0.00"
              }
            }
          },
          fields: "userEnteredFormat.numberFormat"
        }
      }
    })
    
    return numberFormatRequest
  }