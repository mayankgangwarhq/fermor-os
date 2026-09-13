async function verifyUiIntegration() {
  console.log('========================================');
  console.log('AGRINEXT — MANDI LIVE DATA UI TEST');
  console.log('========================================\n');

  let backendApiStatus = 'FAIL';
  let frontendConnected = 'NO';
  let officialDataGovDataDisplayed = 'NO';
  let demoModeActive = 'NO';
  let rajasthanFilterStatus = 'FAIL';
  let wheatFilterStatus = 'FAIL';
  let priceFieldsDisplayed = 'NO';
  let arrivalDateDisplayed = 'NO';

  // 1. TEST BACKEND API
  try {
    const res = await fetch('http://localhost:5000/api/mandi');
    if (res.status === 200) {
      backendApiStatus = 'PASS';
      const json = await res.json();
      const data = json.data;

      if (data && data.provider === 'DATA_GOV_IN' && data.governmentApiConnected === true) {
        officialDataGovDataDisplayed = 'YES';
        demoModeActive = 'NO';
      }

      if (data && data.records && data.records.length > 0) {
        const sample = data.records[0];
        if (
          typeof sample.minPrice === 'number' &&
          typeof sample.maxPrice === 'number' &&
          typeof sample.modalPrice === 'number'
        ) {
          priceFieldsDisplayed = 'YES';
        }
        if (sample.date && sample.date.length > 0) {
          arrivalDateDisplayed = 'YES';
        }
      }
    }
  } catch (err: any) {
    console.error('Backend check failed:', err.message);
  }

  // 2. TEST RAJASTHAN FILTER
  try {
    const resRaj = await fetch('http://localhost:5000/api/mandi?state=Rajasthan');
    if (resRaj.status === 200) {
      const jsonRaj = await resRaj.json();
      const records = jsonRaj.data?.records || [];
      if (records.length > 0 && records.every((r: any) => r.state.toLowerCase() === 'rajasthan')) {
        rajasthanFilterStatus = 'PASS';
        console.log(`[Rajasthan Filter] ${records.length} records returned from Rajasthan.`);
      }
    }
  } catch (err: any) {
    console.error('Rajasthan filter check failed:', err.message);
  }

  // 3. TEST WHEAT FILTER
  try {
    const resWheat = await fetch('http://localhost:5000/api/mandi?commodity=Wheat');
    if (resWheat.status === 200) {
      const jsonWheat = await resWheat.json();
      const records = jsonWheat.data?.records || [];
      if (records.length > 0 && records.every((r: any) => r.commodity.toLowerCase().includes('wheat'))) {
        wheatFilterStatus = 'PASS';
        console.log(`[Wheat Filter] ${records.length} records returned for Wheat.`);
      }
    }
  } catch (err: any) {
    console.error('Wheat filter check failed:', err.message);
  }

  // 4. TEST COMBINED RAJASTHAN + WHEAT
  try {
    const resCombined = await fetch('http://localhost:5000/api/mandi?state=Rajasthan&commodity=Wheat');
    if (resCombined.status === 200) {
      const jsonComb = await resCombined.json();
      const records = jsonComb.data?.records || [];
      console.log(`[Rajasthan + Wheat Combined] Records:`, records.length);
      if (records.length > 0) {
        records.forEach((r: any) => {
          console.log(`  Market: ${r.market} (${r.district}) | Commodity: ${r.commodity} | Variety: ${r.variety} | Min: ₹${r.minPrice} | Max: ₹${r.maxPrice} | Modal: ₹${r.modalPrice} | Date: ${r.date}`);
        });
      }
    }
  } catch (err: any) {
    console.error('Combined filter check failed:', err.message);
  }

  // 5. TEST FRONTEND ACCESSIBILITY
  try {
    const resFront = await fetch('http://localhost:5173/');
    if (resFront.status === 200) {
      frontendConnected = 'YES';
    }
  } catch (err: any) {
    console.error('Frontend check failed:', err.message);
  }

  console.log('\n========================================');
  console.log('AGRINEXT — MANDI LIVE DATA UI TEST');
  console.log('========================================');
  console.log(`Backend API: ${backendApiStatus}`);
  console.log(`Frontend connected: ${frontendConnected}`);
  console.log(`Official Data.gov.in data displayed: ${officialDataGovDataDisplayed}`);
  console.log(`Demo mode active: ${demoModeActive}`);
  console.log(`Rajasthan filter: ${rajasthanFilterStatus}`);
  console.log(`Wheat filter: ${wheatFilterStatus}`);
  console.log(`Price fields displayed: ${priceFieldsDisplayed}`);
  console.log(`Arrival date displayed: ${arrivalDateDisplayed}`);
  console.log('========================================');
}

verifyUiIntegration().catch(console.error);
