import {clipOther} from "./project-animation"
export function strategie(dm, i, matterList) {
    this.node1 = dm.getDataByTag(`移栽机-上下${i}`);
    this.node2 = dm.getDataByTag(`移栽机-平移杆${i}`);
    this.node3 = dm.getDataByTag(`移栽机-夹具左${i}`);
    this.node4 = dm.getDataByTag(`移栽机-夹具右${i}`);
    this.matterList = matterList;
    // this.currentMatter = currentMatter;
    // this.nextMatter = nextMatter;
    this.dm = dm;
    this.i = i;
    // this.currentPunch = currentPunch;
    this.node2.setHost(this.node1);
    this.node3.setHost(this.node2);
    this.node4.setHost(this.node2);
}

strategie.prototype = {
    status1: function () {
        let p3 = this.node2.p3();
        let x = p3[0], y = p3[1];
        let that = this;
        this.node2.setAnimation({
            go: {
                from: 0,
                to: 200,
                frames: 63,
                onUpdate: function (value) {
                    if (value < 200) {
                        x = x - 1;
                    }
                    that.node2.p3(x, y, p3[2]);
                },
                onComplete: () => {
                    this.node2.setAnimation(null);
                    this.status2();
                }
            },
            start: ['go']
        });
    },
    status2: function () {
        let p3 = this.node1.p3();
        let x = p3[0], y = p3[1];
        let that = this;
        this.node1.setAnimation({
            go: {
                from: 0,
                to: 60,
                frames: 7,
                onUpdate: function (value) {
                    if (value <= 60) {
                        y = y - 1;
                    }
                    that.node1.p3(x, y, p3[2]);
                },
                onComplete: () => {
                    this.matterList.find(item => {
                        let p3 = item.p3();
                        switch (this.i) {
                            case 1:
                                // this.matterList[this.matterList.length - 1].setHost(this.node3);
                                if (p3[0] === -1036) {
                                    item.setHost(this.node4);
                                }
                                if (p3[0] === -1161) {
                                    item.setHost(this.node3)
                                }
                                break;
                            case 2:
                                if (p3[0] === -911) {
                                    item.setHost(this.node3);
                                } else if (p3[0] === -786) {
                                    item.setHost(this.node4);
                                }
                                break;
                            case 3:
                                if (p3[0] === -661) {
                                    item.setHost(this.node3);
                                } else if (p3[0] === -536) {
                                    item.setHost(this.node4);
                                }
                                break;
                            case 4:
                                if (p3[0] === -411) {
                                    item.setHost(this.node3);
                                } else if (p3[0] === -286) {
                                    item.setHost(this.node4);
                                }
                                break;
                        }
                    })
                    // if(this.nextMatter){
                    //     this.nextMatter.setHost(this.node4);
                    // }
                    // if(this.currentMatter){
                    //     this.currentMatter.setHost(this.node3);
                    // }

                },
                next: 'back'
            },
            back: {
                from: 0,
                to: 60,
                frames: 7,
                onUpdate: function (value) {
                    if (value <= 60) {
                        y = y + 1;
                    }
                    that.node1.p3(x, y, p3[2]);
                },
                onComplete: () => {
                    this.node1.setAnimation(null);
                    this.status3();
                },
            },
            start: ['go']
        });
    },
    status3: function () {
        let p3 = this.node2.p3();
        let x = p3[0], y = p3[1];
        let that = this;
        this.node2.setAnimation({
            go: {
                from: 0,
                to: 200,
                frames: 124,
                onUpdate: function (value) {
                    if (value <= 200) {
                        x = x + 1;
                    }
                    that.node2.p3(x, y, p3[2]);
                },
                onComplete: () => {
                    this.node2.setAnimation(null);
                    this.status4();

                }
            },
            start: ['go']
        });
    },
    status4: function () {
        let p3 = this.node1.p3();
        let x = p3[0], y = p3[1];
        let that = this;
        this.node1.setAnimation({
            go: {
                from: 0,
                to: 60,
                frames: 7,
                onUpdate: function (value) {
                    if (value <= 60) {
                        y = y - 1;
                    }
                    that.node1.p3(x, y, p3[2]);
                },
                onComplete: () => {

                    this.matterList.find(item => {
                        let p3 = item.p3();
                        switch (p3[0]) {
                            case -1036:
                                item.setHost(null);
                                break;
                            case -911:
                                item.setHost(null);
                                break;
                            case -786:
                                item.setHost(null);
                                break;
                            case -661:
                                item.setHost(null);
                                break;
                            case -536:
                                item.setHost(null);
                                break;
                            case -411:
                                item.setHost(null);
                                break;
                            case -286:
                                item.setHost(null);
                                break;
                            case -161:
                                item.setHost(null);
                                break;
                        }
                    });
                    // if(this.nextMatter){
                    //     this.nextMatter.setHost(null);
                    // }
                    // if(this.currentMatter){
                    //     this.currentMatter.setHost(null);
                    // }

                },
                next: 'back'
            },
            back: {
                from: 0,
                to: 60,
                frames: 7,
                onUpdate: function (value) {
                    if (value <= 60) {
                        y = y + 1;
                    }
                    that.node1.p3(x, y, p3[2]);
                },
                onComplete: () => {
                    this.node1.setAnimation(null);
                    this.status5();
                },
            },
            start: ['go']
        });
    },
    status5: function () {
        let p3 = this.node2.p3();
        let x = p3[0], y = p3[1];
        let that = this;
        this.node2.setAnimation({
            go: {
                from: 0,
                to: 200,
                frames: 62,
                onUpdate: function (value) {
                    if (value < 200) {
                        x = x - 1;
                    }
                    that.node2.p3(x, y, p3[2]);
                },
                onComplete: () => {
                    this.node2.setAnimation(null);
                    // if(this.i === 1 &&  this.nextMatter){
                    //     that.dm.getDataByTag(`大冲床-动态`).resumeAnimation();
                    //     return
                    // }
                    // if(this.i !== 1){
                    //     that.dm.getDataByTag(`冲床动-${that.currentPunch}`).resumeAnimation();
                    // }
                }
            },
            start: ['go']
        });
    }
};

export function blanking(dm,matterList,bendMatterList) {
    this.node1 = dm.getDataByTag(`小移栽机-上下`);
    this.node2 = dm.getDataByTag(`小移栽机-杆子`);
    this.node3 = dm.getDataByTag(`小移栽机-夹具`);
    this.matterList = matterList;
    this.bendMatterList = bendMatterList;
    this.dm = dm;
    // this.count = count;
    this.node2.setHost(this.node1);
    this.node3.setHost(this.node2);
    this.currentMatter = null;
}

blanking.prototype = {
    status1: function () {
        let p3 = this.node2.p3();
        let x = p3[0], y = p3[1];
        let that = this;
        this.node2.setAnimation({
            go: {
                from: 0,
                to: 200,
                frames: 70,
                onUpdate: function (value) {
                    if (value < 200) {
                        x = x - 1;
                    }
                    that.node2.p3(x, y, p3[2]);
                },
                onComplete: () => {
                    this.node2.setAnimation(null);
                    this.status2();
                }
            },
            start: ['go']
        });
    },
    status2: function () {
        let p3 = this.node1.p3();
        let x = p3[0], y = p3[1];
        let that = this;
        this.node1.setAnimation({
            go: {
                from: 0,
                to: 100,
                frames: 12,
                onUpdate: function (value) {
                    if (value <= 100) {
                        y = y - 1;
                    }
                    that.node1.p3(x, y, p3[2]);
                },
                onComplete: () => {
                    this.matterList.find(item => {
                        let p3 = item.p3();
                        if (p3[0] === -161) {
                            this.currentMatter = item;
                            item.setHost(this.node3);
                        }
                    })
                    // if (this.currentMatter) {
                    //     this.currentMatter.setHost(this.node3);
                    // }

                },
                next: 'back'
            },
            back: {
                from: 0,
                to: 100,
                frames: 12,
                onUpdate: function (value) {
                    if (value <= 100) {
                        y = y + 1;
                    }
                    that.node1.p3(x, y, p3[2]);
                },
                onComplete: () => {
                    this.node1.setAnimation(null);
                    this.status3();
                },
            },
            start: ['go']
        });
    },
    status3: function () {
        let p3 = this.node2.p3();
        let x = p3[0], y = p3[1];
        let that = this;
        this.node2.setAnimation({
            go: {
                from: 0,
                to: 200,
                frames: 70,
                onUpdate: function (value) {
                    if (value < 200) {
                        x = x + 1;
                    }
                    that.node2.p3(x, y, p3[2]);
                },
                onComplete: () => {
                    this.node2.setAnimation(null);
                    this.status4();
                }
            },
            start: ['go']
        });
    },
    status4: function () {
        let p3 = this.node3.p3();
        let x = p3[0], y = p3[1];
        let that = this;
        this.node3.setAnimation({
            go: {
                from: 0,
                to: 200,
                frames:80,
                onUpdate: function (value) {
                    if (value < 200) {
                        x = x + 1;
                    }
                    that.node3.p3(x, y, p3[2]);
                },
                onComplete: () => {
                    this.node3.setAnimation(null);
                    this.status5();
                }
            },
            start: ['go']
        });
    },
    status5: function () {
        let p3 = this.node1.p3();
        let x = p3[0], y = p3[1];
        let that = this;
        this.node1.setAnimation({
            go: {
                from: 0,
                to: 60,
                frames: 2,
                onUpdate: function (value) {
                    if (value <= 60) {
                        y = y - 1;
                    }
                    that.node1.p3(x, y, p3[2]);
                },
                onComplete: () => {
                    // if(this.currentMatter){
                    //     this.currentMatter.setHost(null);
                    // }
                    this.matterList.find(item => {
                        let p3 = item.p3();
                        if (p3[0] >= -36) {
                            item.setHost(null);
                        }
                    })
                },
                next: 'back'
            },
            back: {
                from: 0,
                to: 60,
                frames: 2,
                onUpdate: function (value) {
                    if (value <= 60) {
                        y = y + 1;
                    }
                    that.node1.p3(x, y, p3[2]);
                },
                onComplete: () => {
                    this.node1.setAnimation(null);
                    if( this.currentMatter){
                        let transport = this.dm.getDataByTag('小车');
                        this.currentMatter.setHost(transport);
                        let tP3 = transport.p3();
                        let x1 = tP3[0],y1 = tP3[1],z1 = tP3[2];
                        transport.setAnimation({
                            ani:{
                                from: 0,
                                to: 60,
                                frames: 20,
                                onUpdate: function (value) {
                                    if (value <= 60) {
                                        x1 = x1 + 1;
                                    }
                                    transport.p3(x1, y1, z1);
                                },
                                onComplete: () => {
                                    transport.setAnimation(null);
                                    this.currentMatter.setHost(null);
                                    clipOther(this.dm, this.bendMatterList,this.matterList);
                                }
                            },
                            start:['ani']
                        })
                    }
                    this.status6();
                },
            },
            start: ['go']
        });
    },
    status6: function () {
        let p3 = this.node3.p3();
        let x = p3[0], y = p3[1];
        let that = this;
        this.node3.setAnimation({
            go: {
                from: 0,
                to: 200,
                frames: 80,
                onUpdate: function (value) {
                    if (value < 200) {
                        x = x - 1;
                    }
                    that.node3.p3(x, y, p3[2]);
                },
                onComplete: () => {
                    this.node3.setAnimation(null);
                    // if( this.currentMatter){
                    //     clipOther(this.dm, this.bendMatterList,this.matterList);
                    // }
                }
            },
            start: ['go']
        });
    }
};
