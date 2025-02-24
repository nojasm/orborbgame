<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>orborb</title>

        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Atma:wght@300;400;500;600;700&display=swap" rel="stylesheet">
        
        <link rel="stylesheet" href="/css/style.css">
        <link rel="stylesheet" href="/css/game.css">
        <link rel="stylesheet" href="/css/fonts.css">
        <link rel="stylesheet" href="/css/scorborb.css">
        <link rel="stylesheet" href="/css/orb.css">
        <link rel="stylesheet" href="/css/studio.css">
    </head>
    <body>
        <div id="main">
            <div id="front-card">
                <div id="front-card__orb">
                    <canvas width="1000" height="1000" id="orb-canvas"></canvas>
                    <div id="front-card__orb-edit">
                        <img src="/res/pencil-square.svg">
                    </div>
                </div>
                <button id="front-card__play">
                    <img src="/res/play-fill.svg">
                </button>
            </div>

            <span id="scoreboard-down">▽▼ scorborb ▼▽</span>

            <div id="scoreboard">
                <span id="scoreboard__title">SCORBORB</span>
                <div class="scoreboard-row">
                    <span class="scoreboard-row__name">admin000</span>
                    <span class="scoreboard-row__score">420</span>
                </div>
                <div class="scoreboard-row">
                    <span class="scoreboard-row__name">user1</span>
                    <span class="scoreboard-row__score">69</span>
                </div>
            </div>
        </div>

        <div id="studio">
            <div id="studio-close">
                <img src="/res/x-lg(1).svg" alt="X">
            </div>
            <canvas width="1000" height="1000" id="studio-orb"></canvas>
            <div id="studio-options">
                <div class="studio-option" studio-option="color">
                    <div class="studio-option-left"></div>
                    <span>COLOR</span>
                    <div class="studio-option-right"></div>
                </div>
                <div class="studio-option" studio-option="eyes">
                    <div class="studio-option-left"></div>
                    <span>EYES</span>
                    <div class="studio-option-right"></div>
                </div>
                <div class="studio-option" studio-option="mouth">
                    <div class="studio-option-left"></div>
                    <span>MOUTH</span>
                    <div class="studio-option-right"></div>
                </div>
                <span id="studio-orb-flip">FLIP</span>
            </div>
        </div>

        <div id="curtains">
            
        </div>

        <div id="fail">
            <span id="fail__title">FAILED</span>
            <span id="fail__comment">you are a looser</span>
            <span id="fail__score">SCORE: 420</span>
        </div>

        <div id="game">
            <canvas id="game__canvas"></canvas>
            <canvas width="1000" height="1000" id="game__orb"></canvas>
        </div>

        <script>var exports = {};</script>
        <script type="module" src="/js/main.js"></script>
        <script src="http://localhost:35729/livereload.js"></script>
    </body>
</html>