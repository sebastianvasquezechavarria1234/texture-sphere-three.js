import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EXRLoader } from 'three/addons/loaders/EXRLoader.js';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 5);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.minDistance = 3;
controls.maxDistance = 48;

const textureLoader = new THREE.TextureLoader();
const exrLoader = new EXRLoader();

function createPlaceholder(r, g, b) {
  const canvas = document.createElement('canvas');
  canvas.width = 4;
  canvas.height = 4;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = `rgb(${r},${g},${b})`;
  ctx.fillRect(0, 0, 4, 4);
  return new THREE.CanvasTexture(canvas);
}

const bgPlaceholder = createPlaceholder(30, 30, 50);
const diffusePlaceholder = createPlaceholder(128, 128, 128);
const normalPlaceholder = createPlaceholder(128, 128, 255);
const roughnessPlaceholder = createPlaceholder(200, 200, 200);
const displacementPlaceholder = createPlaceholder(128, 128, 128);

const bgGeometry = new THREE.SphereGeometry(50, 64, 64);
const bgMaterial = new THREE.MeshBasicMaterial({
  map: bgPlaceholder,
  side: THREE.BackSide
});
const bgSphere = new THREE.Mesh(bgGeometry, bgMaterial);
scene.add(bgSphere);

const geometry = new THREE.SphereGeometry(2, 128, 128);

const material = new THREE.MeshStandardMaterial({
  map: diffusePlaceholder,
  normalMap: normalPlaceholder,
  normalScale: new THREE.Vector2(1.5, 1.5),
  roughnessMap: roughnessPlaceholder,
  roughness: 1.0,
  displacementMap: displacementPlaceholder,
  displacementScale: 0.3,
  displacementBias: -0.1,
});

const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

textureLoader.load('./img/scene-bg.jpg', (texture) => {
  bgMaterial.map = texture;
  bgMaterial.needsUpdate = true;
});

textureLoader.load('./img/texture/textures/marble_cliff_03_diff_4k.jpg', (texture) => {
  material.map = texture;
  material.needsUpdate = true;
});

exrLoader.load('./img/texture/textures/marble_cliff_03_nor_gl_4k.exr', (texture) => {
  material.normalMap = texture;
  material.needsUpdate = true;
});

exrLoader.load('./img/texture/textures/marble_cliff_03_rough_4k.exr', (texture) => {
  material.roughnessMap = texture;
  material.needsUpdate = true;
});

textureLoader.load('./img/texture/textures/marble_cliff_03_disp_4k.png', (texture) => {
  material.displacementMap = texture;
  material.needsUpdate = true;
});

const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

const backLight = new THREE.DirectionalLight(0xffffff, 0.6);
backLight.position.set(-5, 3, -5);
scene.add(backLight);

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate() {
  requestAnimationFrame(animate);
  sphere.rotation.y += 0.002;
  controls.update();
  renderer.render(scene, camera);
}

animate();
