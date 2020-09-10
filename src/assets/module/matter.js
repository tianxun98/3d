
export function createMatter(dm, tagName) {
    let node = new ht.Node();
    ht.Default.loadObj("assets/objs/project/物料未折弯.obj", "assets/objs/project/物料未折弯.mtl", {
        cube: true,
        center: true,
        shape3d: tagName,//string
        finishFunc: (modelMap, array, rawS3) => {
            if (modelMap) {
                node.s({
                    'shape3d': tagName,
                    'label': '',
                    "shape3d.transparent": false,
                    "shape3d.opacity": 1,
                });
                node.setName(tagName);
                node.s3(rawS3[0] / 20, rawS3[1] / 20, rawS3[2] / 20);
                node.p3([-1222, 30, -20]);
                node.setAnchorElevation(0);
                node.setTag(tagName);
                // pusher(dm,dm.getDataByTag('上料机-上下移动'));
                // dm.getDataByTag('上料机-上下移动').resumeAnimation();
                dm.add(node);
            }
        }
    });
    return node;
}

let current = 0;

//物料
export function createChangeMatter(name, dm) {
    let node = new ht.Node();
    ht.Default.loadObj("assets/objs/project/洗衣机物料-折弯.obj", "assets/objs/project/洗衣机物料-折弯.mtl", {
        cube: true,
        center: true,
        shape3d: name,//string
        finishFunc: (modelMap, array, rawS3) => {
            if (modelMap) {
                node.s({
                    'shape3d': name,
                    'label': '',
                    "shape3d.transparent": false,
                    "shape3d.opacity": 1,
                });
                node.setName(name);
                node.s3(rawS3[0] / 20, rawS3[1] / 20, rawS3[2] / 20);
                node.p3([14, 75, -33]);
                node.setAnchorElevation(0);
                node.setTag(name);
                let transport = dm.getDataByTag('小车');
                let tag = dm.getDataByTag('tag');
                let p3 = transport.p3();
                let x = p3[0];
                let y = p3[1];
                node.setHost(transport);
                transport.setAnimation({
                    go: {
                        from: 0,
                        to: 255,
                        // frames: 120,
                        frames: 90,
                        onUpdate: function (value) {
                            x++;
                            transport.p3(x, y, p3[2]);
                        },
                        onComplete: () => {
                            node.setHost(null);
                            transport.setAnimation(null);
                            tag.resumeAnimation();
                        }
                    },
                    start: ['go']
                });
                dm.add(node);
            }
        }
    });
    return node;
}
