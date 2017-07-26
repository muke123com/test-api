/**
 * three 基础
 */
var baseLoaded = 0;
var objLoaded = 0;

function $(el){
	return document.querySelector(el);
}

function baseThree(){
	$(".webgl-content").style.display = "none";
	$(".webgl-base").style.display = "block";
	if(baseLoaded == 1){
		return false;
	}
	var scene = new THREE.Scene();
	//1.视野角， 2.纵横比， 3.最近距离， 4.最远距离
	var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);  
	var renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.shadowMap.enabled = true;  
	$(".webgl-base").appendChild(renderer.domElement);
	//载入背景贴图	
	//http://www.humus.name/index.php?page=Textures 图片下载地址
	var cube_loader = new THREE.CubeTextureLoader();
	cube_loader.setPath('/images/bg/');
	var textureCube = cube_loader.load( [
		'posx.jpg', 
		'negx.jpg', 
		'posy.jpg', 
		'negy.jpg', 
		'posz.jpg', 
		'negz.jpg', 
	] )
	scene.background = textureCube;
	//控制
	var controls = new THREE.OrbitControls( camera, renderer.domElement );
	controls.addEventListener('change', function() {
		renderer.render(scene, camera);
	})
	//cube
	var texture = THREE.TextureLoader('/images/crate.gif');  //载入贴图
	var geometry = new THREE.BoxGeometry(10,10,10);
	var cube_material = new THREE.MeshLambertMaterial( { color: 0xf08b2f } ); 
	cube_material.map = texture;  //材质添加贴图
	var cube = new THREE.Mesh( geometry, cube_material );
	cube.castShadow = true;  
	scene.add( cube );
	
	//粒子
	var starsGeometry = new THREE.Geometry();
	var star_rad = 100;
	for ( var i = 0; i < 1000; i ++ ) {
		//粒子球体分布公式
		var cosTheta = Math.random() * 2 - 1,
		sinTheta = Math.sqrt(1 - cosTheta * cosTheta);
		var phi = Math.random() * 2 * Math.PI;
		var star = new THREE.Vector3();
		star.x = star_rad * sinTheta * Math.cos(phi);
		star.y = star_rad * sinTheta * Math.sin(phi);
		star.z = star_rad * cosTheta;
	
		starsGeometry.vertices.push( star );
	}
	
	var starsMaterial = new THREE.PointsMaterial({
		color: 0xeeeeee
	});
	
	var starField = new THREE.Points( starsGeometry, starsMaterial );
	scene.add( starField );
	//地板
	var plane_geometry = new THREE.BoxGeometry(40, 0.5, 40);  
	var plane_material = new THREE.MeshPhongMaterial({  
	    color: 0xeeeeee  
	});  
	plane = new THREE.Mesh(plane_geometry, plane_material);  
	plane.receiveShadow = true;  
	plane.position.set(0, -10, 0);  
	scene.add(plane);  
	
	//光源
	var light = new THREE.AmbientLight(0xcccccc);  
	scene.add(light);  
	
	//var slight = new THREE.SpotLight(0xffffff);  
	//slight.position.set(0, 60, 20);  
	//slight.castShadow = true;  
	//scene.add(slight);  
	
	var plight = new THREE.PointLight(0xffffff);  
	plight.position.set(20, 20, 0);  
	plight.castShadow = true;  
	scene.add(plight);  
	
	camera.position.set(0, 10, 10);  
	function animate() {
		requestAnimationFrame( animate );
		cube.rotation.y -= 0.01;
		starField.rotation.y += 0.001;
		renderer.render( scene, camera );
	}
	animate();
	baseLoaded = 1;
}


/**
 * 载入obj模型
 */
function loadObj(){
	$(".webgl-content").style.display = "none";
	$(".webgl-obj").style.display = "block";
	if(objLoaded == 1){
		return false;
	}
	//初始化场景
	var scene = new THREE.Scene();
	var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);  
	var renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.shadowMap.enabled = true;  
	$(".webgl-obj").appendChild(renderer.domElement);
	//控制
	var controls = new THREE.OrbitControls( camera, renderer.domElement );
	controls.addEventListener('change', function() {
		renderer.render(scene, camera);
	})
	//光源
	var light = new THREE.AmbientLight(0xcccccc);  
	scene.add(light);  
	//贴图载入
	var texture = new THREE.Texture();
	var t_loader = new THREE.ImageLoader();
	t_loader.load('/obj/cerberus/Cerberus_A.jpg', function(image){
		texture.image = image;
		texture.needsUpdate = true;
	})
	//模型载入
	var obj_loader = new THREE.OBJLoader();
	obj_loader.load(
		'/obj/cerberus/Cerberus.obj',
		function (obj) {
			obj.traverse(function(child){
				if ( child instanceof THREE.Mesh ) {	
					child.material.map = texture;
				}
			})
			scene.add( obj );
		}
	)
	camera.position.set(0, 10, 20);
	function animate() {
		requestAnimationFrame( animate );
		renderer.render( scene, camera );
	}
	animate();
	
	objLoaded = 1;
}