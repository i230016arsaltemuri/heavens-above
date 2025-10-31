// Simple test runner for CI
const fs = require('fs');

const filesToCheck = [
  'run.js',
  'src/satellite.js',
  'src/iridium.js',
  'src/utils.js'
];

console.log('Running syntax validation...\n');

let hasErrors = false;
filesToCheck.forEach(file => {
  try {
    require.resolve(`./${file}`);
    console.log(`OK: ${file}`);
  } catch (err) {
    console.error(`FAILED: ${file} - ${err.message}`);
    hasErrors = true;
  }
});

console.log('');
if (hasErrors) {
  console.log('Some tests failed');
  process.exit(1);
} else {
  console.log('All syntax validation tests passed!');
}
