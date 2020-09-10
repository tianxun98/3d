let num = 0;
// let matterList = [];//总得洗衣机物料
export function tongs(dm,completeCallback,bendMatterList) {
    let node = dm.getDataByTag('tag');
    let p3 = node.p3();
    let x = p3[0];
    let y = p3[1];
    let maxX = 100, minX = 1, maxY = 25, minY = 1,currentY = 110,midY = 85;
    // let rz = 0.155;
    let rz = 0.062;
    node.setAnimation({
        go: {
            from: 0,
            to: 300,
            frames: 200,
            next: 'back',
            onUpdate: function (value) {
                    if (minY < maxY) {
                        minY++;
                        y--;
                    }else if(minY === maxY) {
                        if(bendMatterList.length > 0){
                            carBack(dm);
                            bendMatterList.find(i=> {
                                i.setHost(node);
                            });
                        }
                        if(y < currentY){
                            y++;
                        }else{
                            minY++;
                        }
                    }
                    else {
                        if (minX < maxX) {
                            if(bendMatterList.length > 0){
                                bendMatterList.find(item=>{
                                    let itemP3 = item.p3();
                                    let x1 = itemP3[0],y1 = itemP3[1],z1 = itemP3[2];
                                    if(x1 >= 207 && x1 < 350){
                                        if (item.getRotationZ() < 1.55) {
                                            item.setRotation3d(0, 0, (item.getRotationZ() + rz));
                                            item.p3(x1 + 0.6, y1 + 0.6, z1);
                                            // item.p3(x1 + 1.3, y1 + 1.5, z1);
                                        }
                                    }
                                    if(x1 > 360 && x1 < 470){
                                        if (item.getRotationZ() > -1.55) {
                                            item.setRotation3d(0, 0, (item.getRotationZ() - rz));
                                            // item.p3(x1 - 1.2, y1, z1);
                                            item.p3(x1 - 0.5, y1, z1);
                                        }
                                    }
                                });
                            }

                            minX++;
                            x++;
                        } else {
                            if (y > midY) {
                                y = y - 1;
                            }
                        }
                    }
                node.p3(x, y, p3[2]);
            },
            onComplete: () => {
                minX = 1;
                minY = 1;
                if(bendMatterList.length > 0){
                    bendMatterList.find(item=>{
                        item.setHost(null);
                        if(parseInt(item.p3()[0]) >= 688){
                            // node.pauseAnimation();
                            new conveyor(dm,item,completeCallback,bendMatterList);
                        }
                    })
                }
            }
        },
        back: {
            from: 0,
            to: 300,
            frames: 150,
            next:'go',
            onUpdate: function (value) {
                if (minY < maxY) {
                    y++;//上层
                    minY++;
                } else {
                    if (minX < maxX) {
                        x--;
                        minX++;
                    }
                }
                node.p3(x, y, p3[2]);
            },
            onComplete: () =>{
               // dm.getDataByTag('tagOther').resumeAnimation();
                minX = 1;
                minY = 1;
                if(bendMatterList.length > 0){
                    let len = bendMatterList.length;
                    let item = bendMatterList[len - 1];
                    let p3 = item.p3();
                    if(p3[0] !== 108 ){
                       return node.pauseAnimation();
                      // return node.setAnimation(null);
                    }
                }
                // node.setAnimation(null);
            },
        },
        start: ['go']
    });
    node.pauseAnimation();
}
export function clipOther(dm,bendMatterList,matterList) {
    let node = dm.getDataByTag('tagOther');
    let p3 = node.p3();
    let x = p3[0];
    let y = p3[1];
//    node.setTag(tagName);
    node.setAnimation({
        go: {
            from: 0,
            to: 100,
            frames: 30,
            next: 'back',
            onUpdate: function (value) {
                if (value <= 100) {
                    y = y - 1;
                }
                node.p3(x, y, p3[2]);
            },
            onComplete: () => {
                if(matterList.length > 0){
                    matterList.find(item=>{
                        let p3 = item.p3();
                        if(p3[0] >= -40){
                            item.s('shape3d.transparent', true);
                            item.s('shape3d.opacity', 0);
                            item = null;
                        }
                    });
                    bendMatterList.push(createChangeMatter(`洗衣机${num}`, dm));
                    // console.log('list1',bendMatterList);
                }
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
                node.p3(x, y, p3[2]);
            },
            next: 'go',
            onComplete: function () {
                // node.pauseAnimation();
               node.setAnimation(null);
                num++;//执行完成后加
            },
        },
        start: ['go']
    });
    // node.pauseAnimation();
}

// import {punch, bigPunch,pusher} from "./animation-punch"
import {createChangeMatter} from "./matter"

// export function animations(dm, node, completeCallback) {
//     switch (node.s('shape3d')) {
//         case '整体夹具':
//             tongs(dm,node,'tag',completeCallback);
//             break;
//         case '抓手':
//             clipOther(dm, node);
//             break;
//         case '大冲床-动态':
//             bigPunch(dm, node, '大冲床-动态');
//             break;
//         case '冲床动-1':
//             punch(dm, node, '冲床动-1');
//             break;
//         case '冲床动-2':
//             punch(dm, node, '冲床动-2');
//             break;
//         case '冲床动-3':
//             punch(dm, node, '冲床动-3');
//             break;
//         case '上料机-左右平移':
//             pusher(dm,node);
//             break;
//     }
// }
function conveyor(dm,item,completeCallback,bendMatterList){
    let node = dm.getDataByTag('输送带-上下动');
    let p3 = node.p3();
    let x = p3[0],y = p3[1],z = p3[2];
    item.setHost(node);
    node.setAnimation({
        go: {
            from: 0,
            to: 100,
            frames: 50,
            next: 'back',
            onUpdate: function (value) {
                if (value <= 100) {
                    y = y - 1;//上层
                }
                node.p3(x, y, z);
            },
            onComplete: () => {
                let p3 = item.p3();
                let x1 = p3[0],y1 = p3[1],z1 = p3[2];
                item.setHost(null);
                item.setAnimation({
                    ami: {
                        from: 0,
                        to: 200,
                        frames: 110,
                        onUpdate: function (value) {
                            x1++;
                            item.p3(x1, y1, z1);
                        },
                        onComplete: () => {
                            if (completeCallback) {
                                setTimeout(function () {
                                    completeCallback(item);
                                },10);
                            }
                            // item = null;
                            bendMatterList.shift();
                        }
                    },
                    start:['ami']
                });
            }
        },
        back: {
            from: 0,
            to: 100,
            frames: 50,
            delay:150,
            onUpdate: function (value) {
                if (value <= 100) {
                    y = y + 1;//上层
                }
                node.p3(x, y, p3[2]);
            },
            next: 'go',
            onComplete: function () {
                node.setAnimation(null);
            },
        },
        start: ['go']
    });
}
function carBack(dm){
    let transport = dm.getDataByTag('小车');
    let p3 = transport.p3();
    let x = p3[0];
    let y = p3[1];
    transport.setAnimation({
        back:{
            from: 0,
            to: 255,
            frames: 111,
            // frames: 120,
            // delay:150,
            onUpdate: function (value) {
                x--;
                transport.p3(x, y, p3[2]);
            },
            onComplete: () => {
                transport.setAnimation(null);
            }
        },
        start: ['back']
    })
}
