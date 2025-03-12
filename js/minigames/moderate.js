import { GameState } from "../GameManager.js";
import { MiniGame } from "../MiniGame.js";
export class ModerateMiniGame extends MiniGame {
    constructor() {
        super(...arguments);
        this.lastMousePos = null;
        this.posts = [];
        this.randomizePrepareAnimationTimer = 0.0;
        this.hoverPostIndex = -1;
        this.hoverAllow = false;
        this.nPosts = 3;
    }
    prepare() {
        this.nPosts = Math.floor(3 + 5 * this.difficultyFactor);
        this.randomizePosts();
    }
    start() {
        super.start();
    }
    randomizePosts() {
        this.posts = [];
        let postHeight = 80 - (15 * this.difficultyFactor);
        let yOffset = 1 * 80;
        let totalHeight = postHeight * this.nPosts;
        for (var i = 0; i < this.nPosts; i++) {
            let post = {
                good: false,
                text: "",
                user: this.genUserName(),
                setBan: null, // null | false | true
                postRect: {
                    x: this.w / 2 - 350,
                    y: this.h / 2 - totalHeight / 2 + (i * postHeight) + yOffset,
                    w: 700,
                    h: postHeight,
                }
            };
            post.allowRect = {
                x: post.postRect.x - 200,
                y: post.postRect.y + 10,
                w: 80,
                h: post.postRect.h - 20
            };
            post.denyRect = {
                x: post.postRect.x - 100,
                y: post.postRect.y + 10,
                w: 80,
                h: post.postRect.h - 20
            };
            if (Math.random() > 0.5) {
                // Good post (don't ban)
                post.good = true;
                post.text = this.genPostText(true);
            }
            else {
                // Bad post (ban)
                post.good = false;
                post.text = this.genPostText(false);
            }
            this.posts.push(post);
        }
    }
    getRandomOf(entries) {
        return entries[Math.floor(Math.random() * entries.length)];
    }
    genUserName() {
        if (Math.random() > 0.4) {
            return this.getRandomOf([
                "user", "randomguy", "joe", "peter", "quagmire",
                "lois", "stewie", "brian_familyguy", "homer", "marge",
                "spongebob"
            ]) + Math.floor(Math.random() * 9999).toString();
        }
        else {
            return this.getRandomOf([
                "Bob", "callmecarsonfan1", "vavintino", "florba", "norb_hater1",
                "idkwhatimdoinghelpme", "nojasm", "me_you", "whatsup55", "ilov420",
                "avginternetguy", "cute.uwu", "satan666"
            ]);
        }
    }
    genPostText(good) {
        let options = [];
        if (good) {
            options.push("I LOVE CALLMECARSON!");
            options.push("I LOVE GAVINTINO!");
            options.push("I LOVE ORBS!");
            options.push("i see orbs everywhere");
            options.push("dude like orbs are so sick");
            options.push("what a nice video!");
            options.push("More like erm what the sigma amirite guys?");
            options.push("stop with that skibidi toilet please");
            options.push("^^");
            options.push("anyone wanna play minecraft?");
            options.push("Did you know that Notch actually had a dead brother?");
            options.push("There shouldbe more people financially supporting orborb");
            options.push("We should kill all norbs");
        }
        else {
            options.push("I LOVE NORBS!");
            options.push("#norbforever");
            options.push("GUYS BUY MY BITCOIN");
            options.push("Minecraft sucks. Its a bad game. Change my mind.");
            options.push("cubes > orbs");
            options.push("i don't get the whole orb thing");
            options.push("orborbgame is like the stupidest game ever made");
            options.push("Last video was pretty bad ngl");
            options.push("I kinda don't enjoy watching orborb anymore");
        }
        return options[Math.floor(Math.random() * options.length)];
    }
    checkAllGood() {
        return this.posts.every((post, i) => {
            return (post.setBan !== null) && (post.good !== post.setBan);
        });
    }
    update(state, deltaTime) {
        if (!this.ctx)
            return;
        if (state == GameState.PREPARING) {
            this.randomizePrepareAnimationTimer -= deltaTime;
            if (this.randomizePrepareAnimationTimer < 0) {
                this.randomizePrepareAnimationTimer = 0.1;
                this.randomizePosts();
            }
        }
        // If one is wrongly checked, fail
        this.posts.forEach((post) => {
            if (post.setBan !== null) {
                if ((post.setBan === true && post.good === true) ||
                    (post.setBan === false && post.good === false)) {
                    this.setFail();
                }
            }
        });
        // If all are correctly checked, finish
        if (!this.posts.some(p => p.setBan === null)) {
            this.setFinish();
        }
        // Background
        this.ctx.fillStyle = "#112";
        this.ctx.fillRect(0, 0, this.w, this.h);
        // Title
        this.ctx.fillStyle = "#fff";
        this.ctx.font = "50px Arial Black";
        this.ctx.fillText("MODERATE THE DISCORD", this.w / 2, 210);
        this.ctx.font = "25px Arial Black";
        this.ctx.fillText("SILENCE THE CRITICS", this.w / 2, 250);
        // Posts
        this.posts.forEach((post, index) => {
            // Post borders
            this.ctx.beginPath();
            this.ctx.strokeStyle = "white";
            this.ctx.lineWidth = 2;
            this.ctx.rect(post.postRect.x, post.postRect.y, post.postRect.w, post.postRect.h);
            this.ctx.stroke();
            // Post user
            this.ctx.font = "13px monospace";
            this.ctx.fillStyle = "#ccc";
            this.ctx.textAlign = "left";
            this.ctx.fillText("@" + post.user, post.postRect.x + 10, post.postRect.y + 17);
            // Post text
            this.ctx.font = "20px Arial";
            this.ctx.fillStyle = "white";
            this.ctx.textAlign = "left";
            this.ctx.fillText(post.text, post.postRect.x + 25, post.postRect.y + post.postRect.h / 2 + 10);
            // ACCEPT button
            this.drawButton(post.allowRect, "#6f6a", "#6f66", "#6f68", "#6f6f", this.hoverPostIndex == index && this.hoverAllow === true, post.setBan === false, "ALLOW");
            // DENY button
            this.drawButton(post.denyRect, "#f66a", "#f666", "#f668", "#f66f", this.hoverPostIndex == index && this.hoverAllow === false, post.setBan === true, "DENY");
        });
    }
    drawButton(rect, borderColor, bgColor, hoverFillColor, fillColor, hovering, filled, text) {
        // Border
        this.ctx.beginPath();
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = borderColor;
        this.ctx.rect(rect.x, rect.y, rect.w, rect.h);
        this.ctx.stroke();
        // Background
        if (hovering)
            this.ctx.fillStyle = filled ? fillColor : hoverFillColor;
        else
            this.ctx.fillStyle = filled ? fillColor : bgColor;
        this.ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
        // Text
        this.ctx.font = "18px Arial Black";
        this.ctx.fillStyle = filled ? "#ffff" : "#fff8";
        this.ctx.textAlign = "center";
        this.ctx.fillText(text, rect.x + rect.w / 2, rect.y + rect.h / 2 + 6);
    }
    event(ev) {
        if (ev.type == "click") {
            let mp = [ev.x, ev.y];
            this.posts.forEach((post, index) => {
                if (mp[0] >= post.allowRect.x && mp[0] < (post.allowRect.x + post.allowRect.w) && mp[1] >= post.allowRect.y && mp[1] < (post.allowRect.y + post.allowRect.h)) {
                    this.posts[index].setBan = false;
                }
                else if (mp[0] >= post.denyRect.x && mp[0] < (post.denyRect.x + post.denyRect.w) && mp[1] >= post.denyRect.y && mp[1] < (post.denyRect.y + post.denyRect.h)) {
                    this.posts[index].setBan = true;
                }
            });
        }
        else if (ev.type == "mousemove") {
            let mp = [ev.x, ev.y];
            let aboveSomething = false;
            this.posts.forEach((post, index) => {
                if (aboveSomething)
                    return;
                if (mp[0] >= post.allowRect.x && mp[0] < (post.allowRect.x + post.allowRect.w) && mp[1] >= post.allowRect.y && mp[1] < (post.allowRect.y + post.allowRect.h)) {
                    this.hoverPostIndex = index;
                    this.hoverAllow = true;
                    aboveSomething = true;
                }
                else if (mp[0] >= post.denyRect.x && mp[0] < (post.denyRect.x + post.denyRect.w) && mp[1] >= post.denyRect.y && mp[1] < (post.denyRect.y + post.denyRect.h)) {
                    this.hoverPostIndex = index;
                    this.hoverAllow = false;
                    aboveSomething = true;
                }
                else {
                    this.hoverPostIndex = -1;
                }
            });
        }
    }
}
