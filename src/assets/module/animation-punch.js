// import {createMatter} from "./matter"
// import {strategie, blanking} from "./animation-transplanter";
// let count = 0;
// let matterList = [];
export function punch(dm, node, tagName) {
    let p3 = node.p3();
    let x = p3[0];
    let y = p3[1];
    // node.setTag(tagName);
    // let currentMatter, nextMatter;
    node.setAnimation({
        go: {
            from: 0,
            to: 100,
            frames: 50,
            next: 'back',
            onUpdate: function (value) {
                if (value <= 100) {
                    y = y - 1;
                }
                node.p3(x, y, p3[2]);
            },
            onComplete: () => {
                // let currentMatter, nextMatter;
                // switch (node.getTag()) {
                //     case '冲床动-1':
                //         matterList.find(item => {
                //             let p3 = item.p3();
                //             if (p3[0] === -661) {
                //                 currentMatter = item;
                //             } else if (p3[0] === -536) {
                //                 nextMatter = item;
                //             }
                //         });
                //         if (currentMatter) {
                //             let strategies2 = new strategie(dm, 3, currentMatter ? currentMatter : null, nextMatter ? nextMatter : null, 2);
                //             strategies2.status1();
                //             strategies2 = null;
                //         }
                //         break;
                //     case '冲床动-2':
                //         matterList.find(item => {
                //             let p3 = item.p3();
                //             if (p3[0] === -411) {
                //                 currentMatter = item;
                //             } else if (p3[0] === -286) {
                //                 nextMatter = item;
                //             }
                //         });
                //         if (currentMatter) {
                //             let strategies3 = new strategie(dm, 4, currentMatter ? currentMatter : null, nextMatter ? nextMatter : null, 3);
                //             strategies3.status1();
                //             strategies3 = null;
                //         }
                //
                //         break;
                //     case '冲床动-3':
                //         matterList.find(item => {
                //             let p3 = item.p3();
                //             if (p3[0] === -161) {
                //                 currentMatter = item;
                //             }
                //         });
                //         if (currentMatter) {
                //             let blank = new blanking(dm, currentMatter ? currentMatter : null);
                //             blank.status1();
                //         }
                //         break;
                // }
            }
        },
        back: {
            from: 0,
            to: 100,
            frames: 50,
            delay:100,
            onUpdate: function (value) {
                if (value <= 100) {
                    y = y + 1;//上层
                }
                node.p3(x, y, p3[2]);
            },
            next: 'go',
            onComplete: function () {
                // if (node.getTag() === '冲床动-1') {
                //     count++;
                // }
                node.setAnimation(null);
            },
        },
        start: ['go']
    });
    // node.pauseAnimation()
}


export function bigPunch(dm, node, tagName) {
    let p3 = node.p3();
    let x = p3[0];
    let y = p3[1];
    // node.setTag(tagName);
    node.setAnimation({
        go: {
            from: 0,
            to: 200,
            frames: 50,
            next: 'back',
            onUpdate: function (value) {
                if (value <= 200) {
                    y = y - 1;
                }
                node.p3(x, y, p3[2]);
            },
            onComplete: () => {
                // let currentMatter, nextMatter;
                // matterList.find(item => {
                //     let p3 = item.p3();
                //     if (p3[0] === -911) {
                //         currentMatter = item;
                //     } else if (p3[0] === -786) {
                //         nextMatter = item;
                //     }
                // });
                // let strategies1 = new strategie(dm, 2, currentMatter, nextMatter, 1);
                // strategies1.status1();
                // strategies1 = null;
            }
        },
        back: {
            from: 0,
            to: 200,
            frames: 50,
            delay:100,
            onUpdate: function (value) {
                if (value <= 200) {
                    y = y + 1;//上层
                }
                node.p3(x, y, p3[2]);
            },
            next: 'go',
            onComplete: function () {
                // new pusher(dm, dm.getDataByTag('上料机-左右平移'));
                node.setAnimation(null);
            },
        },
        start: ['go']
    });
    // node.pauseAnimation();
}
export function pusher(dm, node,matterList) {
    //node为推送器元素
    // matterList.push(createMatter(dm, `物料${count}`));
    // let nextMatter;
    let len = matterList.length;
    let sensor = dm.getDataByTag('上料机-上下移动');
    let p3 = sensor.p3();
    let x = p3[0];
    let y = p3[1];
    sensor.setHost(node);
    sensor.setAnimation({
        go: {
            from: 0,
            to: 100,
            frames: 30,
            next: 'back',
            onUpdate: function (value) {
                if (value <= 100) {
                    y = y - 1;
                }
                sensor.p3(x, y, p3[2]);
            },
            onComplete: () => {
                matterList[len - 1].setHost(sensor)
            }
        },
        back: {
            from: 0,
            to: 100,
            frames: 30,
            onUpdate: function (value) {
                if (value <= 100) {
                    y = y + 1;//上层
                }
                sensor.p3(x, y, p3[2]);
            },
            next: 'go',
            onComplete: function () {
               sensor.setAnimation(null);
                let p3 = node.p3();
                let x = p3[0], y = p3[1];
                node.setAnimation({
                    ani: {
                        from: 0,
                        to: 100,
                        frames: 60,
                        next: 'back',
                        onUpdate: function (value) {
                            if (value <= 100) {
                                x = x + 1;
                            }
                            node.p3(x, y, p3[2]);
                        },
                        onComplete: () => {
                            matterList[len - 1].setHost(null)
                        }
                    },
                    back: {
                        from: 0,
                        to: 100,
                        frames: 60,
                        next: 'ani',
                        onUpdate: function (value) {
                            if (value <= 100) {
                                x = x - 1;
                            }
                            node.p3(x, y, p3[2]);
                        },
                        onComplete: () => {
                           node.setAnimation(null);
                            // matterList.find(item => {
                            //     let p3 = item.p3();
                            //     if (p3[0] === -1036) {
                            //         nextMatter = item;
                            //     }
                            // });
                            // let strategies1 = new strategie(dm, 1, matterList[len - 1], nextMatter ? nextMatter : '', '');
                            // strategies1.status1();
                            // strategies1 = null;
                        }
                    },
                    start: ['ani']
                });

            },
        },
        start: ['go']
    });
    // sensor.pauseAnimation();
}
