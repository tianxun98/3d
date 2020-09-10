<template>
    <div class="run-view">
        <section class="live-data">
            <h3 class="text-center h3-title">实时数据</h3>
            <ul class="tag-list">
                <li v-for="(item,index) in tagList" :key="index">
                    <div>
                        <span class="set-tagName">测点编码：</span>
                        <span class="space">{{item.name}}</span>
                    </div>
                    <div>
                        <span class="set-tagName">测点值：</span>
                        <span class="space">{{item.value}}</span>
                    </div>

                </li>
            </ul>
        </section>
    </div>
</template>

<script>
    let tabView, borderPane;
    let num = 100, result;
    let flowTask = {
        interval: 30,
        action: function (data) {
            if (data.s('3d.action')) {
                let p3 = data.p3();
                if (num < 400) {
                    num = num + 1;
                    result = num + 1;
                } else if (result === 100) {
                    num = result;
                } else {
                    result--;
                }
                data.p3(result, p3[1], p3[2]);
            }
        }
    };
    export default {
        name: "run-view",
        data() {
            return {
                webSocket: null,
                dm: null,
                opcUrl: '',
                tagList: [],
                webSocketData: []
            }
        },
        methods: {
            createTabView(name, sceneJson) {// 创建页签组件
                let g3d = this.create3DView();
                if (name && name !== '') this.createTab(name, g3d);
                else this.createTab('新建看板', g3d);

                if (sceneJson) {
                    this.dm = g3d.dm();
                    this.dm.deserialize(sceneJson);

                    this.setAnimation(this.dm);
                }
            },
            init(name, sceneJson) {
                borderPane = new ht.widget.BorderPane();
                tabView = new ht.widget.TabView();
                borderPane.setCenterView(tabView);
                borderPane.addToDOM();
                this.createTabView(name, sceneJson)
            },

            initWebSocket(projectId) {
                this.webSocket = new WebSocket(`ws://10.17.162.100:21003/miot/websocket/${projectId}?opc.tcp://10.17.164.214:10000/MideaServer&token=1Arz0knGM-wAzN8tDim4GgZ3pC-OoJbw&userName=lqy&tenantId=877ecc5e42d74f6a8a3cfb9d6826e1f8`);
                this.webSocket.onopen = (evt) => {
                    this.dm.addScheduleTask(flowTask);
                };
                this.webSocket.onmessage = (evt) => {
                    this.webSocketData = JSON.parse(evt.data);
                    this.webSocketData.forEach(item => {
                        this.tagList.push({name: item.tagValue[3], value: item.tagValue[1]});
                        this.dm.getDatas().forEach(node => {
                            if (node.s('setTag') && node.s('getId') === item.objectId) {
                                let labelStyle = {
                                    'label': item.tagValue[1],
                                    'label.background': '51596e',
                                    'label.position': 17,
                                    'label.autorotate': true,
                                    'label.t3': [0, 10,30],
                                    'label.font':'20px sans-serif',
                                    'label.color':'#fff'
                                };
                                node.s(labelStyle)
                            }
                        })
                    });
                };

                this.webSocket.onclose = (evt) => {
                    this.dm.removeScheduleTask(flowTask);
                    this.$message.warning('当前webSocket链家已断开，请稍等在重试！');
                };
            },
            setAnimation(dm) {
                dm.getDataAnimation = function (data) {
                    if (data.s('3d.sparkle')) {
                        if (data.getAnimation() != null) {
                            return data.getAnimation();
                        } else {
                            return {
                                hide: {
                                    property: "shape3d.opacity",
                                    accessType: "style",
                                    from: 1,
                                    to: 0,
                                    frames: data.s('shape3d.frames'),
                                    next: "show"
                                },
                                show: {
                                    property: "shape3d.opacity",
                                    accessType: "style",
                                    from: 0,
                                    to: 1,
                                    frames: data.s('shape3d.frames'),
                                    next: "hide"
                                },
                                start: ["hide"]
                            }
                        }
                    } else {
                        return null;
                    }
                };
                dm.enableAnimation(500);
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
                g3d.setEye(10, 800, 1600);
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
        },
        mounted() {
            let projectId = this.$route.query.projectId;
            this.$http.get('project', {}, `/${projectId}`).then(res => {
                if (res.code === 200) {
                    let info = res.data;
                    this.init(info.projectName, info.content);
                    this.initWebSocket(projectId);
                }
            });

        }
    }
</script>

<style scoped lang="less">
    .live-data {
        position: absolute;
        z-index: 99;
        background: rgba(255, 255, 255, .5);
        border: 1px solid #f4f4f4;
        width: 20%;
        top: 5%;
        left: 0;
    }

    .h3-title {
        padding: 10px 0;
        margin: 0;
        border-bottom: 1px solid #eee;
    }

    .tag-list {
        height: 350px;
        overflow-y: auto;
        li {
            padding: 5px;
            text-align: center;
        }
        .set-tagName {
            text-align: right;
            display: inline-block;
            width: 61px;
            float: left;
        }
    }

    .space {
        display: inline-block;
        white-space: nowrap; /*设置不换行*/
        overflow: hidden; /*设置隐藏*/
        text-overflow: ellipsis; /*设置隐藏部分为省略号*/
    }
</style>
