import { GameState } from "./GameManager.js";

export abstract class MiniGame {
    w: number = 0;
    h: number = 0;
    ctx: CanvasRenderingContext2D|undefined;
    failed: boolean = false;
    finished: boolean = false;
    state: GameState = GameState.NONE;

    playerWinsWhenTimeEnds: boolean = false;

    // Time since the minigame started in seconds
    secondsSinceStart: number = 0;
    secondsSincePrepare: number = 0;

    difficultyFactor: number = 0;  // 0 to 1

    constructor() {}

    prepare() {
        this.failed = false;
        this.finished = false;
    }

    start() {}

    update(state: GameState, deltaTime: number) {}

    event(ev: Event) {}

    setPlayerWinsWhenTimeEnds() {
        this.playerWinsWhenTimeEnds = true;
    }

    setFinish() {
        this.finished = true;
    }

    setFail() {
        this.failed = true;
    }
};