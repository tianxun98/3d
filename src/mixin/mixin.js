export default {
    data(){
        return{

        }
    },
    methods:{
        createNotice(g3d,e){
            this.createNoticeJson();
            var node = new ht.Node();

            node.s({
                'id':Math.random().toFixed(3),
                'shape3d': 'billboard',
                'shape3d.image': '公告板.json',
                "shape3d.opacity": 1,
                "shape3d.transparent": true,
                'texture.cache': true,   // 是否缓存
                'autorotate': true,     // 始终面向相机
                'alwaysOnTop': false,   ////---- 是否需要一直在上方
                'vector.dynamic': false, // 是否动态改变贴图的大小以保证清晰
                'fixSizeOnScreen': -1,   // 无论缩放，保持 image / 矢量 原始大小，注意需要始终面向相机前提
            });

            // 数据绑定
            node.a('textHeader', '层(动态)');
            node.a('textContent', '测试');
            node.setName('公告版');

            node.setAnchorElevation(0);
            g3d.dm().add(node);
            g3d.sm().ss(node);//ss = setSelection
            node.p3(g3d.getHitPosition(e));
            g3d.history.push(node);//添加进入历史图元
            this.saveAttr = g3d.history;
            return node
        },
        createNoticeJson(){
            ht.Default.setImage('公告板.json', {
                "width": 106,
                "height": 118,

                "comps": [
                    {
                        "type": "shape",
                        "background": "rgb(255,255,255)",
                        "borderWidth": 1,
                        "borderColor": "rgb(89,87,87)",
                        "borderCap": "round",
                        "shadowColor": "#1ABC9C",
                        "displayName": "數據-詳細（小）",
                        "scaleX": -1.02,
                        "rotation": 3.14159,
                        "closePath": true,
                        "points": [
                            4.84948,
                            3.80991,
                            4.84948,
                            107.32382,
                            85.11837,
                            107.32382,
                            97.84933,
                            97.0893,
                            97.84933,
                            31.73809,
                            26.94682,
                            31.73809,
                            4.84948,
                            3.80991
                        ]
                    },
                    {
                        "type": "text",
                        "text": "这是一个标签",
                        "color": "rgb(79,79,79)",
                        "rect": [
                            10.53923,
                            5.24631,
                            87.31012,
                            25.532
                        ]
                    },
                    {
                        "type": "shape",
                        "borderWidth": 0.6,
                        "borderColor": "rgb(224,224,224)",
                        "borderJoin": "miter",
                        "shadowColor": "#1ABC9C",
                        "points": [
                            10.53923,
                            29.94962,
                            92.15958,
                            29.94962
                        ]
                    },
                    {
                        "type": "oval",
                        "borderWidth": 2,
                        "borderColor": "rgb(49,98,232)",
                        "shadowColor": "#1ABC9C",
                        "rect": [
                            12.77531,
                            39.80898,
                            25.35167,
                            25.35167
                        ]
                    },
                    {
                        "type": "shape",
                        "borderWidth": 2,
                        "borderColor": "rgb(49,98,232)",
                        "borderJoin": "miter",
                        "shadowColor": "#1ABC9C",
                        "points": [
                            18.31073,
                            55.01171,
                            23.44074,
                            58.61658,
                            32.59156,
                            46.83143
                        ]
                    },
                    {
                        "type": "text",
                        "text": {
                            "func": "attr@textHeader",
                            "value": "01层"
                        },
                        "color": "rgb(79,79,79)",
                        "rect": [
                            43.49891,
                            32.60238,
                            81.24022,
                            25.532
                        ]
                    },
                    {
                        "type": "text",
                        "text": {
                            "func": "attr@textContent",
                            "value": "商店入口"
                        },
                        "color": "rgb(79,79,79)",
                        "anchorX": 0,
                        "scaleX": 0.8,
                        "rect": [
                            45.04332,
                            50.5238,
                            81.24022,
                            25.532
                        ]
                    }
                ]
            });
        },
        createShape(g3d,e, p3 = [100, 0, 100], r3){
            let node = new ht.Node();
            node.setStyle('shape3d', 'cylinder');
            node.p3(p3);
            node.s3(65, 65, 65);
            if(r3){
                node.r3(r3);
            }
            node.s({
                'shape3d.opacity':1,
                "shape3d.frames": 10,
                'shape3d.side': 2,
                'shape3d.top.visible': false,
                'shape3d.bottom.visible': true
            });
            node.setName('圆柱');
            g3d.dm().add(node);
            g3d.history.push(node);//添加进入历史图元
            this.saveAttr = g3d.history;
            return node;
        },
        close(){
            this.isDialog = false;
            this.isBind = false;
        }
    }
}
