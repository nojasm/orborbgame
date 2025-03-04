export class Transform {
    x: number = 0;
    y: number = 0;
    rotation: number = 0;
    scale: number = 1;
}

export class Orb {
    color: string;
    currentMouth: string;
    currentEyes: string;
    currentMisc: string;

    flipped: boolean = false;

    colors: string[] = ["white", "#2f8ae9", "#f71836", "#a1afc3", "#c131ff", "#c9ac78", "#ff8d13", "#00ef0b", "#fee305", "#85dae7", "#497928", "#f14aae"];
    mouths: string[] = ["", "norb", "drooling", "hmm", "kiss", "lips", "lips2", "normal", "o", "opened small", "opened", "rect", "sad", "sad2", "scared", "small", "smiling", "smoking", "straight", "talking"];
    eyes: string[] = ["", "angry", "high", "low", "narrow", "normal", "pirate", "sad", "thinking", "wide", "glasses", "cyclops", "anime"];
    miscs: string[] = ["", "amogus", "beard", "fuckmaga", "hat", "red"];

    mouthTransform: Transform = new Transform();
    eyesTransform: Transform = new Transform();
    miscTransform: Transform = new Transform();

    mouthImages: any = {};   // {name: HTMLImageElement, ...}
    eyesImages: any = {};    // {name: HTMLImageElement, ...}
    miscImages: any = {};    // {name: HTMLImageElement, ...}

    constructor() {
        if (localStorage.getItem("orb")) {
            let lsOrb = JSON.parse(localStorage.getItem("orb")!);
            this.color = lsOrb.color;
            this.currentMouth = lsOrb.mouth;
            this.currentEyes = lsOrb.eyes;
            this.currentMisc = lsOrb.misc;
            this.flipped = lsOrb.flipped;
            this.eyesTransform = lsOrb.eyesTransform || new Transform();
            this.mouthTransform = lsOrb.mouthTransform || new Transform();
            this.miscTransform = lsOrb.miscTransform || new Transform();
        } else {
            this.color = this.colors[0];
            this.currentMouth = this.mouths[6];
            this.currentEyes = this.eyes[5];
            this.currentMisc = this.miscs[0];
            //this.flipped = false;

            this.eyesTransform = new Transform();
            this.mouthTransform = new Transform();
            this.miscTransform = new Transform();

            this.updateLocalStorage();
        }


        this.mouths.forEach((m) => {
            if (m === "") return;
            this.mouthImages[m] = document.createElement("img");
            this.mouthImages[m].src = "res/orbs/mouths/" + m + ".png";
        });

        this.eyes.forEach((e) => {
            if (e === "") return;
            this.eyesImages[e] = document.createElement("img");
            this.eyesImages[e].src = "res/orbs/eyes/" + e + ".png";
        });

        this.miscs.forEach((e) => {
            if (e === "") return;
            this.miscImages[e] = document.createElement("img");
            this.miscImages[e].src = "res/orbs/misc/" + e + ".png";
        });
    }

    randomize() {
        this.color = this.colors[Math.floor(Math.random() * this.colors.length)];
        this.currentMouth = this.mouths[Math.floor(Math.random() * this.mouths.length)];
        this.currentEyes = this.eyes[Math.floor(Math.random() * this.eyes.length)];
        this.currentMisc = this.miscs[Math.floor(Math.random() * this.miscs.length)];
    }

    updateLocalStorage() {
        localStorage.setItem("orb", JSON.stringify({
            color: this.color,
            mouth: this.currentMouth,
            eyes: this.currentEyes,
            misc: this.currentMisc,
            eyesTransform: this.eyesTransform,
            mouthTransform: this.mouthTransform,
            miscTransform: this.miscTransform,
            flipped: this.flipped
        }));
    }

    renderToCanvas(ctx: CanvasRenderingContext2D, asExport: boolean = false) {
        ctx.clearRect(0, 0, 1000, 1000);

        // Darker border
        ctx.beginPath();
        ctx.arc(500, 500, 400, 0, 2 * Math.PI);
        ctx.fillStyle = "black";
        ctx.fill();

        // Body
        ctx.beginPath();
        ctx.arc(500, 500, 370, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();

        let eyeOffsetY = Math.sin(Date.now() / 500) * 8;
        let mouthOffsetY = Math.sin(Date.now() / 500 + 0.5) * 8;

        // Perhaps flip orb
        /*ctx.save();
        ctx.translate(500, 500);
        ctx.scale(this.flipped ? -1 : +1, 1);
        ctx.translate(-500, -500);*/

        // Draw eyes
        if (this.currentEyes !== "") {
            ctx.save();
            ctx.translate(500, 500);
            ctx.rotate((this.eyesTransform.rotation / 180) * Math.PI);
            ctx.scale(this.eyesTransform.scale, this.eyesTransform.scale);
            ctx.translate(-500, -500);
            ctx.drawImage(this.eyesImages[this.currentEyes], this.eyesTransform.x, this.eyesTransform.y + eyeOffsetY, 1000, 1000);
            ctx.restore();
        }

        // Draw mouth
        if (this.currentMouth !== "") {
            ctx.save();
            ctx.translate(500, 500);
            ctx.rotate((this.mouthTransform.rotation / 180) * Math.PI);
            ctx.scale(this.mouthTransform.scale, this.mouthTransform.scale);
            ctx.translate(-500, -500);
            ctx.drawImage(this.mouthImages[this.currentMouth], this.mouthTransform.x, this.mouthTransform.y + mouthOffsetY, 1000, 1000);
            ctx.restore();
        }

        // Draw misc
        if (this.currentMisc !== "") {
            ctx.save();
            ctx.translate(500, 500);
            ctx.rotate((this.miscTransform.rotation / 180) * Math.PI);
            ctx.scale(this.miscTransform.scale, this.miscTransform.scale);
            ctx.translate(-500, -500);
            ctx.drawImage(this.miscImages[this.currentMisc], this.miscTransform.x, this.miscTransform.y + mouthOffsetY, 1000, 1000);
            ctx.restore();
        }

        if (!asExport) {
            // Drop shadow
            ctx.beginPath();
            ctx.fillStyle = "#1111";
            ctx.ellipse(500, 960, 320, 40, 0, 0, 2 * Math.PI);
            ctx.fill();
        } else {
            // Watermark
            ctx.fillStyle = "#0005";
            ctx.font = "30px arial";
            ctx.fillText("orborbgame™", 50, 50);
        }
    }
}