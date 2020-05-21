let newPalette;
export function initPalette(palette) {// 加载palette面板组件中的图元
    newPalette = palette;
    var arrNode = ['basic', 'displayDevice', 'cabinetRelative', 'deskChair', 'temperature', 'indoors', 'monitor','others'];
    var nameArr = ['基础图元', '展示设施', '机柜相关', '桌椅储物', '温度控制', '室内', '视频监控', '其他'];// arrNode中的index与nameArr中的一一对应
    let maps = new Map([
        [0,['models/basic/墙面.png', 'models/basic/折角墙面.png']],
        [1,['models/机房/展示设施/台式电脑.png', 'models/机房/展示设施/大屏.png']],
        [2,['models/机房/机柜相关/配电箱.png', 'models/机房/机柜相关/室外天线.png', 'models/机房/机柜相关/机柜1.png', 'models/机房/机柜相关/机柜2.png', 'models/机房/机柜相关/机柜3.png', 'models/机房/机柜相关/机柜4.png', 'models/机房/机柜相关/电池柜.png']],
        [3,['models/机房/桌椅储物/储物柜.png', 'models/机房/桌椅储物/桌子.png', 'models/机房/桌椅储物/椅子.png']],
        [4,['models/机房/温度控制/空调精简.png', 'models/机房/消防设施/消防设备.png', 'models/机械/空调外机立式.png']],
        [5,['models/室内/办公桌简易.png', 'models/室内/书.png', 'models/室内/办公桌镜像.png', 'models/室内/办公椅.png']],
        [6,['models/机房/视频监控/摄像头方.png', 'models/机房/视频监控/对讲维护摄像头.png', 'models/机房/视频监控/微型摄像头.png']],
        [7,['models/其他/信号塔.png']],
    ]);
    for (var i = 0; i < arrNode.length; i++) {
        var name = nameArr[i];

        arrNode[i] = new ht.Group();// palette面板是将图元都分在“组”里面，然后向“组”中添加图元即可
        palette.dm().add(arrNode[i]);// 向palette面板组件中添加group图元
        arrNode[i].setExpanded(true);// 设置分组为打开的状态
        arrNode[i].setName(name);// 设置组的名字
        setPalNode(maps.get(i), arrNode[i]);
    }
}

function setPalNode(imageArr, arr) {// 创建palette上节点及设置名称、显示图片、父子关系
    for (var j = 0; j < imageArr.length; j++) {
        var imageName = imageArr[j];
        var jsonUrl = imageName.slice(0, imageName.lastIndexOf('.')) + '.json';// shape3d中的 json 路径
        var name = imageName.slice(imageName.lastIndexOf('/')+1, imageName.lastIndexOf('.')); // 取最后一个/和.之间的字符串用来设置节点名称
        var url = imageName.slice(imageName.indexOf('/')+1, imageName.lastIndexOf('.'));// 取第一个/和最后一个.之间的字符串用来设置拖拽生成模型obj文件的路径

        createNode(name, imageName, arr, url, jsonUrl);// 创建节点，这个节点是显示在palette面板上
    }
}
function createNode(name, image, parent, urlName, jsonUrl) {// 创建palette面板组件上的节点
    var node = new ht.Node();
    newPalette.dm().add(node);
    node.setName(name);
    node.setImage(image);
    node.setParent(parent);
    node.s({
        'draggable': true,
        'image.stretch': 'centerUniform',
        'label': ''
    });
    node.a('urlName', urlName);
    node.a('jsonUrl', jsonUrl);
    return node;
}
