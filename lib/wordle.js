export default class Wordle {
    async init(word) {
        this.word = word;
        this.tries = -1;
        this.grid = [
            ["⬜", "⬜", "⬜", "⬜", "⬜"],
            ["⬜", "⬜", "⬜", "⬜", "⬜"],
            ["⬜", "⬜", "⬜", "⬜", "⬜"],
            ["⬜", "⬜", "⬜", "⬜", "⬜"],
            ["⬜", "⬜", "⬜", "⬜", "⬜"],
            ["⬜", "⬜", "⬜", "⬜", "⬜"]
        ];
    }

    guess(word) {
        if (this.tries > 5) {
            throw new Error("Wordle game finished. Use ~wordle new to start a new Wordle.");
            return;
        } else {
            this.tries++
        }

        var letters = word.split("");

        if (letters.length > 5) {
            throw new Error("Word is too long!");
            return;
        } else if (letters.length < 5) {
            throw new Error("Word is too short!");
            return;
        }

        let i = 0;
        
        for (i in letters) {
            if (letters[i] == this.word.split("")[i]) {
                this.grid[this.tries][i] = "🟩";
            } else if (this.word.indexOf(letters[i]) != -1) {
                this.grid[this.tries][i] = "🟨";
            } else {
                this.grid[this.tries][i] = "⬛";
            }
        }
        return this.grid;
    } 

    grid() {
        return this.grid;
    }
}