import dotenv from 'dotenv';
import path from 'path';

// Load environment variables strictly from backend/.env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const RESOURCE_ID = '9ef84268-d588-465a-a308-a864a43d0070';
const BASE_URL = `https://api.data.gov.in/resource/${RESOURCE_ID}`;

interface MandiRecord {
  state?: string;
  district?: string;
  market?: string;
  commodity?: string;
  variety?: string;
  grade?: string;
  arrival_date?: string;
  min_price?: string | number;
  max_price?: string | number;
  modal_price?: string | number;
  [key: string]: any;
}

interface ApiResponse {
  status?: string;
  message?: string;
  total?: number;
  count?: number;
  records?: MandiRecord[];
  [key: string]: any;
}

async function fetchFromDataGov(apiKey: string, params: Record<string, string>): Promise<{ status: number; statusText: string; data: ApiResponse }> {
  const url = new URL(BASE_URL);
  url.searchParams.append('api-key', apiKey);
  url.searchParams.append('format', 'json');

  for (const [k, v] of Object.entries(params)) {
    url.searchParams.append(k, v);
  }

  const res = await fetch(url.toString(), {
    headers: {
      'User-Agent': 'AGRINEXT-Agritech-Platform/1.0',
      'Accept': 'application/json',
    },
    signal: AbortSignal.timeout(15000),
  });

  const status = res.status;
  const statusText = res.statusText;
  try {
    const data = (await res.json()) as ApiResponse;
    return { status, statusText, data };
  } catch {
    return { status, statusText, data: {} };
  }
}

async function runOfficialGovVerification() {
  console.log('========================================');
  console.log('AGRINEXT — DATA.GOV.IN MANDI API VERIFICATION');
  console.log('========================================\n');

  const apiKey = (process.env.DATA_GOV_API_KEY || '').trim();

  if (!apiKey) {
    console.error('❌ Error: DATA_GOV_API_KEY is not set or empty in backend/.env');
    process.exit(1);
  }

  console.log('API Key Status: Configured in backend/.env (Key value is protected & hidden)');
  console.log(`Endpoint: ${BASE_URL}\n`);

  let basicHttpStatus = 'N/A';
  let basicRecordsCount = 0;
  let availableFields: string[] = [];
  let newestArrivalDate = 'N/A';
  let officialDataReceived = 'NO';

  let wheatHttpStatus = 'N/A';
  let wheatRecordsCount = 0;

  let rajasthanHttpStatus = 'N/A';
  let rajasthanRecordsCount = 0;

  let combinedHttpStatus = 'N/A';
  let combinedRecordsCount = 0;

  // 1. BASIC REQUEST (limit=10)
  console.log('--- TEST 1: Basic Request (limit=10) ---');
  try {
    const res1 = await fetchFromDataGov(apiKey, { limit: '10' });
    basicHttpStatus = `${res1.status} ${res1.statusText}`;
    console.log(`HTTP Status: ${basicHttpStatus}`);

    if (res1.status === 200) {
      const records = res1.data.records || [];
      basicRecordsCount = records.length;
      console.log(`Total records in catalog: ${res1.data.total ?? 'N/A'}`);
      console.log(`Records returned in batch: ${basicRecordsCount}`);

      if (records.length > 0) {
        officialDataReceived = 'YES';
        availableFields = Object.keys(records[0]);
        console.log(`Available record fields: ${availableFields.join(', ')}`);

        // Find newest date
        const dates = records.map((r) => r.arrival_date).filter((d): d is string => !!d);
        if (dates.length > 0) {
          newestArrivalDate = dates.sort().reverse()[0];
        }

        console.log('\nSample Live Government Records:');
        records.slice(0, 3).forEach((r, idx) => {
          console.log(`[Record #${idx + 1}] State: ${r.state} | District: ${r.district} | Market: ${r.market} | Commodity: ${r.commodity} | Variety: ${r.variety} | Grade: ${r.grade} | Modal: ₹${r.modal_price} | Date: ${r.arrival_date}`);
        });
      }
    } else {
      console.log(`Server response: ${JSON.stringify(res1.data)}`);
    }
  } catch (err: any) {
    console.error(`Basic request failed: ${err.message}`);
  }

  // 2. WHEAT FILTER (limit=10)
  console.log('\n--- TEST 2: Commodity Filter (Wheat) ---');
  try {
    const res2 = await fetchFromDataGov(apiKey, {
      limit: '10',
      'filters[commodity]': 'Wheat',
    });
    wheatHttpStatus = `${res2.status} ${res2.statusText}`;
    console.log(`HTTP Status: ${wheatHttpStatus}`);
    if (res2.status === 200) {
      const records = res2.data.records || [];
      wheatRecordsCount = records.length;
      console.log(`Records returned: ${wheatRecordsCount}`);
      records.slice(0, 2).forEach((r, idx) => {
        console.log(`[Wheat #${idx + 1}] ${r.commodity} (${r.variety}) @ ${r.market} (${r.district}, ${r.state}) — Modal: ₹${r.modal_price}, Date: ${r.arrival_date}`);
      });
    }
  } catch (err: any) {
    console.error(`Wheat filter failed: ${err.message}`);
  }

  // 3. RAJASTHAN FILTER (limit=10)
  console.log('\n--- TEST 3: State Filter (Rajasthan) ---');
  try {
    let res3 = await fetchFromDataGov(apiKey, {
      limit: '10',
      'filters[state.keyword]': 'Rajasthan',
    });
    if (res3.status === 200 && (!res3.data.records || res3.data.records.length === 0)) {
      res3 = await fetchFromDataGov(apiKey, {
        limit: '10',
        'filters[state]': 'Rajasthan',
      });
    }
    rajasthanHttpStatus = `${res3.status} ${res3.statusText}`;
    console.log(`HTTP Status: ${rajasthanHttpStatus}`);
    if (res3.status === 200) {
      const records = res3.data.records || [];
      rajasthanRecordsCount = records.length;
      console.log(`Records returned: ${rajasthanRecordsCount}`);
      records.slice(0, 2).forEach((r, idx) => {
        console.log(`[Rajasthan #${idx + 1}] ${r.commodity} (${r.variety}) @ ${r.market} (${r.district}) — Modal: ₹${r.modal_price}, Date: ${r.arrival_date}`);
      });
    }
  } catch (err: any) {
    console.error(`Rajasthan filter failed: ${err.message}`);
  }

  // 4. RAJASTHAN + WHEAT COMBINED FILTER (limit=10)
  console.log('\n--- TEST 4: Combined Filter (Rajasthan + Wheat) ---');
  try {
    let res4 = await fetchFromDataGov(apiKey, {
      limit: '10',
      'filters[state.keyword]': 'Rajasthan',
      'filters[commodity]': 'Wheat',
    });
    if (res4.status === 200 && (!res4.data.records || res4.data.records.length === 0)) {
      res4 = await fetchFromDataGov(apiKey, {
        limit: '10',
        'filters[state]': 'Rajasthan',
        'filters[commodity]': 'Wheat',
      });
    }
    combinedHttpStatus = `${res4.status} ${res4.statusText}`;
    console.log(`HTTP Status: ${combinedHttpStatus}`);
    if (res4.status === 200) {
      const records = res4.data.records || [];
      combinedRecordsCount = records.length;
      console.log(`Records returned: ${combinedRecordsCount}`);
      records.forEach((r, idx) => {
        console.log(`[Rajasthan+Wheat #${idx + 1}] Market: ${r.market} (${r.district}) | Variety: ${r.variety} | Min: ₹${r.min_price} | Max: ₹${r.max_price} | Modal: ₹${r.modal_price} | Date: ${r.arrival_date}`);
      });
    }
  } catch (err: any) {
    console.error(`Combined filter failed: ${err.message}`);
  }

  // Check 50 records to determine the most recent arrival_date in the dataset
  try {
    const res50 = await fetchFromDataGov(apiKey, { limit: '50' });
    if (res50.status === 200 && res50.data.records) {
      const dates = res50.data.records.map((r) => r.arrival_date).filter((d): d is string => !!d);
      if (dates.length > 0) {
        newestArrivalDate = dates.sort().reverse()[0];
      }
    }
  } catch {}

  console.log('\n========================================');
  console.log('FINAL VERIFICATION SUMMARY');
  console.log('========================================');
  console.log(`Basic request HTTP status: ${basicHttpStatus}`);
  console.log(`Basic records returned: ${basicRecordsCount}`);
  console.log(`Wheat filter HTTP status: ${wheatHttpStatus}`);
  console.log(`Wheat records returned: ${wheatRecordsCount}`);
  console.log(`Rajasthan filter HTTP status: ${rajasthanHttpStatus}`);
  console.log(`Rajasthan records returned: ${rajasthanRecordsCount}`);
  console.log(`Combined (Rajasthan+Wheat) HTTP status: ${combinedHttpStatus}`);
  console.log(`Combined records returned: ${combinedRecordsCount}`);
  console.log(`Available fields: ${availableFields.join(', ')}`);
  console.log(`Newest arrival date: ${newestArrivalDate}`);
  console.log(`Official government data received: ${officialDataReceived}`);
  console.log('========================================');
}

runOfficialGovVerification().catch((err) => {
  console.error('[Verification Error]', err);
  process.exit(1);
});
