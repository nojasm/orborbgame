import { GameState } from "../GameManager.js";
import { MiniGame } from "../MiniGame.js";
export class SlingShotMiniGame extends MiniGame {
    constructor() {
        super(...arguments);
        this.lastMousePos = null;
        this.hasClicked = false;
        this.orbs = [];
        this.bullets = [];
        this.norbImg = null;
        this.isDragging = false;
        this.startDraggingPos = null;
    }
    prepare() {
        this.shootSoundEffect = new Audio("/res/sounds/Pliu.mp3");
        this.norbImg = document.createElement("img");
        this.norbImg.src = "res/norb.png";
        let nNorbs = 3 + Math.random() * 3 + (Math.random() * 5 * this.difficultyFactor);
        for (var i = 0; i < Math.floor(nNorbs); i++) {
            let borderX = 500 - (300 * this.difficultyFactor);
            this.orbs.push([
                borderX + ((this.w - 2 * borderX) * Math.random()),
                150 + (300 * Math.random())
            ]);
        }
    }
    start() {
        super.start();
    }
    clamp(x, a, b) {
        if (x < a)
            return a;
        if (x > b)
            return b;
        return x;
    }
    update(state, deltaTime) {
        if (!this.ctx)
            return;
        if (this.orbs.every(o => o === null)) {
            super.setFinish();
        }
        // Background
        this.ctx.fillStyle = "#efc";
        this.ctx.fillRect(0, 0, this.w, this.h);
        // Move and draw bullets
        this.bullets.forEach((b, i) => {
            b[0] += b[2] * deltaTime;
            b[1] += b[3] * deltaTime;
            this.ctx.beginPath();
            this.ctx.arc(b[0], b[1], 15, 0, 2 * Math.PI);
            this.ctx.fillStyle = i % 2 == 0 ? "red" : "blue";
            this.ctx.fill();
        });
        // Check if bullets hit anything
        this.bullets.forEach((b) => {
            this.orbs.forEach((orb, i) => {
                if (orb === null)
                    return;
                let dist = Math.sqrt(Math.pow((b[0] - orb[0]), 2) + Math.pow(b[1] - orb[1], 2));
                if (dist < 50) {
                    // Kill orb
                    this.orbs[i] = null;
                }
            });
        });
        // Norbs
        const orbSize = 70 * Math.pow(Math.min(this.secondsSincePrepare, 1), 3);
        this.orbs.forEach((orb) => {
            var _a;
            if (orb === null)
                return;
            (_a = this.ctx) === null || _a === void 0 ? void 0 : _a.drawImage(this.norbImg, orb[0] - orbSize / 2, orb[1] - orbSize / 2, orbSize, orbSize);
        });
        // Slingshot body
        this.ctx.beginPath();
        this.ctx.moveTo((this.w / 2) - 100, this.h - 250);
        this.ctx.lineTo((this.w / 2), this.h - 150);
        this.ctx.lineTo((this.w / 2) + 100, this.h - 250);
        this.ctx.moveTo((this.w / 2), this.h - 150);
        this.ctx.lineTo((this.w / 2), this.h - 50);
        this.ctx.lineWidth = 20;
        this.ctx.strokeStyle = "brown";
        this.ctx.stroke();
        // Slingshot slingy part
        let sspOffsetX = 0;
        let sspOffsetY = 0;
        if (this.isDragging) {
            sspOffsetX = (this.startDraggingPos[0] - this.lastMousePos[0]) * 0.1;
            sspOffsetY = (this.startDraggingPos[1] - this.lastMousePos[1]) * 0.1;
            // Draw bullet on the slingy part
            this.ctx.beginPath();
            this.ctx.fillStyle = this.bullets.length % 2 == 0 ? "red" : "blue";
            this.ctx.arc(this.w / 2 - this.clamp(sspOffsetX, -20, 20), this.h - 230 - this.clamp(sspOffsetY, -20, 20), 15, 0, 2 * Math.PI);
            this.ctx.fill();
        }
        this.ctx.beginPath();
        this.ctx.moveTo((this.w / 2) - 100, this.h - 250);
        this.ctx.quadraticCurveTo(this.w / 2 - this.clamp(sspOffsetX, -20, 20), this.h - 200 - this.clamp(sspOffsetY, -20, 20), this.w / 2 + 100, this.h - 250);
        this.ctx.lineWidth = 10;
        this.ctx.strokeStyle = "orange";
        this.ctx.stroke();
        // Show rough shooting line
        if (this.isDragging) {
            this.ctx.beginPath();
            this.ctx.moveTo((this.w / 2), this.h - 250);
            this.ctx.lineTo((this.w / 2) + this.lastMousePos[0] - this.startDraggingPos[0], (this.h - 250) + this.lastMousePos[1] - this.startDraggingPos[1]);
            this.ctx.lineWidth = 10;
            this.ctx.strokeStyle = "#f627";
            this.ctx.stroke();
        }
        this.hasClicked = false;
    }
    event(ev) {
        if (ev.type == "click") {
            this.hasClicked = true;
        }
        else if (ev.type == "mousemove") {
            this.lastMousePos = [ev.x, ev.y];
        }
        else if (ev.type == "mousedown") {
            this.lastMousePos = [ev.x, ev.y];
            if (this.state == GameState.RUNNING) {
                this.isDragging = true;
                this.startDraggingPos = this.lastMousePos;
            }
        }
        else if (ev.type == "mouseup") {
            this.isDragging = false;
            if (this.state == GameState.RUNNING && this.startDraggingPos !== null && this.lastMousePos !== null) {
                // SHOOT!
                let bvx = this.startDraggingPos[0] - this.lastMousePos[0];
                let bvy = this.startDraggingPos[1] - this.lastMousePos[1];
                let bullet = [this.w / 2, this.h - 250, bvx * 10, bvy * 10];
                this.bullets.push(bullet);
                this.shootSoundEffect.cloneNode(true).play();
            }
        }
    }
}
