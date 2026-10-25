// Convert a single-mesh textured GLB (e.g. from Meshy) into OBJ + MTL + texture, ready to zip for Mixamo.
// usage: node tools/glb-to-obj.mjs <in.glb> <out-dir>
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const [input, outDir] = process.argv.slice(2);
const buf = readFileSync(input);
const jsonLen = buf.readUInt32LE(12);
const gltf = JSON.parse(buf.subarray(20, 20 + jsonLen).toString());
const binStart = 20 + jsonLen + 8;
const bin = buf.subarray(binStart);
mkdirSync(outDir, { recursive: true });

const SIZE = { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4 };
function read(accIndex) {
  const acc = gltf.accessors[accIndex];
  const view = gltf.bufferViews[acc.bufferView];
  const comps = SIZE[acc.type];
  const Arr = { 5126: Float32Array, 5125: Uint32Array, 5123: Uint16Array, 5121: Uint8Array }[acc.componentType];
  const stride = view.byteStride || comps * Arr.BYTES_PER_ELEMENT;
  const base = (view.byteOffset || 0) + (acc.byteOffset || 0);
  const out = [];
  for (let i = 0; i < acc.count; i++) {
    const row = [];
    for (let c = 0; c < comps; c++) {
      const off = base + i * stride + c * Arr.BYTES_PER_ELEMENT;
      const dv = new DataView(bin.buffer, bin.byteOffset + off, Arr.BYTES_PER_ELEMENT);
      row.push(Arr === Float32Array ? dv.getFloat32(0, true) : Arr === Uint32Array ? dv.getUint32(0, true) : Arr === Uint16Array ? dv.getUint16(0, true) : dv.getUint8(0));
    }
    out.push(row);
  }
  return out;
}

// the texture
const image = gltf.images[0];
const ext = image.mimeType === 'image/png' ? 'png' : 'jpg';
const iv = gltf.bufferViews[image.bufferView];
writeFileSync(join(outDir, `texture.${ext}`), bin.subarray(iv.byteOffset || 0, (iv.byteOffset || 0) + iv.byteLength));
writeFileSync(join(outDir, 'person.mtl'), `newmtl skin\nKd 1 1 1\nmap_Kd texture.${ext}\n`);

// geometry (node transforms ignored: Meshy exports the mesh at the origin)
const lines = ['mtllib person.mtl', 'o person', 'usemtl skin'];
let offset = 0;
for (const prim of gltf.meshes[0].primitives) {
  const pos = read(prim.attributes.POSITION);
  const nor = prim.attributes.NORMAL !== undefined ? read(prim.attributes.NORMAL) : null;
  const uv = prim.attributes.TEXCOORD_0 !== undefined ? read(prim.attributes.TEXCOORD_0) : null;
  const idx = read(prim.indices).map((r) => r[0]);
  pos.forEach((p) => lines.push(`v ${p[0]} ${p[1]} ${p[2]}`));
  uv?.forEach((t) => lines.push(`vt ${t[0]} ${1 - t[1]}`));
  nor?.forEach((n) => lines.push(`vn ${n[0]} ${n[1]} ${n[2]}`));
  for (let i = 0; i < idx.length; i += 3) {
    const f = [idx[i], idx[i + 1], idx[i + 2]].map((k) => k + 1 + offset);
    lines.push('f ' + f.map((k) => `${k}/${uv ? k : ''}/${nor ? k : ''}`).join(' '));
  }
  offset += pos.length;
}
writeFileSync(join(outDir, 'person.obj'), lines.join('\n'));
console.log(`wrote ${offset} vertices, texture.${ext}`);
