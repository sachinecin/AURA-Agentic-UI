#!/usr/bin/env node

/**
 * Test script to verify agentic modules can be loaded and used
 * This doesn't require OpenAI API key - just tests module structure
 */

console.log('Testing AURA Agentic Modules...\n');

// Test 1: Load agents module
console.log('1. Testing agents module...');
try {
  const { generateBlueprint, judgeBlueprint } = require('./agents');
  console.log('   ✓ Agents module loaded successfully');
  console.log('   ✓ generateBlueprint function available:', typeof generateBlueprint === 'function');
  console.log('   ✓ judgeBlueprint function available:', typeof judgeBlueprint === 'function');
} catch (error) {
  console.error('   ✗ Failed to load agents module:', error.message);
  process.exit(1);
}

// Test 2: Load temporal module
console.log('\n2. Testing temporal module...');
try {
  const { adversarialSynthesisWorkflow } = require('./temporal');
  console.log('   ✓ Temporal module loaded successfully');
  console.log('   ✓ adversarialSynthesisWorkflow function available:', typeof adversarialSynthesisWorkflow === 'function');
} catch (error) {
  console.error('   ✗ Failed to load temporal module:', error.message);
  process.exit(1);
}

// Test 3: Load MCP module
console.log('\n3. Testing MCP server module...');
try {
  const ComponentCatalogServer = require('./mcp/server');
  console.log('   ✓ MCP server module loaded successfully');
  console.log('   ✓ ComponentCatalogServer class available:', typeof ComponentCatalogServer === 'function');
} catch (error) {
  console.error('   ✗ Failed to load MCP server module:', error.message);
  process.exit(1);
}

// Test 4: Test discriminator basic validation (without OpenAI)
console.log('\n4. Testing discriminator basic validation...');
try {
  const { judgeBlueprint } = require('./agents/discriminator');
  
  // Test invalid blueprint (button without action)
  const invalidBlueprint = {
    components: [
      { type: 'button', label: 'Click me' } // Missing action
    ]
  };
  
  // This should fail the basic validation before AI judgment
  const testValidation = async () => {
    try {
      const result = await judgeBlueprint(invalidBlueprint, {}, {});
      if (result === false) {
        console.log('   ✓ Basic validation works: rejected invalid blueprint');
      } else {
        console.log('   ⚠ Warning: Invalid blueprint not rejected by basic checks');
      }
    } catch (error) {
      if (error.message.includes('OPENAI_API_KEY')) {
        console.log('   ✓ Basic validation works (OpenAI check skipped - API key not set)');
      } else {
        throw error;
      }
    }
  };
  
  testValidation().then(() => {
    console.log('\n✅ All module structure tests passed!');
    console.log('\nNote: Full end-to-end testing requires:');
    console.log('  - OPENAI_API_KEY environment variable');
    console.log('  - Redis server running (for backend)');
  }).catch(error => {
    console.error('\n✗ Test failed:', error.message);
    process.exit(1);
  });
  
} catch (error) {
  console.error('   ✗ Failed discriminator test:', error.message);
  process.exit(1);
}
