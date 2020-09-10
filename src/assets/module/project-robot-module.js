function projectRobotModule() {
    this.module={
        obj: `assets/objs/project/robot1.obj`,
        mtl: `assets/objs/project/robot1.mtl`,
        name: `MPL100`,
        p3: [0,0,0]
    };
    this.mainNode=undefined;
    this.dataModel=undefined;
    this.scale=20;
    this.modelList={
        Material_Main:undefined,
        Material_A1:undefined,
        Material_A2:undefined,
        Material_A3:undefined,
        Material_A4:undefined,
        Material_A21:undefined,
        Material_A5:undefined,
        Material_A6:undefined,
        Material_A7:undefined,
        Material_A8:undefined,
        Material_A9:undefined
    }
    this.sendObjCompleteCallBack;
}

projectRobotModule.prototype.Create=function (dataModel,p3) {
    this.dataModel=dataModel;
    let thisTemp=this;
    if (this.module) {
        let thisTemp = this;
        var pRight = [p3[0], p3[1] / thisTemp.scale, p3[2]];
        var scaleFactor = 1;

        ht.Default.loadObj(this.module.obj, this.module.mtl, {
            cube: true,
            center: true,
            part: true,
            shape3d: module.name,//string
            anchor3d: [0, 0, 0],
            r3: [Math.PI*3 / 2,0, 0],
            finishFunc: (modelMap, array, rawS3) => {
                rawS3[0] = rawS3[0] /  thisTemp.scale;
                rawS3[1] = rawS3[1] /  thisTemp.scale;
                rawS3[2] = rawS3[2] /  thisTemp.scale;
                var firstNode = null,
                    parentNode = new ht.Data();
                thisTemp.mainNode = parentNode;
                this.dataModel.add(parentNode);
                var box = new ht.Math.Box3();
                var v3 = new ht.Math.Vector3();
                var center = new ht.Math.Vector3();
                var size = new ht.Math.Vector3();
                var vs;
                var i, len;
                var model, shape3d;
                var subP3 = new ht.Math.Vector3();
                var subS3 = new ht.Math.Vector3();

                for (var name in modelMap) {
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
                    // node.setName(name);
                    node.setTag(name);
                    if(name.indexOf('Material_')>=0) {
                        thisTemp.modelList[name] = node;
                    }
                    node.s({
                        'wf.visible': 'selected',
                        'shape3d': shape3d
                    });
                    if (!firstNode) {
                        firstNode = node;
                    }
                    node.s3(subS3.toArray());
                    node.p3(subP3.toArray());

                    node.a('myRawS3', node.s3());
                    node.a('myRawP3', node.p3())
                    this.dataModel.add(node);
                }
                thisTemp.setMPL100Host();
                for (var name in modelMap) {
                     thisTemp.setRobotAnchor3d(name);
                }
                thisTemp.initMPL100gRotation();
            }
        });
    }
}

projectRobotModule.prototype.MPL100ToGetObj=function(matter) {
    let thisTemp=this;
    setTimeout(function () {
        thisTemp.setMPL100ToPosition(
            Math.PI*1/2,
            Math.PI*1/10 ,
            Math.PI*1/20,
            Math.PI*1/20,
            0,
            60, thisTemp.MPL100ToGetObj2.bind(thisTemp),matter);
    }, 500);
}

projectRobotModule.prototype.MPL100ToGetObj2=function(matter) {
    let thisTemp=this;
    setTimeout(function () {
        thisTemp.setMPL100ToPosition(
            0,
            -Math.PI*2/11 ,
            0,
            0,
            0,
            60,thisTemp.MPL100SetObjPosition.bind(thisTemp),matter);
    }, 20);
}

projectRobotModule.prototype.MPL100SetObjPosition=function(matter) {
    let thisTemp = this;
    if (matter) {
        matter.setAnchor3d(0.5,0.5,0.5);
        matter.setRotationMode('zyx')
        matter.setHost(thisTemp.modelList.Material_A7);

    }
    setTimeout(function () {
        thisTemp.setMPL100ToPosition(
            0,
            Math.PI * 2 / 11,
            0,
            0,
            0,
            60, thisTemp.MPL100SetObjPosition2.bind(thisTemp), matter);
    }, 500);
    //物体转动
    setTimeout(function () {
        let perZ=Math.PI/50;
        matter.setAnimation(
            {
                rat: {
                    frames: 50,
                    onUpdate: function (value) {
                        let temp = matter.getRotationZ();
                        temp = temp + perZ;
                        matter.setRotationZ(temp);
                    }
                },
                start:["rat"]
            });
    }, 1100);
}

projectRobotModule.prototype.MPL100SetObjPosition2=function(matter) {
    let thisTemp=this;
    setTimeout(function () {
        thisTemp.setMPL100ToPosition(
            -Math.PI/2,
            -Math.PI*3/10,
            0,
            0,
            Math.PI/2,
            60,thisTemp.MPL100ToInitPosition.bind(thisTemp),matter);
    }, 500);
}

projectRobotModule.prototype.MPL100ToInitPosition=function(matter) {
    let thisTemp=this;
    setTimeout(function () {
        thisTemp.setMPL100ToPosition(
            0,
            Math.PI*2/10,
            -Math.PI*1/20,
            0,
            -Math.PI/2,60,thisTemp.initMPL100gRotation.bind(thisTemp));
    },500);
    if(matter) {
        matter.setHost(null);
        if(thisTemp.sendObjCompleteCallBack){
            thisTemp.sendObjCompleteCallBack(matter);
        }
        //两秒后清空物体
        setTimeout(()=>{
            thisTemp.dataModel.remove(matter);
            matter=null;
        },2000);
    }
}

/**
 * 机械手点位控制
 * @param mA1Ry 底盘转轴转角
 * @param mA2Rz 大臂转角
 * @param mA3Rz 小臂转角
 * @param mA4Rz 夹具垂直转角
 * @param mA6Rx 夹具水平转角
 * @param frames
 * @param CompleteCallBack
 * @param callbaclParam
 */
projectRobotModule.prototype.setMPL100ToPosition=function(mA1Ry,mA2Rz,mA3Rz,mA4Rz,mA6Rx, frames,CompleteCallBack,callbaclParam) {
    let a1Ry = mA1Ry / frames;
    let a2Rz = mA2Rz / frames;
    let a3Rz = mA3Rz / frames;
    let a4Rz = mA4Rz / frames;
    let a6Rx = mA6Rx / frames;

    let thisTemp = this;

    let a1InitR3 = thisTemp.modelList.Material_A1.getRotation3d();
    let a2InitR3 = thisTemp.modelList.Material_A2.getRotation3d();
    let a3InitR3 = thisTemp.modelList.Material_A3.getRotation3d();
    let a4InitR3 = thisTemp.modelList.Material_A4.getRotation3d();
    let a6InitR3 = thisTemp.modelList.Material_A6.getRotation3d();

    thisTemp.mainNode.setAnimation(
        {
            mA1Ry: {
                frames: frames,
                onUpdate: function (value) {
                    let temp = thisTemp.modelList.Material_A1.getRotationY();
                    temp = temp + a1Ry;
                    thisTemp.modelList.Material_A1.setRotationY(temp);
                }
            },
            mA2Rz: {
                frames: frames,
                onUpdate: function (value) {
                    let temp = thisTemp.modelList.Material_A2.getRotationZ();
                    temp = temp + a2Rz;
                    thisTemp.modelList.Material_A2.setRotationZ(temp);
                }
            },
            mA3Rz: {
                frames: frames,
                onUpdate: function (value) {
                    let temp = thisTemp.modelList.Material_A3.getRotationZ();
                    temp = temp + a3Rz;
                    thisTemp.modelList.Material_A3.setRotationZ(temp);
                }
            },
            mA4Rz: {
                frames: frames,
                onUpdate: function (value) {
                    let temp = thisTemp.modelList.Material_A4.getRotationZ();
                    temp = temp + a4Rz;
                    thisTemp.modelList.Material_A4.setRotationZ(temp);
                }
            },
            mA6Rx: {
                frames: frames,
                onUpdate: function (value) {
                    let temp = thisTemp.modelList.Material_A6.getRotationX();
                    temp = temp + a6Rx;
                    thisTemp.modelList.Material_A6.setRotationX(temp);
                },
                onComplete: function () {
                    // setTimeout(function () {
                    //     thisTemp.modelList.Material_A1.setRotationY(a1InitR3[1] + mA1Ry);
                    //     thisTemp.modelList.Material_A2.setRotationZ(a2InitR3[2] + mA2Rz);
                    //     thisTemp.modelList.Material_A3.setRotationZ(a3InitR3[2] + mA3Rz);
                    //     thisTemp.modelList.Material_A4.setRotationZ(a4InitR3[2] + mA4Rz);
                    //     thisTemp.modelList.Material_A6.setRotationX(a6InitR3[0] + mA6Rx);
                        if (CompleteCallBack) {
                            CompleteCallBack(callbaclParam);
                        }
                    // }, 1000);

                }
            },
            start: ["mA1Ry", "mA2Rz", "mA3Rz", "mA4Rz", "mA6Rx"]
        }
    );
}

projectRobotModule.prototype.setRobotAnchor3d=function(nodeName){
    let thisTemp=this;
    let node=this.dataModel.getDataByTag(nodeName);
    let c=this;
    let z;
    let y;
    let x;
    switch (nodeName) {
        case "Material_A1":
            node.setAnchor3d(0.42,0.5,0.55);
                x=node.p3()[0]-node.s3()[0]*0.08;
                y=node.p3()[1];
                z=node.p3()[2]+node.s3()[2]*0.05;
                node.p3(x,y,z);
            break;
         case "Material_A2":
            node.setAnchor3d(0.55,0.2,0.25);
             x=node.p3()[0]+node.s3()[0]*0.2;
             y=node.p3()[1]-node.s3()[1]*0.3;
             z=node.p3()[2]-node.s3()[2]*0.3;
             node.p3(x,y,z);
             let Material_A21=thisTemp.modelList.Material_A21;
             thisTemp.modelList.Material_A21.p3(Material_A21.p3()[0],Material_A21.p3()[1]+node.s3()[1]*0.3,Material_A21.p3()[2]);
            break;
        case "Material_A3":
            node.setAnchor3d(0.15,0.3,0.5);
            node.p3(thisTemp.modelList.Material_A21.p3());
            let a3P3=node.p3();
            let a3S3=node.s3();
            thisTemp.modelList.Material_A4.p3(a3P3[0]+a3S3[0]*0.775,a3P3[1]+a3S3[1]*0.45,a3P3[2]+a3S3[2]*0.3);
            break;
        case "Material_A5":
            node.setAnchor3d(0.35,0.5,0.5);
            node.p3(thisTemp.modelList.Material_A4.p3()[0],thisTemp.modelList.Material_A4.p3()[1],
                thisTemp.modelList.Material_A4.p3()[2]-node.s3()[2]*0.5-thisTemp.modelList.Material_A4.s3()[2]*0.5);
            break;
        case "Material_A6":
            node.setAnchor3d(0.5,0.5,0.5);
            z=node.p3()[2];
            y=node.p3()[1];
            x=node.p3()[0]+thisTemp.modelList.Material_A5.s3()[2]*0.22;
            node.p3(x,y,z);
            break;
    }
}

projectRobotModule.prototype.setMPL100Host=function() {
    // Material_10,Material_5互相吸附
    let Material_Main = this.modelList.Material_Main;
    let Material_A1 = this.modelList.Material_A1;
    let Material_A2 =  this.modelList.Material_A2;
    let Material_A3 =  this.modelList.Material_A3;
    let Material_A4 =  this.modelList.Material_A4;
    let Material_A21 =  this.modelList.Material_A21;
    let Material_A5 =  this.modelList.Material_A5;
    let Material_A6 =  this.modelList.Material_A6;
    let Material_A7 =  this.modelList.Material_A7;
    let Material_A8 =  this.modelList.Material_A8;
    let Material_A9 =  this.modelList.Material_A9;
    if(Material_A1){
        Material_A1.setHost(Material_Main);
    }
    if (Material_A2) {
        Material_A2.setHost(Material_A1);
    }
    if (Material_A21) {
        Material_A21.setHost(Material_A2);
    }
    if (Material_A3) {
        Material_A3.setHost(Material_A21);
    }
    if (Material_A4) {
        Material_A4.setHost(Material_A3);
    }

    if (Material_A5) {
        Material_A5.setHost(Material_A4);
    }
    if (Material_A6) {
        Material_A6.setHost(Material_A5);
    }
    if (Material_A7) {
        Material_A7.setHost(Material_A6);
    }
    if (Material_A8) {
        Material_A8.setHost(Material_A7);
    }
    if (Material_A9) {
        Material_A9.setHost(Material_A7);
    }
    // setTimeout(function () {
    //     this.dm.enableAnimation();
    // }.bind(this),1000);
}

projectRobotModule.prototype.initMPL100gRotation=function(){
    let thisTemp=this;

    for (var modelOne in this.modelList){
        thisTemp.modelList[modelOne].setRotationZ(0);
        thisTemp.modelList[modelOne].setRotationY(0);
        thisTemp.modelList[modelOne].setRotationX(0);
    }
    thisTemp.modelList.Material_A1.setRotationY(Math.PI/2);
    thisTemp.modelList.Material_A4.setRotationZ(-Math.PI/2);
    thisTemp.modelList.Material_A6.setRotationX(-Math.PI/2);
}

export default new projectRobotModule()
