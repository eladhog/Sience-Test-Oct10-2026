/* ============================================================
   MONSTER BIO — hand-drawn SVG diagrams
   Every diagram takes a label map so the letters/numbers can be
   shuffled each time (no memorising "D is always mitochondria").
   ============================================================ */

const DC = { pink: '#FF2E88', purple: '#A855F7', acid: '#B9FF2E', cyan: '#22E0D6', warn: '#FFC53D',
             good: '#3DDC7F', bad: '#FF5470', dim: '#6B5A80', blue: '#4DC6FF', orange: '#FF8A3D', red: '#FF4D5E' };
const svgWrap = (w, h, inner) => `<svg class="dia" style="max-width:${w}px" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" role="img">${inner}</svg>`;
function tag(x, y, txt, ax, ay) {
  return `<line x1="${x}" y1="${y}" x2="${ax}" y2="${ay}" stroke="#F4ECFA" stroke-width="1.4" opacity=".75"/>` +
    `<circle cx="${ax}" cy="${ay}" r="3" fill="#F4ECFA"/>` +
    `<circle cx="${x}" cy="${y}" r="12" fill="#FFC53D"/><text x="${x}" y="${y + 0.5}" class="lbl">${txt}</text>`;
}

/* ---------- PLANT / ANIMAL CELL ---------- */
const CELL_PARTS = {
  plant: {
    'Cell wall':     { a: [424, 248], l: [452, 282] },
    'Cell membrane': { a: [409, 150], l: [452, 150] },
    'Cytoplasm':     { a: [335, 236], l: [345, 292] },
    'Mitochondria':  { a: [240, 236], l: [228, 292] },
    'Chloroplast':   { a: [96, 222],  l: [14, 250] },
    'Vacuole':       { a: [222, 110], l: [222, 13] },
    'Nucleus':       { a: [355, 92],  l: [452, 36] }
  },
  animal: {
    'Cell membrane': { a: [416, 150], l: [452, 150] },
    'Cytoplasm':     { a: [330, 220], l: [345, 292] },
    'Mitochondria':  { a: [215, 222], l: [200, 292] },
    'Nucleus':       { a: [222, 135], l: [222, 13] },
    'Vacuole':       { a: [112, 150], l: [14, 150] },
    'Ribosome':      { a: [330, 92],  l: [452, 36] }
  }
};
function mito(x, y, rot) {
  return `<g transform="translate(${x} ${y}) rotate(${rot || 0})"><ellipse rx="27" ry="13" fill="${DC.orange}"/>` +
    `<path d="M-20 0 q5 -9 10 0 t10 0 t10 0 t10 0" fill="none" stroke="#7A2E00" stroke-width="2"/></g>`;
}
function chloro(x, y, rot) {
  return `<g transform="translate(${x} ${y}) rotate(${rot || 0})"><ellipse rx="24" ry="12" fill="#3FAE4A"/>` +
    `<line x1="-14" y1="-3" x2="14" y2="-3" stroke="#1E5E26" stroke-width="2"/><line x1="-14" y1="3" x2="14" y2="3" stroke="#1E5E26" stroke-width="2"/></g>`;
}
function cellDiagram(kind, letters) {
  let s = '';
  if (kind === 'plant') {
    s += `<rect x="38" y="28" width="386" height="244" rx="14" fill="#1E3B22" stroke="#5BD16B" stroke-width="10"/>`;
    s += `<rect x="52" y="42" width="357" height="216" rx="9" fill="#2A1F38" stroke="#C9B6E4" stroke-width="2.5"/>`;
    s += `<rect x="135" y="70" width="175" height="130" rx="40" fill="#1E4A6B" stroke="#4DC6FF" stroke-width="2"/>`;
    s += `<circle cx="355" cy="92" r="31" fill="#7B3FB5" stroke="#C48BFF" stroke-width="2"/><circle cx="360" cy="88" r="9" fill="#C48BFF"/>`;
    s += chloro(96, 222, -20) + chloro(92, 96, 15) + chloro(350, 160, 70);
    s += mito(240, 236, 8) + mito(100, 160, -60);
  } else {
    s += `<ellipse cx="230" cy="150" rx="186" ry="118" fill="#2A1F38" stroke="#C9B6E4" stroke-width="3"/>`;
    s += `<circle cx="222" cy="135" r="38" fill="#7B3FB5" stroke="#C48BFF" stroke-width="2"/><circle cx="228" cy="130" r="11" fill="#C48BFF"/>`;
    s += `<circle cx="112" cy="150" r="17" fill="#1E4A6B" stroke="#4DC6FF" stroke-width="2"/><circle cx="300" cy="190" r="11" fill="#1E4A6B" stroke="#4DC6FF" stroke-width="2"/>`;
    s += mito(215, 222, 10) + mito(345, 135, -40) + mito(140, 90, 30);
    [[330, 92], [318, 104], [340, 108], [150, 205], [162, 214]].forEach(p => s += `<circle cx="${p[0]}" cy="${p[1]}" r="3.5" fill="${DC.warn}"/>`);
  }
  const P = CELL_PARTS[kind];
  Object.keys(letters).forEach(k => { const p = P[k]; s += tag(p.l[0], p.l[1], letters[k], p.a[0], p.a[1]); });
  return svgWrap(464, 306, s);
}

/* ---------- BLOOD VESSELS: artery → arteriole → capillaries → venule → vein ---------- */
const VESSEL_X = { Vein: 62, Venule: 158, Capillary: 230, Arteriole: 302, Artery: 398 };
function vesselDiagram(nums, flip) {
  let g = `<defs><linearGradient id="vg" x1="0" x2="1"><stop offset="0" stop-color="#2F6BFF"/><stop offset=".5" stop-color="#8A3FD1"/><stop offset="1" stop-color="#FF3B4E"/></linearGradient></defs>`;
  let s = `<line x1="12" y1="150" x2="132" y2="150" stroke="#2F6BFF" stroke-width="26" stroke-linecap="round"/>`;
  s += `<line x1="330" y1="150" x2="448" y2="150" stroke="#FF3B4E" stroke-width="20" stroke-linecap="round"/>`;
  [100, 150, 200].forEach(y => {
    s += `<path d="M130 150 C150 150 160 ${y} 186 ${y}" stroke="#4A5BEA" stroke-width="8" fill="none" stroke-linecap="round"/>`;
    s += `<path d="M332 150 C312 150 302 ${y} 276 ${y}" stroke="#E2405F" stroke-width="7" fill="none" stroke-linecap="round"/>`;
  });
  for (let i = 0; i < 5; i++) {
    const y = 95 + i * 27;
    s += `<path d="M184 ${y} q23 ${i % 2 ? 9 : -9} 46 0 t46 0" stroke="url(#vg)" stroke-width="3" fill="none"/>`;
  }
  [198, 222, 248, 262].forEach((x, i) => s += `<line x1="${x}" y1="${100 + (i % 2) * 20}" x2="${x + 6}" y2="${190 - (i % 2) * 20}" stroke="url(#vg)" stroke-width="2.5"/>`);
  /* flow arrows: artery → vein (right to left) */
  [400, 300, 210, 120, 50].forEach(x => s += `<path d="M${x + 22} 52 L${x} 52 M${x + 8} 45 L${x} 52 L${x + 8} 59" stroke="#F4ECFA" stroke-width="2.5" fill="none" opacity=".8"/>`);
  g += flip ? `<g transform="translate(460 0) scale(-1 1)">${s}</g>` : s;
  Object.keys(nums).forEach(k => {
    const x0 = VESSEL_X[k], x = flip ? 460 - x0 : x0;
    const ay = k === 'Capillary' ? 177 : k === 'Venule' || k === 'Arteriole' ? 200 : 150;
    const ax = k === 'Venule' || k === 'Arteriole' ? (flip ? 460 - (k === 'Venule' ? 168 : 292) : (k === 'Venule' ? 168 : 292)) : x;
    g += tag(x, 278, nums[k], ax, ay + (k === 'Vein' || k === 'Artery' ? 12 : 0));
  });
  return svgWrap(460, 296, g);
}

/* ---------- MITOSIS PHASES ---------- */
function xChromo(x, y, c) {
  return `<g stroke="${c}" stroke-width="4.5" stroke-linecap="round"><line x1="${x - 6}" y1="${y - 9}" x2="${x + 6}" y2="${y + 9}"/><line x1="${x + 6}" y1="${y - 9}" x2="${x - 6}" y2="${y + 9}"/></g><circle cx="${x}" cy="${y}" r="2.6" fill="#fff"/>`;
}
function vChromo(x, y, c, dir) {
  const d = dir * 9;
  return `<path d="M${x + d} ${y - 9} L${x} ${y} L${x + d} ${y + 9}" stroke="${c}" stroke-width="4.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
}
function chromatin(cx, cy, r) {
  let s = '';
  for (let i = 0; i < 4; i++) {
    const y = cy - r / 2 + i * r / 3;
    s += `<path d="M${cx - r * .7} ${y} q${r * .2} -6 ${r * .35} 0 t${r * .35} 0 t${r * .35} 0 t${r * .35} 0" stroke="#FF8FC4" stroke-width="2" fill="none"/>`;
  }
  return s;
}
const CHROMO_COLS = ['#FF5FA2', '#22E0D6', '#FFC53D', '#B9FF2E'];
function phaseDiagram(phase) {
  let s = '';
  const cellE = (cx, rx, ry) => `<ellipse cx="${cx}" cy="90" rx="${rx}" ry="${ry}" fill="#2A1F38" stroke="#C9B6E4" stroke-width="3"/>`;
  const spindle = (pts, lx, rx) => pts.map(p => `<line x1="${lx}" y1="90" x2="${p[0]}" y2="${p[1]}" stroke="#6B5A80" stroke-width="1.4"/><line x1="${rx}" y1="90" x2="${p[0]}" y2="${p[1]}" stroke="#6B5A80" stroke-width="1.4"/>`).join('');
  const centriole = x => `<rect x="${x - 5}" y="85" width="10" height="10" rx="2" fill="${DC.warn}"/>`;
  if (phase === 'Interphase') {
    s += cellE(130, 95, 70) + `<circle cx="130" cy="90" r="36" fill="#4A2A6B" stroke="#C48BFF" stroke-width="2.5"/>` + chromatin(130, 90, 34);
  } else if (phase === 'Prophase') {
    s += cellE(130, 95, 70) + `<circle cx="130" cy="90" r="40" fill="none" stroke="#C48BFF" stroke-width="2" stroke-dasharray="6 6"/>`;
    s += centriole(62) + centriole(198) + spindle([[100, 60], [100, 120], [160, 60], [160, 120]], 62, 198).replace(/stroke-width="1.4"/g, 'stroke-width="1" opacity=".5"');
    [[112, 72], [148, 78], [118, 110], [150, 106]].forEach((p, i) => s += xChromo(p[0], p[1], CHROMO_COLS[i]));
  } else if (phase === 'Metaphase') {
    s += cellE(130, 95, 70) + centriole(42) + centriole(218);
    const pts = [[130, 48], [130, 76], [130, 104], [130, 132]];
    s += spindle(pts, 42, 218);
    pts.forEach((p, i) => s += xChromo(p[0], p[1], CHROMO_COLS[i]));
  } else if (phase === 'Anaphase') {
    s += cellE(130, 108, 66) + centriole(30) + centriole(230);
    const ys = [52, 78, 104, 130];
    ys.forEach((y, i) => {
      s += `<line x1="30" y1="90" x2="92" y2="${y}" stroke="#6B5A80" stroke-width="1.4"/><line x1="230" y1="90" x2="168" y2="${y}" stroke="#6B5A80" stroke-width="1.4"/>`;
      s += vChromo(92, y, CHROMO_COLS[i], 1) + vChromo(168, y, CHROMO_COLS[i], -1);
    });
  } else if (phase === 'Telophase') {
    s += `<path d="M130 32 C60 10 14 50 14 90 C14 130 60 170 130 148 C200 170 246 130 246 90 C246 50 200 10 130 32 Z" fill="#2A1F38" stroke="#C9B6E4" stroke-width="3"/>`;
    s += `<circle cx="68" cy="90" r="30" fill="#4A2A6B" stroke="#C48BFF" stroke-width="2" stroke-dasharray="5 3"/>` + chromatin(68, 90, 26);
    s += `<circle cx="192" cy="90" r="30" fill="#4A2A6B" stroke="#C48BFF" stroke-width="2" stroke-dasharray="5 3"/>` + chromatin(192, 90, 26);
    s += `<path d="M130 30 L130 42 M130 150 L130 138" stroke="${DC.warn}" stroke-width="3"/>`;
  } else {
    s += cellE(68, 58, 60) + cellE(194, 58, 60);
    s += `<circle cx="68" cy="90" r="24" fill="#4A2A6B" stroke="#C48BFF" stroke-width="2"/>` + chromatin(68, 90, 22);
    s += `<circle cx="194" cy="90" r="24" fill="#4A2A6B" stroke="#C48BFF" stroke-width="2"/>` + chromatin(194, 90, 22);
  }
  return svgWrap(260, 180, s);
}

/* ---------- flow helpers used in lessons ---------- */
function chain(items, colour) {
  return `<div class="chain" style="--cc:${colour || DC.cyan}">` + items.map((t, i) =>
    `${i ? '<span class="carrow">&rarr;</span>' : ''}<span class="clink">${t}</span>`).join('') + '</div>';
}
