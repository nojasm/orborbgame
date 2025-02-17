"use strict";
class MiniGame {
}
;
class GameManager {
    constructor() {
        this.currentGame = null;
    }
    start() { }
    update() { }
    event() { }
}
;
var game = new GameManager();
function run() {
    requestAnimationFrame(run);
}
