import Vue from 'vue';
let that = new Vue();
//g3d为画布元素
export function createItems(g3d, newTab,createTabView) {
    var menu = new ht.widget.Menu();// 创建菜单组件
    var json = [
        {
            label: '新建',
            items: [
                {
                    label: '新建图纸',
                    action: function() {
                        createTabView();// 新建页签
                    }
                },
                {
                    label: '新建2',
                    action: function() {
                        createTabView();// 新建页签
                    }
                }
            ]
        },
    ];
    menu.setItems(json); // 设置菜单组件内容
    menu.enableGlobalKey();

    var items = [
        {
            element: menu
        },
        "separator",
        {
            label: '场景 JSON',
            action: function() {
                if (dialog) return;

                var dialog = createDialog('场景 JSON');
                var content = dialog.getConfig().content;
                content.innerHTML = newTab.getView().dm().serialize();
                content.disabled = true;
                var btns = dialog.getConfig().buttons;
                btns.push({
                    label: '编辑',
                    action: function() {
                        content.disabled = false;

                        btns[1].disabled = false;
                        btns[0].label = '取消';
                        btns[0].action = function() {
                            dialog.hide();
                        }
                        dialog.setConfig(dialog.getConfig());
                    }
                });
                btns.push({
                    label: '提交',
                    disabled: true,
                    action: function() {
                        var str = dialog.getConfig().content.value;
                        if (typeof str === 'string') {
                            try {
                                if (g3d.sm().ld()) var node = g3d.sm().ld();

                                g3d.dm().clear();
                                g3d.dm().deserialize(dialog.getConfig().content.value, '', true);// 反序列化数据容器
                                g3d.json = g3d.dm().serialize();// 将这个导入的数据容器序列化 重置json内容

                                if (node) g3d.sm().ss(g3d.dm().getDataById(node.getId()));

                                dialog.hide();
                            }catch(e) {
                                console.log(e);
                                return;
                            }
                        }
                    }
                });
                dialog.setConfig(dialog.getConfig());
            }
        },
        {
            label: '清空场景',
            action: ()=> {
                that.$confirm('确定清空场景?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    that.$message({
                        type: 'success',
                        message: '清空成功!'
                    });
                    newTab.getView().dm().clear();
                }).catch(()=>{

                })
            }
        },
        {
            label: '导入 JSON',
            action: function() {
                if (dialog) return;

                var dialog = createDialog('导入 JSON');
                var btns = dialog.getConfig().buttons;
                btns.push({
                    label: '保存',
                    action: function(btn, event) {
                        var str = dialog.getConfig().content.value;
                        if (typeof str === 'string') {
                            try {
                                g3d.dm().deserialize(dialog.getConfig().content.value);//反序列化数据容器
                                g3d.json = g3d.dm().serialize();//将这个导入的数据容器序列化 重置json内容
                                dialog.hide();
                            }catch(e) {
                                console.log(e);
                                dialog.hide();
                                return;
                            }
                        }
                    }
                });
                dialog.setConfig(dialog.getConfig());
            }
        }
    ];
    return items;
}

function createDialog(title) {
    var dialog = new ht.widget.Dialog();
    dialog.setConfig({
        title: title,
        content: document.createElement('textarea'),
        width: 360,
        height: 400,
        closable: true,
        buttons: []
    });
    dialog.show();
    return dialog;
}
