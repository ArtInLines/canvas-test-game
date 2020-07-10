let interval;
let score = 0;
let lives = 3;

document.addEventListener('keydown', (e) => {
	if (e.key == 'Enter') return startGame();
});

function startGame() {
	document.body.innerHTML = `<canvas id="canvas" width="500px" height="700px"></canvas>`;
	interval = setInterval(draw, 10);

	const canvas = document.getElementById('canvas');
	const ctx = canvas.getContext('2d');

	// Ball
	let ballRadius = 10;
	let x = canvas.width / 2 - ballRadius;
	let y = (canvas.height / 5) * 3 - ballRadius;
	let dx = Math.random() * 4 - 2;
	console.log(dx);
	let dy = 2;
	function drawBall() {
		ctx.beginPath();
		ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
		ctx.fillStyle = '#0095DD';
		ctx.fill();
		ctx.closePath();
	}

	// Paddle
	let paddleHeight = 10;
	let paddleWidth = 75;
	let paddleX = (canvas.width - paddleWidth) / 2;
	function drawPaddle() {
		ctx.beginPath();
		ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
		ctx.fillStyle = '#0095DD';
		ctx.fill();
		ctx.closePath();
	}

	// Moving Paddle
	let rightPressed = false;
	let leftPressed = false;

	function keyDownHandler(e) {
		if (e.key == 'Right' || e.key == 'ArrowRight' || e.key == 'd') {
			rightPressed = true;
		} else if (e.key == 'Left' || e.key == 'ArrowLeft' || e.key == 'a') {
			leftPressed = true;
		}
	}
	function keyUpHandler(e) {
		if (e.key == 'Right' || e.key == 'ArrowRight' || e.key == 'd') {
			rightPressed = false;
		} else if (e.key == 'Left' || e.key == 'ArrowLeft' || e.key == 'a') {
			leftPressed = false;
		}
	}

	// Bricks
	let brickRowCount = 4;
	let brickColumnCount = 5;
	let brickWidth = canvas.width / (brickColumnCount + 1);
	let brickHeight = canvas.height / 5 / brickRowCount;
	let brickPadding = brickWidth / (brickColumnCount + 1);
	let brickOffsetTop = canvas.height / 5 / brickRowCount;
	if (canvas.height / 5 / brickRowCount >= !25) {
		brickOffsetTop = 25;
	}
	let brickOffsetLeft = brickWidth / (brickColumnCount + 1);
	let bricks = [];
	for (let col = 0; col < brickColumnCount; col++) {
		bricks[col] = [];
		for (let row = 0; row < brickRowCount; row++) {
			bricks[col][row] = { x: 0, y: 0, status: 2 };
		}
	}

	function drawBricks() {
		for (let col = 0; col < brickColumnCount; col++) {
			for (let row = 0; row < brickRowCount; row++) {
				if (bricks[col][row].status >= 1) {
					let brickX = col * (brickWidth + brickPadding) + brickOffsetLeft;
					let brickY = row * (brickHeight + brickPadding) + brickOffsetTop;
					bricks[col][row].x = brickX;
					bricks[col][row].y = brickY;
					ctx.beginPath();
					ctx.rect(brickX, brickY, brickWidth, brickHeight);
					if (bricks[col][row].status == 2) {
						ctx.fillStyle = '#0095DD';
						ctx.fill();
					} else {
						ctx.strokeStyle = '#0095DD';
						ctx.stroke();
					}
					ctx.closePath();
				}
			}
		}
	}

	// Colliding with a brick
	function collisionDetection() {
		for (let col = 0; col < brickColumnCount; col++) {
			for (let row = 0; row < brickRowCount; row++) {
				let brick = bricks[col][row];
				if (brick.status >= 1) {
					if (x - ballRadius > brick.x && x - ballRadius < brick.x + brickWidth && y - ballRadius > brick.y && y - ballRadius * 2 < brick.y + brickHeight) {
						dy = -dy;
						brick.status--;
						if (brick.status == 0) return score++;
					}
				}
			}
		}
	}

	function drawScore() {
		ctx.font = '16px Arial';
		ctx.fillStyle = '#0095DD';
		ctx.fillText(`Score: ${score}`, 8, 20);
	}

	//
	// Main Function
	//
	function draw() {
		// clearing ball to make the ball seem to move
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		drawBricks();
		drawBall();
		drawPaddle();
		collisionDetection();
		drawScore();

		// Winning the Game
		if (score == brickRowCount * brickColumnCount) {
			alert('YOU WIN, CONGRATULATIONS!');
			document.location.reload();
			clearInterval(interval); // Needed for Chrome to end game
		}

		// Bouncing of the walls
		if (x + dx < ballRadius || x + dx > canvas.width - ballRadius) {
			dx = -dx;
		}
		if (y + dy < ballRadius) {
			dy = -dy;
		}
		if (y + dy > canvas.height - ballRadius - paddleHeight && x > paddleX && x < paddleX + paddleWidth) {
			// If touching the paddle
			dy = -dy;
		} else if (y + dy > canvas.height - ballRadius) {
			// Touching the bottom wall
			// Game Over
			alert('Game Over');
			document.location.reload();
			clearInterval(interval); // Needed for Chrome to end the game
		}

		// Changing coordinates of ball
		// to make it move
		x += dx;
		y += dy;

		// Moving paddle
		if (rightPressed) {
			paddleX += 3;
			if (paddleX + paddleWidth > canvas.width) {
				paddleX = canvas.width - paddleWidth;
			}
		} else if (leftPressed) {
			paddleX -= 3;
			if (paddleX < 0) {
				paddleX = 0;
			}
		}
	}

	document.addEventListener('keydown', keyDownHandler, false);
	document.addEventListener('keyup', keyUpHandler, false);
}
