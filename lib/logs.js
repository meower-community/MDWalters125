import fs from "fs";

export function log(content) {
    fs.writeFile("logs", `${content}\n`, { flag: "a+" }, (err) => {});
}