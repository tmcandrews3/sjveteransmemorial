import fs from 'fs';

const csvFile = 'Memorial-Brick-Customer-List.csv';
const outputFile = 'public/data/bricks.json';

const data = fs.readFileSync(csvFile, 'utf-8');
const lines = data.trim().split(/\r?\n/);
const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, '').replace(/^\uFEFF/, ''));

const bricks = [];

for (let i = 1; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;

  const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
  const row = {};
  headers.forEach((h, idx) => {
    row[h] = (values[idx] || '').replace(/^"|"$/g, '').trim();
  });

  const designator = row.DESIGNATOR || '';
  if (!designator || designator.length < 4) continue;

  const side = designator.startsWith('S1') ? 'Right' : 'Left';

  const rawLines = [
    row.LINE1 || '',
    row.LINE2 || '',
    row.LINE3 || '',
    row.LINE4 || ''
  ];

  const brickLines = rawLines.filter(l => l && l !== '0' && l.length > 0);
  const isPurchased = brickLines.length > 0;

  bricks.push({
    id: designator,
    lines: brickLines,
    sponsor: (row.SPONSOR && row.SPONSOR !== '0') ? row.SPONSOR : '',
    designator,
    side,
    section: parseInt(row.SECT) || 1,
    sectRow: parseInt(row['SECT ROW']) || 1,
    purchased: isPurchased,
    searchText: isPurchased
      ? [...brickLines, row.SPONSOR || '', designator].filter(Boolean).join(' ')
      : designator
  });
}

bricks.sort((a, b) => a.designator.localeCompare(b.designator));

fs.writeFileSync(outputFile, JSON.stringify(bricks, null, 2));
console.log(`✅ Created ${bricks.length} bricks → ${outputFile}`);
console.log(`Purchased: ${bricks.filter(b => b.purchased).length}`);
console.log(`Available: ${bricks.filter(b => !b.purchased).length}`);