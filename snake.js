const GRID_SIZE = 10;
const ACCELERATION = 1.05;
const DIRECTIONS = {
    L: [-1, 0],
    R: [1, 0],
    U: [0, -1],
    D: [0, 1],
};


var grid;
var food;
var speed;
var snake;
var snakeDir;


var init = () => {
    grid = [];
    food = [1, 1];
    speed = 300;
    snake = [[4, 4], [5, 4]]
    snakeDir = DIRECTIONS.U;

    
    for (let i = 0; i < GRID_SIZE; i++) {
	var row = [];
	
	for (let i = 0; i < GRID_SIZE; i++) {	
	    row.push([]);
	}
	
	grid.push(row);
    }


    document.addEventListener('keypress', onKeypress);
};

var newFood = () => {
    while(true) {
	var f = [
	    Math.floor(Math.random() * GRID_SIZE),
	    Math.floor(Math.random() * GRID_SIZE),	
	];

	if(!isSnakeCollision(f, true))
	    return f;
    }
}


var onKeypress = (e) => {

    var newDir = snakeDir;
    
    switch(e.code) {
    case 'KeyW': newDir = DIRECTIONS.U; break;
    case 'KeyA': newDir = DIRECTIONS.L; break;
    case 'KeyS': newDir = DIRECTIONS.D; break;
    case 'KeyD': newDir = DIRECTIONS.R; break;
    }

    var reverse = [
	snake[1][0] - snake[0][0],
	snake[1][1] - snake[0][1],
    ];

    if(newDir[0] != reverse[0] && newDir[1] != reverse[1])
	snakeDir = newDir;
};


var update = () => {
    snake.unshift([
	snake[0][0] + snakeDir[0], 
	snake[0][1] + snakeDir[1],
    ])

    if (!isFoodCollision()) {
	snake.pop();
    } else {
	food = newFood();
	speed /= ACCELERATION;
    }

    if(isWallCollision() || isSnakeCollision(snake[0], false)) {
	endGame();
    }
};

var isFoodCollision = () => {
    return snake[0][0] == food[0] && snake[0][1] == food[1];
}

var isWallCollision = () => {
    if(snake[0][0] < 0 || snake[0][0] >= GRID_SIZE) {
	return true;
    }

    if(snake[0][1] < 0 || snake[0][1] >= GRID_SIZE) {
	return true;
    }

    return false;
}

var isSnakeCollision = (p, includeHead) => {
    var i = includeHead? 0 : 1;

    for (; i < snake.length; i++) {
	if(snake[i][0] == p[0] && snake[i][1] == p[1])
	    return true;
    }

    return false;
}




const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

var render = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);    

    for (let r = 0; r < GRID_SIZE; r++) {
	for (let c = 0; c < GRID_SIZE; c++) {
	    drawRect(c, r, false);
	}
    }

    for (let i = 0; i < snake.length; i++) {
	fillRect(snake[i][0], snake[i][1], true)
    }

    fillCircle(food[0], food[1]);
};

var drawRect = (x, y) => {
    ctx.beginPath();
    ctx.rect(1 + x * 50, 1 + y * 50, 48, 48);
    ctx.stroke();
};

var fillRect = (x, y) => {
    ctx.beginPath();
    ctx.fillStyle = 'black';
    ctx.fillRect(1 + x * 50, 1 + y * 50, 48, 48);
    ctx.stroke();
};


var fillCircle = (x, y, filled) => {
    ctx.beginPath();
    ctx.fillStyle = 'red';
    ctx.arc(1 + x * 50 + 25, 1 + y * 50 + 25, 25, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
};

const GAME_OVER = new Error('game over');

var endGame = () => {
    alert('Game over. You got to size ' + snake.length + '. Press OK to play again.');
    throw GAME_OVER;
};


var gameLoop = () => {
    try {
	update();
    } catch(GAME_OVER) {
	init();
    }
    render();
    setTimeout(gameLoop, speed);
}




init();
render();
alert('Welcome to snake! Use the WASD kys to steer and press OK to start');
gameLoop();




