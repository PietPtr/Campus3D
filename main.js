
//////////////////////////////////////////////////////////////////////////////////
//		Initialisation
//////////////////////////////////////////////////////////////////////////////////

var renderer = new THREE.WebGLRenderer({
    antialias: true
});
renderer.setClearColor(new THREE.Color('#abc9ee'), 1);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Array of functions for the rendering loop
var onRenderFcts = [];

// Initialise scene and camera
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 1000);
camera.position.x = 0;
camera.position.y = 5;
camera.position.z = 5;
var controls = new THREE.OrbitControls(camera);

//////////////////////////////////////////////////////////////////////////////////
//		Scene setup
//////////////////////////////////////////////////////////////////////////////////

// White directional light at half intensity shining from the top.
var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
directionalLight.position.set(10, 10, -10);
directionalLight.castShadow = true;
scene.add( directionalLight );
scene.add( directionalLight.target )
directionalLight.target.position.set(-1, -1, -1);
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.left = -8;
directionalLight.shadow.camera.top = -8;
directionalLight.shadow.camera.right = 8;
directionalLight.shadow.camera.bottom = 8;


var light = new THREE.AmbientLight( 0x607080 ); // soft white light
scene.add( light );

let campusMesh = null;

loadOBJ("campus").then((model) => {
    model.children[0].material = new THREE.MeshPhongMaterial({color: 0xaa1120 });
    model.children[0].castShadow = true;
    scene.add(model);
})

// loadModel("roads").then(model => {
//     console.log(model)
//     scene.add(model);
// })

loadModel("water").then(model => {
    model.children[0].material = new THREE.MeshBasicMaterial({color: 0x87d8f7 });
    scene.add(model)
})

loadModel("fields").then(model => {
    model.traverse(child => {
        child.material = new THREE.MeshBasicMaterial({color: 0x298c57 });
    });
    scene.add(model)
})


loadModel("roads").then(model => {
    model.traverse(child => {
        child.material = new THREE.MeshBasicMaterial({color: 0xfbca78 });
    })
    scene.add(model)
})

loadModel("asphalt").then(model => {
    model.traverse(child => {
        child.material = new THREE.MeshBasicMaterial({color: 0xffffff });
        child.receiveShadow = true;
    })
    model.position.y = 0.004
    scene.add(model)
})

var geometry = new THREE.CircleGeometry( 100, 8 );
geometry.rotateX(-0.5*Math.PI);
var material = new THREE.MeshBasicMaterial( { color: 0x60c44f } );
var circle = new THREE.Mesh( geometry, material );
circle.receiveShadow = true;
scene.add( circle );

//////////////////////////////////////////////////////////////////////////////////
//		Rendering
//////////////////////////////////////////////////////////////////////////////////

window.addEventListener('resize', function(){
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}, false);

onRenderFcts.push(function(){
    renderer.render( scene, camera );
});

var lastTimeMsec= null
requestAnimationFrame(function animate(nowMsec){
    requestAnimationFrame(animate);

    lastTimeMsec = lastTimeMsec || nowMsec-1000/60;
    var deltaMsec = Math.min(200, nowMsec - lastTimeMsec);
    lastTimeMsec = nowMsec;

    onRenderFcts.forEach(function(onRenderFct){
        onRenderFct(deltaMsec / 1000, nowMsec / 1000)
    });
});
