import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {BufferGeometryUtils} from'three/examples/jsm/utils/BufferGeometryUtils.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { GUI } from 'three/examples/jsm/libs/dat.gui.module.js';
import { CatmullRomCurve3 } from 'three';




THREE.Cache.enabled = true;

console.log("Hello Webpack")
// our futur array of bufferGeometry
var cubes1 = []
const loader = new THREE.FileLoader();
// meshes
let mesh1;
let mesh2;
let mesh3;



//load a text file and output the result to the console
loader.load(
	// resource URL
	'data.csv',
	// onLoad callback
	function ( data ) {
		// output the text to the console
		console.log( "------------------",data )
        var lines = data.split('\n');
		console.log( "-------lines------",lines[0] )

        var headers = getCsvValuesFromLine(lines[0]);
		console.log( "headers",headers )
        lines.shift(); // remove header line from array

        var weeks = lines.map(function(line) {
            var week = {};
            var lineValues = getCsvValuesFromLine(line);
            for (var i = 0; i < lines.length; i += 1) {
                week[headers[i]] = lineValues[i];
            }
            return week;
        });

        mesh1=generateForms(weeks,135,10,"20-29",2)
        scene.add(mesh1);
        mesh1.translateX(-135-20)
        mesh1.translateZ(400)

        mesh2=generateForms(weeks,145,10,"30-49",2)
        mesh2.translateZ(400)
        scene.add(mesh2);

        mesh3=generateForms(weeks,20,10,"50-69",2)
        scene.add(mesh3);
        mesh3.translateX(145/2+20)
        mesh3.translateZ(400)


	},

	// onProgress callback
	function ( xhr ) {
		console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
	},

	// onError callback
	function ( err ) {
		console.error( 'An error happened' );
	}
);


// This assumes no commas in the values names.
function getCsvValuesFromLine(line) {
    var values = line.split(',');
   values.map(function(value){
        return value.replace(/\"/g, '');
    });
    return values;
}


const generateForms=(weeks,l,b,name,scale)=>{
    var material = new THREE.MeshStandardMaterial( { color: 0xaaaaaa })
    let counter=0;
    let maxH=0;
    var cubes = []

    weeks.map((week)=>{
        const h=computeHeight(l,b,week[name]*scale);
        if(h>maxH)maxH=h;
        var geo = new THREE.BoxBufferGeometry( l, h, b);
        geo.translate( 0, h/2, -counter*b );
        cubes.push(geo)
        counter++
        })
    
        console.log("Maximal Height",maxH)
        const mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(cubes);
        // now we got 1 mega big mesh with 10 000 cubes in it
        //var mesh = new THREE.Mesh(mergedGeometry, new THREE.MeshNormalMaterial());
        var mesh = new THREE.Mesh(mergedGeometry, material);

        return mesh;

    
}


const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 8000);
camera.position.z = 400;

camera.position.y = 250;


//const camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 1, 1000 );
//camera.position.z = 1;

const renderer = new THREE.WebGLRenderer({ antialiasing: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor('#000000')
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);



controls.listenToKeyEvents( window ); // optional

//controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)

controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
controls.dampingFactor = 0.05;

controls.screenSpacePanning = false;


controls.maxPolarAngle = Math.PI / 2;
const dummy = new THREE.Object3D();

let mesh;


//const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
var material = new THREE.MeshStandardMaterial( { color: 0xff0051 })
const geometry = new THREE.BoxGeometry( 1, 1, 1 );
/*
const cube = new THREE.Mesh( geometry, material );
scene.add( cube )
cube.position.z=-0.5;
cube.position.y=0.5;

const geometry2 = new THREE.BoxGeometry( 1, 2, 1 );

const cube2 = new THREE.Mesh( geometry2, material );
cube2.position.z=-1;
cube2.position.y=1;

scene.add( cube2 )


for(let i=1;i<50;i++){
    const h=Math.random(1);
    const geometry = new THREE.BoxGeometry( 1, h, 1 );
    const cube = new THREE.Mesh( geometry, material );
    cube.position.z=-i;
    cube.position.y=h/2;
    scene.add( cube )
}
*/

var ambientLight = new THREE.AmbientLight ( 0xffffff, 0.3)
scene.add( ambientLight )

var pointLight = new THREE.PointLight( 0xffffff, 1 );
pointLight.position.set( 25, 250, 25 );
scene.add( pointLight );


window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    render();
}, false);



  
const gui = new GUI();

const stats = Stats();
document.body.appendChild(stats.dom);

var animate = function () {
    requestAnimationFrame(animate);
    controls.update();
    render();
    stats.update();
};

function render() {



    renderer.render(scene, camera);
}

animate();


function computeHeight(_l, _b, _vol) {
    let h = _vol / (_l * _b);
    return h;
  }


