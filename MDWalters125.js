const uptime = new Date();
const help = ["~hello", "~help", "~str", "~amazing", "~uptime", "~uwu", "~8ball"];
const eightBall = ["It is certain.", "It is decidedly so.", "Without a doubt.", "Yes, definitely.", "You may rely on it.", "As I see it, yes.", "Most likely.", "Outlook good.", "Yes.", "Signs point to yes.", "Reply hazy, try again.", "Ask again later.", "Better not tell you now.", "Cannot predict now.", "Concentrate and ask again.", "Don't count on it.", "My reply is no.", "My sources say no.", "Outlook not so good.", "Very doubtful."];
const prefix = "~";
const name = "MDWalters125"; 

post(`${name} is now online! Use ${prefix}help to see a list of commands.`);

window.handlePost = function(bundle) {
    if (bundle[0] == "Discord") {
        bundle = bundle[1].split(": ");
    }

    if (bundle[1].startsWith(`${prefix}hello`)) {
        post(`Hello, ${bundle[1].split(" ")[1]}!`);
    }
    
    if (bundle[1].startsWith(`${prefix}help`)) {
        post(` ${help}`);
    }
    
    if (bundle[1].startsWith(`${prefix}str`)) {
        post(` ${bundle[1].split(" ")[1]}`);
    }
    
    if (bundle[1].startsWith(`${prefix}amazing`)) {
        post(`Amazing ${bundle[1].split(" ")[1]}`);
    }
    
    if (bundle[1].startsWith(`${prefix}uptime`)) {
        post(uptime);
    }
    
    if (bundle[1].startsWith(`${prefix}uwu`)) {
        post("UwU");
    }
    
    if (bundle[1].startsWith(`${prefix}8ball`)) {
    	var num = Math.floor(Math.random() * eightBall.length);
    	post(eightBall[num]);
    }
}
