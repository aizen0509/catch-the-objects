// OOP Game: Catch Falling Objects

// Game object demonstrating abstraction and encapsulation
class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.canvas.width = 600;
        this.canvas.height = 400;
        this.basket = new Basket(this.canvas);
        this.objects = [];
        this.score = 0;
        this.gameOver = false;
    }

    start() {
        this.spawnObject();
        this.update();
    }

    update() {
        if (!this.gameOver) {
            this.clear();
            this.basket.move();
            this.updateObjects();
            this.detectCollisions();
            this.drawScore();
            requestAnimationFrame(() => this.update());
        }
    }

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    spawnObject() {
        const newObject = new FallingObject(this.canvas);
        this.objects.push(newObject);
        setTimeout(() => this.spawnObject(), 2000);
    }

    updateObjects() {
        this.objects.forEach((obj, index) => {
            obj.update();
            if (obj.y > this.canvas.height) {
                this.objects.splice(index, 1);
            }
        });
    }

    detectCollisions() {
        this.objects.forEach((obj, index) => {
            if (this.basket.catch(obj)) {
                this.score++;
                this.objects.splice(index, 1);
            }
        });
    }

    drawScore() {
        this.context.fillStyle = 'black';
        this.context.font = '20px Arial';
        this.context.fillText(`Score: ${this.score}`, 10, 30);
    }
}

class Basket {
    constructor(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.width = 80;
        this.height = 20;
        this.x = canvas.width / 2 - this.width / 2;
        this.y = canvas.height - this.height - 10;
        this.speed = 5;
        this.direction = 0;
        this.setControls();
    }

    move() {
        this.x += this.direction * this.speed;
        if (this.x < 0) this.x = 0;
        if (this.x + this.width > this.canvas.width) this.x = this.canvas.width - this.width;
        this.draw();
    }

    draw() {
        this.context.fillStyle = 'blue';
        this.context.fillRect(this.x, this.y, this.width, this.height);
    }

    catch(obj) {
        return obj.y + obj.size > this.y && obj.x > this.x && obj.x < this.x + this.width;
    }

    setControls() {
        window.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.direction = -1;
            if (e.key === 'ArrowRight') this.direction = 1;
        });
        window.addEventListener('keyup', () => this.direction = 0);
    }
}

class FallingObject {
    constructor(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.size = 20;
        this.x = Math.random() * (canvas.width - this.size);
        this.y = 0;
        this.speed = 2 + Math.random() * 3;
    }

    update() {
        this.y += this.speed;
        this.draw();
    }

    draw() {
        this.context.fillStyle = 'red';
        this.context.beginPath();
        this.context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        this.context.fill();
    }
}

const canvas = document.getElementById('gameCanvas');
const game = new Game(canvas);
game.start();
