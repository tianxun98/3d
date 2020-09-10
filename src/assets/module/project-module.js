const moduleList = [
    {
        obj: `assets/objs/project/上料机-静态.obj`,
        mtl: `assets/objs/project/上料机-静态.mtl`,
        name: `上料机-静态`,
        p3: [-1200, 0, -79]
    },
    {
        obj: `assets/objs/project/整体围栏.obj`,
        mtl: `assets/objs/project/整体围栏.mtl`,
        name: `整体围栏`,
        p3: [-22, 0, -6]
    },
    {
        obj: `assets/objs/project/上料机-上下移动.obj`,
        mtl: `assets/objs/project/上料机-上下移动.mtl`,
        name: `上料机-上下移动`,
        p3: [-1218, 50, -12]
    },
    {
        obj: `assets/objs/project/上料机-左右平移.obj`,
        mtl: `assets/objs/project/上料机-左右平移.mtl`,
        name: `上料机-左右平移`,
        p3: [-1223, 59, -22]
    },
    {
        obj: `assets/objs/project/大冲床.obj`,
        mtl: `assets/objs/project/大冲床.mtl`,
        name: `大冲床-静态`,
        p3: [-917, 0, -33]
    },
    {
        obj: `assets/objs/project/报警灯.obj`,
        mtl: `assets/objs/project/报警灯.mtl`,
        name: `报警灯`,
        p3: [-805, 325, 69]
    },
    {
        obj: `assets/objs/project/报警灯.obj`,
        mtl: `assets/objs/project/报警灯.mtl`,
        name: `报警灯1`,
        p3: [-583, 219, 69]
    },
    {
        obj: `assets/objs/project/报警灯.obj`,
        mtl: `assets/objs/project/报警灯.mtl`,
        name: `报警灯2`,
        p3: [-323, 219, 69]
    },
    {
        obj: `assets/objs/project/报警灯.obj`,
        mtl: `assets/objs/project/报警灯.mtl`,
        name: `报警灯3`,
        p3: [-63, 219, 69]
    },
    {
        obj: `assets/objs/project/大冲床-动态.obj`,
        mtl: `assets/objs/project/大冲床-动态.mtl`,
        name: `大冲床-动态`,
        p3: [-917, 86, -37]
    },

    {
        obj: `assets/objs/project/2号-400T.obj`,
        mtl: `assets/objs/project/2号-400T.mtl`,
        name: `冲床01`,
        p3: [-657, 0, -68]
    },
    {
        obj: `assets/objs/project/小冲床-动.obj`,
        mtl: `assets/objs/project/小冲床-动.mtl`,
        name: `冲床动-1`,
        p3: [-657, 110, -20]
    },
    {
        obj: `assets/objs/project/3号-300T.obj`,
        mtl: `assets/objs/project/3号-300T.mtl`,
        name: `冲床02`,
        p3: [-397, 0, -68]
    },
    {
        obj: `assets/objs/project/小冲床-动.obj`,
        mtl: `assets/objs/project/小冲床-动.mtl`,
        name: `冲床动-2`,
        p3: [-397, 110, -20]
    },
    {
        obj: `assets/objs/project/4号-300T.obj`,
        mtl: `assets/objs/project/4号-300T.mtl`,
        name: `冲床03`,
        p3: [-137, 0, -68]
    },
    {
        obj: `assets/objs/project/小冲床-动.obj`,
        mtl: `assets/objs/project/小冲床-动.mtl`,
        name: `冲床动-3`,
        p3: [-137, 110, -20]
    },
    {
        obj: `assets/objs/project/铆接线-贴字.obj`,
        mtl: `assets/objs/project/铆接线-贴字.mtl`,
        name: `铆接线-贴字`,
        p3: [333, 0, -36]
    },
    {
        obj: `assets/objs/project/小车.obj`,
        mtl: `assets/objs/project/小车.mtl`,
        name: `小车`,
        p3: [-36, 10, -39]
    },
    {
        obj: `assets/objs/project/整体夹具.obj`,
        mtl: `assets/objs/project/整体夹具.mtl`,
        name: `tag`,
        p3: [355, 110, -36]
    },
    {
        obj: `assets/objs/project/抓手.obj`,
        mtl: `assets/objs/project/抓手.mtl`,
        name: `tagOther`,
        p3: [19, 110, -37]
    },
    {
        obj: `assets/objs/project/输送带-底座.obj`,
        mtl: `assets/objs/project/输送带-底座.mtl`,
        name: `输送带-底座`,
        p3: [705, 0, -59]
    },
    {
        obj: `assets/objs/project/输送带-上下动.obj`,
        mtl: `assets/objs/project/输送带-上下动.mtl`,
        name: `输送带-上下动`,
        p3: [705, 56, -42]
    },
    {
        obj: `assets/objs/project/移栽机-底座.obj`,
        mtl: `assets/objs/project/移栽机-底座.mtl`,
        name: `移栽机底座1`,
        p3: [-1035,0,-18]
    },
    {
        obj: `assets/objs/project/移栽机-上下.obj`,
        mtl: `assets/objs/project/移栽机-上下.mtl`,
        name: `移栽机-上下1`,
        p3: [-1035,79,-15]
    },
    {
        obj: `assets/objs/project/移栽机-平移杆.obj`,
        mtl: `assets/objs/project/移栽机-平移杆.mtl`,
        name: `移栽机-平移杆1`,
        p3: [-1033,70,-20]
    },
    {
        obj: `assets/objs/project/移栽机-夹具.obj`,
        mtl: `assets/objs/project/移栽机-夹具.mtl`,
        name: `移栽机-夹具左1`,
        p3: [-1096,61,-16]
    },
    {
        obj: `assets/objs/project/移栽机-夹具.obj`,
        mtl: `assets/objs/project/移栽机-夹具.mtl`,
        name: `移栽机-夹具右1`,
        p3: [-968,61,-16]
    },
    {
        obj: `assets/objs/project/移栽机-底座.obj`,
        mtl: `assets/objs/project/移栽机-底座.mtl`,
        name: `移栽机底座2`,
        p3: [-785,0,-18]
    },
    {
        obj: `assets/objs/project/移栽机-上下.obj`,
        mtl: `assets/objs/project/移栽机-上下.mtl`,
        name: `移栽机-上下2`,
        p3: [-785,79,-15]
    },
    {
        obj: `assets/objs/project/移栽机-平移杆.obj`,
        mtl: `assets/objs/project/移栽机-平移杆.mtl`,
        name: `移栽机-平移杆2`,
        p3: [-783,70,-20]
    },
    {
        obj: `assets/objs/project/移栽机-夹具.obj`,
        mtl: `assets/objs/project/移栽机-夹具.mtl`,
        name: `移栽机-夹具左2`,
        p3: [-846,61,-16]
    },
    {
        obj: `assets/objs/project/移栽机-夹具.obj`,
        mtl: `assets/objs/project/移栽机-夹具.mtl`,
        name: `移栽机-夹具右2`,
        p3: [-718,61,-16]
    },
    {
        obj: `assets/objs/project/移栽机-底座.obj`,
        mtl: `assets/objs/project/移栽机-底座.mtl`,
        name: `移栽机底座3`,
        p3: [-535,0,-18]
    },
    {
        obj: `assets/objs/project/移栽机-上下.obj`,
        mtl: `assets/objs/project/移栽机-上下.mtl`,
        name: `移栽机-上下3`,
        p3: [-535,79,-15]
    },
    {
        obj: `assets/objs/project/移栽机-平移杆.obj`,
        mtl: `assets/objs/project/移栽机-平移杆.mtl`,
        name: `移栽机-平移杆3`,
        p3: [-533,70,-20]
    },
    {
        obj: `assets/objs/project/移栽机-夹具.obj`,
        mtl: `assets/objs/project/移栽机-夹具.mtl`,
        name: `移栽机-夹具左3`,
        p3: [-596,61,-16]
    },
    {
        obj: `assets/objs/project/移栽机-夹具.obj`,
        mtl: `assets/objs/project/移栽机-夹具.mtl`,
        name: `移栽机-夹具右3`,
        p3: [-468,61,-16]
    },
    {
        obj: `assets/objs/project/移栽机-底座.obj`,
        mtl: `assets/objs/project/移栽机-底座.mtl`,
        name: `移栽机底座4`,
        p3: [-280,0,-18]
    },
    {
        obj: `assets/objs/project/移栽机-上下.obj`,
        mtl: `assets/objs/project/移栽机-上下.mtl`,
        name: `移栽机-上下4`,
        p3: [-280,79,-15]
    },
    {
        obj: `assets/objs/project/移栽机-平移杆.obj`,
        mtl: `assets/objs/project/移栽机-平移杆.mtl`,
        name: `移栽机-平移杆4`,
        p3: [-278,70,-20]
    },
    {
        obj: `assets/objs/project/移栽机-夹具.obj`,
        mtl: `assets/objs/project/移栽机-夹具.mtl`,
        name: `移栽机-夹具左4`,
        p3: [-341,61,-16]
    },
    {
        obj: `assets/objs/project/移栽机-夹具.obj`,
        mtl: `assets/objs/project/移栽机-夹具.mtl`,
        name: `移栽机-夹具右4`,
        p3: [-213,61,-16]
    },
    {
        obj: `assets/objs/project/小移栽机-横梁.obj`,
        mtl: `assets/objs/project/小移栽机-横梁.mtl`,
        name: `小移栽机-横梁`,
        p3: [-88,70,-22]
    },
    {
        obj: `assets/objs/project/小移栽机-上下.obj`,
        mtl: `assets/objs/project/小移栽机-上下.mtl`,
        name: `小移栽机-上下`,
        p3: [-71,85,-32]
    },
    {
        obj: `assets/objs/project/小移栽机-夹具.obj`,
        mtl: `assets/objs/project/小移栽机-夹具.mtl`,
        name: `小移栽机-夹具`,
        p3: [-81,80,-32]
    },
    {
        obj: `assets/objs/project/小移栽机-杆子.obj`,
        mtl: `assets/objs/project/小移栽机-杆子.mtl`,
        name: `小移栽机-杆子`,
        p3: [-50,88,-32]
    },

];
export default moduleList
