import Bot from "meowerbot";
import fetch from "node-fetch";
import {exec} from "child_process";
import * as dotenv from "dotenv";
import JSONdb from "simple-json-db";

dotenv.config();

const username = process.env["MDW125_USERNAME"];
const password = process.env["MDW125_PASSWORD"];
const uptime = new Date().getTime();
const help = ["~hello", "~help", "~amazing", "~uptime", "~uwu", "~8ball", "~motd", "~zen", "~shorten", "~cat", "~status", "~credits", "~karma", "~mute", "~unmute"];
const admins = ["MDWalters124", "m", "JoshAtticus"];
const db = new JSONdb("db.json");
const bot = new Bot(username, password);

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

bot.onPost(async (user, message) => {
    if (message.startsWith("~") && db.has(`MDW125-MUTED-${user}`)) {
        if (db.get(`MDW125-MUTED-${user}`)) {
            bot.post(`You are currently muted from ${username}.
Reason: "${db.get(`MDW125-MUTED-${user}`)}"`);
        } else {
            bot.post(`You are currently muted from ${username}.`);
        }
        return;
    }

    if (message.startsWith("~") && !(help.includes(message.split(" ")[0]))) {
        if (message.startsWith("~! ")) {
            return;
        }
        bot.post("That command doesn't exist! Use ~help to see a list of commands.");
        return;
    }

    if (message.startsWith("~hello")) {
        if (message.split(" ")[1] === undefined) {
            bot.post(`Hello, ${user}!`);
        } else {
            bot.post(`Hello, ${message.split(" ").slice(1, message.split(" ").length).join(" ")}!`);
        }
    }

    if (message.startsWith("~help")) {
        bot.post(`Commands: ${help.join(", ")}`);
    }

    if (message.startsWith("~amazing")) {
        bot.post(`Amazing ${message.split(" ").slice(1, message.split(" ").length).join(" ")}`);
    }

    if (message.startsWith("~uptime")) {
        bot.post(`${username} was online since ${epochToRelative(uptime)}.`);
    }

    if (message.startsWith("~uwu")) {
        bot.post("UwU");
    }

    if (message.startsWith("~8ball")) {
        var eightBall = ["It is certain.", "It is decidedly so.", "Without a doubt.", "Yes, definitely.", "You may rely on it.", "As I see it, yes.", "Most likely.", "Outlook good.", "Yes.", "Signs point to yes.", "Reply hazy, try again.", "Ask again later.", "Better not tell you now.", "Cannot predict now.", "Concentrate and ask again.", "Don't count on it.", "My reply is no.", "My sources say no.", "Outlook not so good.", "Very doubtful."];
    	bot.post(eightBall[Math.floor(Math.random() * eightBall.length)]);
    }

    if (message.startsWith("~motd")) {
        var motd = ["Meower is not dead", "Furries can do infinite crime", "~8ball get a life?", "Never gonna give you up", "usebottles", "Why did the chicken cross the road? To get to the other side", "Made in Canada", "The question that I always ask Bill Gates is why Windows is closed-source", "M.D. created Markdown, you can't deny that", "Proudly Furry", "You are currently muted from MDWalters125.", "MDWalters125 is now online! Use ~help to see a list of commands.", "Hello from Node.js!"];
    	bot.post(motd[Math.floor(Math.random() * motd.length)]);
    }

    if (message.startsWith("~zen")) {
        bot.post(await fetch("https://api.github.com/zen").then(res => res.text()));
    }

    if (message.startsWith("~shorten")) {
        if (message.split(" ")[1] === undefined) {
            bot.post("https://shrtco.de/enVsHi");
        } else {
            var short = JSON.parse(await fetch(`https://api.shrtco.de/v2/shorten?url=${message.split(" ")[1]}`).then(res => res.json()));
            bot.post(short.result.full_short_link);
        }
    }

    if (message.startsWith("~cat")) {
        var image = await fetch("https://aws.random.cat/meow").then(res => res.json());
        bot.post(image.file);
    }

    if (message.startsWith("~status")) {
        if (message.split(" ")[1] === "set") {
            db.set(`MDW125-STATUS-${user}`, message.split(" ").slice(2, message.split(" ").length).join(" "));
            bot.post("Status successfully set!");
        } else if (message.split(" ")[1] === "clear") {
            db.delete(`MDW125-STATUS-${user}`);
            bot.post("Status successfully cleared!");
        } else if (message.split(" ")[1] === "view") {
            if (message.split(" ")[2] === user) {
                if (!(db.has(`MDW125-STATUS-${user}`))) {
                    bot.post("You don't have a status set. To set one, use ~status set [message].");
                } else {
                    bot.post(`Your status: ${db.get("MDW125-STATUS-" + user)}`);
                }
            } else {
                if (!(db.has(`MDW125-STATUS-${user}`))) {
                    bot.post(`@${message.split(" ")[2]} doesn't have a status set.`);
                } else {
                    bot.post(`@${message.split(" ")[2]}'s status: ${db.get("MDW125-STATUS-" + message.split(" ")[2])}`);
                }
            }    
        } else {
            if (!(db.has(`MDW125-STATUS-${user}`))) {
                bot.post("You don't have a status set. To set one, use ~status set [message].");
            } else {
                bot.post(`Your status: ${db.get("MDW125-STATUS-" + user)}`);
            }
        }
    }

    if (message.startsWith("~credits")) {
    	bot.post(`Creator: M.D. Walters
Hosting: M.D. Walters (MDWalters125), JoshAtticus (MDBot)
Bot Library: MeowerBot.js `);
    }

    if (message.startsWith("~karma")) {
    	if (message.split(" ")[1] === "upvote") {
            if (!(db.has(`MDW125-KARMA-${message.split(" ")[2]}`))) {
                if (message.split(" ")[2] === user) {
                    bot.post("You can't upvote yourself!");
                } else {
                    db.set(`MDW125-KARMA-${message.split(" ")[2]}`, 1);
                    bot.post(`Successfully upvoted @${message.split(" ")[2]}! They now have 1 karma.`);
                }
            } else {
                if (message.split(" ")[2] === user) {
                    bot.post("You can't upvote yourself!");
                } else {
                    db.set(`MDW125-KARMA-${message.split(" ")[2]}`, (parseInt(db.get(`MDW125-KARMA-${message.split(" ")[2]}`)) + 1));
                    bot.post(`Successfully upvoted @${message.split(" ")[2]}! They now have ${db.get("MDW125-KARMA-" + message.split(" ")[2])} karma.`);
                }
            }
        } else if (message.split(" ")[1] === "downvote") {
            if (!(db.has(`MDW125-KARMA-${message.split(" ")[2]}`))) {
                if (message.split(" ")[2] === user) {
                    bot.post("You can't downvote yourself!");
                } else {
                    db.set(`MDW125-KARMA-${message.split(" ")[2]}`, -1);
                    bot.post(`Successfully downvoted @${message.split(" ")[2]}. They now have -1 karma.`);
                }
            } else {
                if (message.split(" ")[2] === user) {
                    bot.post("You can't downvote yourself!");
                } else {
                    db.set(`MDW125-KARMA-${message.split(" ")[2]}`, (parseInt(db.get(`MDW125-KARMA-${message.split(" ")[2]}`)) - 1));
                    bot.post(`Successfully downvoted @${message.split(" ")[2]}! They now have ${db.get("MDW125-KARMA-" + message.split(" ")[2])} karma.`);
                }
            }
        } else if (message.split(" ")[1] === "view") {
            if (message.split(" ")[2] === user) {
                if (!(db.has(`MDW125-KARMA-${user}`))) {
                    bot.post(`You have 0 karma.`);
                } else {
                    bot.post(`You have ${db.get("MDW125-KARMA-" + user)} karma.`);
                }
            } else {
                if (!(db.has(`MDW125-KARMA-${message.split(" ")[2]}`))) {
                    bot.post(`@${message.split(" ")[2]} has 0 karma.`);
                } else {
                    bot.post(`@${message.split(" ")[2]} has ${db.get("MDW125-KARMA-" + message.split(" ")[2])} karma.`);
                }
            }
        } else {
            if (!(db.has(`MDW125-KARMA-${user}`))) {
                bot.post(`You have 0 karma.`);
            } else {
                bot.post(`You have ${db.get("MDW125-KARMA-" + user)} karma.`);
            }
        }
    }

    if (message.startsWith("~mute")) {
        if (admins.includes(user)) {
            if (db.has(`MDW125-MUTED-${message.split(" ")[1]}`)) {
                bot.post(`@${message.split(" ")[1]} is already muted!`);
            } else {
                if (message.split(" ")[2]) {
                    db.set(`MDW125-MUTED-${message.split(" ")[1]}`, message.split(" ").slice(2, message.split(" ").length).join(" "));
                } else {
                    db.set(`MDW125-MUTED-${message.split(" ")[1]}`, null);
                }
                bot.post(`Successfully muted @${message.split(" ")[1]}!`);
            }
        } else {
            bot.post("You don't have the permissions to run this command.");
        }
    }

    if (message.startsWith("~unmute")) {
        if (admins.includes(user)) {
            if (!(db.has(`MDW125-MUTED-${message.split(" ")[1]}`))) {
                bot.post(`@${message.split(" ")[1]} isn't muted!`);
            } else {
                db.delete(`MDW125-MUTED-${message.split(" ")[1]}`);
                bot.post(`Successfully unmuted @${message.split(" ")[1]}!`);
            }
        } else {
            bot.post("You don't have the permissions to run this command.");
        }
    }
});

bot.onMessage((messageData) => {
    if (messageData.val.type === 1) {
        console.log(`${messageData.val.u}: ${messageData.val.p}`);
    } else if (messageData.cmd === "ping") {
        if (messageData.val === "I:100 | OK") {
            console.log("Ping is OK");
        } else {
            console.error("Ping is not OK");
        }
    } else if (messageData.val.state === 101 || messageData.val.state === 100) {
        console.log(`${messageData.val.u} is typing...`);
    } else if (messageData.cmd === "ulist") {
        console.log(`Users online: ${messageData.val.split(";").join(", ")}`);
    } else if (messageData.cmd === "statuscode") {
        if (messageData.val.startsWith("E")) {
            console.error(`Status: ${messageData.val}`);
        } else if (messageData.val.startsWith("I:100")) {
            console.log(`Status: ${messageData.val}`);
        } else {
            console.log(`Status: ${messageData.val}`);
        }
    } else if (messageData.val.cmd === "motd") {
        console.log(`MOTD: ${messageData.val.val}`);
    } else if (messageData.val.cmd === "vers") {
        console.log(`Meower Server Version: ${messageData.val.val}`);
    } else if (messageData.val.state === 1) {
        console.log(`${messageData.val.u} joined ${messageData.val.chatid}`);
    } else if (messageData.val.state === 0) {
        console.log(`${messageData.val.u} left ${messageData.val.chatid}`);
    } else if (messageData.val.mode === "auth") {
        console.log(`Logged in as "${messageData.val.payload.username}" (${messageData.val.payload.token})`);
    } else {
        console.log(`New message: ${JSON.stringify(messageData)}`);
    }
});

bot.onClose(() => {
    var command = exec("npm run start");
    command.stdout.on("data", (output) => {
        console.log(output.toString());
    });
});

bot.onLogin(() => {
    bot.post(`${username} is now online! Use ~help to see a list of commands.`);
});