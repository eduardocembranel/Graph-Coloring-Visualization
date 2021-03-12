var uiManager = new function () {
    this.statesColors = ['#eead2d', '#FF69B4', '#228b22', '#3b83bd', '#00dddd'];
    this.stateDefaultColor = '#888888';

    this.stateAcronyms = [
        'rs', 'sc', 'pr', 'sp', 'mg', 'rj', 'es', 'ms', 'mt', 'go', 'df',
        'ro', 'rr', 'ac', 'am', 'pa', 'ap', 'to', 'ba', 'ma', 'pi', 'ce',
        'rn', 'pb', 'pe', 'al', 'se'
    ];

    this.states = (function () {
        var states = [];
        for (const elem of this.stateAcronyms) {
            states.push(document.getElementById(elem));
        }
        return states;
    }).bind(this)();

    this.statesEdges = (function () {
        var statesEdges = new Map();
        statesEdges.set('0-1', document.getElementById('rs-sc'));
        statesEdges.set('1-2', document.getElementById('sc-pr'));
        statesEdges.set('2-3', document.getElementById('pr-sp'));
        statesEdges.set('2-7', document.getElementById('pr-ms'));
        statesEdges.set('3-4', document.getElementById('sp-mg'));
        statesEdges.set('3-5', document.getElementById('sp-rj'));
        statesEdges.set('3-7', document.getElementById('sp-ms'));
        statesEdges.set('4-5', document.getElementById('mg-rj'));
        statesEdges.set('4-6', document.getElementById('mg-es'));
        statesEdges.set('4-7', document.getElementById('mg-ms'));
        statesEdges.set('4-9', document.getElementById('mg-go'));
        statesEdges.set('4-10', document.getElementById('mg-df'));
        statesEdges.set('4-18', document.getElementById('mg-ba'));
        statesEdges.set('5-6', document.getElementById('rj-es'));
        statesEdges.set('6-18', document.getElementById('rj-ba'));
        statesEdges.set('7-8', document.getElementById('ms-mt'));
        statesEdges.set('7-9', document.getElementById('ms-go'));
        statesEdges.set('8-9', document.getElementById('mt-go'));
        statesEdges.set('8-11', document.getElementById('mt-ro'));
        statesEdges.set('8-14', document.getElementById('mt-am'));
        statesEdges.set('8-15', document.getElementById('mt-pa'));
        statesEdges.set('8-17', document.getElementById('mt-to'));
        statesEdges.set('9-10', document.getElementById('go-df'));
        statesEdges.set('9-17', document.getElementById('go-to'));
        statesEdges.set('9-18', document.getElementById('go-ba'));
        statesEdges.set('11-13', document.getElementById('ro-ac'));
        statesEdges.set('11-14', document.getElementById('ro-am'));
        statesEdges.set('12-14', document.getElementById('rr-am'));
        statesEdges.set('12-15', document.getElementById('rr-pa'));
        statesEdges.set('13-14', document.getElementById('ac-am'));
        statesEdges.set('14-15', document.getElementById('am-pa'));
        statesEdges.set('15-16', document.getElementById('pa-ap'));
        statesEdges.set('15-17', document.getElementById('pa-to'));
        statesEdges.set('15-19', document.getElementById('pa-ma'));
        statesEdges.set('17-18', document.getElementById('to-ba'));
        statesEdges.set('17-19', document.getElementById('to-ma'));
        statesEdges.set('17-20', document.getElementById('to-pi'));
        statesEdges.set('18-20', document.getElementById('ba-pi'));
        statesEdges.set('18-24', document.getElementById('ba-pe'));
        statesEdges.set('18-25', document.getElementById('ba-al'));
        statesEdges.set('18-26', document.getElementById('ba-se'));
        statesEdges.set('19-20', document.getElementById('ma-pi'));
        statesEdges.set('20-21', document.getElementById('pi-ce'));
        statesEdges.set('20-24', document.getElementById('pi-pe'));
        statesEdges.set('21-22', document.getElementById('ce-rn'));
        statesEdges.set('21-23', document.getElementById('ce-pb'));
        statesEdges.set('21-24', document.getElementById('ce-pe'));
        statesEdges.set('22-23', document.getElementById('rn-pb'));
        statesEdges.set('23-24', document.getElementById('pb-pe'));
        statesEdges.set('24-25', document.getElementById('pe-al'));
        statesEdges.set('25-26', document.getElementById('al-se'));

        return statesEdges;
    })();

    this.setStateEdge = (edge, active) => {
        if (active) {
            this.statesEdges.get(edge).style.visibility = 'visible';
        } else {
            this.statesEdges.get(edge).style.visibility = 'hidden';
        }
    };

    this.setAllStatesEdges = (edges) => {
        //initially set all edges as hidden
        for (const key of this.statesEdges.keys()) {
            this.setStateEdge(key, false);
        }

        if (edges) {
            for (const edge of edges) {
                this.setStateEdge(edge, true);
            }
        }
    };

    this.buttons = (function () {
        var buttons = new Map();
        buttons.set('play-pause', document.getElementById('play-pause'));
        buttons.set('skip-back', document.getElementById('skip-back'));
        buttons.set('skip-forward', document.getElementById('skip-forward'));
        buttons.set('step-back', document.getElementById('step-back'));
        buttons.set('step-forward', document.getElementById('step-forward'));
        buttons.set('anim-speed', document.getElementById('anim-speed'));
        return buttons;
    })();

    this.disableStepButtons = (disable) => {
        if (disable) {
            this.buttons.get('step-back').disabled = true;
            this.buttons.get('step-forward').disabled = true;
        } else {
            this.buttons.get('step-back').disabled = false;
            this.buttons.get('step-forward').disabled = false;
        }
    };

    this.setButtonsPlayMode = (playMode) => {
        if (playMode) {
            this.buttons.get('play-pause').innerHTML = 'Pausar';
            this.disableStepButtons(true);
        } else {
            this.buttons.get('play-pause').innerHTML = 'Play';
            this.disableStepButtons(false);
        }
    }

    this.queueTexts = (function () {
        var queueTexts = [];
        for (let i = 0; i < 13; ++i) {
            queueTexts.push(document.getElementById(`queue${i}-text`));
        }
        return queueTexts;
    })();

    this.setQueueState = (idx, stateIdx) => {
        let s = (stateIdx !== -1) ? this.stateAcronyms[stateIdx].toUpperCase() : '';
        this.queueTexts[idx].innerHTML = s;
    };

    this.setAllQueueStates = (queue) => {
        for (let i = 0; i < 13; ++i) {
            if (!queue || i >= queue.length) {
                this.setQueueState(i, -1);
            } else {
                this.setQueueState(i, queue[i]);
            }
        }
    };

    this.colorBoxes = [
        document.getElementById('color1-box'),
        document.getElementById('color2-box'),
        document.getElementById('color3-box'),
        document.getElementById('color4-box'),
        document.getElementById('color5-box')
    ];

    this.colorLines = [
        document.getElementById('color1-line'),
        document.getElementById('color2-line'),
        document.getElementById('color3-line'),
        document.getElementById('color4-line'),
        document.getElementById('color5-line'),
        document.getElementById('color1-line2'),
        document.getElementById('color2-line2'),
        document.getElementById('color3-line2'),
        document.getElementById('color4-line2'),
        document.getElementById('color5-line2'),
    ];

    this.setStateColor = (stateIdx, colorIdx) => {
        if (colorIdx === -1) {
            this.states[stateIdx].style.fill = this.stateDefaultColor;
        } else {
            this.states[stateIdx].style.fill = this.statesColors[colorIdx];
        }
    };

    this.setStateBorder = (stateIdx, mode) => {
        if (mode === 'highlight') {
            this.states[stateIdx].style.stroke = '#00ff00';
            this.states[stateIdx].style.strokeWidth = 7.0;
        } else if (mode === 'highlight2') {
            this.states[stateIdx].style.stroke = '#0000bb';
            this.states[stateIdx].style.strokeWidth = 7.0;
        } else if (mode === 'normal') {
            this.states[stateIdx].style.stroke = '#ffffff';
            this.states[stateIdx].style.strokeWidth = 1.0;
        }
    };

    this.setAllStatesBorders = (curVertex, curNeighbor) => {
        for (let i = 0; i < 27; ++i) {
            if (i === curVertex) {
                this.setStateBorder(i, 'highlight');
            } else if (i === curNeighbor) {
                this.setStateBorder(i, 'highlight2');
            } else {
                this.setStateBorder(i, 'normal');
            }
        }
    };

    this.setColorLine = (colorIdx, active) => {
        if (active) {
            //primary and second diagonal
            this.colorLines[colorIdx].style.visibility = 'visible';
            this.colorLines[colorIdx + 5].style.visibility = 'visible';
        } else {
            //primary and second diagonal
            this.colorLines[colorIdx].style.visibility = 'hidden';
            this.colorLines[colorIdx + 5].style.visibility = 'hidden';
        }
    };

    this.setAllColorsLines = (availableColors) => {
        for (let i = 0; i < 5; ++i) {
            if (!availableColors) {
                this.setColorLine(i, false);
            } else {
                this.setColorLine(i, availableColors[i]);
            }
        }
    };

    this.setBoxBorder = (idx, mode) => {
        if (mode === 'highlight') {
            this.colorBoxes[idx].style.stroke = '#000000';
            this.colorBoxes[idx].style.strokeWidth = 8.5;
        } else if (mode === 'normal') {
            this.colorBoxes[idx].style.stroke = '#000000';
            this.colorBoxes[idx].style.strokeWidth = 4.0;
        }
    };

    this.setAllBoxesBorders = (idxActiveBox) => {
        for (let i = 0; i < 5; ++i) {
            if (idxActiveBox === i) {
                this.setBoxBorder(i, 'highlight');
            } else {
                this.setBoxBorder(i, 'normal');
            }
        }
    };

    this.setAllStatesColors = (statesColors) => {
        statesColors.forEach((color, stateIdx) => {
            this.setStateColor(stateIdx, color);
        });
    };
};