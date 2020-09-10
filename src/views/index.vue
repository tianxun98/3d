<template>
    <div class="home">
        <header-menu ref="menu" @createTabView="createTabView" @clearHistory="clearHistory"></header-menu>
        <main-palette ref="palette"></main-palette>
        <custom-pop :is-dialog="isDialog" :title="title" :modalData="selectTab" :type="type"
                    @close="close">
        </custom-pop>
        <bind-pop :is-dialog="isBind" :title="title" :modalData="selectTab" :type="type" :getId="getIds"
                  @close="close" :currentLd = "currentLd">
        </bind-pop>
        <ul class="history-layout" id="history">
            <el-autocomplete :hide-loading="true" class="searchClass"
                    v-model="inputValue" size="small" clearable
                    :fetch-suggestions="querySearchAsync"
                    placeholder="搜索图元"
            ></el-autocomplete>
            <li v-for="(item,index) in saveAttr" @click="chooseEvent(item,index)"
                :class="{active:currentIndex === index}" :key="index">
                {{item._name}}
            </li>
        </ul>
    </div>
</template>

<script>
    import headerMenu from "./header-menu"
    import mainPalette from "./palette"
    import customPop from "../component/custom-pop"
    import bindPop from "../component/bind-pop"
    import mixin from "../mixin/mixin"
    import formPanel from "../mixin/form-panel"

    let palette, tabView, borderPane;

    export default {
        name: "home",
        components: {
            headerMenu,
            mainPalette,
            customPop,
            bindPop
        },
        mixins: [mixin],
        data() {
            return {
                isDialog: false,
                title: '自定义',
                type: 'custom',
                isBind: false,
                saveAttr: [],//保存拉过去历史图元
                currentIndex: 0,//选择历史图元
                selectTab:{},//缓存tab标签里面的graph
                inputValue:'',
                getIds:0,
                currentLd:null //当前选中图元
            }
        },
        methods: {
            chooseEvent(item, index) {
                this.currentIndex = index;
                let g3d = this.selectTab;
                let ld = this.saveAttr[this.currentIndex];
                g3d.sm().ss(ld);
                this.formValue(g3d, g3d.form);
            },
            querySearchAsync(queryString, cb){
                let restaurants = this.selectTab.history;
                let results = queryString.trim() ? restaurants.filter(item=>{
                    return item._name.indexOf(queryString) === 0
                }) : restaurants;
                this.saveAttr = results;
            },
            init() {
                palette = new ht.widget.Palette();
                this.$refs.palette.initPalette(palette);
                tabView = new ht.widget.TabView();
                borderPane = new ht.widget.BorderPane();
                let topMenu = document.createElement('div');
                topMenu.style.position = 'relative';
                borderPane.setTopView(topMenu, 50);
                borderPane.setLeftView(palette, 260);
                borderPane.setCenterView(tabView);
                borderPane.addToDOM();
                // this.createTabView('新建工程', 'scenes/机房3.json');
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
                    g3d.getView().addEventListener("dragover", (e) => {
                        e.dataTransfer.dropEffect = "copy";
                        this.handleOver(e);
                    });
                    g3d.getView().addEventListener("drop", (e) => {
                        this.handleDrop(e, g3d);
                    });
                }
            },
            handleOver(e) {
                e.preventDefault();
            },

            handleDrop(e, g3d) {// 鼠标放开时
                e.preventDefault();

                let paletteNode = palette.dm().sm().ld();

                if (paletteNode) {
                    switch (paletteNode.getName()) {
                        case '公告板':
                            this.createNotice(g3d, e);
                            break;
                        case '圆柱':
                            this.createShape(g3d, e);
                            break;
                        default:
                            if (paletteNode.a('isOnline')) {
                                this.loadObjFunc(paletteNode.a('urlName') + '.obj', paletteNode.a('urlName') + '.mtl', paletteNode.a('jsonUrl'), g3d, g3d.getHitPosition(e), paletteNode.getImage());
                            } else {
                                this.loadObjFunc('assets/objs/' + paletteNode.a('urlName') + '.obj', 'assets/objs/' + paletteNode.a('urlName') + '.mtl', paletteNode.a('jsonUrl'), g3d, g3d.getHitPosition(e), paletteNode.getImage());// 设置图片名称与obj名称有路径相关性代码会比较少
                            }
                            break;
                    }
                    g3d.setFocus();// 将焦点设置在键盘事件上
                }
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
                                'label': '',
                                "shape3d.opacity": 1,
                                "shape3d.frames": 10,
                            });
                            g3d.dm().add(node);
                            if (shape3d === '注塑机' || shape3d === '注塑机_3000L' ){
                                node.s3(rawS3[0] / 10, rawS3[1] / 10, rawS3[2] / 10);
                                node.setRotation3d(300, 0, 0);
                            }
                            else if (shape3d === '台式电脑' || shape3d ==='空调外机立式') node.s3(rawS3[0] / 4, rawS3[1] / 4, rawS3[2] / 4);
                            else node.s3(rawS3);
                            node.p3(p3);
                            node.setName(shape3d);
                            node.setElevation(node.s3()[1] / 2);// 属性栏中需要获取节点的坐标 若设置 setAnchorElevation 则 y 轴坐标永远为 0
                            // node.setAnchorElevation(0);
                            g3d.sm().ss(node);
                            g3d.history.push(node);//添加进入历史图元
                            this.saveAttr = g3d.history;
                            this.currentIndex = this.saveAttr.length - 1;
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

            createTabView(name,sceneInfo,sceneJson) {// 创建页签组件
                let g3d = this.create3DView();
                g3d.sceneInfo = sceneInfo;
                g3d.history = [];
                this.dragAndDrop(g3d);//拖拽页签
                if (name && name !== '') this.createTab(name, g3d);
                else this.createTab('新建工程', g3d);

                tabView.onTabChanged = (oldTab, newTab) => {
                    if(!newTab){
                        this.$message.warning('当前已无工程了！');
                        return false
                    }
                    this.saveAttr = newTab.getView().history;
                    this.selectTab = newTab.getView();//设定当前tab下g3d
                    this.$refs.menu.createItems(g3d, newTab);
                    if (oldTab) {
                        this.inputValue = "";
                        oldTab.getView().form.getView().style.display = 'none';
                    }
                    if (newTab.getView().sm().ld()) {
                        newTab.getView().form.getView().style.display = 'block';
                    }
                };
                if (sceneJson) {
                    g3d.setEye(110, 300, 1405);
                    g3d.dm().deserialize(sceneJson);
                    // ht.Default.xhrLoad(sceneJson, function (text) {
                    //     let json = ht.Default.parse(text);
                    //     g3d.dm().deserialize(json);
                    // });
                }
            },

            createTab(name, g3d) {// 创建tab页签
                var tab = new ht.Tab();
                tab.setName(name);
                tab.setView(g3d);
                tabView.getTabModel().add(tab);
                tabView.getTabModel().sm().ss(tab);
                tabView.iv();
                if (tab.getName() !== '当前工程') tab.setClosable(true);
            },

            create3DView() {// 创建 3d 场景 场景上有“JSON”按钮
                let g3d = new ht.graph3d.Graph3dView();
                g3d.form = this.createForm(g3d);
                g3d.setGridVisible(true);
                // g3d.setOriginAxisVisible(true);//展示XYZ的东西
                g3d.setFar(60000);
                g3d.setEditable(true);
                g3d.json = '';

                g3d.dm().md(function (e) {// 属性变化时改变 json 内容
                    g3d.json = g3d.dm().serialize();
                });

                g3d.mi((e) => {// 鼠标事件处理
                    if (e.kind === 'clickData') {
                        this.currentLd = g3d.dm().sm().ld();
                    }
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

                g3d.sm().ms((e) => {//选择模型变化时才触发的操作
                    let history = document.getElementById('history');
                    if (e.kind === 'set') {//代表此事件由setSelection(datas)引发
                        this.formValue(g3d, g3d.form);
                        g3d.form.getView().style.display = 'block';
                        history.style.display = 'block';
                    }
                    else {
                        g3d.form.getView().style.display = 'none';
                        history.style.display = 'none';
                    }

                    g3d.json = g3d.dm().serialize();
                });
                return g3d;
            },
            createForm(g3d) { //创建属性面板
                let form = new ht.widget.FormPane();
                let formPane = new formPanel(g3d, form, this);//传入g3d，表单面板,是否弹框
                form.getView().style.top = '53px';
                form.getView().style.right = '5px';
                form.getView().style.background = 'rgba(255, 255, 255, 0.7)';
                form.getView().style.display = 'none';
                form.getView().style.borderRadius = '5px';
                form.setLabelColor('rgb(138, 138, 138)');
                form.setWidth(250);
                form.setHeight(300);
                document.body.appendChild(form.getView());
                // form.addRow([{element: '属性:', font: 'bold 12px arial, sans-serif'}], [0.1]);
                form.addRow([
                    'Id:',
                    {
                        id: 'Id',
                    }
                ], [0.1, 0.1]);
                formPane.addBtn('事件', 'jump');
                formPane.addBtn('', 'custom');
                formPane.addBtn('', 'init');
                form.addRow([
                    '名称',
                    {
                        id: 'Name',
                        textField: {}
                    }
                ], [0.1, 0.22]);
                formPane.addOpacity();//添加透明度
                form.addRow([
                    '闪烁',
                    {
                        id: 'sparkle',
                        checkBox: {
                            selected: false,
                            onValueChanged: function () {
                                let ld = g3d.sm().ld();
                                ld.s('3d.sparkle', this.getValue());
                            }
                        }
                    },
                    '频率',
                    {
                        id: 'frames',
                        textField: {}
                    }
                ], [0.2, 0.1, 0.1, 72]);
                formPane.addBtn('绑定', 'visible');
                formPane.addBtn('', 'position');
                formPane.addBtn('', 'ficker');
                formPane.addBtn('', 'text');
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

                // form.addRow('', [0.1]);

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
                        node.s('shape3d.frames',form.v('frames'));
                        node.s3([parseInt(form.v('Size.x')), parseInt(form.v('Size.y')), parseInt(form.v('Size.z'))]);
                        node.p3([parseInt(form.v('Position3d.x')), parseInt(form.v('Position3d.y')), parseInt(form.v('Position3d.z'))]);
                        node.r3([parseFloat(form.v('Rotation3d.x')), parseFloat(form.v('Rotation3d.y')), parseFloat(form.v('Rotation3d.z'))]);
                    }
                });
                document.body.addEventListener('mousedown', function (e) {
                    var node = g3d.sm().ld();
                    if (!node) return;
                    node.setName(form.v('Name'));
                    node.s('shape3d.frames',form.v('frames'));
                    node.s3([parseInt(form.v('Size.x')), parseInt(form.v('Size.y')), parseInt(form.v('Size.z'))]);
                    node.p3([parseInt(form.v('Position3d.x')), parseInt(form.v('Position3d.y')), parseInt(form.v('Position3d.z'))]);
                    node.r3([parseFloat(form.v('Rotation3d.x')), parseFloat(form.v('Rotation3d.y')), parseFloat(form.v('Rotation3d.z'))]);
                });
                return form;
            },

            formValue(g3d, form) {
                let node = g3d.sm().ld();
                if (!node) return;
                this.formToggle('注塑机','action',form,node);
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
                form.v('sparkle', node.s('3d.sparkle'));//是否闪烁
                form.v('frames',node.s('shape3d.frames'));
                form.v('opacity', node.s('shape3d.opacity') ? node.s('shape3d.opacity') : 0);//透明度设置
                form.v('editable', node.s('3d.editable'));
                form.v('movable', node.s('3d.movable'));
                form.v('visible', node.s('3d.visible'));
                form.v('selectable', node.s('3d.selectable'));
            },
            formToggle(isName,id,form,node){
                if(node.getName() === isName){
                    form.getItemById(id).element.getView().style.display = 'block';
                }else{
                    form.getItemById(id).element.getView().style.display = 'none';
                }
            },
            clearHistory(){
                this.selectTab.history = [];
                this.saveAttr = [];
            }
        },
        mounted() {
            this.init();
        }
    }
</script>

<style lang="less">

</style>
