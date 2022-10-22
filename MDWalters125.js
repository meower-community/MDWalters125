const uptime = new Date();
const help = ["~hello", "~help", "~say", "~amazing", "~uptime", "~uwu", "~8ball", "~motd", "~restart", "~shutdown", "~ulist", "~zen", "~shorten", "~cat", "~status"];
const eightBall = ["It is certain.", "It is decidedly so.", "Without a doubt.", "Yes, definitely.", "You may rely on it.", "As I see it, yes.", "Most likely.", "Outlook good.", "Yes.", "Signs point to yes.", "Reply hazy, try again.", "Ask again later.", "Better not tell you now.", "Cannot predict now.", "Concentrate and ask again.", "Don't count on it.", "My reply is no.", "My sources say no.", "Outlook not so good.", "Very doubtful."];
const motd = ["Meower is not dead", "Furries can do infinite crime", "~8ball get a life?", "Never gonna give you up", "usebottles", "Why did the chicken cross the road? To get to the other side", "Made in Canada", "The question that I always ask Bill Gates is why Windows is closed-source", "M.D. created Markdown, you can't deny that", "Proudly Furry", "You are currently muted from MDWalters125.", "MDWalters125 is now online! Use ~help to see a list of commands."];
const muted = ["Eris"];
const admins = ["MDWalters124", "m"];

post("MDWalters125 is now online! Use ~help to see a list of commands.");

window.handlePost = async function(bundle) {
    if (bundle[0] == "Discord") {
        bundle = bundle[1].split(": ");

    }

    if (bundle[0] == document.querySelector("#username").value) {
        return;
    }

    if (bundle[1].startsWith("~") && muted.includes(bundle[0])) {
        post("You are currently muted from MDWalters125.");
        return;
    }

    if (bundle[1].startsWith("~") && !(help.includes(bundle[1].split(" ")[0]))) {
        if (bundle[1].startsWith("~!")) {
            return;
        }
        post("That command doesn't exist! Use ~help to see a list of commands.");
        return;
    }

    if (bundle[1].startsWith("~hello")) {
        if (bundle[1].split(" ")[1] === undefined) {
           post(`Hello, ${bundle[0]}!`);
        } else {
           post(`Hello, ${bundle[1].split(" ")[1]}!`);
        }
    }

    if (bundle[1].startsWith("~help")) {
        post(`${help.join(", ")}`);
    }

    if (bundle[1].startsWith("~say")) {
        post(`${bundle[1].split(" ").slice(1, bundle[1].split(" ").length).join(" ")}`);
    }

    if (bundle[1].startsWith("~amazing")) {
        post(`Amazing ${bundle[1].split(" ").slice(1, bundle[1].split(" ").length).join(" ")}`);
    }

    if (bundle[1].startsWith("~uptime")) {
        post(uptime);
    }

    if (bundle[1].startsWith("~uwu")) {
        post("UwU");
    }

    if (bundle[1].startsWith("~8ball")) {
    	var num = Math.floor(Math.random() * eightBall.length);
    	post(eightBall[num]);
    }

    if (bundle[1].startsWith("~motd")) {
    	var num = Math.floor(Math.random() * motd.length);
    	post(motd[num]);
    }

    if (bundle[1].startsWith("~restart")) {
        if (admins.includes(bundle[0])) {
            post("Restarting...");
            startws();
        } else {
            post("You do not have the permissions to run this command.");
        }
    }

    if (bundle[1].startsWith("~shutdown")) {
        if (admins.includes(bundle[0])) {
            post("Shutting down...");
            ws.close();
        } else {
            post("You do not have the permissions to run this command.");
        }
    }

    if (bundle[1].startsWith("~ulist")) {
        post(document.querySelector("#ulist").innerHTML);
    }

    if (bundle[1].startsWith("~zen")) {
        post(await fetchURL("https://api.github.com/zen"));
    }

    if (bundle[1].startsWith("~shorten")) {
        if (bundle[1].split(" ")[1] === undefined) {
            post("https://shrtco.de/enVsHi");
        } else {
            var short = await fetchURL(`https://api.shrtco.de/v2/shorten?url=${bundle[1].split(" ")[1]}`);
            var short = JSON.parse(short);
            post(short.result.full_short_link);
        }
    }

    if (bundle[1].startsWith("~cat")) {
        var image = await fetchURL("https://aws.random.cat/meow");
        var image = JSON.parse(image);
        post(image.file);
    }

    if (bundle[1].startsWith("~status")) {
        if (bundle[1].split(" ")[1] === "set") {
            localStorage.setItem(`MDW125-STATUS-${bundle[0]}`, bundle[1].split(" ").slice(2, bundle[1].split(" ").length).join(" "));
            post("Status successfully set!");
        } else if (bundle[1].split(" ")[1] === "clear") {
            localStorage.removeItem(`MDW125-STATUS-${bundle[0]}`);
            post("Status successfully cleared!");
        } else if (bundle[1].split(" ")[1] === "view") {
            if (bundle[1].split(" ")[2] === bundle[0]) {
                post(`Your status: ${localStorage.getItem("MDW125-STATUS-" + bundle[0])}`);
            } else {
                if (localStorage.getItem("MDW125-STATUS-" + bundle[1].split(" ")[2]) === null) {
                    post(`@${bundle[1].split(" ")[2]} doesn't have a status set.`);
                } else {
                    post(`@${bundle[1].split(" ")[2]}'s status: ${localStorage.getItem("MDW125-STATUS-" + bundle[1].split(" ")[2])}`);
                }
            }    
        } else {
            if (localStorage.getItem("MDW125-STATUS-" + bundle[0]) === null) {
                post(`You don't have a status set.`);
            } else {
                post(`Your status: ${localStorage.getItem("MDW125-STATUS-" + bundle[0])}`);
            }
        }
    }
}
