var g = new Graph(27);
g.addEdge(0, 1);
g.addEdge(1, 2);
g.addEdge(2, 3);
g.addEdge(2, 7);
g.addEdge(3, 4);
g.addEdge(3, 5);
g.addEdge(3, 7);
g.addEdge(4, 5);
g.addEdge(4, 6);
g.addEdge(4, 7);
g.addEdge(4, 9);
g.addEdge(4, 10);
g.addEdge(4, 18);
g.addEdge(5, 6);
g.addEdge(6, 18);
g.addEdge(7, 8);
g.addEdge(7, 9);
g.addEdge(8, 9);
g.addEdge(8, 11);
g.addEdge(8, 14);
g.addEdge(8, 15);
g.addEdge(8, 17);
g.addEdge(9, 10);
g.addEdge(9, 17);
g.addEdge(9, 18);
g.addEdge(11, 13);
g.addEdge(11, 14);
g.addEdge(12, 14);
g.addEdge(12, 15);
g.addEdge(13, 14);
g.addEdge(14, 15);
g.addEdge(15, 16);
g.addEdge(15, 17);
g.addEdge(15, 19);
g.addEdge(17, 18);
g.addEdge(17, 19);
g.addEdge(17, 20);
g.addEdge(18, 20);
g.addEdge(18, 24);
g.addEdge(18, 25);
g.addEdge(18, 26);
g.addEdge(19, 20);
g.addEdge(20, 21);
g.addEdge(20, 24);
g.addEdge(21, 22);
g.addEdge(21, 23);
g.addEdge(21, 24);
g.addEdge(22, 23);
g.addEdge(23, 24);
g.addEdge(24, 25);
g.addEdge(25, 26);

//var log = g.greedyColoring(); //ta ok
//var log = g.dfsColoring(5); //ta ok
var log = g.bfsColoring(18); //ta ok
//var log = g.bruteForceColoring(); //ta ok, so tem q mudar pra 
//aceitar um subgrafo

var animManager = new AnimManager(log);

uiManager.buttons.get('play-pause').onclick = (e) => {
    if (uiManager.buttons.get('play-pause').innerHTML === 'Play') {
        uiManager.setButtonsPlayMode(true);
        animManager.beginAnim().then(() => {
            uiManager.setButtonsPlayMode(false);
        });
    } else {
        uiManager.setButtonsPlayMode(false);
        animManager.cancelPromise('pause');
    }
};

uiManager.buttons.get('skip-forward').onclick = (e) => {
    uiManager.setButtonsPlayMode(false);

    if (animManager.running) {
        animManager.cancelPromise('skipForward');
    } else {
        animManager.skipForward();
    }
};

uiManager.buttons.get('skip-back').onclick = (e) => {
    if (animManager.running) {
        uiManager.setButtonsPlayMode(true);
        animManager.cancelPromise('skipBack');
    } else {
        uiManager.setButtonsPlayMode(false);
        animManager.skipBack();
    }
};

uiManager.buttons.get('step-back').onclick = (e) => {
    animManager.stepBack();
};

uiManager.buttons.get('step-forward').onclick = (e) => {
    animManager.stepForward();
};

uiManager.buttons.get('anim-speed').onclick = (e) => {
    animManager.cancelPromise('changeSpeed');
};