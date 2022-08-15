const canvasSketch = require('canvas-sketch');

const math = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
};

const num = 120;
const slice = math.degToRad(360/num);

const sketch = ({ context, width, height }) => {
  const radius = width * 0.3;

  const innerCircle = new InnerCircle(width,height,radius,context);
  const outerCircle = new OuterCircle(width,height,radius);

  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    context.fillStyle = 'white';
    context.strokeStyle = 'white';

    innerCircle.update();
    innerCircle.draw(context);
    outerCircle.update();
    outerCircle.draw(context);
  };
};

canvasSketch(sketch, settings);

class InnerSquare {
  constructor(width,height) {
    this.w = width*0.5;
    this.h = height;
    this.scaleX = random.range(0.1,2);
    this.scaleY = random.range(0.2,0.5);
    this.rectCoordY = random.range(0,-this.h*0.5);
    this.velocity = random.range(-1,1);
  }

  draw(context) {
    context.save();
    context.scale(this.scaleX,this.scaleY);

    context.beginPath();
    context.rect(-this.w,this.rectCoordY,this.w,this.h);
    context.fill();
    context.restore();
  }

  update() {
    this.rectCoordY += this.velocity;
  }

  bounce(height) {
    if (this.rectCoordY <= -height*1.5 || this.rectCoordY >= height) {
      this.velocity *= -1;
    }
  }
}

class InnerCircle {
  constructor(width,height,radius) {
    this.cx = width*0.5;
    this.cy = height*0.5;
    this.w = width*0.01;
    this.h = height*0.15;
    this.radius = radius;
    this.rotateAngle = math.degToRad(0.1);

    this.rects = [];
    for (let i = 0; i < num; i++) {
      let rect = new InnerSquare(this.w,this.h)
      this.rects.push(rect);
    }
  }

  draw(context) {
    context.save();
    for (let i = 0; i < num; i++) {
      const angle = slice * i;

      let x = this.cx + this.radius * Math.sin(angle);
      let y = this.cy + this.radius * Math.cos(angle);

      context.save();
      context.translate(x,y);
      context.rotate(-angle);
      this.rects[i].draw(context);
      context.restore();
    };
    
    context.restore();
  }

  update() {
    this.rects.forEach( rect => {
      rect.update();
      rect.bounce(200);
    });
  }
}

class OuterArc {
  constructor(radius) {
    this.radius = radius * random.range(0.7,1.3);
    this.startAngle = slice * random.range(1,-8);
    this.endAngle = slice * random.range(1,5);

    this.bounceAngle = random.range(1,360);
    
    this.velocity = random.range(-1,1);

    this.lineWidth = random.range(5,20);
  }

  draw(context) {
    context.save();
    context.lineWidth = this.lineWidth
    context.beginPath();
    context.arc(0,0,this.radius,this.startAngle,this.endAngle);
    context.stroke();
    context.restore();
  }

  update() {
    this.startAngle += math.degToRad(this.velocity);
    this.endAngle += math.degToRad(this.velocity);
  }

  bounce() {
    this.velocity *= -1;
  }
}

class OuterCircle {
  constructor(width,height,radius) {
    this.cx = width*0.5;
    this.cy = height*0.5;
    this.radius = radius;
    this.rotateAngle = math.degToRad(0.00001);

    this.arcs = [];
    for (let i = 0; i < num; i++) {
      let arc = new OuterArc(this.radius)
      this.arcs.push(arc);
    }
  }

  draw(context) {
    context.save();
    for (let i = 0; i < num; i++) {
      const angle = slice * i;

      context.save();
      context.translate(this.cx,this.cy);
      context.rotate(-angle);

      this.arcs[i].draw(context);
      context.restore();
    };
    context.restore();
  }

  update() {
    this.arcs.forEach( arc => {
      arc.update();
      const chance = random.range(0,500);
      if (chance <= 5) arc.bounce();
    });
  }
}
