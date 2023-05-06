import { init } from '../index';
const auth = {
    email: '***@****.iam.gserviceaccount.com',
    key: '**********',
    scopes: ["https://www.googleapis.com/auth/spreadsheets"]
}
const gsapi = init(auth, '******')
gsapi.googlesheetsync.getSheetId("test")





