let palette,tabView,borderPane;
export function init(){
    palette = new ht.widget.Palette();
    initPalette();
    tabView = new ht.widget.TabView();

    borderPane = new ht.widget.BorderPane();
    toolbar = new ht.widget.Toolbar([]);

    borderPane.setTopView(toolbar);
    borderPane.setLeftView(palette, 300);
    borderPane.setCenterView(tabView);
    borderPane.addToDOM();

    createTabView('默认图纸', 'scenes/机房3.json');
}

function initPalette() {// 加载palette面板组件中的图元
    var arrNode = ['basic', 'displayDevice', 'cabinetRelative', 'deskChair', 'temperature', 'indoors', 'monitor','others'];
    var nameArr = ['基础图元', '展示设施', '机柜相关', '桌椅储物', '温度控制', '室内', '视频监控', '其他'];// arrNode中的index与nameArr中的一一对应
    let maps = new Map([
        [0,['models/basic/墙面.png', 'models/basic/折角墙面.png']],
        [1,['models/机房/展示设施/台式电脑.png', 'models/机房/展示设施/大屏.png']],
        [2,['models/机房/机柜相关/配电箱.png', 'models/机房/机柜相关/室外天线.png', 'models/机房/机柜相关/机柜1.png', 'models/机房/机柜相关/机柜2.png', 'models/机房/机柜相关/机柜3.png', 'models/机房/机柜相关/机柜4.png', 'models/机房/机柜相关/电池柜.png']],
        [3,['models/机房/桌椅储物/储物柜.png', 'models/机房/桌椅储物/桌子.png', 'models/机房/桌椅储物/椅子.png']],
        [4,['models/机房/温度控制/空调精简.png', 'models/机房/消防设施/消防设备.png', 'models/机械/空调外机立式.png']],
        [5,['models/室内/办公桌简易.png', 'models/室内/书.png', 'models/室内/办公桌镜像.png', 'models/室内/办公椅.png']],
        [6,['models/机房/视频监控/摄像头方.png', 'models/机房/视频监控/对讲维护摄像头.png', 'models/机房/视频监控/微型摄像头.png']],
        [7,['models/其他/信号塔.png']],
    ]);
    for (var i = 0; i < arrNode.length; i++) {
        var name = nameArr[i];
        var vName = arrNode[i];

        arrNode[i] = new ht.Group();// palette面板是将图元都分在“组”里面，然后向“组”中添加图元即可
        palette.dm().add(arrNode[i]);// 向palette面板组件中添加group图元
        arrNode[i].setExpanded(true);// 设置分组为打开的状态
        arrNode[i].setName(name);// 设置组的名字

        // var imageArr = [];
        // switch(i){
        //     case 0:
        //         imageArr = ['models/basic/墙面.png', 'models/basic/折角墙面.png'];
        //         break;
        //     case 1:
        //         imageArr = ['models/机房/展示设施/台式电脑.png', 'models/机房/展示设施/大屏.png'];
        //         break;
        //     case 2:
        //         imageArr = ['models/机房/机柜相关/配电箱.png', 'models/机房/机柜相关/室外天线.png', 'models/机房/机柜相关/机柜1.png', 'models/机房/机柜相关/机柜2.png', 'models/机房/机柜相关/机柜3.png', 'models/机房/机柜相关/机柜4.png', 'models/机房/机柜相关/电池柜.png'];
        //         break;
        //     case 3:
        //         imageArr = ['models/机房/桌椅储物/储物柜.png', 'models/机房/桌椅储物/桌子.png', 'models/机房/桌椅储物/椅子.png'];
        //         break;
        //     case 4:
        //         imageArr = ['models/机房/温度控制/空调精简.png', 'models/机房/消防设施/消防设备.png', 'models/机械/空调外机立式.png'];
        //         break;
        //     case 5:
        //         imageArr = ['models/室内/办公桌简易.png', 'models/室内/书.png', 'models/室内/办公桌镜像.png', 'models/室内/办公椅.png'];
        //         break;
        //     case 6:
        //         imageArr = ['models/机房/视频监控/摄像头方.png', 'models/机房/视频监控/对讲维护摄像头.png', 'models/机房/视频监控/微型摄像头.png'];
        //         break;
        //     default:
        //         imageArr = ['models/其他/信号塔.png'];
        //         break;
        // }
        setPalNode(maps.get(i), arrNode[i]);
    }
}

function setPalNode(imageArr, arr) {// 创建palette上节点及设置名称、显示图片、父子关系
    for (var j = 0; j < imageArr.length; j++) {
        var imageName = imageArr[j];
        var jsonUrl = imageName.slice(0, imageName.lastIndexOf('.')) + '.json';// shape3d中的 json 路径
        var name = imageName.slice(imageName.lastIndexOf('/')+1, imageName.lastIndexOf('.')); // 取最后一个/和.之间的字符串用来设置节点名称
        var url = imageName.slice(imageName.indexOf('/')+1, imageName.lastIndexOf('.'));// 取第一个/和最后一个.之间的字符串用来设置拖拽生成模型obj文件的路径

        createNode(name, imageName, arr, url, jsonUrl);// 创建节点，这个节点是显示在palette面板上
    }
}

function dragAndDrop(g3d) {// 拖拽功能
    if (ht.Default.isTouchable) {// 判断是否为触屏可Touch方式交互
        palette.handleDragAndDrop = function(e, state) {
            if (ht.Default.containedInView(e, g3d)) {// 判断交互事件所处位置是否在View组件之上
                if (state === 'between') {
                    handleOver(e);
                }
                else if (state === 'end') {
                    handleDrop(e, g3d);
                }
            }
        }
    }
    else {
        g3d.getView().addEventListener("dragover", function(e) {
            e.dataTransfer.dropEffect = "copy";
            handleOver(e);
        });
        g3d.getView().addEventListener("drop", function(e) {
            handleDrop(e, g3d);
        });
    }
}

function handleOver(e) {
    e.preventDefault();
}

function handleDrop(e, g3d) {// 鼠标放开时
    e.preventDefault();

    var paletteNode = palette.dm().sm().ld();
    if (paletteNode) {
        if (paletteNode.getName() === '墙面') {
            createBasicModel(g3d, e, paletteNode.getName(), [{"x": -700,"y": -700},{"x": 400,"y": -700}]);
        }
        else if (paletteNode.getName() === '折角墙面') {
            createBasicModel(g3d, e, paletteNode.getName(), [ {"x": -700,"y": -300},{"x": 400,"y": -300},{"x": 400,"y": 700}]);
        }
        else {
            loadObjFunc('../../public/assets/objs/' + paletteNode.a('urlName') + '.obj', '../../public/assets/objs/' + paletteNode.a('urlName') + '.mtl', paletteNode.a('jsonUrl'), g3d, g3d.getHitPosition(e), paletteNode.getImage());// 设置图片名称与obj名称有路径相关性代码会比较少
        }
        g3d.setFocus();// 将焦点设置在键盘事件上
    }
}

function createBasicModel(g3d, e, name, points) {// 创建palette面板“其他”中的“墙面”
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
    g3d.sm().ss(node);
    node.p3(g3d.getHitPosition(e));
    return node;
}

function createNode(name, image, parent, urlName, jsonUrl) {// 创建palette面板组件上的节点
    var node = new ht.Node();
    palette.dm().add(node);
    node.setName(name);
    node.setImage(image);
    node.setParent(parent);
    node.s({
        'draggable': true,
        'image.stretch': 'centerUniform',
        'label': ''
    });
    node.a('urlName', urlName);
    node.a('jsonUrl', jsonUrl);
    return node;
}

function loadObjFunc(objUrl, mtlUrl, jsonUrl, g3d, p3, image) {// 加载 obj 文件 模型
    var node = new ht.Node();
    node.setImage(image);
    var shape3d = jsonUrl.slice(jsonUrl.lastIndexOf('/')+1, jsonUrl.lastIndexOf('.'));

    ht.Default.loadObj(objUrl, mtlUrl, {
        cube: true,
        center: true,
        shape3d: shape3d,
        finishFunc: function(modelMap, array, rawS3) {
            if (modelMap) {
                node.s({
                    'shape3d': jsonUrl,
                    'label': ''
                });
                g3d.dm().add(node);

                if (shape3d === '空调外机立式') node.s3(rawS3[0]/10, rawS3[1]/10, rawS3[2]/10);
                else if (shape3d === '台式电脑') node.s3(rawS3[0]/4, rawS3[1]/4, rawS3[2]/4);
                else node.s3(rawS3);

                node.p3(p3);
                node.setName(shape3d);
                node.setElevation(node.s3()[1]/2);// 属性栏中需要获取节点的坐标 若设置 setAnchorElevation 则 y 轴坐标永远为 0
                // node.setAnchorElevation(0);
                g3d.sm().ss(node);
                formValue(g3d, g3d.form);
                g3d.form.getView().style.display = 'block';
                g3d.json = g3d.dm().serialize();// 相当于初始化 json
                return node;
            }
        }
    });
}

function createItems(g3d, newTab) {
    var menu = new ht.widget.Menu();// 创建菜单组件
    var json = [
        {
            label: '新建',
            items: [
                {
                    label: '新建图纸',
                    action: function() {
                        createTabView();// 新建页签
                    }
                }
            ]
        }
    ];
    menu.setItems(json); // 设置菜单组件内容
    menu.enableGlobalKey();

    var items = [
        {
            element: menu
        },
        "separator",
        {
            label: '场景 JSON',
            action: function() {
                if (dialog) return;

                var dialog = createDialog('场景 JSON');
                var content = dialog.getConfig().content;
                content.innerHTML = newTab.getView().dm().serialize();
                content.disabled = true;
                var btns = dialog.getConfig().buttons;
                btns.push({
                    label: '编辑',
                    action: function() {
                        content.disabled = false;

                        btns[1].disabled = false;
                        btns[0].label = '取消';
                        btns[0].action = function() {
                            dialog.hide();
                        }
                        dialog.setConfig(dialog.getConfig());
                    }
                });
                btns.push({
                    label: '提交',
                    disabled: true,
                    action: function() {
                        var str = dialog.getConfig().content.value;
                        if (typeof str === 'string') {
                            try {
                                if (g3d.sm().ld()) var node = g3d.sm().ld();

                                g3d.dm().clear();
                                g3d.dm().deserialize(dialog.getConfig().content.value, '', true);// 反序列化数据容器
                                g3d.json = g3d.dm().serialize();// 将这个导入的数据容器序列化 重置json内容

                                if (node) g3d.sm().ss(g3d.dm().getDataById(node.getId()));

                                dialog.hide();
                            }catch(e) {
                                console.log(e);
                                return;
                            }
                        }
                    }
                });
                dialog.setConfig(dialog.getConfig());
            }
        },
        {
            label: '清空场景',
            action: function() {
                g3d.dm().clear();
            }
        },
        {
            label: '导入 JSON',
            action: function() {
                if (dialog) return;

                var dialog = createDialog('导入 JSON');
                var btns = dialog.getConfig().buttons;
                btns.push({
                    label: '保存',
                    action: function(btn, event) {
                        var str = dialog.getConfig().content.value;
                        if (typeof str === 'string') {
                            try {
                                g3d.dm().deserialize(dialog.getConfig().content.value);//反序列化数据容器
                                g3d.json = g3d.dm().serialize();//将这个导入的数据容器序列化 重置json内容
                                dialog.hide();
                            }catch(e) {
                                console.log(e);
                                dialog.hide();
                                return;
                            }
                        }
                    }
                });
                dialog.setConfig(dialog.getConfig());
            }
        }
    ];
    return items;
}

function setCenter(g3d, center, finish) {
    if (!center) return;

    var c = g3d.getCenter().slice(0),
        dx = center[0] - c[0],
        dy = center[1] - c[1],
        dz = center[2] - c[2];

    ht.Default.startAnim({
        duration: 500,
        finishFunc: finish||function(){},
        action: function(v, t) {
            g3d.setCenter([
                c[0] + dx * v,
                c[1] + dy * v,
                c[2] + dz * v
            ]);
        }
    });
}

function setEye(g3d, eye, finish) {
    if (!eye) return;

    var e = g3d.getEye().slice(0),//获取当前camera位置
        dx = eye[0] - e[0],//目标camera位置-当前camera位置 之间的距离
        dy = eye[1] - e[1],
        dz = eye[2] - e[2];

    ht.Default.startAnim({
        duration: 500,
        finishFunc: finish||function(){},
        action: function(v, t) {
            g3d.setEye([
                e[0] + dx * v,//从当前camera位置根据v的速度移动到目标camera位置 e[0] + dx = eye[0]
                e[1] + dy * v,
                e[2] + dz * v
            ]);
        }
    });
}

function createTabView(name, sceneJson) {// 创建页签组件
    var g3d = create3DView();
    dragAndDrop(g3d);//拖拽页签

    g3d.getView().style.borderTop = '1px solid rgb(235, 235, 235)';

    if (name && name !== '') createTab(name, g3d);
    else createTab('新建图纸', g3d);

    tabView.onTabChanged = function(oldTab, newTab) {
        toolbar.setItems([]);
        toolbar.setItems(createItems(g3d, newTab));

        if (oldTab) oldTab.getView().form.getView().style.display = 'none';
        if (newTab.getView().sm().ld()) newTab.getView().form.getView().style.display = 'block';
    };

    if (sceneJson) {
        g3d.setEye(-3, 536, 1405);
        ht.Default.xhrLoad(sceneJson, function(text) {
            let json = ht.Default.parse(text);
            g3d.dm().deserialize(json);
        });
    }
}

function createTab(name, g3d) {// 创建tab页签
    var tab = new ht.Tab();
    tab.setName(name);
    tab.setView(g3d);

    tabView.getTabModel().add(tab);
    tabView.getTabModel().sm().ss(tab);
    tabView.iv();

    if (tab.getName() !== '默认图纸') tab.setClosable(true);
}

function create3DView() {// 创建 3d 场景 场景上有“JSON”按钮
    var g3d = new ht.graph3d.Graph3dView();
    g3d.form = createForm(g3d);
    g3d.setGridVisible(true);
    g3d.setOriginAxisVisible(true);
    g3d.setFar(60000);
    g3d.setEditable(true);
    g3d.json = '';

    g3d.dm().md(function(e) {// 属性变化时改变 json 内容
        g3d.json = g3d.dm().serialize();
    });

    g3d.mi(function(e) {// 鼠标事件处理
        if (e.kind === 'doubleClickData') {// 双击视线缓缓移向图元
            var p3 = e.data.p3();
            var r3 = e.data.r3();

            if (g3d.flyTo) g3d.flyTo(e.data, true);// 6.2.2 版本以上才有此方法
            else {
                setEye(g3d, [p3[0]*(Math.PI/2 - Math.abs(r3[1])), 2.3*p3[1], 0.3*p3[2]]);
                setCenter(g3d, p3);
            }
        }
        else if (e.kind === 'beginMove' || e.kind === 'betweenMove' ||
            e.kind === 'endMove' || e.kind === 'beginEditRotation' ||
            e.kind === 'betweenEditRotation' || e.kind === 'endEditRotation' ||
            e.kind === 'beginEditSize' || e.kind === 'betweenEditSize' || e.kind === 'endEditSize') {
            formValue(g3d, g3d.form);// 节点改变大小/旋转/移动的时候不断地刷新 form 表单
        }
    });

    g3d.sm().ms(function(e) {//选择模型变化时才触发的操作
        if (e.kind === 'set') {//代表此事件由setSelection(datas)引发
            formValue(g3d, g3d.form);
            g3d.form.getView().style.display = 'block';
        }
        else {
            g3d.form.getView().style.display = 'none';
        }

        g3d.json = g3d.dm().serialize();
    });
    return g3d;
}

function createDialog(title) {
    var dialog = new ht.widget.Dialog();
    dialog.setConfig({
        title: title,
        content: document.createElement('textarea'),
        width: 360,
        height: 400,
        closable: true,
        buttons: []
    });
    dialog.show();
    return dialog;
}

function createForm(g3d) { //创建属性面板
    var form = new ht.widget.FormPane();
    form.getView().style.top = '53px';
    form.getView().style.right = '5px';
    form.getView().style.background = 'rgba(255, 255, 255, 0.3)';
    form.getView().style.display = 'none';
    form.getView().style.borderRadius = '5px';
    form.setLabelColor('rgb(138, 138, 138)');
    form.setWidth(220);
    form.setHeight(270);
    document.body.appendChild(form.getView());

    form.addRow([{ element: '属性:', font: 'bold 12px arial, sans-serif' }], [0.1]);
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
    array.forEach(function(d) {
        form.addRow([
            d.value1,
            {
                id: d.property1,
                checkBox: {
                    selected: true,
                    onValueChanged: function(){
                        if (g3d.sm().ld()) g3d.sm().ld().s('3d.'+d.property1, this.getValue());
                    }
                }
            },
            d.value2,
            {
                id: d.property2,
                checkBox: {
                    selected: true,
                    onValueChanged: function(){
                        if (g3d.sm().ld()) g3d.sm().ld().s('3d.'+d.property2, this.getValue());
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
    array.forEach(function(p, index) {
        form.addRow([
            p.value,
            'X:',
            {
                id: p.property+'.x',
                textField: {}
            },
            'Y:',
            {
                id: p.property+'.y',
                textField: {}
            },
            'Z:',
            {
                id: p.property+'.z',
                textField: {}
            },
        ], [0.2, 0.1, 0.2, 0.1, 0.2, 0.1, 0.2]);
    });

    form.getView().addEventListener('keyup', function(e) {
        if (e.keyCode === 9) {
            var node = g3d.sm().ld();
            if (!node) return;

            node.setName(form.v('Name'));
            node.s3([parseInt(form.v('Size.x')), parseInt(form.v('Size.y')), parseInt(form.v('Size.z'))]);
            node.p3([parseInt(form.v('Position3d.x')), parseInt(form.v('Position3d.y')), parseInt(form.v('Position3d.z'))]);
            node.r3([parseFloat(form.v('Rotation3d.x')), parseFloat(form.v('Rotation3d.y')), parseFloat(form.v('Rotation3d.z'))]);
        }
    });
    document.body.addEventListener('mousedown', function(e) {
        var node = g3d.sm().ld();
        if(!node) return;

        node.setName(form.v('Name'));
        node.s3([parseInt(form.v('Size.x')), parseInt(form.v('Size.y')), parseInt(form.v('Size.z'))]);
        node.p3([parseInt(form.v('Position3d.x')), parseInt(form.v('Position3d.y')), parseInt(form.v('Position3d.z'))]);
        node.r3([parseFloat(form.v('Rotation3d.x')), parseFloat(form.v('Rotation3d.y')), parseFloat(form.v('Rotation3d.z'))]);
    });
    return form;
}

function formValue(g3d, form) {
    var node = g3d.sm().ld();
    if (!node) return;

    form.v('Id', node.getId()+'');
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
