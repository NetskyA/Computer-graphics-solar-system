import * as THREE from "three";
import { OrbitControls } from "https://threejs.org/examples/jsm/controls/OrbitControls.js";
import { FlyControls } from "./FlyControls.js";
import { GLTFLoader } from "./GLTFLoader.js";
import { EffectComposer } from './EffectComposer.js';
import { RenderPass } from './RenderPass.js';
import { UnrealBloomPass } from './UnrealBloomPass.js';



let width = window.innerWidth;
let height = window.innerHeight;

const backgroundLoader = new THREE.TextureLoader();

const texture = backgroundLoader.load('textures/bg_sky_3.jpg')

const scene = new THREE.Scene();
scene.background = texture;
// scene.fog = new THREE.Fog(0x000000, 0.015, 100);
scene.fog = new THREE.FogExp2(0xffffff, 0.002);

// const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
// scene.add(ambientLight);


const light = new THREE.PointLight(0xfdfbd3, 1.5);
light.position.set(0, 5, 0);

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
      if (node.material) node.material.metalness = 0;

    });
    console.log(merkurius)
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
      if (node.material) node.material.metalness = 0;

    });
    console.log(venus)
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
    console.log(mars)
    sun.add(mars)
  }
);

let jupiter;
loader.load(
  // resource URL
  'models/Jupiter.glb',
  function (glb) {
    jupiter = glb.scene;
    jupiter.castShadow = true;
    jupiter.position.x = -4.8;
    jupiter.scale.x = 0.065;
    jupiter.scale.y = 0.065;
    jupiter.scale.z = 0.065;
    jupiter.traverse(function (node) {
      if (node.material) node.material.metalness = 0;

    });
    console.log(jupiter)
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
    console.log(saturn)
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
    console.log(uranus)
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
    comet.scale.x = 0.5;
    comet.scale.y = 0.5;
    comet.scale.z = 0.5;
    scene.add(comet)
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
  function (gltf) {
    comet3 = gltf.scene;
    comet3.position.x = 60;
    comet3.position.y = -5;
    comet3.position.z = 30;
    comet3.scale.x = 0.030;
    comet3.scale.y = 0.01;
    comet3.scale.z = 0.030;
    scene.add(comet3)
  }
);
let comet4;
loader.load(
  // resource URL
  'models/comel.glb',
  function (gltf) {
    comet4 = gltf.scene;
    comet4.position.x = -1;
    comet4.position.y = -10;
    comet4.position.z = -10;
    comet4.scale.x = 0.060;
    comet4.scale.y = 0.060;
    comet4.scale.z = 0.060;
    scene.add(comet4)
  }
);
let pesawat;
loader.load(
  // resource URL
  'models/Pesawat.glb',
  function (gltf) {
    pesawat = gltf.scene;
    pesawat.position.x = 11;
    pesawat.position.y = -2;
    pesawat.position.z = 10;
    pesawat.scale.x = 0.10;
    pesawat.scale.y = 0.10;
    pesawat.scale.z = 0.10;
    pesawat.traverse(function (node) {

      if (node.material) node.material.metalness = 0;

    });
    console.log(pesawat)
    earth.add(pesawat)
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
    scene.add(ufo)
  }
);



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
earth.receiveShadow = false;
earth.castShadow = true;
earth.add(moon)



// camera
const camera = new THREE.PerspectiveCamera(50, width / height, 1, 1000);
camera.position.set(0, 10, 10);
camera.lookAt(0, 0, 0);



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
const controls = new FlyControls(camera, renderer.domElement)
controls.movementSpeed = 1;
controls.rollSpeed = 0.05;
controls.autoForward = false;
controls.dragToLook = false;

// OrbitControls
const controls2 = new OrbitControls(camera, renderer.domElement);
controls2.autoRotate = true;

// axes
// const axesHelper = new THREE.AxesHelper(20);
// scene.add(axesHelper);

var mov = 0;
var mov2 = 0;
var mov3 = 80;
var mov4 = 0;

function animate() {

  earth.rotation.y += 0.005;
  earth.rotation.z += 0.0001;
  if (saturn != undefined) {
    saturn.rotation.y += 0.1;
    // saturn.rotation.z += 0.0001;
    saturn.rotation.x += 0.001;
  }
  if (uranus != undefined) {
    uranus.rotation.y += 0.01;
    uranus.rotation.z += 0.001;
    // saturn.rotation.x += 0.004;
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
  // if (comet4 != undefined) {
  //   comet4.rotation.x += -0.003
  //   comet4.rotation.z += -0.003
  //   comet4.rotation.y += -0.003
  //   mov4 += -0.009;
  //   // comet4.position.set(65 * Math.cos(mov4), comet4.position.y, 60 * Math.sin(mov4))
  // }
  if (ufo != undefined) {
    // ufo.rotation.x += -0.003
    // ufo.rotation.z += -0.003
    ufo.rotation.y += -0.03
    mov4 += -0.0010;
    ufo.position.set(-30 * Math.cos(mov4), ufo.position.y, -25 * Math.sin(mov4))
  }
  composer.render();

  // renderer.render(scene,camera)

  // camera.lookAt(earth.position)
  // console.log(cube.position.x)

  //For FlyControls
  controls.update(0.05)
  console.log(camera.position)
  requestAnimationFrame(animate);
}
const container = document.querySelector("#container3D");
container.append(renderer.domElement);
// renderer.render(scene,camera)
composer.render();
animate();