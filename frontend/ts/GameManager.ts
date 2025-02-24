import {MiniGame} from "./MiniGame.js"
import { FindNorbMiniGame } from "./minigames/findnorb.js";
import { KillEmMiniGame } from "./minigames/killem.js";
import { OrbulateMiniGame } from "./minigames/orbulate.js";
import { ShakeWormMiniGame } from "./minigames/shakeworm.js";
import { SortOrbsMiniGame } from "./minigames/sortorbs.js";
import { Music, Track } from "./Music.js";
import { Player } from "./Player.js";


var minigames: any[] = [
    FindNorbMiniGame,
    KillEmMiniGame,
    OrbulateMiniGame,
    ShakeWormMiniGame,
    SortOrbsMiniGame
];

/*minigames = [
    KillEmMiniGame,
];*/


export class GameManager {
    currentGame: MiniGame|null = null;
    player: Player|null = null;

    canvas: HTMLCanvasElement|null = null;
    ctx: CanvasRenderingContext2D|null = null;
    w: number = 0;
    h: number = 0;

    score: number = 0;
    running: boolean = false;
    failedGame: boolean = false;

    miniGameStartTime: number = 0;
    eventStack: Event[] = [];

    lastMousePos: number[] = [0, 0];
    
    difficultyFactor: number = 0;  // Goes from 0 - 1, to make the game harder over time
    nGamesPlayed: number = 0;
    lastPlayedMiniGames: string[] = [];
    allMiniGames: any[] = [];
    music: Music;

    constructor() {
        this.music = new Music();
    }

    start() {
        this.score = 0;
        this.running = true;
        this.failedGame = false;
        this.lastPlayedMiniGames = [];
        this.allMiniGames = minigames;
        this.startNextGame();
    }

    calculatedifficultyFactor(afterNGames: number) {
        return -Math.exp(-0.05 * afterNGames) + 1;
    }

    startNextGame() {
        this.eventStack = [];
        this.difficultyFactor = this.calculatedifficultyFactor(this.nGamesPlayed);
        this.miniGameStartTime = Date.now();
        this.currentGame = this.getNextRandomGame();
        this.currentGame.difficultyFactor = this.difficultyFactor;
        this.currentGame.start();

        this.w = this.canvas!.width;
        this.h = this.canvas!.height;
        this.ctx?.clearRect(0, 0, this.w, this.h);

        if (this.currentGame.constructor.name === "SortOrbsMiniGame")
            this.music.switchTo(Track.SORTING);
        else if (this.currentGame.constructor.name === "KillEmMiniGame")
            this.music.switchTo(Track.KILLEM);
        else if (this.currentGame.constructor.name === "FindNorbMiniGame")
            this.music.switchTo(Track.FINDNORB);
        else if (this.currentGame.constructor.name === "OrbulateMiniGame")
            this.music.switchTo(Track.ORBULATE);
        else
            this.music.switchTo(Track.DEFAULT);
    }

    getNextRandomGame(): MiniGame {
        /*
            How this next-game-choosing-algorithm works:
                There is a set of the name of all played minigames (Each MiniGame exists either 0 times or 1 time in this set)
                Every time a game is chosen, it is moved to the first position of this list.
                    (If it is not in this list, it is inserted at the first position)
                
                To pick a game, a random number between 0 and 1 is picked, then passed through an exponential function to make
                games that weren't played in a long time more lickely. Then the number gets converted to an index of the list.
                To prevent the index being 0 and the same game appearing again, the random number is converted to index #1 at 0.0, and the last index at <1.0.
        */

        // If there are games that have not been played at all, pick one of those first
        let notPlayedAtAllMiniGames = this.allMiniGames.filter((mg: any) => {
            return !this.lastPlayedMiniGames.includes(mg.name);
        });

        if (notPlayedAtAllMiniGames.length > 0) {
            let picked: string = notPlayedAtAllMiniGames[Math.floor(Math.random() * notPlayedAtAllMiniGames.length)].name;
            let indexFromMiniGameName = this.allMiniGames.findIndex((mg: any) => mg.name === picked);
            console.log("Picking", picked, "at index", indexFromMiniGameName, "because it hasn't been played yet at all");
            
            
            let rmg: MiniGame = new minigames[indexFromMiniGameName](this.difficultyFactor);
            console.log("Next MiniGame is", rmg.constructor.name);
            
            this.lastPlayedMiniGames.unshift(picked);
            return rmg;
        } else {
            let chosenIndex: number = 0;
            if (this.lastPlayedMiniGames.length > 1) {
                let r = Math.random();
        
                // The lower the exponent, the higher the chance that a game is picked that wasn't picked for a long time
                let rExp = Math.pow(r, 0.7);
                chosenIndex = 1 + Math.floor(rExp * (this.lastPlayedMiniGames.length - 1));
            }

            //console.log("ALL GAMES", minigames.map(x => x.name));
            //console.log("LAST PLAYED", this.lastPlayedMiniGames);
            //console.log("PICKED INDEX", chosenIndex, "->", mgIndex);
    
            // Create instance of minigame with that picked index
            let mgIndex: number = minigames.map(x => x.name).indexOf(this.lastPlayedMiniGames[chosenIndex]);
            let rmg: MiniGame = new minigames[mgIndex](this.difficultyFactor);
            
            // Move name of that minigame to front of last-played-list
            let picked: string = this.lastPlayedMiniGames[chosenIndex];
            this.lastPlayedMiniGames.splice(chosenIndex, 1);
            this.lastPlayedMiniGames.unshift(picked);
            
            

            /*console.log("Picked index", chosenIndex, "for the next game. it is", this.allMiniGames[chosenIndex].name);
            

            //let rmg: MiniGame = new minigames[Math.floor(Math.random() * minigames.length)](this.difficultyFactor);
            let mgIndex: number = minigames.map(x => x.name).indexOf(this.lastPlayedMiniGames[chosenIndex]);
            console.log("IN LAST PLAYED, INDEX", chosenIndex, "WHICH IS INDEX", mgIndex, "IN ALL GAMES");
            
            let rmg: MiniGame = new minigames[chosenIndex](this.difficultyFactor);
            //this.lastPlayedMiniGames.push();
            console.log("Next MiniGame is", rmg.constructor.name);

            console.log("MOVING:", this.lastPlayedMiniGames, chosenIndex);
            // Move minigame to front of last-played-minigames-list
            let indexInLastPlayed = this.lastPlayedMiniGames.indexOf(rmg.constructor.name)

            console.log("RESULT:", this.lastPlayedMiniGames);*/
            

            return rmg;
            
            //console.log(this.lastPlayedMiniGames);
            //return new minigames[0](this.difficultyFactor);
        }
    }

    handleEvents() {
        this.eventStack.forEach((ev: Event) => {
            this.currentGame?.event(ev);
        });

        this.eventStack = [];
    }

    update(deltaTime: number) {
        if (this.running && this.currentGame && this.ctx) {
            // Calculate how much time is left
            let totalTimePerMiniGame = 5;
            let timeLeftSeconds: number = totalTimePerMiniGame - ((Date.now() - this.miniGameStartTime) / 1000);
            this.currentGame.secondsSinceStart = (Date.now() - this.miniGameStartTime) / 1000;

            // If the time runs out and the game is not set to finish yet,
            // let it fail automatically
            if (timeLeftSeconds <= 0) {
                this.currentGame.setFail();
                this.failedGame = true;
                this.running = false;
                this.music.switchTo(Track.FAIL);
                return;
            }
            
            // Set timer in UI
            //let timeLeftString: string = timeLeftSeconds.toFixed(1) + "s";
            //document.getElementById("game__time")!.innerText = timeLeftString;

            // Update MiniGame
            this.currentGame.ctx = this.ctx;
            this.currentGame.w = this.w;
            this.currentGame.h = this.h;
            this.currentGame.update(deltaTime);

            // Header background
            this.ctx.beginPath();
            this.ctx.moveTo(0.00 * this.w, 0);
            this.ctx.lineTo(0.00 * this.w, 70);
            this.ctx.lineTo(0.15 * this.w, 70);
            this.ctx.lineTo(0.20 * this.w, 50);
            this.ctx.lineTo(0.35 * this.w, 50);
            this.ctx.lineTo(0.40 * this.w, 70); //////---
            this.ctx.lineTo(0.60 * this.w, 70); //////---
            this.ctx.lineTo(0.65 * this.w, 50);
            this.ctx.lineTo(0.80 * this.w, 50);
            this.ctx.lineTo(0.85 * this.w, 70);
            this.ctx.lineTo(1.00 * this.w, 70);
            this.ctx.lineTo(1.00 * this.w, 0);
            this.ctx.fillStyle = "#112";
            this.ctx.fill();


            // Time left text
            this.ctx.save();
            let textScale: number = 0.2 * Math.exp(-15.0 * (1 - (timeLeftSeconds - Math.floor(timeLeftSeconds)))) + 1;
            textScale *= Math.abs(Math.sin(timeLeftSeconds * 4.0 * Math.PI)) * 0.1 + 1;
            this.ctx.translate(this.w / 2 + 10 * Math.sin(timeLeftSeconds * 2.0 * Math.PI), 55);
            this.ctx.scale(textScale, textScale);
            this.ctx.fillStyle = "#ff5";
            this.ctx.font = "60px Atma";
            this.ctx.textAlign = "center";
            this.ctx.fillText(timeLeftSeconds.toFixed(1) + "s", 0, 0);
            this.ctx.restore();

            // Score text
            let scoreSize: number = 0.4 * Math.exp(-10.0 * (Date.now() - this.miniGameStartTime) / 1000) + 1;
            this.ctx.font = "30px Atma";
            this.ctx.fillStyle = "#fff";
            this.ctx.textAlign = "center";
            this.ctx.save();
            this.ctx.translate(this.w - 150, 50);
            this.ctx.scale(scoreSize, scoreSize);
            this.ctx.fillText("SCORE: " + Math.floor(this.score), 0, 0);
            this.ctx.restore();

            // Difficulty text (For debugging)
            /*this.ctx.font = "30px Atma";
            this.ctx.fillStyle = "#fff";
            this.ctx.textAlign = "center";
            this.ctx.fillText("DIFF: " + this.difficultyFactor, 150, 50);*/

            // Finish and fail handling
            if (this.currentGame.finished) {
                let addScore: number = (timeLeftSeconds / totalTimePerMiniGame) * 100;
                this.score += addScore;
                this.nGamesPlayed++;
                this.startNextGame();
            } else if (this.currentGame.failed) {
                this.failedGame = true;
                this.running = false;
                this.music.switchTo(Track.FAIL);
            }
        }
    }

    event(ev: Event) {
        if (this.running && this.currentGame) {
            this.eventStack.push(ev);
        }
    }
};
