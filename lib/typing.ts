export function typing(bot: any): void {
    bot.send(`{ "cmd": "direct", "val": { "cmd": "set_chat_state", "val": { "chatid": "livechat", "state": 101, } } }`);
}