export class Conway {
    private _grid: string[][];
    private _width: number;
    private _height: number;

    constructor(width: number = 10, height: number = 10) {
        this._height = height;
        this._width = width;
        this._grid = [];
        for(let y = 0; y < height; y++) {
            this._grid.push(Array(width).fill(' '));
        }
    }

    public tick(): void {
        const snapshot = JSON.parse(JSON.stringify(this._grid));
        for(let y = 0; y < this._height; y++) {
            for(let x = 0; x < this._width; x++) {

                const thisCellState = this._grid[y][x];
                const cells = this.neighboursOf(x, y);
                const cellData = cells.join('');
                const aliveElements = cellData.replace(/ /g, '').length;

                if(thisCellState == '#') {
                    if (aliveElements < 2 || aliveElements > 3) {
                        snapshot[y][x] = ' ';
                    } else if(aliveElements == 2 || aliveElements == 3) {
                        snapshot[y][x] = '#';
                    }
                } else {
                    if(aliveElements == 3) {
                        snapshot[y][x] = '#';
                    }
                }
            }
        }

        this._grid = snapshot;
    }

    public withState(state: string[][]): Conway {
        this._grid = state;
        this._height = state.length;
        this._width = state[0].length;
        return this;
    }

    public randomise(): Conway {
        let populateThisMany = Conway.randomBetween(0, this.totalCells() / 2);
        console.log(populateThisMany);
        for(let iteration = 0; iteration < populateThisMany; iteration++) {
            const randX = Conway.randomBetween(0, this._width);
            const randY = Conway.randomBetween(0, this._height);
            this._grid[randY][randX] = '#';
        }
        return this;
    }

    public totalCells = (): number => this._width * this._height;
    public snapshot = (): string[][] =>  this._grid.slice();
    public toString(divider: string = ''): string {
        let output = '';
        for(let i in this._grid) {
            output += this._grid[i].join('') + divider;
        }
        return output;
    }

    private neighboursOf(x: number, y: number): string[] {
        const candidates = [
            { x: x -1, y: y -1 }, { x: x, y: y -1 }, { x: x +1, y: y -1 },
            { x: x -1, y: y },    /* { x: x, y: y }, */   { x: x +1, y: y },
            { x: x -1, y: y +1 }, { x: x, y: y +1 }, { x: x +1, y: y +1 },
        ].filter(can => can.x >= 0 && can.x < this._width)
         .filter(can => can.y >= 0 && can.y < this._height);

        const cells: string[] = [];

        for(let i in candidates) {
            const candidate = candidates[i];
            const candidateLocation = this._grid[candidate.y][candidate.x];

            if (candidateLocation) {
                cells.push(candidateLocation);
            }
        }
        return cells;
    }

    private static randomBetween(min, max) {
        return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min))) + min;
    }
}
