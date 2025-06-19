// Create and inject the HTML structure
document.body.innerHTML = `
  <div class="container">
    <section class="tools-board">
      <div class="row shape-options">
        <label class="title">Shapes</label>
        <ul class="options">
          <li class="option tool" id="rectangle">
            <img src="icons/rectangle.svg" alt="">
            <span>Rectangle</span>
          </li>
          <li class="option tool" id="circle">
            <img src="icons/circle.svg" alt="">
            <span>Circle</span>
          </li>
          <li class="option tool" id="triangle">
            <img src="icons/triangle.svg" alt="">
            <span>Triangle</span>
          </li>
          <li class="option">
            <input type="checkbox" id="fill-color">
            <label for="fill-color">Fill color</label>
          </li>
        </ul>
      </div>
      <div class="row">
        <label class="title">Options</label>
        <ul class="options">
          <li class="option active tool" id="brush">
            <img src="icons/brush.svg" alt="">
            <span>Brush</span>
          </li>
          <li class="option tool" id="eraser">
            <img src="icons/eraser.svg" alt="">
            <span>Eraser</span>
          </li>
          <li class="option">
            <input type="range" id="size-slider" min="1" max="30" value="5">
          </li>
        </ul>
      </div>
      <div class="row colors">
        <label class="title">Colors</label>
        <ul class="options color-options">
          <li class="option"></li>
          <li class="option selected"></li>
          <li class="option"></li>
          <li class="option"></li>
          <li class="option">
            <input type="color" id="color-picker" value="#4A98F7">
          </li>
        </ul>
      </div>
      <div class="row buttons">
        <button class="clear-canvas">Clear Canvas</button>
        <button class="save-img">Save As Image</button>
          <button class="save-pdf">Export as PDF</button>
      </div>
    </section>
    <section class="drawing-board">
      <canvas></canvas>
    </section>
  </div>
`;

// Inject CSS styles dynamically
const style = document.createElement("style");
style.textContent = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Poppins', sans-serif;
  }
  body {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background: #47289d;
  }
  .container {
    display: flex;
    width: 100%;
    gap: 10px;
    padding: 10px;
    max-width: 1050px;
  }
  section {
    background: #fff;
    border-radius: 7px;
  }
  .tools-board {
    width: 210px;
    padding: 15px 22px 0;
  }
  .tools-board .row {
    margin-bottom: 20px;
  }
  .row .options {
    list-style: none;
    margin: 10px 0 0 5px;
  }
  .row .options .option {
    display: flex;
    cursor: pointer;
    align-items: center;
    margin-bottom: 10px;
  }
  .option:is(:hover, .active) img {
    filter: invert(17%) sepia(90%) saturate(3000%) hue-rotate(900deg) brightness(100%) contrast(100%);
  }
  .option :where(span, label) {
    color: #5A6168;
    cursor: pointer;
    padding-left: 10px;
  }
  .option:is(:hover, .active) :where(span, label) {
    color: #4A98F7;
  }
  .option #fill-color {
    cursor: pointer;
    height: 14px;
    width: 14px;
  }
  #fill-color:checked ~ label {
    color: #4A98F7;
  }
  .option #size-slider {
    width: 100%;
    height: 5px;
    margin-top: 10px;
  }
  .colors .options {
    display: flex;
    justify-content: space-between;
  }
  .colors .option {
    height: 20px;
    width: 20px;
    border-radius: 50%;
    margin-top: 3px;
    position: relative;
  }
  .colors .option:nth-child(1) {
    background-color: #fff;
    border: 1px solid #bfbfbf;
  }
  .colors .option:nth-child(2) {
    background-color: #000;
  }
  .colors .option:nth-child(3) {
    background-color: #E02020;
  }
  .colors .option:nth-child(4) {
    background-color: #6DD400;
  }
  .colors .option:nth-child(5) {
    background-color: #4A98F7;
  }
  .colors .option.selected::before {
    position: absolute;
    content: "";
    top: 50%;
    left: 50%;
    height: 12px;
    width: 12px;
    background: inherit;
    border-radius: inherit;
    border: 2px solid #fff;
    transform: translate(-50%, -50%);
  }
  .colors .option:first-child.selected::before {
    border-color: #ccc;
  }
  .option #color-picker {
    opacity: 0;
    cursor: pointer;
  }
  .buttons button {
    width: 100%;
    color: #fff;
    border: none;
    outline: none;
    padding: 11px 0;
    font-size: 0.9rem;
    margin-bottom: 13px;
    background: none;
    border-radius: 4px;
    cursor: pointer;
  }
  .buttons .clear-canvas {
    color: #6C757D;
    border: 1px solid #6C757D;
    transition: all 0.3s ease;
  }
  .clear-canvas:hover {
    color: #fff;
    background: #6C757D;
  }
  .buttons .save-img {
    background: #4A98F7;
    border: 1px solid #4A98F7;
  }
  .drawing-board {
    flex: 1;
    overflow: hidden;
  }
  .drawing-board canvas {
    width: 100%;
    height: 100%;
    display: block;
    background: #fff;
    border: 1px solid #ccc;
    cursor: crosshair;
  }
     .buttons .save-pdf {
    background: #28a745;
    border: 1px solid #28a745;
    color: #fff;
    cursor: pointer;
    width: 100%;
    padding: 11px 0;
    font-size: 0.9rem;
    margin-bottom: 13px;
    border-radius: 4px;
    transition: background-color 0.3s ease;
  }
  .buttons .save-pdf:hover {
    background: #218838;
    border-color: #1e7e34;
  }
`;
document.head.appendChild(style);

// JavaScript drawing app logic

const canvas = document.querySelector("canvas"),
  toolBtns = document.querySelectorAll(".tool"),
  fillColor = document.querySelector("#fill-color"),
  sizeSlider = document.querySelector("#size-slider"),
  colorBtns = document.querySelectorAll(".colors .option"),
  colorPicker = document.querySelector("#color-picker"),
  clearCanvas = document.querySelector(".clear-canvas"),
  saveImg = document.querySelector(".save-img"),
  ctx = canvas.getContext("2d");

// global variables with default value
let prevMouseX, prevMouseY, snapshot,
  isDrawing = false,
  selectedTool = "brush",
  brushWidth = 5,
  selectedColor = "#000";

const setCanvasBackground = () => {
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = selectedColor;
};

window.addEventListener("load", () => {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  setCanvasBackground();
});

const drawRect = (e) => {
  if (!fillColor.checked) {
    return ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
  }
  ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
};

const drawCircle = (e) => {
  ctx.beginPath();
  let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + Math.pow((prevMouseY - e.offsetY), 2));
  ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);
  fillColor.checked ? ctx.fill() : ctx.stroke();
};

const drawTriangle = (e) => {
  ctx.beginPath();
  ctx.moveTo(prevMouseX, prevMouseY);
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY);
  ctx.closePath();
  fillColor.checked ? ctx.fill() : ctx.stroke();
};

const startDraw = (e) => {
  isDrawing = true;
  prevMouseX = e.offsetX;
  prevMouseY = e.offsetY;
  ctx.beginPath();
  ctx.lineWidth = brushWidth;
  ctx.strokeStyle = selectedColor;
  ctx.fillStyle = selectedColor;
  snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
};

const drawing = (e) => {
  if (!isDrawing) return;
  ctx.putImageData(snapshot, 0, 0);

  if (selectedTool === "brush" || selectedTool === "eraser") {
    ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
  } else if (selectedTool === "rectangle") {
    drawRect(e);
  } else if (selectedTool === "circle") {
    drawCircle(e);
  } else if (selectedTool === "triangle") {
    drawTriangle(e);
  }
};

toolBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector(".options .active").classList.remove("active");
    btn.classList.add("active");
    selectedTool = btn.id;
  });
});

sizeSlider.addEventListener("change", () => brushWidth = sizeSlider.value);

colorBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector(".options .selected").classList.remove("selected");
    btn.classList.add("selected");
    selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");
  });
});

colorPicker.addEventListener("change", () => {
  colorPicker.parentElement.style.background = colorPicker.value;
  colorPicker.parentElement.click();
});

clearCanvas.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  setCanvasBackground();
});

saveImg.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = `${Date.now()}.jpg`;
  link.href = canvas.toDataURL();
  link.click();
});
// Add jsPDF lib dynamically
const jsPDFscript = document.createElement('script');
jsPDFscript.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
document.head.appendChild(jsPDFscript);

const savePdfBtn = document.querySelector(".save-pdf");

// Wait until jsPDF is loaded, then add listener
jsPDFscript.onload = () => {
  savePdfBtn.addEventListener("click", () => {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [canvas.width, canvas.height]
    });
    const imgData = canvas.toDataURL("image/png");
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save(`canvas_${Date.now()}.pdf`);
  });
};


canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", () => isDrawing = false);
