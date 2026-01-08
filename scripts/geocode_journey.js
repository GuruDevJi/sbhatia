// Geocode journey.json locations using Nominatim and write lat/lon back into the file
// Usage: node scripts/geocode_journey.js

const fs = require('fs');
const path = require('path');

const filePath = path.resolve('src/_data/journey.json');

function sleep(ms){ return new Promise(r=>setTimeout(r, ms)); }

async function geocode(q){
  const url = 'https://nominatim.openstreetmap.org/search?format=json&limit=1&q='+encodeURIComponent(q);
  const res = await fetch(url, { headers: { 'User-Agent': 'sbhatia-portfolio/1.0 (email@example.com)' } });
  if(!res.ok) throw new Error('HTTP '+res.status);
  const data = await res.json();
  if(data && data.length){
    return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon), display_name: data[0].display_name };
  }
  return null;
}

async function run(){
  const raw = fs.readFileSync(filePath, 'utf8');
  let arr = JSON.parse(raw);
  for(let i=0;i<arr.length;i++){
    const item = arr[i];
    if(item.lat && item.lon){
      console.log(`${item.id} already has coords: ${item.lat}, ${item.lon}`);
      continue;
    }
    const q = item.location || item.company;
    console.log(`Geocoding [${i+1}/${arr.length}] ${item.id} → ${q}`);
    try{
      const r = await geocode(q);
      if(r){
        item.lat = r.lat;
        item.lon = r.lon;
        item._display_name = r.display_name;
        console.log(`  -> ${r.lat}, ${r.lon} (${r.display_name})`);
      } else {
        console.log('  -> no results');
      }
    }catch(e){
      console.log('  -> error', e.message);
    }
    // Nominatim policy: be kind, avoid heavy rate; pause 1s between requests
    await sleep(1100);
  }
  fs.writeFileSync(filePath, JSON.stringify(arr, null, 2)+'\n', 'utf8');
  console.log('Updated', filePath);
}

run().catch(e=>{ console.error(e); process.exit(1); });
