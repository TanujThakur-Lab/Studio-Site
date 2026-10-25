// The OGC Studio person: one stylised figure whose look and pose follow a "wellbeing" value.
// 0 = buried in admin (pale, hood up, hunched, phone in hand). 1 = living a good life (warm, upright, waving).
import * as THREE from 'three';

type Pose = {
  spine: number; head: number; headTilt: number;
  lArmZ: number; lArmX: number; lElbow: number;
  rArmZ: number; rArmX: number; rElbow: number;
};

// Keyframes along the wellbeing scale
const POSES: [number, Pose][] = [
  [0, { spine: 0.35, head: 0.45, headTilt: 0.12, lArmZ: 2.55, lArmX: -0.35, lElbow: 2.3, rArmZ: -0.25, rArmX: -1.05, rElbow: 1.45 }],
  [0.35, { spine: 0.28, head: 0.38, headTilt: 0.05, lArmZ: 0.1, lArmX: -0.1, lElbow: 0.15, rArmZ: -0.12, rArmX: -0.35, rElbow: 0.6 }],
  [0.7, { spine: 0.04, head: 0.02, headTilt: 0, lArmZ: 0.12, lArmX: 0, lElbow: 0.3, rArmZ: -0.12, rArmX: 0, rElbow: 0.3 }],
  [1, { spine: -0.06, head: -0.1, headTilt: -0.06, lArmZ: 0.18, lArmX: 0.05, lElbow: 0.35, rArmZ: -2.45, rArmX: 0, rElbow: 0.55 }],
];

const COLORS = {
  skinPale: new THREE.Color('#C9C4BF'), skinWarm: new THREE.Color('#D79B76'),
  topTired: new THREE.Color('#434954'), topWell: new THREE.Color('#E07A5F'),
  legsTired: new THREE.Color('#262A31'), legsWell: new THREE.Color('#D3BC98'),
  hair: new THREE.Color('#2B2321'),
};

const clamp = (x: number) => Math.min(1, Math.max(0, x));
const smooth = (a: number, b: number, x: number) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function poseAt(w: number): Pose {
  for (let i = 0; i < POSES.length - 1; i++) {
    const [a, pa] = POSES[i];
    const [b, pb] = POSES[i + 1];
    if (w <= b) {
      const t = smooth(0, 1, (w - a) / (b - a));
      const out = {} as Pose;
      for (const k of Object.keys(pa) as (keyof Pose)[]) out[k] = lerp(pa[k], pb[k], t);
      return out;
    }
  }
  return POSES[POSES.length - 1][1];
}

export function makeCharacter() {
  const skin = new THREE.MeshStandardMaterial({ roughness: 0.7 });
  const top = new THREE.MeshStandardMaterial({ roughness: 0.85 });
  const legs = new THREE.MeshStandardMaterial({ roughness: 0.9 });
  const dark = new THREE.MeshStandardMaterial({ color: '#15171C', roughness: 0.6 });
  const hairMat = new THREE.MeshStandardMaterial({ color: COLORS.hair, roughness: 0.9 });
  const bagMat = new THREE.MeshStandardMaterial({ color: '#5E5068', roughness: 1, transparent: true });

  const root = new THREE.Group();

  // legs and shoes
  const legGeo = new THREE.CapsuleGeometry(0.075, 0.55, 4, 10);
  for (const x of [-0.09, 0.09]) {
    const leg = new THREE.Mesh(legGeo, legs);
    leg.position.set(x, 0.42, 0);
    const shoe = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.07, 0.2), dark);
    shoe.position.set(x, 0.04, 0.04);
    root.add(leg, shoe);
  }

  // spine pivots at the hips
  const spine = new THREE.Group();
  spine.position.y = 0.76;
  root.add(spine);
  const chest = new THREE.Group();
  spine.add(chest);
  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.19, 0.34, 6, 16), top);
  torso.position.y = 0.3;
  chest.add(torso);

  // arms: shoulder pivot → upper arm → elbow pivot → forearm → hand
  function arm(side: 1 | -1) {
    const shoulder = new THREE.Group();
    shoulder.position.set(0.215 * side, 0.5, 0);
    const upper = new THREE.Mesh(new THREE.CapsuleGeometry(0.06, 0.24, 4, 10), top);
    upper.position.y = -0.16;
    const elbow = new THREE.Group();
    elbow.position.y = -0.32;
    const fore = new THREE.Mesh(new THREE.CapsuleGeometry(0.055, 0.22, 4, 10), top);
    fore.position.y = -0.14;
    const hand = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 10), skin);
    hand.position.y = -0.3;
    elbow.add(fore, hand);
    shoulder.add(upper, elbow);
    chest.add(shoulder);
    return { shoulder, elbow, hand };
  }
  const left = arm(1);
  const right = arm(-1);

  // the phone, glowing in the right hand
  const phone = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.15, 0.012), dark);
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.07, 0.135), new THREE.MeshBasicMaterial({ color: '#BFDBFE' }));
  screen.position.z = 0.007;
  phone.add(body, screen);
  phone.position.set(0, -0.36, 0.06);
  phone.rotation.x = -1.2;
  right.elbow.add(phone);
  const phoneLight = new THREE.PointLight('#93C5FD', 0.8, 1.2);
  phoneLight.position.set(0, 0.02, 0.1);
  phone.add(phoneLight);

  // neck and head
  const neck = new THREE.Group();
  neck.position.y = 0.56;
  chest.add(neck);
  const neckMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 0.12, 12), skin);
  neckMesh.position.y = 0.03;
  neck.add(neckMesh);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.17, 28, 20), skin);
  head.position.y = 0.2;
  neck.add(head);

  const face = new THREE.Group();
  face.position.copy(head.position);
  neck.add(face);
  const eyeGeo = new THREE.SphereGeometry(0.02, 10, 8);
  const eyes = [-0.06, 0.06].map((x) => {
    const e = new THREE.Mesh(eyeGeo, dark);
    e.position.set(x, 0.02, 0.155);
    face.add(e);
    return e;
  });
  const bags = [-0.06, 0.06].map((x) => {
    const b = new THREE.Mesh(new THREE.SphereGeometry(0.028, 10, 8), bagMat);
    b.scale.set(1.3, 0.45, 0.35);
    b.position.set(x, -0.018, 0.15);
    face.add(b);
    return b;
  });
  const arcGeo = new THREE.TorusGeometry(0.045, 0.008, 6, 18, Math.PI);
  const frown = new THREE.Mesh(arcGeo, dark);
  frown.position.set(0, -0.085, 0.152);
  const smile = new THREE.Mesh(arcGeo, dark);
  smile.rotation.z = Math.PI;
  smile.position.set(0, -0.05, 0.152);
  face.add(frown, smile);

  // hair: a neat cap, plus messy tufts that fade away
  const cap = new THREE.Mesh(new THREE.SphereGeometry(0.182, 24, 12, 0, Math.PI * 2, 0, 1.25), hairMat);
  cap.position.copy(head.position);
  cap.position.y += 0.01;
  cap.rotation.x = -0.45;
  neck.add(cap);
  const tufts = new THREE.Group();
  tufts.position.copy(head.position);
  for (let i = 0; i < 9; i++) {
    const t = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.12, 5), hairMat);
    const a = (i / 9) * Math.PI * 2;
    t.position.set(Math.cos(a) * 0.09, 0.15, Math.sin(a) * 0.09);
    t.rotation.set(Math.sin(a) * 0.9, a, Math.cos(a) * 0.9);
    tufts.add(t);
  }
  neck.add(tufts);

  // the hood: a shell open at the front
  const hood = new THREE.Mesh(
    new THREE.SphereGeometry(0.22, 24, 16, Math.PI / 2 + 1.25, Math.PI * 2 - 2.5, 0, Math.PI * 0.78),
    new THREE.MeshStandardMaterial({ color: COLORS.topTired, roughness: 0.9, side: THREE.DoubleSide }),
  );
  hood.position.set(0, 0.21, -0.015);
  neck.add(hood);

  let wellbeing = 0;
  let time = 0;

  function apply() {
    const w = wellbeing;
    const p = poseAt(w);
    spine.rotation.x = p.spine;
    neck.rotation.x = p.head;
    neck.rotation.z = p.headTilt;
    left.shoulder.rotation.set(p.lArmX, 0, p.lArmZ);
    left.elbow.rotation.x = -p.lElbow;
    right.shoulder.rotation.set(p.rArmX, 0, p.rArmZ);
    right.elbow.rotation.x = -p.rElbow;

    const colour = smooth(0.15, 0.85, w);
    skin.color.copy(COLORS.skinPale).lerp(COLORS.skinWarm, colour);
    top.color.copy(COLORS.topTired).lerp(COLORS.topWell, colour);
    legs.color.copy(COLORS.legsTired).lerp(COLORS.legsWell, colour);
    skin.emissive.set('#FFB27A').multiplyScalar(0.06 * colour);

    const phoneOn = 1 - smooth(0.4, 0.6, w);
    phone.scale.setScalar(Math.max(0.0001, phoneOn));
    phoneLight.intensity = 0.8 * phoneOn;

    const hoodOn = 1 - smooth(0.3, 0.55, w);
    hood.scale.setScalar(Math.max(0.0001, hoodOn));
    tufts.scale.setScalar(Math.max(0.0001, 1 - smooth(0.35, 0.75, w)));

    const awake = smooth(0.2, 0.8, w);
    eyes.forEach((e) => (e.scale.y = lerp(0.35, 1, awake)));
    bags.forEach((b) => ((b.material as THREE.MeshStandardMaterial).opacity = 1 - smooth(0.2, 0.7, w)));
    frown.scale.setScalar(Math.max(0.0001, 1 - smooth(0.35, 0.55, w)));
    smile.scale.setScalar(Math.max(0.0001, smooth(0.55, 0.8, w)));
  }

  /** Idle life: fast shallow breathing when stressed, slow breathing, a sway and a wave when well. */
  function update(dt: number) {
    time += dt;
    const w = wellbeing;
    const rate = lerp(3.4, 1.2, w);
    const depth = lerp(0.012, 0.025, w);
    chest.scale.set(1, 1 + Math.sin(time * rate) * depth, 1 + Math.sin(time * rate) * depth * 0.6);
    root.rotation.z = Math.sin(time * 0.9) * 0.025 * smooth(0.6, 1, w);
    const jitter = (1 - smooth(0, 0.4, w)) * 0.015;
    neck.rotation.y = Math.sin(time * 7.3) * jitter;
    const wave = smooth(0.85, 1, w);
    if (wave > 0) right.elbow.rotation.z = Math.sin(time * 5) * 0.35 * wave;
  }

  function setWellbeing(w: number) {
    wellbeing = clamp(w);
    apply();
  }
  setWellbeing(0);

  return { group: root, setWellbeing, update };
}
