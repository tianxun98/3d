function formPanel(g3d, form, vue) {
    this.g3d = g3d;
    this.form = form;
    this.vue = vue;
}

formPanel.prototype.addBtn = function (label = '', type = '', ...opt) {
    let btnOption = {};

    switch (type) {
        case 'jump':
            btnOption = {
                label: '单击跳转',
                onClicked: () => {
                    this.vue.type = 'jump';
                    this.vue.isDialog = true;
                    this.vue.title = '单击跳转';
                }
            };
            break;
        case 'custom':
            btnOption = {
                label: '自定义脚本',
                onClicked: () => {
                    this.vue.isDialog = true;
                    this.vue.title = '自定义脚本';
                    this.vue.type = 'custom';
                }
            };
            break;
        case 'init':
            btnOption = {
                label: '初始化',
                onClicked: () => {
                    this.vue.isDialog = true;
                    this.vue.title = '初始化';
                    this.vue.type = 'init';
                }
            };
            break;
        case 'visible':
            btnOption = {
                label: '可见性',
                onClicked: () => {
                    this.vue.getIds = +(this.form.v('Id'));
                    this.vue.isBind = true;
                    this.vue.title = '绑定可见性';
                    this.vue.type = '3d.visible';
                }
            };
            break;
        case 'position':
            btnOption = {
                label: '位置',
                onClicked: () => {
                    this.vue.getIds = +(this.form.v('Id'));
                    this.vue.isBind = true;
                    this.vue.title = '绑定位置';
                    this.vue.type = '3d.position';
                }
            };
            break;
        case 'ficker':
            btnOption = {
                label: '闪烁',
                onClicked: () => {
                    this.vue.getIds = +(this.form.v('Id'));
                    this.vue.isBind = true;
                    this.vue.title = '绑定闪烁';
                    this.vue.type = '3d.ficker';
                }
            };
            break;
        case 'text':
            btnOption = {
                label: '文本',
                onClicked: () => {
                    this.vue.getIds = +(this.form.v('Id'));
                    this.vue.isBind = true;
                    this.vue.title = '绑定文本';
                    this.vue.type = '3d.text';
                }
            };
            break;
        default:
            break;
    }

    this.form.addRow([label,
        {
            id: this.vue.type,
            button: btnOption ? btnOption : ''
        },
    ], [0.1, 0.22]);
};
formPanel.prototype.addOpacity = function () {
    let input = document.createElement('input');
    input.className = 'default-input';
    input.id = 'opacity';
    let selectModal = this.g3d.sm();
    input.addEventListener('keyup', function (e) {
        let ld = selectModal.ld();
        ld.s('shape3d.opacity', parseFloat(this.value))
    });
    let elements = {
        element: input, // 文字内容
        id: 'opacity'
    };
    this.form.addRow([
        '透明度',
        elements,
        '动作',
        {
            id: 'action',
            checkBox: {
                selected: false,
                onValueChanged: function () {
                    let ld = selectModal.ld();
                    ld.s('3d.action', this.getValue());
                }
            }
        },
    ], [0.2, 0.1, 0.1, 72]);
};
export default formPanel
