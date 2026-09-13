async function testApiEndpoint() {
  console.log('Testing GET http://localhost:5000/api/mandi ...');
  const res = await fetch('http://localhost:5000/api/mandi?limit=5');
  const json = await res.json();
  console.log('Status:', res.status);
  console.log('Data payload:', JSON.stringify(json, null, 2));

  console.log('\nTesting GET http://localhost:5000/api/mandi?state=Rajasthan&commodity=Wheat ...');
  const resFiltered = await fetch('http://localhost:5000/api/mandi?state=Rajasthan&commodity=Wheat');
  const jsonFiltered = await resFiltered.json();
  console.log('Status Filtered:', resFiltered.status);
  console.log('Filtered payload:', JSON.stringify(jsonFiltered, null, 2));
}

testApiEndpoint().catch(console.error);
