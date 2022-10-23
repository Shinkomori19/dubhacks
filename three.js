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
  renderer.setClearColor(0x000000);
  renderer.autoClear = false;

  renderer.setSize(width, height);

  const earthScene = new THREE.Scene();
  const starScene = new THREE.Scene();

  let scenes = [starScene, earthScene];
  // set camera
  const camera = new THREE.PerspectiveCamera(45, width / height);
  camera.position.set(0, +400, +1000);
  const controls = new THREE.OrbitControls(camera, document.querySelector("body"));
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
    size:10,
    color:0xffffff,
  });

  const starMesh = new THREE.Points(starGeometry, starMaterial);
  starScene.add(starMesh);

  // create mesh
  const mesh = new THREE.Mesh(geometry, material);
  earthScene.add(mesh);

  // Light
  const ambientLight = new THREE.AmbientLight(0xFFFFFF);
  ambientLight.position.set(1, 1, 1);
  earthScene.add(ambientLight);

  tick();
  // let self: CanvasController = this;

  // executed ever frame
  function tick() {
    // control camera
    controls.update();

    mesh.rotation.y += 0.003;
    // render

    scenes.forEach((scene) => {
      renderer.clearDepth();
      renderer.render(scene, camera);
    }
    );

    requestAnimationFrame(tick);
  }
}