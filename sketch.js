class Carta{
  constructor(id,name,imagen,x,y,w,h,status){
    this.id = id;
    this.name = name;
    this.imagen = imagen;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.status = status; // 0 = oculta, 1 = volteada, 2 = resuelta
  }

  oculta(){
    fill("red");
    stroke("white");
    strokeWeight(3);
    rect(this.x,this.y,this.w,this.h)
  }

  mostrar(){
    fill("white");
    stroke("black");
    strokeWeight(2);
    rect(this.x,this.y,this.w,this.h)
    image(this.imagen, this.x, this.y+((this.h-100)/2), 100, 100);

    fill("black");
    textSize(16);
    strokeWeight(0);
    textAlign(CENTER);
    text(this.name, this.x+(this.w/2), (this.y+this.h)-20);
  }
}
let baraja = [];

let cartasSeleccionadas = [];
let segundos = 0;
let minutos = 0;
let frames = 0;
let pausa = false;
let espera = 0;

let resuelto = false;

function setup() {
  createCanvas(900, 700);
  getData();
}

function draw() {
  frameRate(30);
  frames++;
  background(220);
  // PINTAR CARTAS
  baraja.forEach(card => {
    if (card.status == 0){
      card.oculta();
    }else{
      card.mostrar();
    }
    //console.log(card.x+", "+card.y+", name: "+card.name);
  });
  if(!pausa){
    actualizar();
    tiempo();
  }else{
    tiempo_espera();
  }
  fill("black");
  textSize(30);
  strokeWeight(0);
  textAlign(CENTER);
  text("Tiempo: "+convertirTiempo(segundos), 720, 670);
}

function actualizar(){
  if(!pausa){
    if(cartasSeleccionadas.length == 2){
      pausa = true;

      if(cartasSeleccionadas[0].id == cartasSeleccionadas[1].id){
        baraja.forEach(card => {
          cartasSeleccionadas.forEach(seleccion => {
            if(card.id == seleccion.id){
              card.status = 2;
              pausa = false;
            }
          });
        });
        cartasSeleccionadas.pop();
        cartasSeleccionadas.pop();
      }

    }
  }
  baraja.forEach(card => {
    if(card.status == 2 && resuelto){
      resuelto = true;
    }else{
      resuelto = false;
    }
  });

  if(resuelto && segundos>10){
    pintarVictoria();
    noLoop();
  }

  resuelto = true;
}

function pintarVictoria(){
  fill("black");
  stroke("white");
  strokeWeight(2);
  rect(0,0,900,700,20)

  fill("white");
  textSize(50);
  strokeWeight(0);
  textAlign(CENTER);
  text("¡Felicitaciones!", 450, 200);

  fill("white");
  textSize(30);
  strokeWeight(0);
  textAlign(CENTER);
  text("Juego completado en...", 450, 350);

  fill("white");
  textSize(30);
  strokeWeight(0);
  textAlign(CENTER);
  text(convertirTiempo(segundos), 450, 400);
}

function mouseReleased(){
  if(!pausa){
    baraja.forEach(card => {
      if(mouseX >= card.x &&
        mouseX <= (card.x+card.w) &&
        mouseY >= card.y &&
        mouseY <= (card.y+card.h)){
  
          if(card.status == 0){
            card.status = 1;
            cartasSeleccionadas.push(card)
          }else if(card.status == 1){
            card.status = 0;
            cartasSeleccionadas.pop(card)
          }
      }
    });
  }
}

function tiempo_espera(){
  if (frames>29){
    frames=0;
    espera+=1;
    segundos+=1;
  }
  if(espera >= 2){
    pausa = false;
    cartasSeleccionadas.forEach(card => {
      card.status = 0;
    });
    cartasSeleccionadas.pop();
    cartasSeleccionadas.pop();
    espera=0;
  }
}

function tiempo(){
  if (frames>29){
    frames=0;
    segundos+=1;
  }
}

function posicionarCartas(){
  let count = 0;
  let pos_x = 10;
  let pos_y = 10;

  for(let i=0;i<=5;i++){
    baraja = shuffle(baraja);
  }
  
  for(let i=0;i<4;i++){
    for(let j=0;j<5;j++){
      if(j==0){
        pos_x += (110*j);
      }else{
        pos_x = (110*j)+10;
      }
      baraja[count].x = pos_x;
      baraja[count].y = pos_y;
      count++;
    }
    pos_x = 10;
    pos_y = 175*(i+1);
  }
}

async function getData() {
  let promises = [];

  for (let i = 0; i < 10; i++) {
    let url = `https://pokeapi.co/api/v2/pokemon/${randomInt()}`;
    let promise = fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }
        return response.json();
      })
      .then(json => new Promise(resolve => {
        loadImage(json.sprites.front_default, img => {
          resolve(new Carta(i + 1, json.name, img, 0, 0, 100, 160, 0));
        });
      }));

    promises.push(promise);
  }

  try {
    let cartas = await Promise.all(promises);
    
    let duplicados = cartas.map(c => {
      let imgCopia = c.imagen.get();
      return new Carta(c.id, c.name, imgCopia, 0, 0, 100, 160, 0);
    });

    baraja = [...cartas, ...duplicados];

    console.log("Cartas cargadas:", baraja.map(c => c.name));
    
    posicionarCartas();
  } catch (error) {
    console.error("Error al cargar las cartas:", error);
  }
}

function randomInt(){
  return Math.floor(Math.random() * 1025) + 1;
}

function convertirTiempo(segundos) {
  let h = Math.floor(segundos / 3600);
  let m = Math.floor((segundos % 3600) / 60);
  let s = segundos % 60;

  return [h, m, s].map(unit => String(unit).padStart(2, '0')).join(':');
}