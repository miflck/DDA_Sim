import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {BufferGeometryUtils} from'three/examples/jsm/utils/BufferGeometryUtils.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { GUI } from 'three/examples/jsm/libs/dat.gui.module.js';




THREE.Cache.enabled = true;

console.log("Hello Webpack")

let totalLength;

let paperheight=29
let paperwidth=21
let numCol=3;
let gap=2; // papergap


let lineGap=5;
// total weeks of installation, should maybe generated from csv? now its hardcoded
let totalWeeks=79; 
// total weeks before first corona case
let startWeeks=13

let month_len=43.8;


const loader = new THREE.FileLoader();
// meshes
let mesh1;
let mesh2;
let mesh3;

// top meshes
let meshTop1;
let meshTop2;
let meshTop3;


// top meshes
let meshTop11;
let meshTop21;
let meshTop31;

// data arrays
let allweeks;
let allmonths;

let maxCases=0;

/*
//load a text file and store data
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
        // store data in array
        var weeks = lines.map(function(line) {
            var week = {};
            var lineValues = getCsvValuesFromLine(line);
            for (var i = 0; i < lines.length; i += 1) {
                week[headers[i]] = lineValues[i];
            }
            return week;
        });

        allweeks=weeks;
        // get max height of floor, not needet any more
        

    
        // make all 3 floor
        makeFloor(weeks);
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
*/



//load a text file and store data
loader.load(
	// resource URL
	'Zahlen_Alter_Mai_2.csv',
	// onLoad callback
	function ( data ) {
		// output the text to the console
		console.log( "------------------",data )
        var lines = data.split('\n');
		console.log( "-------lines------",lines[0] )
        var headers = getCsvValuesFromLine(lines[0]);
		console.log( "headers",headers )
        lines.shift(); // remove header line from array
        // store data in array
        var weeks = lines.map(function(line) {
            var week = {};
            var lineValues = getCsvValuesFromLine(line);
            for (var i = 0; i < lines.length; i += 1) {
                week[headers[i]] = lineValues[i];
            }
            return week;
        });

        allweeks=weeks;
        console.log("weeks",weeks.length)


        // make all 3 floor
        makeFloor(weeks);
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




//messy way to load another text file and store data
loader.load(
	// resource URL
	//'Arbeitslose 2020_maerz.csv',
    'Arbeitslose_data.csv',
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
// set camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 8000);
camera.position.z = 500;
camera.position.y = 250;
// setup renderer
const renderer = new THREE.WebGLRenderer({ antialiasing: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor('#000000')
//renderer.setClearColor('#FFFFFF')

renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// set gui
const controls = new OrbitControls(camera, renderer.domElement);
const gui = new GUI();

//  params
var guiControlls = new function() {
    this.width_1 = 82;//135;
    this.width_2 = 82;//145;
    this.width_3 = 82;//20;
    this.week_length = 10;
    this.factor = 4.94671225;//4.92;//6;
    this.topfactor = 4.92;
    this.topshift = 400;
    this.topCase="Line"
    this.lineScaler=410;
}


const groundplanegeom = new THREE.PlaneGeometry( guiControlls.width_1+guiControlls.width_2+guiControlls.width_3+(2*lineGap), guiControlls.week_length*79 );
const planemat = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
const plane = new THREE.Mesh( groundplanegeom, planemat );
scene.add( plane );
plane.rotateX(Math.PI/2)




// add gui params
const widthControlls = gui.addFolder("Breiten")
widthControlls.add( guiControlls, 'width_1' ).min(1).max(200).step(0.1).onChange(()=>{
    makeFloor(allweeks)
    makeTop(allmonths)
});
widthControlls.add( guiControlls, 'width_2' ).min(1).max(200).step(0.1).onChange(()=>{
    makeFloor(allweeks)
    makeTop(allmonths)
});
widthControlls.add( guiControlls, 'width_3' ).min(1).max(200).step(0.1).onChange(()=>{
    makeFloor(allweeks)
    makeTop(allmonths)
});
widthControlls.add( guiControlls, 'week_length' ).min(1).max(50).step(0.1).onChange(()=>{
    makeFloor(allweeks)
    makeTop(allmonths)
});

widthControlls.add( guiControlls, 'factor' ).min(0.5).max(10).step(0.1).onChange(()=>{makeFloor(allweeks)});


const paperControls = gui.addFolder("Paper")
paperControls.add(guiControlls, 'topCase', { Volume: 'Volume', Line: 'Line', Density: 'Density', Deviation:'Deviation', VolumeRaster:'VolumeRaster'} ).onChange(()=>{makeTop(allmonths)});
paperControls.add( guiControlls, 'topfactor' ).min(0.5).max(10).step(0.1).onChange(()=>{makeTop(allmonths)});
paperControls.add( guiControlls, 'topshift' ).min(0).max(500).step(10).onChange(()=>{makeTop(allmonths)});
paperControls.add( guiControlls, 'lineScaler' ).min(0).max(4000).step(10).onChange(()=>{makeTop(allmonths)});//.listen();

// camera controls
controls.listenToKeyEvents( window ); // optional
controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
//controls.maxPolarAngle = Math.PI / 2;

// setup light
var ambientLight = new THREE.AmbientLight ( 0xffffff, 0.1)
scene.add( ambientLight )

var pointLight = new THREE.PointLight( 0xffffff, 1 );
pointLight.position.set( 0, 100, -500 );
scene.add( pointLight );

var pointLight = new THREE.PointLight( 0xffffff, 1 );
pointLight.position.set( 0, 100, 500 );
scene.add( pointLight );

// resize event
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    render();
}, false);

// fps stats
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



const makeTop=(months)=>{

    scene.remove(meshTop1);
    meshTop1 = undefined;

    scene.remove(meshTop2);
    meshTop2 = undefined;

    scene.remove(meshTop3);
    meshTop3 = undefined;

    scene.remove(meshTop11);
    meshTop11 = undefined;

    scene.remove(meshTop21);
    meshTop21 = undefined;

    scene.remove(meshTop31);
    meshTop31 = undefined;

    switch (guiControlls.topCase) {
        case "Volume":
            meshTop1=generatePaperVolume(months,guiControlls.width_1,guiControlls.week_length,"20-39",guiControlls.topfactor)
            scene.add(meshTop1);
            meshTop1.translateX(-(guiControlls.width_2/2)-(guiControlls.width_1/2)-5)
            meshTop1.translateZ(400)
            meshTop1.translateY(guiControlls.topshift)

    

            meshTop2=generatePaperVolume(months,guiControlls.width_2,guiControlls.week_length,"40-59",guiControlls.topfactor)
            scene.add(meshTop2)
            meshTop2.translateZ(400)
            meshTop2.translateY(guiControlls.topshift)

            meshTop3=generatePaperVolume(months,guiControlls.width_3,guiControlls.week_length,"60-79",guiControlls.topfactor)
            scene.add(meshTop3);
            meshTop3.translateX((guiControlls.width_2/2)+(guiControlls.width_3/2)+5)
            meshTop3.translateZ(400)
            meshTop3.translateY(guiControlls.topshift)
        break;

        case "VolumeRaster":
            meshTop1=generatePaperHeightVolume(months,guiControlls.width_1,guiControlls.week_length,"20-39",guiControlls.topfactor)
            scene.add(meshTop1);
            meshTop1.translateX(-(guiControlls.width_2/2)-(guiControlls.width_1/2)-5)
            meshTop1.translateZ(400)
            meshTop1.translateY(guiControlls.topshift)

    

            meshTop2=generatePaperHeightVolume(months,guiControlls.width_2,guiControlls.week_length,"40-59",guiControlls.topfactor)
            scene.add(meshTop2)
            meshTop2.translateZ(400)
            meshTop2.translateY(guiControlls.topshift)

            meshTop3=generatePaperHeightVolume(months,guiControlls.width_3,guiControlls.week_length,"60-79",guiControlls.topfactor)
            scene.add(meshTop3);
            meshTop3.translateX((guiControlls.width_2/2)+(guiControlls.width_3/2)+5)
            meshTop3.translateZ(400)
            meshTop3.translateY(guiControlls.topshift)
        break;

        case "Line":

            meshTop1=generatePaperHeight(months,guiControlls.width_1,guiControlls.week_length,"20-39",guiControlls.topfactor)
            scene.add(meshTop1);
            meshTop1.translateX(-(guiControlls.width_2/2)-(guiControlls.width_1/2)-5)
            meshTop1.translateZ((guiControlls.week_length*totalWeeks/2))
            meshTop1.translateY(guiControlls.topshift)
        
            meshTop11=generatePaperHeightColor(months,guiControlls.width_1,guiControlls.week_length,"DS 20-39",guiControlls.topfactor)
            scene.add(meshTop11);
            meshTop11.translateX(-(guiControlls.width_2/2)-(guiControlls.width_1/2)-5)
            meshTop11.translateZ((guiControlls.week_length*totalWeeks/2))
            meshTop11.translateY(guiControlls.topshift)


            meshTop2=generatePaperHeight(months,guiControlls.width_2,guiControlls.week_length,"40-59",guiControlls.topfactor)
            scene.add(meshTop2)
            meshTop2.translateZ((guiControlls.week_length*totalWeeks/2))
            meshTop2.translateY(guiControlls.topshift)

            meshTop21=generatePaperHeightColor(months,guiControlls.width_2,guiControlls.week_length,"DS 40-59",guiControlls.topfactor)
            scene.add(meshTop21)
            meshTop21.translateZ((guiControlls.week_length*totalWeeks/2))
            meshTop21.translateY(guiControlls.topshift)
            
        
           meshTop3=generatePaperHeight(months,guiControlls.width_3,guiControlls.week_length,"60-79",guiControlls.topfactor)
            scene.add(meshTop3);
            meshTop3.translateX((guiControlls.width_2/2)+(guiControlls.width_3/2)+5)
            meshTop3.translateZ((guiControlls.week_length*totalWeeks/2))
            meshTop3.translateY(guiControlls.topshift)

            
            meshTop31=generatePaperHeightColor(months,guiControlls.width_3,guiControlls.week_length,"DS 60-79",guiControlls.topfactor)
            scene.add(meshTop31);
            meshTop31.translateX((guiControlls.width_2/2)+(guiControlls.width_3/2)+5)
            meshTop31.translateZ((guiControlls.week_length*totalWeeks/2))
            meshTop31.translateY(guiControlls.topshift)

        break;

        case "Deviation":
            meshTop1=makeLine(months,guiControlls.width_1,guiControlls.week_length,0)
            scene.add(meshTop1);
            meshTop1.translateX(-(guiControlls.width_2/2)-(guiControlls.width_1/2)-5)
            meshTop1.translateZ(400)
            meshTop1.translateY(guiControlls.topshift)
            
            meshTop11=generatePaperHeightDeviation(months,guiControlls.width_1,guiControlls.week_length,"Diff 20-39",guiControlls.topfactor)
            scene.add(meshTop11);
            meshTop11.translateX(-(guiControlls.width_2/2)-(guiControlls.width_1/2)-5)
            meshTop11.translateZ(400)
            meshTop11.translateY(guiControlls.topshift)
            
            meshTop2=makeLine(months,guiControlls.width_2,guiControlls.week_length,0)
            scene.add(meshTop2)
            meshTop2.translateZ(400)
            meshTop2.translateY(guiControlls.topshift)
            
           meshTop21=generatePaperHeightDeviation(months,guiControlls.width_2,guiControlls.week_length,"Diff 40-59",guiControlls.topfactor)
            scene.add(meshTop21)
            meshTop21.translateZ(400)
            meshTop21.translateY(guiControlls.topshift)

              
            meshTop3=makeLine(months,guiControlls.width_3,guiControlls.week_length,0)
            scene.add(meshTop3)
            meshTop3.translateX((guiControlls.width_2/2)+(guiControlls.width_3/2)+5)
            meshTop3.translateZ(400)
            meshTop3.translateY(guiControlls.topshift)

            
            meshTop31=generatePaperHeightDeviation(months,guiControlls.width_3,guiControlls.week_length,"Diff 60-79",guiControlls.topfactor)
            scene.add(meshTop31);
            meshTop31.translateX((guiControlls.width_2/2)+(guiControlls.width_3/2)+5)
            meshTop31.translateZ(400)
            meshTop31.translateY(guiControlls.topshift)
            
        break;

        case "Density":
            meshTop1=generatePaperDensity(months,guiControlls.width_1,guiControlls.week_length,"20-39",guiControlls.topfactor)
            scene.add(meshTop1);
            meshTop1.translateX(-(guiControlls.width_2/2)-(guiControlls.width_1/2)-5)
            meshTop1.translateZ(400)
            meshTop1.translateY(guiControlls.topshift)
        
            meshTop2=generatePaperDensity(months,guiControlls.width_2,guiControlls.week_length,"40-59",guiControlls.topfactor)
            scene.add(meshTop2)
            meshTop2.translateZ(400)
            meshTop2.translateY(guiControlls.topshift)

            meshTop3=generatePaperDensity(months,guiControlls.width_3,guiControlls.week_length,"60-79",guiControlls.topfactor)
            scene.add(meshTop3);
            meshTop3.translateX((guiControlls.width_2/2)+(guiControlls.width_3/2)+5)
            meshTop3.translateZ(400)
            meshTop3.translateY(guiControlls.topshift)

           
        break;
    }
  
}


const makeFloor=(weeks)=>{
    // delete old mesh
    scene.remove(mesh1);
    mesh1 = undefined;
    scene.remove(mesh2);
    mesh2 = undefined;
    scene.remove(mesh3);
    mesh3 = undefined;

    // generate new mesh
    mesh1=generateForms(weeks,guiControlls.width_1,guiControlls.week_length,"20-39",guiControlls.factor)
    mesh1.translateX(-(guiControlls.width_2/2)-(guiControlls.width_1/2)-lineGap)
    // translate half length back as 0 is at half plane:790 /2
    mesh1.translateZ((guiControlls.week_length*totalWeeks/2)-guiControlls.week_length/2-startWeeks*guiControlls.week_length)
    scene.add(mesh1);

    mesh2=generateForms(weeks,guiControlls.width_2,guiControlls.week_length,"40-59",guiControlls.factor)
    mesh2.translateZ((guiControlls.week_length*totalWeeks/2)-guiControlls.week_length/2-startWeeks*guiControlls.week_length)
    scene.add(mesh2);

    mesh3=generateForms(weeks,guiControlls.width_3,guiControlls.week_length,"60-79",guiControlls.factor)
    mesh3.translateX((guiControlls.width_2/2)+(guiControlls.width_3/2)+lineGap)
    mesh3.translateZ((guiControlls.week_length*totalWeeks/2)-guiControlls.week_length/2-startWeeks*guiControlls.week_length)
    scene.add(mesh3);

    console.log("MAX CASES",maxCases)
}

// HELPER
// This assumes no commas in the values names.
function getCsvValuesFromLine(line) {
    var values = line.split(',');
   values.map(function(value){
        return value.replace(/\"/g, '');
    });
    return values;
}

function computeHeight(_l, _b, _vol) {
    let h = _vol / (_l * _b);
    return h;
  }


  function computeHeightStraight(_vol,scaler) {
    let h = _vol / scaler;
    return h;
  }


const computeMaxHeight=(weeks,name)=>{
    weeks.map((week)=>{
       // console.log("week[name]",week[name])
        let cases=parseInt(week[name], 10);
        if(cases>maxCases)maxCases=cases;
    })
}

const generateForms=(weeks,b,l,name,scale)=>{
    console.log("weeks",weeks)
    var material = new THREE.MeshStandardMaterial( { color: 0xcccccc })
    material.flatShading=true;
    let counter=0;
    let maxH=0;
    let totalH=0;
    let minH=100;

    var cubes = []
    weeks.map((week)=>{
        let cases=parseInt(week[name], 10);
        const h=computeHeight(b,l,cases*scale);
        if(h>maxH)maxH=h;
        if(h<minH)minH=h;
        totalH+=h;
        var geo = new THREE.BoxBufferGeometry( b, h, l);
        geo.translate( 0, h/2, -counter*l );
        cubes.push(geo)
       // console.log(week["Datum"],name,"height:",h)
        counter++
        })
        console.log(name,"Maximal Height",maxH)
        console.log(name,"Minimal Height",minH)
        console.log(name,"Total Height",totalH)
        var elem = document.getElementById(name);
        let hrow = elem.querySelector('.hrow');
        let hwrapper = hrow.querySelector('.hwrapper');
        hwrapper.innerHTML=Math.ceil(maxH);

        let trow = elem.querySelector('.trow');
        let twrapper = trow.querySelector('.twrapper');
        twrapper.innerHTML=Math.ceil(totalH);
        
        const mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(cubes);
        mergedGeometry.computeVertexNormals();

        var mesh = new THREE.Mesh(mergedGeometry, material);
        return mesh;
}

const generatePaperVolume=(months,b,l,name,scale)=>{
    var material = new THREE.MeshStandardMaterial( { color: 0xcccccc })
    material.flatShading=true;
    let counter=0;
    let maxH=0;
    var cubes = []
    months.map((month)=>{
        console.log(month)
        let cases=parseInt(month[name], 10);
        const h=computeHeight(b,l*4,cases*scale);
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


const generatePaperHeight=(months,b,l,name,scale)=>{
    var material = new THREE.MeshStandardMaterial( { color: 0xcccccc })
    material.flatShading=true;
    let counter=0;
    let maxH=0;
    var cubes = []
    let  offset=b-((paperwidth*numCol)+((numCol-1)*gap));
    months.map((month)=>{

        let cases=parseInt(month[name], 10);
       let len=month_len;
       const h=computeHeightStraight(cases,guiControlls.lineScaler);
       console.log(name,month["Monat"]," Fadenl??nge  ",h)

       for(let i=0;i<3;i++){
        for(let j=0;j<numCol;j++){
            var geo = new THREE.BoxBufferGeometry( paperwidth, paperheight, 0.1);
           // geo.rotateZ(Math.PI/8)
           // geo.rotateY(Math.random()*Math.PI/2)
        // geo.translate( j*b/4-b/2, -h-paperheight/2,(-counter)-i*(len/3));
            geo.translate( -b/2+paperwidth/2 +j*paperwidth+offset/2 +j*gap, -h-paperheight/2,(-counter)-i*(len/3));
            cubes.push(geo)
            }
        }
        counter+=len
        })
        const mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(cubes);
        mergedGeometry.computeVertexNormals();
        var mesh = new THREE.Mesh(mergedGeometry, material);
        return mesh;
}


const generatePaperHeightMonth=(months,b,l,name,scale)=>{
    var material = new THREE.MeshStandardMaterial( { color: 0xccccff })
    material.flatShading=true;
    let counter=0;
    let maxH=0;
    var cubes = []
    let  offset=b-((paperwidth*numCol)+((numCol-1)*gap));
    months.map((month)=>{
    let cases=parseInt(month[name], 10);
    let len=month_len;
    const h=computeHeightStraight(cases,guiControlls.lineScaler);
       for(let i=0;i<1;i++){
        for(let j=0;j<numCol;j++){
            var geo = new THREE.BoxBufferGeometry( paperwidth, paperheight, 0.1);
           // geo.rotateZ(Math.PI/8)
           // geo.rotateY(Math.random()*Math.PI/2)
        // geo.translate( j*b/4-b/2, -h-paperheight/2,(-counter)-i*(len/3));
            geo.translate( -b/2+paperwidth/2 +j*paperwidth+offset/2 +j*gap, -guiControlls.topshift,(-counter));
            cubes.push(geo)
            }
        }
        counter+=len
        })
        const mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(cubes);
        mergedGeometry.computeVertexNormals();
        var mesh = new THREE.Mesh(mergedGeometry, material);
        return mesh;
}


const generatePaperHeightMonth_between=(months,b,l,name,scale)=>{
    var material = new THREE.MeshStandardMaterial( { color: 0xff0000 })
    material.flatShading=true;
    let counter=0;
    let maxH=0;
    var cubes = []
    let  offset=b-((paperwidth*numCol)+((numCol-1)*gap));
    months.map((month)=>{
    let cases=parseInt(month[name], 10);
    let len=month_len;
       const h=computeHeightStraight(cases,guiControlls.lineScaler);
       for(let i=0;i<3;i++){
        for(let j=0;j<numCol;j++){
            var geo = new THREE.BoxBufferGeometry( paperwidth, paperheight, 0.1);
           // geo.rotateZ(Math.PI/8)
           // geo.rotateY(Math.random()*Math.PI/2)
        // geo.translate( j*b/4-b/2, -h-paperheight/2,(-counter)-i*(len/3));
            geo.translate( -b/2+paperwidth/2 +j*paperwidth+offset/2 +j*gap, -guiControlls.topshift,(-counter)-i*(len/3));
            cubes.push(geo)
            }
        }
        counter+=len
        })
        const mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(cubes);
        mergedGeometry.computeVertexNormals();
        var mesh = new THREE.Mesh(mergedGeometry, material);
        return mesh;
}


const generatePaperHeightColor=(months,b,l,name,scale)=>{
    var material = new THREE.MeshStandardMaterial( { color: 0xffcccc })
    material.flatShading=true;
    let counter=0;
    let maxH=0;
    var cubes = []
    let myheight=5;
    let mywidth=5;


    let  offset=b-((paperwidth*numCol)+((numCol-1)*gap));


    months.map((month)=>{
        let cases=parseInt(month[name], 10);
        let len=month_len;
        //const h=computeHeight(b,l*4,cases*scale);
        const h=computeHeightStraight(cases,guiControlls.lineScaler);
        console.log(name,month["Monat"]," Durchschnitt Fadenl??nge ",h)
        for(let i=0;i<3;i++){
            for(let j=0;j<numCol;j++){
                var geo = new THREE.BoxBufferGeometry( mywidth, myheight, 0.1);
                // geo.translate( j*b/4-b/2, -h-myheight/2,(-counter)-i*(len/3));
                geo.translate( -b/2+paperwidth/2 +j*paperwidth+offset/2 +j*gap, -h-myheight/2,(-counter)-i*(len/3));
                cubes.push(geo)
                }
            }
        counter+=len
    })
    const mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(cubes);
    mergedGeometry.computeVertexNormals();
    var mesh = new THREE.Mesh(mergedGeometry, material);
    return mesh;
}


const generatePaperHeightDeviation=(months,b,l,name,scale)=>{
    var material = new THREE.MeshStandardMaterial( { color: 0xcccccc })
    material.flatShading=true;
    let counter=0;
    let maxH=0;
    var cubes = []

    let  offset=b-((paperwidth*numCol)+((numCol-1)*gap));


    months.map((month)=>{
        let cases=parseInt(month[name], 10);
        let len=l*4;
       // const h=computeHeight(b,l*4,cases*scale);
        const h=computeHeightStraight(cases,guiControlls.lineScaler);
        for(let i=0;i<3;i++){
            for(let j=0;j<numCol;j++){
                var geo = new THREE.BoxBufferGeometry( paperwidth, paperheight, 0.1);
               geo.rotateZ(Math.PI/8)
                geo.rotateY(Math.random()*Math.PI/2)
                //geo.translate( j*b/4-b/2, -h-paperheight/2,(-counter)-i*(len/3));
                geo.translate( -b/2+paperwidth/2 +j*paperwidth+offset/2 +j*gap, -h-paperheight/2,(-counter)-i*(len/3));

                cubes.push(geo)
            }
        }
        counter+=len
    })
    const mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(cubes);
    mergedGeometry.computeVertexNormals();
    var mesh = new THREE.Mesh(mergedGeometry, material);
    return mesh;
}


const generatePaperHeightVolume=(months,b,l,name,scale)=>{
    var material = new THREE.MeshStandardMaterial( { color: 0xeeeeee })
    material.flatShading=true;
    let counter=0;
    let papercounter=0;
    let maxH=0;
    var cubes = []
    months.map((month)=>{
    let cases=parseInt(month[name], 10);
       let len=l*4;
       const h=computeHeight(b,l*4,cases*scale);
       //const h=computeHeightStraight(cases,guiControlls.lineScaler);
       let multi=Math.ceil(h/(paperheight));

    for(let i=0;i<3;i++){
        for(let j=0;j<3;j++){
            for(let k=0;k<multi;k++){
                var geo = new THREE.BoxBufferGeometry( paperwidth, paperheight , 0.1);
                geo.rotateZ(Math.PI/8)
    
                geo.rotateY(Math.random()*Math.PI/4)
                console.log("shift",h,k,-multi*k,k*(paperheight))
                //*b/4-b/2
                geo.translate( ((-b/2+paperwidth/2)+j*paperwidth)+j*0.5, (-paperheight*k)-k*1,(-counter)-i*(len/3));
                cubes.push(geo)
                papercounter++;
            }


        }
    }
        counter+=len
        })
        const mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(cubes);
        mergedGeometry.computeVertexNormals();

        var mesh = new THREE.Mesh(mergedGeometry, material);
        console.log("Total Paper: ",papercounter);
        return mesh;
}





const generatePaperDensity=(months,b,l,name,scale)=>{
    var material = new THREE.MeshStandardMaterial( { color: 0xcccccc })
    material.flatShading=true;
    let counter=0;
    let maxH=0;
    var cubes = []
    months.map((month)=>{
     //   console.log(month)
        let cases=parseInt(month[name], 10);
       // const h=computeHeight(b,l*4,cases*scale);

       let len=l*4;
       for(let i=0;i<cases/2000;i++){
        var geo = new THREE.BoxBufferGeometry( paperwidth, paperheight, 0.1);
        geo.rotateY(Math.random()*Math.PI)

        geo.translate( (Math.random()*(b-20))-b/2, Math.random()*100,(-counter)+(-(Math.random()*(len-10)))+l/2);
        cubes.push(geo)
       }
      
        counter+=len
        })
        const mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(cubes);
        mergedGeometry.computeVertexNormals();

        var mesh = new THREE.Mesh(mergedGeometry, material);
        return mesh;
}



const makeLine=(months,b,l,h)=>{
    var material = new THREE.MeshStandardMaterial( { color: 0xffccff })
    material.flatShading=true;
    let counter=0;
    let maxH=0;
    var cubes = []
    let myheight=5;
    let mywidth=5;

    let  offset=b-((paperwidth*numCol)+((numCol-1)*gap));

    months.map((month)=>{
        let cases=parseInt(month[name], 10);
       let len=l*4;
       //const h=computeHeight(b,l*4,cases*scale);
       for(let i=0;i<3;i++){
       for(let j=0;j<4;j++){

        var geo = new THREE.BoxBufferGeometry( mywidth, myheight, 0.1);
      //  geo.rotateZ(Math.PI/8)
       // geo.rotateY(Math.random()*Math.PI/2)
       // geo.translate( j*b/4-b/2, -h-myheight/2,(-counter)-i*(len/3));
        geo.translate( -b/2+paperwidth/2 +j*paperwidth+offset/2 +j*gap, -h-myheight/2,(-counter)-i*(len/3));

        cubes.push(geo)
        }
    }
        counter+=len
        })
        const mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(cubes);
        mergedGeometry.computeVertexNormals();

        var mesh = new THREE.Mesh(mergedGeometry, material);
        return mesh;
}


