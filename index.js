import Bot from "meowerbot";
import fetch from "node-fetch";
import {exec} from "child_process";
import * as dotenv from "dotenv";
import JSONdb from "simple-json-db";

import Wordle from "./lib/wordle.js";

dotenv.config();

const username = process.env["MDW125_USERNAME"];
const password = process.env["MDW125_PASSWORD"];
const uptime = new Date().getTime();
const help = ["~help", "~hello", "~uptime", "~uwu", "~8ball", "~zen", "~shorten", "~cat", "~status", "~credits", "~karma", "~mute", "~unmute", "~wordle"];
const admins = ["mdwalters", "m", "JoshAtticus"];
const db = new JSONdb("db.json");
const bot = new Bot(username, password);
const wordle = new Wordle();

function epochToRelative(timestamp) {
    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;
    var current = new Date().getTime();
    var elapsed = current - timestamp;

    if (elapsed < msPerMinute) {
        if (1 < Math.round(elapsed/1000)) {
            return `${Math.round(elapsed/1000)} seconds ago`; 
        } else if (Math.round(elapsed/1000) == 0) {
            return "just now";
        } else {
            return `${Math.round(elapsed/1000)} second ago`;
        }
    } else if (elapsed < msPerHour) {
        if (1 < Math.round(elapsed/msPerMinute)) {
            return `${Math.round(elapsed/msPerMinute)} minutes ago`;
        } else {
            return `${Math.round(elapsed/msPerMinute)} minute ago`;
        }  
    } else if (elapsed < msPerDay) {
        if (1 < Math.round(elapsed/msPerHour)) {
            return `${Math.round(elapsed/msPerHour)} hours ago`; 
        } else {
            return `${Math.round(elapsed/msPerHour)} hour ago`;
        }  
    } else if (elapsed < msPerMonth) {
        if (1 < Math.round(elapsed/msPerDay)) {
            return `${Math.round(elapsed/msPerDay)} days ago`;
        } else {
            return `${Math.round(elapsed/msPerDay)} day ago`;
        }
    } else if (elapsed < msPerYear) {
        if (1 < Math.round(elapsed/msPerMonth)) {
            return `${Math.round(elapsed/msPerMonth)} months ago`;
        } else {
            return `${Math.round(elapsed/msPerMonth)} month ago`;
        }
    } else {
        if (1 < elapsed/msPerYear) {
            return `${Math.round(elapsed/msPerYear)} years ago`;
        } else {
            return `${Math.round(elapsed/msPerYear)} year ago`;
        }
    }
}

bot.onPost(async (user, message, origin) => {
    if (message.startsWith("~") && db.has(`MDW125-MUTED-${user}`)) {
        if (db.get(`MDW125-MUTED-${user}`)) {
            bot.post(`You are currently muted from ${username}.
Reason: "${db.get(`MDW125-MUTED-${user}`)}"`, origin);
        } else {
            bot.post(`You are currently muted from ${username}.`, origin);
        }
        return;
    }

    if (message.startsWith("~") && !(help.includes(message.split(" ")[0]))) {
        if (message.startsWith("~! ")) {
            return;
        }
        bot.post("That command doesn't exist! Use ~help to see a list of commands.", origin);
        return;
    }

    if (message.startsWith("~help")) {
        if (message.split(" ")[1] === undefined) {
            bot.post(`Commands:
    ${help.join(", ")}`, origin);
        } else {
            if (message.split(" ")[1] === "help") {
                bot.post(`~help:
    Shows you a list of commands.`, origin);
            } else if (message.split(" ")[1] === "hello") {
                bot.post(`~hello:
    Replies with "Hello, [your username]. You can set a custom message with ~hello [custom message].`, origin);
            } else if (message.split(" ")[1] === "uptime") {
                bot.post(`~uptime:
    Shows you how long the bot was online for.`, origin);
            } else if (message.split(" ")[1] === "uwu") {
                bot.post(`~uwu:
    Sends "UwU.`, origin);
            } else if (message.split(" ")[1] === "8ball") {
                bot.post(`~8ball:
    Makes a prediction.`, origin);
            } else if (message.split(" ")[1] === "zen") {
                bot.post(`~zen:
    Posts zen quotes from GitHub's API.`, origin);
            } else if (message.split(" ")[1] === "shorten") {
                bot.post(`~shorten:
    Shortens links via shortco.de's API.`, origin);
            } else if (message.split(" ")[1] === "zen") {
                bot.post(`~cat:
    Posts random cat pictures.`, origin);
            } else if (message.split(" ")[1] === "zen") {
                bot.post(`~status:
    View, set and view someone else's status.`, origin);
            } else if (message.split(" ")[1] === "credits") {
                bot.post(`~credits:
    Lists everyone behind ${username}!`, origin);
            } else if (message.split(" ")[1] === "karma") {
                bot.post(`~karma:
    Upvote, downvote, and view someone's karma.`, origin);
            } else if (message.split(" ")[1] === "mute") {
                bot.post(`~mute:
    Mutes the specified user. Must be a bot admin to do this.`, origin);
            } else if (message.split(" ")[1] === "unmute") {
                bot.post(`~unmute:
    Unmutes the specified user. Must be a bot admin to do this.`, origin);
            } else if (message.split(" ")[1] === "wordle") {
                bot.post(`~wordle:
    Play wordle.`, origin);
            } else {
                bot.post("This command doesn't exist!", origin);
            }
        }
    }

    if (message.startsWith("~hello")) {
        if (message.split(" ")[1] === undefined) {
            bot.post(`Hello, ${user}!`, origin);
        } else {
            bot.post(`Hello, ${message.split(" ").slice(1, message.split(" ").length).join(" ")}!`, origin);
        }
    }

    if (message.startsWith("~uptime")) {
        bot.post(`${username} was online since ${epochToRelative(uptime)}.`, origin);
    }

    if (message.startsWith("~uwu")) {
        bot.post("UwU", origin);
    }

    if (message.startsWith("~8ball")) {
        let eightBall = ["It is certain.", "It is decidedly so.", "Without a doubt.", "Yes, definitely.", "You may rely on it.", "As I see it, yes.", "Most likely.", "Outlook good.", "Yes.", "Signs point to yes.", "Reply hazy, try again.", "Ask again later.", "Better not tell you now.", "Cannot predict now.", "Concentrate and ask again.", "Don't count on it.", "My reply is no.", "My sources say no.", "Outlook not so good.", "Very doubtful."];
    	bot.post(eightBall[Math.floor(Math.random() * eightBall.length)], origin);
    }

    if (message.startsWith("~zen")) {
        bot.post(await fetch("https://api.github.com/zen").then(res => res.text()), origin);
    }

    if (message.startsWith("~shorten")) {
        if (message.split(" ")[1] === undefined) {
            bot.post("You need to specify a website to shorten!", origin);
        } else {
            let link = await fetch(`https://api.shrtco.de/v2/shorten?url=${message.split(" ")[1]}`).then(res => res.json());
            bot.post(link.result.full_short_link, origin);
        }
    }

    if (message.startsWith("~cat")) {
        let image = await fetch("https://aws.random.cat/meow").then(res => res.json());
        bot.post(`[?format=src: ${image.file}]`, origin);
    }

    if (message.startsWith("~status")) {
        if (message.split(" ")[1] === "set") {
            db.set(`MDW125-STATUS-${user}`, message.split(" ").slice(2, message.split(" ").length).join(" "));
            bot.post("Status successfully set!", origin);
        } else if (message.split(" ")[1] === "clear") {
            db.delete(`MDW125-STATUS-${user}`);
            bot.post("Status successfully cleared!", origin);
        } else if (message.split(" ")[1] === "view") {
            if (message.split(" ")[2] === user) {
                if (!(db.has(`MDW125-STATUS-${user}`))) {
                    bot.post("You don't have a status set. To set one, use ~status set [message].", origin);
                } else {
                    bot.post(`Your status:
    ${db.get("MDW125-STATUS-" + user)}`, origin);
                }
            } else {
                if (db.has(`MDW125-STATUS-${user}`)) {
                    bot.post(`@${message.split(" ")[2]}'s status:
    ${db.get("MDW125-STATUS-" + message.split(" ")[2])}`, origin);
                } else {
                    bot.post(`@${message.split(" ")[2]} doesn't have a status set.`, origin);
                }
            }    
        } else {
            if (!(db.has(`MDW125-STATUS-${user}`))) {
                bot.post("You don't have a status set. To set one, use ~status set [message].", origin);
            } else {
                bot.post(`Your status:
    ${db.get("MDW125-STATUS-" + user)}`, origin);
            }
        }
    }

    if (message.startsWith("~credits")) {
    	bot.post(`Creator: M.D. Walters
Hosting: M.D. Walters (MDWalters125), JoshAtticus (MDBot)
Bot Library: MeowerBot.js`, origin);
    }

    if (message.startsWith("~karma")) {
    	if (message.split(" ")[1] === "upvote") {
            if (!(db.has(`MDW125-KARMA-${message.split(" ")[2]}`))) {
                if (message.split(" ")[2] === user) {
                    bot.post("You can't upvote yourself!", origin);
                } else {
                    db.set(`MDW125-KARMA-${message.split(" ")[2]}`, 1);
                    bot.post(`Successfully upvoted @${message.split(" ")[2]}! They now have 1 karma.`, origin);
                }
            } else {
                if (message.split(" ")[2] === user) {
                    bot.post("You can't upvote yourself!", origin);
                } else {
                    db.set(`MDW125-KARMA-${message.split(" ")[2]}`, (parseInt(db.get(`MDW125-KARMA-${message.split(" ")[2]}`)) + 1));
                    bot.post(`Successfully upvoted @${message.split(" ")[2]}! They now have ${db.get("MDW125-KARMA-" + message.split(" ")[2])} karma.`, origin);
                }
            }
        } else if (message.split(" ")[1] === "downvote") {
            if (!(db.has(`MDW125-KARMA-${message.split(" ")[2]}`))) {
                if (message.split(" ")[2] === user) {
                    bot.post("You can't downvote yourself!", origin);
                } else {
                    db.set(`MDW125-KARMA-${message.split(" ")[2]}`, -1);
                    bot.post(`Successfully downvoted @${message.split(" ")[2]}. They now have -1 karma.`, origin);
                }
            } else {
                if (message.split(" ")[2] === user) {
                    bot.post("You can't downvote yourself!", origin);
                } else {
                    db.set(`MDW125-KARMA-${message.split(" ")[2]}`, (parseInt(db.get(`MDW125-KARMA-${message.split(" ")[2]}`)) - 1));
                    bot.post(`Successfully downvoted @${message.split(" ")[2]}! They now have ${db.get("MDW125-KARMA-" + message.split(" ")[2])} karma.`, origin);
                }
            }
        } else if (message.split(" ")[1] === "view") {
            if (message.split(" ")[2] === user) {
                if (!(db.has(`MDW125-KARMA-${user}`))) {
                    bot.post(`You have 0 karma.`, origin);
                } else {
                    bot.post(`You have ${db.get("MDW125-KARMA-" + user)} karma.`, origin);
                }
            } else {
                if (!(db.has(`MDW125-KARMA-${message.split(" ")[2]}`))) {
                    bot.post(`@${message.split(" ")[2]} has 0 karma.`, origin);
                } else {
                    bot.post(`@${message.split(" ")[2]} has ${db.get("MDW125-KARMA-" + message.split(" ")[2])} karma.`, origin);
                }
            }
        } else {
            if (!(db.has(`MDW125-KARMA-${user}`))) {
                bot.post(`You have 0 karma.`, origin);
            } else {
                bot.post(`You have ${db.get("MDW125-KARMA-" + user)} karma.`, origin);
            }
        }
    }

    if (message.startsWith("~mute")) {
        if (admins.includes(user)) {
            if (db.has(`MDW125-MUTED-${message.split(" ")[1]}`)) {
                bot.post(`@${message.split(" ")[1]} is already muted!`, origin);
            } else {
                if (message.split(" ")[2]) {
                    db.set(`MDW125-MUTED-${message.split(" ")[1]}`, message.split(" ").slice(2, message.split(" ").length).join(" "));
                } else {
                    db.set(`MDW125-MUTED-${message.split(" ")[1]}`, null);
                }
                bot.post(`Successfully muted @${message.split(" ")[1]}!`, origin);
            }
        } else {
            bot.post("You don't have the permissions to run this command.", origin);
        }
    }

    if (message.startsWith("~unmute")) {
        if (admins.includes(user)) {
            if (!(db.has(`MDW125-MUTED-${message.split(" ")[1]}`))) {
                bot.post(`@${message.split(" ")[1]} isn't muted!`, origin);
            } else {
                db.delete(`MDW125-MUTED-${message.split(" ")[1]}`);
                bot.post(`Successfully unmuted @${message.split(" ")[1]}!`, origin);
            }
        } else {
            bot.post("You don't have the permissions to run this command.", origin);
        }
    }

    if (message.startsWith("~wordle")) {
        if (message.split(" ")[1] === "new") {
            let word = await fetch("https://random-word-api.herokuapp.com/word?length=5").then(res => res.text());
            wordle.init(JSON.parse(word)[0]);
            bot.post("New Wordle game started! Use ~wordle guess [word] to guess a word.", origin);
        } else if (message.split(" ")[1] === "guess") {
            try {
                let grid = wordle.guess(message.split(" ")[2]);
                bot.post(`${wordle.grid[0].join("")}
${wordle.grid[1].join("")}
${wordle.grid[2].join("")}
${wordle.grid[3].join("")}
${wordle.grid[4].join("")}
${wordle.grid[5].join("")}          
`, origin);
            } catch(e) {
                bot.post(`${e}`, origin);
            }
        } else if (message.split(" ")[1] === "grid") {
            bot.post(`${wordle.grid[0].join("")}
${wordle.grid[1].join("")}
${wordle.grid[2].join("")}
${wordle.grid[3].join("")}
${wordle.grid[4].join("")}
${wordle.grid[5].join("")}          
`, origin);
        }
    }
});

bot.onMessage((messageData) => {
    console.log(`New message: ${messageData}`);
});

bot.onClose(() => {
    let command = exec("npm run start");
    command.stdout.on("data", (output) => {
        console.log(output.toString());
    });
});

bot.onLogin(() => {
    bot.post(`${username} is now online! Use ~help to see a list of commands.`);
});
