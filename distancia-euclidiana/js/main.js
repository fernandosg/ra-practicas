var renderer=new THREE.WebGLRenderer();
renderer.autoClear=false;
renderer.setSize(640,480);
document.getElementById("canvas").appendChild(renderer.domElement);
var escena=new THREE.Scene();
var camara = new THREE.PerspectiveCamera( 75, 640 / 480, 0.1, 50 );
var geometria=new THREE.PlaneGeometry(10,10);
var material=new THREE.MeshBasicMaterial();
var objeto_1=new THREE.Mesh(geometria,material);
objeto_1.position.z=-50;


var color_t=new THREE.Color("rgb(126, 146, 245)");
var material=new THREE.MeshBasicMaterial({color:color_t});
var objeto_2=new THREE.Mesh(geometria,material);
objeto_2.position.x=30;
objeto_2.position.z=-50;
escena.add(objeto_1);
escena.add(objeto_2);


function moverElemento(evt){
  switch(evt){
    case "izq":
    objeto_2.position.x=objeto_2.position.x-1;
    break;
    case "der":
    objeto_2.position.x=objeto_2.position.x+1;
    break;
    case "arr":
    objeto_2.position.y=objeto_2.position.y+1;
    break;
    case "aba":
    objeto_2.position.y=objeto_2.position.y-1;
    break;
  }
  verificarColision();
}

var capa_mensaje=document.getElementById("mensaje");
function verificarColision(){
  if(distanciaEuclidiana(objeto_1,objeto_2)<=10){
    capa_mensaje.innerHTML="Colisiono";
  }else{
    capa_mensaje.innerHTML="No colisiono";
  }
}

function distanciaEuclidiana(objeto1,objeto2){
  return Math.sqrt(Math.pow((objeto1.position.x-objeto2.position.x),2)+Math.pow((objeto1.position.y-objeto2.position.y),2));
}

function loop(){
  renderer.clear();
  renderer.render(escena,camara);
  requestAnimationFrame(loop);
}

loop();
