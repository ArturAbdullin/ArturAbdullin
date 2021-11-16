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
  let offsets = {
    xLeftClose: -5,
    xLeft: -10,
    xRightClose: 5,
    xRight: 10,
    y: 20,
  };
  while (nodesQueue && array[index] !== undefined) {
    let currentNode = nodesQueue.shift();
    currentNode.addChild(
      array[index] !== null ? new BinaryTreeNodeVisual(array[index]) : null,
      "left"
    );
    if (++index < array.length) {
      currentNode.addChild(
        array[index] !== null ? new BinaryTreeNodeVisual(array[index]) : null,
        "right"
      );
      index++;
    }

    // set initial coordinates
    if (currentNode.left && currentNode.right) {
      currentNode.left.updateCoordinates({
        x: offsets.xLeft,
        y: offsets.y,
      });
      currentNode.right.updateCoordinates({
        x: offsets.xRight,
        y: offsets.y,
      });
      nodesQueue.push(currentNode.left);
      nodesQueue.push(currentNode.right);
    } else if (currentNode.left) {
      currentNode.left.updateCoordinates({
        x: offsets.xLeftClose,
        y: offsets.y,
      });
      nodesQueue.push(currentNode.left);
    } else if (currentNode.right) {
      currentNode.right.updateCoordinates({
        x: offsets.xRightClose,
        y: offsets.y,
      });
      nodesQueue.push(currentNode.right);
    }
  }

  Tree.updateCoordinates({
    x: 0,
    y: 0,
  });
  // stage 2: fix coordinates
  function fixCoordinates(Tree, minXDistance, minYDistance) {
    let nodesQueue = [Tree];
    let currentLevel = 2;
    let sameLevelNodes = [[]];

    // stage 1: Tree to 2D array; levels of Tree nodes
    while (nodesQueue.length) {
      let currentNode = nodesQueue.shift();
      if (currentNode.level === currentLevel) {
        sameLevelNodes[currentLevel - 2].push(currentNode);
      } else if (currentNode.level > currentLevel) {
        sameLevelNodes.push([]);
        sameLevelNodes[++currentLevel - 2].push(currentNode);
      }
      currentNode.left && nodesQueue.push(currentNode.left);
      currentNode.right && nodesQueue.push(currentNode.right);
    }

    // stage 2: fix coordinates level by level
    for (const level of sameLevelNodes) {
      if (level.length < 2) {
        continue;
      }

      let nodesToFix = [];

      // fix coordinates on the level starting with nodes with the closest common parent node
      for (let treeNode = 1; treeNode < level.length; treeNode++) {
        let commonParentNode;
        if (level[treeNode - 1].parent !== level[treeNode].parent) {
          commonParentNode = findCommonParentNode(
            level[treeNode - 1],
            level[treeNode]
          );
          nodesToFix.push({
            nodes: [level[treeNode - 1], level[treeNode]],
            commonParentNode: commonParentNode,
            commonParentLevel: commonParentNode.level,
          });
        }
      }
      nodesToFix.sort((a, b) => {
        return b.commonParentLevel - a.commonParentLevel;
      });
      console.log(nodesToFix);
      
      for (let i = 0; i < nodesToFix.length; i++) {
        let distance = nodesToFix[i].nodes[1].coordinates.x - nodesToFix[i].nodes[0].coordinates.x;
        console.log(distance);
        if (distance < minXDistance) {
          let newOffset = (minXDistance - distance) / 2;
          console.log('new offset ', newOffset);
          console.log(nodesToFix[i].commonParentNode.left.coordinates.x);
          nodesToFix[i].commonParentNode.left.updateCoordinates({
            x: nodesToFix[i].commonParentNode.left.offset.x - newOffset,
            y: minYDistance
          });
          nodesToFix[i].commonParentNode.right.updateCoordinates({
            x: nodesToFix[i].commonParentNode.right.offset.x + newOffset,
            y: minYDistance
          });
          console.log([showCoordinates(Tree)]);
        }
      }
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

  console.log(showCoordinates(Tree));
  console.log("---------------");
  fixCoordinates(Tree, 40, offsets.y);
  fixCoordinates(Tree, 40, offsets.y);
  return Tree;
}

let a = [0, -10, 10, null, -5, 0, 20, -15, 5, -10, 10, 15, null, -25, -5, 0, null, null, 0, 15, 15, 10];

let tree2 = assembleBinaryTree(a);

function showCoordinates(BinaryTree) {
  let queue = [BinaryTree];
  let xcoords = [];
  let ycoords = [];
  while (queue.length) {
    let currentNode = queue.shift();
    console.log(currentNode.coordinates);
    xcoords.push(currentNode.coordinates.x);
    ycoords.push(currentNode.coordinates.y);
    currentNode.left && queue.push(currentNode.left);
    currentNode.right && queue.push(currentNode.right);
  }
  return {x: xcoords, y: ycoords};
}

let plot = showCoordinates(tree2);