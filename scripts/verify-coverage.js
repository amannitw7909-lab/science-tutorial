const fs = require('fs');
const data = require('../assets/js/translations-data.js');
const dict = data.dict;
const html = fs.readFileSync('index.html', 'utf8');

function matchDynamic(text) {
  if (/^अध्याय\s*(\d+)\s*[•·]\s*विषय\s*(\d+)$/.test(text)) return 'Chapter';
  if (/^विषय\s*\d+$/.test(text)) return 'Topic';
  if (/^अध्याय\s*\d+$/.test(text)) return 'Chapter';
  if (text === 'अध्याय प्रगति:') return 'Chapter Progress:';
  if (text === 'अध्याय प्रगति') return 'Chapter Progress';
  if (text.startsWith('←') || text.endsWith('→')) return 'Nav';
  return null;
}

const views = [
  'view-home', 'view-solutions-home', 'view-df-block-home',
  'view-types-of-solutions', 'view-expressing-concentration',
  'view-solubility', 'view-raoults-law', 'view-ideal-nonideal',
  'view-colligative-properties', 'view-abnormal-molar-mass',
  'view-df-intro-and-series', 'view-df-electronic-configurations',
  'view-df-transition-properties', 'view-df-metallic-size-oxidation',
  'view-df-catalytic-and-colours', 'view-df-magnetic-alloys-complexes',
  'view-df-lanthanoids-and-contraction', 'view-df-actinoids-and-compounds'
];

let totalAll = 0;
let transAll = 0;
const unmatched = [];

views.forEach(v => {
  const re = new RegExp('id="' + v + '"[\\s\\S]*?(?=<div id="view-|$)');
  const match = html.match(re);
  if (!match) return;
  const chunk = match[0];
  let tot = 0;
  let tr = 0;
  const targetRegex = /<(h[1-4]|p|li|th|td|button|label)\b[^>]*>([\s\S]*?)<\/\1>/gi;
  let m;
  while ((m = targetRegex.exec(chunk)) !== null) {
    const raw = m[2].trim();
    if (/[\u0900-\u097F]/.test(raw) && !/<(div|section|article|table|ul|ol)/i.test(raw)) {
      tot++;
      const clean = raw.replace(/<[^>]+>/g, '').trim();
      const normH = raw.replace(/\s+/g, ' ').trim();
      const normC = clean.replace(/\s+/g, ' ').trim();
      if (dict[raw] || dict[clean] || dict[normH] || dict[normC] || matchDynamic(clean)) {
        tr++;
      } else {
        unmatched.push({ view: v, tag: m[1], raw: raw.slice(0, 60), clean: clean.slice(0, 60) });
      }
    }
  }
  totalAll += tot;
  transAll += tr;
  const pct = tot ? Math.round((tr / tot) * 100) : 100;
  console.log(`${v}: ${tr} of ${tot} translated (${pct}%)`);
});

console.log(`\n==========================================`);
console.log(`TOTAL COVERAGE: ${transAll} of ${totalAll} (${Math.round((transAll / totalAll) * 100)}%)`);
console.log(`UNMATCHED COUNT: ${unmatched.length}`);
if (unmatched.length > 0) {
  console.log('Unmatched items:', JSON.stringify(unmatched, null, 2));
}
