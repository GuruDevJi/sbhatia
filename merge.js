const fs = require('fs');

const tracedPath = fs.readFileSync('traced.svg', 'utf8');
const match = tracedPath.match(/d="([^"]+)"/);
if (!match) throw new Error("Could not find path 'd' attr");
const dAttr = match[1];

const subPaths = dAttr.split(/(?=M)/);

const textPaths = subPaths.filter((p) => {
  const m = p.match(/M\s*([0-9.]+)\s+([0-9.]+)/);
  if (!m) return false;
  const x = parseFloat(m[1]);
  const y = parseFloat(m[2]);

  if (y <= 200) return false;
  if (x < 85) return false;

  return true;
}).join(' ');

const transformStr = 'translate(-37.834, -72.333) scale(1.296296)';

const mainORing = `
    M 105,17 h 110 a 85,85,0,0,1,0,170 h -110 a 85,85,0,0,1,0,-170 z
    M 105,42 h 110 a 60,60,0,0,1,0,120 h -110 a 60,60,0,0,1,0,-120 z
`;

// Mini O ring constructed explicitly to have the right thickness matching the text
// Center: (41, 214) ; W=62 ; H=36 ; r=18
// Outer path: starts at (41-13) = 28, y=196. Flat width is 26.
// M 28,196 h 26 a 18,18 0 0 1 0,36 h -26 a 18,18 0 0 1 0,-36 z
// Inner path: thickness=6. r=12. top y=202. Flat width is 26.
// M 28,202 h 26 a 12,12 0 0 1 0,24 h -26 a 12,12 0 0 1 0,-24 z
const miniO = `
  M 28,196 h 26 a 18,18 0 0 1 0,36 h -26 a 18,18 0 0 1 0,-36 z
  M 28,203 h 26 a 11,11 0 0 1 0,22 h -26 a 11,11 0 0 1 0,-22 z
`;

const fullSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 260" width="320" height="260">
  <path fill="#FF0000" fill-rule="evenodd" d="${mainORing}"/>
  <path fill="#FF0000" fill-rule="evenodd" d="${miniO}"/>
  <path transform="${transformStr}" fill="#FF0000" fill-rule="evenodd" d="${textPaths}"/>
</svg>`;

fs.writeFileSync('src/assets/images/oracle-full.svg', fullSvg);
