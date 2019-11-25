import { Conway } from "./conway";

const instance = new Conway(Conway.EmptyBoard(100, 25)).randomise();

setInterval(() => {
    instance.tick();
    let current = instance.toString(require('os').EOL);
    console.clear();
    console.log(current);
}, 200);