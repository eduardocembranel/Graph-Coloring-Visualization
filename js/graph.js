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

    linearSearchColoring() {
        var colors = Array.from({
            length: this.v
        }, e => -1);
        var available = Array.from({
            length: this.v
        }, e => false);
        var log = [];
        var opCount = {count: 0};

        addLogToArray(opCount, log, -1, -1, -1, colors);

        opCount.count += 2;
        for (let u = 0; u < this.v; ++u) {
            this.solveCurrentVertex(opCount, u, colors, available, log);
            opCount.count += 2;
        }

        addLogToArray(opCount, log, -1, -1, -1, colors);

        return log;
    }

    solveCurrentVertex(opCount, u, colors, available, log, edges, queue) {
        available.fill(false);

        addLogToArray(opCount, log, u, -1, -1, colors, available, edges, queue);

        opCount.count += 2;
        for (const w of this.adj[u]) {
            addLogToArray(opCount, log, u, w, -1, colors, available, edges, queue);

            opCount.count += 1;
            if (colors[w] !== -1) {
                available[colors[w]] = true;
                opCount.count += 1;

                addLogToArray(opCount, log, u, w, -1, colors, available, edges, queue);
            }

            opCount.count += 2;
        }

        opCount.count += 4;
        for (var i = 0; i < this.v && available[i]; ++i) {
            addLogToArray(opCount, log, u, -1, i, colors, available, edges, queue);
            opCount.count += 4;
        }

        addLogToArray(opCount, log, u, -1, i, colors, available, edges, queue);

        colors[u] = i;
        opCount.count += 1;

        addLogToArray(opCount, log, u, -1, -1, colors, available, edges, queue);
    }

    dfsColoring(s = 10) {
        var visited = Array.from({
            length: this.v
        }, e => false);
        var colors = Array.from({
            length: this.v
        }, e => -1);
        var edges = new Set();
        var log = [];
        var opCount = {count: 0};

        addLogToArray(opCount, log, -1, -1, -1, colors);

        this.dfsColoringAux(opCount, s, visited, colors, edges, log);

        return log;
    }

    dfsColoringAux(opCount, curVertex, visited, colors, edges, log) {
        visited[curVertex] = true;
        opCount.count += 1;

        var available = Array.from({
            length: this.v
        }, e => false);

        this.solveCurrentVertex(opCount, curVertex, colors, available, log, edges);
        
        opCount.count += 2;
        for (const w of this.adj[curVertex]) {
            opCount.count += 1;
            if (!visited[w]) {
                edges.add(this.edgesToStr(curVertex, w));

                addLogToArray(opCount, log, curVertex, -1, -1, colors, available,
                     edges);

                this.dfsColoringAux(opCount, w, visited, colors, edges, log);

                edges.delete(this.edgesToStr(curVertex, w));

                addLogToArray(opCount, log, -1, -1, -1, colors, undefined,
                    edges);
            }
            opCount.count += 2;
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
        var opCount = {count: 0};

        addLogToArray(opCount, log, -1, -1, -1, colors);

        const clone = JSON.parse(JSON.stringify(this.adj));

        var verticesDeg = this.calcVerticesDeg();
        opCount.count += this.v + 2;
        for (const w of this.adj) {
            w.sort((a, b) => {
                return verticesDeg[b].degree - verticesDeg[a].degree;
            });
            opCount.count += 2 + w.length * Math.floor(Math.log2(w.length));
        }

        addLogToArray(opCount, log, -1, -1, -1, colors, undefined, undefined,
            undefined, verticesDeg);

        verticesDeg.sort((a, b) => {
            return b.degree - a.degree;
        });
        opCount.count += this.v * Math.floor(Math.log2(this.v));

        addLogToArray(opCount, log, -1, -1, -1, colors, undefined, undefined,
            undefined, verticesDeg);

        this.dfsColoringAux(opCount, verticesDeg[0].vertex, 
            visited, colors, edges, log);

        for (let i = 3; i < log.length; ++i) {
            log[i].listDeg = verticesDeg;
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
        var opCount = {count: 0};

        addLogToArray(opCount, log, -1, -1, -1, colors, available, undefined, queue);

        var curVertex = s;
        visited[curVertex] = true;
        queue.push(curVertex);
        opCount.count += 3;

        addLogToArray(opCount, log, -1, -1, -1, colors, available, undefined, queue);

        opCount.count += 1;
        while (queue.length > 0) {
            curVertex = queue.shift();
            opCount.count += 1;

            this.solveCurrentVertex(opCount, curVertex, colors, available, log, 
                undefined, queue);

            opCount.count += 2;
            for (const w of this.adj[curVertex]) {
                addLogToArray(opCount, log, curVertex, w, -1, colors, available, 
                    undefined, queue);

                opCount.count += 1;
                if (!visited[w]) {
                    visited[w] = true;
                    queue.push(w);
                    opCount.count += 2;

                    addLogToArray(opCount, log, curVertex, -1, -1, colors, available, 
                        undefined, queue);
                }
                opCount.count += 2;
            }
            opCount.count += 1;
        }

        addLogToArray(opCount, log, -1, -1, -1, colors);

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
        var opCount = {count: 0};

        addLogToArray(opCount, log, -1, -1, -1, colors);

        const clone = JSON.parse(JSON.stringify(this.adj));

        var verticesDeg = this.calcVerticesDeg();
        opCount.count += this.v + 2;
        for (const w of this.adj) {
            w.sort((a, b) => {
                return verticesDeg[b].degree - verticesDeg[a].degree;
            });
            opCount.count += 2 + w.length * Math.floor(Math.log2(w.length));
        }

        addLogToArray(opCount, log, -1, -1, -1, colors, undefined, undefined,
            undefined, verticesDeg);

        verticesDeg.sort((a, b) => {
            return b.degree - a.degree;
        });
        opCount.count += this.v * Math.floor(Math.log2(this.v));

        addLogToArray(opCount, log, -1, -1, -1, colors, undefined, undefined,
            undefined, verticesDeg);

        var curVertex = verticesDeg[0].vertex;
        visited[curVertex] = true;
        queue.push(curVertex);
        opCount.count += 3;

        addLogToArray(opCount, log, -1, -1, -1, colors, available, undefined, queue);

        opCount.count += 1;
        while (queue.length > 0) {
            curVertex = queue.shift();
            opCount.count += 1;

            this.solveCurrentVertex(opCount, curVertex, colors, available, log, 
                undefined, queue);

            opCount.count += 2;
            for (const w of this.adj[curVertex]) {
                addLogToArray(opCount, log, curVertex, w, -1, colors, available, 
                    undefined, queue);

                opCount.count += 1;
                if (!visited[w]) {
                    visited[w] = true;
                    queue.push(w);
                    opCount.count += 2;

                    addLogToArray(opCount, log, curVertex, -1, -1, colors, available, 
                        undefined, queue);
                }
                opCount.count += 2;
            }
            opCount.count += 1;
        }

        addLogToArray(opCount, log, -1, -1, -1, colors);

        for (let i = 3; i < log.length; ++i) {
            log[i].listDeg = verticesDeg;
        }

        this.adj = clone;

        return log;
    }

    bruteForceColoring(maxV = this.v, maxC = this.v) {
        var colors = Array.from({
            length: maxV
        }, e => -1);

        var log = [];
        var opCount = {count: 0};

        addLogToArray(opCount, log, -1, -1, -1, colors);
        addLogToArray(opCount, log, -1, -1, -1, colors, undefined, undefined,
            undefined, undefined, undefined, undefined, maxV);

        opCount.count += 1;
        if (this.bruteForceColoringAux(opCount, 0, maxV, maxC, colors, log)) {
            addLogToArray(opCount, log, -1, -1, -1, colors, undefined, undefined,
                undefined, undefined, undefined, undefined, maxV);
            return log;
        }

        return undefined;
    }

    bruteForceColoringAux(opCount, curVertex, maxV, maxC, colors, log) {
        opCount.count += 1;
        if (curVertex === maxV) {
            return this.isSafe(opCount, colors, maxV);
        }

        addLogToArray(opCount, log, curVertex, -1, -1, colors, undefined, undefined,
            undefined, undefined, undefined, undefined, maxV);

        opCount.count += 2;
        for (let i = 0; i < maxC; ++i) {
            colors[curVertex] = i;
            opCount.count += 1;

            addLogToArray(opCount, log, curVertex, -1, -1, colors, undefined, undefined,
                undefined, undefined, undefined, undefined, maxV);

            opCount.count += 1;
            if (this.bruteForceColoringAux(opCount, curVertex + 1, maxV, maxC, 
                colors, log)) {
                return true;
            }

            opCount.count += 2;
        }
        return false;
    }

    isSafe(opCount, colors, maxV = this.v) {
        opCount.count += 2;
        for (let u = 0; u < maxV; ++u) {
            opCount.count += 2;
            for (const w of this.adj[u]) {
                opCount.count += 1;
                if (w < maxV) {
                    opCount.count += 1;
                    if (colors[u] === colors[w]) {
                        return false;
                    } else if (colors[u] === -1 || colors[w] === -1) {
                        opCount.count += 3;
                        return false;
                    }
                    opCount.count += 3;
                }
                opCount.count += 2;
            }
            opCount.count += 2;
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
        var edges = new Set();

        var log = [];
        var opCount = {count: 0};

        addLogToArray(opCount, log, -1, -1, -1, colors);
        addLogToArray(opCount, log, -1, -1, -1, colors, undefined, undefined,
            undefined, undefined, undefined, undefined, maxV);

        opCount.count += 2;
        for (let i = 0; i < 4; ++i) {
            colors[s] = i;
            opCount.count += 2;
            if (this.bruteForceColoringAux2(opCount, s, maxV, maxC, colors,
                visited, log, edges)) {
                addLogToArray(opCount, log, -1, -1, -1, colors, undefined, undefined,
                    undefined, undefined, undefined, undefined, maxV);
                return log;
            }
            opCount.count += 2;
        }
        return undefined;
    }

    bruteForceColoringAux2(opCount, curVertex, maxV, maxC, colors, 
        visited, log, edges) {
        addLogToArray(opCount, log, curVertex, -1, -1, colors, undefined, edges,
            undefined, undefined, undefined, undefined, maxV);

        visited[curVertex] = true;
        opCount.count += 2;
        if (this.isSafe(opCount, colors, maxV)) {
            return true;
        }

        opCount.count += 2;
        for (let i = 0; i < maxC; ++i) {
            opCount.count += 2;
            for (const w of this.adj[curVertex]) {
                opCount.count += 3;
                if (!visited[w] && w < maxV) {
                    edges.add(this.edgesToStr(curVertex, w));
                    addLogToArray(opCount, log, curVertex, -1, -1, colors, undefined, 
                        edges, undefined, undefined, undefined,
                        undefined, maxV);
                    
                    colors[w] = i;
                    opCount.count += 1;
                        
                    var solved = this.bruteForceColoringAux2(opCount, w, maxV, 
                        maxC, colors, visited, log, edges);

                    edges.delete(this.edgesToStr(curVertex, w));
                    addLogToArray(opCount, log, curVertex, -1, -1, colors, undefined, 
                        edges, undefined, undefined, undefined,
                        undefined, maxV); 
                        
                    opCount.count += 1;
                    if (solved) {
                        return true;
                    }    
                }
                opCount.count += 2;
            }
            opCount.count += 2;
        }

        visited[curVertex] = false;
        opCount.count += 1;

        return false;
    }

    welshPowell() {
        var colors = Array.from({
            length: this.v
        }, e => -1);
        var log = [];
        var opCount = {count: 0};

        addLogToArray(opCount, log, -1, -1, -1, colors);

        var verticesDeg = this.calcVerticesDeg();
        opCount.count += this.v;

        addLogToArray(opCount, log, -1, -1, -1, colors, undefined, undefined,
            undefined, verticesDeg);

        verticesDeg.sort((a, b) => {
            return b.degree - a.degree;
        });
        opCount.count += this.v * Math.floor(Math.log2(this.v));

        addLogToArray(opCount, log, -1, -1, -1, colors, undefined, undefined,
            undefined, verticesDeg);
  
        var colorCount = 0;
        opCount.count += 3;
        for (let i = 0; i < verticesDeg.length; ++i) {
            const curVertex = verticesDeg[i].vertex;
            opCount.count += 1;

            addLogToArray(opCount, log, curVertex, -1, colorCount, colors, undefined,
                undefined, undefined, verticesDeg, i, -1);

            opCount.count += 1;
            if (colors[curVertex] === -1) {
                colors[curVertex] = colorCount;
                opCount.count += 1;
                
                addLogToArray(opCount, log, curVertex, -1, colorCount, colors,
                    undefined, undefined, undefined, verticesDeg, i, -1);

                opCount.count += 3;
                for (let j = i + 1; j < verticesDeg.length; ++j) {
                    const w = verticesDeg[j].vertex;
                    opCount.count += 2;
                    if (colors[w] === -1) {
                        addLogToArray(opCount, log, curVertex, w, colorCount, colors,
                            undefined, undefined, undefined, verticesDeg, i, j);
                        
                        opCount.count += 1;
                        if (!this.hasAdjacentWithColor(opCount, w, 
                            colorCount, colors)) {
                            colors[w] = colorCount;
                            opCount.count += 1;

                            addLogToArray(opCount, log, curVertex, w, colorCount, colors,
                                undefined, undefined, undefined, verticesDeg, i, j);
                        }
                    }
                    opCount.count += 2;
                }
                ++colorCount;
            }
            opCount.count += 2;
        }

        addLogToArray(opCount, log, -1, -1, -1, colors, undefined, undefined, undefined, 
            verticesDeg);
    
        return log;
    }

    calcVerticesDeg() {
        var degrees = [];
        this.adj.forEach((w, idx) => {
            degrees.push({
                vertex: idx,
                degree: w.length
            });
        });
        return degrees;
    }

    hasAdjacentWithColor(opCount, u, color, colors) {
        opCount.count += 2;
        for (const w of this.adj[u]) {
            opCount.count += 1;
            if (colors[w] === color) {
                return true;
            }
            opCount.count += 2;
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

var IterationLog = function (opCount, curVertex, curNeighbor, curAvailable, colors,
    availableColors, statesEdges, queue, listDeg, curList, neighborList,
    subgraphSize) {
    this.opCount = opCount.count;
    this.curVertex = curVertex;
    this.curNeighbor = curNeighbor;
    this.curAvailable = curAvailable;
    this.colors = colors;
    this.availableColors = availableColors;
    this.statesEdges = statesEdges;
    this.queue = queue;
    this.listDeg = listDeg;
    this.curList = curList;
    this.neighborList = neighborList;
    this.subgraphSize = subgraphSize;
}

var addLogToArray = (opCount, logArray, curVertex, curNeighbor, curAvailable, colors,
    availableColors, statesEdges, queue, listDeg, curList, neighborList,
    subgraphSize) => {
    
    var colorsCpy = (colors) ? [...colors] : undefined;
    var avColorsCpy = (availableColors) ? [...availableColors] : undefined;
    var statesEdgesCpy = (statesEdges) ? [...statesEdges] : undefined;
    var queueCpy = (queue) ? [...queue] : undefined;
    var listDegCpy = (listDeg) ? [...listDeg] : undefined;

    logArray.push(new IterationLog(opCount, curVertex, curNeighbor, 
        curAvailable, colorsCpy, avColorsCpy, statesEdgesCpy, queueCpy, 
        listDegCpy, curList, neighborList, subgraphSize));
};