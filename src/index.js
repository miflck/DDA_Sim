import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {BufferGeometryUtils} from'three/examples/jsm/utils/BufferGeometryUtils.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { GUI } from 'three/examples/jsm/libs/dat.gui.module.js';




THREE.Cache.enabled = true;

console.log("Hello Webpack")
const loader = new THREE.FileLoader();
// meshes
let mesh1;
let mesh2;
let mesh3;


let meshTop1;
let meshTop2;
let meshTop3;



let allweeks;
let allmonths;


let maxCases=0;

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

        allweeks=weeks;

        computeMaxHeight(weeks,"20-29")
        computeMaxHeight(weeks,"30-49")
        computeMaxHeight(weeks,"50-69")
        console.log("MAX Cases",maxCases)

        makeThings(weeks);


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




//load a text file and output the result to the console
loader.load(
	// resource URL
	'Arbeitslosigkeit.csv',
	// onLoad callback
	function ( data ) {
		// output the text to the console
		console.log( "------------------",data )
        var lines = data.split('\n');
		console.log( "-------lines------",lines[0] )
        var headers = getCsvValuesFromLine(lines[0]);
		console.log( "headers",headers )
        lines.shift(); // remove header line from array
        var months = lines.map(function(line) {
            var month = {};
            var lineValues = getCsvValuesFromLine(line);
            for (var i = 0; i < lines.length; i += 1) {
                month[headers[i]] = lineValues[i];

            }
            return month;
        });

        allmonths=months;

       /* computeMaxHeight(weeks,"20-29")
        computeMaxHeight(weeks,"30-49")
        computeMaxHeight(weeks,"50-69")
        console.log("MAX Cases",maxCases)

        makeThings(weeks);
*/

        makeTop(months)

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




const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 8000);
camera.position.z = 400;
camera.position.y = 250;

const renderer = new THREE.WebGLRenderer({ antialiasing: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor('#000000')
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
const gui = new GUI();


// plane rotation
var guiControlls = new function() {
    this.width_1 = 100;//135;
    this.width_2 = 100;//145;
    this.width_3 = 100;//20;
    this.week_length = 10;
    this.factor = 8;

    this.topfactor = 1;
    this.topshift = 300;


}

const widthControlls = gui.addFolder("Breiten")
widthControlls.add( guiControlls, 'width_1' ).min(1).max(200).step(0.1).onChange(()=>{
    makeThings(allweeks)
    makeTop(allmonths)
});
widthControlls.add( guiControlls, 'width_2' ).min(1).max(200).step(0.1).onChange(()=>{
    makeThings(allweeks)
    makeTop(allmonths)
});
widthControlls.add( guiControlls, 'width_3' ).min(1).max(200).step(0.1).onChange(()=>{
    makeThings(allweeks)
    makeTop(allmonths)
});
widthControlls.add( guiControlls, 'week_length' ).min(1).max(50).step(0.1).onChange(()=>{
    makeThings(allweeks)
    makeTop(allmonths)
});
widthControlls.add( guiControlls, 'factor' ).min(0.5).max(10).step(0.1).onChange(()=>{makeThings(allweeks)});
widthControlls.add( guiControlls, 'topfactor' ).min(0.5).max(10).step(0.1).onChange(()=>{makeTop(allmonths)});
widthControlls.add( guiControlls, 'topshift' ).min(0).max(500).step(10).onChange(()=>{makeTop(allmonths)});


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


var ambientLight = new THREE.AmbientLight ( 0xffffff, 0.1)
scene.add( ambientLight )

var pointLight = new THREE.PointLight( 0xffffff, 1 );
pointLight.position.set( 0, 100, -400 );
scene.add( pointLight );

var pointLight = new THREE.PointLight( 0xffffff, 1 );
pointLight.position.set( 0, 100, 400 );
scene.add( pointLight );

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    render();
}, false);



  

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




// This assumes no commas in the values names.
function getCsvValuesFromLine(line) {
    var values = line.split(',');
   values.map(function(value){
        return value.replace(/\"/g, '');
    });
    return values;
}



const makeTop=(months)=>{
    console.log("months",months)

    scene.remove(meshTop1);
    meshTop1 = undefined;

    scene.remove(meshTop2);
    meshTop2 = undefined;

    scene.remove(meshTop3);
    meshTop3 = undefined;

    meshTop1=generatePaperVolume(months,guiControlls.width_1,guiControlls.week_length,"20-29",guiControlls.topfactor)
    scene.add(meshTop1);
    meshTop1.translateX(-(guiControlls.width_2/2)-(guiControlls.width_1/2)-5)
    meshTop1.translateZ(400)
    meshTop1.translateY(guiControlls.topshift)

    meshTop2=generatePaperVolume(months,guiControlls.width_2,guiControlls.week_length,"30-49",guiControlls.topfactor)
    scene.add(meshTop2)
    meshTop2.translateZ(400)
    meshTop2.translateY(guiControlls.topshift)

    meshTop3=generatePaperVolume(months,guiControlls.width_3,guiControlls.week_length,"20-29",guiControlls.topfactor)
    scene.add(meshTop3);
    meshTop3.translateX((guiControlls.width_2/2)+(guiControlls.width_3/2)+5)
    meshTop3.translateZ(400)
    meshTop3.translateY(guiControlls.topshift)

}



const makeThings=(weeks)=>{

    scene.remove(mesh1);
    mesh1 = undefined;

    scene.remove(mesh2);
    mesh2 = undefined;

    scene.remove(mesh3);
    mesh3 = undefined;

    mesh1=generateForms(weeks,guiControlls.width_1,guiControlls.week_length,"20-29",guiControlls.factor)
    scene.add(mesh1);
    mesh1.translateX(-(guiControlls.width_2/2)-(guiControlls.width_1/2)-5)
    mesh1.translateZ(400)

    mesh2=generateForms(weeks,guiControlls.width_2,guiControlls.week_length,"30-49",guiControlls.factor)
    mesh2.translateZ(400)
    scene.add(mesh2);

    mesh3=generateForms(weeks,guiControlls.width_3,guiControlls.week_length,"50-69",guiControlls.factor)
    scene.add(mesh3);
    mesh3.translateX((guiControlls.width_2/2)+(guiControlls.width_3/2)+5)
    mesh3.translateZ(400)

    console.log("MAX CASES",maxCases)

}


const computeMaxHeight=(weeks,name)=>{
    weeks.map((week)=>{
       // console.log("week[name]",week[name])
        let cases=parseInt(week[name], 10);
        if(cases>maxCases)maxCases=cases;
    })
}

const generateForms=(weeks,b,l,name,scale)=>{
    var material = new THREE.MeshStandardMaterial( { color: 0xaaaaaa })
    material.flatShading=true;
    let counter=0;
    let maxH=0;
    var cubes = []
    weeks.map((week)=>{
        let cases=parseInt(week[name], 10);
        const h=computeHeight(b,l,cases*scale);
        if(h>maxH)maxH=h;
        var geo = new THREE.BoxBufferGeometry( b, h, l);
        geo.translate( 0, h/2, -counter*l );
        cubes.push(geo)
        counter++
        })
        console.log("Maximal Height",maxH)
        const mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(cubes);
        mergedGeometry.computeVertexNormals();

        var mesh = new THREE.Mesh(mergedGeometry, material);
        return mesh;
}


const generatePaperVolume=(months,b,l,name,scale)=>{
    var material = new THREE.MeshStandardMaterial( { color: 0xaaaaaa })
    material.flatShading=true;
    let counter=0;
    let maxH=0;
    var cubes = []
    months.map((month)=>{
        console.log(month)
        let cases=parseInt(month[name], 10);
       console.log("AC",b,l*4,cases)
        const h=computeHeight(b,l*4,cases*scale);
        console.log("Height",h)
        var geo = new THREE.BoxBufferGeometry( b, h, l*4);
        geo.translate( 0, -h/2, -counter*l*4 );
        cubes.push(geo)
        counter++
        })
        const mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(cubes);
        mergedGeometry.computeVertexNormals();

        var mesh = new THREE.Mesh(mergedGeometry, material);
        return mesh;
}
