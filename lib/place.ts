// @ts-nocheck
import JSONdb from "simple-json-db";

export default class Place {    
    colours: object;

    constructor(db) {
        this.db = db;
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

    set(x: number, y: number, colour: string, username: string): void {
        const place: object = this.db.get("MDW125-PLACE");

        if (!(place.contributors.includes(username))) {
            place.contributors.push(username);
        }

        place.map[y][x] = this.colours[colour];
        this.db.set("MDW125-PLACE", place);
    }
}
