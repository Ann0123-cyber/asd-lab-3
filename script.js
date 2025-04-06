const canvasNeNapr = document.getElementById("neNapr");
const canvasNapr = document.getElementById("napr");

const contextNeNapr = canvasNeNapr.getContext("2d");
const contextNapr = canvasNapr.getContext("2d");

const qntnNodes = 12;
const coef = 1 - 2 * 0.01 - 1 * 0.005 - 0.25;
const radius = 17;

const nodePositions = [
  { x: 100, y: 300 }, // 1
  { x: 135, y: 200 }, // 2
  { x: 200, y: 135 }, // 3
  { x: 300, y: 100 }, // 4
  { x: 400, y: 135 }, // 5
  { x: 465, y: 200 }, // 6
  { x: 500, y: 300 }, // 7
  { x: 465, y: 400 }, // 8
  { x: 400, y: 465 }, // 9
  { x: 300, y: 500 }, // 10
  { x: 200, y: 465 }, // 11
  { x: 135, y: 400 }  // 12
];

function generateAdjacencyMatrixSymmetrical() {
  const seed = 4321;
  let matrix = [];
  Math.seedrandom(seed);
  for (let i = 0; i < qntnNodes; i++) {
    matrix[i] = [];
    for (let j = 0; j < qntnNodes; j++) {
      matrix[i][j] = Math.random() * 2 * coef;
      matrix[i][j] = matrix[i][j] < 1 ? 0 : 1;
    }
  }
  for (let i = 0; i < qntnNodes; i++) {
    for (let j = 0; j < qntnNodes; j++) {
      if (matrix[i][j] === 1 && matrix[i][j] !== matrix[j][i]) {
        matrix[j][i] = 1;
      }
    }
  }
  return matrix;
}

function generateAdjacencyMatrixNotSymmetrical() {
  const seed = 4321;
  let matrix = [];
  Math.seedrandom(seed);
  for (let i = 0; i < qntnNodes; i++) {
    matrix[i] = [];
    for (let j = 0; j < qntnNodes; j++) {
      matrix[i][j] = Math.random() * 2 * coef;
      matrix[i][j] = matrix[i][j] < 1 ? 0 : 1;
    }
  }
  return matrix;
}

function drawNodes(context) {
  nodePositions.forEach((position, index) => {
    context.fillStyle = "#a20e7d";
    context.beginPath();
    context.arc(position.x, position.y, radius, 0, Math.PI * 2, true);
    context.fill();
    context.stroke();
    context.font = "20px Times New Roman";
    context.fillStyle = "white";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(`${index + 1}`, position.x, position.y);
  });
}

const drawArrow = (x, y, context, angle) => {
  const arrowSize = 4;
  context.save();
  context.translate(x, y);
  context.rotate(angle);
  context.moveTo(0, 0);
  context.lineTo(arrowSize, -arrowSize);
  context.lineTo(0, 0);
  context.lineTo(arrowSize, arrowSize);
  context.closePath();
  context.restore();
};

function drawEdges(matrix, context) {
  context.strokeStyle = "black";
  context.lineWidth = 1;
  const offset = 20;

  for (let i = 0; i < qntnNodes; i++) {
    for (let j = 0; j < qntnNodes; j++) {
      if (matrix[i][j] === 1) {
        const startX = nodePositions[i].x;
        const startY = nodePositions[i].y;
        const endX = nodePositions[j].x;
        const endY = nodePositions[j].y;

        context.beginPath();
        context.moveTo(startX, startY);

        let midX, midY;

        if (matrix[j][i] === 1 && i !== j && context === contextNapr) {
          midX = (startX + endX) / 2 + (startY - endY) / offset;
          midY = (startY + endY) / 2 + (endX - startX) / offset;
          context.lineTo(midX, midY);
        }
        context.lineTo(endX, endY);
        context.stroke();

        if (context === contextNapr) {
          if (matrix[j][i] === 1 && i !== j) {
            const midAngle = Math.atan2(midY - endY, midX - endX);
            const indentMidX = radius * Math.cos(midAngle);
            const indentMidY = radius * Math.sin(midAngle);
            drawArrow(endX + indentMidX, endY + indentMidY, context, midAngle);
          } else {
            const angle = Math.atan2(startY - endY, startX - endX);
            const indentX = radius * Math.cos(angle);
            const indentY = radius * Math.sin(angle);
            drawArrow(endX + indentX, endY + indentY, context, angle);
          }
        }

        if (i === j) {
          context.beginPath();
          if (i < qntnNodes/2) {
            context.arc(
              endX,
              endY - radius * 2,
              radius,
              -Math.PI / 2,
              (3 * Math.PI) / 2,
              true
            );
            if (context === contextNapr) {
              drawArrow(
                nodePositions[i].x + 5,
                nodePositions[i].y - 15,
                context,
                -Math.PI / 4
              );
            }

            context.stroke();
          } else {
            context.arc(
              endX,
              endY + radius * 2,
              radius,
              Math.PI / 2,
              (-3 * Math.PI) / 2,
              true
            );
            if (context === contextNapr) {
              drawArrow(
                nodePositions[i].x + 5,
                nodePositions[i].y + 15,
                context,
                Math.PI / 4
              );
            }
            context.stroke();
          }
        }
        context.stroke();
      }
    }
  }
}

const matrixSymmetrical = generateAdjacencyMatrixSymmetrical();
console.log(matrixSymmetrical);

const matrixNotSymmetrical = generateAdjacencyMatrixNotSymmetrical();
console.log(matrixNotSymmetrical);

drawEdges(matrixNotSymmetrical, contextNapr);
drawEdges(matrixSymmetrical, contextNeNapr);

drawNodes(contextNeNapr);
drawNodes(contextNapr);
