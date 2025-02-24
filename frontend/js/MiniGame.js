export class MiniGame {
    constructor() {
        this.w = 0;
        this.h = 0;
        this.failed = false;
        this.finished = false;
        // Time since the minigame started in seconds
        this.secondsSinceStart = 0;
        this.difficultyFactor = 0; // 0 to 1
    }
    start() {
        this.failed = false;
        this.finished = false;
    }
    update(deltaTime) { }
    event(ev) { }
    setFinish() {
        this.finished = true;
    }
    setFail() {
        this.failed = true;
    }
}
;
