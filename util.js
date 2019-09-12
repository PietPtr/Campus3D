var seed = Math.random() * 51413;

function random() {
    var x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}


function loadOBJ(name) {
    return new Promise(resolve => {
        let loader = new THREE.OBJLoader();
        // loader.setMaterials(materials);
        // loader.setPath('/resources/models/obj/');

        return loader.load(name + '.obj', resolve);
    })
}

function loadMTL(name) {
    return new Promise(resolve => {
        let loader = new THREE.MTLLoader();
        let path = name.split("/");
        path.pop();
        let folder = path.join("/") + "/";

        loader.setTexturePath('/');
        loader.setPath('/');

        return loader.load(name + '.mtl', resolve);
    })
}

function loadModel(name) {
    let mtlPromise = loadMTL(name).then(materials => {
        return materials;
    });

    let objPromise = mtlPromise.then(materials => {
        return loadOBJ(name, materials);
    });

    return objPromise
}
