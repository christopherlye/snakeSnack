// accessing the canvas
let ctx = document.getElementById('ctx').getContext('2d');

/*--------------------------------------------------------------------
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                        Creating Snake Game
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
--------------------------------------------------------------------*/

//////////////////////////////////////////////////////////////////////
//Global variables
//////////////////////////////////////////////////////////////////////

let ctxWidth = document.getElementById('ctx').width;
let ctxHeight = document.getElementById('ctx').height;
ctx.font = '20px Calibri';
ctx.fillText('Click to start the game', 140, 250);

//////////////////////////////////////////////////////////////////////
//Create Game Objects
//////////////////////////////////////////////////////////////////////

const game = {
    isRunning: false,
    isPaused: false,
    intervalVar: null
}

const snakeOne = {
    width: 20,
    height: 20,
    color: 'orange',
    parts: [
        // head x and y position
        {x: 220, y: 200},
        // body
        {x: 210, y: 200},
        // tail
        {x: 200, y: 200}
    ],
    direction: null,
    score: 0,
    speed: {x: 5, y: 5}
};

const snakeTwo = {
    width: 20,
    height: 20,
    color: 'blue',
    parts: [
        // head x and y position
        {x: 120, y: 200},
        // body
        {x: 110, y: 200},
        // tail
        {x: 100, y: 200}
    ],
    direction: null,
    score: 0,
    speed: {x: 5, y: 5}
};

const fastFood = {
    width: 20,
    height: 20,
    color: 'green',
    eaten: true,
    items: []
}

const slowFood = {
    width: 20,
    height: 20,
    color: 'red',
    eaten: true,
    items: []
}


//////////////////////////////////////////////////////////////////////
//Keyboard controls
//////////////////////////////////////////////////////////////////////

let spacebar, left, up, right, down;
[spacebar, left, up, right, down, w, a, s, d] = [32, 37, 38, 39, 40, 87, 65, 83, 68];


//////////////////////////////////////////////////////////////////////
//Event handlers
//////////////////////////////////////////////////////////////////////

// start game function
document.getElementById('ctx').onmousedown = () => {
    if (game.isRunning) {
        // clear interval so that it won't repeat itself too many times
        clearInterval(game.intervalVar);
        game.isRunning = false;
        fastFood.items = [];
    }
    startGame();
}


// keyboard events
document.onkeydown = (event) => {

    // snakeOne direction keys
    if (event.keyCode === up && snakeOne.direction != down) {
        snakeOne.direction = up;
    }
    else if (event.keyCode === down && snakeOne.direction != up) {
        snakeOne.direction = down;
    }
    else if (event.keyCode === right && snakeOne.direction != left) {
        snakeOne.direction = right;
    }
    else if (event.keyCode === left && snakeOne.direction != right) {
        snakeOne.direction = left;
    }
    // snakeTwo direction keys
    else if (event.keyCode === w && snakeTwo.direction != down) {
        snakeTwo.direction = up;
    }
    else if (event.keyCode === s && snakeTwo.direction != up) {
        snakeTwo.direction = down;
    }
    else if (event.keyCode === a && snakeTwo.direction != right) {
        snakeTwo.direction = left;
    }
    else if (event.keyCode === d && snakeTwo.direction != left) {
        snakeTwo.direction = right;
    }
    // pause game
    else if (event.keyCode === spacebar) {
        if (game.isPaused) {
            game.isPaused = false;
        }
        else {
            game.isPaused = true;
        }
    }
}

//////////////////////////////////////////////////////////////////////
//Collide objects
//////////////////////////////////////////////////////////////////////

const snakeCollideFood = (snakeObj, foodObj) => {
    let snakeHead = snakeObj.parts[0]; // first snake part is snake head
    let foodItem1 = foodObj.items[0]; // first food item
    // return true if both x and y coordinates of head of snake is close to / touching the food
    return ((Math.abs(snakeHead.x - foodItem1.x) < 20) &&
            (Math.abs(snakeHead.y - foodItem1.y) < 20));
}

const snakeCollideItself = (snakeHead, snakeBody) => {
    // return true if both x and y coordinates of head of a snake is close to / touching another part of a snake
    return ((Math.abs(snakeHead.x - snakeBody.x) < 5) &&
            (Math.abs(snakeHead.y - snakeBody.y) < 5));
}

// both snakes head collide

// one snake head collides on another's body

//////////////////////////////////////////////////////////////////////
//Draw objects
//////////////////////////////////////////////////////////////////////

const drawSnakeOne = (snakeObj, i) => { // snakeObj is snake object, i is the index of the array (i.e. other parts of the snake)
    ctx.save(); //saves state of canvas
    if (i === 0) {
        ctx.fillStyle = 'black'; // create different colour for snakeObj head
    }
    else {
        ctx.fillStyle = snakeOne.color;
    }
    ctx.fillRect(snakeObj.x, snakeObj.y, snakeOne.width, snakeOne.height); // draw the rectangle
    ctx.restore(); //restores state of canvas
}

const drawSnakeTwo = (snakeObj, i) => { // snakeObj is snake object, i is the index of the array (i.e. other parts of the snake)
    ctx.save(); //saves state of canvas
    if (i === 0) {
        ctx.fillStyle = 'black'; // create different colour for snakeObj head
    }
    else {
        ctx.fillStyle = snakeTwo.color;
    }
    ctx.fillRect(snakeObj.x, snakeObj.y, snakeTwo.width, snakeTwo.height); // draw the rectangle
    ctx.restore(); //restores state of canvas
}

const drawFastFood = () => {
    ctx.save();
    ctx.fillStyle = fastFood.color;
    ctx.fillRect(fastFood.items[0].x, fastFood.items[0].y, fastFood.width, fastFood.height);
    ctx.restore();
}

const drawSlowFood = () => {
    ctx.save();
    ctx.fillStyle = slowFood.color;
    ctx.fillRect(slowFood.items[0].x, slowFood.items[0].y, slowFood.width, slowFood.height);
    ctx.restore();
}

//////////////////////////////////////////////////////////////////////
//Move snake
//////////////////////////////////////////////////////////////////////

const moveSnakeOne = () => {
    // for all parts of the snake
    for (let i = snakeOne.parts.length - 1; i >= 0; i--) {
        if (snakeOne.direction === left) { // if snakeOne.direction is left
            if (i === 0) { // if this is the snake's head
                snakeOne.parts[i].x = snakeOne.parts[i].x - snakeOne.speed.x; // decrease x value by 5
            }
            // update the tail of the snake with the position of the body
            else {
                snakeOne.parts[i].x = snakeOne.parts[i - 1].x;
                snakeOne.parts[i].y = snakeOne.parts[i - 1].y;
            }
        }
        else if (snakeOne.direction === up) { // if snakeOne.direction is up
            if (i === 0) { // if this is the snake's head
                snakeOne.parts[i].y = snakeOne.parts[i].y - snakeOne.speed.x; // decrease y value by 5
            }
            else {
                snakeOne.parts[i].x = snakeOne.parts[i - 1].x;
                snakeOne.parts[i].y = snakeOne.parts[i - 1].y;
            }
            // update the tail of the snake with the position of the body
        }
        else if (snakeOne.direction === right) { // if snakeOne.direction is right
            if (i === 0) { // if this is the snake's head
                snakeOne.parts[i].x = snakeOne.parts[i].x + snakeOne.speed.x; // increase x value by 5
            }
            // update the tail of the snake with the position of the body
            else {
                snakeOne.parts[i].x = snakeOne.parts[i - 1].x;
                snakeOne.parts[i].y = snakeOne.parts[i - 1].y;
            }
        }
        else if (snakeOne.direction === down) { // if snakeOne.direction is down
            if (i === 0) { // if this is the snake's head
                snakeOne.parts[i].y = snakeOne.parts[i].y + snakeOne.speed.x; // increase y value by 5
            }
            // update the tail of the snake with the position of the body
            else {
                snakeOne.parts[i].x = snakeOne.parts[i - 1].x;
                snakeOne.parts[i].y = snakeOne.parts[i - 1].y;
            }
        }
    }
}

const moveSnakeTwo = () => {
    // for all parts of the snake
    for (let i = snakeTwo.parts.length - 1; i >= 0; i--) {
        if (snakeTwo.direction === left) { // if snakeTwo.direction is left
            if (i === 0) { // if this is the snake's head
                snakeTwo.parts[i].x = snakeTwo.parts[i].x - snakeTwo.speed.x; // decrease x value by 5
            }
            // update the tail of the snake with the position of the body
            else {
                snakeTwo.parts[i].x = snakeTwo.parts[i - 1].x;
                snakeTwo.parts[i].y = snakeTwo.parts[i - 1].y;
            }
        }
        else if (snakeTwo.direction === up) { // if snakeTwo.direction is up
            if (i === 0) { // if this is the snake's head
                snakeTwo.parts[i].y = snakeTwo.parts[i].y - snakeTwo.speed.x; // decrease y value by 5
            }
            else {
                snakeTwo.parts[i].x = snakeTwo.parts[i - 1].x;
                snakeTwo.parts[i].y = snakeTwo.parts[i - 1].y;
            }
            // update the tail of the snake with the position of the body
        }
        else if (snakeTwo.direction === right) { // if snakeTwo.direction is right
            if (i === 0) { // if this is the snake's head
                snakeTwo.parts[i].x = snakeTwo.parts[i].x + snakeTwo.speed.x; // increase x value by 5
            }
            // update the tail of the snake with the position of the body
            else {
                snakeTwo.parts[i].x = snakeTwo.parts[i - 1].x;
                snakeTwo.parts[i].y = snakeTwo.parts[i - 1].y;
            }
        }
        else if (snakeTwo.direction === down) { // if snakeTwo.direction is down
            if (i === 0) { // if this is the snake's head
                snakeTwo.parts[i].y = snakeTwo.parts[i].y + snakeTwo.speed.x; // increase y value by 5
            }
            // update the tail of the snake with the position of the body
            else {
                snakeTwo.parts[i].x = snakeTwo.parts[i - 1].x;
                snakeTwo.parts[i].y = snakeTwo.parts[i - 1].y;
            }
        }
    }
}



//////////////////////////////////////////////////////////////////////
//Check if snake is out of canvas
//////////////////////////////////////////////////////////////////////

const checkSnakePosition = (snake) => {
    let snakeHead = snake.parts[0];
    if (snakeHead.x > ctxWidth) { // if snake's head goes past the right side of canvas
        snakeHead.x = 0; // regenerate from the left side
    }
    else if (snakeHead.x < 0) { // if snake's head goes past the left side of canvas
        snakeHead.x = 500;
    }
    else if (snakeHead.y > ctxHeight) { // if snake's head goes past the bottom side of canvas
        snakeHead.y = 0;
    }
    else if (snakeHead.y < 0) { // if snake's head goes past the upper side of canvas
        snakeHead.y = 500;
    }
}


//////////////////////////////////////////////////////////////////////
//Update length of snakes if snakes eat food
//////////////////////////////////////////////////////////////////////

const snakeOneEatFastFood = () => {
    if (snakeCollideFood(snakeOne, fastFood)) { // when snake and fastFood collide do the following
        fastFood.items = []; // fastFood is eaten
        fastFood.eaten = true;
        createFastFood();
        snakeOne.score += 1;
        // snakeOne.speed.x += 5;
        // snakeOne.speed.y += 5;
        let new_X, new_Y; // create new x and y positions for the snake after eating the fastFood
        if (snakeOne.direction === left) { // left
            new_X = snakeOne.parts[0].x - 10;
            new_Y = snakeOne.parts[0].y;
        }
        else if (snakeOne.direction === up) { // up
            new_X = snakeOne.parts[0].x;
            new_Y = snakeOne.parts[0].y - 10;
        }
        else if (snakeOne.direction === right) { // right
            new_X = snakeOne.parts[0].x + 10;
            new_Y = snakeOne.parts[0].y;
        }
        else if (snakeOne.direction === down) { // down
            new_X = snakeOne.parts[0].x;
            new_Y = snakeOne.parts[0].y + 10;
        }
    snakeOne.parts.unshift({x:new_X, y:new_Y}); // add to the head of the snake
    }
}

const snakeOneEatSlowFood = () => {
    if (snakeCollideFood(snakeOne, slowFood)) { // when snake and slowFood collide do the following
        slowFood.items = []; // slowFood is eaten
        slowFood.eaten = true;
        createSlowFood();
    }
}

const snakeTwoEatFastFood = () => {
    if (snakeCollideFood(snakeTwo, fastFood)) { // when snake and fastFood collide do the following
        fastFood.items = []; // fastFood is eaten
        fastFood.eaten = true;
        createFastFood();
        snakeTwo.score += 1;
        let new_X, new_Y; // create new x and y positions for the snake after eating the fastFood
        if (snakeTwo.direction === left) { // left
            new_X = snakeTwo.parts[0].x - 10;
            new_Y = snakeTwo.parts[0].y;
        }
        else if (snakeTwo.direction === up) { // up
            new_X = snakeTwo.parts[0].x;
            new_Y = snakeTwo.parts[0].y - 10;
        }
        else if (snakeTwo.direction === right) { // right
            new_X = snakeTwo.parts[0].x + 10;
            new_Y = snakeTwo.parts[0].y;
        }
        else if (snakeTwo.direction === down) { // down
            new_X = snakeTwo.parts[0].x;
            new_Y = snakeTwo.parts[0].y + 10;
        }
    snakeTwo.parts.unshift({x:new_X, y:new_Y}); // add to the head of the snake
    }
}

const snakeTwoEatSlowFood = () => {
    if (snakeCollideFood(snakeTwo, slowFood)) { // when snake and slowFood collide do the following
        slowFood.items = []; // slowFood is eaten
        slowFood.eaten = true;
        createSlowFood();
    }
}


//////////////////////////////////////////////////////////////////////
//Start Game function - used only when event triggered
//////////////////////////////////////////////////////////////////////

const startGame = () => {
    snakeOne.score = 0;
    snakeTwo.score = 0;
    game.isRunning = true;
    game.isPaused = false;
    game.intervalVar = setInterval(updateScreen, 20);

}

//////////////////////////////////////////////////////////////////////
//Game over function
//////////////////////////////////////////////////////////////////////

isGameOver = () => {
    for (i in snakeOne.parts) {
        if (i == 0) {
            continue;
        }
        // snake head collide with part any part of it's body
        if (snakeCollideItself(snakeOne.parts[0], snakeOne.parts[i])) {
            clearInterval(game.intervalVar);
            ctx.fillText('Game Over! Click to restart', 150, 250);
            return;
        }
    }
}

//////////////////////////////////////////////////////////////////////
//Update screen
//////////////////////////////////////////////////////////////////////

createFastFood = () => {
    let pos_x = Math.random() * 485 + 5; // fastFood appears randomly at 5 - 490
    let pos_y = Math.random() * 485 + 5;
    fastFood.items[0] = {x:pos_x, y:pos_y};
    fastFood.eaten = false;
}

createSlowFood = () => {
    let pos_x = Math.random() * 485 + 5; // fastFood appears randomly at 5 - 490
    let pos_y = Math.random() * 485 + 5;
    slowFood.items[0] = {x:pos_x, y:pos_y};
    slowFood.eaten = false;
}

updateScreen = () => {
    if (!game.isPaused) {
        if (fastFood.items.length === 0) {
            createFastFood();
            createSlowFood();
        }
        ctx.clearRect(0, 0, ctxWidth, ctxHeight); // clear the canvas
        fastFood.items.forEach(drawFastFood); // for each fastFood item, draw it on the screen
        slowFood.items.forEach(drawSlowFood); // for each slowFood item, draw it on the screen

        snakeOne.parts.forEach(drawSnakeOne); // for each part of the snake, draw it on the screen
        snakeTwo.parts.forEach(drawSnakeTwo); // for each part of the snake, draw it on the screen
        snakeOneEatFastFood();
        snakeTwoEatFastFood();
        snakeOneEatSlowFood();
        snakeTwoEatSlowFood();
        ctx.fillText(`Orange: ${snakeOne.score}`, 410, 30);
        ctx.fillText(`Blue: ${snakeTwo.score}`, 10, 30);
        isGameOver();
        checkSnakePosition(snakeOne);
        checkSnakePosition(snakeTwo);
        moveSnakeOne(); // update the x and y coordinates of the snake based on the user input
        moveSnakeTwo(); // update the x and y coordinates of the snake based on the user input
    }
    else {
        ctx.fillText('Game paused', 200, 250);
    }
}