<template>
    <div class="main">
        <div class="menu-btn" @click="handleBack">返回</div>
        <div class="system-date">
            {{systemDate[0].value}}
        </div>
        <div class="logo">
        </div>
        <section class="set-menu">
            <div class="flex">
                <div class="div-flex">
                    <h4 class="text-center h4-title">设备故障报警</h4>
                    <div class="flex-column">
                        <div v-for="(item,index) in reportList1" :key="item.key">
                            <span class="color-1">{{item.key}}:</span>
                            <span :class="[item.value?'color-danger':'color-normal']"></span>
                        </div>
                    </div>
                    <div class="flex-column">
                        <div v-for="(item,index) in reportList2" :key="item.key">
                            <span class="color-1">{{item.key}}:</span>
                            <span :class="[item.value?'color-danger':'color-normal']"></span>
                        </div>
                    </div>
                    <div class="flex-column">
                        <div v-for="(item,index) in reportList3" :key="item.key">
                            <span class="color-1">{{item.key}}:</span>
                            <span :class="[item.value?'color-danger':'color-normal']"></span>
                        </div>
                    </div>
                </div>
                <div class="div-flex">
                    <h4 class="text-center h4-title">设备参数监控</h4>
                    <el-row :gutter="20">
                        <el-col :span="8" v-for="(item,index) in socketList" :key="item.key">
                            <span class="color-1">{{item.key}}:</span>
                            <span class="color-2">{{item.value}}</span>
                        </el-col>
                    </el-row>
                </div>
            </div>
        </section>
        <article class="logo-info">
            <el-row :gutter="20" style="width: 200px">
                <el-col :span="24" v-for="(item,index) in socketList1" :key="item.key">
                    <span class="color-1">{{item.key}}:</span>
                    <span class="color-2">{{item.value}}</span>
                </el-col>
            </el-row>
        </article>
    </div>
</template>

<script>
    import moduleList from "../../assets/module/project-module";
    import {tongs} from "../../assets/module/project-animation"
    import {pusher, bigPunch, punch} from "../../assets/module/animation-punch"
    import {strategie, blanking} from "../../assets/module/animation-transplanter"
    import {createMatter} from "../../assets/module/matter"
    import projectMplModule from "../../assets/module/project-robot-module";
    import projectUpDownModule from "../../assets/module/project-updown-module";
    import {light} from "../../assets/module/projec-light"
    // import projectTestObectModule from "../../assets/module/project-testObject-module"

    export default {
        name: "index",
        data() {
            return {
                dm: null,
                g3d: null,
                loadModalList: moduleList,
                reportList1: [
                    {key: '1号630T报警信息', value: '',},
                    {key: '2号400T报警信息', value: '',},
                    {key: '3号300T报警信息', value: '',},
                    {key: '4号300T报警信息', value: '',},
                ],
                reportList2: [
                    {key: '取料机械手报警信息', value: ''},
                    {key: '移栽报警信息', value: ''},
                ],
                reportList3: [
                    {key: '251铆接报警信息', value: ''},
                    {key: '252铆接报警信息', value: ''},
                    {key: '253铆接报警信息', value: ''},
                    {key: '254铆接报警信息', value: ''},
                    {key: '255铆接报警信息', value: ''},
                ],
                socketList: [
                    {key: '液压垫压力1', tag: 'A0702010004170081/07020100040101010194', value: ''},
                    {key: '蓄能器压力', tag: 'A0702010004170081/07020100040101010195', value: ''},
                    {key: '平衡缸压力', tag: 'A0702010004170081/07020100040101010198', value: ''},
                    {key: '液压垫位置', tag: 'A0702010004170081/07020100040101010193', value: ''},
                    {key: '平衡缸要求压力', tag: 'A0702010004170081/07020100040101010199', value: ''},
                    {key: '平衡缸蓄能器压力', tag: 'A0702010004170081/07020100040101010200', value: ''},
                    {key: '平衡缸蓄能器压差', tag: 'A0702010004170081/07020100040101010209', value: ''},
                    {key: '微调位移尺', tag: 'A0702010004170081/07020100040101010204', value: ''},
                    {key: '装模高度', tag: 'A0702010004170081/07020100040101010203', value: ''},
                    {key: 'RT1油箱温度', tag: 'A0702010004170081/07020100040101010205', value: ''},
                    {key: '液压垫压力2', tag: 'A0702010004170081/07020100040101010202', value: ''},
                    {key: 'RT2油箱温度', tag: 'A0702010004170081/07020100040101010206', value: ''},
                    {key: '主油箱油温', tag: 'A0702010004170081/07020100040101010207', value: ''},
                    {key: '循环油箱油温', tag: 'A0702010004170081/07020100040101010208', value: ''},
                    {key: '微调位置尺', tag: 'A0702010004170081/07020100040101010201', value: ''},
                    {key: '左前应变片压力', tag: 'A0702010004170081/07020100040101010210', value: ''},
                    {key: '左后应变片压力', tag: 'A0702010004170081/07020100040101010211', value: ''},
                    {key: '液压垫吨位', tag: 'A0702010004170081/07020100040101010181', value: ''},
                    {key: '右前应变片压力', tag: 'A0702010004170081/07020100040101010212', value: ''},
                    {key: '右后应变片压力', tag: 'A0702010004170081/07020100040101010213', value: ''},
                    {key: '应变片总吨位', tag: 'A0702010004170081/07020100040101010187', value: ''}
                ],
                socketList1: [
                    {key: '当班产量', tag: 'A1001020001190525/201910211044000004', value: ''},
                    {key: '钣金段节拍', tag: 'A0102040022170342/201910311003000001', value: ''},
                ],
                systemDate: [{tag: 'deviceSystem/1000000001', value: ''},]
            }
        },
        methods: {
            init() {
                this.g3d = new ht.graph3d.Graph3dView();
                this.dm = this.g3d.dm();
                // this.g3d.setGridVisible(true);
                this.g3d.isMovable = () => {
                    return false
                };
                // this.g3d.setEditable(true);
                let borderPane = new ht.widget.BorderPane();
                let view = this.g3d.getView();
                view.style.background = '#101032';
                borderPane.setCenterView(view);
                borderPane.addToDOM();
                window.addEventListener('resize', (e) => {
                    this.g3d.invalidate();
                }, false);
                this.modelOption(this.g3d);
                this.loadObjFunc(this.loadModalList);
                this.setEye(this.g3d, [-100, 800, 1800], [0, 0, 0]);
                setTimeout(() => {
                    this.dm.enableAnimation(10);
                    light(this.dm,'light-1',[-800, 375, 69]);
                    light(this.dm,'light-2',[-583, 265, 69]);
                    light(this.dm,'light-3',[-323, 265, 69]);
                    light(this.dm,'light-4',[-63, 265, 69]);
                }, 7000);

                setTimeout(() => {
                    projectUpDownModule.UpDoneCallback = projectMplModule.MPL100ToGetObj.bind(projectMplModule);
                    projectUpDownModule.Create(this.g3d.dm(), [1010, 2900, -27]);
                }, 10);
                setTimeout(() => {
                    projectMplModule.Create(this.g3d.dm(), [1300, 3085, -40]);
                }, 10);
                setTimeout(() => {
                    this.initWebSocket(this.dm);
                }, 10000);
            },
            modelOption(g3d) {
                g3d.addInteractorListener((e) => {
                    if (e.kind === 'doubleClickData') {
                        let p3 = e.data.p3();
                        let r3 = e.data.r3();
                        if (g3d.flyTo) {
                            g3d.flyTo(e.data, {animation: true, direction: [0, 1, 5]});// 6.2.2 版本以上才有此方法
                        }
                    } else if (e.kind === 'clickData') {
                        // projectTestObectModule.Create(g3d.dm(), [1300, 3085, -40], projectUpDownModule.setMatterToMainPosition.bind(projectUpDownModule));
                        console.log(e.data.getTag());
                        console.log(e.data.p3());
                    }
                });
            },
            loadObjFunc(modalList) {
                if (modalList.length > 0) {
                    let len = modalList.length;
                    let g3d = this.g3d;
                    for (let i = 0; i < len; i++) {
                        let node = new ht.Node();
                        ht.Default.loadObj(modalList[i].obj, modalList[i].mtl, {
                            cube: true,
                            center: true,
                            shape3d: modalList[i].name,//string
                            finishFunc: (modelMap, array, rawS3) => {
                                if (modelMap) {
                                    node.s({
                                        'shape3d': modalList[i].name,
                                        'label': '',
                                        "shape3d.opacity": 1,
                                    });
                                    node.setName(modalList[i].name);
                                    node.setTag(modalList[i].name);
                                    node.s3(rawS3[0] / 20, rawS3[1] / 20, rawS3[2] / 20);
                                    node.p3(modalList[i].p3);
                                    node.setAnchorElevation(0);
                                    // setTimeout(()=>{
                                    //     animations(g3d.dm(),node,projectMplModule.MPL100ToGetObj.bind(projectMplModule));
                                    // },2000);
                                    g3d.dm().add(node);
                                    g3d.json = g3d.dm().serialize();// 相当于初始化 json
                                    return node;
                                }
                            }
                        });
                    }
                }
            },
            setEye(g3d, eye, center) {
                let e = ht.Default.clone(g3d.getEye()),// 获取当前眼睛的位置
                    c = ht.Default.clone(g3d.getCenter());// 获取当前眼睛聚焦的位置
                let edx = eye[0] - e[0],
                    edz = eye[1] - e[1],
                    edy = eye[2] - e[2],
                    cdx = center[0] - c[0],
                    cdz = center[1] - c[1],
                    cdy = center[2] - c[2];

                ht.Default.startAnim({
                    duration: 5000,
                    easing: function (t) {
                        return t
                    },
                    finishFunc: function () {

                    },
                    action: (v) => {
                        //V是从0-1的值
                        g3d.setEye([e[0] + edx * v, e[1] + edz * v, e[2] + edy * v]);
                        g3d.setCenter([c[0] + cdx * v, c[1] + cdz * v, c[0] + cdy * v,]);
                    }
                })
            },
            initWebSocket(dm) {
                let num = 0;//未折弯物料统计
                let count = 0;//折弯物料统计
                let matterList = [];//未折弯物料
                let bendMatterList = [];//折弯物料
                tongs(this.dm, projectUpDownModule.setMatterToMainPosition.bind(projectUpDownModule), bendMatterList);
                this.webSocket = new WebSocket(`ws://10.174.99.76:8081/miot/websocket/1417?opc.tcp://10.18.42.133:10000/MideaServer&token=undefined&userName=zhouzheng5&tenantId=undefined`);
                this.webSocket.onopen = (evt) => {
                    // this.webSocket.send('aaa');
                };
                this.webSocket.onmessage = (evt) => {
                    this.deviceList = JSON.parse(evt.data);
                    if (this.deviceList.length > 0) {
                        this.deviceList.forEach(item => {
                            //    console.log(item.tagValue[3], item.tagValue[1]);
                            //     if (item.tagValue[1]) {
                            let tagCode = item.tagValue[3];
                            switch (tagCode) {
                                case 'A1001010002170181/songliaoxinhao':
                                    if (item.tagValue[1]) {
                                        matterList.push(createMatter(dm, `物料${num}`));
                                        pusher(dm, dm.getDataByTag('上料机-左右平移'), matterList);
                                        num++;
                                        console.log('上料');
                                    }
                                    break;
                                case 'A1001010002170181/chongchuang1':
                                    if (matterList.length > 0) {
                                        if (item.tagValue[1]) {
                                            matterList.find(item => {
                                                let p3 = item.p3();
                                                switch (p3[0]) {
                                                    case -911:
                                                        bigPunch(dm, dm.getDataByTag('大冲床-动态'));
                                                        break;
                                                    case -661:
                                                        punch(dm, dm.getDataByTag('冲床动-1'), '冲床动-1');
                                                        break;
                                                    case -411:
                                                        punch(dm, dm.getDataByTag('冲床动-2'), '冲床动-2');
                                                        break;
                                                    case -161:
                                                        punch(dm, dm.getDataByTag('冲床动-3'), '冲床动-3');
                                                        break;
                                                }
                                            });
                                        }
                                    }
                                    console.log('大冲床');
                                    break;
                                // case 'A0102040022170342/maojiexianxinhao':
                                //     tongs(dm, projectMplModule.MPL100ToGetObj.bind(projectMplModule),bendMatterList);
                                //     console.log('铆接线');
                                //     break;
                                case 'A1001010002170181/songliaoxinhao1':
                                    if (matterList.length > 0) {
                                        if (item.tagValue[1]) {
                                            let strategies1 = new strategie(dm, 1, matterList);
                                            strategies1.status1();
                                            let strategies2 = new strategie(dm, 2, matterList);
                                            strategies2.status1();
                                            let strategies3 = new strategie(dm, 3, matterList);
                                            strategies3.status1();
                                            let strategies4 = new strategie(dm, 4, matterList);
                                            strategies4.status1();
                                        }
                                    }
                                    console.log('移栽机1');
                                    break;
                                // case 'A1001010002170181/songliaoxinhao2':
                                //     if(matterList.length > 0){
                                //         let strategies2 = new strategie(dm, 2, matterList);
                                //         strategies2.status1();
                                //     }
                                //     console.log('移栽机2');
                                //     break;
                                // case 'A1001010002170181/songliaoxinhao3':
                                //     let strategies3 = new strategie(dm, 3, matterList);
                                //     strategies3.status1();
                                //     console.log('移栽机3');
                                //     break;
                                // case 'A1001010002170181/songliaoxinhao4':
                                //     if(matterList.length > 0){
                                //         let strategies4 = new strategie(dm, 4, matterList);
                                //         strategies4.status1();
                                //     }
                                //     console.log('移栽机4');
                                //     break;
                                case 'A1001010002170181/songliaoxinhao5':
                                    if (matterList.length > 0) {
                                        if (item.tagValue[1]) {
                                            let blank = new blanking(dm, matterList, bendMatterList);
                                            blank.status1();
                                        }
                                    }
                                    console.log('小移栽机');
                                    break;
                                case 'A0702010004170081/07020100040101010118':
                                    this.reportList1[0].value = item.tagValue[1];
                                    if(item.tagValue[1]){
                                        dm.getDataByTag('light-1').s('light.disabled',false);
                                        dm.getDataByTag('light-1').s('light.color','red');
                                    }else{
                                        dm.getDataByTag('light-1').s('light.disabled',true);
                                        dm.getDataByTag('light-1').s('light.color','transparent');
                                    }
                                    break;
                                case 'A0102010003170161/01020100030101010018':
                                    this.reportList1[1].value = item.tagValue[1];
                                    if(item.tagValue[1]){
                                        dm.getDataByTag('light-2').s('light.disabled',false);
                                        dm.getDataByTag('light-2').s('light.color','red');
                                    }else{
                                        dm.getDataByTag('light-2').s('light.disabled',true);
                                        dm.getDataByTag('light-2').s('light.color','transparent');
                                    }
                                    console.log('冲床1报警');
                                    break;
                                case 'A0102010003170191/01020100030101010018':
                                    this.reportList1[2].value = item.tagValue[1];
                                    if(item.tagValue[1]){
                                        dm.getDataByTag('light-3').s('light.disabled',false);
                                        dm.getDataByTag('light-3').s('light.color','red');
                                    }else{
                                        dm.getDataByTag('light-3').s('light.disabled',true);
                                        dm.getDataByTag('light-3').s('light.color','transparent');
                                    }
                                    break;
                                case 'A0102010003170192/01020100030101010018':
                                    this.reportList1[3].value = item.tagValue[1];
                                    if(item.tagValue[1]){
                                        dm.getDataByTag('light-4').s('light.disabled',false);
                                        dm.getDataByTag('light-4').s('light.color','red');
                                    }else{
                                        dm.getDataByTag('light-4').s('light.disabled',true);
                                        dm.getDataByTag('light-4').s('light.color','transparent');
                                    }
                                    break;
                                case 'A1001010002170181/10010100020101010010':
                                    this.reportList2[0].value = item.tagValue[1];
                                    break;
                                case 'A0102040022170342/yizaialarm':
                                    this.reportList2[1].value = item.tagValue[1];
                                    break;
                                case 'A0102040022170342/251alarm':
                                    this.reportList3[0].value = item.tagValue[1];
                                    break;
                                case 'A0102040022170342/252alarm':
                                    this.reportList3[1].value = item.tagValue[1];
                                    break;
                                case 'A0102040022170342/253alarm':
                                    this.reportList3[2].value = item.tagValue[1];
                                    break;
                                case 'A0102040022170342/254alarm':
                                    this.reportList3[3].value = item.tagValue[1];
                                    break;
                                case 'A0102040022170342/255alarm':
                                    this.reportList3[4].value = item.tagValue[1];
                                    break;
                            }
                            // }
                        });
                    }
                };
                this.webSocket.onclose = (evt) => {
                    this.dm.disableAnimation();
                    this.$message.warning('当前服务链接已断开，请刷新页面重试！');
                };
            },
            websocketData() {
                let socketData = new WebSocket('ws://10.174.99.76:8081/miot/websocket/753?opc.tcp://10.18.42.133:10000/MideaServer&token=undefined&userName=yanjing2&tenantId=undefined');
                socketData.onmessage = (evt) => {
                    let eventData = JSON.parse(evt.data);
                    if (eventData.length > 0) {
                        eventData.forEach(item => {
                            let tagInfo = item.tagValue;
                            this.socketList.find(item => {
                                if (item.tag === tagInfo[3]) {
                                    return item.value = tagInfo[1]
                                }
                            });
                        });
                    }
                }
            },
            websocketData2() {
                let socketData = new WebSocket('ws://10.174.99.76:8081/miot/websocket/794?opc.tcp://10.18.42.133:10000/MideaServer&token=undefined&userName=yanjing2&tenantId=undefined');
                socketData.onmessage = (evt) => {
                    let eventData = JSON.parse(evt.data);
                    if (eventData.length > 0) {
                        eventData.forEach(item => {
                            let tagInfo = item.tagValue;
                            if (this.systemDate[0].tag === tagInfo[3]) {
                                this.systemDate[0].value = tagInfo[1];
                            }
                            this.socketList1.find(item => {
                                if (item.tag === tagInfo[3]) {
                                    return item.value = tagInfo[1]
                                }
                            });
                        });
                    }
                }
            },
            handleBack() {
                location.href = "http://10.174.99.76:8081/WebDesigner/RunTime.html?projectName=%E5%90%88%E8%82%A5%E6%B4%97%E8%A1%A3%E6%9C%BA%E6%BB%9A%E7%AD%92%E7%BA%BF22&userName=yanjing2";
            }
        },
        mounted() {
            this.$nextTick(() => {
                this.init();
                this.websocketData();
                this.websocketData2();
            });
        },
        beforeDestroy() {
            //this.webSocket.close();
        }
    }
</script>

<style scoped lang="less">
    .header-title {
        color: #4bebeb;
        font-size: 20px;
        margin: 10px;
        font-weight: 300;
        position: absolute;
        left: 40%;
        z-index: 90;
    }

    .system-date {
        position: fixed;
        right: 110px;
        top: 40px;
        z-index: 99;
        width: 150px;
        height: 30px;
        color: rgb(4, 255, 0);
    }

    .logo {
        background: url("../../assets/image/logo.png") 0 0 no-repeat;
        background-size: 100%;
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 110px;
        z-index: 90;
    }

    .menu-btn {
        position: fixed;
        left: 10px;
        top: 40px;
        z-index: 99;
        background: rgba(0, 0, 0, .3);
        padding: 10px;
        border: 1px solid #1c2864;
        background: #01092e;
        cursor: pointer;
        display: inline-block;
        margin: 0 10px;
        color: #fff;
    }

    .logo-info {
        position: fixed;
        left: 80px;
        top: 30px;
        z-index: 99;
        padding: 10px;
        /*border: 1px solid #1c2864;*/
        /*background: #01092e;*/
        /*display: inline-block;*/
        margin: 0 10px;
    }

    .set-menu {
        position: fixed;
        left: 10px;
        bottom: 10px;
        z-index: 1;
        /*background: rgba(0, 0, 0, .3);*/
        color: #fff;
        margin: 0 10px;
        /*font-size: 14px;*/
    }

    .div-flex {
        width: 49%;
        padding: 5px 10px;
        margin-right: 10px;
        border: 1px solid #1c2864;
        background: #01092e;
        display: inline-block;
        .flex-column {
            width: 33%;
            display: inline-block;
            vertical-align: top;
        }
    }

    .color-1 {
        color: rgb(75, 235, 235);
        margin: 3px 0;
        display: inline-block;
    }

    .color-2 {
        color: rgb(4, 255, 0);
        margin: 3px 5px;
        display: inline-block;
    }

    .color-normal, .color-danger {
        width: 15px;
        height: 15px;
        background: #67C23A;
        border-radius: 50%;
        display: inline-block;
        vertical-align: middle;
        margin: -2px 5px 0;
    }

    .h4-title {
        margin: 5px;
    }

    .color-danger {
        background: #F56C6C;
    }
</style>
