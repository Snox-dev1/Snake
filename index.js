// Constants
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const speedElement = document.getElementById("speed");
const playElement = document.getElementById("play");
const restartElement = document.getElementById("restart");
const cellSize = 20;
const gameSpeedRange = 0.5;
const maxTrailLength = 5;
const bonusChance = 0.9;
const bonusDuration = 10;
let baseGameSpeed = 200;
const bonuses = [];
const bonusElement = document.getElementById("bonus");
const bonusListElement = document.getElementById("bonus-list");

// Variables
let direction = "right";
let snake = [{ x: 100, y: 100 }];
let isPlaying = false;
let score = 0;
let gameSpeed = baseGameSpeed;
let appleHue = 0;
let phantom = false;
let immortal = false;
let activeBonuses = [];
let foods = [];
let StrokeSnake = "rgb(0, 255, 73)";

// Bonuses
const bonusList = [
	{
		name: "Festin",
		color: "orange",
		description:
			"Fait apparaître de la nourriture supplémentaire sur la carte",
		duration: 10,
		effect: function () {
			const feastInterval = setInterval(generateExtraFood, 1500);
			setTimeout(function () {
				clearInterval(feastInterval);
			}, this.duration * 1000);
		},
	},
	// {
	// 	name: "Fantôme",
	// 	description: "Vous permet de traverser les murs pendant 120 secondes",
	// 	once: true,
	// 	color: "blue",
	// 	duration: 120,
	// 	effect: function () {
	// 		phantom = true;
	// 		setTimeout(function () {
	// 			phantom = false;
	// 		}, this.duration * 1000);
	// 	},
	// },
	// {
	// 	name: "Ralentissement",
	// 	color: "blue",
	// 	description: "Votre vitesse est réduite",
	// 	effect: function () {
	// 		baseGameSpeed = baseGameSpeed + (baseGameSpeed * 1) / 100;
	// 	},
	// },
	// {
	// 	name: "Accélération",
	// 	color: "red",
	// 	description: "Votre vitesse est augmentée",
	// 	effect: function () {
	// 		baseGameSpeed = baseGameSpeed - (baseGameSpeed * 1) / 100;
	// 	},
	// },
	// {
	// 	name: "Bonus Chance",
	// 	color: "yellow",
	// 	description: "Augmente vos chances d'avoir un bonus",
	// 	effect: function () {
	// 		bonusChance = bonusChance + (bonusChance * 5) / 100;
	// 	},
	// },
	// {
	// 	name: "Inversion",
	// 	color: "purple",
	// 	description: "Inverse la direction du serpent pendant 10 secondes",
	// 	duration: 10,
	// 	effect: function () {
	// 		const directions = ["up", "down", "left", "right"];
	// 		const currentDirectionIndex = directions.indexOf(direction);
	// 		const oppositeDirectionIndex =
	// 			(currentDirectionIndex + 2) % directions.length;
	// 		direction = directions[oppositeDirectionIndex];
	// 	},
	// },
	// {
	// 	name: "Les Yeux Bandés",
	// 	color: "black",
	// 	description: "Brouille le canvas du jeu pendant 10 secondes",
	// 	duration: 20,
	// 	effect: function () {
	// 		// crée une div sur le canvas
	// 	},
	// },
	// {
	// 	name: "Téléportation",
	// 	color: "cyan",
	// 	description:
	// 		"Permet au serpent de se téléporter à un emplacement aléatoire sur le plateau",
	// 	effect: function () {
	// 		const newX =
	// 			Math.floor(Math.random() * (canvas.width / cellSize)) *
	// 			cellSize;
	// 		const newY =
	// 			Math.floor(Math.random() * (canvas.height / cellSize)) *
	// 			cellSize;
	// 		snake[0] = { x: newX, y: newY };
	// 	},
	// },
	// {
	// 	name: "Arrêt du Temps",
	// 	color: "gray",
	// 	description: "Immobilise tout mouvement pendant 5 secondes",
	// 	duration: 5,
	// 	effect: function () {
	// 		isPlaying = false;
	// 		setTimeout(function () {
	// 			isPlaying = true;
	// 		}, this.duration * 1000);
	// 	},
	// },
	// {
	// 	name: "Points Doublés",
	// 	color: "gold",
	// 	description:
	// 		"Double les points obtenus en mangeant pendant 60 secondes",
	// 	once: true,
	// 	duration: 60,
	// 	effect: function () {
	// 		score += 10;
	// 	},
	// },
	// {
	// 	name: "Super Vitesse",
	// 	color: "orange",
	// 	description: "Vous êtes très rapide pendant 10 secondes",
	// 	duration: 10,
	// 	effect: function () {
	// 		baseGameSpeed = Math.floor(baseGameSpeed / 2); // Vitesse doublée

	// 		setTimeout(function () {
	// 			baseGameSpeed = Math.floor(baseGameSpeed * 2); // Revenir à la vitesse normale
	// 		}, this.duration * 1000);
	// 	},
	// },
	// {
	// 	name: "Invincibilité",
	// 	color: "purple",
	// 	description: "Vous êtes invincible pendant 10 secondes",
	// 	duration: 10,
	// 	effect: function () {
	// 		immortal = true; // Capacité de traverser les murs
	// 		StrokeSnake = "rgb(0, 255, 255)";
	// 		setTimeout(function () {
	// 			immortal = false; // Revenir à la normale
	// 			StrokeSnake = "rgb(0, 255, 73)";
	// 		}, this.duration * 1000);
	// 	},
	// },
	// {
	// 	name: "Croissance Instantanée",
	// 	color: "green",
	// 	description: "Vous grandissez instantanément de 5 cellules",
	// 	effect: function () {
	// 		for (let i = 0; i < 5; i++) {
	// 			snake.push({
	// 				x: snake[snake.length - 1].x,
	// 				y: snake[snake.length - 1].y,
	// 			});
	// 		}
	// 	},
	// },
	{
		name: "Mini-Serpent",
		color: "pink",
		description: "Vous rétrécissez en un mini-serpent pendant 30 secondes",
		duration: 30,
		effect: function () {
			const currentLength = snake.length;
			if (currentLength > 5) {
				snake.splice(5, currentLength - 5); // Réduire le serpent à 5 cellules
			}

			setTimeout(function () {
				console.log(snake.length, currentLength);
				while (snake.length < currentLength) {
					// Si le serpent a été rétréci
					snake.push({
						x: snake[snake.length - 1].x,
						y: snake[snake.length - 1].y,
					});
				}
			}, this.duration * 1000);
		},
	},
	{
		name: "Attraction Magnétique",
		color: "yellow",
		description: "La nourriture est attirée vers vous pendant 10 secondes",
		duration: 10,
		effect: function () {
			// Changer la position de la nourriture vers le serpent

			const magnete = setInterval(function () {
				const head = snake[0];
				// magnétiser la nourriture vers la tête du serpent
				foods.forEach((food, index) => {
					if (head.x < food.x) {
						food.x -= cellSize;
					} else if (head.x > food.x) {
						food.x += cellSize;
					}
					if (head.y < food.y) {
						food.y -= cellSize;
					} else if (head.y > food.y) {
						food.y += cellSize;
					}
				});
			}, 500);

			setTimeout(function () {
				clearInterval(magnete);
			}, this.duration * 1000);
		},
	},
	{
		name: "Double Chance de Bonus",
		color: "gold",
		description:
			"Vos chances d'avoir un bonus sont doublées pendant 10 secondes",
		duration: 10,
		effect: function () {
			bonusChance *= 2;

			setTimeout(function () {
				bonusChance /= 2;
			}, this.duration * 1000);
		},
	},
];

// Event listeners
document.addEventListener("keydown", function (event) {
	switch (event.key) {
		case "ArrowUp":
			if (direction !== "down") direction = "up";
			break;
		case "ArrowDown":
			if (direction !== "up") direction = "down";
			break;
		case "ArrowLeft":
			if (direction !== "right") direction = "left";
			break;
		case "ArrowRight":
			if (direction !== "left") direction = "right";
			break;
	}
});

// Helper functions
function getRandomPosition() {
	let x, y;
	do {
		x = Math.floor(Math.random() * (canvas.width / cellSize)) * cellSize;
		y = Math.floor(Math.random() * (canvas.height / cellSize)) * cellSize;
	} while (isPositionOccupied(x, y));
	return { x, y };
}

function isPositionOccupied(x, y) {
	return (
		snake.some((cell) => cell.x === x && cell.y === y) ||
		bonuses.some((bonus) => bonus.x === x && bonus.y === y) ||
		foods.some((food) => food.x === x && food.y === y)
	);
}
function generateExtraFood() {
	const { x, y } = getRandomPosition();
	foods.push({ x, y }); // Add this line to draw the additional food items
}
function generateFood() {
	const { x, y } = getRandomPosition();

	foods.push({ x, y });
}

function generateBonus() {
	const { x, y } = getRandomPosition();
	bonuses.push({ x: x, y: y });
}

// Fonction pour afficher les bonus sur la carte
function drawBonuses() {
	bonuses.forEach((bonus) => {
		const { x, y } = bonus;
		ctx.strokeStyle = "rgb(0, 255, 195)";
		ctx.fillStyle = "rgba(0, 255, 195, 0.2)";
		ctx.shadowColor = "rgb(0, 255, 195)";
		ctx.shadowBlur = 15;
		ctx.shadowOffsetX = 0;
		ctx.shadowOffsetY = 0;
		ctx.beginPath();
		ctx.roundRect(x, y, cellSize, cellSize, 1.2);
		ctx.stroke();
		ctx.fill();
	});
}

// Fonction pour dessiner le serpent
function drawSnake() {
	snake.forEach((cell, index) => {
		const alpha = 1 - index / snake.length;
		const rgbaColor = `rgba(0, 255, 73, ${alpha})`;
		ctx.strokeStyle = "rgb(0, 255, 73)";

		ctx.fillStyle = rgbaColor;
		ctx.shadowColor = rgbaColor;
		ctx.shadowBlur = 15;
		ctx.shadowOffsetX = 0;
		ctx.shadowOffsetY = 0;

		ctx.beginPath();
		ctx.roundRect(cell.x, cell.y, cellSize, cellSize, 1.2);
		ctx.stroke();
		ctx.fill();
	});
}

// Fonction pour dessiner la nourriture
function drawFood() {
	foods.forEach((food) => {
		const appleColor = `rgba(0, 148, 50,0.2)`;
		const appleStroke = `#009432`;

		ctx.fillStyle = appleColor;
		ctx.strokeStyle = appleStroke;
		ctx.shadowColor = appleStroke;
		ctx.shadowBlur = 25;
		ctx.shadowOffsetX = 0;
		ctx.shadowOffsetY = 0;
		ctx.beginPath();
		ctx.roundRect(food.x, food.y, cellSize, cellSize, 1.2);
		ctx.stroke();
		ctx.fill();
	});
}

function checkCollisionsWithFood() {
	const head = snake[0];
	foods.forEach((food, index) => {
		if (head.x === food.x && head.y === food.y) {
			const pointsDoubleBonus = activeBonuses.find(
				(bonus) => bonus.name === "Points Doublés"
			);

			if (pointsDoubleBonus) {
				pointsDoubleBonus.effect();
			}
			foods.splice(index, 1);
			score += 10;
			document.getElementById("score").textContent = score;
			if (foods.length === 0) {
				generateFood();
			}
			if (Math.random() < bonusChance) {
				generateBonus();
			}
		} else {
			snake.pop(); // Remove the tail cell only when not colliding with food
		}
	});
}

function checkCollisionsWithBonuses() {
	const head = snake[0];
	bonuses.forEach((bonus, index) => {
		if (head.x === bonus.x && head.y === bonus.y) {
			bonuses.splice(index, 1); // Supprimer le bonus du tableau

			// Mettre le jeu en pause
			isPlaying = false;

			// Proposer un choix de 3 bonus aléatoires
			const randomBonus = [];

			for (let i = 0; i < 3; i++) {
				const randomIndex = Math.floor(
					Math.random() * bonusList.length
				);
				const randomBonuses = bonusList[randomIndex];
				if (randomBonuses.once) {
					if (activeBonuses.includes(randomBonuses)) {
						i--;
						continue;
					}
				}

				// si le bonus est déja dans la liste des bonus actifs, on recommence

				if (randomBonus.includes(randomBonuses)) {
					i--;
					continue;
				}

				randomBonus.push(randomBonuses);
			}

			// Afficher les 3 bonus
			const bonusElement = document.getElementById("bonus");
			bonusElement.classList.remove("hidden");

			const bonusListElement = document.getElementById("bonus-list");
			bonusListElement.innerHTML = "";

			randomBonus.forEach((bonus) => {
				const bonusElementItems = document.createElement("div");
				bonusElementItems.classList.add("bonus-item");
				bonusElementItems.innerHTML = `

				<div class="bonus-name">${bonus.name}</div>
					<div class="bonus-icon">
						<img src="http://via.placeholder.com/150" alt="bonus" />
					</div>
					<div class="bonus-description">${bonus.description}</div>

				
				`;
				// bonusElementItems.style.backgroundColor = bonus.color;

				bonusElementItems.addEventListener("click", function () {
					bonus.effect();
					bonusElement.classList.add("hidden");
					isPlaying = true;
					update();
					// add to active bonuses
					activeBonuses.push(bonus);
				});

				bonusListElement.appendChild(bonusElementItems);
			});
		}
	});
}

// Fonction pour mettre à jour le jeu à chaque frame
function update() {
	if (!isPlaying) return;
	// Déplacer le serpent
	const head = { x: snake[0].x, y: snake[0].y };
	switch (direction) {
		case "up":
			head.y -= cellSize;
			break;
		case "down":
			head.y += cellSize;
			break;
		case "left":
			head.x -= cellSize;
			break;
		case "right":
			head.x += cellSize;
			break;
	}
	if (phantom) {
		if (head.x < 0) {
			// Si le serpent atteint un bord, le faire réapparaître de l'autre côté
			head.x = canvas.width - cellSize;
		} else if (head.x >= canvas.width) {
			head.x = 0;
		}
		if (head.y < 0) {
			head.y = canvas.height - cellSize;
		} else if (head.y >= canvas.height) {
			head.y = 0;
		}
	} else if (
		head.x < 0 ||
		head.y < 0 ||
		head.x >= canvas.width ||
		head.y >= canvas.height
	) {
		gameOver();
		return;
	}

	// Vérifier s'il a mangé la nourriture
	checkCollisionsWithBonuses();

	checkCollisionsWithFood();

	snake.unshift(head);

	for (let i = 1; i < snake.length; i++) {
		if (head.x === snake[i].x && head.y === snake[i].y) {
			gameOver();
			return;
		}
	}
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawBonuses();
	drawSnake();
	drawFood();
	const snakeLength = snake.length;

	// prend en compte la variable gameSpeed deja existante
	gameSpeed = Math.floor(
		Math.max(50, baseGameSpeed - snakeLength * gameSpeedRange)
	);

	speedElement.textContent = gameSpeed;

	setTimeout(update, gameSpeed);
}

function showGameOverScreen() {
	restartElement.classList.remove("hidden");
	ctx.fillStyle = "rgba(0, 0, 0, 0.7)"; // Fond semi-transparent
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	ctx.fillStyle = "white";
	ctx.font = "40px Arial";
	ctx.textAlign = "center";
	ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2 - 150);
	ctx.fillText(
		"Your score: " + score,
		canvas.width / 2,
		canvas.height / 2 - 100
	);

	ctx.font = "20px Arial";
	ctx.fillText(
		'Press "Restart" to play again',
		canvas.width / 2,
		canvas.height / 2 - 50
	);
}
function animateDeath(index) {
	if (index >= snake.length) {
		canvas.classList.add("game-over");
		showGameOverScreen();
		return;
	}

	if (index % 2 === 0) {
		canvas.classList.add("game-over");
	} else {
		canvas.classList.remove("game-over");
	}

	const cell = snake[index];
	ctx.clearRect(cell.x, cell.y, cellSize, cellSize);

	ctx.strokeStyle = "rgb(255, 0, 73)";
	ctx.fillStyle = "rgba(255, 0, 73, 0.2)";
	ctx.shadowColor = "rgb(255, 0, 73)";
	ctx.shadowBlur = 10;
	ctx.shadowOffsetX = 0;
	ctx.shadowOffsetY = 0;

	ctx.beginPath();
	ctx.roundRect(cell.x, cell.y, cellSize, cellSize, 1.2);
	ctx.stroke();
	ctx.fill();
	setTimeout(function () {
		animateDeath(index + 1);
	}, 50); // Délai de 50 millisecondes entre chaque étape d'animation
}

function gameOver() {
	isPlaying = false;

	animateDeath(0); // Commencer l'animation de mort du serpent
}
function play() {
	if (!isPlaying) {
		isPlaying = true;
		direction = "right";
		playElement.classList.add("hidden");
		snake = [{ x: 100, y: 100 }];
		activeBonuses = [];
		foods = [];
		generateFood();
		score = 0;
		document.getElementById("score").textContent = score;
		update();
	}
}

function restart() {
	restartElement.classList.add("hidden");
	playElement.classList.remove("hidden");
	canvas.classList.remove("game-over");
	isPlaying = false;
	snake = [{ x: 100, y: 100 }];
	direction = "right";
	score = 0;
	document.getElementById("score").textContent = score;
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawSnake();
	generateFood();
}
