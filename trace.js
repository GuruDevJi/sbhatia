const potrace = require('potrace');
const fs = require('fs');

potrace.trace('src/assets/images/oracleLogo.png', {
  color: '#FF0000',
  threshold: 200, // adjusting to ensure all text is caught
}, function(err, svg) {
  if (err) throw err;
  fs.writeFileSync('traced.svg', svg);
  console.log('generated traced.svg');
});
