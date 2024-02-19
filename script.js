var canvasWidth = 600;
var canvasHeight = 400;
var player;
var playerYPosition = 200;
var playerXPosition = 300;
let secondsPassed;
let oldTimeStamp;
let fps;
var block;
var user = Array.from({ length: 3 }, () => Math.floor(Math.random() * 16).toString(2).padStart(4, '0'));
var objects = []; // Array to store objects on the screen
var cp = 0;
var dx = 0;
var dy = 0;
let iy = -2572;
let ix = -188;
var health = 100;

// Image variables
var backgroundImage = new Image();
backgroundImage.src = './image.png'; // Replace with the path to your image
var gameCanvas = {
    canvas: document.createElement("canvas"),
    start: function () {
        this.context = this.canvas.getContext("webgl");
        if (context === null) {
            alert("Your browser does not support WebGL.");
            return
        }
        context.clearColor(0.0, 0.0, 0.0, 1.0);
        context.clear(context.COLOR_BUFFER_BIT);
        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;
        // Draw the background image
        this.context.drawImage(backgroundImage, 0, 0, canvasWidth, canvasHeight);

        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        window.requestAnimationFrame(updateCanvas);
    }
}
document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);
const keys = {
    W: false,
    A: false,
    S: false,
    D: false
};
let startTime = performance.now();

function handleKeyDown(event) {
    switch (event.code) {
        case 'KeyW':
            keys.W = true;
            break;
        case 'KeyA':
            keys.A = true;
            break;
        case 'KeyS':
            keys.S = true;
            break;
        case 'KeyD':
            keys.D = true;
            break;
    }
}

function handleKeyUp(event) {
    switch (event.code) {
        case 'KeyW':
            keys.W = false;
            break;
        case 'KeyA':
            keys.A = false;
            break;
        case 'KeyS':
            keys.S = false;
            break;
        case 'KeyD':
            keys.D = false;
            break;
    }
}

function updatePlayerPosition() {
    if (keys.W) {
        for (let obj of objects) {
            obj.y += 3;
        }
        iy +=3;
    }
    if (keys.A) {
        for (let obj of objects) {
            obj.x += 3;
        }
        ix +=3;
    }
    if (keys.S) {
        for (let obj of objects) {
            obj.y -= 3;
        }
        iy -=3;
    }
    if (keys.D) {
        for (let obj of objects) {
            obj.x -= 3;
        }
        ix-=3;
    }
    player.stopPlayer();
}

function startGame() {
    gameCanvas.start();
    player = new createPlayer(30, 30);
}

function createRandomObject() {
    var xPos = randomNumber(-500, canvasWidth + 500);
    var yPos = randomNumber(-500, canvasWidth + 500);
    if (Math.random() < 0.08) {
        var dx = randomNumber(-50, 50) / 70;
        var dy = randomNumber(-50, 50) / 70;
    } else {
        var dx = 0;
        var dy = 0;
    }
    var width = randomNumber(15, 80);
    var height = randomNumber(15, 80);
    var opacity = 0.2; // Initial opacity
    var appearTime = randomNumber(500, 2000); // Random time to appear (milliseconds)

    return {
        x: xPos,
        y: yPos,
        opacity: opacity,
        appearTime: appearTime,
        isTouching: false,
        startTime: performance.now(),
        height: height,
        width: width,
        dx: dx,
        dy: dy,
    };
}

function updateObjects() {
    for (let obj of objects) {
        obj.y += obj.dy;
        obj.x += obj.dx;

        if (obj.y + obj.height < -500 || obj.y + 10 > canvasHeight + 500 || obj.x + obj.width < -500) {
            objects.splice(objects.indexOf(obj), 1);
        }
        var elapsedTime = performance.now() - obj.startTime;
        if (elapsedTime < obj.appearTime) {
            obj.opacity = 0.2 + (elapsedTime / obj.appearTime) * 0.8;
        } else {
            if (elapsedTime > obj.appearTime + (3000 * (obj.dx + obj.dy)) + (obj.appearTime / 4) + 150) {
                objects.splice(objects.indexOf(obj), 1);
            }
            obj.opacity = 1;
            if (
                player.x + player.width > obj.x &&
                player.x < obj.x + obj.width &&
                player.y + player.height > obj.y &&
                player.y < obj.y + obj.height
            ) {
                obj.isTouching = true;
                if (obj.isTouching) {
                    health -= 2;
                }
            }
        }
    }
}

function drawObjects() {
    ctx = gameCanvas.context;
    for (let obj of objects) {
        if (obj.opacity == 1) {
            ctx.fillStyle = "red";
        } else {
            ctx.fillStyle = "black";
        }
        ctx.globalAlpha = obj.opacity;
        ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
        ctx.globalAlpha = 1;
    }
}



function createPlayer(width, height) {
    this.width = width;
    this.height = height;
    this.x = playerXPosition;
    this.y = playerYPosition;
    this.draw = function () {
        ctx = gameCanvas.context;
        ctx.fillStyle = "white";
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.font = '12px Roboto-mono';
        ctx.fillStyle = 'black';
        for (let i = 0; i < 3; i++) {
            ctx.fillText(user[i], this.x + 4, this.y + 11 + (i * 8));
        }
    }
    this.stopPlayer = function () {
        var ground = canvasHeight - this.height;
        if (this.y > ground) {
            this.y = ground;
        }
        else if (this.y < 0) {
            this.y = 0;
        }
        if (this.x > canvasWidth - player.width) {
            this.x = canvasWidth - player.width;
        }
        else if (this.x < 0) {
            this.x = 0;
        }
    }
}
function checkColorAtPixel(x, y) {
    var imageData = ctx.getImageData(x, y, 1, 1);
    var pixel = imageData.data;

    // Check the color at the specified pixel
    var red = pixel[0];
    var green = pixel[1];
    var blue = pixel[2];
    console.log(red, green, blue);
    // Compare the color values or perform further actions
    if (red === 37 && green === 0 && blue === 4) {
        return true;
    } else {
        // console.log("Pixel at (" + x + ", " + y + ") is not white.");
        return false;
    }
}
let alerted = false;
let oncolor = false;
function updateCanvas(timeStamp) {
    if (health < 0){
        if (!alerted){
            alert('you lost');
            location.reload();
            alerted = true;
        }
        
        
    }
    if (ix < -3056 && ix > -3476){
        if (iy >-140){
            if (!alerted){
                alert("you won!");
                console.log("win");
                alerted = true;
            }
        }
    }
    if (health > 100){
        health = 100;
    }
    else{
        health += 0.1;
    }
    ctx = gameCanvas.context;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.drawImage(backgroundImage, ix, iy, backgroundImage.width * 4, backgroundImage.height * 4);
    if (checkColorAtPixel(player.x, player.y)){
        oncolor = true;
    }
    else{
        oncolor = false;
    }
    player.draw();
    updatePlayerPosition();
    updateObjects(); // Update positions and check collisions with objects
    drawObjects(); // Draw the objects
    // Generate random objects with a chance of 5% to appear in each frame
    if (oncolor){
        if (Math.random() < 0.4 + (0.2 * (2572 + iy)/300)) {
            for (let i = 0; i < Math.floor(Math.random() * (20 + ((2572 + iy)/500) )); i++) {
                objects.push(createRandomObject());
            }
    
        }
    }
    if (Math.random() < 0.03 + (0.1 * (2572 + iy)/600)) {
        for (let i = 0; i < Math.floor(Math.random() * (20 + ((2572 + iy)/500) )); i++) {
            objects.push(createRandomObject());
        }

    }
    
    ctx.fillStyle = "gray";
    ctx.fillRect(290, 235, 50, 12);

    // Draw green bar on top
    ctx.fillStyle = "green";
    ctx.fillRect(290, 235, (health / 100 ) * 50, 12);
    window.requestAnimationFrame(updateCanvas);
}

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
