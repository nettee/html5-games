window.onload = canvasApp;

function canvasSupport() {
	return !!document.createElement('canvas').getContext;
}

function canvasApp() {
	
	if (!canvasSupport) {
		alert('Your browser does not support HTML5 Canvas!');
		return;
	}
	
	// constants
	
	var X = 10;
	var Y = 18;
	
	var Color = {
			background : "#d0c6bc",
			square : "#8f7a66",
	};
	
	var Shapes = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];

	Shapes.Colors = {
		'I' : '#00aacc',
		'J' : '#0000cc',
		'L' : '#cc7500',
		'O' : '#aaaa00',
		'S' : '#60aa00',
		'T' : '#800080',
		'Z' : '#cc0000',
		
	};

	Shapes.Offsets = {
		'I' : [Point(0, 0), Point(1, 0), Point(2, 0), Point(3, 0)],
		'J' : [Point(0, 0), Point(1, 0), Point(2, 0), Point(2, 1)],
		'L' : [Point(0, 0), Point(1, 0), Point(2, 0), Point(0, 1)],
		'O' : [Point(1, 0), Point(2, 0), Point(1, 1), Point(2, 1)],
		'S' : [Point(1, 0), Point(2, 0), Point(0, 1), Point(1, 1)],
		'T' : [Point(0, 0), Point(1, 0), Point(2, 0), Point(1, 1)],
		'Z' : [Point(0, 0), Point(1, 0), Point(1, 1), Point(2, 1)],
	};

	Shapes.RotatedOffsets = {
		'I' : {
			0 : [Point(0, 0), Point(1, 0), Point(2, 0), Point(3, 0)],
			1 : [Point(1, 0), Point(1, 1), Point(1, 2), Point(1, 3)],
			2 : [Point(0, 0), Point(1, 0), Point(2, 0), Point(3, 0)],
			3 : [Point(1, 0), Point(1, 1), Point(1, 2), Point(1, 3)],
		},
		'J' : {
			0 : [Point(0, 0), Point(1, 0), Point(2, 0), Point(2, 1)],
			1 : [Point(1, 0), Point(2, 0), Point(1, 1), Point(1, 2)],
			2 : [Point(0, 0), Point(0, 1), Point(1, 1), Point(2, 1)],
			3 : [Point(0, 2), Point(1, 2), Point(1, 1), Point(1, 0)],
		},
		'L' : {
			0 : [Point(0, 0), Point(1, 0), Point(2, 0), Point(0, 1)],
			1 : [Point(1, 0), Point(1, 1), Point(1, 2), Point(2, 2)],
			2 : [Point(0, 1), Point(1, 1), Point(2, 1), Point(2, 0)],
			3 : [Point(0, 0), Point(1, 0), Point(1, 1), Point(1, 2)],
		},
		'O' : {
			0 : [Point(1, 0), Point(2, 0), Point(1, 1), Point(2, 1)],
			1 : [Point(1, 0), Point(2, 0), Point(1, 1), Point(2, 1)],
			2 : [Point(1, 0), Point(2, 0), Point(1, 1), Point(2, 1)],
			3 : [Point(1, 0), Point(2, 0), Point(1, 1), Point(2, 1)],
		},
		'S' : {
			0 : [Point(1, 0), Point(2, 0), Point(0, 1), Point(1, 1)],
			1 : [Point(1, 0), Point(1, 1), Point(2, 1), Point(2, 2)],
			2 : [Point(1, 0), Point(2, 0), Point(0, 1), Point(1, 1)],
			3 : [Point(1, 0), Point(1, 1), Point(2, 1), Point(2, 2)],
		},
		'T' : {
			0 : [Point(0, 0), Point(1, 0), Point(2, 0), Point(1, 1)],
			1 : [Point(1, 0), Point(1, 1), Point(1, 2), Point(2, 1)],
			2 : [Point(1, 0), Point(0, 1), Point(1, 1), Point(2, 1)],
			3 : [Point(0, 1), Point(1, 0), Point(1, 1), Point(1, 2)],
		},
		'Z' : {
			0 : [Point(0, 0), Point(1, 0), Point(1, 1), Point(2, 1)],
			1 : [Point(2, 0), Point(2, 1), Point(1, 1), Point(1, 2)],
			2 : [Point(0, 0), Point(1, 0), Point(1, 1), Point(2, 1)],
			3 : [Point(2, 0), Point(2, 1), Point(1, 1), Point(1, 2)],
		},
	};

	Shapes.Bounds = {
		'I' : {
			0 : {left : 0, right : 3, top : 0, bottom : 0},
			1 : {left : 1, right : 1, top : 0, bottom : 3},
			2 : {left : 0, right : 3, top : 0, bottom : 0},
			3 : {left : 1, right : 1, top : 0, bottom : 3},
		},
		'J' : {
			0 : {left : 0, right : 2, top : 0, bottom : 1},
			1 : {left : 1, right : 2, top : 0, bottom : 2},
			2 : {left : 0, right : 2, top : 0, bottom : 1},
			3 : {left : 0, right : 1, top : 0, bottom : 2},
		},                                  
		'L' : {
			0 : {left : 0, right : 2, top : 0, bottom : 1},
			1 : {left : 1, right : 2, top : 0, bottom : 2},
			2 : {left : 0, right : 2, top : 0, bottom : 1},
			3 : {left : 0, right : 1, top : 0, bottom : 2},
		},
		'O' : {
			0 : {left : 1, right : 2, top : 0, bottom : 1},
			1 : {left : 1, right : 2, top : 0, bottom : 1},
			2 : {left : 1, right : 2, top : 0, bottom : 1},
			3 : {left : 1, right : 2, top : 0, bottom : 1},
		},
		'S' : {
			0 : {left : 0, right : 2, top : 0, bottom : 1},
			1 : {left : 1, right : 2, top : 0, bottom : 2},
			2 : {left : 0, right : 2, top : 0, bottom : 1},
			3 : {left : 1, right : 2, top : 0, bottom : 2},
		},
		'T' : {
			0 : {left : 0, right : 2, top : 0, bottom : 1},
			1 : {left : 1, right : 2, top : 0, bottom : 2},
			2 : {left : 0, right : 2, top : 0, bottom : 1},
			3 : {left : 0, right : 1, top : 0, bottom : 2},
		},
		'Z' : {
			0 : {left : 0, right : 2, top : 0, bottom : 1},
			1 : {left : 1, right : 2, top : 0, bottom : 2},
			2 : {left : 0, right : 2, top : 0, bottom : 1},
			3 : {left : 1, right : 2, top : 0, bottom : 2},
		},
	};
	
	Shapes.random = function() {
		
		function rand(lower, upper) {
			return Math.floor(lower + Math.random() * (upper - lower));
		}
		
		var rnd = rand(0, Shapes.length);
		return Shapes[rnd];
	}
	
	var Key = {
			32 : 'space',
			37 : 'left',
			38 : 'up',
			39 : 'right',
			40 : 'down',
			65 : 'a',
			68 : 'd',
			80 : 'p',
			83 : 's',
			87 : 'w',
	};

	var KeyAction = {
			'left' : moveLeft,
			'a' : moveLeft,
			'right' : moveRight,
			'd' : moveRight,
			'up' : rotate,
			'w' : rotate,
			'down' : moveDown,
			's' : moveDown,
			'p' : pause,
			'space' : pause,
	};

	
	// objects
	
	var dataElements = {
			level : document.getElementById('level'),
			lines : document.getElementById('lines'),
			score : document.getElementById('score'),
	};

	var data = {
			level : 1,
			lines : 0,
			score : 0,
	};
	
	var tetris = {
			nextShape : Shapes.random(),
			current : {
				shape : Shapes.random(),
				angle : 0,
				position : Point(3, 0),
			},
			ruins : function() {
				var ruins = new Array();
				for (var r = 0; r < Y; r++) {
					ruins[r] = new Array();
					for (var c = 0; c < X; c++) {
						ruins[r][c] = {
							exist : false,
							color : undefined,
						}; 
					}
				}
				return ruins;
			}(),
	};
	
	// functions
	
	function Point(x, y) {
		return {
			x : x,
			y : y,
			str : '(' + x + ', ' + y + ')',
		};
	}
	
	function addLines(incr) {
		console.log('addLines(' + incr + ')');
		data.lines += incr;
		dataElements.lines.innerHTML = data.lines;
		
		var scoreTable = {0 : 0, 1 : 10, 2 : 30, 3 : 60, 4 : 100};
		data.score += scoreTable[incr];
		dataElements.score.innerHTML = data.score;
	}
	
	function rotate() {
		
		function changeAngle() {
			if (tetris.current.angle == 3) {
				tetris.current.angle = 0;
			} else {
				tetris.current.angle += 1;
			}
		}
		
		console.log('rotate');
		
		changeAngle();
		
		if (isValid()) {
			return;
		}
		
		for (var x = 1; x <= 2; x++) {
			var left = {x : -x, y : 0};
			if (isValidMove(left)) {
				move(left);
				return;
			}
			var right = {x : x, y : 0};
			if (isValidMove(right)) {
				move(right);
				return;
			}
		}
		
		if (isValid()) {
			console.log('bad rotate, adjusted');
			return;
		} else {
			console.log('bad rotate, refused');
			changeAngle();
			changeAngle();
			changeAngle();
		}
	}
	
	function isValidMove(m) {
		var p = tetris.current.position;
		var offsets = Shapes.RotatedOffsets[tetris.current.shape][tetris.current.angle];
		for (i in offsets) {
			var o = offsets[i];
			var r = p.y + o.y + m.y;
			var c = p.x + o.x + m.x;
			if (r < 0 || r >= Y) {
				return false;
			}
			if (c < 0 || c >= X) {
				return false;
			}
			if (tetris.ruins[r][c].exist) {
				return false;
			}
		}
		return true;
	}
	
	function isValid() {
		return isValidMove({x : 0, y : 0});
	}
	
	function move(m) {
		var p = tetris.current.position;
		tetris.current.position = Point(p.x + m.x, p.y + m.y);
	}
	
	function moveLeft() {
		console.log('move left');
		
		var m = {x : -1, y : 0};
		if (isValidMove(m)) {
			move(m);
		}
	}
	
	function moveRight() {
		console.log('move right');
		
		var m = {x : 1, y : 0};
		if (isValidMove(m)) {
			move(m);
		}
	}
	
	function moveDown() {
		
		function solidify() {
			console.log('sodify');
			var p = tetris.current.position;
			var color = Shapes.Colors[tetris.current.shape];
			var offsets = Shapes.RotatedOffsets[tetris.current.shape][tetris.current.angle];
			for (i in offsets) {
				var o = offsets[i];
				var r = p.y + o.y;
				var c = p.x + o.x;
				tetris.ruins[r][c] = {
						exist : true,
						color : color,
				};
			}
		}
		
		function clearRuins() {
			
			function isFull(line) {
				for (var i = 0; i < X; i++) {
					if (!line[i].exist) {
						return false;
					}
				}
				return true;
			}
			
			var newRuins = new Array();
			var j = Y - 1;
			var fullLineCount = 0;
			for (var r = Y - 1; r >= 0; r--) {
				if (isFull(tetris.ruins[r])) {
					console.log('isFull: line ' + r);
					fullLineCount += 1;
				} else {
					newRuins[j] = tetris.ruins[r];
					j--;
				}
			}
			
			if (fullLineCount > 0) {
				addLines(fullLineCount);
			}
			
			while (j >= 0) {
				newRuins[j] = new Array();
				for (var c = 0; c < X; c++) {
					newRuins[j][c] = {
							exist : false,
							color : undefined,
					};
				}
				j--;
			}
			
			tetris.ruins = newRuins;
			
		}
		
		console.log('move down');
		var p = tetris.current.position;
		
		var m = {x : 0, y : 1};
		if (isValidMove(m)) {
			move(m);
		} else {
			if (p.y <= 0) {
				gameOver();
				return;
			}
			solidify();
			clearRuins();
			tetris.current = {
					shape : tetris.nextShape,
					angle : 0,
					position : Point(3, 0),
			};
			tetris.nextShape = Shapes.random();
		}
	}
	
	function repaintAll() {
		
		console.log('repaintAll');
		
		var squareSize = 24;
		
		function repaintMainCanvas(tetris) {
			var canvas = document.getElementById('maincanvas');
			var context = canvas.getContext('2d');
			
			function drawSquare(position, offset, color) {
				context.fillStyle = color;
				context.fillRect((position.x + offset.x) * squareSize, 
						(position.y + offset.y) * squareSize, 
						squareSize - 1, 
						squareSize - 1);
			}
			
			function repaintRuins(ruins) {
				for (var r = 0; r < Y; r++) {
					for (var c = 0; c < X; c++) {
						var ruin = ruins[r][c];
						if (ruin.exist) {
							drawSquare({x : c, y : r}, {x : 0, y : 0}, ruin.color);
						} else {
							drawSquare({x : c, y : r}, {x : 0, y : 0}, Color.background);
						}
					}
				}
			}
			
			function repaintCurrent(current) {
				var color = Shapes.Colors[current.shape];
				var offsets = Shapes.RotatedOffsets[current.shape][current.angle];
				for (i in offsets) {
					var offset = offsets[i];
					drawSquare(current.position, offset, color);
				}
			}
			
			// clear all contents
			context.clearRect(0, 0, canvas.width, canvas.height);
			
			// draw background color
			context.fillStyle = Color.background;
			context.fillRect(0, 0, canvas.width, canvas.height);
			
			// draw contents
			repaintRuins(tetris.ruins);
			repaintCurrent(tetris.current);
		}
		
		function repaintNextCanvas(nextShape) {
			var canvas = document.getElementById('nextcanvas');
			var context = canvas.getContext('2d');
			
			function drawSquare(margin, offset, color) {
				context.fillStyle = color;
				context.fillRect(margin.x + offset.x * squareSize, 
						margin.y + offset.y * squareSize, 
						squareSize - 1, 
						squareSize - 1);
			}
			
			// clear all contents
			context.clearRect(0, 0, canvas.width, canvas.height);
			
			// draw background color
			context.fillStyle = Color.background;
			context.fillRect(0, 0, canvas.width, canvas.height);
			
			// draw next shape
			var color = Shapes.Colors[nextShape];
			var margin = {x : 36, y : 24};
			var margin = function() {
				var bounds = Shapes.Bounds[nextShape][0];
				var x = canvas.width / 2 
						- (bounds.right + bounds.left + 1) / 2 * squareSize;
				var y = canvas.height / 2
						- (bounds.top + bounds.bottom + 1) / 2 * squareSize;
				return {
					x : x,
					y : y,
				};
			}();
			var offsets = Shapes.Offsets[nextShape];
			for (i in offsets) {
				var offset = offsets[i];
				drawSquare(margin, offset, color);
			}
		}
		
		repaintMainCanvas(tetris);
		repaintNextCanvas(tetris.nextShape);
	}
	
	// initialization
	
	data.level = Number(dataElements.level.innerHTML);
	data.lines = Number(dataElements.lines.innerHTML);
	data.score = Number(dataElements.score.innerHTML);
	console.log('level = ' + data.level);
	console.log('lines = ' + data.lines);
	console.log('score = ' + data.score);
	
	repaintAll(tetris);
	
	// game status setting
	
	var Status = { End : 'End', Running : 'Running', Suspend : 'Suspend', };
	var status = Status.Running;
	
	window.addEventListener('keydown', function(e) {
		var keyCode = e.keyCode ? e.keyCode : e.which;
		var key = Key[keyCode];
		if (key in KeyAction) {
			KeyAction[key]();
			if (status == Status.Running) {
				repaintAll(tetris);
			}
		}
	});
	
	// game loop setting
	
	var ButtonText = { Start : 'Start', Pause : 'Pause', Resume : 'Resume', };
	
	var pauseButton = document.getElementById('pauseButton');
	pauseButton.onclick = function() {
		console.log('pause button pressed');
		console.log(status);
		if (status == Status.Running) {
			pauseButton.innerHTML = ButtonText.Resume;
			status = Status.Suspend;
			console.log(status);
		} else if (status == Status.Suspend) {
			pauseButton.innerHTML = ButtonText.Pause;
			status = Status.Running;
		}
	}
	
	function pause() {
		pauseButton.click();
		fadeOut('Paused');
	}
	
	function gameOver() {
		pauseButton.click();
		fadeOut('Game Over');
	}
	
	function fadeOut(text) {
		
		var canvas = document.getElementById('maincanvas');
		var context = canvas.getContext('2d');
		
		context.globalAlpha = 0.4;
		context.fillStyle = '#aaaaaa';
		context.fillRect(0, 0, canvas.width, canvas.height);
		
		// show text
		context.globalAlpha = 1;
		context.fillStyle = Color.square;
		context.textBaseline = 'middle';
		context.textAlign = 'center';
		
		context.font = '40px sans-serif';
		context.fillText(text, canvas.width * 0.5, canvas.height * 0.5);
	}
	
	function gameLoop() {
		var speed = data.level;
		var timeInterval = 600 / speed;
		console.log('timeInterval = ' + timeInterval);
		window.setTimeout(gameLoop, timeInterval);
		
		if (status == Status.Running) {
			moveDown();
		}
		if (status == Status.Running) {
			repaintAll();
		}
	}
	
	gameLoop();
	
}