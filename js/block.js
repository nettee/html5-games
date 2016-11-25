window.onload = blockApp;

function blockApp() {

	function canvasSupport() {
		return !!document.createElement('canvas').getContext;
	}
	
	if (!canvasSupport) {
		alert('Your browser does not support HTML5 Canvas!');
		return;
	}
	
	// constants
	
	var Dir = { West : "West", East : "East", North : "North", South : "South", };

	// coordinate range
	var X = 720;
	var Y = 360;

	var speed = 100;

	var color = {
		background : "#d0c6bc",
		block : "#bbada0",
		ball : '#cc9933',
		board : "#8f7a66",
	};
	
	// objects
	
	var blocks = (function() {
		
		return {
			draw : function() {
				
			},
		};
		
	}());

	
	var board = (function() {
		
		var width = 80;
		var height = 7;
		
		return {
			width : width,
			height : height,
			x : X / 2 - width / 2,
			y : Y - 20,
			
			
			draw : function() {
				
			},
		};
	}());
	
	var ball = (function() {
		
		var radius = 9;
	
		return {
			radius : radius,
			x : board.x + board.width / 2,
			y : board.y - radius,
			angle : Math.PI * 0.65, // start angle : northwest
			draw : function() {
				
			},
		};
		
	}());
	
	var score = 0;

	var canvas = document.getElementById('main-canvas');
	var context = canvas.getContext('2d');
	
	var dirInstrQueue = new Array();
	
	// initialization
	
	canvas.width = X;
	canvas.height = Y;
	
	repaintAll();
	
	window.addEventListener('keydown', doKeyDown, true);
	
	// game loop setting
	
	var ButtonText = { Start : 'Start', Pause : 'Pause', Resume : 'Resume', };
	
	var Status = { End : 'End', Running : 'Running', Suspend : 'Suspend', };
	var status = Status.End;
	
	var button = document.getElementById('gamebutton');
	button.onclick = function() {
		console.log('game button pressed');
		if (ball.dead) {
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
		if (ball.dead) {
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
		
		console.log('moving forward!');
		
		ball.x += Math.cos(ball.angle);
		ball.y -= Math.sin(ball.angle);
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
		context.fillRect(0, 0, canvas.width, canvas.height);
		
		// draw board
		context.fillStyle = color.board;
		context.fillRect(board.x, board.y, board.width, board.height);
		
		// draw ball
		context.fillStyle = color.ball;
		context.beginPath();
		context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
		context.closePath();
		context.fill();
		
		blocks.draw();
		ball.draw();
		board.draw();
	}
}
