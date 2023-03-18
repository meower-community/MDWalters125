// @ts-nocheck
import * as fs from "fs";

export default class Wordle {
    ready: boolean;
    wordList: string[];
    tries: number;
    grid: string[];
    
    constructor() {
        this.ready = false;
        this.wordList;
        this.tries;
        this.grid;
    }
    
    init(): void {
        this.wordList = JSON.parse(fs.readFileSync("./lib/words.json", "utf8"));
        this.word = this.wordList[Math.floor(Math.random() * this.wordList.length)].toLowerCase();
        this.tries = -1;
        this.ready = true;
        this.grid = [
            ["⬜", "⬜", "⬜", "⬜", "⬜"],
            ["⬜", "⬜", "⬜", "⬜", "⬜"],
            ["⬜", "⬜", "⬜", "⬜", "⬜"],
            ["⬜", "⬜", "⬜", "⬜", "⬜"],
            ["⬜", "⬜", "⬜", "⬜", "⬜"],
            ["⬜", "⬜", "⬜", "⬜", "⬜"]
        ];
    }

    guess(word): void {
        const letters = word.toLowerCase().split("");

        if (!(this.ready)) {
            throw "You didn't start a new Wordle game yet! Use ~wordle new to start a new Wordle.";
            return;
        }

        if (letters.length > 5) {
            throw "Word is too long!";
            return;
        } else if (letters.length < 5) {
            throw "Word is too short!";
            return;
        }

        if (this.tries == 5) {
            this.ready = false;
            throw "The Wordle game has finished! Use ~wordle new to start a new Wordle.";
            return;
        } else {
            this.tries++;
        }
        
        for (const i in letters) {
            if (letters[i] == this.word.split("")[i]) {
                this.grid[this.tries][i] = "🟩";
            } else if (this.word.indexOf(letters[i]) != -1) {
                this.grid[this.tries][i] = "🟨";
            } else {
                this.grid[this.tries][i] = "⬛";
            }
        }
    } 

    grid(): string[][] {
        return this.grid;
    }
}
