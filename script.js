const startButton = document.getElementById('start-button');
const speaker = document.getElementById('speaker');
const header = document.getElementById('header');
const canvas_element = document.getElementById('canvas');

const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

recognition.continuous = true;
recognition.interimResults = false;

startButton.addEventListener('click', () => {
    recognition.start();
    startButton.style.display = 'none';
    header.style.display = 'none';
    speaker.classList.add('listening'); 
    speaker.style.display = 'block';
});

const regex = /\bOPTIMUS\b/;

recognition.onresult = (event) => {
    const transcript = event.results[event.resultIndex][0].transcript.trim().toUpperCase();
    console.log(transcript);
    if (regex.test(transcript)) {
        explode();
    }
};

recognition.onerror = (event) => {
    console.error('Error occurred in recognition:', event.error);
    speaker.style.display = 'none';
};

const audio = document.getElementById("myAudio");

function explode() {
    canvas_element.classList.remove('hidden');
    canvas_element.classList.add('visible');
    
    audio.play();
}

//canvas 

const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
window.addEventListener("resize", function () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
const fireWorks = [];

function random(max, min) {
  return Math.floor(Math.random() * max) + min;
}

class FireWorkPerticle {
  constructor(x, y, size, color) {
    this.x = x;
    this.y = y;
    this.speed = random(4, 1);
    this.color = color;
    //"hsl(" + (Math.random() * 360 - 180) + ",100%,50%)";
    this.moveX = Math.random() * 3 - 1.5;
    this.moveY = Math.random() * 3 - 1.5;
    this.size = size / 2.5;
    if (this.size < 1) {
      this.size = 1;
    }
    this.v = 0.0;
  }
  update() {
    this.x += this.moveX;
    this.y += this.moveY + this.v;
    if (this.size > 0.1) {
      this.v += 0.015;
      this.size -= 0.01;
    }
  }

  drow() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

class FireWork {
  constructor() {
    this.x = random(canvas.width, 1);
    this.y = canvas.height + 20;
    this.speed = random(4, 1);
    this.exp = random(canvas.height / 2, 0);
    this.size = random(3, 1);
    this.life = true;
    this.expParticle = [];
    this.color = "hsl(" + (Math.random() * 360 - 1) + ",100%,50%)";
  }
  drow() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
  }
  move() {
    let dy = this.y - this.exp;
    if (dy > 10) {
      this.y -= (this.speed * dy) / 50;
    } else {
      this.y = this.exp;
      //Remove
      this.explode();
      this.color = "transparent";
    }
    if (!this.life) {
      this.explodeUpdate();
    }
  }
  explode() {
    if (this.life) {
      for (var i = 0; i < 100; i++) {
        this.expParticle.push(
          new FireWorkPerticle(this.x, this.y, this.size, this.color)
        );
      }
    }
    this.life = false;
  }
  explodeUpdate() {
    //console.log(this.expParticle);
    for (var i = 0; i < this.expParticle.length; i++) {
      this.expParticle[i].update();
      this.expParticle[i].drow();
      if (this.expParticle[i].size < 0.2) {
        this.expParticle.splice(i, 1);
      }
    }
    if (this.expParticle.length < 1) {
      this.life = "end";
    }
  }
}
function FireWorkInit(apendNew) {
  if (apendNew) {
    fireWorks.push(new FireWork());
  }
  for (let i = 0; i < fireWorks.length; i++) {
    fireWorks[i].drow();
    fireWorks[i].move();
    if (fireWorks[i].life == "end") {
      fireWorks.splice(i, 1);
    }
  }
}
let frm = 10;

function animate() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  frm++;
  if (frm % 20 == 0) {
    FireWorkInit(true);
  } else {
    FireWorkInit();
  }

  ctx.font = "50px Poppins"; 
  ctx.fillStyle = "white"; 
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const text = "Happy Diwali, Optimus Family";
  const x = canvas.width / 2;
  const y = canvas.height / 2;

  ctx.fillText(text, x, y);

  requestAnimationFrame(animate);
}
animate();
