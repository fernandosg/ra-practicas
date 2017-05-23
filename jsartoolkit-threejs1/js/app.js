WIDTH_CANVAS=640;
HEIGHT_CANVAS=480;
var renderer = new THREE.WebGLRenderer();
renderer.autoClear = false;
renderer.setSize(WIDTH_CANVAS,HEIGHT_CANVAS);
document.getElementById("threejs").appendChild(renderer.domElement);
var escena=new THREE.Scene();
var camara=new THREE.Camera();
var planoCamara=new THREE.Camera();
canvas=document.createElement("canvas");
canvas.width=WIDTH_CANVAS;
canvas.height=HEIGHT_CANVAS;
ctx=canvas.getContext("2d");
var video=new THREEx.WebcamTexture(WIDTH_CANVAS,HEIGHT_CANVAS);
videoTexture=video.texture;
videoTexture.minFilter = THREE.LinearFilter;
videoTexture.magFilter = THREE.LinearFilter;
movieMaterial = new THREE.MeshBasicMaterial( { map: videoTexture, depthTest: false, depthWrite: false} );
var movieGeometry = new THREE.PlaneGeometry(2,2,0.0);
movieScreen = new THREE.Mesh( movieGeometry, movieMaterial );
movieScreen.material.side = THREE.FrontSIde;
escena.add(movieScreen);

materialMarcador = new THREE.MeshBasicMaterial({side: THREE.FrontSIde});
geometriaMarcador = new THREE.PlaneGeometry(60,60);
meshMarcador = new THREE.Mesh( geometriaMarcador, materialMarcador );
meshMarcador.matrixAutoUpdate = false;
meshMarcador.visible=false;
escena.add(meshMarcador);

JSARRaster = new NyARRgbRaster_Canvas2D(canvas);
JSARParameters = new FLARParam(canvas.width, canvas.height);
detector = new FLARMultiIdMarkerDetector(JSARParameters, 60);
result = new Float32Array(16);
detector.setContinueMode(true);
JSARParameters.copyCameraMatrix(result, .1, 2000);

THREE.Matrix4.prototype.setFromArray = function(m) {
  return this.set(
    m[0], m[4], m[8], m[12],
    m[1], m[5], m[9], m[13],
    m[2], m[6], m[10], m[14],
    m[3], m[7], m[11], m[15]
  );
}

THREE.Object3D.prototype.transformFromArray = function(m) { // (7)
  this.matrix.setFromArray(m);
  this.matrixWorldNeedsUpdate = true;
}

planoCamara.projectionMatrix.setFromArray(result);

function getTransformMatrix(idx) {
  var mat = new NyARTransMatResult();
  detector.getTransformMatrix(idx, mat);
  var cm = new Float32Array(16);
  cm[0] = mat.m00;
  cm[1] = -mat.m10;
  cm[2] = mat.m20;
  cm[3] = 0;
  cm[4] = mat.m01;
  cm[5] = -mat.m11;
  cm[6] = mat.m21;
  cm[7] = 0;
  cm[8] = -mat.m02;
  cm[9] = mat.m12;
  cm[10] = -mat.m22;
  cm[11] = 0;
  cm[12] = mat.m03;
  cm[13] = -mat.m13;
  cm[14] = mat.m23;
  cm[15] = 1;
  return cm;
}

function obtenerMarcador(markerCount){
  var matriz_encontrada;
  for(var i=0;i<markerCount;i++){
    matriz_encontrada=getTransformMatrix(i);
    break;
  }
  return matriz_encontrada;
}

var THREESHOLD=80;
function detectarMarcador(){
  var cantidadMarcadores = detector.detectMarkerLite(JSARRaster, THREESHOLD);
  if(cantidadMarcadores>0){
    meshMarcador.transformFromArray(obtenerMarcador(cantidadMarcadores));
    meshMarcador.matrixWorldNeedsUpdate=true;
    meshMarcador.visible=true;
  }
}

function loop(){
  renderer.clear();
  renderer.render(escena,camara);
  renderer.render(escena,planoCamara);
  ctx.drawImage(video.video,0,0,WIDTH_CANVAS,HEIGHT_CANVAS);
  canvas.changed=true;
  movieScreen.material.map.needsUpdate=true;
  detectarMarcador();
  requestAnimationFrame(loop);
}
loop();
