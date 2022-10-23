"use strict";
window.addEventListener('DOMContentLoaded', init);

function init() {
  const searchInput = document.getElementById("search");
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
    color:0xa9ceec,
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
  let nameGroup = {};
  dic['shin'] = [[-40,-50],[-45,-120],[-60,-50],[135,90],[-53,-65]];
  dic['lucas'] = [[-50,-80],[205,60],[140,70],[105,-4],[109,34]];
  dic['others'] = [[210,70],[142,78],[-40,-110],[-30,-45],[110,30],[-50,-55],[-50,-165],[205,58],[110,14],[110,-14],[140,-12],[136,-20],[130,-30],[235,65],[258,40],[187,54],[193,52],[200,45],[170,10],[190,0],[192,-3],[202,-2],[203,2],[205,33],[210,33],[200,45],[180,45],[178,54]];

  //works;
  const shin = new THREE.Group();
  makeGroup('shin',shin);

  const lucas = new THREE.Group();
  makeGroup('lucas',lucas);

  const others = new THREE.Group();
  makeGroup('others',others);

  tick();

  // executed ever frame
  function tick() {
    // control camera
    controls.update();

    shin.rotation.y += 0.003;
    lucas.rotation.y += 0.003;
    others.rotation.y += 0.003;
    mesh.rotation.y += 0.003;

    // render

    scenes.forEach((scene) => {
      renderer.clearDepth();
      renderer.render(scene, camera);
    }
    );

    requestAnimationFrame(tick);
  }
  //search input updater
  searchInput.addEventListener("input", e => {
    const value = e.target.value.toLowerCase()
    console.log(value)

    //check input of search bar
    if(value in nameGroup) {
      // make all invisible
      let name = value.toLowerCase()
      nameGroup[name].visible = true;

      let p = document.getElementById("name-num");
      p.textContent = name + ", you planted " + dic[name].length + " trees!!";

      let tree1 = document.getElementById("tree1")
      tree1.classList.remove("hide");
      let tree2 = document.getElementById("tree2")
      tree2.classList.remove("hide");
      let tree3 = document.getElementById("tree3")
      tree3.classList.remove("hide");
      let tree4 = document.getElementById("tree4")
      tree4.classList.remove("hide");
      let tree5 = document.getElementById("tree5")
      tree5.classList.remove("hide");

    }else if(value == ""){
      for (let name in nameGroup){
        nameGroup[name].visible = true;
      }
      let treeLists = document.getElementById("tree-name");
      treeLists.classList.remove("hide");
    }else{
      for (let name in nameGroup){
        nameGroup[name].visible = false;
      }
      let p = document.getElementById("name-num")
      p.textContent = ""
    }
  })

  renderer.domElement.addEventListener("click", onclick, true);
  var selectedObject;
  var raycaster = new THREE.Raycaster();

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

function makeGroup(key, group) {
  for (let i = 0; i < dic[key].length; i++) {
    let cordinates = dic[key][i];
    let lat = cordinates[0];
    let lon = cordinates[1];
    const geometry = new THREE.SphereGeometry(3, 15, 15);
    const material = new THREE.PointsMaterial({
      size:8,
      color:0x00FFFF,
    });

    let xyz = toXYZ(lat,lon);
    geometry.applyMatrix(new THREE.Matrix4().makeTranslation(xyz[0],xyz[1],xyz[2]));
    const mesh = new THREE.Points(geometry, material);
    mesh.position.set(0,0,0);
    group.add(mesh);

    // ICONS
    // let xyz = toXYZ(lat,lon);
    // const geometry = new THREE.SphereGeometry(0.1, 30, 30);
    // const material = new THREE.PointsMaterial({
    //   map: new THREE.TextureLoader().load('imgs/tree.png'),
    //   size:20,
    // })
    // geometry.applyMatrix(new THREE.Matrix4().makeTranslation(xyz[0],xyz[1],xyz[2]));
    // const mesh = new THREE.Points(geometry, material);
    // mesh.position.set(0,0,0);
    // group.add(mesh);
  }
  earthScene.add(group);
}

  function toXYZ(lat, lon) {
    let a = (90 - lat) * Math.PI/180;
    let o = (180 + lon) * Math.PI/180;
    const R = 300;
    let x = R * Math.sin(a) * Math.cos(o);
    let y = R * Math.sin(a) * Math.sin(o);
    let z = R * Math.cos(a);
    let array = [x,y,z]
    return array;
  }
}