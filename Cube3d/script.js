let cube = document.querySelector(".cube");
let cubeStyle = getComputedStyle(cube);

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
      break;
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


let mousePositionContainer = document.querySelector('.mouse-position-container');
let moved = false;
document.addEventListener('mousedown', handleMouseDown);
document.addEventListener('mouseup', handleMouseUp);

function handleMouseDown(e) {
  document.addEventListener('mousemove', handleMouseMove);
}

function handleMouseUp(e) {
  document.removeEventListener('mousemove', handleMouseMove);
  moved = false;
}

function handleMouseMove(e) {
  mousePositionContainer.innerHTML = `mouse position: ${e.movementX}; ${e.movementY}`; 
  if (!moved) {
    moved = true;
    let mx = e.movementX;
    let my = e.movementY;
    let mxabs = Math.abs(mx);
    let myabs = Math.abs(my);
    if (mxabs >= myabs) {
      if (mxabs >= 2) {
        origin = mx > 0 ? turn(origin, 'right') : turn(origin, 'left');
        cube.style.transform = array2DOMtransform(origin);
      }
    } else if (myabs >= 2) {
      origin = my > 0 ? turn(origin, 'down') : turn(origin, 'up');
        cube.style.transform = array2DOMtransform(origin);
    }
  }
  
}

// function triggerMouseEvent (node) {
//   let evt = new MouseEvent('mousedown');
//   node.dispatchEvent(evt);
// }

// triggerMouseEvent(document);