import { GameState } from "../GameManager.js";
import { MiniGame } from "../MiniGame.js";

export class FindNorb2MiniGame extends MiniGame {
    lastMousePos: any = null;
    hasClicked = false;

    orbs: any[] = [];
    norbPos: any[] = [];

    draggingIndex: number = -1;
    prepareRandomizeAnimationTimer: number = 0.0;

    prepare() {
        
    }

    start() {
        super.start();
    }

    isNorbVisible(): boolean {
        // To count as norb being visible, no orb should be closer
        // than 1.5 * radii or something like that
        let anyTooClose = false;
        this.orbs.forEach((orb) => {
            let dist = Math.sqrt(Math.pow(orb.x - this.norbPos[0], 2) + Math.pow(orb.y - this.norbPos[1], 2));
            if (dist < 80) anyTooClose = true;
        });
        return !anyTooClose;
    }

    randomize() {
        while (true) {
            this.orbs = [];
            let xRange = 350 + 100 * this.difficultyFactor;
            let yRange = 250 + 50 * this.difficultyFactor;
            this.norbPos = [
                this.w / 2 - (Math.random() * 2 * xRange - xRange),
                this.h / 2 - (Math.random() * 2 * yRange - yRange),
            ];

            let nOrbs = 50 + 50 * this.difficultyFactor;

            for (var i = 0; i < nOrbs; i++) {
                this.orbs.push({
                    x: this.w / 2 + (Math.random() * 2 * xRange) - xRange,
                    y: this.h / 2 + (Math.random() * 2 * yRange) - yRange,
                });
            }
            
            if (!this.isNorbVisible()) break;
        }
    }

    update(state: GameState, deltaTime: number) {
        if (!this.ctx) return;

        if (state == GameState.PREPARING) {
            this.prepareRandomizeAnimationTimer -= deltaTime;
            if (this.prepareRandomizeAnimationTimer < 0) {
                this.prepareRandomizeAnimationTimer = 0.2;
                this.randomize();
            }
        }

        if (this.isNorbVisible()) {
            super.setFinish();
        }

        // Background
        this.ctx.fillStyle = "#050505";
        this.ctx.fillRect(0, 0, this.w, this.h);

        // Draw norb
        this.ctx.beginPath();
        this.ctx.fillStyle = "yellow";
        this.ctx.arc(this.norbPos[0], this.norbPos[1], 50, 0, 2 * Math.PI);
        this.ctx.fill();

        // Draw orbs (in reverse order actually)
        this.orbs.slice().reverse().forEach((orb, i) => {
            this.ctx!.beginPath();
            this.ctx!.fillStyle = (this.orbs.length - i) % 2 == 0 ? "#f00e" : "#00fe";
            this.ctx!.arc(orb.x, orb.y, 50, 0, 2 * Math.PI);
            this.ctx!.fill();

            if (this.draggingIndex == (this.orbs.length - i - 1)) {
                this.ctx!.beginPath();
                this.ctx!.arc(orb.x, orb.y, 50, 0, 2 * Math.PI);
                this.ctx!.lineWidth = 4;
                this.ctx!.strokeStyle = "#fff6";
                this.ctx!.stroke();
            }
        });

        this.hasClicked = false;
    }

    event(ev: Event) {
        if (ev.type == "mousedown") {
            if (this.state == GameState.RUNNING) {
                let mp = [(ev as MouseEvent).x, (ev as MouseEvent).y];
                this.orbs.forEach((orb, index) => {
                    if (this.draggingIndex != -1) return;
                    
                    let dist = Math.sqrt(Math.pow(orb.x - mp[0], 2) + Math.pow(orb.y - mp[1], 2));
                    if (dist < 50) {
                        this.draggingIndex = index;
                    }
                });
            }
        } else if (ev.type == "mousemove") {
            if (this.draggingIndex !== -1 && this.state == GameState.RUNNING) {
                let movement = [(ev as MouseEvent).movementX, (ev as MouseEvent).movementY];
                this.orbs[this.draggingIndex].x += movement[0];
                this.orbs[this.draggingIndex].y += movement[1];
            }
        } else if (ev.type == "mouseup") {
            this.draggingIndex = -1;
        }
        
    }
}