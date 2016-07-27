window.onload = snakeApp;

function snakeApp() {

	function canvasSupport() {
		return !!document.createElement('canvas').getContext;
	}
	
	if (!canvasSupport) {
		alert('Your browser does not support HTML5 Canvas!');
		return;
	}
	
	// constants
	
	var Dir = { West : "West", East : "East", North : "North", South : "South", };

	var squareSize = 24;
	
	// coordinate: x in [0, 30), y in [0, 15)
	var X = 30;
	var Y = 15;

	var speed = 10;

	var color = {
		background : "#d0c6bc",
		snakeBody : "#bbada0",
		snakeHead : "#8f7a66",
		apple : '#cc9933',
	};
	
	// objects

	var snake = (function() {

		var o = new Object();
		o.head = {x : X * 0.4, y : Y * 0.4};
		o.body = new Array();
		for (var i = 0; i < 4; i++) {
			o.body[i] = {x : o.head.x + i + 1, y : o.head.y}; 
		}
		o.dir =  Dir.West;
		o.dead = false;

		return o;

	})();

	function generateApple(oldApple) {
		
		function rand(lower, upper) {
			return Math.floor(lower + Math.random() * (upper - lower))
		}

		function isValidApplePoint(p) {
			return !(isOnSnake(p) || (oldApple && p.x == oldApple.x && p.y == oldApple.y));
		}
		
		while (true) {

			var p = {
				x : rand(0, X),
				y : rand(0, Y),
			};

			if (isValidApplePoint(p)) {
				var newApple = {x : p.x, y : p.y};
				console.log('generate newApple at ' + pointString(newApple));
				return newApple;
			}
			console.log('collision (' + p.x + ', ' + p.y + '), body ' + snake.body);
		}
	}
	
	var apple = generateApple();
	var score = 0;

	var canvas = document.getElementById('main-canvas');
	var context = canvas.getContext('2d');
	
	var dirInstrQueue = new Array();
	
	// initialization
	
	canvas.width = squareSize * X;
	canvas.height = squareSize * Y;
	
	repaintAll();
	
	window.addEventListener('keydown', doKeyDown, true);
	
	// game loop setting
	
	var ButtonText = { Start : 'Start', Pause : 'Pause', Resume : 'Resume', };
	
	var Status = { End : 'End', Running : 'Running', Suspend : 'Suspend', };
	var status = Status.End;
	
	var button = document.getElementById('gamebutton');
	button.onclick = function() {
		console.log('game button pressed');
		if (snake.dead) {
			document.getElementById('score').value = 0;
			window.location.reload();	
		} else if (status == Status.End || status == Status.Suspend) {
			button.innerHTML = ButtonText.Pause;
			status = Status.Running;
		} else if (status == Status.Running) {
			button.innerHTML = ButtonText.Resume;
			status = Status.Suspend;
		}
	};
	
	(function gameLoop() {
		if (snake.dead) {
			console.log('dead. quit loop');
			window.setTimeout(fadeOut, 1);
			return;
		}
		window.setTimeout(gameLoop, 1000 / speed);
		if (status == Status.Running) {
			moveForward();
			repaintAll();
		}
	})(); // enter game
	
	function fadeOut() {
		// fade out
		context.globalAlpha = 0.4;
		context.fillStyle = '#aaaaaa';
		context.fillRect(0, 0, canvas.width, canvas.height);
		
		// show game over text
		context.globalAlpha = 1;
		context.fillStyle = color.snakeHead;
		context.textBaseline = 'middle';
		context.textAlign = 'center';
		
		context.font = '50px bold sans-serif';
		context.fillText('Game Over', canvas.width * 0.5, canvas.height * 0.35);
		context.font = '20px bold sans-serif';
		context.fillText('click New Game to restart', canvas.width * 0.5, canvas.height * 0.55);
		
	}	

	// functions
	
	function doKeyDown(e) {
		
		var key = {
			left : 37,
			up : 38,
			right : 39,
			down : 40,
			space : 32,
		};
		
		var keyCode = e.keyCode ? e.keyCode : e.which;

		if (status != Status.Running) {
			return;
		}

		if (keyCode == key.left) {
			dirInstrQueue.push(Dir.West);
		} else if (keyCode == key.up) {
			dirInstrQueue.push(Dir.North);
		} else if (keyCode == key.right) {
			dirInstrQueue.push(Dir.East);
		} else if (keyCode == key.down) {
			dirInstrQueue.push(Dir.South);
		} else if (keyCode == key.space) {
			button.click();
		}
	}

	function pointString(point) {
		return '(' + point.x + ', ' + point.y + ')';
	}
	
	function moveForward() {
		
		var instr = dirInstrQueue.shift();
		
		if (instr != null) {
			console.log('direction instruction = ' + instr);
			
			if (snake.dir == Dir.West || snake.dir == Dir.East) {
				if (instr == Dir.North || instr == Dir.South) {
					snake.dir = instr;
				}
			} else if (snake.dir == Dir.North || snake.dir == Dir.South) {
				if (instr == Dir.West || instr == Dir.East) {
					snake.dir = instr;
				}
			}
		}

		if (snake.dir == Dir.West) {
			moveLeft();
		} else if (snake.dir == Dir.East) {
			moveRight();
		} else if (snake.dir == Dir.North) {
			moveUp();
		} else if (snake.dir == Dir.South) {
			moveDown();
		}
		
		function moveLeft() {
			var newPoint = {
				x : snake.head.x - 1 < 0 ? X - 1 : snake.head.x - 1,
				y : snake.head.y,
			};
			moveToNewPoint(newPoint);
		}

		function moveRight() {
			var newPoint = {
				x : snake.head.x + 1 >= X ? 0 : snake.head.x + 1,
				y : snake.head.y,
			};
			moveToNewPoint(newPoint);
		}

		function moveUp() {
			var newPoint = {
				x : snake.head.x,
				y : snake.head.y - 1 < 0 ? Y - 1 : snake.head.y - 1,
			};
			moveToNewPoint(newPoint);
		}

		function moveDown() {
			var newPoint = {
				x : snake.head.x,
				y : snake.head.y + 1 >= Y ? 0 : snake.head.y + 1,
			};
			moveToNewPoint(newPoint);
		}

		function moveToNewPoint(newPoint) {
			if (isOnSnake(newPoint)) {
				gameOver();
				return;
			}
			
			if (newPoint.x == apple.x && newPoint.y == apple.y) {
				addScore();
				apple = generateApple(apple);

				snake.body.push({}); // add a square to body
			}

			// move snake body forward
			for (var i = snake.body.length - 1; i > 0; i--) {
				snake.body[i] = snake.body[i-1];
			}
			snake.body[0] = snake.head;
			
			snake.head = newPoint; // move snake head forward
		}
		
	}

	function isOnSnake(p) {
		if (snake.head.x == p.x && snake.head.y == p.y) {
			return true;
		}
		for (var i = 0; i < snake.body.length - 1; i++) {
			if (snake.body[i].x == p.x && snake.body[i].y == p.y) {
				return true;
			}
		}
		return false;
	}

	function addScore() {
		score += speed;
		document.getElementById("score").innerText = score;
	}

	function gameOver() {
		status = Status.Suspend;
		snake.dead = true;
		button.innerHTML = 'New Game';
	}

	function paintPoint(p, color) {
		context.fillStyle = color;
		context.fillRect(p.x * squareSize, p.y * squareSize, squareSize - 1, squareSize - 1);
	}

	function repaintAll() {
		
		// clear all contents
		context.clearRect(0, 0, canvas.width, canvas.height);

		// draw background color
		context.fillStyle = color.background;
		context.fillRect(0, 0, canvas.width, canvas.height)

		// draw snake
		for (var i = 0; i < snake.body.length; i++) {
			paintPoint(snake.body[i], color.snakeBody);
		}

		paintPoint(snake.head, color.snakeHead);
		
		// draw apple
		context.fillStyle = color.apple;
		context.beginPath();
		context.arc(apple.x * squareSize + squareSize / 2, apple.y * squareSize + squareSize / 2, 
			squareSize / 2, 0, Math.PI * 2);
		context.closePath();
		context.fill();
	}
}
