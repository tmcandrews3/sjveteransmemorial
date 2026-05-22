// fix-bricks.js
const fs = require('fs');

const data = JSON.parse(fs.readFileSync('./public/data/bricks.json', 'utf8'));

const fixedBricks = data.map(brick => {
  let sectRow = brick.sectRow || brick['SECT ROW'];

  if (!sectRow) {
    const match = brick.designator.match(/R(\d+)B/);
    if (match) {
      const globalRow = parseInt(match[1]);

      if (brick.side === 'Left' && globalRow >= 83) {
        // Left side has extra blank rows after Section 7
        sectRow = globalRow - 82;
      } else {
        // Normal calculation: 12 rows per section
        sectRow = ((globalRow - 1) % 12) + 1;
      }
    }
  }

  return {
    ...brick,
    sectRow: sectRow || 1   // fallback
  };
});

fs.writeFileSync('./public/data/bricks.json', JSON.stringify(fixedBricks, null, 2));

console.log('✅ Fixed! Added sectRow to all bricks.');
console.log(`Total bricks processed: ${fixedBricks.length}`);