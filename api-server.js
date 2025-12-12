import express from 'express';
import cors from 'cors';
import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const app = express();
const PORT = 3001;

// Enable CORS for the React app
app.use(cors());
app.use(express.json());

// Google Sheets configuration
const SHEET_ID = '1l_PBoX6lET_E8Pfm5wwBkAmaFObDJmpVmDlsereA_2k';
const CREDENTIALS_PATH = process.env.GOOGLE_APPLICATION_CREDENTIALS;

console.log('🔑 Credentials path:', CREDENTIALS_PATH);

// Initialize Google Sheets API
async function getGoogleSheetsClient() {
    const auth = new google.auth.GoogleAuth({
        keyFile: CREDENTIALS_PATH,
        scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });

    return sheets;
}

// Endpoint to fetch leads from Google Sheets
app.get('/api/leads', async (req, res) => {
    try {
        console.log('📊 Fetching leads from Google Sheet...');
        const sheets = await getGoogleSheetsClient();

        // Fetch data from the sheet
        // Adjust the range based on your sheet structure
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: 'Form Responses 1!A:J', // Adjust range as needed
        });

        const rows = response.data.values;

        if (!rows || rows.length === 0) {
            console.log('⚠️  No data found in sheet');
            return res.json([]);
        }

        console.log(`✅ Found ${rows.length - 1} leads (excluding header)`);

        // Skip header row and format data
        const headers = rows[0];
        const leads = rows.slice(1).map((row, index) => {
            const lead = {};
            headers.forEach((header, i) => {
                lead[header] = row[i] || '';
            });

            // Add a unique ID
            lead.id = index + 1;

            return lead;
        });

        res.json(leads);
    } catch (error) {
        console.error('❌ Error fetching leads:', error.message);
        res.status(500).json({
            error: 'Failed to fetch leads',
            message: error.message
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'API server is running' });
});

app.listen(PORT, () => {
    console.log(`\n✅ API server running on http://localhost:${PORT}`);
    console.log(`📊 Fetching data from Google Sheet: ${SHEET_ID}`);
    console.log(`🔑 Using credentials: ${CREDENTIALS_PATH}\n`);
});
