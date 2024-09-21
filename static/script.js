var canvas = document.getElementById("imageCanvas");
var ctx = canvas.getContext("2d");
var imageLoader = document.getElementById("imageLoader");
var image = document.getElementById("image");
var cropper = null;
var enableCropButton = document.getElementById("enableCropButton");
var cropButton = document.getElementById("cropButton");
var resizeButton = document.getElementById("resizeButton");
var rotate90Button = document.getElementById("rotate90Button");
var rotate180Button = document.getElementById("rotate180Button");
var rotate270Button = document.getElementById("rotate270Button");
var textInput = document.getElementById("textInput");
var addTextButton = document.getElementById("addTextButton");
var isDragging = false;
var textX = 50; // Initial x position for text
var textY = 50; // Initial y position for text
var addedText = "";
var mouseX = 0;
var mouseY = 0;
var uploadedImage = null;
var resetButton = document.getElementById("resetButton");
var downloadButton = document.getElementById("downloadButton");
var downloadLink = document.getElementById("downloadLink");

let textLayers = [];
let selectedLayer = null;

let selectedFont = "Arial";
let selectedFontSize = "30px";
let selectedColor = "#ffffff";

let shapes = [];
let currentShape = null;
let drawingShape = false; // Check if the user is drawing
let selectedShapeType = "";
let currentFilter = "none";

let history = [];
let redoStack = [];
const maxHistory = 20; // Limit history size

let selectedShape = null; // To track the currently selected shape

// Functions for Undo/Redo

function saveState() {
  const currentState = {
    shapes: JSON.parse(JSON.stringify(shapes)),
    textLayers: JSON.parse(JSON.stringify(textLayers)),
  };

  history.push(currentState);

  if (history.length > maxHistory) {
    history.shift(); // Remove the oldest state
  }

  // Clear the redo stack
  redoStack = [];
}

function restoreState(state) {
  shapes = JSON.parse(JSON.stringify(state.shapes));
  textLayers = JSON.parse(JSON.stringify(state.textLayers));

  // Redraw the canvas with the restored shapes and text
  drawCanvasWithTextAndShapes();
}

// Functions for Drawing

function drawCanvasWithTextAndShapes(currentShape = null) {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.filter = currentFilter;

  // Redraw the uploaded image with the filter
  if (uploadedImage) {
    ctx.drawImage(uploadedImage, 0, 0, canvas.width, canvas.height);
  }

  // Reset filter for other elements like shapes and text
  ctx.filter = "none";

  // Draw all shapes
  shapes.forEach((shape) => {
    drawShape(shape);
  });

  // Draw the current shape being drawn, if any
  if (currentShape) {
    drawShape(currentShape);
  }

  // Redraw the text layers
  textLayers.forEach((layer) => {
    ctx.font = layer.font;
    ctx.fillStyle = layer.color; // Apply the color for text
    ctx.fillText(layer.text, layer.x, layer.y); // Draw the text
  });
}

function drawShape(shape) {
  ctx.strokeStyle = shape.color;
  switch (shape.type) {
    case "rectangle":
      ctx.beginPath();
      ctx.rect(
        shape.startX,
        shape.startY,
        shape.endX - shape.startX,
        shape.endY - shape.startY
      );
      ctx.stroke();
      break;
    case "circle":
      const radius = Math.sqrt(
        Math.pow(shape.endX - shape.startX, 2) +
          Math.pow(shape.endY - shape.startY, 2)
      );
      ctx.beginPath();
      ctx.arc(shape.startX, shape.startY, radius, 0, 2 * Math.PI);
      ctx.stroke();
      break;
    case "line":
      ctx.beginPath();
      ctx.moveTo(shape.startX, shape.startY);
      ctx.lineTo(shape.endX, shape.endY);
      ctx.stroke();
      break;
  }
}

function applyFilter() {
  ctx.filter = currentFilter;

  drawCanvasWithTextAndShapes();

  // Reset the filter
  ctx.filter = "none";
}

// Functions for Text Handling

function drawCanvasWithText() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Redraw the uploaded image
  if (uploadedImage) {
    ctx.drawImage(uploadedImage, 0, 0, canvas.width, canvas.height);
  }

  // Loop through all text layers and draw each one
  textLayers.forEach((layer) => {
    ctx.font = layer.font;
    ctx.fillStyle = layer.color;
    ctx.fillText(layer.text, layer.x, layer.y);
  });
}

function deleteSelectedTextLayer() {
  if (selectedLayer !== null) {
    // Remove the selected text layer from the array
    textLayers.splice(selectedLayer, 1);

    // Reset the selectedLayer variable
    selectedLayer = null;

    // Redraw the canvas
    drawCanvasWithTextAndShapes();
  } else {
    alert("No text layer selected to delete.");
  }
}

function deleteSelectedShape() {
  if (selectedShape !== null) {
    // Remove the selected shape from the array
    shapes.splice(selectedShape, 1);

    // Reset the selectedShape variable
    selectedShape = null;

    // Redraw the canvas to reflect the deletion
    drawCanvasWithTextAndShapes();
  } else {
    alert("No shape selected to delete.");
  }
}

function rotateImage(degrees) {
  var img = new Image();
  img.src = canvas.toDataURL();
  img.onload = function () {
    var width = img.width;
    var height = img.height;

    if (degrees === 90 || degrees === 270) {
      canvas.width = height;
      canvas.height = width;
    } else {
      canvas.width = width;
      canvas.height = height;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Move to the center of the canvas, rotate, then move back
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((degrees * Math.PI) / 180);
    ctx.drawImage(img, -img.width / 2, -img.height / 2);
    ctx.rotate((-degrees * Math.PI) / 180);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);
  };
}

document.getElementById("undoButton").addEventListener("click", function () {
  if (history.length > 1) {
    const lastState = history.pop();
    redoStack.push(lastState);
    const previousState = history[history.length - 1];
    restoreState(previousState);
  }
});

// Redo
document.getElementById("redoButton").addEventListener("click", function () {
  if (redoStack.length > 0) {
    const redoState = redoStack.pop();
    history.push(redoState);
    restoreState(redoState);
  }
});

// Grayscale Filter
document
  .getElementById("grayscaleButton")
  .addEventListener("click", function () {
    currentFilter = "grayscale(100%)";
    applyFilter();
  });

// Sepia Filter
document.getElementById("sepiaButton").addEventListener("click", function () {
  currentFilter = "sepia(100%)";
  applyFilter();
});

// Invert Filter
document.getElementById("invertButton").addEventListener("click", function () {
  currentFilter = "invert(100%)";
  applyFilter();
});

// Reset Filter
document
  .getElementById("resetFilterButton")
  .addEventListener("click", function () {
    currentFilter = "none";
    applyFilter();
  });

document
  .getElementById("drawRectangleButton")
  .addEventListener("click", function () {
    selectedShapeType = "rectangle";
  });

document
  .getElementById("drawCircleButton")
  .addEventListener("click", function () {
    selectedShapeType = "circle";
  });

document
  .getElementById("drawLineButton")
  .addEventListener("click", function () {
    selectedShapeType = "line";
  });

// Canvas Event Listeners

canvas.addEventListener("mousedown", function (event) {
  mouseX = event.offsetX;
  mouseY = event.offsetY;

  if (selectedShapeType) {
    drawingShape = true;
    const startX = mouseX;
    const startY = mouseY;

    // Initialize a new shape with the starting point
    currentShape = {
      type: selectedShapeType,
      startX,
      startY,
      endX: startX,
      endY: startY,
      color: selectedColor,
    };
  } else {
    // Loop through layers to check if the mouse is down on any text layer
    selectedLayer = textLayers.findIndex((layer) => {
      ctx.font = layer.font; // Apply the font to get correct text measurement
      const textWidth = ctx.measureText(layer.text).width;
      const textHeight = parseInt(layer.font, 10); // Get text height from the font size

      return (
        mouseX >= layer.x &&
        mouseX <= layer.x + textWidth &&
        mouseY >= layer.y - textHeight &&
        mouseY <= layer.y
      );
    });

    if (selectedLayer !== -1) {
      isDragging = true;
    }
  }
});

canvas.addEventListener("mousemove", function (event) {
  if (drawingShape && currentShape) {
    const endX = event.offsetX;
    const endY = event.offsetY;

    // Update the current shape's end points as the mouse moves
    currentShape.endX = endX;
    currentShape.endY = endY;

    // Redraw the canvas with all shapes and text layers, including the current shape being drawn
    drawCanvasWithTextAndShapes(currentShape);
  } else if (isDragging && selectedLayer !== null) {
    textLayers[selectedLayer].x = event.offsetX;
    textLayers[selectedLayer].y = event.offsetY;
    drawCanvasWithTextAndShapes(); // Redraw the canvas with updated text position
  }
});

canvas.addEventListener("mouseup", function () {
  if (drawingShape && currentShape) {
    // Finalize the shape and add it to the shapes array
    shapes.push(currentShape);
    drawingShape = false;
    currentShape = null;

    saveState();

    // Redraw the canvas to include the finalized shape
    drawCanvasWithTextAndShapes();

    selectedShapeType = null;
  } else if (isDragging) {
    isDragging = false;
  }
});

document.getElementById("fontFamily").addEventListener("change", function () {
  selectedFont = this.value;
});

document.getElementById("fontSize").addEventListener("change", function () {
  selectedFontSize = this.value + "px";
});

document.getElementById("textColor").addEventListener("input", function () {
  selectedColor = this.value;
});

addTextButton.addEventListener("click", function () {
  const newTextLayer = {
    text: textInput.value || "New Text",
    x: 50,
    y: 50,
    font: `${selectedFontSize} ${selectedFont}`,
    color: selectedColor,
  };
  textLayers.push(newTextLayer);
  selectedLayer = textLayers.length - 1;

  saveState();

  drawCanvasWithTextAndShapes();
});

imageLoader.addEventListener("change", function (e) {
  var reader = new FileReader();
  reader.onload = function (event) {
    uploadedImage = new Image();
    uploadedImage.src = event.target.result;

    // set the src of the 'image' element for Cropper.js
    image.src = event.target.result;

    uploadedImage.onload = function () {
      canvas.width = uploadedImage.width;
      canvas.height = uploadedImage.height;

      // Clear the canvas and draw the uploaded image
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(
        uploadedImage,
        0,
        0,
        uploadedImage.width,
        uploadedImage.height
      );

      // Ensure the cropper is not initialized after image upload
      if (cropper) {
        cropper.destroy(); // Destroy any previous cropper instance
        cropper = null; // Set cropper to null
      }
    };
  };
  reader.readAsDataURL(e.target.files[0]);
});

downloadButton.addEventListener("click", function () {
  var imageData = canvas.toDataURL("image/png");

  downloadLink.href = imageData;
});

resetButton.addEventListener("click", function () {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  uploadedImage = null;
  addedText = "";
  textX = 50;
  textY = 50;

  imageLoader.value = "";

  shapes = [];
  textLayers = [];
  selectedLayer = null;
  selectedShape = null;
  selectedShapeType = "";
  currentFilter = "none";

  alert("Canvas has been reset.");
});

rotate90Button.addEventListener("click", function () {
  rotateImage(90);
});

rotate180Button.addEventListener("click", function () {
  rotateImage(180);
});

rotate270Button.addEventListener("click", function () {
  rotateImage(270);
});

resizeButton.addEventListener("click", function () {
  var width = document.getElementById("resizeWidth").value;
  var height = document.getElementById("resizeHeight").value;

  if (width && height) {
    var img = new Image();
    img.src = canvas.toDataURL();
    img.onload = function () {
      canvas.width = width;
      canvas.height = height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, width, height);

      uploadedImage.src = canvas.toDataURL();
    };
  } else {
    alert("Please enter both width and height.");
  }
});

enableCropButton.addEventListener("click", function () {
  if (!cropper) {
    cropper = new Cropper(image, {
      aspectRatio: 16 / 9,
      viewMode: 1,
    });

    // Hide the 'Enable Crop Tool' button and show the 'Crop Image' button
    enableCropButton.style.display = "none";
    cropButton.style.display = "inline-block";
  }
});

// When user clicks the 'Crop Image' button
cropButton.addEventListener("click", function () {
  if (cropper) {
    var croppedCanvas = cropper.getCroppedCanvas();

    canvas.width = croppedCanvas.width;
    canvas.height = croppedCanvas.height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(croppedCanvas, 0, 0);

    // Store the cropped image for future use
    uploadedImage.src = croppedCanvas.toDataURL();

    cropper.destroy();
    cropper = null;

    // Hide the 'Crop Image' button and show the 'Enable Crop Tool' button again
    cropButton.style.display = "none";
    enableCropButton.style.display = "inline-block";
  }
});

document.addEventListener("keydown", function (event) {
  if (event.key === "Delete") {
    if (selectedLayer !== null) {
      deleteSelectedTextLayer();
    } else if (selectedShape !== null) {
      deleteSelectedShape();
    }
  }
});
