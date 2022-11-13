import WebSocket from "ws";
import {LocalStorage} from "node-localstorage";
import fetch from "node-fetch";
import {exec} from "child_process";
import * as dotenv from "dotenv";

dotenv.config();

const username = process.env["MDW125_USERNAME"];
const password = process.env["MDW125_PASSWORD"];

const uptime = new Date().getTime();
const help = ["~hello", "~help", "~amazing", "~uptime", "~uwu", "~8ball", "~motd", "~zen", "~shorten", "~cat", "~status", "~credits"];
const eightBall = ["It is certain.", "It is decidedly so.", "Without a doubt.", "Yes, definitely.", "You may rely on it.", "As I see it, yes.", "Most likely.", "Outlook good.", "Yes.", "Signs point to yes.", "Reply hazy, try again.", "Ask again later.", "Better not tell you now.", "Cannot predict now.", "Concentrate and ask again.", "Don't count on it.", "My reply is no.", "My sources say no.", "Outlook not so good.", "Very doubtful."];
const motd = ["Meower is not dead", "Furries can do infinite crime", "~8ball get a life?", "Never gonna give you up", "usebottles", "Why did the chicken cross the road? To get to the other side", "Made in Canada", "The question that I always ask Bill Gates is why Windows is closed-source", "M.D. created Markdown, you can't deny that", "Proudly Furry", "You are currently muted from MDWalters125.", "MDWalters125 is now online! Use ~help to see a list of commands.", "Hello from Node.js!"];
const muted = [];

const localStorage = new LocalStorage("./localStorage");

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
        } else {
            return "just now";
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

async function fetchURL(url) {
    return await fetch(url).then(res => res.text());
}

async function handlePost(user, message) {
    if (user == "Discord") {
        if (message.split(": ")[0] && message.split(": ")[1]) {
            handlePost(message.split(": ")[0], message.split(": ")[1]);
        }
    }

    if (user === username) {
        return;
    }

    if (message.startsWith("~") && muted.includes(user)) {
        post("You are currently muted from MDWalters125.");
        return;
    }

    if (message.startsWith("~") && !(help.includes(message.split(" ")[0]))) {
        if (message.startsWith("~! ")) {
            return;
        }
        post("That command doesn't exist! Use ~help to see a list of commands.");
        return;
    }

    if (message.startsWith("~hello")) {
        if (message.split(" ")[1] === undefined) {
            post(`Hello, ${user}!`);
        } else {
            post(`Hello, ${message.split(" ").slice(1, message.split(" ").length).join(" ")}!`);
        }
    }

    if (message.startsWith("~help")) {
        post(`${help.join(", ")}`);
    }

    if (message.startsWith("~amazing")) {
        post(`Amazing ${message.split(" ").slice(1, message.split(" ").length).join(" ")}`);
    }

    if (message.startsWith("~uptime")) {
        post(`MDWalters125 was online since ${epochToRelative(uptime)}.`);
    }

    if (message.startsWith("~uwu")) {
        post("UwU");
    }

    if (message.startsWith("~8ball")) {
    	post(eightBall[Math.floor(Math.random() * eightBall.length)]);
    }

    if (message.startsWith("~motd")) {
    	post(motd[Math.floor(Math.random() * motd.length)]);
    }

    if (message.startsWith("~zen")) {
        post(await fetchURL("https://api.github.com/zen"));
    }

    if (message.startsWith("~shorten")) {
        if (message.split(" ")[1] === undefined) {
            post("https://shrtco.de/enVsHi");
        } else {
            for (let i = 0; i < message.split(" ").length; i++) {
                var short = await fetchURL(`https://api.shrtco.de/v2/shorten?url=${message.split(" ")[i]}`);
                var short = JSON.parse(short);
                post(short.result.full_short_link);
            }
        }
    }

    if (message.startsWith("~cat")) {
        var image = await fetchURL("https://aws.random.cat/meow");
        var image = JSON.parse(image);
        post(image.file);
    }

    if (message.startsWith("~status")) {
        if (message.split(" ")[1] === "set") {
            localStorage.setItem(`MDW125-STATUS-${user}`, message.split(" ").slice(2, message.split(" ").length).join(" "));
            post("Status successfully set!");
        } else if (message.split(" ")[1] === "clear") {
            localStorage.removeItem(`MDW125-STATUS-${user}`);
            post("Status successfully cleared!");
        } else if (message.split(" ")[1] === "view") {
            if (message.split(" ")[2] === user) {
                if (localStorage.getItem(`MDW125-STATUS-${user}`) === null) {
                    post("You don't have a status set. To set one, use ~status set [message].");
                } else {
                    post(`Your status: ${localStorage.getItem("MDW125-STATUS-" + user)}`);
                }
            } else {
                if (localStorage.getItem("MDW125-STATUS-" + message.split(" ")[2]) === null) {
                    post(`@${message.split(" ")[2]} doesn't have a status set.`);
                } else {
                    post(`@${message.split(" ")[2]}'s status: ${localStorage.getItem("MDW125-STATUS-" + message.split(" ")[2])}`);
                }
            }    
        } else {
            if (localStorage.getItem("MDW125-STATUS-" + user) === null) {
                post("You don't have a status set. To set one, use ~status set [message].");
            } else {
                post(`Your status: ${localStorage.getItem("MDW125-STATUS-" + user)}`);
            }
        }
    }

    if (message.startsWith("~credits")) {
    	post("Creator: M.D. Walters\nHosting: M.D. Walters (MDWalters125), JoshAtticus (MDBot)");
    }
}

function post(content) {
    ws.send(JSON.stringify({"cmd": "direct", "val": {"cmd": "post_home", "val": content}}));
}

async function connect() {
    console.log("Connected");
    ws.send('{"cmd": "direct", "val": {"cmd": "type", "val": "js"}}');
    ws.send(`{"cmd": "direct", "val": {"cmd": "ip", "val": "${await fetchURL("https://api.meower.org/ip")}"}}`);
    ws.send('{"cmd": "direct", "val": "meower"}');
    ws.send('{"cmd": "direct", "val": {"cmd": "version_chk", "val": "scratch-beta-5-r7"}}');
    ws.send(`{"cmd": "direct", "val": {"cmd": "authpswd", "val": {"username": "${username}", "pswd": "${password}"}}}`);
    console.log("Logged in");
    setTimeout(function() {
        post("MDWalters125 is now online! Use ~help to see a list of commands.");
    }, 1000);
}

console.log("Connecting...");
var ws = new WebSocket("wss://server.meower.org/");

ws.on("open", connect);
ws.on("close", function() {
    console.error("Disconnected");
    var command = exec("npm run start");
    command.stdout.on('data', output => {
        console.log(output.toString());
    });
});

ws.on("message", function message(data) {
    var messageData = JSON.parse(data);
    if (messageData.val.type === 1) {
        console.log(`${messageData.val.u}: ${messageData.val.p}`);
        if (messageData.val.post_origin === "home") {
            handlePost(messageData.val.u, messageData.val.p);
        } else {
            return;
        }
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
    } else {
        console.log(`New message: ${data}`);
    }
});

setInterval(function() {
    if (ws.readyState == 1) {
        ws.send('{"cmd": "ping", "val": ""}');
    }
}, 15000);
