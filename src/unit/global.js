let myPlugin = {};
myPlugin.install = function(Vue,option){
    Vue.prototype.create3DView = function () {
        var g3d = new ht.graph3d.Graph3dView();
        g3d.form = this.createForm(g3d);
        g3d.setGridVisible(true);
        g3d.setOriginAxisVisible(true);
        g3d.setFar(60000);
        g3d.setEditable(true);
        g3d.json = '';

        g3d.dm().md(function(e) {// 属性变化时改变 json 内容
            g3d.json = g3d.dm().serialize();
        });

        g3d.mi(function(e) {// 鼠标事件处理
            if (e.kind === 'doubleClickData') {// 双击视线缓缓移向图元
                var p3 = e.data.p3();
                var r3 = e.data.r3();

                if (g3d.flyTo) g3d.flyTo(e.data, true);// 6.2.2 版本以上才有此方法
                else {
                    setEye(g3d, [p3[0]*(Math.PI/2 - Math.abs(r3[1])), 2.3*p3[1], 0.3*p3[2]]);
                    setCenter(g3d, p3);
                }
            }
            else if (e.kind === 'beginMove' || e.kind === 'betweenMove' ||
                e.kind === 'endMove' || e.kind === 'beginEditRotation' ||
                e.kind === 'betweenEditRotation' || e.kind === 'endEditRotation' ||
                e.kind === 'beginEditSize' || e.kind === 'betweenEditSize' || e.kind === 'endEditSize') {
                this.formValue(g3d, g3d.form);// 节点改变大小/旋转/移动的时候不断地刷新 form 表单
            }
        });

        g3d.sm().ms(function(e) {//选择模型变化时才触发的操作
            if (e.kind === 'set') {//代表此事件由setSelection(datas)引发
                this.formValue(g3d, g3d.form);
                g3d.form.getView().style.display = 'block';
            }
            else {
                g3d.form.getView().style.display = 'none';
            }

            g3d.json = g3d.dm().serialize();
        });
        return g3d;
    };
    Vue.prototype.createForm = function(g3d) { //创建属性面板
        var form = new ht.widget.FormPane();
        form.getView().style.top = '53px';
        form.getView().style.right = '5px';
        form.getView().style.background = 'rgba(255, 255, 255, 0.3)';
        form.getView().style.display = 'none';
        form.getView().style.borderRadius = '5px';
        form.setLabelColor('rgb(138, 138, 138)');
        form.setWidth(220);
        form.setHeight(270);
        document.body.appendChild(form.getView());

        form.addRow([{ element: '属性:', font: 'bold 12px arial, sans-serif' }], [0.1]);
        form.addRow([
            'Id:',
            {
                id: 'Id',
            }
        ], [0.1, 0.1]);
        form.addRow([
            '名称',
            {
                id: 'Name',
                textField: {}
            }
        ], [0.1, 0.22]);

        var array = [
            {property1: 'visible', value1: '可见', property2: 'editable', value2: '可编辑'},
            {property1: 'movable', value1: '可移动', property2: 'selectable', value2: '可选中'}
        ];
        //添加是否可编辑。是否可移动，是否可见
        array.forEach(function(d) {
            form.addRow([
                d.value1,
                {
                    id: d.property1,
                    checkBox: {
                        selected: true,
                        onValueChanged: function(){
                            if (g3d.sm().ld()) g3d.sm().ld().s('3d.'+d.property1, this.getValue());
                        }
                    }
                },
                d.value2,
                {
                    id: d.property2,
                    checkBox: {
                        selected: true,
                        onValueChanged: function(){
                            if (g3d.sm().ld()) g3d.sm().ld().s('3d.'+d.property2, this.getValue());
                        }
                    }
                }
            ], [0.2, 0.1, 0.2, 0.1]);
        });

        form.addRow('', [0.1]);

        array = [
            {property: 'Size', value: '大小'},
            {property: 'Position3d', value: '坐标'},
            {property: 'Rotation3d', value: '旋转'}
        ];
        array.forEach(function(p, index) {
            form.addRow([
                p.value,
                'X:',
                {
                    id: p.property+'.x',
                    textField: {}
                },
                'Y:',
                {
                    id: p.property+'.y',
                    textField: {}
                },
                'Z:',
                {
                    id: p.property+'.z',
                    textField: {}
                },
            ], [0.2, 0.1, 0.2, 0.1, 0.2, 0.1, 0.2]);
        });

        form.getView().addEventListener('keyup', function(e) {
            if (e.keyCode === 9) {
                var node = g3d.sm().ld();
                if (!node) return;

                node.setName(form.v('Name'));
                node.s3([parseInt(form.v('Size.x')), parseInt(form.v('Size.y')), parseInt(form.v('Size.z'))]);
                node.p3([parseInt(form.v('Position3d.x')), parseInt(form.v('Position3d.y')), parseInt(form.v('Position3d.z'))]);
                node.r3([parseFloat(form.v('Rotation3d.x')), parseFloat(form.v('Rotation3d.y')), parseFloat(form.v('Rotation3d.z'))]);
            }
        });
        document.body.addEventListener('mousedown', function(e) {
            var node = g3d.sm().ld();
            if(!node) return;

            node.setName(form.v('Name'));
            node.s3([parseInt(form.v('Size.x')), parseInt(form.v('Size.y')), parseInt(form.v('Size.z'))]);
            node.p3([parseInt(form.v('Position3d.x')), parseInt(form.v('Position3d.y')), parseInt(form.v('Position3d.z'))]);
            node.r3([parseFloat(form.v('Rotation3d.x')), parseFloat(form.v('Rotation3d.y')), parseFloat(form.v('Rotation3d.z'))]);
        });
        return form;
    };

    Vue.prototype.formValue = function(g3d, form) {
        var node = g3d.sm().ld();
        if (!node) return;

        form.v('Id', node.getId()+'');
        form.v('Name', node.getName());

        form.v('Size.x', (node.s3()[0].toFixed(0)));
        form.v('Size.y', (node.s3()[1].toFixed(0)));
        form.v('Size.z', (node.s3()[2].toFixed(0)));

        form.v('Position3d.x', (node.p3()[0].toFixed(0)));
        form.v('Position3d.y', (node.p3()[1].toFixed(0)));
        form.v('Position3d.z', (node.p3()[2].toFixed(0)));

        form.v('Rotation3d.x', (node.r3()[0].toFixed(2)));
        form.v('Rotation3d.y', (node.r3()[1].toFixed(2)));
        form.v('Rotation3d.z', (node.r3()[2].toFixed(2)));

        form.v('editable', node.s('3d.editable'));
        form.v('movable', node.s('3d.movable'));
        form.v('visible', node.s('3d.visible'));
        form.v('selectable', node.s('3d.selectable'));
    }

}
