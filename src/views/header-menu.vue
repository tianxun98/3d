<template>
    <div class="header-menu" ref="menu">
        <el-dialog :title="title" :visible.sync="dialogVisible" @close="close" width="70%">
            <main>
                <div v-if="edgeType === '修改场景'">
                    <el-input v-model="getJson" type="textarea" :autosize="{ minRows: 2, maxRows: 10}">
                    </el-input>
                </div>
                <div v-if="edgeType === '导入JSON'">
                    <el-upload
                            ref="upload" action
                            :accept="uploadAccept"
                            name="files"
                            :limit="1"
                            :auto-upload="false"
                    >
                        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                        <el-button
                                style="margin-left: 10px;"
                                size="small"
                                type="success"
                                @click="submitUpload"
                        >上传到服务器
                        </el-button>
                    </el-upload>
                </div>
            </main>
            <span slot="footer" class="dialog-footer">
                <el-button type="warning" @click="exportEdge" size="small" v-if="edgeType === '修改场景'">导出场景</el-button>
              <el-button type="primary" @click="confirm" size="small">确 定</el-button>
              <el-button @click="close" size="small">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "header-menu",
        props: {
            createTabView: {
                type: Function,
                default: () => {
                }
            }
        },
        data() {
            return {
                htObj:{
                    g3d:'',
                    newTab:''
                },
                title: '场景JSON',
                dialogVisible: false,
                getJson: '',
                edgeType: '场景',
                uploadAccept:'.json'
            }
        },
        methods: {
            createItems(g3d, newTab,) {
                this.htObj.g3d = g3d;
                this.htObj.newTab = newTab;
                let menu = new ht.widget.Menu();// 创建菜单组件
                let json = [
                    {
                        label: '菜单',
                        items: [
                            {
                                label: '新建图纸',
                                action: () => {
                                    this.$emit('createTabView');// 新建页签
                                }
                            },
                            {
                                label: '新建2',
                                action: () => {

                                }
                            }
                        ]
                    },
                    {
                        label: '场景',
                        items: [
                            {
                                label: '修改场景',
                                action: () => {
                                    this.getJson = newTab.getView().dm().serialize();
                                    this.edgeType = '修改场景';
                                    this.dialogVisible = true;
                                }
                            },
                            {
                                label: '清空场景',
                                action: () => {
                                    this.$confirm('确定清空场景?', '提示', {
                                        confirmButtonText: '确定',
                                        cancelButtonText: '取消',
                                        type: 'warning'
                                    }).then(() => {
                                        this.$message({
                                            type: 'success',
                                            message: '清空成功!'
                                        });
                                        newTab.getView().dm().clear();
                                    }).catch((e) => {
                                        console.log(e)
                                    })
                                }
                            },
                            {
                                label: '导入JSON',
                                action:  ()=> {
                                    this.edgeType = '导入JSON';
                                    this.title = '导入JSON';
                                    this.dialogVisible = true;
                                }
                            },
                        ]
                    },
                ];
                menu.setItems(json); // 设置菜单组件内容
                menu.enableGlobalKey();

                let items = [
                    {
                        element: menu
                    },
                    "separator",

                    {
                        label: '保存项目',
                        action: () => {

                        }
                    },
                ];
                return items;
            },
            confirm() {
                let fn = new Map([
                    ['修改场景', this.freshenJson],
                    ['导入JSON',this.submitUpload]
                ]);
                return fn.get(this.edgeType)()
            },
            submitUpload(){
                let formData = new FormData();
                let fileList = this.$refs.upload.uploadFiles[0];
                formData.append("file", fileList.raw);
                this.$http.post('attachment', formData, "/upload").then(res => {
                    if (res.code === 200 && res.data.attachmentList.length > 0) {
                        // try {
                        //     this.htObj.g3d.dm().deserialize(this.getJson);//反序列化数据容器
                        //     this.htObj.g3d.json = this.htObj.g3d.dm().serialize();//将这个导入的数据容器序列化 重置json内容
                        //     this.dialogVisible = false;
                        // } catch (e) {
                        //     console.log(e);
                        //     this.dialogVisible = false;
                        //     return false;
                        // }
                    }
                })

            },
            freshenJson(){
                if (typeof this.getJson === 'string') {
                    try {
                        if (this.htObj.g3d.sm().ld()) {
                            var node = this.htObj.g3d.sm().ld();
                        }
                        this.htObj.g3d.dm().clear();
                        this.htObj.g3d.dm().deserialize(this.getJson, '', true);// 反序列化数据容器
                        this.htObj.g3d.json = this.htObj.g3d.dm().serialize();// 将这个导入的数据容器序列化 重置json内容
                        if (node) this.htObj.g3d.sm().ss(this.htObj.g3d.dm().getDataById(node.getId()));
                        this.dialogVisible = false;
                    } catch (e) {
                        console.log(e);
                        return false;
                    }
                }
            },
            exportEdge(){

            },
            close() {
                this.dialogVisible = false;
            }
        },
        mounted() {

        }
    }
</script>

<style scoped>
    .set-el-dialog {
        height: 300px;
        overflow-y: auto;
    }
</style>
