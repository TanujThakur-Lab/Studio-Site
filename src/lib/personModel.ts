// Loads the rigged OGC person (made from the reference image, rigged and animated in Mixamo)
// and drives it with the same "wellbeing" dial as the stand-in character.
// Files expected in public/models/person/ (see README "The 3D person"):
//   character.fbx  the model, downloaded from Mixamo "With Skin"
//   stressed.fbx   wellbeing 0     e.g. Mixamo "Texting While Standing"
//   drained.fbx    wellbeing 0.35  e.g. Mixamo "Sad Idle"
//   idle.fbx       wellbeing 0.7   e.g. Mixamo "Happy Idle"
//   wave.fbx       wellbeing 1     e.g. Mixamo "Waving"
// Without the Mixamo files, the unrigged model (ogc-person.glb) is shown still;
// without that, the stand-in from character.ts is used.
import * as THREE from 'three';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { makeCharacter } from './character';

const BASE = '/models/person/';
const MOVES: [string, number][] = [
  ['stressed', 0],
  ['drained', 0.35],
  ['idle', 0.7],
  ['wave', 1],
];
const HEIGHT = 1.62; // match the stand-in, so scenes don't need re-framing

export type Person = {
  group: THREE.Group;
  setWellbeing: (w: number) => void;
  update: (dt: number) => void;
  kind: 'model' | 'static' | 'stand-in';
};

export async function loadPerson(): Promise<Person> {
  const loader = new FBXLoader();
  try {
    const model = await loader.loadAsync(BASE + 'character.fbx');
    const clips = await Promise.all(
      MOVES.map(([name]) => loader.loadAsync(BASE + name + '.fbx').then((f) => f.animations[0]).catch(() => undefined)),
    );

    // normalise size: Mixamo exports in centimetres, feet at the origin
    const box = new THREE.Box3().setFromObject(model);
    const scale = HEIGHT / (box.max.y - box.min.y);
    model.scale.setScalar(scale);
    model.position.y = -box.min.y * scale;

    // collect materials so the whole person can be graded from drained to healthy
    const materials: THREE.MeshStandardMaterial[] = [];
    model.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.castShadow = true;
      const list = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      list.forEach((m) => {
        const std = m as THREE.MeshStandardMaterial;
        if (std.color) materials.push(std);
      });
    });
    const originals = materials.map((m) => m.color.clone());

    const group = new THREE.Group();
    group.add(model);
    const mixer = new THREE.AnimationMixer(model);
    const actions = clips.map((clip) => {
      if (!clip) return undefined;
      const a = mixer.clipAction(clip);
      a.play();
      a.setEffectiveWeight(0);
      return a;
    });

    const drained = new THREE.Color('#8E9AAB'); // cool, grey, "hasn't seen daylight"
    const tmp = new THREE.Color();
    function setWellbeing(w: number) {
      w = Math.min(1, Math.max(0, w));
      // blend the two nearest moves
      MOVES.forEach(([, at], i) => {
        const next = MOVES[i + 1]?.[1] ?? 2;
        const prev = MOVES[i - 1]?.[1] ?? -1;
        let weight = 0;
        if (w >= at && w < next) weight = 1 - (w - at) / (next - at);
        else if (w < at && w > prev) weight = (w - prev) / (at - prev);
        if (i === MOVES.length - 1 && w >= at) weight = 1;
        actions[i]?.setEffectiveWeight(weight);
      });
      // colour: desaturated and cool when drained, the model's own colours when well
      const t = w * w * (3 - 2 * w);
      materials.forEach((m, i) => {
        tmp.copy(originals[i]);
        const grey = (tmp.r + tmp.g + tmp.b) / 3;
        tmp.lerp(new THREE.Color(grey, grey, grey).multiply(drained), 1 - t);
        m.color.copy(tmp);
      });
    }
    setWellbeing(0);
    return { group, setWellbeing, update: (dt) => mixer.update(dt), kind: 'model' };
  } catch {
    return loadStatic().catch(() => ({ ...makeCharacter(), kind: 'stand-in' as const }));
  }
}

/** The unrigged model from image-to-3D: right look, no skeleton, so it only breathes and sways. */
async function loadStatic(): Promise<Person> {
  const gltf = await new GLTFLoader().loadAsync(BASE + 'ogc-person.glb');
  const model = gltf.scene;
  const box = new THREE.Box3().setFromObject(model);
  const scale = HEIGHT / (box.max.y - box.min.y);
  model.scale.setScalar(scale);
  model.position.set(-(box.min.x + box.max.x) / 2 * scale, -box.min.y * scale, -(box.min.z + box.max.z) / 2 * scale);
  const group = new THREE.Group();
  const lean = new THREE.Group(); // pivot at the feet, so he can slump forward and straighten up
  lean.add(model);
  group.add(lean);

  const materials: THREE.MeshStandardMaterial[] = [];
  model.traverse((o) => {
    const m = (o as THREE.Mesh).material as THREE.MeshStandardMaterial | undefined;
    if (m && m.color) materials.push(m);
  });
  const drained = new THREE.Color('#9AA4B4');
  const white = new THREE.Color('#FFFFFF');
  let w = 0;
  let time = 0;
  const setWellbeing = (v: number) => {
    w = Math.min(1, Math.max(0, v));
    const t = w * w * (3 - 2 * w);
    materials.forEach((m) => m.color.copy(drained).lerp(white, t));
  };
  setWellbeing(0);
  return {
    group,
    setWellbeing,
    update(dt) {
      time += dt;
      const slump = (1 - w) * 0.12;
      lean.rotation.x = slump + Math.sin(time * (3.2 - 2 * w)) * 0.006;
      lean.rotation.z = Math.sin(time * 0.9) * 0.02 * w;
      lean.scale.y = 1 - (1 - w) * 0.03 + Math.sin(time * (3.2 - 2 * w)) * 0.004;
    },
    kind: 'static',
  };
}
