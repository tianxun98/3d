<template>
    <div class="header-menu" ref="menu">
        <el-dialog :title="edgeType" :visible.sync="dialogVisible" @close="close" width="70%">
            <main>
                <div v-if="edgeType === '修改场景'">
                    <el-input v-model="getJson" type="textarea" :autosize="{ minRows: 2, maxRows: 10}">
                    </el-input>
                </div>
                <div v-if="edgeType === '导入JSON'">
                    <el-upload
                            ref="import" action
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
                <div v-if="edgeType === '添加图元'">
                    <el-select v-model="$store.state.addPalette.getValue" style="margin:0 10px 10px 0"
                               placeholder="选择组里面添加图元" size="small">
                        <el-option  v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"></el-option>
                    </el-select>
                    <el-upload
                            ref="addPixel" action
                            :accept="uploadPixel"
                            name="files"
                            multiple
                            :auto-upload="false"
                    >
                        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                        <el-button
                                style="margin-left: 10px;"
                                size="small"
                                type="success"
                                @click="addPixel"
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
                options:[
                    {label:'基础图元',value:0},
                    {label:'展示设施',value:1},
                    {label:'机柜相关',value:2},
                    {label:'桌椅储物',value:3},
                    {label:'温度控制',value:4},
                    {label:'室内',value:5},
                    {label:'视频监控',value:6},
                    {label:'其他',value:7},
                ],
                htObj:{
                    g3d:'',
                    newTab:''
                },
                dialogVisible: false,
                getJson: '',
                edgeType: '场景',
                uploadAccept:'.json',
                uploadPixel:'.json,.obj,.mtl,.png'
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
                        label: '添加图元',
                        action: () => {
                            this.edgeType = '添加图元';
                            this.dialogVisible = true;
                        }
                    },
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
                    ['导入JSON',this.submitUpload],
                    ['添加图元',this.addPixel],
                ]);
                return fn.get(this.edgeType)()
            },
            submitUpload(){
                let formData = new FormData();
                let fileList = this.$refs['import'].uploadFiles[0];
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
            addPixel(){
                let fileList = this.$refs['addPixel'].uploadFiles;
                let formData = new FormData();
                if (fileList.length > 0) {
                    fileList.forEach(file => {
                        formData.append("files", file.raw);
                    });
                }
                let addClass = this.$store.state.addPalette.getValue;
                formData.append("addClass", addClass);
                this.$http.post('upload', formData,'/' + addClass).then(res => {
                    if (res.code === 200 ) {
                        this.$store.state.isChange = true;
                        this.$message.success(res.message);
                        setTimeout(()=>{
                            this.close();
                        },500);

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
</style>
