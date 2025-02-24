import { MiniGame } from "../MiniGame.js";

export class KillEmMiniGame extends MiniGame {
    norbs: any[] = [];  // List of norbs in format (x, y, r)
    lastMousePos: any = null;
    hasClicked = false;

    gunImg: HTMLImageElement|null = null;
    norbImg: HTMLImageElement|null = null;
    secondsSinceLastShot: number|null = null;

    gunShotSound: HTMLAudioElement|null = null;
    
    start() {
        super.start();
        let n = 5 + (Math.random() * this.difficultyFactor * 10);
        this.norbs = [];
        for (var i = 0; i < n; i++) {
            let norb = [Math.random() * 0.8 + 0.1, Math.random() * 0.8 + 0.1, Math.random() * 30 + 30];
            this.norbs.push(norb);
        }

        this.gunImg = document.createElement("img") as HTMLImageElement;
        this.gunImg.src = "/res/gun.png";
        this.norbImg = document.createElement("img") as HTMLImageElement;
        this.norbImg.src = "/res/norb.png";

        this.gunShotSound = new Audio("/res/sounds/gun.mp3");

        this.secondsSinceLastShot = null;
    }

    playGunSound() {
        (this.gunShotSound?.cloneNode(true) as HTMLAudioElement).play();
    }

    update(deltaTime: number) {
        if (!this.ctx) return;

        // If all norbs are null, the game is done
        let allNull = this.norbs.every((x) => x === null);
        if (allNull) {
            super.setFinish();
        }

        this.ctx.fillStyle = "#223";
        this.ctx.fillRect(0, 0, this.w, this.h);

        if (this.secondsSinceLastShot !== null)
            this.secondsSinceLastShot += deltaTime;

        if (this.hasClicked) {
            this.secondsSinceLastShot = 0;
            this.playGunSound();
        }

        this.norbs.forEach((norb: any, i: number) => {
            if (norb === null) return;
            
            let x = norb[0] * this.w;
            let y = norb[1] * this.h;
            let r = norb[2];

            if (this.lastMousePos) {
                let d = Math.sqrt(Math.pow(this.lastMousePos[0] - x, 2) + Math.pow((this.lastMousePos[1] - y), 2));
                
                if (d < r) {
                    // Mouse is over circle, so highlight it
                    this.ctx!.beginPath();
                    this.ctx!.fillStyle = "#e40";
                    this.ctx!.arc(x, y, r + 4, 0, 2 * Math.PI);
                    this.ctx!.fill();

                    if (this.hasClicked) {
                        this.norbs[i] = null;
                        this.hasClicked = false;
                    }
                }
            }

            // Draw norb
            this.ctx!.drawImage(this.norbImg!, x - r, y - r, r * 2, r * 2);
        });

        // Gun
        let gunOffsetX = 50 + 100 * (this.lastMousePos[0] / this.w);
        let gunOffsetY = 50 + 100 * (this.lastMousePos[1] / this.h);

        if (this.secondsSinceLastShot !== null && this.lastMousePos !== null) {
            gunOffsetX -= 20 * -Math.exp(-5 * this.secondsSinceLastShot);
            gunOffsetY -= 30 * -Math.exp(-5 * this.secondsSinceLastShot);
        }

        this.ctx.drawImage(this.gunImg!, this.w - 280 + gunOffsetX, this.h - 380 + gunOffsetY, 200, 300);

        this.hasClicked = false;
    }

    event(ev: Event) {
        if (ev.type == "mousedown") {
            this.hasClicked = true;
        } else if (ev.type == "mousemove") {
            this.lastMousePos = [(ev as MouseEvent).x, (ev as MouseEvent).y];
        }
        
    }
}