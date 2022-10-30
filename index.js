const WebSocket = require("ws");
const {LocalStorage} = require("node-localstorage");
const fetch = require("fetch").fetchUrl;
require("dotenv").config();

const username = process.env.MDW125_USERNAME;
const password = process.env.MDW125_PASSWORD;

const uptime = new Date();
const help = ["~hello", "~help", "~say", "~amazing", "~uptime", "~uwu", "~8ball", "~motd", "~zen", "~shorten", "~cat", "~status"];
const eightBall = ["It is certain.", "It is decidedly so.", "Without a doubt.", "Yes, definitely.", "You may rely on it.", "As I see it, yes.", "Most likely.", "Outlook good.", "Yes.", "Signs point to yes.", "Reply hazy, try again.", "Ask again later.", "Better not tell you now.", "Cannot predict now.", "Concentrate and ask again.", "Don't count on it.", "My reply is no.", "My sources say no.", "Outlook not so good.", "Very doubtful."];
const motd = ["Meower is not dead", "Furries can do infinite crime", "~8ball get a life?", "Never gonna give you up", "usebottles", "Why did the chicken cross the road? To get to the other side", "Made in Canada", "The question that I always ask Bill Gates is why Windows is closed-source", "M.D. created Markdown, you can't deny that", "Proudly Furry", "You are currently muted from MDWalters125.", "MDWalters125 is now online! Use ~help to see a list of commands."];
const muted = ["Eris"];

const localStorage = new LocalStorage("./localStorage");

async function fetchURL(url) {
    await fetch(url, function(error, meta, body) {
        return body.toString();
    });
}

async function handlePost(user, message) {
    if (user == "Discord") {
        if (message.split(": ")[0] && message.split(": ")[1]) {
            handlePost(message.split(": ")[0], message.split(": ")[1]);
        }
    }

    if (user == username) {
        return;
    }

    if (message.startsWith("~") && muted.includes(user)) {
        post("You are currently muted from MDWalters125.");
        return;
    }

    if (message.startsWith("~") && !(help.includes(message.split(" ")[0]))) {
        if (message.startsWith("~!")) {
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

    if (message.startsWith("~say")) {
        post(message.split(" ").slice(1, message.split(" ").length).join(" "));
    }

    if (message.startsWith("~amazing")) {
        post(`Amazing ${message.split(" ").slice(1, message.split(" ").length).join(" ")}`);
    }

    if (message.startsWith("~uptime")) {
        post(uptime);
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
            var short = await fetchURL(`https://api.shrtco.de/v2/shorten?url=${message.split(" ")[1]}`);
            var short = JSON.parse(short);
            post(short.result.full_short_link);
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
                post(`Your status: ${localStorage.getItem("MDW125-STATUS-" + user)}`);
            } else {
                if (localStorage.getItem("MDW125-STATUS-" + message.split(" ")[2]) === null) {
                    post(`@${message.split(" ")[2]} doesn't have a status set.`);
                } else {
                    post(`@${message.split(" ")[2]}'s status: ${localStorage.getItem("MDW125-STATUS-" + message.split(" ")[2])}`);
                }
            }    
        } else {
            if (localStorage.getItem("MDW125-STATUS-" + user) === null) {
                post(`You don't have a status set. To set one, use ~status set [message].`);
            } else {
                post(`Your status: ${localStorage.getItem("MDW125-STATUS-" + user)}`);
            }
        }
    }
}

function post(content) {
    ws.send(`{"cmd": "direct", "val": {"cmd": "post_home", "val": "${content}"}}`);
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
const ws = new WebSocket("wss://server.meower.org/");

ws.on('open', connect);
ws.on('close', function() {
    throw new Error("Websocket closed");
});

ws.on('message', function message(data) {
    var messageData = `${data}`;
    var messageData = JSON.parse(messageData);
    if (messageData.val.type === 1) {
        console.log(`${messageData.val.u}: ${messageData.val.p}`);
        handlePost(messageData.val.u, messageData.val.p);
    } else if (messageData.cmd === "ping") {
        if (messageData.val === "I:100 | OK") {
            console.log("Ping is OK");
        } else {
            console.log("Ping is not OK");
        }
    } else if (messageData.val.state === 101) {
        console.log(`${messageData.val.u} is typing...`);
    } else if (messageData.cmd === "ulist") {
        console.log(`Users online: ${messageData.val.split(";").join(", ")}`);
    } else if (messageData.cmd === "statuscode") {
        console.log(`Status: ${messageData.val}`);
    } else {
        console.log(`New message: ${data}`);
    }
});

setInterval(function() {
    if (ws.readyState == 1) {
        ws.send('{"cmd": "ping", "val": ""}');
    }
}, 15000);