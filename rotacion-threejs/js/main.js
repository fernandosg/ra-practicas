var renderer=new THREE.WebGLRenderer();
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
  var material_frente=new THREE.MeshBasicMaterial({map:textura_frente});
  material_frente.transparent=true;
  var mesh=new THREE.Mesh(geometria,material_frente);
  objeto.add(mesh);
  textura_frente.needsUpdate = true;
}

function cargaImagenTrasera(textura_atras,objeto,geometria){
  textura_atras.minFilter = THREE.LinearFilter;
  textura_atras.magFilter = THREE.LinearFilter;
  var material_atras=new THREE.MeshBasicMaterial({map:textura_atras});
  material_atras.transparent=true;
  geometria.applyMatrix( new THREE.Matrix4().makeRotationY( Math.PI ) );
  var mesh=new THREE.Mesh(geometria,material_atras);
  objeto.add(mesh);
  textura_atras.needsUpdate = true;
}

function cargaTexturas(imagen1,imagen2,objeto,geometria){
  carga_imagen.load( imagen1, function(textura_frontal) {
        cargaImagenFrontal(textura_frontal,objeto,geometria);
        carga_imagen.load(imagen2, function(textura_trasera) {
          var geometria_trasera=geometria.clone();
            cargaImagenTrasera(textura_trasera,objeto,geometria_trasera);
        });
    })
}

cargaTexturas("./img/sin_voltear.jpg","./img/carta.jpg",objeto,geometria);


function rotarY(objeto,grados){
  objeto.rotation.y=THREE.Math.degToRad(grados);
}


var cont_grados=0;
var animacion;
document.getElementById("rotarDerecha").addEventListener("click",function(evt){
  rotarY(objeto,cont_grados);
  cont_grados++;
});

document.getElementById("rotarIzquierda").addEventListener("click",function(evt){
  rotarY(objeto,cont_grados);
  cont_grados--;
});


document.getElementById("animacionDerecha").addEventListener("click",function(evt){
  clearInterval(animacion);
  animacion=setInterval(function(){
    rotarY(objeto,cont_grados);
    cont_grados++;
    if(cont_grados>180)
      clearInterval(animacion);
  },10);
});


document.getElementById("animacionIzquierda").addEventListener("click",function(evt){
  clearInterval(animacion);
  animacion=setInterval(function(){
    rotarY(objeto,cont_grados);
    cont_grados--;
    if(cont_grados<0)
    clearInterval(animacion);
  },10);
});

function loop(){
  renderer.clear();
  renderer.render(escena,camara);
  for(var i=0;i<objeto.children.length;i++){
      if(objeto.children[i].material.map)
          objeto.children[i].material.map.needsUpdate=true;
  }
  requestAnimationFrame(loop);
}

loop();
