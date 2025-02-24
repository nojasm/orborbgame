export class Orb {
    color: string;
    currentMouth: string;
    currentEyes: string;

    flipped: boolean = false;

    colors: string[] = ["white", "#2f8ae9", "#f71836", "#a1afc3", "#c131ff", "#ff8d13", "#00ef0b", "#fee305"];
    mouths: string[] = ["drooling", "hmm", "kiss", "lips", "lips2", "normal", "o", "opened small", "opened", "rect", "sad", "sad2", "scared", "small", "smiling", "smoking", "straight", "talking"];
    eyes: string[] = ["angry", "high", "low", "narrow", "normal", "pirate", "sad", "thinking", "wide"];

    mouthImages: any = {};   // {name: HTMLImageElement, ...}
    eyesImages: any = {};    // {name: HTMLImageElement, ...}

    constructor() {
        this.color = "white";
        this.currentMouth = "lips2";
        this.currentEyes = "pirate";

        this.mouths.forEach((m) => {
            this.mouthImages[m] = document.createElement("img");
            this.mouthImages[m].src = "/res/orbs/mouths/" + m + ".png";
        });

        this.eyes.forEach((m) => {
            this.eyesImages[m] = document.createElement("img");
            this.eyesImages[m].src = "/res/orbs/eyes/" + m + ".png";
        });
    }

    renderToCanvas(ctx: CanvasRenderingContext2D) {
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
        ctx.save();
        ctx.translate(500, 500);
        ctx.scale(this.flipped ? -1 : +1, 1);
        ctx.translate(-500, -500);

        // Draw eyes
        ctx.drawImage(this.eyesImages[this.currentEyes], 0, eyeOffsetY, 1000, 1000);

        // Draw mouth
        ctx.drawImage(this.mouthImages[this.currentMouth], 0, mouthOffsetY, 1000, 1000);

        ctx.restore();

        // Drop shadow
        ctx.beginPath();
        ctx.fillStyle = "#1111";
        ctx.ellipse(500, 960, 320, 40, 0, 0, 2 * Math.PI);
        ctx.fill();
    }
}