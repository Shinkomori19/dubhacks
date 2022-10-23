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

  let dic = {}; // Key: name of the person, Value: [[lat,lon],[lat,lon],,,]
  dic['shin'] = [[45,135],[24,172],[67,120],[120,11],[140,30]];
  dic['lucas'] = [[35,150],[30,140],[80,100],[100,130],[110,60]];

  // trees mesh
  const shin = new THREE.Group();
  makeGroup(dic['shin'],shin);
  earthScene.add(shin);

  const lucas = new THREE.Group();
  makeGroup(dic['lucas'],lucas);
  earthScene.add(lucas);

  const geometoryTmp = new THREE.SphereBufferGeometry(0.1, 30, 30);
    const materialTmp = new THREE.PointsMaterial({
      size:20,
      color:0x4db56a,
    });
    let xyzTmp = toXYZ(-170,0);
    geometoryTmp.applyMatrix(new THREE.Matrix4().makeTranslation(xyzTmp[0],xyzTmp[1],xyzTmp[2]));
    const meshTmp = new THREE.Points(geometoryTmp, materialTmp);
    meshTmp.position.set(0,0,0);
    earthScene.add(meshTmp);

  tick();
  // executed ever frame
  function tick() {
    // control camera
    controls.update();

    shin.rotation.y += 0.003;
    lucas.rotation.y += 0.003;
    mesh.rotation.y += 0.003;
    meshTmp.rotation.y += 0.003;
    // render

    scenes.forEach((scene) => {
      renderer.clearDepth();
      renderer.render(scene, camera);
    }
    );

    requestAnimationFrame(tick);
  }

  // renderer.domElement.addEventListener("click", onclick, true);
  // var selectedObject;
  // var raycaster = new THREE.Raycaster();

//   function onclick(event) {
//   alert("onclick")
//   var mouse = new THREE.Vector2();
//   raycaster.setFromCamera(mouse, camera);
//   var intersects = raycaster.intersectObjects(planets, true); //array
//   if (intersects.length > 0) {
//   selectedObject = intersects[0];
//   alert(selectedObject);
//   }
// }

function makeGroup(cordinatesList, group) {
  for (let i = 0; i < cordinatesList.length; i++) {
    let cordinates = cordinatesList[i];
    let lat = cordinates[0];
    let lon = cordinates[1];
    const geometry = new THREE.SphereBufferGeometry(0.1, 30, 30);
    const material = new THREE.PointsMaterial({
      size:20,
      color:0xff0000,
    });
    let xyz = toXYZ(lat,lon);
    geometry.applyMatrix(new THREE.Matrix4().makeTranslation(xyz[0],xyz[1],xyz[2]));
    const mesh = new THREE.Points(geometry, material);
    mesh.position.set(0,0,0);
    group.add(mesh);
  }
}

  function toXYZ(lat, lon) {
    const R = 300;
    let o = 0;
    let a = 0;
    let x = R * Math.cos(lon + o) * Math.sin(lat + a);
    let y = R * Math.sin(lat + a) * Math.sin(lon + o);
    let z = R * Math.cos(lat + a);
    let array = [x,y,z]
    return array;
  }
}