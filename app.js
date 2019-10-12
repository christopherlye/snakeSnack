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
    intervalVar: null,
    interval: null,
    goal: 50
}

const snakeOne = {
    name: 'Orange Snake',
    width: 20,
    height: 20,
    color: 'orange',
    parts: [],
    direction: null,
    score: 0,
    speed: 5
    // interval: null,
    // intervalVar: 20
};

const snakeTwo = {
    name: "Blue Snake",
    width: 20,
    height: 20,
    color: 'blue',
    parts: [],
    direction: null,
    score: 0,
    speed: 5
    // interval: null,
    // intervalVar: 20
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
        clearInterval(game.interval);
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

// one snake head collides on another's body
const snakeCollideAnotherBody = (snakeHead, snakeAnother) => {
    // return true if both x and y coordinates of head of a snake is close to / touching another part of opponent's snake
    return ((Math.abs(snakeHead.x - snakeAnother.x) < 10) &&
            (Math.abs(snakeHead.y - snakeAnother.y) < 10));
}

// one snake head collides on another's head
const snakeCollideAnotherHead = (snakeHead, snakeAnotherHead) => {
    // return true if both x and y coordinates of head of a snake is close to / touching another part of opponent's snake
    return ((Math.abs(snakeHead.x - snakeAnotherHead.x) < 20) &&
            (Math.abs(snakeHead.y - snakeAnotherHead.y) < 20));
}


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

const drawGoal = () => {
    ctx.save();
    ctx.fillStyle = 'black';
    ctx.fillText(`Goal: ${game.goal} points`, 190, 30);
}

//////////////////////////////////////////////////////////////////////
//Move snake
//////////////////////////////////////////////////////////////////////

const moveSnakeOne = () => {
    // for all parts of the snake
    for (let i = snakeOne.parts.length - 1; i >= 0; i--) {
        if (snakeOne.direction === left) { // if snakeOne.direction is left
            if (i === 0) { // if this is the snake's head
                snakeOne.parts[i].x = snakeOne.parts[i].x - snakeOne.speed; // decrease x value by 5
            }
            // update the tail of the snake with the position of the body
            else {
                snakeOne.parts[i].x = snakeOne.parts[i - 1].x;
                snakeOne.parts[i].y = snakeOne.parts[i - 1].y;
            }
        }
        else if (snakeOne.direction === up) { // if snakeOne.direction is up
            if (i === 0) { // if this is the snake's head
                snakeOne.parts[i].y = snakeOne.parts[i].y - snakeOne.speed; // decrease y value by 5
            }
            else {
                snakeOne.parts[i].x = snakeOne.parts[i - 1].x;
                snakeOne.parts[i].y = snakeOne.parts[i - 1].y;
            }
            // update the tail of the snake with the position of the body
        }
        else if (snakeOne.direction === right) { // if snakeOne.direction is right
            if (i === 0) { // if this is the snake's head
                snakeOne.parts[i].x = snakeOne.parts[i].x + snakeOne.speed; // increase x value by 5
            }
            // update the tail of the snake with the position of the body
            else {
                snakeOne.parts[i].x = snakeOne.parts[i - 1].x;
                snakeOne.parts[i].y = snakeOne.parts[i - 1].y;
            }
        }
        else if (snakeOne.direction === down) { // if snakeOne.direction is down
            if (i === 0) { // if this is the snake's head
                snakeOne.parts[i].y = snakeOne.parts[i].y + snakeOne.speed; // increase y value by 5
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
                snakeTwo.parts[i].x = snakeTwo.parts[i].x - snakeTwo.speed; // decrease x value by 5
            }
            // update the tail of the snake with the position of the body
            else {
                snakeTwo.parts[i].x = snakeTwo.parts[i - 1].x;
                snakeTwo.parts[i].y = snakeTwo.parts[i - 1].y;
            }
        }
        else if (snakeTwo.direction === up) { // if snakeTwo.direction is up
            if (i === 0) { // if this is the snake's head
                snakeTwo.parts[i].y = snakeTwo.parts[i].y - snakeTwo.speed; // decrease y value by 5
            }
            else {
                snakeTwo.parts[i].x = snakeTwo.parts[i - 1].x;
                snakeTwo.parts[i].y = snakeTwo.parts[i - 1].y;
            }
            // update the tail of the snake with the position of the body
        }
        else if (snakeTwo.direction === right) { // if snakeTwo.direction is right
            if (i === 0) { // if this is the snake's head
                snakeTwo.parts[i].x = snakeTwo.parts[i].x + snakeTwo.speed; // increase x value by 5
            }
            // update the tail of the snake with the position of the body
            else {
                snakeTwo.parts[i].x = snakeTwo.parts[i - 1].x;
                snakeTwo.parts[i].y = snakeTwo.parts[i - 1].y;
            }
        }
        else if (snakeTwo.direction === down) { // if snakeTwo.direction is down
            if (i === 0) { // if this is the snake's head
                snakeTwo.parts[i].y = snakeTwo.parts[i].y + snakeTwo.speed; // increase y value by 5
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
        if (snakeOne.speed < 10) {
            snakeOne.speed += 0.5;
        }
        else {
            snakeOne.speed = 10;
        }
        snakeOne.score += 1;
        clearInterval(game.interval);
        game.intervalVar -= 1;
        game.interval = setInterval(updateScreen, game.intervalVar);
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
        snakeTwo.score += 7;
        clearInterval(game.interval);
        if (snakeTwo.speed > 3) {
            snakeTwo.speed -= 0.5;
        }
        else {
            snakeTwo.speed = 3;
        }
        game.intervalVar += 1;
        game.interval = setInterval(updateScreen, game.intervalVar);
        for (let i = 0; i < 7; i++) {
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
}

const snakeTwoEatFastFood = () => {
    if (snakeCollideFood(snakeTwo, fastFood)) { // when snake and fastFood collide do the following
        fastFood.items = []; // fastFood is eaten
        fastFood.eaten = true;
        createFastFood();
        snakeTwo.score += 1;
        clearInterval(game.interval);
        game.intervalVar -= 0.5;
        game.interval = setInterval(updateScreen, game.intervalVar);
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
        snakeOne.score -= 1;
        createSlowFood();
    }
}


//////////////////////////////////////////////////////////////////////
//Start Game function - used only when event triggered
//////////////////////////////////////////////////////////////////////

const startGame = () => {
    snakeOne.parts = [{x: 450, y: 45},{x: 460, y: 45},{x: 470, y: 45}]; // head body tail
    snakeTwo.parts = [{x: 30, y: 45},{x: 20, y: 45},{x: 10, y: 45}];
    snakeOne.score = 0;
    snakeTwo.score = 0;
    snakeOne.speed = 5;
    snakeTwo.speed = 5;
    game.isRunning = true;
    game.isPaused = false;
    game.intervalVar = 30;
    game.interval = setInterval(updateScreen, game.intervalVar);
}

//////////////////////////////////////////////////////////////////////
//Game over function
//////////////////////////////////////////////////////////////////////

const selfCollision = (snakeObj1, snakeObj2) => {
    for (i in snakeObj1.parts) {
        if (i == 0) {
            continue; // ignore collision on its own head
        }
        // snake head collide with part any part of it's body
        if (snakeCollideItself(snakeObj1.parts[0], snakeObj1.parts[i])) {
            clearInterval(game.interval);
            ctx.fillText(`Game Over! ${snakeObj2.name} wins!`, 150, 250);
            return;
        }
    }
}

const collideAnother = (snakeObj1, snakeObj2) => {
    if (snakeCollideAnotherHead(snakeObj1.parts[0], snakeObj2.parts[0])) {
        clearInterval(game.interval);
        ctx.fillText(`Game Over! It's a tie!`, 150, 250);
        return;
    }
        // snake head collide with part any part of other snake's body
    else {
        for (i in snakeObj2.parts) {
            if (snakeCollideAnotherBody(snakeObj1.parts[0], snakeObj2.parts[i])) {
                clearInterval(game.interval);
                ctx.fillText(`Game Over! ${snakeObj2.name} wins!`, 150, 250);
                return;
            }
        }
    }
}

const checkScore = (snakeObj1, snakeObj2) => {
    if (snakeObj1.score  === game.goal) {
        clearInterval(game.interval);
        ctx.fillText(`${snakeObj1.name} wins!`, 150, 250);
        return;
    }
    else if (snakeObj2.score === game.goal) {
        clearInterval(game.interval);
        ctx.fillText(`${snakeObj2.name} wins!`, 150, 250);
        return;
    }
}

//////////////////////////////////////////////////////////////////////
//Randomise food
//////////////////////////////////////////////////////////////////////


const createFastFood = () => {
    let pos_x = Math.random() * 485 + 5; // fastFood appears randomly at 5 - 490
    let pos_y = Math.random() * 485 + 5;
    fastFood.items[0] = {x:pos_x, y:pos_y};
    fastFood.eaten = false;
}

const createSlowFood = () => {
    let pos_x = Math.random() * 485 + 5; // fastFood appears randomly at 5 - 490
    let pos_y = Math.random() * 485 + 5;
    slowFood.items[0] = {x:pos_x, y:pos_y};
    slowFood.eaten = false;
}


//////////////////////////////////////////////////////////////////////
//Update functions
//////////////////////////////////////////////////////////////////////


// const updateSnakeOne = () => {
//     ctx.clearRect(0, 0, ctxWidth, ctxHeight);
//     snakeOne.parts.forEach(drawSnakeOne); // for each part of the snake, draw it on the screen
//     snakeOneEatFastFood();
//     snakeOneEatSlowFood();
//     ctx.fillText(`Orange: ${snakeOne.score}`, 410, 30);
//     checkSnakePosition(snakeOne);
//     moveSnakeOne(); // update the x and y coordinates of the snake based on the user input
// }

// const updateSnakeTwo = () => {
//     ctx.clearRect(0, 0, ctxWidth, ctxHeight);
//     snakeTwo.parts.forEach(drawSnakeTwo); // for each part of the snake, draw it on the screen
//     snakeTwoEatFastFood();
//     snakeTwoEatSlowFood();
//     ctx.fillText(`Blue: ${snakeTwo.score}`, 10, 30);
//     checkSnakePosition(snakeTwo);
//     moveSnakeTwo();
// }

const updateScreen = () => {
    if (!game.isPaused) {
        if (fastFood.items.length === 0) {
            createFastFood();
            createSlowFood();
        }

        // clear the canvas
        ctx.clearRect(0, 0, ctxWidth, ctxHeight);

        // draw objects
        fastFood.items.forEach(drawFastFood); // for each fastFood item, draw it on the screen
        slowFood.items.forEach(drawSlowFood); // for each slowFood item, draw it on the screen
        drawGoal();

        // draw snakes
        snakeOne.parts.forEach(drawSnakeOne); // for each part of the snake, draw it on the screen
        snakeTwo.parts.forEach(drawSnakeTwo); // for each part of the snake, draw it on the screen

        // snake eats food
        snakeOneEatFastFood();
        snakeTwoEatFastFood();
        snakeOneEatSlowFood();
        snakeTwoEatSlowFood();

        // update score
        ctx.fillText(`Orange: ${snakeOne.score}`, 410, 30);
        ctx.fillText(`Blue: ${snakeTwo.score}`, 10, 30);

        // check game over
        selfCollision(snakeOne, snakeTwo);
        selfCollision(snakeTwo, snakeOne);
        checkScore(snakeOne, snakeTwo);
        collideAnother(snakeOne, snakeTwo);
        collideAnother(snakeTwo, snakeOne);

        // check if snake is
        checkSnakePosition(snakeOne);
        checkSnakePosition(snakeTwo);
        moveSnakeOne(); // update the x and y coordinates of the snake based on the user input
        moveSnakeTwo(); // update the x and y coordinates of the snake based on the user input
        console.log(game.intervalVar);
    }
    else {
        ctx.fillText('Game paused', 200, 250);
    }
}