"use strict";
window.addEventListener('DOMContentLoaded', init);

const width = 960;
const height = 540;
function init() {
  // サイズを指定
  const width = 960;
  const height = 540;

  // renderer
  const canvasElement = document.querySelector('#myCanvas');
  const renderer = new THREE.WebGLRenderer({
    canvas: canvasElement,
  });
  renderer.setSize(width, height);

  const scene = new THREE.Scene();

  // set camera
  const camera = new THREE.PerspectiveCamera(45, width / height);
  camera.position.set(0, 0, +1000);
  const controls = new THREE.OrbitControls(camera, canvasElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.2;

  // Make a sphere
  const geometry = new THREE.SphereGeometry(300, 30, 30);
  // load image
  const loader = new THREE.TextureLoader();
  const texture = loader.load('imgs/earthmap.jpg');
  const material = new THREE.MeshStandardMaterial({
    map: texture,
  });

  // stars
  const SIZE = 3000;
  const LENGTH = 1000;
  const vertices = [];
  for (let i = 0; i < LENGTH; i++) {
    const x = SIZE * (Math.random() - 0.5);
    const y = SIZE * (Math.random() - 0.5);
    const z = SIZE * (Math.random() - 0.5);

    vertices.push(x,y,z)
  }

  const starGeometry = new THREE.BufferGeometry();
  starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  const starMaterial = new THREE.PointsMaterial({
    size:8,
    color:0xffffff,
  });

  const starMesh = new THREE.Points(starGeometry, starMaterial);
  scene.add(starMesh);

  // メッシュを作成
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // 平行光源
  const ambientLight = new THREE.AmbientLight(0xFFFFFF);
  ambientLight.position.set(1, 1, 1);
  scene.add(ambientLight);

  tick();

  // 毎フレーム時に実行されるループイベントです
  function tick() {
    controls.update();
    // レンダリング
    renderer.render(scene, camera);

    requestAnimationFrame(tick);
  }
}