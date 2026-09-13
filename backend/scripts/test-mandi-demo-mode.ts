import { MandiService } from '../src/services/mandi.service';
import { DemoMandiProvider } from '../src/services/mandi/demoMandiProvider';
import { DataGovMandiProvider } from '../src/services/mandi/dataGovMandiProvider';

async function runMandiDemoVerification() {
  console.log('========================================');
  console.log('AGRINEXT — MANDI DEMO MODE VERIFICATION');
  console.log('========================================\n');

  let providerAbstractionPassed = false;
  let govtApiNotConnected = false;
  let disclaimerVerified = false;
  let all9FieldsVerified = false;
  let stateFilterPassed = false;
  let districtFilterPassed = false;
  let marketFilterPassed = false;
  let commodityFilterPassed = false;
  let varietyFilterPassed = false;
  let gradeFilterPassed = false;
  let combinedFilterPassed = false;
  let filterOptionsPassed = false;
  let futureGovtProviderReady = false;

  // 1. PROVIDER ABSTRACTION CHECK
  console.log('[TEST 1] Active Provider Abstraction Check...');
  const activeProvider = MandiService.getActiveProvider();
  console.log(`Active Provider Name: ${activeProvider.name}`);
  console.log(`Is Demo Provider: ${activeProvider.isDemo}`);
  console.log(`Is Govt API Connected: ${activeProvider.isGovernmentApiConnected}`);

  if (activeProvider.name === 'DEMO / MOCK' && activeProvider.isDemo === true) {
    providerAbstractionPassed = true;
    console.log('✅ Provider abstraction successfully defaulted to DemoMandiProvider.');
  } else {
    console.error('❌ Provider abstraction did not default to DemoMandiProvider.');
  }

  if (activeProvider.isGovernmentApiConnected === false) {
    govtApiNotConnected = true;
    console.log('✅ Government API confirmed NOT connected (safe dev mode).');
  } else {
    console.error('❌ Government API unexpectedly marked as connected.');
  }

  // 2. FETCH RATES VIA ABSTRACTION & DISCLAIMER CHECK
  console.log('\n[TEST 2] Basic Mandi Rates Retrieval & Disclaimer Check...');
  const baseRes = await MandiService.getMandiRates();
  console.log(`Success: ${baseRes.success}`);
  console.log(`Provider: ${baseRes.provider}`);
  console.log(`Government API Connected: ${baseRes.governmentApiConnected}`);
  console.log(`Disclaimer: "${baseRes.disclaimer}"`);
  console.log(`Total Sample Records: ${baseRes.total}`);

  if (baseRes.disclaimer === 'Demo Data — Government API not connected') {
    disclaimerVerified = true;
    console.log('✅ Disclaimer exactly matches requirement: "Demo Data — Government API not connected"');
  } else {
    console.error(`❌ Unexpected disclaimer: ${baseRes.disclaimer}`);
  }

  // 3. 9 REQUIRED FIELDS VERIFICATION
  console.log('\n[TEST 3] Verify all 9 required fields on records...');
  const sampleRecords = baseRes.records;
  let recordsValid = sampleRecords.length > 0;

  for (const r of sampleRecords) {
    const hasCommodity = typeof r.commodity === 'string' && r.commodity.length > 0;
    const hasVariety = typeof r.variety === 'string' && r.variety.length > 0;
    const hasMarket = typeof r.market === 'string' && r.market.length > 0;
    const hasDistrict = typeof r.district === 'string' && r.district.length > 0;
    const hasState = typeof r.state === 'string' && r.state.length > 0;
    const hasMinPrice = typeof r.minPrice === 'number' && r.minPrice > 0;
    const hasMaxPrice = typeof r.maxPrice === 'number' && r.maxPrice > 0;
    const hasModalPrice = typeof r.modalPrice === 'number' && r.modalPrice > 0;
    const hasDate = typeof r.date === 'string' && r.date.length > 0;

    if (
      !hasCommodity ||
      !hasVariety ||
      !hasMarket ||
      !hasDistrict ||
      !hasState ||
      !hasMinPrice ||
      !hasMaxPrice ||
      !hasModalPrice ||
      !hasDate
    ) {
      recordsValid = false;
      console.error(`❌ Record missing required fields:`, r);
      break;
    }
  }

  if (recordsValid) {
    all9FieldsVerified = true;
    console.log(`✅ All ${sampleRecords.length} records contain the 9 required fields:`);
    console.log('   (Commodity, Variety, Market, District, State, Min Price, Max Price, Modal Price, Date)');
    console.log('   Sample Record:');
    const s = sampleRecords[0];
    console.log(`   - Commodity: ${s.commodity}`);
    console.log(`   - Variety:   ${s.variety}`);
    console.log(`   - Grade:     ${s.grade}`);
    console.log(`   - Market:    ${s.market}`);
    console.log(`   - District:  ${s.district}`);
    console.log(`   - State:     ${s.state}`);
    console.log(`   - Min Price: ₹${s.minPrice}`);
    console.log(`   - Max Price: ₹${s.maxPrice}`);
    console.log(`   - Modal:     ₹${s.modalPrice}`);
    console.log(`   - Date:      ${s.date}`);
  }

  // 4. 6-FILTER VERIFICATION
  console.log('\n[TEST 4] 6-Filter Dimension Verification...');

  // Filter 1: State
  const stateRes = await MandiService.getMandiRates({ state: 'Madhya Pradesh' });
  if (stateRes.records.length > 0 && stateRes.records.every((r) => r.state === 'Madhya Pradesh')) {
    stateFilterPassed = true;
    console.log(`✅ 1. State Filter (Madhya Pradesh): ${stateRes.records.length} records returned.`);
  } else {
    console.error('❌ State filter failed.');
  }

  // Filter 2: District
  const districtRes = await MandiService.getMandiRates({ district: 'Indore' });
  if (districtRes.records.length > 0 && districtRes.records.every((r) => r.district === 'Indore')) {
    districtFilterPassed = true;
    console.log(`✅ 2. District Filter (Indore): ${districtRes.records.length} records returned.`);
  } else {
    console.error('❌ District filter failed.');
  }

  // Filter 3: Market/Mandi
  const marketRes = await MandiService.getMandiRates({ market: 'Khanna Grain Market' });
  if (marketRes.records.length > 0 && marketRes.records.every((r) => r.market === 'Khanna Grain Market')) {
    marketFilterPassed = true;
    console.log(`✅ 3. Market/Mandi Filter (Khanna Grain Market): ${marketRes.records.length} records returned.`);
  } else {
    console.error('❌ Market filter failed.');
  }

  // Filter 4: Commodity
  const commodityRes = await MandiService.getMandiRates({ commodity: 'Wheat' });
  if (commodityRes.records.length > 0 && commodityRes.records.every((r) => r.commodity === 'Wheat')) {
    commodityFilterPassed = true;
    console.log(`✅ 4. Commodity Filter (Wheat): ${commodityRes.records.length} records returned.`);
  } else {
    console.error('❌ Commodity filter failed.');
  }

  // Filter 5: Variety
  const varietyRes = await MandiService.getMandiRates({ variety: 'Sharbati Gold (C-306)' });
  if (varietyRes.records.length > 0 && varietyRes.records.every((r) => r.variety === 'Sharbati Gold (C-306)')) {
    varietyFilterPassed = true;
    console.log(`✅ 5. Variety Filter (Sharbati Gold): ${varietyRes.records.length} records returned.`);
  } else {
    console.error('❌ Variety filter failed.');
  }

  // Filter 6: Grade
  const gradeRes = await MandiService.getMandiRates({ grade: 'Grade A' });
  if (gradeRes.records.length > 0 && gradeRes.records.every((r) => r.grade === 'Grade A')) {
    gradeFilterPassed = true;
    console.log(`✅ 6. Grade Filter (Grade A): ${gradeRes.records.length} records returned.`);
  } else {
    console.error('❌ Grade filter failed.');
  }

  // Combined Multi-Filter: State + Commodity + Grade
  const combinedRes = await MandiService.getMandiRates({
    state: 'Madhya Pradesh',
    commodity: 'Wheat',
    grade: 'Grade A',
  });
  if (
    combinedRes.records.length > 0 &&
    combinedRes.records.every(
      (r) => r.state === 'Madhya Pradesh' && r.commodity === 'Wheat' && r.grade === 'Grade A'
    )
  ) {
    combinedFilterPassed = true;
    console.log(`✅ Multi-Dimension Filter (MP + Wheat + Grade A): ${combinedRes.records.length} matching records.`);
  } else {
    console.error('❌ Multi-dimension filter failed.');
  }

  // 5. FILTER OPTIONS AGGREGATION
  console.log('\n[TEST 5] Filter Options Aggregation Check...');
  const options = await MandiService.getFilterOptions();
  if (
    options.states.length > 0 &&
    options.commodities.length > 0 &&
    options.grades.length > 0 &&
    Object.keys(options.districts).length > 0
  ) {
    filterOptionsPassed = true;
    console.log(`✅ Filter Options generated successfully:`);
    console.log(`   - States: ${options.states.join(', ')}`);
    console.log(`   - Commodities: ${options.commodities.join(', ')}`);
    console.log(`   - Grades: ${options.grades.join(', ')}`);
  } else {
    console.error('❌ Filter options aggregation failed.');
  }

  // 6. FUTURE DATA.GOV.IN PROVIDER INTEGRATION READINESS
  console.log('\n[TEST 6] Future Data.gov.in Provider Readiness Check...');
  const futureGovProvider = new DataGovMandiProvider();
  console.log(`Future Provider Name: ${futureGovProvider.name}`);
  console.log(`Is Demo: ${futureGovProvider.isDemo}`);
  console.log(`Has API Key configured in test env: ${futureGovProvider.isGovernmentApiConnected}`);

  // Test that calling DataGovProvider without key produces clear disconnected response rather than crash
  const mockUnconfiguredGovRes = await futureGovProvider.getMandiRates();
  if (
    mockUnconfiguredGovRes.provider === 'DATA_GOV_IN' &&
    mockUnconfiguredGovRes.governmentApiConnected === false
  ) {
    futureGovtProviderReady = true;
    console.log('✅ Future Data.gov.in Provider safely configured: ready for DATA_GOV_API_KEY in backend/.env');
  }

  // FINAL SUMMARY
  const allPassed =
    providerAbstractionPassed &&
    govtApiNotConnected &&
    disclaimerVerified &&
    all9FieldsVerified &&
    stateFilterPassed &&
    districtFilterPassed &&
    marketFilterPassed &&
    commodityFilterPassed &&
    varietyFilterPassed &&
    gradeFilterPassed &&
    combinedFilterPassed &&
    filterOptionsPassed &&
    futureGovtProviderReady;

  console.log('\n========================================');
  console.log(`VERIFICATION RESULT: ${allPassed ? 'ALL TESTS PASSED ✅' : 'FAILED ❌'}`);
  console.log('========================================');

  if (!allPassed) {
    process.exit(1);
  }
}

runMandiDemoVerification().catch((err) => {
  console.error('[Verification] Error running tests:', err);
  process.exit(1);
});
