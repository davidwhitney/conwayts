import { Conway } from "./conway";

describe("Conway's game of life", () => {

    it("Snapshot returns grid of correct size", () => {
        const conway = new Conway(Conway.EmptyBoard(10, 10));

        const grid = conway.snapshot();

        expect(grid).not.toBeNull();
        expect(grid.length).toBe(10);
        expect(grid[0].length).toBe(10);
        expect(conway.totalCells()).toBe(100);
    });

    it("Can flatten to a string for ease of use", () => {
        const conway = new Conway();

        const flattened = conway.toString();

        expect(flattened.length).toBe(conway.totalCells());
    });

    it("Can generate an initial state where half or less cells are alive", () => {
        const conway = new Conway(Conway.EmptyBoard(4, 4)).randomise();

        const flattened = conway.toString();
        const nonEmptyElements = flattened.replace(/ /g, '');
        expect(nonEmptyElements.length).toBeGreaterThan(0);
        expect(nonEmptyElements.length).toBeLessThanOrEqual(conway.totalCells() / 2);
    });

    it("Living cells with less than two neighbours die when game ticks", () => {
        const conway = new Conway([
                [' ', ' ', ' ', ' '],
                [' ', '#', ' ', ' '],
                [' ', ' ', ' ', ' '],
                [' ', ' ', ' ', ' ']
            ]);

        conway.tick();

        expect(conway.snapshot())
            .toStrictEqual([
                [' ', ' ', ' ', ' '],
                [' ', ' ', ' ', ' '],
                [' ', ' ', ' ', ' '],
                [' ', ' ', ' ', ' ']
            ]);
    });

    it("Living cells with greater than three neighbours die when game ticks", () => {
        const conway = new Conway([
                [' ', '#', ' ', ' '],
                [' ', '#', ' ', ' '],
                [' ', '#', ' ', ' '],
                [' ', ' ', ' ', ' ']
            ]);

        conway.tick();

        expect(conway.snapshot())
            .toStrictEqual([
                [' ', ' ', ' ', ' '],
                ['#', '#', '#', ' '],
                [' ', ' ', ' ', ' '],
                [' ', ' ', ' ', ' ']
            ]);
    });

    it("Living cells with 2-3 neighbours live when game ticks", () => {
        const conway = new Conway(([
                [' ', '#', ' ', ' '],
                ['#', ' ', '#', ' '],
                [' ', '#', ' ', ' '],
                [' ', ' ', ' ', ' ']
            ]));

        conway.tick();

        expect(conway.snapshot())
            .toStrictEqual([
                [' ', '#', ' ', ' '],
                ['#', ' ', '#', ' '],
                [' ', '#', ' ', ' '],
                [' ', ' ', ' ', ' ']
            ]);
    });

    it("Dead cells with 3 living neighbours come alive when game ticks", () => {
        const conway = new Conway([
                [' ', '#', ' ', ' '],
                ['#', '#', ' ', ' '],
                [' ', ' ', ' ', ' '],
                [' ', ' ', ' ', ' ']
            ]);

        conway.tick();

        expect(conway.snapshot())
            .toStrictEqual([
                ['#', '#', ' ', ' '],
                ['#', '#', ' ', ' '],
                [' ', ' ', ' ', ' '],
                [' ', ' ', ' ', ' ']
            ]);
    });
});
