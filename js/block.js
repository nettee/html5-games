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
	var X = 600;
	var Y = 480;

	var color = {
		background : "#d0c6bc",
		block : "#f67c5f",
		ball : '#cc9933',
		board : "#8f7a66",
	};

    function Point(x, y) {
        return {
            x : x,
            y : y,
            toString: function() {
                return '(' + x + ', ' + y + ')';
            },
        };
    }
	
	// objects
	
	var blocks = (function() {
		
		var rows = 6;
		var columns = 6;
		var height = 20;
		var xgap = 15;
		var ygap = 8;
		
		var width = (X - xgap * (columns + 1)) / columns;
		
		var o = new Array();
		
		for (var i = 0; i < rows; i++) {
			for (var j = 0; j < columns; j++) {
                var block = {
                    i : i,
                    j : j,
                    x : xgap + j * (xgap + width),
                    y : ygap + i * (ygap + height),
                    coord : function() {
                        return Point(this.i, this.j);
                    },
                    loc : function() {
                        return Point(this.x, this.y);
                    },
                };
                o.push(block);
			}
		}
		
		o.width = width;
		o.height = height;
		
		return o;
		
	}());

	
	var board = (function() {
		
		// The board's north west coordinate
		
		var width = 80;
		var height = 7;
		var speed = 2;
		
		return {
			width : width,
			height : height,
			speed : speed,
			x : X / 2 - width / 2,
			y : Y - 20,
			leftForce : false,
			rightForce : false,
			
			draw : function() {
				
			},
		};
	}());
	
	var ball = (function() {
		
		var radius = 9;
		var speed = 1;
	
		return {
			radius : radius,
			speed : speed,
			x : board.x + board.width / 2,
			y : board.y - radius,
			angle : Math.PI * 0.75, // start angle : northwest
			
			loc : function() {
                return Point(this.x, this.y);
			},

			draw : function() {
				
			},
		};
		
	}());
	
	var score = 0;

	var canvas = document.getElementById('main-canvas');
	var context = canvas.getContext('2d');
	
	// initialization
	
	canvas.width = X;
	canvas.height = Y;
	
	repaintAll();
	
	window.addEventListener('keydown', doKeyDown, true);
	window.addEventListener('keyup', doKeyUp, true);
	
	// game loop setting
	
	var ButtonText = { Start : 'Start', Pause : 'Pause', Resume : 'Resume', };
	
	var Status = { Begin : 'Begin', Running : 'Running', Suspend : 'Suspend', };
	var status = Status.Begin;
	
	var button = document.getElementById('gamebutton');
	button.onclick = function() {
		console.log('game button pressed');
		if (ball.dead) {
			document.getElementById('score').value = 0;
			window.location.reload();	
		} else if (status == Status.Begin || status == Status.Suspend) {
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
		window.setTimeout(gameLoop, 4);
        if (status == Status.Begin) {
            moveBoardStatically();
        } else if (status == Status.Running) {
			moveBall();
			moveBoard();
            checkRebound();
            checkCollision();
            checkStrike();
        }
        repaintAll();
	})(); // enter game
	
	function fadeOut() {
		// fade out
		context.globalAlpha = 0.8;
		context.fillStyle = '#aaaaaa';
		context.fillRect(0, 0, canvas.width, canvas.height);
		
		// show game over text
		context.globalAlpha = 1;
		context.fillStyle = color.block;
		context.textBaseline = 'middle';
		context.textAlign = 'center';
		
		context.font = '50px bold sans-serif';
		context.fillText('Game Over', canvas.width * 0.5, canvas.height * 0.5);
		context.font = '20px bold sans-serif';
		context.fillText('click New Game to restart', canvas.width * 0.5, canvas.height * 0.7);
		
	}	

	// functions
	
	var key = {
		left : 37,
		right : 39,
		space : 32,
	};
	
	function doKeyDown(e) {
		
		var keyCode = e.keyCode ? e.keyCode : e.which;

        if (keyCode == key.space) {
            // bugfix: enable space key whatever game status is.
            button.click();
        } else {

            if (status == Status.Suspend) {
                return;
            }

            if (keyCode == key.left) {
                board.leftForce = true;
            } else if (keyCode == key.right) {
                board.rightForce = true;
            }
        }
	}
	
	function doKeyUp(e) {
		board.leftForce = false;
		board.rightForce = false;
	}

	function pointString(point) {
		return '(' + point.x + ', ' + point.y + ')';
	}
	
	function moveBall() {
		ball.x += ball.speed * Math.cos(ball.angle);
		ball.y -= ball.speed * Math.sin(ball.angle);
	}
    
    function moveBoardStatically() {
        moveBoard();
        ball.x = board.x + board.width / 2;
    }

	
	function moveBoard() {
		if (board.leftForce && !board.rightForce) {
			moveBoardLeft();
		} else if (board.rightForce && !board.leftForce) {
			moveBoardRight();
		}
	}
	
	function moveBoardLeft() {
		board.x -= board.speed;
		if (board.x < 0) {
			board.x = 0;
		}
	}
	
	function moveBoardRight() {
		board.x += board.speed;
		if (board.x + board.width >= X) {
			board.x = X - board.width;
		}
	}

    function checkRebound() {
        if (ball.x - ball.radius < 0) {
            console.log('rebound on the left wall');
            ball.angle = Math.PI - ball.angle;
            ball.x = 2 * ball.radius - ball.x;
        } else if (ball.x + ball.radius >= X) {
            console.log('rebound on the right wall');
            ball.angle = Math.PI - ball.angle;
            ball.x = 2 * (X - ball.radius) - ball.x;
        } else if (ball.y - ball.radius < 0) {
            console.log('rebound on the top wall');
            ball.angle = -ball.angle;
            ball.y = 2 * ball.radius - ball.y;
        } 
    }

    function checkCollision() {
        for (block of blocks) {
            if (block.dead) {
                continue;
            }
            var hasCollision = checkCollision0(block);
            if (hasCollision) {
                break;
            }
        }
    }

    function checkCollision0(block) {

        function logCollision(block, direction, distance) {
            console.log('collide ' + block.coord().toString() 
                    + ' on the ' + direction);
            console.log('ball at ' + ball.loc().toString() 
                    + ', block at ' + block.loc().toString()
                    + ' -- ' + Point(block.x + blocks.width, block.y + blocks.height).toString()
                    + ', distance = ' + distance);
        }

        var hasCollision = false;
        if (Math.sin(ball.angle) < 0
                && ball.x >= block.x
                && ball.x <= block.x + blocks.width
                && Math.abs(ball.y - block.y) < ball.radius) {
            logCollision(block, 'north', ball.y - block.y);
            ball.angle = -ball.angle;
            ball.y = 2 * (block.y - ball.radius) - ball.y;
            block.dead = true;
            hasCollision = true;
        } else if (Math.sin(ball.angle) > 0
                && ball.x >= block.x
                && ball.x <= block.x + blocks.width
                && Math.abs(ball.y - (block.y + blocks.height)) < ball.radius) {
            logCollision(block, 'south', ball.y - (block.y + blocks.height));
            ball.angle = -ball.angle;
            ball.y = 2 * (block.y + blocks.height + ball.radius) - ball.y;
            block.dead = true;
            hasCollision = true;
        } else if (ball.y >= block.y
                && ball.y <= block.y + blocks.height
                && Math.abs(ball.x - block.x) < ball.radius) {
            logCollision(block, 'west', ball.x - block.x);
            ball.angle = Math.PI - ball.angle;
            ball.x = 2 * (block.x - ball.radius) - ball.x;
            block.dead = true;
            hasCollision = true;
        } else if (ball.y >= block.y
                && ball.y <= block.y + blocks.height
                && Math.abs(ball.x - (block.x + blocks.width)) < ball.radius) {
            logCollision(block, 'east', ball.x - (block.x + blocks.width));
            ball.angle = Math.PI - ball.angle;
            ball.x = 2 * (block.x + blocks.width + ball.radius) - ball.x;
            block.dead = true;
            hasCollision = true;
        }
        return hasCollision;
    }

    function checkStrike() {
        if (Math.sin(ball.angle) < 0 
                && ball.x >= board.x
                && ball.x <= board.x + board.width
                && ball.y + ball.radius > board.y) {
            console.log('strike the board');
            ball.angle = -ball.angle;
            ball.y = 2 * (board.y - ball.radius) - ball.y;
        } else if (Math.sin(ball.angle) < 0 && ball.y + ball.radius > Y) {
            console.log('game over');
            gameOver();
        }
    }

	function addScore() {
		score += speed;
		document.getElementById("score").innerText = score;
	}

	function gameOver() {
		status = Status.Suspend;
        ball.dead = true;
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
		
		// draw blocks
		context.fillStyle = color.block;
		for (var block of blocks) {
            if (block.dead) {
                continue;
            }
			context.fillRect(block.x, block.y, blocks.width, blocks.height);
		}
		
		// draw board
		context.fillStyle = color.board;
		context.fillRect(board.x, board.y, board.width, board.height);
		
		// draw ball
		context.fillStyle = color.ball;
		context.beginPath();
		context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
		context.closePath();
		context.fill();
		
	}
}
