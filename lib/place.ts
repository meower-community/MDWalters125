// @ts-nocheck
import JSONdb from "simple-json-db";

export default class Place {    
    colours: object;

    constructor() {
        this.db = new JSONdb("./../db.json");
        this.colours = {
            "red": "🟥",
            "white": "⬜",
            "green": "🟩",
            "yellow": "🟨",
            "orange": "🟧",
            "blue": "🟦",
            "purple": "🟪",
            "brown": "🟫",
            "black": "⬛",
        };

        if (!(this.db.has("MDW125-PLACE"))) {
            this.db.set("MDW125-PLACE", {
                "map": [
                    ["⬜", "⬜", "⬜", "⬜", "⬜", "⬜", "⬜", "⬜", "⬜", "⬜"],
                    ["⬜", "⬜", "⬜", "⬜", "⬜", "⬜", "⬜", "⬜", "⬜", "⬜"],
                    ["⬜", "⬜", "⬜", "⬜", "⬜", "⬜", "⬜", "⬜", "⬜", "⬜"],
                    ["⬜", "⬜", "⬜", "⬜", "⬜", "⬜", "⬜", "⬜", "⬜", "⬜"],
                    ["⬜", "⬜", "⬜", "⬜", "⬜", "⬜", "⬜", "⬜", "⬜", "⬜"],
                    ["⬜", "⬜", "⬜", "⬜", "⬜", "⬜", "⬜", "⬜", "⬜", "⬜"],
                    ["⬜", "⬜", "⬜", "⬜", "⬜", "⬜", "⬜", "⬜", "⬜", "⬜"],
                    ["⬜", "⬜", "⬜", "⬜", "⬜", "⬜", "⬜", "⬜", "⬜", "⬜"],
                    ["⬜", "⬜", "⬜", "⬜", "⬜", "⬜", "⬜", "⬜", "⬜", "⬜"],
                    ["⬜", "⬜", "⬜", "⬜", "⬜", "⬜", "⬜", "⬜", "⬜", "⬜"],
                ],
                "created": new Date().getTime(),
                "contributors": []
            });
        }
    }

    grid(): string[][] {
        return this.db.get("MDW125-PLACE").map;
    }

    contributors(): string[] {
        return this.db.get("MDW125-PLACE").contributors;
    }

    set(x: number, y: number, colour: string): void {
        const map: string[][] = this.db.get("MDW125-PLACE").map;

        map[y][x] = this.colours[colour];
    }
}
