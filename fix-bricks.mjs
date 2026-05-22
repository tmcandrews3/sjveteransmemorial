// fix-bricks.mjs
import { readFileSync, writeFileSync } from 'fs';

const rawData = readFileSync('./public/data/bricks.json', 'utf8');
const data = JSON.parse(rawData);

const fixedBricks = data.map(brick => {
  let sectRow = brick.sectRow || brick['SECT ROW'];

  if (!sectRow) {
    const match = brick.designator.match(/R(\d+)B/);
    if (match) {
      const globalRow = parseInt(match[1]);

      // Special handling for Left Side after Section 7
      if (brick.side === 'Left' && globalRow >= 83) {
        sectRow = globalRow - 82;
      } else {
        // Standard 12 rows per section
        sectRow = ((globalRow - 1) % 12) + 1;
      }
    }
  }

  return {
    ...brick,
    sectRow: sectRow || 1
  };
});

writeFileSync('./public/data/bricks.json', JSON.stringify(fixedBricks, null, 2));

console.log('✅ Successfully fixed bricks.json!');
console.log(`Processed ${fixedBricks.length} bricks.`);
console.log('sectRow field has been added to all entries.');