import fs from 'fs';

const csv = fs.readFileSync('Memorial-Brick-Customer-List.csv', 'utf-8');
const lines = csv.split('\n');

const bricks = [];

for (let i = 1; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;

  const cols = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
  const designator = cols[5] ? cols[5].replace(/^"|"$/g, '').trim() : '';

  if (!designator || designator === '0' || designator.length < 4) continue;

  const side = designator.startsWith('S1') ? 'Right' : 'Left';

  bricks.push({
    id: designator,
    lines: [
      cols[0] ? cols[0].replace(/^"|"$/g, '').trim() : '',
      cols[1] ? cols[1].replace(/^"|"$/g, '').trim() : '',
      cols[2] ? cols[2].replace(/^"|"$/g, '').trim() : '',
      cols[3] ? cols[3].replace(/^"|"$/g, '').trim() : ''
    ].filter(l => l.length > 0),
    sponsor: cols[4] ? cols[4].replace(/^"|"$/g, '').trim() : '',
    designator: designator,
    side: side,
    section: parseInt(cols[9]) || 1,
    sectRow: parseInt(cols[10]) || 1,
    physicalRow: parseInt(cols[7]) || 1,
    purchased: true
  });
}

bricks.sort((a, b) => a.designator.localeCompare(b.designator));

fs.writeFileSync('public/data/bricks.json', JSON.stringify(bricks, null, 2));

console.log(`✅ Done! Created ${bricks.length} bricks.`);