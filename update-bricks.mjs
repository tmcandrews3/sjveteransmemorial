import fs from 'fs';
import path from 'path';

const csvPath = path.join(process.cwd(), 'Memorial-Brick-Customer-List.csv');
const jsonPath = path.join(process.cwd(), 'public/data/bricks.json');

const csv = fs.readFileSync(csvPath, 'utf-8');
const lines = csv.trim().split('\n');
const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));

const bricks = [];

for (let i = 1; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;

  // Better CSV parsing that handles commas inside quotes
  const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
  const row = {};
  headers.forEach((h, idx) => {
    row[h] = (values[idx] || '').replace(/^"|"$/g, '').trim();
  });

  const designator = row.DESIGNATOR || row['DESIGNATOR'] || '';
  if (!designator || designator.length < 5) continue;

  const brickLines = [
    row['LINE1'] || row['LINE 1'] || '',
    row['LINE2'] || row['LINE 2'] || '',
    row['LINE3'] || row['LINE 3'] || '',
    row['LINE4'] || row['LINE 4'] || ''
  ].filter(l => l && l.trim() !== '' && l.trim() !== '0');

  if (brickLines.length === 0) continue;

  const sponsor = row.SPONSOR || row['SPONSOR'] || '';

  bricks.push({
    id: designator,
    lines: brickLines,
    sponsor: sponsor || undefined,
    designator: designator,
    side: designator.startsWith('S1') ? 'Right' : 'Left',
    section: parseInt(row.SECT) || 1,
    sectRow: parseInt(row['SECT ROW']) || 1,
    physicalRow: parseInt(row['ACT ROW']) || 1,
    purchased: true
  });
}

bricks.sort((a, b) => a.designator.localeCompare(b.designator));

fs.writeFileSync(jsonPath, JSON.stringify(bricks, null, 2), 'utf-8');

console.log(`✅ Success! Created ${bricks.length} clean bricks.`);
console.log(`First: ${bricks[0]?.designator}`);
console.log(`Last: ${bricks[bricks.length-1]?.designator}`);