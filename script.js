import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EXRLoader } from 'three/addons/loaders/EXRLoader.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a2e);

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

const textureLoader = new THREE.TextureLoader();
const exrLoader = new EXRLoader();

const diffuseTexture = textureLoader.load('./img/texture/textures/marble_cliff_03_diff_4k.jpg');
const normalTexture = exrLoader.load('./img/texture/textures/marble_cliff_03_nor_gl_4k.exr');
const roughnessTexture = exrLoader.load('./img/texture/textures/marble_cliff_03_rough_4k.exr');

const geometry = new THREE.SphereGeometry(2, 64, 64);

const material = new THREE.MeshStandardMaterial({
  map: diffuseTexture,
  normalMap: normalTexture,
  roughnessMap: roughnessTexture,
  roughness: 0.8,
});

const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

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
