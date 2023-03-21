import fs from "fs";

export function log(content: string): void {
    fs.writeFile("logs", `${content}\n`, { flag: "a+" }, () => { return; });
}