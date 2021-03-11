class Graph {
    constructor(v) {
        this.v = v;
        this.adj = Array.from({
            length: v
        }, e => []);
    }

    addVertex() {
        this.adj.push([]);
        this.v += 1;
    }

    addEdge(u, w) {
        this.adj[u].push(w);
        this.adj[w].push(u);
    }

    greedyColoring() {
        var result = Array.from({
            length: this.v
        }, e => -1);
        var available = Array.from({
            length: this.v
        }, e => false);
        var log = [];

        for (let u = 0; u < this.v; ++u) {
            //log
            log.push(new IterationLog(u, -1, -1,
                [...result], [...available]));

            for (const w of this.adj[u]) {
                //log
                log.push(new IterationLog(u, w, -1,
                    [...result], [...available]));

                if (result[w] !== -1) {
                    available[result[w]] = true;

                    //log
                    log.push(new IterationLog(u, w, -1,
                        [...result], [...available]));
                }
            }

            for (var i = 0; i < this.v; ++i) {
                //log
                log.push(new IterationLog(u, -1, i,
                    [...result], [...available]));

                if (!available[i]) {
                    break;
                }
            }

            result[u] = i;

            //log
            log.push(new IterationLog(u, -1, -1,
                [...result], [...available]));

            for (const w of this.adj[u]) {
                if (result[w] !== -1) {
                    available[result[w]] = false;
                }
            }
        }

        //log
        log.push(new IterationLog(-1, -1, -1,
            [...result], [...available]));

        //return result;
        return log;
    }

    dfsColoring(s = 0) {
        var visited = Array.from({
            length: this.v
        }, e => false);
        var colors = Array.from({
            length: this.v
        }, e => -1);
        var edges = new Set();

        var log = [];

        this.dfsColoringAux(s, visited, colors, edges, log);

        return log;
    }

    dfsColoringAux(curVertice, visited, colors, edges, log) {
        visited[curVertice] = true;

        var available = Array.from({
            length: this.v
        }, e => false);

        //log
        log.push(new IterationLog(curVertice, -1, -1,
            [...colors], [...available], [...edges]));

        for (const w of this.adj[curVertice]) {
            //log
            log.push(new IterationLog(curVertice, w, -1,
                [...colors], [...available], [...edges]));

            if (colors[w] !== -1) {
                available[colors[w]] = true;

                //log
                log.push(new IterationLog(curVertice, w, -1,
                    [...colors], [...available], [...edges]));
            }
        }

        for (var i = 0; i < this.v; ++i) {
            //log
            log.push(new IterationLog(curVertice, -1, i,
                [...colors], [...available], [...edges]));

            if (!available[i]) {
                break;
            }
        }

        colors[curVertice] = i;

        //log
        log.push(new IterationLog(curVertice, -1, -1,
            [...colors], [...available], [...edges]));

        for (const w of this.adj[curVertice]) {
            if (!visited[w]) {

                edges.add(this.edgesToStr(curVertice, w));

                //log
                log.push(new IterationLog(curVertice, -1, -1,
                    [...colors], [...available], [...edges]));

                this.dfsColoringAux(w, visited, colors, edges, log);

                edges.delete(this.edgesToStr(curVertice, w));

                //log
                log.push(new IterationLog(-1, -1, -1,
                    [...colors], undefined, [...edges]));
            }
        }
    }

    bfsColoring(curVertice = 0) {
        var visited = Array.from({
            length: this.v
        }, e => false);
        var colors = Array.from({
            length: this.v
        }, e => -1);
        var available = Array.from({
            length: this.v
        }, e => false);

        var log = [];
        var queue = [];

        visited[curVertice] = true;
        queue.push(curVertice);

        //log
        log.push(new IterationLog(-1, -1, -1,
            [...colors], [...available], undefined, [...queue]));

        while (queue.length > 0) {
            curVertice = queue.shift();

            //

            //log
            log.push(new IterationLog(curVertice, -1, -1,
                [...colors], [...available], undefined, [...queue]));

            for (const w of this.adj[curVertice]) {
                //log
                log.push(new IterationLog(curVertice, w, -1,
                    [...colors], [...available], undefined, [...queue]));

                if (colors[w] !== -1) {
                    available[colors[w]] = true;

                    //log
                    log.push(new IterationLog(curVertice, w, -1,
                        [...colors], [...available], undefined, [...queue]));
                }
            }

            for (var i = 0; i < this.v; ++i) {
                //log
                log.push(new IterationLog(curVertice, -1, i,
                    [...colors], [...available], undefined, [...queue]));

                if (!available[i]) {
                    break;
                }
            }

            colors[curVertice] = i;

            //log
            log.push(new IterationLog(curVertice, -1, -1,
                [...colors], [...available], undefined, [...queue]));

            for (const w of this.adj[curVertice]) {
                if (colors[w] !== -1) {
                    available[colors[w]] = false;
                }
            }

            //

            for (const w of this.adj[curVertice]) {
                //log
                log.push(new IterationLog(curVertice, w, -1,
                    [...colors], [...available], undefined, [...queue]));

                if (!visited[w]) {
                    visited[w] = true;
                    queue.push(w);

                    //log
                    log.push(new IterationLog(curVertice, -1, -1,
                        [...colors], [...available], undefined, [...queue]));
                }
            }
        }

        //log
        log.push(new IterationLog(-1, -1, -1,
            [...colors], [...available]));

        return log;
    }

    backtrackingColoring() {
        var colors = Array.from({
            length: this.v
        }, e => -1);

        log = [];

        if (this.backtrackingColoringAux(0, colors, log)) {
            log.push(new IterationLog(-1, -1, -1, [...colors],
                undefined, undefined, undefined));
            return log;
        }
        return undefined;
    }

    backtrackingColoringAux(curVertice, colors, log) {
        if (curVertice === this.v) {
            return true;
        }

        log.push(new IterationLog(curVertice, -1, -1, [...colors],
            undefined, undefined, undefined));

        for (let i = 0; i < 5; ++i) {
            log.push(new IterationLog(curVertice, -1, i, [...colors],
                undefined, undefined, undefined));

            if (this.isPossibleColor(curVertice, i, colors)) {
                colors[curVertice] = i;

                log.push(new IterationLog(curVertice, -1, -1, [...colors],
                    undefined, undefined, undefined));

                return this.backtrackingColoringAux(curVertice + 1, colors, log);
            }
        }
        return false;
    }

    isPossibleColor(curVertice, color, colors) {
        for (const w of this.adj[curVertice]) {
            if (color === colors[w]) {
                return false;
            }
        }
        return true;
    }

    bruteForceColoring() {
        var colors = Array.from({
            length: this.v
        }, e => -1);

        log = []

        if (this.bruteForceColoringAux(0, colors, log)) {
            log.push(new IterationLog(-1, -1, -1, [...colors],
                undefined, undefined, undefined));
            return log;
        }

        return undefined;
    }

    bruteForceColoringAux(curVertice, colors, log) {
        if (curVertice === 7) {
            return this.isSafe(colors);
        }

        log.push(new IterationLog(curVertice, -1, -1, [...colors],
            undefined, undefined, undefined));

        for (let i = 0; i < 4; ++i) {
            colors[curVertice] = i;

            log.push(new IterationLog(curVertice, -1, -1, [...colors],
                undefined, undefined, undefined));

            if (this.bruteForceColoringAux(curVertice + 1, colors, log)) {
                return true;
            }
        }
        return false;
    }

    //precisa verificar se ta -1? n ne
    //mudar para isSolved
    isSafe(colors) {
        for (let u = 0; u < 7; ++u) {
            for (const w of this.adj[u]) {
                if (colors[u] === colors[w]) {
                    return false;
                }
            }
        }
        return true;
    }

    show() {
        this.adj.forEach((vertices, u) => {
            console.log('vertice ' + u);
            for (const w of vertices) {
                console.log(w);
            }
        });
    }

    edgesToStr = (u, v) => {
        return Math.min(u, v) + '-' + Math.max(u, v);
    }
};

var IterationLog = function (curVertice, curNeighbor, curAvailable, result,
    availableColors, statesEdges, queue) {
    this.curVertice = curVertice;
    this.curNeighbor = curNeighbor;
    this.curAvailable = curAvailable;
    this.result = result;
    this.availableColors = availableColors;
    this.statesEdges = statesEdges;
    this.queue = queue;
}