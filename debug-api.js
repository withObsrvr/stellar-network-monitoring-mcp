const { StellarNetworkApiClient } = require('./dist/api/client.js');

async function debugApi() {
  try {
    console.log('Testing API endpoints...\n');
    
    const client = new StellarNetworkApiClient();
    
    console.log('1. Testing getAllOrganizations...');
    const orgResponse = await client.getAllOrganizations();
    console.log('Organizations response:', JSON.stringify(orgResponse, null, 2));
    
    console.log('\n2. Testing getNetworkInfo...');
    const networkResponse = await client.getNetworkInfo();
    console.log('Network response success:', networkResponse.success);
    if (networkResponse.success) {
      console.log('Network data keys:', Object.keys(networkResponse.data || {}));
    } else {
      console.log('Network error:', networkResponse.error);
    }
    
  } catch (error) {
    console.error('Debug error:', error.message);
  }
}

debugApi();