/* @license
Google Sheet Sync
v1.0.0
https://github.com/bapuka/google-sheet-sync
License: MIT
*/

import googlesheetsync from './api/googlesheetsync';
import { google } from 'googleapis';

export const init = (auths: {}, spreadsheetId: string) => {    
    
    const auth = new google.auth.JWT(auths)
    const sheets = google.sheets({ version: 'v4', auth });    
    
    return {
        /**
         * @namespace
         */
        googlesheetsync: googlesheetsync(sheets, spreadsheetId)
    }
}