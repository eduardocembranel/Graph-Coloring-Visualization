var AnimManager = function (log) {
    this.running = false;
    this.animDelay = 2010 - uiManager.getAnimSpeed();
    this.log = log;
    this.logIdx = 0;

    this.delay = () => {
        return new Promise((resolve, reject) => {
            uiManager.buttons.get('anim-speed').addEventListener(
            'cancelPromise', (e) => {
                resolve(e.detail);
            }, false);
            setTimeout(() => resolve(), this.animDelay);
        });
    };

    this.cancelPromise = (status) => {
        uiManager.buttons.get('anim-speed').dispatchEvent(
            new CustomEvent('cancelPromise', {
                detail: status
        }));
    };

    this.beginAnim = async () => {
        this.running = true;
        for (; this.logIdx < this.log.length && this.running; ++this.logIdx) {
            var status = await this.delay(this.animDelay);

            if (status) {
                this[status]();
            }

            this.animByIdx();
        }
        this.running = false;
        if (this.logIdx === this.log.length) {
            this.logIdx = Math.max(0, this.logIdx - 1);
        }
    };

    this.animByIdx = () => {
        const log = this.log[this.logIdx];

        uiManager.setAllStatesColors(log.colors);
        uiManager.setAllColorsLines(log.availableColors);
        uiManager.setAllBoxesBorders(log.curAvailable);
        uiManager.setAllStatesBorders(log.curVertex, log.curNeighbor);
        uiManager.setAllStatesEdges(log.statesEdges);
        uiManager.setAllQueueStates(log.queue);
        uiManager.setAllListDegreesAndLabels(log.listDegrees);
        uiManager.setAllListBoxesDegree(log.curList, log.neighborList);
    };

    this.isEndAnim = () => {
        return this.logIdx >= this.log.length - 1;
    }

    this.resetAnim = () => {
        this.logIdx = 0;
    }

    this.resetIfEnded = () => {
        if (this.isEndAnim()) {
            this.resetAnim();
        }
    }

    this.pause = () => {
        this.running = false;
    };

    this.changeSpeed = () => {
        this.animDelay = 2010 - uiManager.getAnimSpeed();
    };

    this.skipBack = () => {
        this.logIdx = 0;
        this.animByIdx();
    };

    this.skipForward = () => {
        this.logIdx = this.log.length - 1;
        this.animByIdx();
    };
    
    this.stepBack = () => {
        if (!this.running) {
            this.logIdxDec();
            this.animByIdx();
        }
    };

    this.stepForward = () => {
        if (!this.running) {
            this.logIdxInc();
            this.animByIdx();
        }
    };

    this.logIdxDec = () => {
        this.logIdx -= (this.logIdx > 0);
    };

    this.logIdxInc = () => {
        this.logIdx += (this.logIdx < this.log.length - 1);
    };
};