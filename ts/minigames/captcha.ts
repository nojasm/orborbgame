import { GameState } from "../GameManager.js";
import { MiniGame } from "../MiniGame.js";

export class CaptchaMiniGame extends MiniGame {
    lastMousePos: any = null;

    boxes: any[] = [];
    checked: boolean[] = [];

    maxTotalSize: number = 400;
    sideLength: number = 3;
    randomizeAgainAnimationTimer: number = 0.0;

    prepare() {
        this.sideLength = Math.floor(3 + 3 * this.difficultyFactor);
        this.maxTotalSize = 350 + this.sideLength * 30;

        while (true) {
            this.randomizeBoxes();
            if (!this.checkAllSelected()) break;
        }
    }

    randomizeBoxes() {
        this.boxes = [];
        this.checked = [];
        let yOffset: number = (this.maxTotalSize - 400) / 1.5;
        for (var y = 0; y < this.sideLength; y++) {
            for (var x = 0; x < this.sideLength; x++) {
                this.checked.push(false);
                let box = {
                    type: "?",
                    seed: 0,
                    x: this.w / 2 - this.maxTotalSize / 2 + (x * (1 / this.sideLength) * this.maxTotalSize),
                    y: this.h / 2 - this.maxTotalSize / 2 + (y * (1 / this.sideLength) * this.maxTotalSize) + yOffset,
                    w: (1 / this.sideLength) * this.maxTotalSize,
                    h: (1 / this.sideLength) * this.maxTotalSize
                };

                let r = Math.random();
                if (r > 0.85) box.type = "norb";
                else if (r > 0.6) box.type = "triangle";
                else if (r > 0.4) box.type = "cube";
                else box.type = "orb";

                box.seed = Math.random();
                
                this.boxes.push(box);
            }
        }
    }

    start() {
        super.start();
    }

    checkAllSelected(): boolean {
        return this.checked.every((checked: boolean, i: number) => {
            return (this.boxes[i].type === "orb") === checked;
        });
    }

    update(state: GameState, deltaTime: number) {
        if (!this.ctx) return;

        if (state == GameState.PREPARING) {
            this.randomizeAgainAnimationTimer -= deltaTime;
            if (this.randomizeAgainAnimationTimer <= 0) {
                this.randomizeAgainAnimationTimer = 0.05;
                this.randomizeBoxes();
            }
        }

        let allCorrectSelected = this.checkAllSelected();
        if (allCorrectSelected) {
            super.setFinish();
        }

        // Background
        this.ctx.fillStyle = "#eea";
        this.ctx.fillRect(0, 0, this.w, this.h);

        // Draw title
        this.ctx.font = "60px Arial Black";
        this.ctx.fillStyle = "black";
        this.ctx.fillText("SOLVE THE CAPTCHA", this.w / 2.0, 160);

        this.ctx.font = "35px Arial";
        this.ctx.fillStyle = "black";
        this.ctx.fillText("SELECT ALL ORBS", this.w / 2.0, 210);

        // Draw captcha background
        this.ctx.fillStyle = "#fff";
        let b = this.boxes[0];
        this.ctx.fillRect(b.x, b.y, this.maxTotalSize, this.maxTotalSize);

        // Draw captcha boxes
        for (var i = 0; i < this.boxes.length; i++) {
            let b = this.boxes[i];

            // Draw box type
            if (b.type === "norb") {
                this.ctx.beginPath();
                this.ctx.strokeStyle = "yellow";
                this.ctx.lineWidth = 5;
                this.ctx.fillStyle = "yellow";
                this.ctx.arc(b.x + b.w / 2, b.y + b.h / 2, 40, 0, 2 * Math.PI);
                if (b.seed > 0.5) this.ctx.fill();
                else this.ctx.stroke();
            } else if (b.type === "orb") {
                this.ctx.beginPath();
                this.ctx.fillStyle = b.seed > 0.5 ? "red" : "blue";
                this.ctx.arc(b.x + b.w / 2, b.y + b.h / 2, 20 + 20 * b.seed, 0, 2 * Math.PI);
                this.ctx.fill();
            } else if (b.type === "triangle") {
                this.ctx.beginPath();
                this.ctx.fillStyle = ["green", "blue", "red", "yellow", "pink", "magenta", "gray"][Math.floor(b.seed * 7)];
                this.ctx.moveTo(b.x + b.w / 2, b.y + 10);
                this.ctx.lineTo(b.x + b.w - 10, b.y + b.h - 10);
                this.ctx.lineTo(b.x + 10, b.y + b.h - 10);
                this.ctx.fill();
            } else if (b.type === "cube") {
                //this.ctx.beginPath();
                this.ctx.fillStyle = ["green", "blue", "red", "yellow", "pink", "magenta", "gray"][Math.floor(b.seed * 7)];
                let p = 10 + b.seed * 15;
                this.ctx.fillRect(b.x + p, b.y + p, b.w - 2 * p, b.h - 2 * p);
            }

            // Draw box border
            this.ctx.beginPath();
            this.ctx.rect(
                this.boxes[i].x,
                this.boxes[i].y,
                this.boxes[i].w,
                this.boxes[i].h,
            );

            this.ctx.lineWidth = 2;
            this.ctx.strokeStyle = "#a25";
            this.ctx.stroke();

            // Fill box if checked
            if (this.checked[i]) {
                this.ctx.fillStyle = "#a255";
                this.ctx.fillRect(this.boxes[i].x, this.boxes[i].y, this.boxes[i].w, this.boxes[i].h);
            }
        }
    }

    event(ev: Event) {
        if (ev.type == "click") {
            let mousePos: number[] = [(ev as MouseEvent).x, (ev as MouseEvent).y];

            if (this.state == GameState.RUNNING) {
                this.boxes.forEach((box, index) => {
                    if (mousePos[0] >= box.x && mousePos[0] < (box.x + box.w) && mousePos[1] >= box.y && mousePos[1] < (box.y + box.h)) {
                        // Click box
                        this.checked[index] = !this.checked[index];
                    }
                });
            }
        }
        
    }
}