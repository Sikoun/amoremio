const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// Minimal PNG generator in pure Node.js (no dependencies)
function createPng(width, height, drawPixel) {
  // PNG signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth (8 bits per channel)
  ihdr[9] = 6; // color type (RGBA)
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace
  const ihdrChunk = createChunk('IHDR', ihdr);

  // Raw image data with scanline filter byte (0)
  const rowSize = width * 4 + 1;
  const rawData = Buffer.alloc(height * rowSize);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // filter byte: None
    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      const [r, g, b, a] = drawPixel(x, y, width, height);
      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  const compressedData = zlib.deflateSync(rawData);
  const idatChunk = createChunk('IDAT', compressedData);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function createChunk(type, data) {
  const length = data.length;
  const buffer = Buffer.alloc(12 + length);
  buffer.writeUInt32BE(length, 0);
  buffer.write(type, 4, 4, 'ascii');
  data.copy(buffer, 8);
  const crc = crc32(buffer.subarray(4, 8 + length));
  buffer.writeUInt32BE(crc >>> 0, 8 + length);
  return buffer;
}

// Standard CRC32 table
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return crc ^ 0xffffffff;
}

// Draw a beautiful romantic rose/pink rounded icon with a heart shape inside
function drawAppIcon(x, y, w, h) {
  const cx = w / 2;
  const cy = h / 2;
  
  // Normalized coords [-1, 1]
  const nx = (x - cx) / (w / 2);
  const ny = (y - cy) / (h / 2);

  // Rounded square mask (squircle)
  const cornerRadius = 0.28;
  const dist = Math.pow(Math.abs(nx), 4) + Math.pow(Math.abs(ny), 4);
  if (dist > 1.05) {
    return [0, 0, 0, 0]; // Transparent background
  }

  // Gradient: top-left rose (#fb7185: 251, 113, 133) to bottom-right deep crimson (#be123c: 190, 18, 60)
  const grad = (nx + ny + 2) / 4; // 0 to 1
  let r = Math.round(251 * (1 - grad) + 190 * grad);
  let g = Math.round(113 * (1 - grad) + 18 * grad);
  let b = Math.round(133 * (1 - grad) + 60 * grad);

  // Heart formula: (x^2 + y^2 - 1)^3 - x^2 * y^3 <= 0
  // Scale coords for heart
  const hx = nx * 1.55;
  const hy = -ny * 1.55 + 0.15; // Invert y and shift slightly up
  const heartEq = Math.pow(hx * hx + hy * hy - 0.7, 3) - hx * hx * Math.pow(hy, 3);

  if (heartEq <= 0) {
    // White heart with slight soft glow
    return [255, 255, 255, 255];
  }

  return [r, g, b, 255];
}

const iconsDir = path.join(process.cwd(), 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

console.log('Generating PWA icons...');
const icon192 = createPng(192, 192, drawAppIcon);
fs.writeFileSync(path.join(iconsDir, 'icon-192.png'), icon192);

const icon512 = createPng(512, 512, drawAppIcon);
fs.writeFileSync(path.join(iconsDir, 'icon-512.png'), icon512);

// Also copy for apple-touch-icon
fs.writeFileSync(path.join(process.cwd(), 'public', 'apple-touch-icon.png'), icon192);

console.log('✓ Successfully generated icon-192.png and icon-512.png');
