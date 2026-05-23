const fs = require('fs');
const bricks = JSON.parse(fs.readFileSync('public/data/bricks.json', 'utf-8'));
console.log('Total bricks:', bricks.length);
console.log('First 5:', bricks.slice(0,5).map(b => b.designator));
console.log('Last 5:', bricks.slice(-5).map(b => b.designator));