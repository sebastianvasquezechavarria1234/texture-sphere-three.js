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

const textureLoader = new THREE.TextureLoader();
const exrLoader = new EXRLoader();

scene.background = textureLoader.load('./img/scene-bg.jpg');

const diffuseTexture = textureLoader.load('./img/texture/textures/marble_cliff_03_diff_4k.jpg');
const normalTexture = exrLoader.load('./img/texture/textures/marble_cliff_03_nor_gl_4k.exr');
const roughnessTexture = exrLoader.load('./img/texture/textures/marble_cliff_03_rough_4k.exr');
const displacementTexture = textureLoader.load('./img/texture/textures/marble_cliff_03_disp_4k.png');

const geometry = new THREE.SphereGeometry(2, 128, 128);

const material = new THREE.MeshStandardMaterial({
  map: diffuseTexture,
  normalMap: normalTexture,
  normalScale: new THREE.Vector2(1.5, 1.5),
  roughnessMap: roughnessTexture,
  roughness: 1.0,
  displacementMap: displacementTexture,
  displacementScale: 0.3,
  displacementBias: -0.1,
});

const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

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
