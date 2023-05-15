import * as THREE from "three";
import { OrbitControls } from "https://threejs.org/examples/jsm/controls/OrbitControls.js";
import { FlyControls } from "./FlyControls.js";
import { GLTFLoader } from "./GLTFLoader.js";
import { EffectComposer } from './EffectComposer.js';
import { RenderPass } from './RenderPass.js';
import { UnrealBloomPass } from './UnrealBloomPass.js';
import { PointerLockControls } from  "./PointerLockControls.js"


let width = window.innerWidth;
let height = window.innerHeight;

const backgroundLoader = new THREE.TextureLoader();

const texture = backgroundLoader.load('textures/bg_sky_4.jpg')

const scene = new THREE.Scene();
scene.background = texture;
// scene.fog = new THREE.Fog(0x000000, 0.015, 100);
scene.fog = new THREE.FogExp2(0xffffff, 0.002);

// const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
// scene.add(ambientLight);


const light = new THREE.PointLight(0xfdfbd3, 1.5);
light.position.set(0, 0, 0);

light.castShadow = true;
light.shadow.mapSize.width = width;
light.shadow.mapSize.height = height;
light.shadow.camera.near = 1;
light.shadow.camera.far = 1000;
scene.add(light);

const sunLoader = new THREE.TextureLoader()
const sunTexture = sunLoader.load('textures/sun.jpg')

var sunGeometry = new THREE.SphereGeometry();

const sunMaterial = new THREE.MeshPhongMaterial();
sunMaterial.shininess = 0;
sunMaterial.emissive = new THREE.Color(1, 1, 1)
sunMaterial.emissiveMap = sunTexture;
sunMaterial.map = sunTexture;
sunMaterial.transmission = 0;
const sun = new THREE.Mesh(sunGeometry, sunMaterial)
sun.position.x = 0;
sun.position.y = 0;
sun.position.z = 0;

sun.scale.x = 4;
sun.scale.y = 4;
sun.scale.z = 4;
sun.receiveShadow = true;
sun.castShadow = true;

scene.add(sun);

const earthLoader = new THREE.TextureLoader();

const earthTexture = earthLoader.load('textures/earth.jpg')

var earthGeometry = new THREE.SphereGeometry();

const earthMaterial = new THREE.MeshPhysicalMaterial();
earthMaterial.bumpMap = earthTexture;
earthMaterial.bumpScale = 0.01;
earthMaterial.map = earthTexture;

const earth = new THREE.Mesh(earthGeometry, earthMaterial)
earth.position.x = 4.5;

earth.scale.x = 0.2;
earth.scale.y = 0.2;
earth.scale.z = 0.2;
earth.receiveShadow = false;
earth.castShadow = true;

sun.add(earth)

const loader = new GLTFLoader();
let merkurius;
loader.load(
  // resource URL
  'models/Merkurius_Baru.glb',
  function (glb) {
    merkurius = glb.scene;
    merkurius.castShadow = true;
    merkurius.position.x = -1.6;
    merkurius.scale.x = 2;
    merkurius.scale.y = 2;
    merkurius.scale.z = 2;
    merkurius.traverse(function (node) {

      if (node.isMesh) { node.castShadow = true; }

    });
    merkurius.traverse(function (node) {
      if (node.material) node.material.metalness = 0;

    });
    sun.add(merkurius)
  }
);

let venus;
loader.load(
  // resource URL
  'models/Venus_1.glb',
  function (glb) {
    venus = glb.scene;
    venus.castShadow = true;
    venus.position.x = 2.8;
    venus.scale.x = 0.003;
    venus.scale.y = 0.003;
    venus.scale.z = 0.003;
    venus.traverse(function (node) {

      if (node.isMesh) { node.castShadow = true; }

    });
    venus.traverse(function (node) {
      if (node.material) node.material.metalness = 0;

    });
    sun.add(venus)
  }
);
let mars;
loader.load(
  // resource URL
  'models/Mars.glb',
  function (glb) {
    mars = glb.scene;
    mars.castShadow = true;
    mars.position.x = 6.0;
    mars.scale.x = 0.030;
    mars.scale.y = 0.030;
    mars.scale.z = 0.030;
    mars.traverse(function (node) {
      if (node.material) node.material.metalness = 0;

    });
    sun.add(mars)
  }
);

let jupiter;
loader.load(
  // resource URL
  'models/Jupiter.glb',
  function (glb) {
    jupiter = glb.scene;
    jupiter.receiveShadow = true;
    jupiter.castShadow = true;
    jupiter.position.x = -4.8;
    jupiter.scale.x = 0.065;
    jupiter.scale.y = 0.065;
    jupiter.scale.z = 0.065;
    jupiter.traverse(function (node) {
      if (node.material) node.material.metalness = 0;

    });
    sun.add(jupiter)
  }
);

let saturn;
loader.load(
  // resource URL
  'models/Saturn.glb',
  function (glb) {
    saturn = glb.scene;
    saturn.castShadow = true;
    saturn.position.x = -8.5;
    saturn.scale.x = 0.001;
    saturn.scale.y = 0.001;
    saturn.scale.z = 0.001;
    saturn.traverse(function (node) {

      if (node.material) node.material.metalness = 0;

    });
    sun.add(saturn)
  }
);

let uranus;
loader.load(
  // resource URL
  'models/Uranus.glb',
  function (glb) {
    uranus = glb.scene;
    uranus.castShadow = true;
    uranus.position.x = -11.5;
    uranus.scale.x = 0.003;
    uranus.scale.y = 0.003;
    uranus.scale.z = 0.003;
    uranus.traverse(function (node) {

      if (node.material) node.material.metalness = 0;

    });
    sun.add(uranus)
  }
);

let satelite;
loader.load(
  // resource URL
  'models/satelite/scene.gltf',
  function (gltf) {
    satelite = gltf.scene;
    satelite.position.x = -2;
    satelite.position.z = -2;
    satelite.rotation._x = 0.1;
    satelite.rotation._y = 0.1;
    satelite.rotation._z = 0.1;
    satelite.scale.x = 0.05;
    satelite.scale.y = 0.05;
    satelite.scale.z = 0.05;
    earth.add(satelite)
  }
);

let comet;
loader.load(
  // resource URL
  'models/comet/scene.gltf',
  function (gltf) {
    comet = gltf.scene;
    comet.position.x = 10;
    comet.position.y = -2;
    comet.position.z = 10;
    comet.scale.x = 0.3;
    comet.scale.y = 0.5;
    comet.scale.z = 0.7;
    earth.add(comet)
  }
);
let comet1;
loader.load(
  // resource URL
  'models/comet/scene.gltf',
  function (gltf) {
    comet1 = gltf.scene;
    comet1.position.x = -6;
    comet1.position.y = -2;
    comet1.position.z = -6;
    comet1.scale.x = 0.5;
    comet1.scale.y = 0.5;
    comet1.scale.z = 0.5;
    scene.add(comet1)
  }
);
let comet2;
loader.load(
  // resource URL
  'models/comet/scene.gltf',
  function (gltf) {
    comet2 = gltf.scene;
    comet2.position.x = -10;
    comet2.position.y = -5;
    comet2.position.z = -10;
    comet2.scale.x = 0.30;
    comet2.scale.y = 0.30;
    comet2.scale.z = 0.100;
    scene.add(comet2)
  }
);
let comet3;
loader.load(
  // resource URL
  'models/comel.glb',
  function (glb) {
    comet3 = glb.scene;
    comet3.position.x = 60;
    comet3.position.y = -5;
    comet3.position.z = 30;
    comet3.scale.x = 0.030;
    comet3.scale.y = 0.01;
    comet3.scale.z = 0.030;
    scene.add(comet3)
  }
);
let pesawat;
loader.load(
  // resource URL
  'models/Pesawat.glb',
  function (glb) {
    pesawat = glb.scene;
    pesawat.position.x = -10;
    pesawat.position.y = -10;
    pesawat.position.z = 10;
    pesawat.scale.x = 0.15;
    pesawat.scale.y = 0.15;
    pesawat.scale.z = 0.15;
    scene.add(pesawat)
    pesawat.traverse(function (node) {

      if (node.material) node.material.metalness = 0;

    });
    mars.add(pesawat)
  }

)
let cruiser;
loader.load(
  // resource URL
  'models/cruiser.glb',
  function (glb) {
    cruiser = glb.scene;
    cruiser.position.x = 10;
    cruiser.position.y = 10;
    cruiser.position.z = 20;
    cruiser.scale.x = 6;
    cruiser.scale.y = 6;
    cruiser.scale.z = 6;
    cruiser.traverse(function (node) {
      if (node.material) node.material.metalness = 0;

    });
    scene.add(cruiser)
  }
);
let ufo;
loader.load(
  // resource URL
  'models/ufo.glb',
  function (glb) {
    ufo = glb.scene;
    ufo.position.x = -10;
    ufo.position.y = 20;
    ufo.position.z = 10;
    ufo.scale.x = 0.30;
    ufo.scale.y = 0.30;
    ufo.scale.z = 0.30;
    ufo.traverse(function (node) {
      if (node.material) node.material.metalness = 0;

    });
    scene.add(ufo)
  }
);

let rocket;
loader.load(
  // resource URL
  'models/roket.glb',
  function (glb) {
    rocket = glb.scene;
    rocket.position.x = 0;
    rocket.position.y = 1;
    rocket.position.z = 0;
    rocket.scale.x = 0.20;
    rocket.scale.y = 0.20;
    rocket.scale.z = 0.20;
    moon.add(rocket)
  }
);
// 



const moonLoader = new THREE.TextureLoader();
const moonTexture = moonLoader.load('textures/moon.jpg')
var moonGeometry = new THREE.SphereGeometry();

const moonMaterial = new THREE.MeshPhysicalMaterial();
moonMaterial.bumpMap = moonTexture;
moonMaterial.map = moonTexture;
const moon = new THREE.Mesh(moonGeometry, moonMaterial)
moon.scale.x = 0.3;
moon.scale.y = 0.3;
moon.scale.z = 0.3;
moon.position.x = 3.5;
moon.receiveShadow = true;
moon.castShadow = true;
earth.add(moon)



// camera
const camera = new THREE.PerspectiveCamera(50, width / height, 1, 1000);
camera.position.set(0, 0, 30);
// camera.lookAt(0, 0, 0);



// renderer
const renderer = new THREE.WebGL1Renderer({ antialias: true, powerPreference: "high-performance", logarithmicDepthBuffer: true });
renderer.setSize(width, height);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

//composer
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera))
composer.addPass(new UnrealBloomPass({ x: width, y: height }, 2.0, 0.0, 0.75))

window.addEventListener("resize", () => {
  // update display width and height
  width = window.innerWidth;
  height = window.innerHeight;
  console.log(width + " " + height);
  // update camera aspect
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  // update renderer
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.render(scene, camera);
});

//FlyControls
const controls = new FlyControls(camera, renderer.domElement,sun)
controls.movementSpeed = 20;
controls.rollSpeed = 0.05;
controls.autoForward = false;
controls.dragToLook = false;

// // OrbitControls
// const controls2 = new OrbitControls(camera, renderer.domElement);
// controls2.autoRotate = true;


//Pointerlock
const controls3 = new PointerLockControls(camera, renderer.domElement)
document.addEventListener( 'click', function () {

  controls3.lock();

},false );

// axes
// const axesHelper = new THREE.AxesHelper(20);
// scene.add(axesHelper);

// renderer.domElement.addEventListener('mousemove', event => {


//             if(event.button == 0){
//                 camera.position.y -= event.movementY * this.sensitivity
//                 camera.position.x -= event.movementX * this.sensitivity        
//             } else if(event.button == 2){
//                 camera.quaternion.y -= event.movementX * this.sensitivity/10
//                 camera.quaternion.x -= event.movementY * this.sensitivity/10
//             }

//             updateCallback()
//         })    

var mov = 0;
var mov2 = 0;
var mov3 = 80;
var mov4 = 0;
var mov_psw = 80;

var gerakRocket = 0.01;

function animate() {
  controls
  earth.rotation.y += 0.005;
  earth.rotation.z += 0.0001;
  if (saturn != undefined) {
    saturn.rotation.y += 0.1;
    saturn.rotation.x += 0.001;
  }
  if (jupiter != undefined) {
    jupiter.rotation.y += 0.005;
    mov3 += -0.0009;
  }

  if (venus != undefined) {
    venus.rotation.y += -0.009;
    venus.rotation.x += -0.001;
    mov3 += -0.0009;
  }
  if (mars != undefined) {
    mars.rotation.y += 0.009;
    mars.rotation.x += 0.001;
    mov3 += -0.0009;
  }

  if (rocket != undefined) {
    rocket.position.y += gerakRocket;
    if (rocket.position.y > 2) {
      gerakRocket *= -1;
    } else if (rocket.position.y <= 1) {
      gerakRocket *= -1;
    }
    // console.log(rocket.position.y)
  }
  if (uranus != undefined) {
    uranus.rotation.y += 0.01;
    uranus.rotation.z += 0.001;
  }
  sun.rotation.y += 0.0001369;

  if (satelite != undefined) {
    satelite.lookAt(earth.position);

  }
  if (comet != undefined) {
    comet.rotation.x += 0.003
    comet.rotation.z += 0.003
    comet.rotation.y += 0.003
    mov += 0.005;
    comet.position.set(15 * Math.cos(mov), comet.position.y, 12 * Math.sin(mov))
  }
  if (comet1 != undefined) {
    comet1.rotation.x += -0.003
    comet1.rotation.z += -0.003
    comet1.rotation.y += -0.003
    mov += 0.0009;
    comet1.position.set(-15 * Math.cos(mov), comet1.position.y, -12 * Math.sin(mov))
  }
  if (comet2 != undefined) {
    comet2.rotation.x += -0.003
    comet2.rotation.z += -0.003
    comet2.rotation.y += -0.003
    mov2 += -0.01;
    comet2.position.set(5 * Math.cos(mov2), comet2.position.y, 2 * Math.sin(mov2))
  }
  if (comet3 != undefined) {
    comet3.rotation.x += -0.03
    comet3.rotation.z += -0.03
    comet3.rotation.y += -0.03
    mov3 += -0.0009;
    comet3.position.set(65 * Math.cos(mov3), comet3.position.y, 60 * Math.sin(mov3))
  }

  if (pesawat != undefined) {
    pesawat.rotation.x += 0.003
    pesawat.rotation.z += 0.003
    pesawat.rotation.y += 0.003
    mov_psw += 0.009;
    pesawat.position.set(25 * Math.cos(mov_psw), pesawat.position.y, 20 * Math.sin(mov_psw))
  }
  if (ufo != undefined) {
    ufo.rotation.y += -0.03
    mov4 += -0.0010;
    ufo.position.set(-30 * Math.cos(mov4), ufo.position.y, -25 * Math.sin(mov4))
  }
  composer.render();

  // renderer.render(scene,camera)

  // camera.lookAt(earth.position)
  // console.log(cube.position.x)

  console.log(`Camera : ${JSON.stringify(camera.position)}`);
  if(merkurius!=undefined){
    var target = new THREE.Vector3(); // create once an reuse it

    console.log(merkurius.getWorldPosition( target ));
  }
  //For FlyControls
  controls.update(0.05)
  requestAnimationFrame(animate);
}
const container = document.querySelector("#container3D");
container.append(renderer.domElement);
// renderer.render(scene,camera)
composer.render();
animate();