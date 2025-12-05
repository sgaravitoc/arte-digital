const zone1 = document.querySelector('.zone-1')
const zone2 = document.querySelector('.zone-2')
const zone3 = document.querySelector('.zone-3')
const zone4 = document.querySelector('.zone-4')
const toggleSprayBtn = document.getElementById('toggleSpray')
const toggleGlitchBtn = document.getElementById('toggleGlitch')
const toggleDerretirBtn = document.getElementById('toggleDerretir')
const resetBtn = document.getElementById('resetAll')
let sprayMode = true
let spraying = false
function rand(min, max) { return Math.random() * (max - min) + min }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)] }
const sprayPaletteEl = document.querySelector('.zone-3 .spray-palette')
let sprayColors = ['#ff9f1c','#ef476f','#06d6a0','#ffd166','#2ec4b6','#e71d36']
const defaultSprayColors = [...sprayColors]
let lavaInterval = null
let lavaFillInterval = null

const marioCanvas = document.querySelector('.zone-1 .mario-canvas')
const marioPreview = document.querySelector('.zone-1 .mario-preview')
const marioPalette = document.querySelector('.zone-1 .mario-palette')
const lanHostBtn = document.getElementById('lanHostBtn')
const lanJoinBtn = document.getElementById('lanJoinBtn')
const lanHostPanel = document.getElementById('lanHostPanel')
const lanJoinPanel = document.getElementById('lanJoinPanel')
const lanHostCode = document.getElementById('lanHostCode')
const lanHostAnswerInput = document.getElementById('lanHostAnswer')
const lanJoinOffer = document.getElementById('lanJoinOffer')
const lanJoinAnswer = document.getElementById('lanJoinAnswer')
const lanHostCopyBtn = document.getElementById('lanHostCopy')
const lanJoinCopyBtn = document.getElementById('lanJoinCopy')
const lanStatusEl = document.getElementById('lanStatus')
const CELL = 12
let PRE_CELL = document.body.classList.contains('amplificar-page') ? 16 : 6
const GRID_W = 16
const GRID_H = 16
const C = { R: '#d32f2f', B: '#1976d2', S: '#f5c2a7', Br: '#6d4c41', Y: '#ffd54f' }
let selectedColor = C.R
const marioPixels = []
function rect(color, x, y, w, h) { for (let ry = 0; ry < h; ry++) { for (let rx = 0; rx < w; rx++) { marioPixels.push({ x: x + rx, y: y + ry, color }) } } }
rect(C.R, 3, 0, 10, 2)
rect(C.R, 2, 2, 12, 1)
rect(C.Br, 2, 3, 3, 3)
rect(C.Br, 12, 3, 2, 3)
rect(C.Br, 5, 6, 6, 1)
rect(C.S, 5, 3, 6, 3)
rect(C.S, 6, 6, 4, 1)
rect(C.S, 7, 7, 2, 1)
rect(C.R, 5, 8, 6, 2)
rect(C.B, 5, 8, 2, 3)
rect(C.B, 9, 8, 2, 3)
rect(C.Y, 6, 9, 1, 1)
rect(C.Y, 10, 9, 1, 1)
rect(C.B, 5, 11, 6, 3)
rect(C.S, 3, 9, 2, 2)
rect(C.S, 11, 9, 2, 2)
rect(C.B, 6, 14, 2, 2)
rect(C.B, 9, 14, 2, 2)
rect(C.Br, 5, 15, 3, 1)
rect(C.Br, 9, 15, 3, 1)

if (marioPreview) { const wrap = document.createElement('div'); wrap.className = 'mario-preview-inner'; wrap.style.position = 'relative'; wrap.style.width = (PRE_CELL * GRID_W) + 'px'; wrap.style.height = (PRE_CELL * GRID_H) + 'px'; marioPreview.appendChild(wrap); for (const p of marioPixels) { const d = document.createElement('div'); d.className = 'mario-pre-pixel'; d.style.left = (p.x * PRE_CELL) + 'px'; d.style.top = (p.y * PRE_CELL) + 'px'; d.style.background = p.color; wrap.appendChild(d) } }

function setDefaultPalette() {
  selectedColor = C.R
  document.querySelectorAll('.mario-palette .swatch').forEach(b => b.classList.remove('active'))
  const red = document.querySelector('.mario-palette .swatch[data-color="' + C.R + '"]')
  if (red) red.classList.add('active')
}

setDefaultPalette()

if (marioCanvas && marioPreview) {
  const grid = document.createElement('div')
  grid.className = 'mario-grid'
  marioCanvas.appendChild(grid)
  for (let y = 0; y < GRID_H; y++) {
    for (let x = 0; x < GRID_W; x++) {
      const cell = document.createElement('div')
      cell.className = 'mario-cell'
      cell.dataset.x = x
      cell.dataset.y = y
      grid.appendChild(cell)
    }
  }

  grid.addEventListener('click', e => {
    const cell = e.target.closest('.mario-cell')
    if (!cell) return
    const erase = selectedColor === null
    if (erase) {
      cell.style.background = ''
      cell.classList.remove('occupied')
      if (cell.dataset && dataChannels.length) { broadcastPaint(Number(cell.dataset.x), Number(cell.dataset.y), null) }
      return
    }
    cell.style.background = selectedColor
    cell.classList.add('occupied')
    if (cell.dataset && dataChannels.length) { broadcastPaint(Number(cell.dataset.x), Number(cell.dataset.y), selectedColor) }
  })

  if (marioPalette) {
    marioPalette.querySelectorAll('.swatch').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.mario-palette .swatch').forEach(b => b.classList.remove('active'))
        btn.classList.add('active')
        if (btn.dataset.erase === 'true') {
          selectedColor = null
        } else {
          selectedColor = btn.dataset.color
        }
      })
    })
  }
}

function spawnLava() { let lava = zone2.querySelector('.lava'); if (!lava) { lava = document.createElement('div'); lava.className = 'lava'; zone2.appendChild(lava) } let pool = zone2.querySelector('.lava-pool'); if (!pool) { pool = document.createElement('div'); pool.className = 'lava-pool'; lava.appendChild(pool) } pool.style.height = pool.style.height || '8%'; const rect = zone2.getBoundingClientRect(); for (let i = 0; i < 160; i++) { const s = document.createElement('div'); s.className = 'lava-stream'; s.style.left = Math.floor(rand(rect.width * 0.01, rect.width * 0.99)) + 'px'; s.style.width = Math.floor(rand(10, 34)) + 'px'; s.style.animationDuration = rand(1.4, 3.8) + 's'; s.style.animationDelay = rand(0, 1.8) + 's'; lava.appendChild(s) } for (let i = 0; i < 120; i++) { const d = document.createElement('div'); d.className = 'lava-droplet'; d.style.left = Math.floor(rand(rect.width * 0.02, rect.width * 0.98)) + 'px'; d.style.animationDuration = rand(1.4, 2.6) + 's'; d.style.animationDelay = rand(0, 1.6) + 's'; lava.appendChild(d) } for (let i = 0; i < 80; i++) { const sp = document.createElement('div'); sp.className = 'lava-spark'; sp.style.left = Math.floor(rand(rect.width * 0.05, rect.width * 0.95)) + 'px'; sp.style.animationDuration = rand(1.2, 2.2) + 's'; sp.style.animationDelay = rand(0, 1.2) + 's'; lava.appendChild(sp) } if (!lavaInterval) { lavaInterval = setInterval(() => { const rect2 = zone2.getBoundingClientRect(); for (let i = 0; i < 40; i++) { const s2 = document.createElement('div'); s2.className = 'lava-stream'; s2.style.left = Math.floor(rand(rect2.width * 0.01, rect2.width * 0.99)) + 'px'; s2.style.width = Math.floor(rand(10, 30)) + 'px'; s2.style.animationDuration = rand(1.2, 3.2) + 's'; s2.style.animationDelay = rand(0, 1.2) + 's'; lava.appendChild(s2) } for (let i = 0; i < 30; i++) { const d2 = document.createElement('div'); d2.className = 'lava-droplet'; d2.style.left = Math.floor(rand(rect2.width * 0.02, rect2.width * 0.98)) + 'px'; d2.style.animationDuration = rand(1.2, 2.2) + 's'; d2.style.animationDelay = rand(0, 1.2) + 's'; lava.appendChild(d2) } for (let i = 0; i < 20; i++) { const sp2 = document.createElement('div'); sp2.className = 'lava-spark'; sp2.style.left = Math.floor(rand(rect2.width * 0.05, rect2.width * 0.95)) + 'px'; sp2.style.animationDuration = rand(1.0, 1.8) + 's'; sp2.style.animationDelay = rand(0, 1.0) + 's'; lava.appendChild(sp2) } }, 1800) } if (!lavaFillInterval) { lavaFillInterval = setInterval(() => { const current = parseFloat(pool.style.height || '8%'); const target = 42; const inc = rand(0.8, 2.2); const next = Math.min(current + inc, target); pool.style.height = next + '%'; if (next >= target) { clearInterval(lavaFillInterval); lavaFillInterval = null } }, 1200) } }
if (toggleDerretirBtn && zone2) { toggleDerretirBtn.addEventListener('click', () => { zone2.classList.toggle('derretir'); if (zone2.classList.contains('derretir')) { spawnLava() } else { const lava = zone2.querySelector('.lava'); if (lava) lava.remove(); if (lavaInterval) { clearInterval(lavaInterval); lavaInterval = null } if (lavaFillInterval) { clearInterval(lavaFillInterval); lavaFillInterval = null } } }) }

function spawnMosaic() { let cont = zone3 && zone3.querySelector('.mosaic'); if (!zone3) return; if (!cont) { cont = document.createElement('div'); cont.className = 'mosaic'; zone3.appendChild(cont) } const rect = zone3.getBoundingClientRect(); const tile = 24; const gap = 3; const cols = Math.max(1, Math.floor(rect.width / tile)); const rows = Math.max(1, Math.floor(rect.height / tile)); const colors = ['#f0e7d8','#d5c1a3','#b28c6e','#6d4c41','#3b3b3b','#9aa6b2']; cont.innerHTML = ''; for (let r = 0; r < rows; r++) { for (let c = 0; c < cols; c++) { const d = document.createElement('div'); d.className = 'tessera'; d.style.left = (c * tile + gap) + 'px'; d.style.top = (r * tile + gap) + 'px'; d.style.width = (tile - gap * 2) + 'px'; d.style.height = (tile - gap * 2) + 'px'; d.style.background = pick(colors); d.style.opacity = String(rand(0.7, 0.95)); d.style.transform = 'rotate(' + Math.floor(rand(-4, 4)) + 'deg)'; cont.appendChild(d) } } }
function addSprayDot(x, y) { const d = document.createElement('div'); d.className = 'spray-dot'; d.style.left = x + 'px'; d.style.top = y + 'px'; const palette = sprayColors.length ? sprayColors : defaultSprayColors; const color = pick(palette); d.style.background = 'radial-gradient(circle, ' + color + ' 0 40%, transparent 90%)'; d.style.boxShadow = '0 0 8px ' + color; zone3.appendChild(d) }
if (toggleSprayBtn) { toggleSprayBtn.addEventListener('click', () => { sprayMode = !sprayMode; toggleSprayBtn.textContent = 'Modo aerosol: ' + (sprayMode ? 'ON' : 'OFF') }) }
if (document.body.classList.contains('recuperar-page') && zone3) {
  spawnMosaic()
  window.addEventListener('resize', () => { spawnMosaic() })
  requestAnimationFrame(() => { spawnMosaic() })
  zone3.addEventListener('mousedown', () => { spraying = true })
  zone3.addEventListener('mouseup', () => { spraying = false })
  zone3.addEventListener('mouseleave', () => { spraying = false })
  zone3.addEventListener('mousemove', e => { if (!spraying || !sprayMode) return; const rect = zone3.getBoundingClientRect(); const baseX = e.clientX - rect.left; const baseY = e.clientY - rect.top; for (let i = 0; i < 18; i++) { const dx = rand(-18, 18), dy = rand(-18, 18); addSprayDot(baseX + dx, baseY + dy) } })
}
if (document.body.classList.contains('recuperar-page')) {
  document.querySelectorAll('.zone-3 .tags button').forEach(btn => { btn.addEventListener('click', () => { const rect = zone3.getBoundingClientRect(); const t = document.createElement('div'); t.className = 'tag'; t.textContent = btn.dataset.tag; t.style.left = Math.floor(rand(20, rect.width - 160)) + 'px'; t.style.top = Math.floor(rand(30, rect.height - 120)) + 'px'; const colors = sprayColors.length ? sprayColors : defaultSprayColors; t.style.color = pick(colors); const fonts = ['font-marker','font-rock','font-bangers','font-nosifer']; t.classList.add(pick(fonts)); t.style.fontSize = Math.floor(rand(36, 108)) + 'px'; t.style.transform = 'skew(' + Math.floor(rand(-12, 12)) + 'deg) rotate(' + Math.floor(rand(-10, 10)) + 'deg)'; t.style.textShadow = '0 2px 0 #000, 0 8px 12px rgba(0,0,0,0.6)'; t.style.webkitTextStroke = '2px rgba(0,0,0,0.85)'; zone3.appendChild(t) }) })
}
if (sprayPaletteEl) {
  sprayPaletteEl.addEventListener('mousedown', e => e.stopPropagation())
  sprayPaletteEl.addEventListener('mouseup', e => e.stopPropagation())
  sprayPaletteEl.querySelectorAll('.spray-can').forEach(can => {
    can.addEventListener('click', () => {
      can.classList.toggle('active')
      const active = [...sprayPaletteEl.querySelectorAll('.spray-can.active')]
      sprayColors = active.length ? active.map(c => c.dataset.color) : defaultSprayColors
    })
  })
}

function skull(color) { return `<svg viewBox="0 0 64 64" width="64" height="64"><circle cx="32" cy="28" r="20" fill="${color}"/><circle cx="24" cy="26" r="4" fill="#000"/><circle cx="40" cy="26" r="4" fill="#000"/><rect x="28" y="40" width="8" height="8" fill="#000"/><rect x="24" y="48" width="16" height="6" fill="#000"/></svg>` }
function angry(color) { return `<svg viewBox="0 0 64 64" width="64" height="64"><circle cx="32" cy="32" r="26" fill="${color}"/><path d="M20 26 L28 22" stroke="#000" stroke-width="4"/><path d="M44 26 L36 22" stroke="#000" stroke-width="4"/><circle cx="26" cy="30" r="4" fill="#000"/><circle cx="38" cy="30" r="4" fill="#000"/><path d="M24 44 Q32 56 40 44" stroke="#000" stroke-width="4" fill="none"/></svg>` }
function cross(color) { return `<svg viewBox="0 0 64 64" width="64" height="64"><rect x="14" y="26" width="36" height="12" transform="rotate(45 32 32)" fill="${color}"/><rect x="14" y="26" width="36" height="12" transform="rotate(-45 32 32)" fill="${color}"/></svg>` }
function warning(color) { return `<svg viewBox="0 0 64 64" width="64" height="64"><polygon points="32,8 60,56 4,56" fill="${color}"/><rect x="30" y="24" width="4" height="20" fill="#000"/><rect x="30" y="48" width="4" height="6" fill="#000"/></svg>` }
function ban(color) { return `<svg viewBox="0 0 64 64" width="64" height="64"><circle cx="32" cy="32" r="28" fill="none" stroke="${color}" stroke-width="10"/><line x1="18" y1="18" x2="46" y2="46" stroke="${color}" stroke-width="10"/></svg>` }
function noEntry(color) { return `<svg viewBox="0 0 64 64" width="64" height="64"><circle cx="32" cy="32" r="28" fill="${color}"/><rect x="12" y="28" width="40" height="8" fill="#000"/></svg>` }
function brokenHeart(color) { return `<svg viewBox="0 0 64 64" width="64" height="64"><path d="M32 56 L12 36 Q4 28 12 20 Q20 12 28 18 L32 22 L36 18 Q44 12 52 20 Q60 28 52 36 Z" fill="${color}"/><path d="M26 26 L32 34 L28 40 L36 48" stroke="#000" stroke-width="4" fill="none"/></svg>` }
function bomb(color) { return `<svg viewBox="0 0 64 64" width="64" height="64"><circle cx="28" cy="40" r="18" fill="${color}"/><rect x="40" y="18" width="8" height="12" fill="#000"/><path d="M48 18 C52 14 58 14 60 18" stroke="#ff3d00" stroke-width="3"/></svg>` }
function radiation(color) { return `<svg viewBox="0 0 64 64" width="64" height="64"><circle cx="32" cy="32" r="8" fill="#000"/><path d="M32 12 L40 24 L24 24 Z" fill="${color}"/><path d="M52 32 L40 40 L40 24 Z" fill="${color}"/><path d="M32 52 L24 40 L40 40 Z" fill="${color}"/></svg>` }
const svgIcons = [skull, cross, warning, ban, noEntry, brokenHeart, bomb, radiation]
if (toggleGlitchBtn && zone4) { toggleGlitchBtn.addEventListener('click', () => { zone4.classList.toggle('active') }) }
function spawnPixelArt() {
  let cont = zone4.querySelector('.pixel-art');
  if (!cont) { cont = document.createElement('div'); cont.className = 'pixel-art'; zone4.appendChild(cont) }
  cont.innerHTML = ''
  const rect = zone4.getBoundingClientRect();
  const colors = ['#ff3d00','#ef476f','#ffd166','#ffffff','#000000','#5f0f40','#9a031e'];
  const invader = [
    '0011001100',
    '0111111110',
    '1110111011',
    '1111111111',
    '1101111011',
    '0011001100',
    '0110000110'
  ];
  const star = [
    '000010000',
    '000111000',
    '111111111',
    '000111000',
    '000010000'
  ];
  const diamond = [
    '0001000',
    '0011100',
    '0111110',
    '1111111',
    '0111110',
    '0011100',
    '0001000'
  ];
  const bolt = [
    '0000110',
    '0001110',
    '0011100',
    '0000110',
    '0001110',
    '0011100'
  ];
  const arrow = [
    '0000100',
    '0001110',
    '0010101',
    '0100100',
    '1000100'
  ];
  const skullPix = [
    '00111100',
    '01100110',
    '11000011',
    '11011011',
    '11011011',
    '11111111',
    '10111101',
    '10111101',
    '00111100'
  ];
  const shapes = [invader, diamond, bolt, arrow, skullPix];
  function place(pattern, x, y, color, s) {
    for (let r = 0; r < pattern.length; r++) {
      const row = pattern[r];
      for (let c = 0; c < row.length; c++) {
        if (row[c] !== '1') continue;
        const px = document.createElement('div');
        px.className = 'pixel-sq';
        px.style.left = (x + c * s) + 'px';
        px.style.top = (y + r * s) + 'px';
        px.style.width = s + 'px';
        px.style.height = s + 'px';
        px.style.background = color;
        cont.appendChild(px);
      }
    }
  }
  const s = 10;
  let maxW = 0, maxH = 0;
  for (const pat of shapes) { if (pat[0].length > maxW) maxW = pat[0].length; if (pat.length > maxH) maxH = pat.length }
  const gap = 6;
  const tileW = maxW * s + gap * 2;
  const tileH = maxH * s + gap * 2;
  const cols = Math.max(1, Math.floor(rect.width / tileW));
  const rows = Math.max(1, Math.floor(rect.height / tileH));
  const offsetX = Math.floor((rect.width - cols * tileW) / 2);
  const offsetY = Math.floor((rect.height - rows * tileH) / 2);
  for (let ry = 0; ry < rows; ry++) {
    for (let cx = 0; cx < cols; cx++) {
      const pat = pick(shapes);
      const w = pat[0].length * s;
      const h = pat.length * s;
      const baseX = offsetX + cx * tileW;
      const baseY = offsetY + ry * tileH;
      const x = baseX + Math.floor((tileW - w) / 2);
      const y = baseY + Math.floor((tileH - h) / 2);
      place(pat, x, y, pick(colors), s);
    }
  }
}
function clamp(v, min, max) { return Math.max(min, Math.min(max, v)) }
function spawnStickerIconAt(x, y, scale) {
  const rect = zone4.getBoundingClientRect()
  const s = document.createElement('div')
  s.className = 'sticker'
  const color = pick(['#ffffff','#ffd166','#ef476f','#ff3d00','#00d4ff'])
  s.innerHTML = pick(svgIcons)(color)
  const cx = clamp(x, 0, rect.width)
  const cy = clamp(y, 0, rect.height)
  s.style.left = cx + 'px'
  s.style.top = cy + 'px'
  s.style.transform = 'translate(-50%,-50%) rotate(' + Math.floor(rand(-12, 12)) + 'deg) scale(' + scale + ')'
  zone4.appendChild(s)
}
function spawnStickerTextAt(x, y, scale) {
  const rect = zone4.getBoundingClientRect()
  const words = ['CAOS','VANDAL','PIXEL','ARTE','GLITCH','RUINA','NOISE','HACK']
  const fonts = ['Bangers','Permanent Marker','Rock Salt']
  const el = document.createElement('div')
  el.className = 'sticker text'
  el.textContent = pick(words)
  const color = pick(['#ffffff','#ffd166','#ef476f','#ff3d00','#00d4ff'])
  el.style.color = color
  const cx = clamp(x, 0, rect.width)
  const cy = clamp(y, 0, rect.height)
  el.style.left = cx + 'px'
  el.style.top = cy + 'px'
  el.style.fontFamily = pick(fonts) + ',cursive'
  el.style.fontSize = Math.floor(rand(84, 160)) + 'px'
  el.style.transform = 'translate(-50%,-50%) skew(' + Math.floor(rand(-6, 6)) + 'deg) rotate(' + Math.floor(rand(-8, 8)) + 'deg) scale(' + scale + ')'
  zone4.appendChild(el)
}
if (document.body.classList.contains('invertir-page') && zone4) {
  spawnPixelArt()
  zone4.addEventListener('click', e => {
    const rect = zone4.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    spawnStickerIconAt(x, y, rand(2.2, 3.6))
    const count = Math.floor(rand(3, 7))
    for (let i = 0; i < count; i++) {
      const dx = rand(-160, 160)
      const dy = rand(-160, 160)
      spawnStickerIconAt(x + dx, y + dy, rand(1.4, 2.6))
    }
  })
}

const dataChannels = []
let rtcPC = null
let isAmplificar = document.body.classList.contains('amplificar-page')
function waitIceComplete(pc) { return new Promise(resolve => { if (pc.iceGatheringState === 'complete') { resolve() } else { pc.addEventListener('icegatheringstatechange', () => { if (pc.iceGatheringState === 'complete') resolve() }) ; setTimeout(resolve, 4000) } }) }
function bytesToBase64(bytes) { let binary = ''; const len = bytes.length; for (let i = 0; i < len; i++) { binary += String.fromCharCode(bytes[i]) } return btoa(binary) }
function base64ToBytes(b64) { const binary = atob(b64); const bytes = new Uint8Array(binary.length); for (let i = 0; i < binary.length; i++) { bytes[i] = binary.charCodeAt(i) } return bytes }
function toUrlSafe(b64) { return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/,'') }
function fromUrlSafe(b64url) { let b64 = b64url.replace(/-/g, '+').replace(/_/g, '/'); const pad = b64.length % 4; if (pad) b64 += '='.repeat(4 - pad); return b64 }
async function gzip(text) { if (!('CompressionStream' in window)) return null; const cs = new CompressionStream('gzip'); const writer = cs.writable.getWriter(); await writer.write(new TextEncoder().encode(text)); await writer.close(); const reader = cs.readable.getReader(); const chunks = []; let total = 0; while (true) { const {value, done} = await reader.read(); if (done) break; chunks.push(value); total += value.length } const out = new Uint8Array(total); let off = 0; for (const c of chunks) { out.set(c, off); off += c.length } return out }
async function gunzip(bytes) { if (!('DecompressionStream' in window)) return null; const ds = new DecompressionStream('gzip'); const writer = ds.writable.getWriter(); await writer.write(bytes); await writer.close(); const reader = ds.readable.getReader(); const chunks = []; let total = 0; while (true) { const {value, done} = await reader.read(); if (done) break; chunks.push(value); total += value.length } const out = new Uint8Array(total); let off = 0; for (const c of chunks) { out.set(c, off); off += c.length } return new TextDecoder().decode(out) }
async function encodeDesc(desc) {
  try { return btoa(JSON.stringify(desc)) } catch(e) { return btoa(unescape(encodeURIComponent(JSON.stringify(desc)))) }
}
async function decodeDesc(str) {
  try { return JSON.parse(atob(str)) } catch(e) { return JSON.parse(decodeURIComponent(escape(atob(str)))) }
}
function setLanStatus(t) { if (lanStatusEl) lanStatusEl.textContent = 'LAN: ' + t }
function onChannel(dc) { dataChannels.push(dc); dc.addEventListener('open', () => setLanStatus('Online')); dc.addEventListener('close', () => setLanStatus('Offline')); dc.addEventListener('message', ev => { try { const msg = JSON.parse(ev.data); if (msg.type === 'paint') { const sel = document.querySelector('.mario-cell[data-x="' + msg.x + '"][data-y="' + msg.y + '"]'); if (sel) { if (msg.color) { sel.style.background = msg.color; sel.classList.add('occupied') } else { sel.style.background = ''; sel.classList.remove('occupied') } } } if (msg.type === 'reset') { const gridEl = document.querySelector('.zone-1 .mario-grid'); if (gridEl) { gridEl.querySelectorAll('.mario-cell').forEach(c => { c.style.background = ''; c.classList.remove('occupied') }) } } } catch(e){} }) }
function broadcastPaint(x, y, color) { const payload = JSON.stringify({ type: 'paint', x, y, color }); dataChannels.forEach(dc => { if (dc.readyState === 'open') dc.send(payload) }) }
function broadcastReset() { const payload = JSON.stringify({ type: 'reset' }); dataChannels.forEach(dc => { if (dc.readyState === 'open') dc.send(payload) }) }
async function updateHostCode() { if (!rtcPC || !lanHostCode) return; try { const code = await encodeDesc(rtcPC.localDescription); lanHostCode.value = code } catch(e){} }
async function lanHost() { rtcPC = new RTCPeerConnection({ iceServers: [] }); const dc = rtcPC.createDataChannel('pixels'); onChannel(dc); const offer = await rtcPC.createOffer(); await rtcPC.setLocalDescription(offer); await updateHostCode(); try { if (lanHostCode && lanHostCode.value) await navigator.clipboard.writeText(lanHostCode.value) } catch(e){} rtcPC.addEventListener('icegatheringstatechange', updateHostCode); await waitIceComplete(rtcPC); await updateHostCode(); setLanStatus('Esperando respuesta') }
async function lanApplyAnswer() { if (!rtcPC) return; const txt = lanHostAnswerInput && lanHostAnswerInput.value.trim(); if (!txt) return; const ans = await decodeDesc(txt); await rtcPC.setRemoteDescription(ans); setLanStatus('Conectado') }
async function updateJoinCode() { if (!rtcPC || !lanJoinAnswer) return; try { const code = await encodeDesc(rtcPC.localDescription); lanJoinAnswer.value = code } catch(e){} }
async function lanJoin() { rtcPC = new RTCPeerConnection({ iceServers: [] }); rtcPC.addEventListener('datachannel', e => onChannel(e.channel)); const txt = lanJoinOffer && lanJoinOffer.value.trim(); if (!txt) return; const offer = await decodeDesc(txt); await rtcPC.setRemoteDescription(offer); const answer = await rtcPC.createAnswer(); await rtcPC.setLocalDescription(answer); await updateJoinCode(); try { if (lanJoinAnswer && lanJoinAnswer.value) await navigator.clipboard.writeText(lanJoinAnswer.value) } catch(e){} rtcPC.addEventListener('icegatheringstatechange', updateJoinCode); await waitIceComplete(rtcPC); await updateJoinCode(); setLanStatus('Respuesta lista') }
if (isAmplificar) {
  if (lanHostBtn) lanHostBtn.addEventListener('click', async () => { if (lanJoinPanel) lanJoinPanel.classList.add('hidden'); if (lanHostPanel) lanHostPanel.classList.remove('hidden'); await lanHost() })
  if (lanJoinBtn) lanJoinBtn.addEventListener('click', () => { if (lanHostPanel) lanHostPanel.classList.add('hidden'); if (lanJoinPanel) { lanJoinPanel.classList.remove('hidden'); if (lanJoinOffer) lanJoinOffer.value = ''; if (lanJoinAnswer) lanJoinAnswer.value = ''; setLanStatus('Pegue el código del host') } })
  if (lanHostAnswerInput) lanHostAnswerInput.addEventListener('input', async () => { await lanApplyAnswer() })
  if (lanJoinOffer) lanJoinOffer.addEventListener('input', async () => { await lanJoin() })
  if (lanHostCopyBtn) lanHostCopyBtn.addEventListener('click', async () => { try { if (lanHostCode && lanHostCode.value) await navigator.clipboard.writeText(lanHostCode.value) } catch(e){} })
  if (lanJoinCopyBtn) lanJoinCopyBtn.addEventListener('click', async () => { try { if (lanJoinAnswer && lanJoinAnswer.value) await navigator.clipboard.writeText(lanJoinAnswer.value) } catch(e){} })
}

if (resetBtn) {
  resetBtn.addEventListener('click', () => {
    if (marioCanvas && marioPreview) {
      marioCanvas.innerHTML = ''
      marioPreview.innerHTML = ''
      const wrap = document.createElement('div'); wrap.className = 'mario-preview-inner'; wrap.style.position = 'relative'; wrap.style.width = (PRE_CELL * GRID_W) + 'px'; wrap.style.height = (PRE_CELL * GRID_H) + 'px'; marioPreview.appendChild(wrap)
      for (const p of marioPixels) { const d = document.createElement('div'); d.className = 'mario-pre-pixel'; d.style.left = (p.x * PRE_CELL) + 'px'; d.style.top = (p.y * PRE_CELL) + 'px'; d.style.background = p.color; wrap.appendChild(d) }
      const newGrid = document.createElement('div'); newGrid.className = 'mario-grid'; marioCanvas.appendChild(newGrid); for (let y = 0; y < GRID_H; y++) { for (let x = 0; x < GRID_W; x++) { const cell = document.createElement('div'); cell.className = 'mario-cell'; cell.dataset.x = x; cell.dataset.y = y; newGrid.appendChild(cell) } }
      newGrid.addEventListener('click', e => { const cell = e.target.closest('.mario-cell'); if (!cell) return; const erase = selectedColor === null; if (erase) { cell.style.background = ''; cell.classList.remove('occupied'); if (cell.dataset && dataChannels.length) { broadcastPaint(Number(cell.dataset.x), Number(cell.dataset.y), null) } return } cell.style.background = selectedColor; cell.classList.add('occupied'); if (cell.dataset && dataChannels.length) { broadcastPaint(Number(cell.dataset.x), Number(cell.dataset.y), selectedColor) } })
      setDefaultPalette()
    if (dataChannels.length) { broadcastReset() }
    }
    if (zone2) {
      zone2.classList.remove('derretir')
      const lava = zone2.querySelector('.lava'); if (lava) lava.remove()
      if (lavaInterval) { clearInterval(lavaInterval); lavaInterval = null }
      if (lavaFillInterval) { clearInterval(lavaFillInterval); lavaFillInterval = null }
    }
    if (zone3) {
      ;[...zone3.querySelectorAll('.spray-dot,.tag')].forEach(n => n.remove())
      sprayMode = true
      if (toggleSprayBtn) toggleSprayBtn.textContent = 'Modo aerosol: ON'
    }
    if (zone4) {
      ;[...zone4.querySelectorAll('.sticker')].forEach(n => n.remove())
      zone4.classList.remove('active')
    }
    if (sprayPaletteEl) { sprayPaletteEl.querySelectorAll('.spray-can').forEach(n => n.classList.remove('active')) }
    sprayColors = defaultSprayColors
  })
}

const cards = document.querySelectorAll('.card')
if (cards.length) {
  cards.forEach(card => {
    card.addEventListener('click', e => {
      if (e.target.closest('.card-link')) return
      card.classList.toggle('flipped')
    })
  })
}
