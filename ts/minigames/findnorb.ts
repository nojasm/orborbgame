import { GameState } from "../GameManager.js";
import { MiniGame } from "../MiniGame.js";

function easeInBack(x: number): number {
    // https://easings.net/#easeInBack
    const c1 = 1.70158;
    const c3 = c1 + 1;
    
    return c3 * x * x * x - c1 * x * x;
}

export class FindNorbMiniGame extends MiniGame {
    lastMousePos: any = null;
    hasClicked: boolean = false;
    size: number = 0;
    randomIndex: number = 0;

    wall: number = 1.0;  // Wall that blocks view (1.0 - 0.0)

    prepare() {
        this.size = Math.floor((this.difficultyFactor * 20) + 5);
        this.randomIndex = Math.floor(Math.random() * (this.size * this.size));
    }

    start() {
        super.start();
    }

    update(state: GameState, deltaTime: number) {
        if (!this.ctx) return;

        if (state == GameState.RUNNING && this.wall !== 0) {
            this.wall -= deltaTime;
            if (this.wall < 0) this.wall = 0;
        }

        // Background
        this.ctx.fillStyle = "#443";
        this.ctx.fillRect(0, 0, this.w, this.h);

        let radius = 25 - 15 * this.difficultyFactor;
        let padding = 25 - 20 * this.difficultyFactor;
        let totalSize = this.size * (2 * radius) + ((this.size - 1) * padding);

        // Draw orbs
        for (var y = 0; y < this.size; y++) {
            for (var x = 0; x < this.size; x++) {
                let xPos = (this.w / 2 - totalSize / 2) + x * (radius * 2 + padding);
                let yPos = (this.h / 2 - totalSize / 2) + y * (radius * 2 + padding);
                yPos += 50;

                let thisIndexIsNorb = (y * this.size + x) == this.randomIndex;

                // Highlight if mouse is above
                if (this.lastMousePos && state == GameState.RUNNING) {
                    let d = Math.sqrt(Math.pow(this.lastMousePos[0] - xPos, 2) + Math.pow((this.lastMousePos[1] - yPos), 2));
                    if (d < radius) {
                        this.ctx!.beginPath();
                        this.ctx!.fillStyle = "#58f";
                        this.ctx!.arc(xPos, yPos, radius + 4, 0, 2 * Math.PI);
                        this.ctx!.fill();

                        if (this.hasClicked) {
                            if (thisIndexIsNorb) this.setFinish();
                            else this.setFail();
                        }
                    }
                }

                if (thisIndexIsNorb) {
                    // Put norb here!
                    this.ctx!.beginPath();
                    this.ctx!.fillStyle = "hsl(50deg, 100%, 55%)";
                    this.ctx!.arc(xPos, yPos, radius, 0, 2 * Math.PI);
                    this.ctx!.fill();
                } else {
                    // No norb...
                    this.ctx!.beginPath();
                    this.ctx!.fillStyle = "hsl(50deg, " + (85 + this.difficultyFactor * 10) + "%, " + (80 - this.difficultyFactor * 20) + "%)";
                    this.ctx!.arc(xPos, yPos, radius, 0, 2 * Math.PI);
                    this.ctx!.fill();
                }
            }
        }

        // Wall that blocks view
        this.ctx.fillStyle = "#000";
        let wallX = (this.w / 2 - totalSize / 2 - radius) - 50;
        let wallY = (this.h / 2 - totalSize / 2) - radius;
        let wallW = totalSize + 2 * 50;
        let wallH = totalSize + 2 * 50;
        this.ctx.fillRect(wallX, wallY, wallW * Math.pow(this.wall, 3), wallH);

        // "FIND THE NORB"
        if (this.secondsSincePrepare > 0.0 && this.secondsSincePrepare < 1.8) {
            let textScale = 2;
            if (this.secondsSincePrepare > 0.8) {
                let p = (this.secondsSincePrepare - 0.8) / 1;
                textScale = easeInBack(1 - p) * 2;
                if (textScale < 0) textScale = 0;
            }
            
            this.ctx.save();
            this.ctx.translate(wallX + wallW / 2, wallY + wallH / 2);
            this.ctx.scale(textScale, textScale);
            this.ctx.fillStyle = "white";
            this.ctx.fillText("FIND\nNORB", 0, 0);
            this.ctx.restore();

        }

        this.hasClicked = false;
    }

    event(ev: Event) {
        if (ev.type == "click") {
            this.hasClicked = true;
        } else if (ev.type == "mousemove") {
            this.lastMousePos = [(ev as MouseEvent).x, (ev as MouseEvent).y];
        }
    }
}