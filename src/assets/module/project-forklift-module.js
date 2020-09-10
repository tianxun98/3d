function projectForkliftModule() {
    this.mattersWaitToTransport=[];
    this.palletizinStackPosition3d;
    this.dataModel;
}
projectForkliftModule.prototype.palletizinStackRest=function(){
    let palletizinStack = this.dataModel.getDataByTag("码垛堆");
    palletizinStack.setHost(null);
    this.mattersWaitToTransport.forEach(m=>{
        m.setHost(null);

        // console.log(m);
    });
    this.mattersWaitToTransport=[];
    palletizinStack.p3(this.palletizinStackPosition3d);

    // console.log(this.mattersWaitToTransport);
}

projectForkliftModule.prototype.PushMatterToList=function(matter) {
    let thisTemp=this;
    if(!thisTemp.mattersWaitToTransport){
        thisTemp.mattersWaitToTransport=[];
    }
    thisTemp.mattersWaitToTransport.push(matter);
    let palletizinStack = thisTemp.dataModel.getDataByTag("码垛堆");
    matter.setHost(palletizinStack);
    thisTemp.palletizinStackPosition3d=palletizinStack.p3();
    if(thisTemp.mattersWaitToTransport.length>1){
        thisTemp.transportMatter(palletizinStack);
    }
}

projectForkliftModule.prototype.transportMatter=function(matter) {
    let thisTemp=this;
    setTimeout(function () {
        let frames=50;
        let Forklift = thisTemp.dataModel.getDataByTag("叉车");
        let forkliftP3=[1225, 0, -81];
        let materP3=[983, 22, -132];
        let perx=(materP3[0]-forkliftP3[0])/frames;
        let perz=((materP3[2]-forkliftP3[2])+20)/frames;

        Forklift.setAnimation(
            {
                goTurnLeft:{
                    from:0,
                    to:Math.PI/2,
                    frames:50,
                    onUpdate: function(value) {
                        Forklift.setRotationY(value);
                    },
                    next:"goGetPx"
                },

                goGetPx:{
                    frames:frames,
                    onUpdate: function(value) {
                        let forkliftP3Temp=Forklift.p3();
                        Forklift.p3([forkliftP3Temp[0]+perx,forkliftP3Temp[1],forkliftP3Temp[2]]);
                    },
                    next:"goTurnRight1"
                },
                goTurnRight1:{
                    from:Math.PI/2,
                    to:0,
                    frames:50,
                    onUpdate: function(value) {
                        Forklift.setRotationY(value);
                    },
                    next:"goGetPz"
                },
                goGetPz:{
                    frames:frames,
                    onUpdate: function(value) {
                        let forkliftP3Temp=Forklift.p3();
                        Forklift.p3([forkliftP3Temp[0],forkliftP3Temp[1],forkliftP3Temp[2]+perz]);
                    },
                    onComplete:function () {
                        let palletizinStack = thisTemp.dataModel.getDataByTag("码垛堆");
                        palletizinStack.setHost(Forklift);
                    },
                    next:"goTurnRight2"
                },
                goTurnRight2:{
                    from:0,
                    to:-Math.PI/2,
                    frames:50,
                    onUpdate: function(value) {
                        Forklift.setRotationY(value);
                    },
                    next:"goPx"
                },
                goPx:{
                    frames:frames,
                    onUpdate: function(value) {
                        let forkliftP3Temp=Forklift.p3();
                        Forklift.p3([forkliftP3Temp[0]-perx,forkliftP3Temp[1],forkliftP3Temp[2]]);
                    },
                    onComplete:function () {
                        matter.setHost(Forklift);
                    },
                    next:"goTurnLeft2"
                },
                goTurnLeft2:{
                    from:-Math.PI/2,
                    to:0,
                    frames:50,
                    onUpdate: function(value) {
                        Forklift.setRotationY(value);
                    },
                    next:"goToZ"
                },
                goToZ:{
                    frames:100,
                    onUpdate: function(value) {
                        let forkliftP3Temp=Forklift.p3();
                        Forklift.p3([forkliftP3Temp[0],forkliftP3Temp[1],forkliftP3Temp[2]-5]);
                    },
                    onComplete:function () {
                        thisTemp.palletizinStackRest();
                    },
                    next:"goTrunBack"
                },
                goTrunBack:{
                    from:0,
                    to:Math.PI ,
                    frames:50,
                    onUpdate: function(value) {
                        Forklift.setRotationY(value);
                    },
                    next:"backToZ"
                },
                backToZ:{
                    frames:100,
                    onUpdate: function(value) {
                        let forkliftP3Temp=Forklift.p3();
                        Forklift.p3([forkliftP3Temp[0],forkliftP3Temp[1],forkliftP3Temp[2]+6]);
                    },
                    onComplete:function(){
                        Forklift.p3(forkliftP3);
                    },
                    next:"TurnRest"
                },
                TurnRest:{
                    from:Math.PI,
                    to:0,
                    frames:50,
                    onUpdate: function(value) {
                        Forklift.setRotationY(value);
                    }
                },
                start:["goTurnLeft"]
            }
        );
    }, 1000);
}



export default new projectForkliftModule()
