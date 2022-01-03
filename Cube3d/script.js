let cube = document.querySelector(".cube");

let pi = Math.PI;
let origin = [1, 0, 0, 0, 1, 0, 0, 0, 1];
cube.style.transform = array2DOMtransform(origin);

function rotate(origin, vector, angle) {
  let x = vector[0];
  let y = vector[1];
  let z = vector[2];
  let [xx, yy, zz, xy, xz, yz] = [x * x, y * y, z * z, x * y, x * z, y * z];

  let ca = Math.cos(angle);
  let ca1 = 1 - ca;
  let sa = Math.sin(angle);
  let sa1 = 1 - sa;

  let rotMatrix = [
    xx * ca1 + ca,
    xy * ca1 - z * sa,
    xz * ca1 + y * sa,
    xy * ca1 + z * sa,
    yy * ca1 + ca,
    yz * ca1 - x * sa,
    xz * ca1 - y * sa,
    yz * ca1 + x * sa,
    zz * ca1 + ca,
  ];

  let m11 = rotMatrix[0] * origin[0] + rotMatrix[1] * origin[3] + rotMatrix[2] * origin[6];
  let m12 = rotMatrix[0] * origin[1] + rotMatrix[1] * origin[4] + rotMatrix[2] * origin[7];
  let m13 = rotMatrix[0] * origin[2] + rotMatrix[1] * origin[5] + rotMatrix[2] * origin[8];
  let m21 = rotMatrix[3] * origin[0] + rotMatrix[4] * origin[3] + rotMatrix[5] * origin[6];
  let m22 = rotMatrix[3] * origin[1] + rotMatrix[4] * origin[4] + rotMatrix[5] * origin[7];
  let m23 = rotMatrix[3] * origin[2] + rotMatrix[4] * origin[5] + rotMatrix[5] * origin[8];
  let m31 = rotMatrix[6] * origin[0] + rotMatrix[7] * origin[3] + rotMatrix[8] * origin[6];
  let m32 = rotMatrix[6] * origin[1] + rotMatrix[7] * origin[4] + rotMatrix[8] * origin[7];
  let m33 = rotMatrix[6] * origin[2] + rotMatrix[7] * origin[5] + rotMatrix[8] * origin[8];

  return [m11, m12, m13, m21, m22, m23, m31, m32, m33];
}

function array2DOMtransform(array) {
  return `matrix3d(${array[0]}, ${array[3]}, ${array[6]}, 0, ${array[1]}, ${array[4]}, ${array[7]}, 0, ${array[2]}, ${array[5]}, ${array[8]}, 0, 0, 0, 0, 1)`;
}

function turn(origin, direction) {
  switch (direction) {
    case 'up':
      return rotate(origin, [1, 0, 0], pi/2);
    case 'down':
      return rotate(origin, [1, 0, 0], -pi/2);
    case 'left':
      return rotate(origin, [0, 1, 0], -pi/2);
    case 'right':
      return rotate(origin, [0, 1, 0], pi/2);
    default:
      return origin;
  }
}

document.addEventListener('keydown', function(e) {
  switch (e.key) {
    case 'ArrowUp':
      origin = turn(origin, 'up');
      break;
    case 'ArrowDown':
      origin = turn(origin, 'down');
      break;
    case 'ArrowLeft':
      origin = turn(origin, 'left');
    break;
    case 'ArrowRight':
      origin = turn(origin, 'right');
      break;
    default:
      break;
  }
  cube.style.transform = array2DOMtransform(origin);
});


let turned = false;
document.addEventListener('mousedown', handleMouseDown);
document.addEventListener('mouseup', handleMouseUp);
document.addEventListener('touchstart', handleTouchStart);
document.addEventListener('touchend', handleTouchEnd);

function handleMouseDown(e) {
  document.addEventListener('mousemove', handleMouseMove);
}

function handleMouseUp(e) {
  document.removeEventListener('mousemove', handleMouseMove);
  turned = false;
}

function handleMouseMove(e) {
  if (!turned) {
    let mx = e.movementX;
    let my = e.movementY;
    let newOrigin = turn(origin, checkDirection(mx, my, 2));
    if (origin !== newOrigin) {
      origin = newOrigin;
      cube.style.transform = array2DOMtransform(origin);
      turned = true;
    }
  }
}

function checkDirection(x, y, sensitivity) {
  let xabs = Math.abs(x);
  let yabs = Math.abs(y);
  if (xabs >= yabs) {
    if (xabs >= sensitivity) {
      return x > 0 ? 'right' : 'left';
    }
  } else if (yabs >= sensitivity) {
    return y > 0 ? 'down' : 'up';
  }
  return null;
}

let touch = {
  x: 0,
  y: 0
}

function handleTouchStart(e) {
  touch.x = e.touches[0].clientX;
  touch.y = e.touches[0].clientY;
  document.addEventListener('touchmove', handleTouchMove);
}

function handleTouchEnd(e) {
  document.removeEventListener('touchmove', handleTouchMove);
  turned = false;
  [touch.x, touch.y] = [0, 0];
}

function handleTouchMove(e) {
  let movementX = e.touches[0].clientX - touch.x;
  let movementY = e.touches[0].clientY - touch.y;
  if (!turned) {
    let newOrigin = turn(origin, checkDirection(movementX, movementY, 10));
    if (origin !== newOrigin) {
      origin = newOrigin;
      cube.style.transform = array2DOMtransform(origin);
      turned = true;
    }
  }
}