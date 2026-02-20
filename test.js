const fs = require('fs');
const t = fs.readFileSync('traced.svg', 'utf8');
const m = t.match(/d="([^"]+)"/);
if (!m) process.exit(1);
const sub = m[1].split(/(?=M )/);
sub.forEach((p, i) => {
    let xs = [...p.matchAll(/[MLC]\s+([0-9.]+)\s+([0-9.]+)/g)].map(x => parseFloat(x[1]));
    let ys = [...p.matchAll(/[MLC]\s+([0-9.]+)\s+([0-9.]+)/g)].map(x => parseFloat(x[2]));
    if (xs.length > 0) {
        console.log(i, 'minX=' + Math.min(...xs), 'maxX=' + Math.max(...xs), 'minY=' + Math.min(...ys), 'maxY=' + Math.max(...ys));
    }
});
