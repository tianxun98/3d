<template>
    <div class="main">
    </div>
</template>

<script>
    import projectMplModule from "../../assets/module/project-mpl-module";
    export default {
        name: "test-animation",
        data() {
            return {
                dm: null,
                g3d: null,
                mplModel:undefined
            }
        },
        methods: {
            init() {
                this.g3d = new ht.graph3d.Graph3dView();
                let  thisTemp=this;
                this.g3d.addInteractorListener(function (e) {
                    console.log(e);
                   if(e.kind === 'clickData'){
                       // console.log(rawS3);

                       projectMplModule.MPL100ToGetObj();
                        }
                    }.bind(this));
                this.dm = this.g3d.dm();


                this.dm.enableAnimation();


                this.g3d.setGridVisible(true);
                this.dm.getDataAnimation = function(data) {
                    if (data && data.getAnimation() != null) {
                        return data.getAnimation();
                    }
                }

                this.dm.setAnimation = function(data) {
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
                projectMplModule.Create(this.g3d.dm());
                // this.loadObjFunc(this.loadModalList);
                // this.setEye(this.g3d,[0, 800, 1500],[0,0,0]);

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

            loadObjFunc(modalList) {
                if (modalList.length > 0) {
                    let len = modalList.length;
                    let g3d = this.g3d;
                    let thisTemp=this;
                    for (let i = 0; i < len; i++) {
                        var pRight = [ 0,1275/20, 0 ];
                        var scaleFactor = 1;
                        ht.Default.loadObj(modalList[i].obj, modalList[i].mtl, {
                            cube: true,
                            center: true,
                            part:true,
                            shape3d: modalList[i].name,//string
                            anchor3d:[0,0,0],
                            r3:[-Math.PI/2,0,0],
                            finishFunc: (modelMap, array, rawS3) => {
                                console.log(modelMap);
                                console.log(rawS3);
                                rawS3[0]=rawS3[0]/20;
                                rawS3[1]=rawS3[1]/20;
                                rawS3[2]=rawS3[2]/20;
                                window.modelMap = modelMap;
                                if (!modelMap)
                                    return;
                                var lastNode = null,
                                    firstNode = null,
                                    parentNode = new ht.Data();
                                thisTemp.mplModel=parentNode;
                                g3d.dm().add(parentNode);

                                var box = new ht.Math.Box3();
                                var v3 = new ht.Math.Vector3();
                                var center = new ht.Math.Vector3();
                                var size = new ht.Math.Vector3();
                                var vs;
                                var i, len;
                                var model, shape3d;
                                var subP3 = new ht.Math.Vector3();
                                var subS3 = new ht.Math.Vector3();

                                for(var name in modelMap){
                                    //不加载连杆
                                    if(name==="Material_8"||name==="Material_7"){
                                        continue;
                                    }
                                    subP3.copy(pRight);
                                    subS3.copy(rawS3);

                                    model = modelMap[name];
                                    shape3d = 'scooter:' + name;

                                    // 当前 model 进一步 center / cube 化
                                    box.makeEmpty();

                                    vs = model.vs;
                                    if (vs && (len = vs.length)) {
                                        for (i = 0; i < len; i += 3) {
                                            box.expandByPoint(v3.fromArray(vs, i));
                                        }
                                        center.copy(box.min).add(box.max).multiplyScalar(0.5);
                                        size.copy(box.max).sub(box.min);

                                        for (i = 0; i < len; i += 3) {
                                            vs[i] = (vs[i] - center.x) / size.x;
                                            vs[i + 1] = (vs[i + 1] - center.y) / size.y;
                                            vs[i + 2] = (vs[i + 2] - center.z) / size.z;
                                        }

                                        subP3.add(center.multiply(subS3).multiplyScalar(scaleFactor));
                                        subS3.multiply(size).multiplyScalar(scaleFactor);
                                    }

                                    ht.Default.setShape3dModel(shape3d, model);

                                    var node = new ht.Node();
                                    node.setParent(parentNode);
                                    node.setName(name);
                                    node.setTag(name);
                                    node.s({
                                        'wf.visible' : 'selected',
                                        'shape3d': shape3d
                                    });
                                    lastNode = node;
                                    if(!firstNode){
                                        firstNode = node;
                                    }
                                    node.s3(subS3.toArray());
                                    node.p3(subP3.toArray());

                                    node.a('myRawS3', node.s3());
                                    node.a('myRawP3', node.p3())
                                    g3d.dm().add(node);
                                }
                                thisTemp.setMPL100Host();
                                    for(var name in modelMap) {
                                        thisTemp.setMPL100Anmation(name);
                                    }
                                thisTemp.initMPL100gRotation();
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
            },


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
