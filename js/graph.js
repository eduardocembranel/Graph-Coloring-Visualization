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

    edgesToStr = (u, v) => {
        return Math.min(u, v) + '-' + Math.max(u, v);
    }

    basicSearchColoring() {
        var colors = Array.from({
            length: this.v
        }, e => -1);
        var available = Array.from({
            length: this.v
        }, e => false);
        var log = [];

        addLogToArray(log, -1, -1, -1, colors);

        for (let u = 0; u < this.v; ++u) {
            this.solveCurrentVertex(u, colors, available, log);
        }

        addLogToArray(log, -1, -1, -1, colors);

        return log;
    }

    solveCurrentVertex(u, colors, available, log, edges, queue) {
        available.fill(false);

        addLogToArray(log, u, -1, -1, colors, available, edges, queue);

        for (const w of this.adj[u]) {
            addLogToArray(log, u, w, -1, colors, available, edges, queue);

            if (colors[w] !== -1) {
                available[colors[w]] = true;

                addLogToArray(log, u, w, -1, colors, available, edges, queue);
            }
        }

        for (var i = 0; i < this.v && available[i]; ++i) {
            addLogToArray(log, u, -1, i, colors, available, edges, queue);
        }

        addLogToArray(log, u, -1, i, colors, available, edges, queue);

        colors[u] = i;

        addLogToArray(log, u, -1, -1, colors, available, edges, queue);
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

        addLogToArray(log, -1, -1, -1, colors);

        this.dfsColoringAux(s, visited, colors, edges, log);

        return log;
    }

    dfsColoringAux(curVertex, visited, colors, edges, log) {
        visited[curVertex] = true;

        var available = Array.from({
            length: this.v
        }, e => false);

        this.solveCurrentVertex(curVertex, colors, available, log, edges);

        for (const w of this.adj[curVertex]) {
            if (!visited[w]) {

                edges.add(this.edgesToStr(curVertex, w));

                addLogToArray(log, curVertex, -1, -1, colors, available,
                     edges);

                this.dfsColoringAux(w, visited, colors, edges, log);

                edges.delete(this.edgesToStr(curVertex, w));

                addLogToArray(log, -1, -1, -1, colors, undefined,
                    edges);
            }
        }
    }

    dfsColoringWithHeuristic() {
        var visited = Array.from({
            length: this.v
        }, e => false);
        var colors = Array.from({
            length: this.v
        }, e => -1);
        var edges = new Set();
        var log = [];

        addLogToArray(log, -1, -1, -1, colors);

        const clone = JSON.parse(JSON.stringify(this.adj));

        var verticesDegrees = this.calculateVerticesDegrees();

        addLogToArray(log, -1, -1, -1, colors, undefined, undefined,
            undefined, verticesDegrees);

        for (const w of this.adj) {
            w.sort((a, b) => {
                return verticesDegrees[b].degree - verticesDegrees[a].degree;
            })
        }
        verticesDegrees.sort((a, b) => {
            return b.degree - a.degree;
        });

        addLogToArray(log, -1, -1, -1, colors, undefined, undefined,
            undefined, verticesDegrees);

        this.dfsColoringAux(verticesDegrees[0].vertex, 
            visited, colors, edges, log);

        for (let i = 3; i < log.length; ++i) {
            log[i].listDegrees = verticesDegrees;
        }

        this.adj = clone;

        return log;
    }

    bfsColoring(s = 0) {
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

        addLogToArray(log, -1, -1, -1, colors, available, undefined, queue);

        var curVertex = s;
        visited[curVertex] = true;
        queue.push(curVertex);

        addLogToArray(log, -1, -1, -1, colors, available, undefined, queue);

        while (queue.length > 0) {
            curVertex = queue.shift();

            this.solveCurrentVertex(curVertex, colors, available, log, 
                undefined, queue);

            for (const w of this.adj[curVertex]) {
                addLogToArray(log, curVertex, w, -1, colors, available, 
                    undefined, queue);

                if (!visited[w]) {
                    visited[w] = true;
                    queue.push(w);

                    addLogToArray(log, curVertex, -1, -1, colors, available, 
                        undefined, queue);
                }
            }
        }

        addLogToArray(log, -1, -1, -1, colors);

        return log;
    }

    bfsColoringWithHeuristic() {
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

        addLogToArray(log, -1, -1, -1, colors);

        const clone = JSON.parse(JSON.stringify(this.adj));

        var verticesDegrees = this.calculateVerticesDegrees();

        addLogToArray(log, -1, -1, -1, colors, undefined, undefined,
            undefined, verticesDegrees);

        for (const w of this.adj) {
            w.sort((a, b) => {
                return verticesDegrees[b].degree - verticesDegrees[a].degree;
            })
        }
        verticesDegrees.sort((a, b) => {
            return b.degree - a.degree;
        });

        addLogToArray(log, -1, -1, -1, colors, undefined, undefined,
            undefined, verticesDegrees);

        var curVertex = verticesDegrees[0].vertex;
        visited[curVertex] = true;
        queue.push(curVertex);

        addLogToArray(log, -1, -1, -1, colors, available, undefined, queue);

        while (queue.length > 0) {
            curVertex = queue.shift();

            this.solveCurrentVertex(curVertex, colors, available, log, 
                undefined, queue);

            for (const w of this.adj[curVertex]) {
                addLogToArray(log, curVertex, w, -1, colors, available, 
                    undefined, queue);

                if (!visited[w]) {
                    visited[w] = true;
                    queue.push(w);

                    addLogToArray(log, curVertex, -1, -1, colors, available, 
                        undefined, queue);
                }
            }
        }

        addLogToArray(log, -1, -1, -1, colors);

        for (let i = 3; i < log.length; ++i) {
            log[i].listDegrees = verticesDegrees;
        }

        this.adj = clone;

        return log;
    }

    bruteForceColoring(maxV = this.v, maxC = this.v) {
        var colors = Array.from({
            length: maxV
        }, e => -1);

        log = [];

        addLogToArray(log, -1, -1, -1, colors);

        if (this.bruteForceColoringAux(0, maxV, maxC, colors, log)) {
            addLogToArray(log, -1, -1, -1, colors);
            return log;
        }

        return undefined;
    }

    bruteForceColoringAux(curVertex, maxV, maxC, colors, log) {
        if (curVertex === maxV) {
            return this.isSafe(colors, maxV);
        }

        log.push(new IterationLog(curVertex, -1, -1, [...colors]));

        for (let i = 0; i < maxC; ++i) {
            colors[curVertex] = i;

            log.push(new IterationLog(curVertex, -1, -1, [...colors]));

            if (this.bruteForceColoringAux(curVertex + 1, maxV, maxC, 
                colors, log)) {
                return true;
            }
        }
        return false;
    }

    isSafe(colors, maxV = this.v) {
        for (let u = 0; u < maxV; ++u) {
            for (const w of this.adj[u]) {
                if (w < maxV) {
                    if (colors[u] === colors[w]) {
                        return false;
                    } else if (colors[u] === -1 || colors[w] === -1) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    bruteForceColoring2(s = 0, maxV = this.v, maxC = this.v) {
        var colors = Array.from({
            length: maxV
        }, e => -1);
        var visited = Array.from({
            length: this.v
        }, e => false);

        log = [];

        addLogToArray(log, -1, -1, -1, colors);

        for (let i = 0; i < 4; ++i) {
            colors[s] = i;
            if (this.bruteForceColoringAux2(s, maxV, maxC, colors, visited, log)) {
                addLogToArray(log, -1, -1, -1, colors);
                return log;
            }
        }
        return undefined;
    }

    bruteForceColoringAux2(curVertex, maxV, maxC, colors, visited, log) {
        addLogToArray(log, curVertex, -1, -1, colors);

        visited[curVertex] = true;

        if (this.isSafe(colors, maxV)) {
            return true;
        }

        for (let i = 0; i < maxC; ++i) {
            for (const w of this.adj[curVertex]) {
                if (!visited[w] && w < maxV) {
                    colors[w] = i;
                    if (this.bruteForceColoringAux2(w, maxV, maxC, colors, visited, log)) {
                        return true;
                    }
                }
            }
        }

        visited[curVertex] = false;
        return false;
    }

    welshPowell() {
        var colors = Array.from({
            length: this.v
        }, e => -1);
        log = [];

        addLogToArray(log, -1, -1, -1, colors);

        var verticesDegrees = this.calculateVerticesDegrees();

        addLogToArray(log, -1, -1, -1, colors, undefined, undefined,
            undefined, verticesDegrees);

        verticesDegrees.sort((a, b) => {
            return b.degree - a.degree;
        });

        addLogToArray(log, -1, -1, -1, colors, undefined, undefined,
            undefined, verticesDegrees);
  
        var colorCount = 0;
        for (let i = 0; i < verticesDegrees.length; ++i) {
            const curVertex = verticesDegrees[i].vertex;

            addLogToArray(log, curVertex, -1, colorCount, colors, undefined,
                undefined, undefined, verticesDegrees, i, -1);

            if (colors[curVertex] === -1) {
                colors[curVertex] = colorCount;
                
                addLogToArray(log, curVertex, -1, colorCount, colors,
                    undefined, undefined, undefined, verticesDegrees, i, -1);

                for (let j = i + 1; j < verticesDegrees.length; ++j) {
                    const w = verticesDegrees[j].vertex;

                    if (colors[w] === -1) {
                        addLogToArray(log, curVertex, w, colorCount, colors,
                            undefined, undefined, undefined, verticesDegrees, i, j);
                        
                        if (!this.hasAdjacentWithColor(w, colorCount, colors)) {
                            colors[w] = colorCount;

                            addLogToArray(log, curVertex, w, colorCount, colors,
                                undefined, undefined, undefined, verticesDegrees, i, j);
                        }
                    }
                }
                ++colorCount;
            }
        }

        addLogToArray(log, -1, -1, -1, colors, undefined, undefined, undefined, 
            verticesDegrees);
        return log;
    }

    calculateVerticesDegrees() {
        var degrees = [];
        this.adj.forEach((w, idx) => {
            degrees.push({
                vertex: idx,
                degree: w.length
            });
        });
        return degrees;
    }

    hasAdjacentWithColor(u, color, colors) {
        for (const w of this.adj[u]) {
            if (colors[w] === color) {
                return true;
            }
        }
        return false;
    }

    show() {
        this.adj.forEach((vertices, u) => {
            console.log('vertice ' + u);
            for (const w of vertices) {
                console.log(w);
            }
        });
    }
};

var IterationLog = function (curVertex, curNeighbor, curAvailable, colors,
    availableColors, statesEdges, queue, listDegrees, curList, neighborList) {
    this.curVertex = curVertex;
    this.curNeighbor = curNeighbor;
    this.curAvailable = curAvailable;
    this.colors = colors;
    this.availableColors = availableColors;
    this.statesEdges = statesEdges;
    this.queue = queue;
    this.listDegrees = listDegrees;
    this.curList = curList;
    this.neighborList = neighborList;
}

var addLogToArray = (logArray, curVertex, curNeighbor, curAvailable, colors,
    availableColors, statesEdges, queue, listDegrees, curList, neighborList) => {
    
    var colorsCpy = (colors) ? [...colors] : undefined;
    var avColorsCpy = (availableColors) ? [...availableColors] : undefined;
    var statesEdgesCpy = (statesEdges) ? [...statesEdges] : undefined;
    var queueCpy = (queue) ? [...queue] : undefined;
    var listDegreesCpy = (listDegrees) ? [...listDegrees] : undefined;

    logArray.push(new IterationLog(curVertex, curNeighbor, curAvailable,
        colorsCpy, avColorsCpy, statesEdgesCpy, queueCpy, listDegreesCpy,
        curList, neighborList));
};