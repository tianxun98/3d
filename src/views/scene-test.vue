<template>
    <section class="layout-content">
        <div class="layout h-100">
            <div class="device">
                <p class="header-title">
                    <img src="../assets/image/device.png" class="set-ico"/>
                    设备信息
                </p>
                <section class="device-content">
                    <ul class="device-list">
                        <li v-for="(item,index) in deviceList" @click="deviceActive(item,index)"
                            :class="{active:index===deviceCurrent}" :key="item.deviceCode">
                            {{item.deviceName}}
                        </li>
                    </ul>
                </section>
            </div>
            <div class="tag">
                <p class="header-title">
                    <img src="../assets/image/tag.png" class="set-ico"/>
                    测点信息
                </p>
                <section class="device-content">
                    <ul class="tag-list">
                        <li v-for="(item,index) in tagList" :key="item.tagCode">
                            {{item.tagName}}  {{item.value}}
                        </li>
                    </ul>
                </section>
            </div>
        </div>
    </section>

</template>

<script>
    let tabView, borderPane;
    let maxValue = 100, minValue;
    let flowTask = {
        interval: 30,
        action: function (data) {
            if (data.getName() === '注塑机' ) {
                if (maxValue < 500) {
                    maxValue = maxValue + 1;
                    minValue = minValue + 1;
                } else if (minValue === 100) {
                    maxValue = minValue;
                } else {
                    minValue--;
                }
                data.p3(minValue, 150, 150);
            }
            // if (data.getName() === '红绿灯') {
            //     data.setRotation(data.getRotation() + Math.PI /10)
            // }
            // if (data.a('flow.enabled')) {
            //     let offset = data.s('edge.dash.offset') + data.a('flow.step') * data.a('flow.direction');
            //     data.s('edge.dash.offset', offset);
            // }
        }
    };
    export default {
        name: "scene",
        data() {
            return {
                dm: null,
                deviceCurrent:0,
                tagCurrent:0,
                deviceList:[],
                tagList:[],
                webSocket:null,
            }
        },
        methods: {
            deviceActive(item,index){
                this.deviceCurrent = index;
                if(this.webSocket){
                    if(this.webSocket.readyState !== 1){
                       this.initWebSocket();
                    }else{
                        this.webSocket.send(JSON.stringify({deviceId:item.id,lower:100,upper:500}));
                        this.webSocket.onmessage = (evt) => {
                            this.tagList = [JSON.parse(evt.data)];
                            maxValue = this.tagList[0].value;
                        };
                    }

                }else{
                    this.$message.warning('当前webSocket链家已断开，请稍等在重试！');
                }

            },
            initWebSocket(){
                this.webSocket = new WebSocket(`ws://10.17.162.100:21003/miot/websocket/device`);
                this.webSocket.onopen = (evt) => {
                    this.dm.addScheduleTask(flowTask);
                    // this.webSocket.send('aaa');
                };

                this.webSocket.onmessage = (evt) => {
                    this.deviceList = JSON.parse(evt.data);
                    if(this.deviceList.length > 0){
                        this.webSocket.send(JSON.stringify({deviceId:this.deviceList[0].id,lower:100,upper:500}));
                        this.webSocket.onmessage = (evt) => {
                            this.tagList = [JSON.parse(evt.data)];
                            maxValue = this.tagList[0].value;
                        };
                    }
                };

                this.webSocket.onclose = (evt) => {
                    this.dm.removeScheduleTask(flowTask);
                    this.$message.warning('当前webSocket链家已断开，请稍等在重试！');
                };
            },
            createTabView(name, sceneJson) {// 创建页签组件
                let g3d = this.create3DView();
                if (name && name !== '') this.createTab(name, g3d);
                else this.createTab('新建看板', g3d);
                g3d.setEye(-3, 1000, 2305);
                this.dm = g3d.dm();
                // let sky = new ht.Node();
                // sky.s({
                //     "top.image":"assets/image/bg.jpg",
                //     "bottom.image":"assets/image/bottom.png",
                //     "left.image":"assets/image/bg.jpg",
                //     "right.image":"assets/image/bg.jpg",
                //     "front.image":"assets/image/bg.jpg",
                //     "back.image":"assets/image/bg.jpg",
                //     "all.reverse.flip":true
                // });
                // g3d.setSkyBox(sky);
                this.loadObjFunc(`assets/objs/basic/注朔机A.obj`,`assets/objs/basic/注朔机A.mtl`,'注朔机A', g3d,[500,150,-200]);
                this.loadObjFunc(`assets/objs/basic/注塑机_3000L.obj`, `assets/objs/basic/注塑机_3000L.mtl`, '注塑机_3000L', g3d, [100, 150, 120]);
                this.loadObjFunc(`assets/objs/basic/注塑机.obj`, `assets/objs/basic/注塑机.mtl`, '注塑机', g3d, [0, 150, 0]);
                this.initToolTip(g3d);
            },
            createTab(name, g3d) {// 创建tab页签
                var tab = new ht.Tab();
                tab.setName(name);
                tab.setView(g3d);
                tabView.getTabModel().add(tab);
                tabView.getTabModel().sm().ss(tab);
                tabView.iv();
            },
            create3DView() {// 创建 3d 场景 场景上有“JSON”按钮
                let g3d = new ht.graph3d.Graph3dView();
                g3d.setGridVisible(true);
                g3d.setFar(30000);
                g3d.setEye([110, 500, 500]);
                g3d.json = '';
                g3d.dm().md(function (e) {// 属性变化时改变 json 内容
                    g3d.json = g3d.dm().serialize();
                });
                g3d.setMovableFunc((data) => { //禁止移动
                    return false
                });
                g3d.mi((e) => {
                    //点击跳转操作
                    if (e.kind === 'clickData') {
                        let ld = g3d.dm().sm().ld();
                        if (ld.s('jump')) {
                            const start = this.$router.resolve({name: '/run', query: {projectId: ld.s('jump')}});
                            window.open(start.href, '_blank');
                        }
                    }
                });
                return g3d;
            },
            init(name, sceneJson = {}) {
                let leftPane = document.createElement('div');
                leftPane.style.position = 'relative';
                borderPane = new ht.widget.BorderPane();
                tabView = new ht.widget.TabView();
                borderPane.setCenterView(tabView);
                borderPane.setLeftView(leftPane, 200);
                borderPane.addToDOM();
                this.createTabView(name, sceneJson);
            },
            initToolTip(g3d) {
                g3d.enableToolTip();
                g3d.getToolTip = function (e) {
                    var data = this.getDataAt(e);
                    if (data) {
                        return '<pre class="toolTip">' + JSON.stringify(data.getStyleMap(), function (key, value) {
                            if (value && value.length > 0 && typeof value[0] === 'number') {
                                var v = [];
                                for (var i = 0; i < value.length; i++) {
                                    v[i] = parseFloat(value[i].toFixed(2));
                                }
                                return '[' + v.join(',') + ']';
                            }
                            return value;
                        }, 4) + '</pre>';
                    }
                    return null;
                };
            },
            loadObjFunc(objUrl, mtlUrl, name, g3d, p3, image) {// 加载 obj 文件 模型
                let node = new ht.Node();
                node.setImage(image);
                ht.Default.loadObj(objUrl, mtlUrl, {
                    cube: true,
                    center: true,
                    shape3d: name,//string
                    finishFunc: (modelMap, array, rawS3) => {
                        //rawS3包含所有模型的原始尺寸
                        if (modelMap) {
                            node.s({
                                'shape3d': name,
                                'label': '',
                                "shape3d.opacity": 1,
                            });
                            g3d.dm().add(node);
                            if (name === '注塑机' || name === '注塑机_3000L'){
                                node.s3(rawS3[0] / 10, rawS3[1] / 10, rawS3[2] / 10);
                                node.setRotation3d(300, 0, 0);
                            } else{
                                node.s3(rawS3);
                            }
                            node.p3(p3);//p3 = setPosition3d | getPosition3d;

                            node.setName(name);
                            // node.setAnchorElevation(0);
                            g3d.sm().ss(node);
                            g3d.json = g3d.dm().serialize();// 相当于初始化 json
                            return node;
                        }
                    }
                });
            },
        },
        mounted() {
            this.init('');
            this.initWebSocket();
        }
    }
</script>

<style scoped lang="less">
    .layout-content{
        position: absolute;
        z-index: 999;
        width: 200px;
        left: 0;
        top: 0;
    }
    .layout {
        display: flex;
        height: 100%;
        width: 200px;
        flex-direction: column;
    }

    .header-title {
        font-size: 16px;
        padding: 1rem 0;
        margin: 0;
    }

    .device {
        background: #51596e;
        color: #fff;
        flex-basis: 300px;
        padding: 0 10px;
        .device-content{
            height: 250px;
            overflow-y: auto;
            .device-list li{
                padding:5px;
                cursor: pointer;
            }
            li.active{
                background: #37383d;
            }
        }
    }

    .tag {
        background: #fff;
        padding: 0 10px;
        color: #333;
        flex: 1;
        .tag-list{
            height: 250px;
            overflow-y: auto;
            padding: 5px 0;
        }
        .tag-list li{
            padding:5px;
            cursor: pointer;
        }
        li.active{
            background: #1e6beb;
            color: #fff;
        }
    }
    .set-ico{
        display: inline-block;
        width: 24px;
        vertical-align: middle;
        margin-top: -5px;
    }
    .toolTip{
        transition: 0.5s all;
        background: #c3e6cb;
    }
</style>
