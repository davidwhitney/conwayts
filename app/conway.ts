export class Conway {
    private _grid: string[][];
    private readonly _width: number;
    private readonly _height: number;

    public totalCells = (): number => this._width * this._height;
    private isAlive = (x: number, y: number) => this._grid[y][x] == Conway.ALIVE;

    private static readonly ALIVE: string = '#';
    private static readonly DEAD: string = ' ';

    public constructor(state?: string[][]) {
        state = state || Conway.EmptyBoard();
        this._grid = state;
        this._height = state.length;
        this._width = state[0].length;
        return this;
    }

    public tick(): void {
        const snapshot = this.snapshot();
        const iterator = this.allCells();

        let cell = iterator.next();
        while (!cell.done) {

            const { x, y, current } = cell.value;
            const alive: boolean = this.isAlive(x, y);
            const living: number = this.livingNeighbours(x, y);

            const stateChanges = [
                { when: () => alive && living < 2 || living > 3, cellState: Conway.DEAD },
                { when: () => alive && living == 2 || living == 3, cellState: Conway.ALIVE },
                { when: () => !alive && living == 3, cellState: Conway.ALIVE },
                { when: () => !alive, cellState: current },
            ];

            const firstMatchingRule = stateChanges.filter(c => c.when())[0];
            snapshot[y][x] = firstMatchingRule.cellState;
            cell = iterator.next();
        }

        this._grid = snapshot;
    }

    private livingNeighbours(x: number, y: number): number {
         return this.neighboursOf(x, y).join('').replace(/ /g, '').length;
    }

    public snapshot = (): string[][] => JSON.parse(JSON.stringify(this._grid)); // YOLO

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
            { x: x -1, y: y },    /*  requested */   { x: x +1, y: y },
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

    private *allCells() {
        for (let y = 0; y < this._height; y++) {
            for (let x = 0; x < this._width; x++) {
                yield { x, y, current: this._grid[y][x] };
            }
        }
    }

    private static randomBetween(min: number, max: number): number {
        return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min))) + min;
    }

    public static EmptyBoard(width: number = 10, height: number = 10): string [][] {
        const grid: string[][] = [];
        for(let y = 0; y < height; y++) {
            grid.push(Array(width).fill(Conway.DEAD));
        }
        return grid;
    }

    public randomise(): Conway {
        let populateThisMany = Conway.randomBetween(0, this.totalCells() / 2);
        for(let iteration = 0; iteration < populateThisMany; iteration++) {
            const randX = Conway.randomBetween(0, this._width);
            const randY = Conway.randomBetween(0, this._height);
            this._grid[randY][randX] = Conway.ALIVE;
        }
        return this;
    }
}
