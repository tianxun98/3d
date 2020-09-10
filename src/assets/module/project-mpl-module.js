function projectMplModule() {
    this.module={
        obj: `assets/objs/project/MPL100.obj`,
            mtl: `assets/objs/project/MPL100.mtl`,
            name: `MPL100`,
            p3: [0,0,0]
    };
    this.mainNode=undefined;
    this.dataModel=undefined;
    this.scale=22;
    this.sendObjCompleteCallBack;
}

projectMplModule.prototype.Create=function (dataModel,p3) {
    this.dataModel=dataModel;
    if (this.module) {
        let thisTemp = this;
        var pRight = [p3[0], 1275 / thisTemp.scale, p3[2]];
        var scaleFactor = 1;

        ht.Default.loadObj(this.module.obj, this.module.mtl, {
            cube: true,
            center: true,
            part: true,
            shape3d: module.name,//string
            anchor3d: [0, 0, 0],
            r3: [-Math.PI / 2, 0, 0],
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
                    //不加载连杆
                    if (name === "Material_8" || name === "Material_7") {
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
                    // node.setName(name);
                    node.setTag(name);
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
                    thisTemp.setMPL100Anmation(name);
                }
                thisTemp.initMPL100gRotation();
            }
        });
    }
}

projectMplModule.prototype.MPL100ToGetObj=function(matter) {
    let thisTemp=this;
    setTimeout(function () {
        thisTemp.setMPL100ToPosition(0, -1.8,0.5, 60, thisTemp.MPL100SetObjPosition.bind(thisTemp),matter);
    }, 1000);
}

projectMplModule.prototype.MPL100SetObjPosition=function(matter) {
    let thisTemp=this;
    if(matter) {
        let Material_12 = thisTemp.dataModel.getDataByTag("Material_12");
        matter.setHost(Material_12);
    }
    setTimeout(function () {
        thisTemp.setMPL100ToPosition(0,2.3,-1.5,120,thisTemp.MPL100ToInitPosition.bind(thisTemp),matter);
    }, 1000);
}

projectMplModule.prototype.MPL100ToInitPosition=function(matter) {
    let thisTemp=this;
    setTimeout(function () {
        thisTemp.setMPL100ToPosition(0,-0.5,1,120,thisTemp.initMPL100gRotation.bind(thisTemp));
    }, 1000);
    if(matter) {
        matter.setHost(null);
        if(thisTemp.sendObjCompleteCallBack){
            thisTemp.sendObjCompleteCallBack(matter);
        }
    }
}

projectMplModule.prototype.setMPL100ToPosition=function(xOffset,yOffset,zOffset,frames,CompleteCallBack,callbaclParam){
    let xPer=xOffset/frames;
    let yPer=yOffset/frames;
    let zPer=zOffset/frames;


    let thisTemp=this;
    let Material_1= thisTemp.dataModel.getDataByTag("Material_1");
    let Material_5= thisTemp.dataModel.getDataByTag("Material_5");
    let Material_10=thisTemp.dataModel.getDataByTag("Material_10");
    let Material_11=thisTemp.dataModel.getDataByTag("Material_11");
    let Material_12= thisTemp.dataModel.getDataByTag("Material_12");
    let Material_1Init=Material_1.getRotation3d();
    let Material_5Init=Material_5.getRotation3d();
    let Material_10Init=Material_10.getRotation3d();
    let Material_11Init=Material_11.getRotation3d();
    let Material_12Init=Material_12.getRotation3d();
    thisTemp.mainNode.setAnimation(
        {
            xOffset: {
                frames:frames,
                onUpdate: function(value) {
                    let m12rz=Material_12.getRotationZ();
                    m12rz=m12rz+xPer;
                    Material_12.setRotationZ(m12rz);
                },
                onComplete:function () {
                     Material_12.setRotationZ(Material_12Init[2]+xOffset);
                }
            },
            yOffset:{
                frames:frames,
                onUpdate: function(value) {
                    let ry=Material_1.getRotationY();
                    ry=ry+yPer;
                    Material_1.setRotationY(ry);
                },
                onComplete:function () {
                    Material_1.setRotationY(Material_1Init[1]+yOffset);
                }
            },
            zOffset:{
                frames:frames,
                onUpdate: function(value) {

                    let m5rz=Material_5.getRotationZ();
                    m5rz=m5rz+zPer;
                    Material_5.setRotationZ(m5rz);


                    let m10rz=Material_10.getRotationZ();
                    m10rz=m10rz-zPer;
                    Material_10.setRotationZ(m10rz);

                    let m11rz=Material_11.getRotationZ();
                    m11rz=m11rz+zPer;
                    Material_11.setRotationZ(m11rz);

                    // let rz=this.getRotationZ();
                    // rz=rz-0.002;
                    // this.setRotationZ(rz);
                },
                onComplete:function () {

                    Material_5.setRotationZ(Material_5Init[2]+zOffset);
                    Material_11.setRotationZ(Material_11Init[2]+zOffset);
                    if(CompleteCallBack){
                        CompleteCallBack(callbaclParam);
                    }
                }
            },
            start:["xOffset","yOffset","zOffset"]
        }
    );
}

projectMplModule.prototype.setMPL100Anmation=function(nodeName){
    let node=this.dataModel.getDataByTag(nodeName);
    let thisTemp=this;
    let z;
    let y;
    let x;
    switch (nodeName) {
        case "Material_1":
            node.setAnchor3d(0.5,0.5,0.5);
            break;
        case "Material_11":
            node.setAnchor3d(0.8,0.07,0.5);
            z=node.p3()[2];
            y=node.p3()[1]-600/ thisTemp.scale;
            x=node.p3()[0]+100/ thisTemp.scale;
            node.p3(x,y,z);
            break;
        case "Material_10":
            node.setAnchor3d(0.25,0.2,0.5);
            z=node.p3()[2];
            y=node.p3()[1]+500/ thisTemp.scale;
            x=node.p3()[0]-500/ thisTemp.scale;
            node.p3(x,y,z);
            // node.setAnimation(this.getMaterial10Anmation());
            break;
        case "Material_6":
            node.setAnchor3d(0.5,0.1,0.5);
            z=node.p3()[2];
            y=node.p3()[1]+450/ thisTemp.scale;
            x=node.p3()[0];
            node.p3(x,y,z);
            // node.setAnimation(this.getMaterial6Anmation());
            break;
        // case "Material_7":
        //     node.setAnchor3d(0.95,0.5,0.5);
        //     z=node.p3()[2];
        //     y=node.p3()[1]+140;
        //     x=node.p3()[0]+880;
        //     node.p3(x,y,z);
        //     node.setAnimation(this.getMaterial7Anmation());
        //     break;
        // case "Material_8":
        //     node.setAnchor3d(0.5,0.05,0.5);
        //     z=node.p3()[2];
        //     y=node.p3()[1]-600;
        //     x=node.p3()[0];
        //     node.p3(x,y,z);
        //     node.setAnimation(this.getMaterial5Anmation());
        //     break;
        case "Material_5":
            node.setAnchor3d(0.5,0.1,0.5);
            z=node.p3()[2];
            y=node.p3()[1]-600/ thisTemp.scale;
            x=node.p3()[0];
            node.p3(x,y,z);
            // node.setAnimation(this.getMaterial5Anmation());
            break;

        case "Material_12":
            node.setAnchor3d(0.15,0.3,0.5);
            z=node.p3()[2]
            y=node.p3()[1]-50/ thisTemp.scale;
            x=node.p3()[0]+250/ thisTemp.scale;
            node.p3(x,y,z);
            // node.setAnimation(this.getMaterial12Anmation());
            break;
        case "Material_13":
            z=node.p3()[2]
            y=node.p3()[1];
            x=node.p3()[0]+200/ thisTemp.scale;
            node.p3(x,y,z);
            break;
        case "Material_14":
            z=node.p3()[2]
            y=node.p3()[1]+200/ thisTemp.scale;
            x=node.p3()[0]+200/ thisTemp.scale;
            node.p3(x,y,z);
            break;
    }
}

projectMplModule.prototype.setMPL100Host=function(){
    // Material_10,Material_5互相吸附
    let Material_0= this.dataModel.getDataByTag("Material_0");
    let Material_1= this.dataModel.getDataByTag("Material_1");
    let Material_2= this.dataModel.getDataByTag("Material_2");
    let Material_3= this.dataModel.getDataByTag("Material_3");
    let Material_4= this.dataModel.getDataByTag("Material_4");
    let Material_5= this.dataModel.getDataByTag("Material_5");
    let Material_6= this.dataModel.getDataByTag("Material_6");
    let Material_7= this.dataModel.getDataByTag("Material_7");
    let Material_8= this.dataModel.getDataByTag("Material_8");
    let Material_9= this.dataModel.getDataByTag("Material_9");
    let Material_10= this.dataModel.getDataByTag("Material_10");
    let Material_11= this.dataModel.getDataByTag("Material_11");
    let Material_12= this.dataModel.getDataByTag("Material_12");
    let Material_13= this.dataModel.getDataByTag("Material_13");
    let Material_14=this.dataModel.getDataByTag("Material_14");
    // Material_5.setHost(Material_10);

    Material_11.setHost(Material_9);
    // Material_7.setHost(Material_12);
    Material_12.setHost(Material_10);
    Material_13.setHost(Material_12);
    Material_14.setHost(Material_12);
    Material_6.setHost(Material_5);
    // Material_8.setHost(Material_1);
    Material_10.setHost(Material_5);


    Material_1.setHost(Material_0);

    Material_2.setHost(Material_1);
    Material_4.setHost(Material_1);
    Material_3.setHost(Material_1);
    Material_5.setHost(Material_1);
    Material_9.setHost(Material_1);
    Material_11.setHost(Material_1);

    // setTimeout(function () {
    //     this.dm.enableAnimation();
    // }.bind(this),1000);
}

projectMplModule.prototype.initMPL100gRotation=function(){
    let Material_1= this.dataModel.getDataByTag("Material_1");
    Material_1.setRotationY(0);
    let Material_5= this.dataModel.getDataByTag("Material_5");
    Material_5.setRotationZ(0);
    let Material_6= this.dataModel.getDataByTag("Material_6");
    Material_6.setRotationZ(0);
    // let Material_7= this. g3d.dm().getDataByTag("Material_7");
    // Material_7.setRotationZ(0);
    let Material_10= this.dataModel.getDataByTag("Material_10");
    Material_10.setRotationZ(0);
    let Material_12= this.dataModel.getDataByTag("Material_12");
    Material_12.setRotationZ(0);
}

export default new projectMplModule()
