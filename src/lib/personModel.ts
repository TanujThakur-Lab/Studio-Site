// The OGC person: the 3D model made from the owner's reference image (public/models/person/ogc-person.glb),
// rigged here in code. A simple skeleton is fitted to the T-pose mesh, each vertex is weighted to its
// nearest bones, and the "wellbeing" dial (0 = buried in admin, 1 = a good life) poses the skeleton.
// If the model can't load, the toy stand-in from character.ts is used.
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { makeCharacter } from './character';

const URL_MODEL = '/models/person/ogc-person.glb';
const HEIGHT = 1.62; // match the stand-in, so scenes don't need re-framing

export type Person = {
  group: THREE.Group;
  setWellbeing: (w: number) => void;
  update: (dt: number) => void;
  /** amount 0–1 blends in a walk; phase is the stride position (radians), so the caller can tie steps to distance */
  setWalk?: (amount: number, phase: number) => void;
  kind: 'model' | 'stand-in';
};

export async function loadPerson(): Promise<Person> {
  try {
    return await loadRigged();
  } catch {
    return { ...makeCharacter(), kind: 'stand-in' };
  }
}

// ── Poses ────────────────────────────────────────────────────────────────
// Arm directions are given in the chest's frame: +x is his left, +y up, +z forward (towards the viewer).
type V = [number, number, number];
type Pose = { spine: number; chest: number; neck: number; lUp: V; lFore: V; rUp: V; rFore: V; phone: number };
const POSES: [number, Pose][] = [
  // Monday 7:58 am: one hand clutching his head, the other holding the phone up to his face
  [0, { spine: 0.22, chest: 0.12, neck: 0.38, lUp: [0.45, 0.62, 0.38], lFore: [-0.8, 0.35, 0.25], rUp: [-0.22, -0.45, 0.85], rFore: [0.3, 0.8, 0.5], phone: 1 }],
  // drained: arms hanging, phone low, head down
  [0.35, { spine: 0.2, chest: 0.1, neck: 0.42, lUp: [0.14, -0.98, 0.12], lFore: [0.04, -0.96, 0.28], rUp: [-0.14, -0.97, 0.18], rFore: [-0.05, -0.55, 0.83], phone: 1 }],
  // getting there: standing straight, arms relaxed
  [0.7, { spine: 0, chest: 0, neck: 0, lUp: [0.12, -0.99, 0.03], lFore: [0.06, -0.99, 0.1], rUp: [-0.12, -0.99, 0.03], rFore: [-0.06, -0.99, 0.1], phone: 0 }],
  // a good life: chest open, head up, waving
  [1, { spine: -0.04, chest: -0.03, neck: -0.08, lUp: [0.12, -0.99, 0.05], lFore: [0.06, -0.99, 0.12], rUp: [-0.62, 0.7, 0.12], rFore: [-0.12, 0.98, 0.1], phone: 0 }],
];
const smooth = (x: number) => x * x * (3 - 2 * x);
function poseAt(w: number): Pose {
  for (let i = 0; i < POSES.length - 1; i++) {
    const [a, pa] = POSES[i];
    const [b, pb] = POSES[i + 1];
    if (w <= b) {
      const t = smooth(Math.min(1, Math.max(0, (w - a) / (b - a))));
      const mix = (x: number, y: number) => x + (y - x) * t;
      const mixV = (x: V, y: V): V => [mix(x[0], y[0]), mix(x[1], y[1]), mix(x[2], y[2])];
      return {
        spine: mix(pa.spine, pb.spine), chest: mix(pa.chest, pb.chest), neck: mix(pa.neck, pb.neck),
        lUp: mixV(pa.lUp, pb.lUp), lFore: mixV(pa.lFore, pb.lFore), rUp: mixV(pa.rUp, pb.rUp), rFore: mixV(pa.rFore, pb.rFore),
        phone: mix(pa.phone, pb.phone),
      };
    }
  }
  return POSES[POSES.length - 1][1];
}

// ── Rigging ──────────────────────────────────────────────────────────────
async function loadRigged(): Promise<Person> {
  const gltf = await new GLTFLoader().loadAsync(URL_MODEL);
  gltf.scene.updateMatrixWorld(true);
  let src: THREE.Mesh | undefined;
  gltf.scene.traverse((o) => { if (!src && (o as THREE.Mesh).isMesh) src = o as THREE.Mesh; });
  if (!src) throw new Error('no mesh');

  // normalise: feet on the ground, centred, HEIGHT tall
  const geo = src.geometry.clone();
  geo.applyMatrix4(src.matrixWorld);
  geo.computeBoundingBox();
  const bb = geo.boundingBox!;
  geo.translate(-(bb.min.x + bb.max.x) / 2, -bb.min.y, -(bb.min.z + bb.max.z) / 2);
  const s = HEIGHT / (bb.max.y - bb.min.y);
  geo.scale(s, s, s);
  // smooth shading: the 3D tool's normals are faceted, which reads as blocky at small sizes
  geo.deleteAttribute('normal');
  geo.computeVertexNormals();
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const H = HEIGHT;
  const n = pos.count;

  // measure the T-pose: arm height and reach, torso width under the armpits
  let reach = 0;
  for (let i = 0; i < n; i++) reach = Math.max(reach, Math.abs(pos.getX(i)));
  let armY = 0, armZ = 0, armN = 0;
  for (let i = 0; i < n; i++) if (Math.abs(pos.getX(i)) > reach * 0.6) { armY += pos.getY(i); armZ += pos.getZ(i); armN++; }
  armY /= armN; armZ /= armN;
  let torso = 0;
  for (let i = 0; i < n; i++) {
    const y = pos.getY(i);
    if (y > armY - 0.16 * H && y < armY - 0.09 * H) torso = Math.max(torso, Math.abs(pos.getX(i)));
  }
  const shoulderX = torso * 0.85;
  const wristX = reach * 0.84;
  const elbowX = (shoulderX + wristX) / 2;
  const hipY = 0.5 * H, kneeY = 0.28 * H, ankleY = 0.05 * H, legX = 0.06 * H;
  const chestY = armY - 0.12 * H, neckY = armY + 0.03 * H, headY = neckY + 0.06 * H;

  // joints in model space
  const J: Record<string, THREE.Vector3> = {
    hips: new THREE.Vector3(0, hipY, 0), spine: new THREE.Vector3(0, hipY + 0.08 * H, 0), chest: new THREE.Vector3(0, chestY, 0),
    neck: new THREE.Vector3(0, neckY, 0), head: new THREE.Vector3(0, headY, 0), headTop: new THREE.Vector3(0, H, 0),
  };
  for (const [side, sx] of [['L', 1], ['R', -1]] as const) {
    J['shoulder' + side] = new THREE.Vector3(sx * shoulderX, armY, armZ);
    J['elbow' + side] = new THREE.Vector3(sx * elbowX, armY, armZ);
    J['wrist' + side] = new THREE.Vector3(sx * wristX, armY, armZ);
    J['hand' + side] = new THREE.Vector3(sx * reach, armY, armZ);
    J['upLeg' + side] = new THREE.Vector3(sx * legX, hipY, 0);
    J['knee' + side] = new THREE.Vector3(sx * legX, kneeY, 0);
    J['ankle' + side] = new THREE.Vector3(sx * legX, ankleY, 0);
    J['toe' + side] = new THREE.Vector3(sx * legX, 0, 0.05 * H);
  }

  // bones: [name, parent, end joint used for weighting]
  const DEFS: [string, string | null, string][] = [
    ['hips', null, 'spine'], ['spine', 'hips', 'chest'], ['chest', 'spine', 'neck'], ['neck', 'chest', 'head'], ['head', 'neck', 'headTop'],
    ['shoulderL', 'chest', 'elbowL'], ['elbowL', 'shoulderL', 'wristL'], ['wristL', 'elbowL', 'handL'],
    ['shoulderR', 'chest', 'elbowR'], ['elbowR', 'shoulderR', 'wristR'], ['wristR', 'elbowR', 'handR'],
    ['upLegL', 'hips', 'kneeL'], ['kneeL', 'upLegL', 'ankleL'], ['ankleL', 'kneeL', 'toeL'],
    ['upLegR', 'hips', 'kneeR'], ['kneeR', 'upLegR', 'ankleR'], ['ankleR', 'kneeR', 'toeR'],
  ];
  const bones: Record<string, THREE.Bone> = {};
  const list: THREE.Bone[] = [];
  for (const [name, parent] of DEFS) {
    const b = new THREE.Bone();
    b.name = name;
    const p = J[name].clone();
    if (parent) { p.sub(J[parent]); bones[parent].add(b); }
    b.position.copy(p);
    bones[name] = b;
    list.push(b);
  }

  // weights: each vertex follows its two nearest allowed bones
  const skinIndex = new Uint16Array(n * 4);
  const skinWeight = new Float32Array(n * 4);
  const seg = new THREE.Line3();
  const v = new THREE.Vector3();
  const closest = new THREE.Vector3();
  for (let i = 0; i < n; i++) {
    v.fromBufferAttribute(pos, i);
    const side = v.x >= 0 ? 'L' : 'R';
    const inArm = Math.abs(v.x) > shoulderX * 0.92 && v.y > chestY - 0.05 * H;
    const inLeg = v.y < hipY + 0.02 * H && !inArm;
    let best: [number, number][] = [];
    DEFS.forEach(([name, , end], bi) => {
      const limb = name.endsWith('L') || name.endsWith('R');
      if (limb && !name.endsWith(side)) return;
      const isArm = /shoulder|elbow|wrist/.test(name);
      const isLeg = /upLeg|knee|ankle/.test(name);
      if (isArm && !inArm) return;
      if (isLeg && !inLeg) return;
      if (inArm && !isArm && name !== 'chest') return;
      if (inLeg && !isLeg && name !== 'hips') return;
      seg.set(J[name], J[end]);
      seg.closestPointToPoint(v, true, closest);
      best.push([bi, closest.distanceTo(v)]);
    });
    best.sort((a, b) => a[1] - b[1]);
    best = best.slice(0, 2);
    const ws = best.map(([, d]) => 1 / Math.pow(d + 0.004, 4));
    const total = ws.reduce((a, b) => a + b, 0);
    best.forEach(([bi], k) => { skinIndex[i * 4 + k] = bi; skinWeight[i * 4 + k] = ws[k] / total; });
  }
  geo.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(skinIndex, 4));
  geo.setAttribute('skinWeight', new THREE.Float32BufferAttribute(skinWeight, 4));

  const material = (Array.isArray(src.material) ? src.material[0] : src.material) as THREE.MeshStandardMaterial;
  material.fog = false; // he stays clear and in colour, whatever the scene's haze
  if (material.map) { material.map.anisotropy = 8; material.map.needsUpdate = true; }
  const mesh = new THREE.SkinnedMesh(geo, material);
  mesh.add(bones.hips);
  mesh.bind(new THREE.Skeleton(list));
  mesh.frustumCulled = false;
  const group = new THREE.Group();
  group.add(mesh);

  // the phone, in his right hand while he's still buried in admin
  const phone = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.15, 0.075), new THREE.MeshStandardMaterial({ color: '#15171C' }));
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.13, 0.065), new THREE.MeshBasicMaterial({ color: '#BFDBFE' }));
  screen.rotation.y = Math.PI / 2;
  screen.position.x = 0.011;
  phone.add(body, screen);
  phone.position.set(-0.07, 0, 0.03);
  bones.wristR.add(phone);
  const glow = new THREE.PointLight('#93C5FD', 0.6, 0.9);
  glow.position.set(0.05, 0.05, 0.1);
  phone.add(glow);

  // posing
  const restL = new THREE.Vector3(1, 0, 0);
  const restR = new THREE.Vector3(-1, 0, 0);
  const d1 = new THREE.Vector3();
  const d2 = new THREE.Vector3();
  const q = new THREE.Quaternion();
  function aim(shoulder: THREE.Bone, elbow: THREE.Bone, rest: THREE.Vector3, up: V, fore: V) {
    d1.set(...up).normalize();
    shoulder.quaternion.setFromUnitVectors(rest, d1);
    d2.set(...fore).normalize().applyQuaternion(q.copy(shoulder.quaternion).invert());
    elbow.quaternion.setFromUnitVectors(rest, d2);
  }

  // tired, not grey: a light cool cast that keeps his own colours readable
  const drained = new THREE.Color('#C9D0DA');
  const white = new THREE.Color('#FFFFFF');
  let w = 0;
  let time = 0;
  let wave = 0;
  let walk = 0;
  let stride = 0;
  function apply() {
    const p = poseAt(w);
    const breath = Math.sin(time * (3.4 - 2.2 * w)) * (0.01 + 0.012 * w);
    bones.spine.rotation.x = p.spine;
    bones.chest.rotation.x = p.chest - breath;
    bones.neck.rotation.x = p.neck + Math.sin(time * 7.3) * 0.012 * (1 - Math.min(1, w * 2.5));
    const rFore: V = [p.rFore[0] + Math.sin(time * 5) * 0.35 * wave, p.rFore[1], p.rFore[2]];
    // walking: arms swing opposite the legs
    const swing = Math.sin(stride) * 0.38 * walk;
    const lUp: V = [p.lUp[0], p.lUp[1], p.lUp[2] - swing];
    const rUp: V = [p.rUp[0], p.rUp[1], p.rUp[2] + swing];
    aim(bones.shoulderL, bones.elbowL, restL, lUp, p.lFore);
    aim(bones.shoulderR, bones.elbowR, restR, rUp, rFore);
    // legs: hips swing forward and back, knees bend on the back swing
    const legL = Math.sin(stride) * 0.5 * walk;
    const legR = -legL;
    bones.upLegL.rotation.x = -legL;
    bones.upLegR.rotation.x = -legR;
    bones.kneeL.rotation.x = Math.max(0, -Math.sin(stride)) * 0.75 * walk;
    bones.kneeR.rotation.x = Math.max(0, Math.sin(stride)) * 0.75 * walk;
    bones.hips.position.y = J.hips.y + Math.abs(Math.sin(stride)) * 0.02 * walk;
    phone.scale.setScalar(Math.max(0.0001, p.phone));
    glow.intensity = 0.6 * p.phone;
    group.rotation.z = Math.sin(time * 0.9) * 0.015 * smooth(Math.max(0, w - 0.6) / 0.4);
  }
  function setWellbeing(v2: number) {
    w = Math.min(1, Math.max(0, v2));
    wave = smooth(Math.max(0, (w - 0.85) / 0.15));
    material.color.copy(drained).lerp(white, smooth(w));
    apply();
  }
  setWellbeing(0);
  function setWalk(amount: number, phase: number) {
    walk = Math.min(1, Math.max(0, amount));
    stride = phase;
    apply();
  }
  return { group, setWellbeing, setWalk, update(dt) { time += dt; apply(); }, kind: 'model' };
}
