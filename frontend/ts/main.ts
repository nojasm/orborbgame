abstract class MiniGame {
    
};

class GameManager {
    currentGame: MiniGame|null = null;

    constructor() {
        
    }

    start() {}

    update() {}

    event() {}
};

var game: GameManager = new GameManager();

function run() {
    requestAnimationFrame(run);
}