
function BinaryTreeNode(val = 0, left = null, right = null) {
  this.val = val;
  this.left = left;
  this.right = right;
}

let a = [120, -10, 10, -15, null, 0, 20];
// let a = [1,2,3];

function ArrayToTree(array) {
  const Tree = new BinaryTreeNode(array[0]);
  const currentLevel = [];
  if (Tree.val !== null) {
    currentLevel.push(Tree);
  } else {
    return null;
  }

  let valIndex = 1;
  while (currentLevel && array[valIndex] !== undefined) {
    let currentNode = currentLevel.shift();
    currentNode.left =
      array[valIndex] !== null ? new BinaryTreeNode(array[valIndex]) : null;
    valIndex++;
    currentNode.left && currentLevel.push(currentNode.left);
    currentNode.right =
      array[valIndex] !== null ? new BinaryTreeNode(array[valIndex]) : null;
    valIndex++;
    currentNode.right && currentLevel.push(currentNode.right);
  }
  return Tree;
}

const Tree = ArrayToTree(a);

function VisualizeTree(Tree) {
  const TreeNodeVisual = new BinaryTreeNode(Tree.val, Tree.left, Tree.right);
  TreeNodeVisual.level = 0;
  TreeNodeVisual.coordinates = { x: 0, y: 0 };
  let queue = [TreeNodeVisual];
  while (queue.length) {
    // console.log('---queue 1---', queue);
    let currentNode = queue.shift();
    if (currentNode.left !== null) {
      currentNode.left.parent = currentNode;
      currentNode.left.lane = "left";
      currentNode.left.level = currentNode.level + 1;
      queue.push(currentNode.left);
    }
    // console.log('---queue 2---', queue);
    if (currentNode.right !== null) {
      currentNode.right.parent = currentNode;
      currentNode.right.lane = "right";
      currentNode.right.level = currentNode.level + 1;
      queue.push(currentNode.right);
    }
  }
  function findCommonParentNode(TreeNode1, TreeNode2) {
    let parent1 = TreeNode1.parent;
    let parent2 = TreeNode2.parent;
    while (parent1 !== parent2) {
      parent1 = parent1.parent;
      parent2 = parent2.parent;
    }
    return parent1;
  }
  return TreeNodeVisual;
}

function findCommonParentNode(TreeNode1, TreeNode2) {
  let parent1 = TreeNode1.parent;
  let parent2 = TreeNode2.parent;
  while (parent1 !== parent2) {
    parent1 = parent1.parent;
    parent2 = parent2.parent;
  }
  return parent1.val;
}

let tree2 = VisualizeTree(Tree);
// console.log(tree2);

// let parentNodeVal = findCommonParentNode(tree2.left.left, tree2.right.right);
// console.log(parentNodeVal);

class BinaryTreeNodeVisual {
  constructor(val, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
    this.coordinates = { x: 0, y: 0 };
    this.offset = { x: 0, y: 0 };
    this.parent = undefined;
    this.lane = undefined;
    if (this.parent !== undefined) {
      this.level = this.parent.level + 1;
    } else {
      this.level = 0;
    }
    if (this.left) {
      this.left.parent = this;
      this.left.lane = "left";
    }
    if (this.right) {
      this.right.parent = this;
      this.right.lane = "right";
    }
  }

  isRootNode() {
    return this.lane === undefined ? true : false;
  }

  addChild(BinaryTreeNode, lane) {
    if (lane === "left") {
      if (BinaryTreeNode !== null && BinaryTreeNode !== undefined) {
        this.left = BinaryTreeNode;
        this.left.lane = "left";
        this.left.level = this.level + 1;
        this.left.parent = this;
      } else {
        this.left = null;
      }
    } else if (lane === "right") {
      if (BinaryTreeNode !== null && BinaryTreeNode !== undefined) {
        this.right = BinaryTreeNode;
        this.right.lane = "right";
        this.right.level = this.level + 1;
        this.right.parent = this;
      } else {
        this.right = null;
      }
    } else {
      console.log(
        'Error: lane argument can have only "left" or "right" values'
      );
    }
  }

  /**
  * @param {{x: number, y: number}} coordinates 
  */
  updateCoordinates(coordinates) {
    if (this.parent) {
      this.offset = coordinates != undefined ? coordinates : this.offset;
      [this.coordinates.x, this.coordinates.y] = [
        this.parent.coordinates.x + this.offset.x,
        this.parent.coordinates.y + this.offset.y,
      ];
    } else {
      this.coordinates =
        coordinates != undefined ? coordinates : this.coordinates;
    }
    if (this.left) {
      this.left.updateCoordinates();
    }
    if (this.right) {
      this.right.updateCoordinates();
    }
  }
}

function assembleBinaryTree(array) {
  let index = 0;
  const Tree = new BinaryTreeNodeVisual(array[index++]);
  const nodesQueue = [];
  if (Tree.val !== null) {
    nodesQueue.push(Tree);
  } else {
    return null;
  }

  // stage 1: convert array to tree; set initial coordinates
  let offsets = {xLeftClose: -5, xLeft: -10, xRightClose: 5, xRight: 10, y: 20};
  while (nodesQueue && array[index] !== undefined) {
    let currentNode = nodesQueue.shift();
    currentNode.addChild(
      array[index] !== null
        ? new BinaryTreeNodeVisual(array[index])
        : null,
      "left"
    );
    if (++index < array.length) {
      currentNode.addChild(
        array[index] !== null
          ? new BinaryTreeNodeVisual(array[index])
          : null,
        "right"
      );
      index++;
    }

    // set initial coordinates
    if (currentNode.left && currentNode.right) {
      currentNode.left.updateCoordinates({
        x: offsets.xLeft,
        y: offsets.y
      });
      currentNode.right.updateCoordinates({
        x: offsets.xRight,
        y: offsets.y
      });
      nodesQueue.push(currentNode.left);
      nodesQueue.push(currentNode.right);
    } else if (currentNode.left) {
      currentNode.left.updateCoordinates({
        x: offsets.xLeftClose,
        y: offsets.y
      });
      nodesQueue.push(currentNode.left);
    } else if (currentNode.right) {
      currentNode.right.updateCoordinates({
        x: offsets.xRightClose,
        y: offsets.y
      });
      nodesQueue.push(currentNode.right);
    }
  }

  
  function fixCoordinates(Tree, minDistance) {
    let nodesQueue = [Tree];
    
    let previousNode = Tree;
    let currentNode = null;

    while (nodesQueue.length) {
      currentNode = nodesQueue.shift();
      // console.log('previous node', previousNode.val);
      // console.log('current node ', currentNode.val);
      if (currentNode.level === previousNode.level &&
        currentNode.parent !== previousNode.parent){
          let distance = currentNode.coordinates.x - previousNode.coordinates.x;
          if (distance < minDistance) {
            let newOffset = (minDistance - distance) / 2;
            // console.log('new offset ', newOffset);
            let commonParentNode = findCommonParentNode(previousNode, currentNode);
            // console.log(commonParentNode.left.coordinates);
            commonParentNode.left.updateCoordinates(
              {
                x: commonParentNode.left.coordinates.x - newOffset,
                y: commonParentNode.left.coordinates.y
              }
            );
            // console.log(commonParentNode.left.coordinates);
            // console.log('---')
            // console.log(commonParentNode.right.coordinates);
            commonParentNode.right.updateCoordinates(
              {
                x: commonParentNode.right.coordinates.x + newOffset,
                y: commonParentNode.right.coordinates.y
              }
            );
            // console.log(commonParentNode.right.coordinates);
            // console.log('---')
            // showCoordinates(Tree);
          }
      }
      currentNode.left && nodesQueue.push(currentNode.left);
      currentNode.right && nodesQueue.push(currentNode.right);
      previousNode = currentNode;
    }
  }

  function findCommonParentNode(TreeNode1, TreeNode2) {
    let parent1 = TreeNode1.parent;
    let parent2 = TreeNode2.parent;
    while (parent1 !== parent2) {
      parent1 = parent1.parent;
      parent2 = parent2.parent;
    }
    return parent1;
  }

  // showCoordinates(Tree);
  // console.log('---------------')
  fixCoordinates(Tree, 40);

  return Tree;
}

// let tree3 = assembleBinaryTree([1, 2, 3, 4, null, null, 5, 6, 7]);
let tree3 = assembleBinaryTree([0, -10, 10, null, -5, 0, 20, -15, 5, -10, 10, 15, null, -25, -5, 0, null, -20, 0, null, 15, 10]);

// console.log(tree3);

function showCoordinates(BinaryTree) {
  let queue = [BinaryTree];
  while (queue.length) {
    let currentNode = queue.shift();
    console.log(currentNode.coordinates);
    currentNode.left && queue.push(currentNode.left);
    currentNode.right && queue.push(currentNode.right);
  }
}

showCoordinates(tree3);