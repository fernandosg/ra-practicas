var renderer=new THREE.WebGLRenderer();
renderer.autoClear=false;
renderer.setSize(640,480);
document.getElementById("canvas").appendChild(renderer.domElement);
var escena=new THREE.Scene();
var camara = new THREE.PerspectiveCamera( 75, 640 / 480, 0.1, 50 );
var geometria=new THREE.PlaneGeometry(10,10);
var objeto=new THREE.Group();
objeto.position.z=-20;
escena.add(objeto);

var carga_imagen=new THREE.TextureLoader();

function cargaImagenFrontal(textura_frente,objeto,geometria){
  textura_frente.minFilter = THREE.LinearFilter;
  textura_frente.magFilter = THREE.LinearFilter;
  material_frente=new THREE.MeshBasicMaterial({map:textura_frente});
  material_frente.transparent=true;
  mesh=new THREE.Mesh(geometria,material_frente);
  objeto.add(mesh);
  textura_frente.needsUpdate = true;
}

function cargaTexturas(imagen,objeto,geometria){
  carga_imagen.load( imagen, function(textura_frontal) {
        cargaImagenFrontal(textura_frontal,objeto,geometria_frontal);
    })
}

cargaTexturas("./img/star.png",objeto,geometria);

var animacion;
document.getElementById("fadeIn").addEventListener("click",function(evt){
  clearInterval(animacion);
  animacion=setInterval(function(){
    if(objeto.position.z>-20){
      objeto.position.z=-20;
      clearInterval(animacion);
    }
    objeto.position.z=objeto.position.z+1;
  },10);
});

document.getElementById("fadeOut").addEventListener("click",function(evt){
  clearInterval(animacion);
  animacion=setInterval(function(){
    if(objeto.position.z<-50)
      clearInterval(animacion);
    objeto.position.z=objeto.position.z-1;
  },10);
});


function loop(){
  renderer.clear();
  renderer.render(escena,camara);
  requestAnimationFrame(loop);
}

loop();
