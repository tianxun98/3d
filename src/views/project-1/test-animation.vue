<template>
    <div class="main">
    </div>
</template>

<script>
    import moduleList from "../../assets/module/project-module";
    export default {
        name: "test-animation",
        data() {
            return {
                dm: null,
                g3d: null,
                loadModalList:moduleList
            }
        },
        methods: {
            init() {
                this.g3d = new ht.graph3d.Graph3dView();
                this.dm = this.g3d.dm();
                this.dm.enableAnimation();
                this.g3d.setGridVisible(true);
                this.dm.getDataAnimation = function(data) {
                    if (data && data.getAnimation() != null) {
                        return data.getAnimation();
                    }
                }
                // this.g3d.isMovable = ()=>{
                //   return false
                // };
                // this.g3d.setEye(0, 800, 2000);
                this.g3d.json = '';
                let borderPane = new ht.widget.BorderPane();
                let view = this.g3d.getView();
                view.className = 'main';
                // view.style.background = 'rgba(0,0,0,.7)';
                borderPane.setCenterView(view);
                borderPane.addToDOM();
                window.addEventListener('resize', (e) => {
                    this.g3d.invalidate();
                }, false);
                this.modelOption(this.g3d);
                this.loadObjFunc(this.loadModalList);
                // this.setEye(this.g3d,[0, 800, 1500],[0,0,0]);
                setTimeout(()=>{
                    this.scheduleTask();
                },3000);
            },
            modelOption(g3d) {
                g3d.addInteractorListener((e) => {
                    // console.log(e.data.p3());
                    if (e.kind === 'doubleClickData') {
                        let p3 = e.data.p3();
                        let r3 = e.data.r3();
                        if (g3d.flyTo) {
                            g3d.flyTo(e.data, {animation: true, direction: [0, 1, 5]});// 6.2.2 版本以上才有此方法
                        }
                    }
                });
            },
            scheduleTask() {
                let thisTemp=this;

                //maxY下沉的最大参数
                let maxX = 10, minX = 1, maxY = 0, minY = 100;
                let nodeTemp;
                let nodey=0;
                let timeout = 1;
                let flowTask = {
                    interval: 20,
                    action: function (data) {
                        if (data&&data.getName() === '铆接线-运动') {
                            let p3 = data.p3();
                            let x = p3[0];
                            let y = p3[1];
                            if (maxX <= 200) {
                                maxX = maxX + 1;
                                minX = minX + 1;
                                x = x + 1; //先移动右边
                            }
                            else if (maxX >= 200) {
                                if (minY > maxY) {
                                    minY--;
                                    y = y - 1; //下沉
                                    if(minY == maxY){
                                        nodeTemp=  thisTemp.createNode(p3, [100, 30, 100]);
                                        nodey=y;
                                        console.log('nodey',y);
                                        thisTemp.g3d.dm().add(nodeTemp);
                                        nodeTemp.setHost(data);
                                    }
                                }
                                else if (minY === maxY) {
                                    if (y < 100) {
                                        y = y + 1;//上层
                                    } else {
                                        if (minX === 10) {
                                            maxX = minX;
                                            minY = 100;
                                            timeout = 1;
                                                nodeTemp.setHost(null);
                                                console.log("position",nodeTemp.p3());
                                                nodeTemp.resumeAnimation();
                                                nodeTemp.p3(nodeTemp.p3()[0],nodey,nodeTemp.p3()[2]);
                                        } else {
                                            //往左边移动
                                            minX = minX - 1;
                                            x = x - 1;
                                        }
                                    }

                                }
                            }
                            data.p3(x, y, p3[2]);
                        }
                    }
                };
                this.dm.addScheduleTask(flowTask);
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
                                    g3d.dm().add(node);
                                    node.s3(rawS3[0] / 20, rawS3[1] /20, rawS3[2] / 20);
                                    node.p3(modalList[i].p3);

                                    node.setName(modalList[i].name);
                                    node.setAnchorElevation(0);
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
                // eye 为需要修改的对应 eye 值
                // center 为需要修改的对应 center 值
                // 以下为分别获取 eye 与 center 在 xyz 三个坐标轴之间的差值
                let edx = eye[0] - e[0],
                    edz = eye[1] - e[1],
                    edy = eye[2] - e[2],
                    cdx = center[0] - c[0],
                    cdz = center[1] - c[1],
                    cdy = center[2] - c[2];

                ht.Default.startAnim({
                    duration:3000,
                    easing:function(t){return t},
                    finishFunc:function(){

                    },
                    action:(v) => {
                        //V是从0-1的值
                        g3d.setEye([e[0] + edx * v,e[1] + edz * v,e[2] + edy * v]);
                        g3d.setCenter([c[0] + cdx * v,c[1] + cdz * v,c[0] + cdy * v,])
                    }
                })
            },
              createNode(p3, s3){
                let  thisTemp=this;
                var node = new ht.Node();
                node.p3(p3);
                node.s3(s3);
              node.s({
                  'left.transparent': true,
                  'left.visible': true,
                  'left.reverse.flip': true,
                  'left.color': 'rgba(0, 255, 0, 0.5)',
                  'right.transparent': true,
                  'right.visible': true,
                  'right.reverse.flip': true,
                  'right.color': 'rgba(0, 255, 0, 0.5)'
              });
              node.setAnimation({
                  blend: {
                      from: 255,
                      to: 0,
                      duration:20000,
                      onUpdate: function(value) {
                          let x=node.p3()[0];
                          x++;
                          node.p3(x, node.p3()[1], node.p3()[2]);
                          let rx=node.getRotation()[0];
                          rx++;
                          node.setRotationX(rx);
                          console.log( node.p3());
                      },
                      onComplete:function () {
                          console.log("onComplete");
                          node.setAnimation(null);
                          setTimeout(function () {
                              thisTemp.g3d.dm().remove(node);
                          },500);

                      }

                  },
                  start: ["blend"]
              });
                  node.pauseAnimation();

                return node;
            }
        },
        mounted() {
            this.$nextTick(() => {
                this.init()
            });
        }
    }
</script>

<style scoped lang="less">
    .main {
        margin: 0px;
        padding: 0px;
        position: absolute;
        top: 0px;
        bottom: 0px;
        left: 0px;
        right: 0px;
    }
</style>
