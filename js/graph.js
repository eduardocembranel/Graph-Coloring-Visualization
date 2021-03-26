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

        addLogToArray(log, -1, -1, -1, colors);

        var countOp = {count: 2};
        for (let u = 0; u < this.v; ++u) {
            this.solveCurrentVertex(countOp, u, colors, available, log);
            countOp.count += 2;
        }

        addLogToArray(log, -1, -1, -1, colors);

        alert(countOp.count);

        return log;
    }

    solveCurrentVertex(countOp, u, colors, available, log, edges, queue) {
        available.fill(false);

        addLogToArray(log, u, -1, -1, colors, available, edges, queue);

        countOp.count += 2;
        for (const w of this.adj[u]) {
            addLogToArray(log, u, w, -1, colors, available, edges, queue);

            countOp.count += 1;
            if (colors[w] !== -1) {
                available[colors[w]] = true;
                countOp.count += 1;

                addLogToArray(log, u, w, -1, colors, available, edges, queue);
            }

            countOp.count += 2;
        }

        countOp.count += 4;
        for (var i = 0; i < this.v && available[i]; ++i) {
            addLogToArray(log, u, -1, i, colors, available, edges, queue);
            countOp.count += 4;
        }

        addLogToArray(log, u, -1, i, colors, available, edges, queue);

        colors[u] = i;
        countOp.count += 1;

        addLogToArray(log, u, -1, -1, colors, available, edges, queue);
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

        addLogToArray(log, -1, -1, -1, colors);

        var countOp = {count: 0};
        this.dfsColoringAux(countOp, s, visited, colors, edges, log);

        alert(countOp.count);

        return log;
    }

    dfsColoringAux(countOp, curVertex, visited, colors, edges, log) {
        visited[curVertex] = true;
        countOp.count += 1;

        var available = Array.from({
            length: this.v
        }, e => false);

        this.solveCurrentVertex(countOp, curVertex, colors, available, log, edges);
        
        countOp.count += 2;
        for (const w of this.adj[curVertex]) {
            countOp.count += 1;
            if (!visited[w]) {
                edges.add(this.edgesToStr(curVertex, w));

                addLogToArray(log, curVertex, -1, -1, colors, available,
                     edges);

                this.dfsColoringAux(countOp, w, visited, colors, edges, log);

                edges.delete(this.edgesToStr(curVertex, w));

                addLogToArray(log, -1, -1, -1, colors, undefined,
                    edges);
            }
            countOp.count += 2;
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
        var countOp = {count: 3};

        addLogToArray(log, -1, -1, -1, colors, available, undefined, queue);

        countOp.count += 1;
        while (queue.length > 0) {
            curVertex = queue.shift();
            countOp.count += 1;

            this.solveCurrentVertex(countOp, curVertex, colors, available, log, 
                undefined, queue);

            countOp.count += 2;
            for (const w of this.adj[curVertex]) {
                addLogToArray(log, curVertex, w, -1, colors, available, 
                    undefined, queue);

                countOp.count += 1;
                if (!visited[w]) {
                    visited[w] = true;
                    queue.push(w);
                    countOp.count += 2;

                    addLogToArray(log, curVertex, -1, -1, colors, available, 
                        undefined, queue);
                }
                countOp.count += 2;
            }
            countOp.count += 1;
        }

        addLogToArray(log, -1, -1, -1, colors);

        alert(countOp.count);

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

        var log = [];

        addLogToArray(log, -1, -1, -1, colors);
        addLogToArray(log, -1, -1, -1, colors, undefined, undefined,
            undefined, undefined, undefined, undefined, maxV);

        var countOp = {count: 1};
        if (this.bruteForceColoringAux(countOp, 0, maxV, maxC, colors, log)) {
            addLogToArray(log, -1, -1, -1, colors, undefined, undefined,
                undefined, undefined, undefined, undefined, maxV);
            
            alert(countOp.count);
            return log;
        }

        return undefined;
    }

    bruteForceColoringAux(countOp, curVertex, maxV, maxC, colors, log) {
        countOp.count += 1;
        if (curVertex === maxV) {
            return this.isSafe(countOp, colors, maxV);
        }

        addLogToArray(log, curVertex, -1, -1, colors, undefined, undefined,
            undefined, undefined, undefined, undefined, maxV);

        countOp.count += 2;
        for (let i = 0; i < maxC; ++i) {
            colors[curVertex] = i;
            countOp.count += 1;

            addLogToArray(log, curVertex, -1, -1, colors, undefined, undefined,
                undefined, undefined, undefined, undefined, maxV);

            countOp.count += 1;
            if (this.bruteForceColoringAux(countOp, curVertex + 1, maxV, maxC, 
                colors, log)) {
                return true;
            }

            countOp.count += 2;
        }
        return false;
    }

    isSafe(countOp, colors, maxV = this.v) {
        countOp.count += 2;
        for (let u = 0; u < maxV; ++u) {
            countOp.count += 2;
            for (const w of this.adj[u]) {
                countOp.count += 1;
                if (w < maxV) {
                    countOp.count += 1;
                    if (colors[u] === colors[w]) {
                        return false;
                    } else if (colors[u] === -1 || colors[w] === -1) {
                        countOp.count += 3;
                        return false;
                    }
                    countOp.count += 3;
                }
                countOp.count += 2;
            }
            countOp.count += 2;
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

        addLogToArray(log, -1, -1, -1, colors);
        addLogToArray(log, -1, -1, -1, colors, undefined, undefined,
            undefined, undefined, undefined, undefined, maxV);

        var countOp = {count: 2};

        for (let i = 0; i < 4; ++i) {
            colors[s] = i;

            countOp.count += 2;
            if (this.bruteForceColoringAux2(countOp, s, maxV, maxC, colors,
                visited, log, edges)) {
                addLogToArray(log, -1, -1, -1, colors, undefined, undefined,
                    undefined, undefined, undefined, undefined, maxV);

                alert(countOp.count);
                return log;
            }
            countOp.count += 2;
        }
        return undefined;
    }

    bruteForceColoringAux2(countOp, curVertex, maxV, maxC, colors, 
        visited, log, edges) {
        addLogToArray(log, curVertex, -1, -1, colors, undefined, edges,
            undefined, undefined, undefined, undefined, maxV);

        visited[curVertex] = true;
        
        countOp.count += 2;
        if (this.isSafe(countOp, colors, maxV)) {
            return true;
        }

        countOp.count += 2;
        for (let i = 0; i < maxC; ++i) {
            countOp.count += 2;
            for (const w of this.adj[curVertex]) {
                countOp.count += 5;
                if (!visited[w] && w < maxV) {
                    edges.add(this.edgesToStr(curVertex, w));
                    addLogToArray(log, curVertex, -1, -1, colors, undefined, 
                        edges, undefined, undefined, undefined,
                        undefined, maxV);
                    
                    colors[w] = i;
                    countOp.count += 1;
                        
                    var solved = this.bruteForceColoringAux2(countOp, w, maxV, 
                        maxC, colors, visited, log, edges);

                    edges.delete(this.edgesToStr(curVertex, w));
                    addLogToArray(log, curVertex, -1, -1, colors, undefined, 
                        edges, undefined, undefined, undefined,
                        undefined, maxV); 
                        
                    countOp.count += 1;
                    if (solved) {
                        return true;
                    }    
                }
            }
        }

        visited[curVertex] = false;
        countOp.count += 1;

        return false;
    }

    welshPowell() {
        var colors = Array.from({
            length: this.v
        }, e => -1);
        var log = [];

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
    availableColors, statesEdges, queue, listDegrees, curList, neighborList,
    subgraphSize) {
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
    this.subgraphSize = subgraphSize;
}

var addLogToArray = (logArray, curVertex, curNeighbor, curAvailable, colors,
    availableColors, statesEdges, queue, listDegrees, curList, neighborList,
    subgraphSize) => {
    
    var colorsCpy = (colors) ? [...colors] : undefined;
    var avColorsCpy = (availableColors) ? [...availableColors] : undefined;
    var statesEdgesCpy = (statesEdges) ? [...statesEdges] : undefined;
    var queueCpy = (queue) ? [...queue] : undefined;
    var listDegreesCpy = (listDegrees) ? [...listDegrees] : undefined;

    logArray.push(new IterationLog(curVertex, curNeighbor, curAvailable,
        colorsCpy, avColorsCpy, statesEdgesCpy, queueCpy, listDegreesCpy,
        curList, neighborList, subgraphSize));
};