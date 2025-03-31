class Carta{
  constructor(id,imagen,x,y,w,h,status){
    this.id = id;
    this.imagen = imagen;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.status = status; // 0 = oculta, 1 = volteada, 2 = resuelta
  }

  voltear(){
    fill("red");
    stroke("red");
    rect(this.x,this.y,this.w,this.h)
  }

  mostrar(){
    stroke("black");
    rect(this.x,this.y,this.w,this.h)
    image(this.imagen, this.x, this.y+((this.h-150)/2), 100, 100);
  }
}
let baraja = [];

function preload(){
  for(let i=0;i<10;i++){
  let url = `https://pokeapi.co/api/v2/pokemon/${randomInt()}`;
  let img;
  fetch(url)
    .then(response => response.json())
    .then(json => {
      img = loadImage(json.sprites.front_default);
      baraja.push(new Carta(i+1,img,0,0,100,160,0));
      baraja.push(new Carta(i+1,img,0,0,100,160,0));
      console.log(json)
    })
    .catch(err => console.log('Solicitud fallida', err));
  }
}

function setup() {
  createCanvas(900, 700);
  posicionarCartas();
}

function draw() {
  background(220);

  // PINTAR CARTAS
  baraja.forEach(card => {
    card.mostrar();
  });
}

function posicionarCartas(){
  let count = 0;
  let pos_x = 0;
  let pos_y = 0;

  for(let i=0;i<=5;i++){
    baraja = shuffle(baraja);
  }
  
  for(let i=0;i<4;i++){
    for(let j=0;j<5;j++){
      baraja[count].x = pos_x;
      baraja[count].y = pos_y;
      pos_x = 100*(j+1);
      count++;
    }
    pos_x = 0;
    pos_y = 160*(i+1);
  }
}

async function getData(i) {
  const url = `https://pokeapi.co/api/v2/pokemon/${randomInt()}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const json = await response.json();
    baraja.push(new Carta(i+1,loadImage(json.sprites.front_default),0,0,100,160,0));
    baraja.push(new Carta(i+1,loadImage(json.sprites.front_default),0,0,100,160,0));
  } catch (error) {
    console.error(error.message);
  }
}

function randomInt(){
  return Math.floor(Math.random() * 1025) + 1;
}