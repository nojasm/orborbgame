import { GameState } from "./GameManager.js";
export class MiniGame {
    constructor() {
        this.w = 0;
        this.h = 0;
        this.failed = false;
        this.finished = false;
        this.state = GameState.NONE;
        this.playerWinsWhenTimeEnds = false;
        // Time since the minigame started in seconds
        this.secondsSinceStart = 0;
        this.secondsSincePrepare = 0;
        this.difficultyFactor = 0; // 0 to 1
    }
    prepare() {
        this.failed = false;
        this.finished = false;
    }
    start() { }
    update(state, deltaTime) { }
    event(ev) { }
    setPlayerWinsWhenTimeEnds() {
        this.playerWinsWhenTimeEnds = true;
    }
    setFinish() {
        this.finished = true;
    }
    setFail() {
        this.failed = true;
    }
}
;
