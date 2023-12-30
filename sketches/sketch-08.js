const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const math = require('canvas-sketch-util/math');
const colormap = require('colormap');

const settings = {
  dimensions: [ 1080, 1080 ]
};

const sketch = ({ context, width, height }) => {
  const cols = 12;
  const rows = 48;
  const numCells = rows * cols;

  // grid
  const gw = width * 0.8;
  const gh = height * 0.8;
  // cell
  const cw = gw / cols;
  const ch = gh / rows;
  // margin
  const mx = (width - gw) / 2;
  const my = (height - gh) / 2;

  const points = [];

  let x, y, n, lineWidth, color;
  let freq = 0.002;
  let amp = 90;

  const colors = colormap({
    colormap: 'magma',
    nshades: amp,
  })

  for (let i = 0; i < numCells; i++) {
    x = (i % cols) * cw;
    y = Math.floor(i / cols) * ch;
    n = random.noise2D(x,y, freq, amp);
    x += n;
    y += n;
    lineWidth = math.mapRange(n, -amp, amp, 2, 20);
    color = colors[Math.floor(math.mapRange(n, -amp, amp, 0, amp))];
    points.push(new Point({x, y, lineWidth, color}));
  }


  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    context.save();
    context.translate(mx, my);
    context.translate(cw / 2, ch / 2);
    context.strokeStyle = 'red';
    context.lineWidth = 4;

    let lastX, lastY;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols-1; c++) {
        const curr = points[r * cols + c];
        const next = points[r * cols + c + 1];

        const mx = curr.x + (next.x - curr.x) / 2;
        const my = curr.y + (next.y - curr.y) / 2;

        if (!c) {
          lastX = curr.x;
          lastY = curr.y;
        }
        
        context.beginPath();
        // if (c == 0) context.moveTo(curr.x, curr.y);
        // else if (c == cols - 2) context.quadraticCurveTo(curr.x, curr.y, next.x, next.y);
        // else context.quadraticCurveTo(curr.x, curr.y, mx, my);
        context.lineWidth = curr.lineWidth;
        context.strokeStyle = curr.color;
        context.moveTo(lastX, lastY);
        context.quadraticCurveTo(curr.x, curr.y, mx, my);
        context.stroke();
        lastX = mx;
        lastY = my;
      }
    }

    points.forEach(point => {
      // point.draw(context);
    });
    context.restore();


  };
};

canvasSketch(sketch, settings);

class Point {
  constructor({x, y, lineWidth, color}) {
    this.x = x;
    this.y = y;
    this.lineWidth = lineWidth;
    this.color = color;
  }

  draw(context) {
    context.save();
    context.translate(this.x, this.y);
    context.fillStyle = 'red';
    context.beginPath();
    context.arc(0,0,10,0, Math.PI * 2);
    context.fill();
    context.restore();
  }
}