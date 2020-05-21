<template>
    <div class="home">
        <header-menu ref="menu" @createTabView="createTabView"></header-menu>
        <main-palette ref="palette"></main-palette>
    </div>
</template>

<script>
    // import {createItems} from "./menu"
    // import {initPalette} from './main-palette'
    import headerMenu from "./header-menu"
    import mainPalette from "./palette"
    let palette, tabView, borderPane;
    export default {
        name: "home",
        components:{
            headerMenu,
            mainPalette
        },
        data() {
            return {}
        },
        methods: {
            init() {
                palette = new ht.widget.Palette();
                this.$refs.palette.initPalette(palette);

                tabView = new ht.widget.TabView();
                borderPane = new ht.widget.BorderPane();
                toolbar = new ht.widget.Toolbar([]);

                borderPane.setTopView(toolbar);
                borderPane.setLeftView(palette, 300);
                borderPane.setCenterView(tabView);
                borderPane.addToDOM();

                this.createTabView('默认图纸', 'scenes/机房3.json');
            },

            dragAndDrop(g3d) {// 拖拽功能
                if (ht.Default.isTouchable) {// 判断是否为触屏可Touch方式交互
                    palette.handleDragAndDrop = function (e, state) {
                        if (ht.Default.containedInView(e, g3d)) {// 判断交互事件所处位置是否在View组件之上
                            if (state === 'between') {
                                this.handleOver(e);
                            }
                            else if (state === 'end') {
                                this.handleDrop(e, g3d);
                            }
                        }
                    }
                }
                else {
                    g3d.getView().addEventListener("dragover", (e)=> {
                        e.dataTransfer.dropEffect = "copy";
                        this.handleOver(e);
                    });
                    g3d.getView().addEventListener("drop", (e)=> {
                        this.handleDrop(e, g3d);
                    });
                }
            },

            handleOver(e) {
                e.preventDefault();
            },

            handleDrop(e, g3d) {// 鼠标放开时
                e.preventDefault();

                var paletteNode = palette.dm().sm().ld();
                if (paletteNode) {
                    if (paletteNode.getName() === '墙面') {
                        this.createBasicModel(g3d, e, paletteNode.getName(), [{"x": -700, "y": -700}, {
                            "x": 400,
                            "y": -700
                        }]);
                    }
                    else if (paletteNode.getName() === '折角墙面') {
                        this.createBasicModel(g3d, e, paletteNode.getName(), [{"x": -700, "y": -300}, {
                            "x": 400,
                            "y": -300
                        }, {
                            "x": 400,
                            "y": 700
                        }]);
                    }
                    else {
                        this.loadObjFunc('assets/objs/' + paletteNode.a('urlName') + '.obj', 'assets/objs/' + paletteNode.a('urlName') + '.mtl', paletteNode.a('jsonUrl'), g3d, g3d.getHitPosition(e), paletteNode.getImage());// 设置图片名称与obj名称有路径相关性代码会比较少
                    }
                    g3d.setFocus();// 将焦点设置在键盘事件上
                }
            },

            createBasicModel(g3d, e, name, points) {// 创建palette面板“其他”中的“墙面”
                var node = new ht.Shape();
                node.setPoints(points);
                node.s({
                    "all.color": "rgba(186,224,255,0.4)",
                    "shape.background": null,
                    "shape.border.width": 14,
                    "shape.border.color": "#DDDDDD",
                    "all.transparent": true,
                    "all.reverse.flip": true,
                    'label': ''
                });
                node.setName(name);
                node.setThickness(8);
                node.setTall(120);
                node.setAnchorElevation(0);
                g3d.dm().add(node);
                g3d.sm().ss(node);//ss = setSelection
                node.p3(g3d.getHitPosition(e));
                return node;
            },

            loadObjFunc(objUrl, mtlUrl, jsonUrl, g3d, p3, image) {// 加载 obj 文件 模型
                let node = new ht.Node();
                node.setImage(image);
                let shape3d = jsonUrl.slice(jsonUrl.lastIndexOf('/') + 1, jsonUrl.lastIndexOf('.'));
                ht.Default.loadObj(objUrl, mtlUrl, {
                    cube: true,
                    center: true,
                    shape3d: shape3d,//string
                    finishFunc: (modelMap, array, rawS3) => {
                        //rawS3包含所有模型的原始尺寸
                        if (modelMap) {
                            node.s({
                                'shape3d': jsonUrl,
                                'label': ''
                            });
                            g3d.dm().add(node);
                            if (shape3d === '空调外机立式') node.s3(rawS3[0] / 10, rawS3[1] / 10, rawS3[2] / 10);
                            else if (shape3d === '台式电脑') node.s3(rawS3[0] / 4, rawS3[1] / 4, rawS3[2] / 4);
                            else node.s3(rawS3); //s3 = setSize3d | getSize3d

                            node.p3(p3);//p3 = setPosition3d | getPosition3d;
                            node.setName(shape3d);
                            node.setElevation(node.s3()[1] / 2);// 属性栏中需要获取节点的坐标 若设置 setAnchorElevation 则 y 轴坐标永远为 0
                            // node.setAnchorElevation(0);
                            g3d.sm().ss(node);
                            this.formValue(g3d, g3d.form);
                            g3d.form.getView().style.display = 'block';
                            g3d.json = g3d.dm().serialize();// 相当于初始化 json
                            return node;
                        }
                    }
                });
            },

            setCenter(g3d, center, finish) {
                if (!center) return;

                var c = g3d.getCenter().slice(0),
                    dx = center[0] - c[0],
                    dy = center[1] - c[1],
                    dz = center[2] - c[2];

                ht.Default.startAnim({
                    duration: 500,
                    finishFunc: finish || function () {
                    },
                    action: function (v, t) {
                        g3d.setCenter([
                            c[0] + dx * v,
                            c[1] + dy * v,
                            c[2] + dz * v
                        ]);
                    }
                });
            },

            setEye(g3d, eye, finish) {
                if (!eye) return;

                var e = g3d.getEye().slice(0),//获取当前camera位置
                    dx = eye[0] - e[0],//目标camera位置-当前camera位置 之间的距离
                    dy = eye[1] - e[1],
                    dz = eye[2] - e[2];

                ht.Default.startAnim({
                    duration: 500,
                    finishFunc: finish || function () {
                    },
                    action: function (v, t) {
                        g3d.setEye([
                            e[0] + dx * v,//从当前camera位置根据v的速度移动到目标camera位置 e[0] + dx = eye[0]
                            e[1] + dy * v,
                            e[2] + dz * v
                        ]);
                    }
                });
            },

            createTabView(name, sceneJson) {// 创建页签组件
                var g3d = this.create3DView();
                this.dragAndDrop(g3d);//拖拽页签

                g3d.getView().style.borderTop = '1px solid rgb(235, 235, 235)';

                if (name && name !== '') this.createTab(name, g3d);
                else this.createTab('新建图纸', g3d);

                tabView.onTabChanged = (oldTab, newTab)=> {
                    toolbar.setItems([]);
                    toolbar.setItems(this.$refs.menu.createItems(g3d, newTab));

                    if (oldTab) oldTab.getView().form.getView().style.display = 'none';
                    if (newTab.getView().sm().ld()) newTab.getView().form.getView().style.display = 'block';
                };
                if (sceneJson) {
                    g3d.setEye(-3, 536, 1405);
                    ht.Default.xhrLoad(sceneJson, function (text) {
                        let json = ht.Default.parse(text);
                        g3d.dm().deserialize(json);
                    });
                }
            },

            createTab(name, g3d) {// 创建tab页签
                var tab = new ht.Tab();
                tab.setName(name);
                tab.setView(g3d);

                tabView.getTabModel().add(tab);
                tabView.getTabModel().sm().ss(tab);
                tabView.iv();

                if (tab.getName() !== '默认图纸') tab.setClosable(true);
            },

            create3DView() {// 创建 3d 场景 场景上有“JSON”按钮
                var g3d = new ht.graph3d.Graph3dView();
                g3d.form = this.createForm(g3d);
                g3d.setGridVisible(true);
                g3d.setOriginAxisVisible(true);
                g3d.setFar(60000);
                g3d.setEditable(true);
                g3d.json = '';

                g3d.dm().md(function (e) {// 属性变化时改变 json 内容
                    g3d.json = g3d.dm().serialize();
                });

                g3d.mi( (e)=> {// 鼠标事件处理
                    if (e.kind === 'doubleClickData') {// 双击视线缓缓移向图元
                        var p3 = e.data.p3();
                        var r3 = e.data.r3();

                        if (g3d.flyTo) g3d.flyTo(e.data, true);// 6.2.2 版本以上才有此方法
                        else {
                            this.setEye(g3d, [p3[0] * (Math.PI / 2 - Math.abs(r3[1])), 2.3 * p3[1], 0.3 * p3[2]]);
                            this.setCenter(g3d, p3);
                        }
                    }
                    else if (e.kind === 'beginMove' || e.kind === 'betweenMove' ||
                        e.kind === 'endMove' || e.kind === 'beginEditRotation' ||
                        e.kind === 'betweenEditRotation' || e.kind === 'endEditRotation' ||
                        e.kind === 'beginEditSize' || e.kind === 'betweenEditSize' || e.kind === 'endEditSize') {
                        this.formValue(g3d, g3d.form);// 节点改变大小/旋转/移动的时候不断地刷新 form 表单
                    }
                });

                g3d.sm().ms( (e)=> {//选择模型变化时才触发的操作
                    if (e.kind === 'set') {//代表此事件由setSelection(datas)引发
                        this.formValue(g3d, g3d.form);
                        g3d.form.getView().style.display = 'block';
                    }
                    else {
                        g3d.form.getView().style.display = 'none';
                    }

                    g3d.json = g3d.dm().serialize();
                });
                return g3d;
            },

            createForm(g3d) { //创建属性面板
                var form = new ht.widget.FormPane();
                form.getView().style.top = '53px';
                form.getView().style.right = '5px';
                form.getView().style.background = 'rgba(255, 255, 255, 0.5)';
                form.getView().style.display = 'none';
                form.getView().style.borderRadius = '5px';
                form.setLabelColor('rgb(138, 138, 138)');
                form.setWidth(220);
                form.setHeight(270);
                document.body.appendChild(form.getView());

                form.addRow([{element: '属性:', font: 'bold 12px arial, sans-serif'}], [0.1]);
                form.addRow([
                    'Id:',
                    {
                        id: 'Id',
                    }
                ], [0.1, 0.1]);
                form.addRow([
                    '名称',
                    {
                        id: 'Name',
                        textField: {}
                    }
                ], [0.1, 0.22]);

                var array = [
                    {property1: 'visible', value1: '可见', property2: 'editable', value2: '可编辑'},
                    {property1: 'movable', value1: '可移动', property2: 'selectable', value2: '可选中'}
                ];
                //添加是否可编辑。是否可移动，是否可见
                array.forEach(function (d) {
                    form.addRow([
                        d.value1,
                        {
                            id: d.property1,
                            checkBox: {
                                selected: true,
                                onValueChanged: function () {
                                    if (g3d.sm().ld()) g3d.sm().ld().s('3d.' + d.property1, this.getValue());
                                }
                            }
                        },
                        d.value2,
                        {
                            id: d.property2,
                            checkBox: {
                                selected: true,
                                onValueChanged: function () {
                                    if (g3d.sm().ld()) g3d.sm().ld().s('3d.' + d.property2, this.getValue());
                                }
                            }
                        }
                    ], [0.2, 0.1, 0.2, 0.1]);
                });

                form.addRow('', [0.1]);

                array = [
                    {property: 'Size', value: '大小'},
                    {property: 'Position3d', value: '坐标'},
                    {property: 'Rotation3d', value: '旋转'}
                ];
                array.forEach(function (p, index) {
                    form.addRow([
                        p.value,
                        'X:',
                        {
                            id: p.property + '.x',
                            textField: {}
                        },
                        'Y:',
                        {
                            id: p.property + '.y',
                            textField: {}
                        },
                        'Z:',
                        {
                            id: p.property + '.z',
                            textField: {}
                        },
                    ], [0.2, 0.1, 0.2, 0.1, 0.2, 0.1, 0.2]);
                });

                form.getView().addEventListener('keyup', function (e) {
                    if (e.keyCode === 9) {
                        var node = g3d.sm().ld();
                        if (!node) return;

                        node.setName(form.v('Name'));
                        node.s3([parseInt(form.v('Size.x')), parseInt(form.v('Size.y')), parseInt(form.v('Size.z'))]);
                        node.p3([parseInt(form.v('Position3d.x')), parseInt(form.v('Position3d.y')), parseInt(form.v('Position3d.z'))]);
                        node.r3([parseFloat(form.v('Rotation3d.x')), parseFloat(form.v('Rotation3d.y')), parseFloat(form.v('Rotation3d.z'))]);
                    }
                });
                document.body.addEventListener('mousedown', function (e) {
                    var node = g3d.sm().ld();
                    if (!node) return;

                    node.setName(form.v('Name'));
                    node.s3([parseInt(form.v('Size.x')), parseInt(form.v('Size.y')), parseInt(form.v('Size.z'))]);
                    node.p3([parseInt(form.v('Position3d.x')), parseInt(form.v('Position3d.y')), parseInt(form.v('Position3d.z'))]);
                    node.r3([parseFloat(form.v('Rotation3d.x')), parseFloat(form.v('Rotation3d.y')), parseFloat(form.v('Rotation3d.z'))]);
                });
                return form;
            },

            formValue(g3d, form) {
                var node = g3d.sm().ld();
                if (!node) return;
                form.v('Id', node.getId() + '');
                form.v('Name', node.getName());

                form.v('Size.x', (node.s3()[0].toFixed(0)));
                form.v('Size.y', (node.s3()[1].toFixed(0)));
                form.v('Size.z', (node.s3()[2].toFixed(0)));

                form.v('Position3d.x', (node.p3()[0].toFixed(0)));
                form.v('Position3d.y', (node.p3()[1].toFixed(0)));
                form.v('Position3d.z', (node.p3()[2].toFixed(0)));

                form.v('Rotation3d.x', (node.r3()[0].toFixed(2)));
                form.v('Rotation3d.y', (node.r3()[1].toFixed(2)));
                form.v('Rotation3d.z', (node.r3()[2].toFixed(2)));

                form.v('editable', node.s('3d.editable'));
                form.v('movable', node.s('3d.movable'));
                form.v('visible', node.s('3d.visible'));
                form.v('selectable', node.s('3d.selectable'));
            }

        },
        mounted(){
            this.init()
        }
    }
</script>

<style scoped>

</style>
