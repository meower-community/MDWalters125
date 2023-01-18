import fs from "fs";

export function log(content) {
    fs.writeFile("logs.txt", `${content}\n`, { flag: "a+" }, (err) => {});
}