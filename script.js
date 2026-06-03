import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.set(0, 8, 25);

// Renderer
const renderer = new THREE.WebGLRenderer({
  antialias: true
});

renderer.setSize(
  window.innerWidth,
  window.innerHeight
);

renderer.setPixelRatio(
  Math.min(window.devicePixelRatio, 2)
);

document.body.appendChild(
  renderer.domElement
);

// Controls
const controls = new OrbitControls(
  camera,
  renderer.domElement
);

controls.enableDamping = true;

// ======================
// ROUND PARTICLE TEXTURE
// ======================

const canvas = document.createElement('canvas');
canvas.width = 128;
canvas.height = 128;

const ctx = canvas.getContext('2d');

const gradient = ctx.createRadialGradient(
  64,
  64,
  0,
  64,
  64,
  64
);

gradient.addColorStop(0, 'rgba(255,255,255,1)');
gradient.addColorStop(0.3, 'rgba(255,255,255,1)');
gradient.addColorStop(0.6, 'rgba(255,255,255,0.4)');
gradient.addColorStop(1, 'rgba(255,255,255,0)');

ctx.fillStyle = gradient;
ctx.fillRect(0, 0, 128, 128);

const particleTexture =
  new THREE.CanvasTexture(canvas);

// ======================
// GALAXY
// ======================

const particleCount = 25000;
const radius = 15;
const branches = 5;
const spin = 1;

const positions = new Float32Array(
  particleCount * 3
);

const colors = new Float32Array(
  particleCount * 3
);

const geometry =
  new THREE.BufferGeometry();

const insideColor =
  new THREE.Color('#00ffff');

const outsideColor =
  new THREE.Color('#ff00ff');

for (let i = 0; i < particleCount; i++) {

  const i3 = i * 3;

  const particleRadius =
    Math.random() * radius;

  const branchAngle =
    (i % branches) *
    ((Math.PI * 2) / branches);

  const spinAngle =
    particleRadius * spin;

  const randomX =
    (Math.random() - 0.5) *
    particleRadius *
    0.5;

  const randomY =
    (Math.random() - 0.5) *
    0.5;

  const randomZ =
    (Math.random() - 0.5) *
    particleRadius *
    0.5;

  positions[i3] =
    Math.cos(branchAngle + spinAngle) *
      particleRadius +
    randomX;

  positions[i3 + 1] =
    randomY;

  positions[i3 + 2] =
    Math.sin(branchAngle + spinAngle) *
      particleRadius +
    randomZ;

  const mixedColor =
    insideColor.clone();

  mixedColor.lerp(
    outsideColor,
    particleRadius / radius
  );

  colors[i3] =
    mixedColor.r;

  colors[i3 + 1] =
    mixedColor.g;

  colors[i3 + 2] =
    mixedColor.b;
}

geometry.setAttribute(
  'position',
  new THREE.BufferAttribute(
    positions,
    3
  )
);

geometry.setAttribute(
  'color',
  new THREE.BufferAttribute(
    colors,
    3
  )
);

// ======================
// MATERIAL
// ======================

const material =
  new THREE.PointsMaterial({
    size: 0.15,
    map: particleTexture,
    transparent: true,
    vertexColors: true,
    blending:
      THREE.AdditiveBlending,
    depthWrite: false
  });

// Galaxy

const galaxy =
  new THREE.Points(
    geometry,
    material
  );

scene.add(galaxy);

// Light

const ambientLight =
  new THREE.AmbientLight(
    0xffffff,
    2
  );

scene.add(ambientLight);

// Resize

window.addEventListener(
  'resize',
  () => {

    camera.aspect =
      window.innerWidth /
      window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
      window.innerWidth,
      window.innerHeight
    );
  }
);

// Animation

function animate() {

  requestAnimationFrame(
    animate
  );

  galaxy.rotation.y += 0.0015;

  controls.update();

  renderer.render(
    scene,
    camera
  );
}

animate();