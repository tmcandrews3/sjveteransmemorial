import fs from 'fs';

const csvFile = 'Memorial-Brick-Customer-List.csv';
const outputFile = 'public/data/bricks.json';

console.log('Reading CSV and generating bricks.json...');

const data = fs.readFileSync(csvFile, 'utf-8');
const lines = data.trim().split('\n');
const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));

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
  if (!designator || designator.length < 5) continue;

  const side = designator.startsWith('S1') ? 'Right' : 'Left';
  const sectionMatch = designator.match(/S[12]R(\d+)B/);
  const section = sectionMatch ? parseInt(sectionMatch[1]) : 1;

  const brickLines = [
    row['LINE 1'] || row.LINE1 || '',
    row.LINE2 || '',
    row.LINE3 || '',
    row.LINE4 || ''
  ].filter(l => l && l !== '0' && l.length > 0);

  if (brickLines.length === 0) continue;

  bricks.push({
    id: designator,
    lines: brickLines,
    sponsor: (row.SPONSOR && row.SPONSOR !== '0' && row.SPONSOR !== '') ? row.SPONSOR : undefined,
    designator: designator,
    side: side,
    section: section,
    sectRow: parseInt(row['SECT ROW'] || row.SECTROW || row['Sect Row'] || 1),
    purchased: true
  });
}

bricks.sort((a, b) => a.designator.localeCompare(b.designator));

fs.writeFileSync(outputFile, JSON.stringify(bricks, null, 2));

console.log(`✅ Success! Created ${bricks.length} bricks.`);
console.log(`First: ${bricks[0]?.designator} (Section ${bricks[0]?.section}, Row ${bricks[0]?.sectRow})`);
console.log(`Last: ${bricks[bricks.length-1]?.designator}`);