import {GameManager} from "./GameManager.js"
import { Music, Track } from "./Music.js";
import { Orb } from "./Orb.js";
import { Player } from "./Player.js";

var game: GameManager;

var studioIsOpen: boolean = false;

var curtainsOpenSound = new Audio("/res/sounds/curtains-open.mp3");
var curtainsCloseSound = new Audio("/res/sounds/curtains-close.mp3");
var uiClickSound = new Audio("/res/sounds/ui-click.mp3");
var failSound = new Audio("/res/sounds/fail.mp3");

curtainsOpenSound.volume = 0.2;
curtainsCloseSound.volume = 0.2;
uiClickSound.volume = 0.1;
failSound.volume = 0.3;

function playUIClickSound() {
    (uiClickSound.cloneNode(true) as HTMLAudioElement).play();
}

function resizeCanvas() {
    if (game && game.canvas) {
        game.canvas.width = game.canvas.clientWidth;
        game.canvas.height = game.canvas.clientHeight;
    }
}

window.onresize = () => {
    resizeCanvas();
};

function playFailSound() {
    failSound.play();
}

function getRandomOf(list: any[]): any {
    return list[Math.floor(Math.random() * list.length)];
}

function showFailScreen(score: number) {
    let failEl = document.getElementById("fail")!;
    document.getElementById("fail__score")!.innerText = "SCORE: " + Math.floor(score);
    failEl.style.display = "flex";

    let comment: string;
    if (score === 0) {
        comment = getRandomOf(["bruh", "What happened?", "You did not understand the game.", ":("]);
    } else if (score < 200) {
        comment = getRandomOf(["What happened?", "My grandma is better", "GET OUT", "*laughs*"]);
    } else  if (score < 1500) {
        comment = getRandomOf(["Could be better.", "This is all you have?", "Don't freak out", "Worse than me", "We all start somewhere"]);
    } else if (score < 5000) {
        comment = getRandomOf(["Could be better.", "Not bad.", "You're getting better!", "wow!"]);
    } else {
        comment = getRandomOf(["lmao your cheat's broke", "You are either a god, or a cheater. Cheater.", "reported.", "/ban you"]);
    }
    
    document.getElementById("fail__comment")!.innerText = comment;

    playFailSound();

    setTimeout(() => {
        failEl.style.opacity = "1.0";
    }, 500);

    setTimeout(() => {
        closeCurtains(() => {
            failEl.style.display = "none";
            failEl.style.opacity = "0.0";
            backToMenu();

            openCurtains();
        });
    }, 3000);
}

function closeCurtains(afterClosedCallback: Function) {
    curtainsCloseSound.play();
    document.getElementById("curtains")!.style.top = "0";
    setTimeout(() => {
        afterClosedCallback();
    }, 1000);
}

function openCurtains() {
    curtainsOpenSound.play();
    document.getElementById("curtains")!.style.top = "-100%";
}

var lastGameUpdateTime: number|null = null;
function gameLoop() {
    if (game.running && !game.failedGame) {
        if (lastGameUpdateTime === null)
            lastGameUpdateTime = Date.now();

        requestAnimationFrame(gameLoop);

        var now = Date.now();
        game.handleEvents();
        game.update((now - lastGameUpdateTime) / 1000);
        lastGameUpdateTime = now;
    } else if (game.failedGame) {
        lastGameUpdateTime = null;

        showFailScreen(game.score);
    }
}

function backToMenu() {
    document.getElementById("game")!.style.display = "none";
}

function openStudio() {
    studioIsOpen = true;
    game.music.switchTo(Track.STUDIO);
    document.getElementById("studio")!.style.display = "flex";
}

function studioBackToMenu() {
    studioIsOpen = false;
    game.music.switchTo(Track.MENU);
    document.getElementById("studio")!.style.display = "none";
}

// Setup all elements in the UI and prepare Game Manager
function setup() {
    game = new GameManager();
    
    game.player = new Player();
    game.player.name = "orbian";
    game.player.orb = new Orb();

    // PLAY button
    document.getElementById("front-card__play")?.addEventListener("click", (event) => {
        playUIClickSound();
        closeCurtains(() => {
            game.canvas = document.getElementById("game__canvas") as HTMLCanvasElement;
            game.ctx = game.canvas.getContext("2d")!;
            document.getElementById("game")!.style.display = "initial";

            resizeCanvas();

            // No event listeners, because they may be set multiple times
            game.canvas.onclick = (event) => { game.event(event); };
            game.canvas.onmousemove = (event) => { game.event(event); };
            game.canvas.onmousedown = (event) => { game.event(event); };
            game.canvas.onmouseup = (event) => { game.event(event); };
    
            game.start();
            openCurtains();
            gameLoop();
        })
    });
}

let orbCanvasBig: HTMLCanvasElement = document.getElementById("orb-canvas") as HTMLCanvasElement;
let orbCanvasGame: HTMLCanvasElement = document.getElementById("game__orb") as HTMLCanvasElement;
let orbCanvasStudio: HTMLCanvasElement = document.getElementById("studio-orb") as HTMLCanvasElement;

// Renders both the large main-menu loop as well as the smaller one during the game (bottom left corner)
function orbRenderingLoop() {
    requestAnimationFrame(orbRenderingLoop);
    
    game.player?.orb?.renderToCanvas(orbCanvasBig.getContext("2d")!);
    game.player?.orb?.renderToCanvas(orbCanvasGame.getContext("2d")!);
    game.player?.orb?.renderToCanvas(orbCanvasStudio.getContext("2d")!);
}

window.onmousemove = (ev: MouseEvent) => {
    if (game) {
        game.lastMousePos = [ev.x, ev.y];
    }
}

document.getElementById("front-card__orb-edit")?.addEventListener("click", (event) => {
    playUIClickSound();
    closeCurtains(() => {
        openStudio();
        openCurtains();
    });
});

function getNextEntry(list: any[], entry: any, previous: boolean = false): any {
    let newIndex = (list.indexOf(entry) + (previous ? -1 : +1)) % list.length;
    if (newIndex < 0) newIndex = list.length - (Math.abs(newIndex) % list.length);
    return list[newIndex];
}

function changeValueFromStudio(key: string, value: number) {
    if (key === "color") {
        game.player!.orb!.color = getNextEntry(game.player!.orb!.colors, game.player!.orb!.color, value === -1);
    } else if (key === "mouth") {
        game.player!.orb!.currentMouth = getNextEntry(game.player!.orb?.mouths!, game.player!.orb!.currentMouth, value === -1);
    } else if (key === "eyes") {
        game.player!.orb!.currentEyes = getNextEntry(game.player!.orb?.eyes!, game.player!.orb!.currentEyes, value === -1);
    }
}

[...document.getElementsByClassName("studio-option")].forEach((studioOption) => {
    studioOption.getElementsByClassName("studio-option-left")[0].addEventListener("click", (event) => {
        playUIClickSound();
        changeValueFromStudio(studioOption.getAttribute("studio-option")!, -1);
    });

    studioOption.getElementsByClassName("studio-option-right")[0].addEventListener("click", (event) => {
        playUIClickSound();
        changeValueFromStudio(studioOption.getAttribute("studio-option")!, +1);
    });
});

document.getElementById("studio-close")?.addEventListener("click", (event) => {
    playUIClickSound();
    closeCurtains(() => {
        studioBackToMenu();
        openCurtains();
    });
});

document.getElementById("studio-orb-flip")?.addEventListener("click", (event) => {
    playUIClickSound();
    game!.player!.orb!.flipped = !game!.player!.orb?.flipped;
});

window.onkeydown = (ev: KeyboardEvent) => {
    if (ev.key === "Escape") {
        if (studioIsOpen) {
            closeCurtains(() => {
                studioBackToMenu();
                openCurtains();
            });
        }
    }
}

setup();
orbRenderingLoop();
