// @ts-nocheck
import Bot from "meowerbot";
import fetch from "node-fetch";
import * as dotenv from "dotenv";
import { MongoClient } from "mongodb";

import { log } from "../lib/logs.js";
import Wordle from "../lib/wordle.js";
import { toRelative } from "../lib/relative.js";
import { pfp, lvl } from "../lib/whois-utils.js";
// import Place from "../lib/place.js";
import { welcome_msg } from "../lib/welcome.js";
import { Status, Karma, Place, Mute, Poll, PollAnswer, User, UserPosts } from "../lib/interfaces.js";

dotenv.config();

const username = process.env["MDW125_USERNAME"];
const password = process.env["MDW125_PASSWORD"];
const uptime: number = new Date().getTime();
const help: string[] = [
    "help",
    "uptime",
    "uwu",
    "8ball",
    "zen",
    "shorten",
    "cat",
    "status",
    "credits",
    "karma",
    "mute",
    "unmute",
    "wordle",
    "poll",
    "whois",
    "place"
];
const admins: string[] = ["mdwalters", "m", "JoshAtticus", "AltJosh"];
const db = new MongoClient(process.env["MDW125_MONGODB_URL"]).db("MDWalters125");
const bot = new Bot();
const wordle = new Wordle();
// const place = new Place(db);

bot.onPost(async (user: string, message: string, origin: string | null) => {
    if (message.startsWith(`@${username} `)) {
        const muted: Promise<Mute | null> = await db.collection("mutes").find({ username: user });
        if (!muted) {
            if (muted.reason) {
                bot.post(`You are currently muted from ${username}.
Reason: "${muted.reason}"`, origin);
                log(`${user} tried to use the command "${message}", but they are muted from ${username} for "${muted.reason}"`);
                return;
            } else {
                bot.post(`You are currently muted from ${username}.`, origin);
                log(`${user} tried to use the command "${message}", but they are muted from ${username}`);
                return;
            }
        }
    }

    if (message.startsWith(`@${username} `) && !(help.includes(`${message.split(" ")[1]}`))) {
        bot.post(`That command doesn't exist! Use @${username} help to see a list of commands.`, origin);
        log(`${user} tried to use a command that does not exist. The command was "${message}"`);
        return;
    }

    if (message.startsWith(`@${username} help`)) {
        if (message.split(" ")[2] === undefined) {
            bot.post(`Commands:
    ${help.join("\n    ")}`, origin);
        } else {
            switch(message.split(" ")[2]) {
            case "help":
                bot.post(`@${username} help:
    Shows you a list of commands.`, origin);
                break;
            case "uptime":
                bot.post(`@${username} uptime:
    Shows you how long the bot was online for.`, origin);
                break;
            case "uwu":
                bot.post(`@${username} uwu:
    Posts "UwU".`, origin);
                break;
            case "8ball":
                bot.post(`@${username} 8ball:
    Makes a prediction.`, origin);
                break;
            case "zen":
                bot.post(`@${username} zen:
    Posts zen quotes from GitHub's API.`, origin);
                break;
            case "shorten":
                bot.post(`@${username} shorten:
    Shortens links via shortco.de's API.`, origin);
                break;
            case "cat":
                bot.post(`@${username} cat:
    Posts random cat pictures.`, origin);
                break;
            case "status":
                bot.post(`@${username} status:
    Lets you view, and set a status.`, origin);
                break;
            case "credits":
                bot.post(`@${username} credits:
    Lists everyone behind ${username}!`, origin);
                break;
            case "karma":
                bot.post(`@${username} karma:
    Upvote, downvote, and view someone's karma.`, origin);
                break;
            case "mute":
                bot.post(`@${username} mute:
    Mutes the specified user. Must be a bot admin to do this.`, origin);
                break;
            case "unmute":
                bot.post(`@${username} unmute:
    Unmutes the specified user. Must be a bot admin to do this.`, origin);
                break;
            case "wordle":
                bot.post(`@${username} wordle:
    Lets you play wordle.`, origin);
                break;
            case "poll":
                bot.post(`@${username} poll:
    Create and answer polls.`, origin);
                break;
            case "place":
                bot.post(`@${username} place:
    Lets you make pixel art on a public canvas.`, origin);
                break;
            default:
                bot.post("This command doesn't exist!", origin);
                log(`${user} tried to get help on a command that does not exist. The command was "${message}"`);
            }
        }
    }

    if (message.startsWith(`@${username} uptime`)) {
        bot.post(`${username} was online since ${toRelative(uptime)}.`, origin);
        log(`${user} used the command ${message}`);
    }

    if (message.startsWith(`@${username} uwu`)) {
        bot.post("UwU", origin);
        log(`${user} used the command ${message}`);
    }

    if (message.startsWith(`@${username} 8ball`)) {
        const eightBall: string[] = [
            "It is certain.",
            "It is decidedly so.",
            "Without a doubt.",
            "Yes, definitely.",
            "You may rely on it.",
            "As I see it, yes.",
            "Most likely.",
            "Outlook good.",
            "Yes.",
            "Signs point to yes.",
            "Reply hazy, try again.",
            "Ask again later.",
            "Better not tell you now.",
            "Cannot predict now.",
            "Concentrate and ask again.",
            "Don't count on it.",
            "My reply is no.",
            "My sources say no.",
            "Outlook not so good.",
            "Very doubtful.",
            "No.",
            "What do you mean?",
            "What?",
            "Highly unlikely.",
        ];
        bot.post(`The Eight-Ball says...\n${eightBall[Math.floor(Math.random() * eightBall.length)]}`, origin);
        log(`${user} used the command ${message}`);
    }

    if (message.startsWith(`@${username} zen`)) {
        bot.post(await fetch("https://api.github.com/zen").then(res => res.text()), origin);
        log(`${user} used the command ${message}`);
    }

    if (message.startsWith(`@${username} shorten`)) {
        if (message.split(" ")[2] === undefined) {
            bot.post("You need to specify a website to shorten!", origin);
            log(`${user} used the command ${message}`);
        } else {
            const link: Promise<object> = await fetch(`https://api.shrtco.de/v2/shorten?url=${message.split(" ")[2]}`).then(res => res.json());
            bot.post(link.result.full_short_link, origin);
            log(`${user} used the command ${message}`);
        }
    }

    if (message.startsWith(`@${username} cat`)) {
        if (Math.floor(Math.random() * 1) == 1) {
            bot.post("[@cat: https://arrow.pages.dev/favicon.png]", origin);
        } else {
            const image: Promise<object> = await fetch("https://aws.random.cat/meow").then(res => res.json());
            bot.post(`[Random cat image: ${image.file}]`, origin);
            log(`${user} used the command ${message}`);
        }
    }

    if (message.startsWith(`@${username} status`)) {
        if (message.split(" ")[2] === "set") {
            db.collection("status").updateOne({
                username: user
            }, {
                $set: {
                    username: user,
                    status: message.split(" ").slice(3, message.split(" ").length).join(" ")
                }
            }, {
                upsert: true
            });
            bot.post("Status successfully set!", origin);
            log(`${user} set their status with the command "${message}"`);
        } else if (message.split(" ")[2] === "clear") {
            db.collection("status").deleteOne({ username: user });
            bot.post("Status successfully cleared!", origin);
            log(`${user} cleared their status with the command "${message}"`);
        } else if (message.split(" ")[2] === "view") {
            const status: Promise<Status | null> = await db.collection("status").findOne({ username: user });
            if (message.split(" ")[3] === user) {
                if (!status) {
                    bot.post(`You don't have a status set. To set one, use @${username} status set [message].`, origin);
                    log(`${user} tried to view their status, but they don't have one set. They used the command "[message]"`);
                } else {
                    bot.post(`Your status:
    ${status.status}`, origin);
                    log(`${user} viewed their status with the command "${message}"`);
                }
            } else {
                const status: Promise<Status | null> = await db.collection("status").findOne({ username: message.split(" ")[3] });
                if (status) {
                    bot.post(`@${message.split(" ")[3]}'s status:
    ${status.status}`, origin);
                    log(`${user} viewed someone else's status with the command "${message}"`);
                } else {
                    bot.post(`@${message.split(" ")[3]} doesn't have a status set.`, origin);
                    log(`${user} + " tried to view someone else's status, but they don't have one set. They used the command "${message}"`);
                }
            }    
        } else {
            const status: Promise<Status | null> = await db.collection("status").findOne({ username: user });
            if (!status) {
                bot.post(`You don't have a status set. To set one, use @${username} status set [message].`, origin);
                log(`${user} tried to view their status, but they don't have one set. They used the command "${message}"`);
            } else {
                bot.post(`Your status:
    ${status.status}`, origin);
                log(`${user} viewed their status with the command "${message}"`);
            }
        }
    }

    if (message.startsWith(`@${username} credits`)) {
        bot.post(`Creator: M.D. Walters
Hosting: M.D. Walters (MDWalters125), JoshAtticus (MDBot)
Bot Library: MeowerBot.js`, origin);
        log(`${user} used the command ${message}`);
    }

    if (message.startsWith(`@${username} karma`)) {
        if (message.split(" ")[2] === "upvote") {
            const karma: Promise<Karma | null> = await db.collection("karma").findOne({ username: user });
            if (!karma) {
                if (message.split(" ")[3] === user) {
                    bot.post("You can't upvote yourself!", origin);
                    log(`${user} tried to upvote themselves unsucessfully with the command ${message}`);
                } else {
                    db.collection("karma").updateOne({
                        username: message.split(" ")[3]
                    }, {
                        $set: {
                            username: message.split(" ")[3],
                            karma: 2
                        }
                    }, {
                        upsert: true
                    });
                    bot.post(`Successfully upvoted @${message.split(" ")[3]}! They now have 2 karma.`, origin);
                    log(`${user} upvoted someone with the command "${message}"`);
                }
            } else {
                if (message.split(" ")[3] === user) {
                    bot.post("You can't upvote yourself!", origin);
                    log(`${user} tried to upvote themselves unsucessfully with the command ${message}`);
                } else {
                    const karma: Promise<Karma | null> = await db.collection("karma").findOne({ username: message.split(" ")[3] });
                    db.collection("karma").updateOne({
                        username: message.split(" ")[3]
                    }, {
                        $set: {
                            username: message.split(" ")[3],
                            karma: karma.karma + 1
                        }
                    }, {
                        upsert: true
                    });
                    bot.post(`Successfully upvoted @${message.split(" ")[3]}! They now have ${karma.karma + 1} karma.`, origin);
                    log(`${user} upvoted someone with the command "${message}"`);
                }
            }
        } else if (message.split(" ")[2] === "downvote") {
            const karma: Promise<Karma | null> = await db.collection("karma").findOne({ username: message.split(" ")[3] });
            if (!karma) {
                if (message.split(" ")[3] === user) {
                    bot.post("You can't downvote yourself!", origin);
                    log(`${user} tried to downvote themselves unsucessfully with the command "${message}"`);
                } else {
                    db.collection("karma").updateOne({
                        username: message.split(" ")[3]
                    }, {
                        $set: {
                            username: message.split(" ")[3],
                            karma: 0
                        }
                    }, {
                        upsert: true
                    });
                    bot.post(`Successfully downvoted @${message.split(" ")[3]}. They now have 0 karma.`, origin);
                    log(`${user} downvoted someone with the command "${message}"`);
                }
            } else {
                if (message.split(" ")[3] === user) {
                    bot.post("You can't downvote yourself!", origin);
                    log(`${user} tried to downvote themselves unsucessfully with the command "${message}"`);
                } else {
                    const karma: Promise<Karma | null> = await db.collection("karma").findOne({ username: message.split(" ")[3] });
                    db.collection("karma").updateOne({
                        username: message.split(" ")[3]
                    }, {
                        $set: {
                            username: message.split(" ")[3],
                            karma: karma.karma - 1
                        }
                    }, {
                        upsert: true
                    });
                    bot.post(`Successfully downvoted @${message.split(" ")[3]}! They now have ${karma.karma} karma.`, origin);
                    log(`${user} downvoted someone with the command "${message}"`);
                }
            }
        } else if (message.split(" ")[2] === "view") {
            const karma: Promise<Karma | null> = await db.collection("karma").findOne({ username: message.split(" ")[3] });
            if (message.split(" ")[3] === user) {
                if (!karma) {
                    bot.post("You have 1 karma.", origin);
                    log(`${user} viewed their 1 karma with the command "${message}"`);
                } else {
                    bot.post(`You have ${karma.karma} karma.`, origin);
                    log(`${user} viewed their karma with the command "${message}"`);
                }
            } else {
                const karma: Promise<Karma | null> = await db.collection("karma").findOne({ username: message.split(" ")[3] });
                if (!karma) {
                    bot.post(`@${message.split(" ")[3]} has 1 karma.`, origin);
                    log(`${user} viewed someone else's 1 karma with the command "${message}"`);
                } else {
                    bot.post(`@${message.split(" ")[3]} has ${karma.karma} karma.`, origin);
                    log(`${user} viewed someone else's karma with the command "${message}"`);
                }
            }
        } else {
            const karma: Promise<Karma | null> = await db.collection("karma").findOne({ username: message.split(" ")[3] });
            if (!karma) {
                bot.post("You have 1 karma.", origin);
                log(`${user} viewed their 1 karma with the command "${message}"`);
            } else {
                bot.post(`You have ${karma.karma} karma.`, origin);
                log(`${user} viewed their karma with the command "${message}"`);
            }
        }
    }

    if (message.startsWith(`@${username} mute`)) {
        if (admins.includes(user)) {
            const muted: Promise<Mute | null> = await db.collection("mutes").find({ username: user });
            if (!muted) {
                bot.post(`@${message.split(" ")[2]} is already muted!`, origin);
                log(`${user} tried to mute someone, but they are already muted. They used the command "${message}"`);
            } else {
                if (message.split(" ")[3]) {
                    db.collection("mutes").insertOne({
                        "username": message.split(" ")[2],
                        "reason": message.split(" ").slice(3, message.split(" ").length).join(" ")
                    });
                } else {
                    db.collection("mutes").insertOne({
                        "username": message.split(" ")[2],
                        "reason": null
                    });
                }
                bot.post(`Successfully muted @${message.split(" ")[2]}!`, origin);
                log(`${user} muted someone with the command "${message}"`);
            }
        } else {
            bot.post("You don't have the permissions to run this command.", origin);
            log(`${user} tried to mute someone, but they didn't have permission to do so. They used the command "${message}"`);
        }
    }

    if (message.startsWith(`@${username} unmute`)) {
        if (admins.includes(user)) {
            const muted: Promise<Mute | null> = await db.collection("mutes").find({ username: message.split(" ")[2] });
            if (muted) {
                db.collection("mutes").deleteOne({ username: message.split(" ")[2] });
                bot.post(`Successfully unmuted @${message.split(" ")[2]}!`, origin);
                log(`${user} unmuted someone with the command "${message}"`);
            } else {
                bot.post(`@${message.split(" ")[2]} isn't muted!`, origin);
                log(`${user} tried to unmute someone, but they weren't muted. They used the command "${message}"`);
            }
        } else {
            bot.post("You don't have the permissions to run this command.", origin);
            log(`${user} tried to unmute someone, but they didn't have permission to do so. They used the command "${message}"`);
        }
    }

    if (message.startsWith(`@${username} wordle`)) {
        if (message.split(" ")[2] === "new") {
            wordle.init();
            bot.post(`New Wordle game started! Use @${username} wordle guess [word] to guess a word.`, origin);
            log(`${user} started a Wordle game with the command "${message}"`);
        } else if (message.split(" ")[2] === "guess") {
            try {
                wordle.guess(message.split(" ")[3]);
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
        } else if (message.split(" ")[3] === "grid") {
            bot.post(`${wordle.grid[0].join("")}
${wordle.grid[1].join("")} 
${wordle.grid[2].join("")}
${wordle.grid[3].join("")}
${wordle.grid[4].join("")}
${wordle.grid[5].join("")}          
`, origin);
        } else {
            bot.post(`Commands:
    @${username} wordle new
    @${username} wordle guess [word]
    @${username} wordle grid`);
        }
    }

    if (message.startsWith(`@${username} poll`)) {
        if (message.split(" ")[2] === "new") {
            const total_polls: Promise<number> = await db.collection("polls").countDocuments({ deleted: false });
            db.collection("polls").insertOne({
                "_id": total_polls + 1,
                "question": message.split(" ").slice(3, message.split(" ").length).join(" "),
                "answers": [],
                "username": user,
                "deleted": false
            });
            bot.post(`Succesfully created new poll! For others to answer your poll, use @${username} poll answer ${total_polls + 1} [answer].`, origin);
            log(`${user} created a new poll with the command "${message}"`);
        } else if (message.split(" ")[2] === "answer") {
            const poll: Promise<Poll | null> = await db.collection("polls").find({ id: message.split(" ")[2] });
            if (user == poll.username) {
                bot.post("You can't answer a poll you made!", origin);
                log(`${user} tried to answer a poll they created with the command "${message}"`);
            } else if (!poll) {
                bot.post("This poll doesn't exist!");
            } else {
                poll.answers.push({
                    "username": user,
                    "answer": message.split(" ").slice(4, message.split(" ").length).join(" ")
                });
                db.collection("polls").updateOne({
                    id: message.split(" ")[2]
                }, {
                    $set: {
                        answers: poll.answers
                    }
                });
                bot.post("Successfully answered poll!", origin);
                log(`${user} answered a poll with the command "${message}"`);
            }
        } else {
            const polls: Poll[] = await db.collection("polls").find({
                deleted: false
            }).toArray();

            try {
                for (const i in polls) {
                    if (polls[i].username == user) {
                        polls.splice(i, 1);
                    }
                }
    
                const randomPoll = polls[Math.floor(Math.random() * polls.length)];

                bot.post(`Random poll: ${randomPoll.question}
    To answer this poll, use @${username} poll answer ${randomPoll._id} [answer].`, origin);
                log(`${user} found a random poll with the command "${message}"`);
            } catch(e) {
                bot.post(`There are no polls to answer! Check back later or create a poll with @${username} poll new [poll].`, origin);
            }
        }
    }

    if (message.startsWith(`@${username} whois`)) {
        const user: Promise<User> = await fetch(`https://api.meower.org/users/${message.split(" ")[2]}`).then(res => res.json());
        const user_posts: Promise<UserPosts> = await fetch(`https://api.meower.org/users/${message.split(" ")[2]}/posts?autoget`).then(res => res.json());

        if (user.error == true) {
            bot.post("This user doesn't exist! Dare to namesnipe?", origin);
        } else {
            bot.post(`${user._id} (${lvl[user.lvl]}):
    ${(user.banned ? "Banned" : "Not banned")}
    Created ${toRelative(user.created * 1000)}
    ${(user.quote != "" ? `Quote: "${user.quote}"` : "User doesn't have a quote")}
    Profile picture is ${pfp[user.pfp_data - 1]}
    Last seen ${toRelative(user_posts.autoget[0].t.e * 1000)}
    ${(db.has(`MDW125-STATUS-${user._id}`) ? `Status: "${db.get(`MDW125-STATUS-${user._id}`)}"` : "User doesn't have a status")}`, origin);
        }
    }

    if (message.startsWith(`@${username} place`)) {
        bot.post("This command has been temporaily disabled", origin);
        return;

        if (message.split(" ")[2] === "pixel") {
            try {
                place.set(parseInt(message.split(" ")[3]) - 1, parseInt(message.split(" ")[4]) - 1, message.split(" ")[5], user);
                bot.post(`${place.grid()[0].join("")}
${place.grid()[1].join("")}
${place.grid()[2].join("")}
${place.grid()[3].join("")}
${place.grid()[4].join("")}
${place.grid()[5].join("")}
${place.grid()[6].join("")}
${place.grid()[7].join("")}
${place.grid()[8].join("")}
${place.grid()[9].join("")}`, origin);
            } catch(e) {
                console.error(e);
                bot.post(`An error occured while placing a pixel!
    ${e}`, origin);
            }
        } else if (message.split(" ")[2] === "grid") {
            bot.post(`${place.grid()[0].join("")}
${place.grid()[1].join("")}
${place.grid()[2].join("")}
${place.grid()[3].join("")}
${place.grid()[4].join("")}
${place.grid()[5].join("")}
${place.grid()[6].join("")}
${place.grid()[7].join("")}
${place.grid()[8].join("")}
${place.grid()[9].join("")}`, origin);
        } else {
            bot.post(`Commands:
    @${username} place pixel [x] [y] [colour]
    @${username} place grid`, origin);
        }
    }
});

bot.onMessage((messageData: string) => {
    console.log(`New message: ${messageData}`);
});

bot.onClose(() => {
    bot.login(username, password);
});

bot.onLogin(() => {
    log(`Logged on as user ${username}`);
    bot.post(`${welcome_msg[Math.floor(Math.random() * welcome_msg.length)]}
Use @${username} help to see a list of commands.`);
});

bot.login(username, password);
