"use strict";
window.addEventListener('DOMContentLoaded', init);

function init() {
  // サイズを指定
  const width = 2000;
  const height = 900;

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
    const x = SIZE * (Math.random() - 0.5) + 10;
    const y = SIZE * (Math.random() - 0.5)+ 10;
    const z = SIZE * (Math.random() - 0.5)+ 10;

    vertices.push(x,y,z)
  }

  const starGeometry = new THREE.BufferGeometry();
  starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  const starMaterial = new THREE.PointsMaterial({
    size:8,
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

  // trees mesh test
  let trees = [];
  let pointGeometry = new  THREE.SphereBufferGeometry(0.1, 30, 30);
  const pointMaterial = new THREE.PointsMaterial({
    size:20,
    color:0xff0000,
  });
  const pointMesh = new THREE.Points(pointGeometry, pointMaterial);
  pointMesh.position.set(301,31,31);
  earthScene.add(pointMesh);

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


  renderer.domElement.addEventListener("click", onclick, true);
  var selectedObject;
  var raycaster = new THREE.Raycaster();

  function onclick(event) {
  alert("onclick")
  var mouse = new THREE.Vector2();
  raycaster.setFromCamera(mouse, camera);
  var intersects = raycaster.intersectObjects(planets, true); //array
  if (intersects.length > 0) {
  selectedObject = intersects[0];
  alert(selectedObject);
  }
}
}