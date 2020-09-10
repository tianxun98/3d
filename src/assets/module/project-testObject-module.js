function projectTestObectModule() {
    this.module={
        obj: `assets/objs/project/洗衣机物料-折弯.obj`,
        mtl: `assets/objs/project/洗衣机物料-折弯.mtl`,
        name: `洗衣机物料折弯`,
        p3: [800, 0, -50]
    };
    this.mainNode=undefined;
    this.dataModel=undefined;
    this.scale=20;
}

projectTestObectModule.prototype.Create=function (dataModel,p3,completeCallBack) {
    this.dataModel=dataModel;
    let thisTemp=this;

    if (this.module) {
        let thisTemp = this;
        var pRight = [p3[0], p3[1] / thisTemp.scale, p3[2]];
        var scaleFactor = 1;
        let node = new ht.Node();
        ht.Default.loadObj(thisTemp.module.obj, thisTemp.module.mtl, {
            cube: true,
            center: true,
            shape3d: thisTemp.module.name,//string
            finishFunc: (modelMap, array, rawS3) => {
                if (modelMap) {
                    node.s({
                        'shape3d':thisTemp.module.name,
                        'label': '',
                        "shape3d.opacity": 1,
                    });
                    node.setName(thisTemp.module.name);
                    node.setTag(thisTemp.module.name);
                    node.s3(rawS3[0] / 20, rawS3[1] / 20, rawS3[2] / 20);
                    node.p3(thisTemp.module.p3);
                    node.setAnchorElevation(0);
                    // setTimeout(()=>{
                    //     animations(g3d.dm(),node,projectMplModule.MPL100ToGetObj.bind(projectMplModule));
                    // },2000);
                    thisTemp.dataModel.add(node);
                    return node;
                }
            }
        });
        thisTemp.mainNode=node;
                thisTemp.setAnimation(completeCallBack);
                // for (var name in modelMap) {
                //      thisTemp.setRobotAnchor3d(name);
                // }
                // thisTemp.initMPL100gRotation();
            }
        
        }
 
 
projectTestObectModule.prototype.setAnimation=function(completeCallBack){
    let main = this.dataModel.getDataByTag(225);
    let thisTemp=this;
    setTimeout(()=>{
        completeCallBack(thisTemp.mainNode);
    },2000);

}

export default new projectTestObectModule()
