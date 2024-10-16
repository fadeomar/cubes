function PointerParticle(spread, speed, component) {
  const { ctx, pointer, hue } = component;

  let x = pointer.x;
  let y = pointer.y;
  let mx = pointer.mx * 0.1;
  let my = pointer.my * 0.1;
  let size = Math.random() + 1;
  const decay = 0.01;
  const particleSpeed = speed * 0.08;
  const particleSpread = spread * particleSpeed;
  let spreadX = (Math.random() - 0.5) * particleSpread - mx;
  let spreadY = (Math.random() - 0.5) * particleSpread - my;
  const color = `hsl(${hue}deg 90% 60%)`;

  function draw() {
    if (size > 0) {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function collapse() {
    if (size > 0) {
      size -= decay;
    }
  }

  function trail() {
    x += spreadX * size;
    y += spreadY * size;
  }

  function update() {
    draw();
    trail();
    collapse();
  }

  return {
    update,
  };
}

class PointerParticles extends HTMLElement {
  static register(tag = "pointer-particles") {
    if ("customElements" in window) {
      customElements.define(tag, this);
    }
  }

  static css = `
    :host {
      display: grid;
      width: 100%;
      height: 100%;
      pointer-events: none;
    }
  `;

  constructor() {
    super();

    this.canvas;
    this.ctx;
    this.fps = 60;
    this.msPerFrame = 1000 / this.fps;
    this.timePrevious;
    this.particles = [];
    this.pointer = {
      x: 0,
      y: 0,
      mx: 0,
      my: 0,
    };
    this.hue = 0;
  }

  connectedCallback() {
    const canvas = document.createElement("canvas");
    const sheet = new CSSStyleSheet();

    this.shadowroot = this.attachShadow({ mode: "open" });

    sheet.replaceSync(PointerParticles.css);
    this.shadowroot.adoptedStyleSheets = [sheet];

    this.shadowroot.append(canvas);

    this.canvas = this.shadowroot.querySelector("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.setCanvasDimensions();
    this.setupEvents();
    this.timePrevious = performance.now();
    this.animateParticles();
  }

  createParticles(event, { count, speed, spread }) {
    this.setPointerValues(event);

    for (let i = 0; i < count; i++) {
      this.particles.push(new PointerParticle(spread, speed, this));
    }
  }

  setPointerValues(event) {
    this.pointer.x = event.x - this.offsetLeft;
    this.pointer.y = event.y - this.offsetTop;
    this.pointer.mx = event.movementX;
    this.pointer.my = event.movementY;
  }

  setupEvents() {
    const parent = this.parentNode;

    parent.addEventListener("click", (event) => {
      this.createParticles(event, {
        count: 300,
        speed: Math.random() + 1,
        spread: Math.random() + 50,
      });
    });

    window.addEventListener("resize", () => this.setCanvasDimensions());

    parent.addEventListener("pointermove", (event) => {
      this.createParticles(event, {
        count: 20,
        speed: this.getPointerVelocity(event),
        spread: 1,
      });
    });
  }

  getPointerVelocity(event) {
    const a = event.movementX;
    const b = event.movementY;
    const c = Math.floor(Math.sqrt(a * a + b * b));

    return c;
  }

  handleParticles() {
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].update();

      if (this.particles[i].size <= 0.1) {
        this.particles.splice(i, 1);
        i--;
      }
    }
  }

  setCanvasDimensions() {
    const rect = this.parentNode.getBoundingClientRect();

    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
  }

  animateParticles() {
    requestAnimationFrame(() => this.animateParticles());

    const timeNow = performance.now();
    const timePassed = timeNow - this.timePrevious;

    if (timePassed < this.msPerFrame) return;

    const excessTime = timePassed % this.msPerFrame;

    this.timePrevious = timeNow - excessTime;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.hue = this.hue > 360 ? 0 : (this.hue += 3);

    this.handleParticles();
  }
}

PointerParticles.register();
