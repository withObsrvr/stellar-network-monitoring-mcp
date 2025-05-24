const { StellarNetworkApiClient } = require('./dist/api/client.js');
const { OrganizationTools } = require('./dist/tools/organizations.js');

async function testGetAllOrganizations() {
  try {
    console.log('Testing get_all_organizations tool...\n');
    
    const client = new StellarNetworkApiClient();
    const orgTools = new OrganizationTools(client);
    
    const result = await orgTools.handleGetAllOrganizations();
    
    console.log('Organizations in the Stellar Network:');
    console.log('=====================================\n');
    
    result.organizations.forEach((org, index) => {
      console.log(`${index + 1}. ${org.name}`);
      console.log(`   ID: ${org.id}`);
      console.log(`   Total Nodes: ${org.totalNodes}`);
      console.log(`   Validators: ${org.validators}`);
      if (org.website) console.log(`   Website: ${org.website}`);
      if (org.description) console.log(`   Description: ${org.description}`);
      console.log('');
    });
    
    console.log(`Summary:`);
    console.log(`- Total Organizations: ${result.summary.total}`);
    console.log(`- Total Nodes: ${result.summary.totalNodes}`);
    console.log(`- Total Validators: ${result.summary.totalValidators}`);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testGetAllOrganizations();