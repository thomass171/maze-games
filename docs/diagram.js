/**
 * From https://gist.github.com/jonatsp
 */

/**
 * Needs a canvas 'canvas'
 */
async function startDiagramDemo() {

    //generate random data
    var data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    while(true) {

      data.push(Math.floor(Math.random() * 100) + 1);
      if (data.length > 100) {
          data.shift();
      }
      drawDiagram(data, "canvas");
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
}

function drawDiagram(data, canvasId) {

    var canvas = document.getElementById(canvasId);
    var context = canvas.getContext("2d");

    //clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.moveTo(0, 0);

    var rightMarginSizeForMarker = 30;

    // draw the graph line
    context.beginPath();
    context.lineWidth = 1;
    context.strokeStyle = "#00ff00";
    context.moveTo(0, canvas.height - ((canvas.height * data[0]) / 100));

    //
    var xstep = (canvas.width - rightMarginSizeForMarker) / (data.length-1);
    for(i = 1; i < data.length; i++) {
        context.lineTo(i * xstep, canvas.height - ((canvas.height * data[i]) / 100));
    }
    context.stroke();

    // fill by using the path began above
    context.fillStyle = "rgba(0, 255, 0, 0.2)";
    context.lineTo(canvas.width - rightMarginSizeForMarker - 1, canvas.height);
    context.lineTo(1, canvas.height);
    context.closePath();
    context.fill();

    //outline frame
    context.strokeRect(0, 0, canvas.width - 30, canvas.height);

    //markers
    context.beginPath();
    context.strokeStyle = "lightgray"
    context.lineWidth = 0.2;
    var horizontalLine = canvas.height / 10;
    for (let index = 1; index < 10; index++) {
      context.moveTo(0, horizontalLine * index);
      context.lineTo(canvas.width - 30, (horizontalLine * index) + 0.2);
      context.strokeText(100 - (index * 10) + "%", canvas.width - 27, (horizontalLine * index) - 0.8)
      context.moveTo(0, 0);

    }
    context.strokeText("0%", canvas.width - 27, canvas.height - 0.8);
    context.strokeText("100%", canvas.width - 27, 7.2);
    context.stroke();
}


