function projectUpDownModule() {
    this.module={
        obj: `assets/objs/project/升降机.obj`,
        mtl: `assets/objs/project/升降机.mtl`,
        name: `升降机`,
        p3: [0,0,0]
    };
    this.mainNode=undefined;
    this.dataModel=undefined;
    this.scale=20;
    this.UpDoneCallback=undefined;
}

projectUpDownModule.prototype.Create=function (dataModel,p3) {
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
            r3: [0,-Math.PI*1 / 2, 0],
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
                 thisTemp.setHost();
                //  thisTemp.setAnimation();
                // for (var name in modelMap) {
                //      thisTemp.setRobotAnchor3d(name);
                // }
                // thisTemp.initMPL100gRotation();
            }
        });
    }


}
projectUpDownModule.prototype.setHost=function(){
    let main = this.dataModel.getDataByTag(225);
    let m1 =this.dataModel.getDataByTag(999);
    let m2 =this.dataModel.getDataByTag(8813);
    if(m1){
        m1.setHost(main);
    }
    if(m2){
        m2.setHost(main);
    }

}

projectUpDownModule.prototype.setMatterToMainPosition=function(matter){
    let main = this.dataModel.getDataByTag(225);
    let thisTemp=this;
    let p3Main=main.p3();
    let perX=(p3Main[0]-matter.p3()[0])/60;
    if(matter){
    matter.setAnimation(
        {
            move: {
                frames: 60,
                onUpdate: function (value) {
                    let temp = matter.p3();
                    let x = temp[0] +perX;
                    let y= temp[1] ;
                    let z= temp[2] ;
                    matter.p3(x,y,z);
                },
                onComplete:function(){
                        setTimeout(()=>{
                            thisTemp.setAnimation(matter);
                        },10);
                }
            },
            start:["move"]
        });
        matter.resumeAnimation();
    }
}

projectUpDownModule.prototype.setAnimation=function(matter){

    let main = this.dataModel.getDataByTag(225);
    let thisTemp=this;
    let p3Main=main.p3();
    if(matter){
        matter.p3(p3Main[0],p3Main[1]+10,p3Main[2]);
        matter.setHost(main);
    }
    main.setAnimation(
        {
            up: {
                frames: 120,
                onUpdate: function (value) {
                    let temp = main.p3()[1];
                    temp = temp + 1;
                    main.p3(main.p3()[0],temp,main.p3()[2]);
                },
                onComplete:function(){
                  
                        setTimeout(()=>{
                            thisTemp.setMatterAnimation(matter);
                        },10);
                },
                next:"down"
            },
            down: {
                frames: 120,
                delay:100,
                onUpdate: function (value) {
                    let temp = main.p3()[1];
                    temp = temp - 1;
                    main.p3(main.p3()[0],temp,main.p3()[2]);
                },
            },
            start:["up"]
        });

}
projectUpDownModule.prototype.setMatterAnimation=function(matter){
    let thisTemp=this;
    if(matter){
        matter.setHost(null);
        let matterP3=matter.p3();
        let y=matterP3[1];
        let z=-40;
        
    matter.setAnimation(
        {
            move: {
                frames: 120,
                onUpdate: function (value) {
                    let temp = matter.p3();
                    let x = temp[0] + 2;
                    let y= temp[1] ;
                    let z= temp[2] ;
                    matter.p3(x,y,z);
                },
                onComplete:function(){
                    if(thisTemp.UpDoneCallback){
                        setTimeout(()=>{
                            matter.setAnchor3d(0.5,0.5,0.5);
                            matter.p3(1150, y,z);
                            thisTemp.UpDoneCallback(matter);
                        },10);
                    }
                }
            },
            start:["move"]
        });
    }
}


export default new projectUpDownModule()
