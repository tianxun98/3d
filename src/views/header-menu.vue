<template>
    <div class="header-menu">
        <el-menu :default-active="activeIndex" class="el-menu-demo"
                 mode="horizontal" @select="handleSelect">
            <el-submenu :index="item.id" v-for="item in menuList">
                <template slot="title">{{item.label}}</template>
                <template v-if="item.child">
                    <el-menu-item :index="i.id" v-for="i in item.child" :key="i.id">{{i.label}}</el-menu-item>
                </template>
            </el-submenu>
        </el-menu>

        <el-dialog :title="edgeType" :visible.sync="dialogVisible"  @close="close" class="set-zindex"
                   width="70%">
            <main>
                <div v-if="edgeType === '修改场景'">
                    <el-input v-model="getJson" type="textarea" :autosize="{ minRows: 2, maxRows: 10}">
                    </el-input>
                </div>
                <div v-if="edgeType === '导入场景'">
                    <el-upload
                            ref="import" action
                            :accept="uploadAccept"
                            name="files"
                            :limit="1"
                            :auto-upload="false"
                    >
                        <el-button slot="trigger" size="small" type="primary">选取JSON文件</el-button>
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
                    <el-select v-model="shapeId" style="margin:0 10px 10px 0"
                               placeholder="选择组里面添加图元" size="small">
                        <el-option v-for="item in options"
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
                <project v-if="edgeType === '新建工程' || edgeType === '打开工程'" :types="edgeType">
                </project>
            </main>
            <span slot="footer" class="dialog-footer">
              <el-button type="primary" @click="confirm" size="small">确 定</el-button>
              <el-button @click="close" size="small">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import project from "./menu/project";
    import { mapState } from 'vuex'
    export default {
        name: "header-menu",
        components: {project},
        computed:mapState({
            projectInfo:state=>state.getProjectInfo
        }),
        props: {
            createTabView: {
                type: Function,
                default: () => {}
            }
        },
        data() {
            return {
                activeIndex: 'createProject',
                menuList: [
                    {
                        id: '1', label: '工程', child: [
                            {id: 'createProject', label: '新建工程'},
                            {id: 'openProject', label: '打开工程'},
                        ]
                    },
                    {
                        id: '2', label: '场景', child: [
                            {id: 'updateScene', label: '修改场景'},
                            {id: 'clearScene', label: '清空场景'},
                            {id: 'importScene', label: '导入场景'},
                        ]
                    },
                    {id: '3', label: '图元', child: [{id: 'addGraph', label: '添加图元'}]},
                    {
                        id: '4', label: '操作', child: [
                            {id: 'save', label: '保存'},
                            {id: 'start', label: '运行'},
                        ]
                    },
                ],
                shapeId: '',
                options: [
                    {label: '基础图元', value: '0'},
                    {label: '展示设施', value: '1'},
                    {label: '机柜相关', value: '2'},
                    {label: '桌椅储物', value: '3'},
                    {label: '温度控制', value: '4'},
                    {label: '室内', value: '5'},
                    {label: '视频监控', value: '6'},
                    {label: '其他', value: '7'},
                ],
                htObj: {
                    g3d: '',
                    newTab: ''
                },
                dialogVisible: false,
                getJson: '',
                edgeType: '场景',
                uploadAccept: '.json',
                uploadPixel: '.json,.obj,.mtl,.png',
                actions: null
            }
        },
        methods: {
            createItems(g3d, newTab) {
                this.htObj.g3d = g3d;
                this.htObj.newTab = newTab;
            },
            confirm() {
                let fn = new Map([
                    ['修改场景', this.freshenJson],
                    ['导入场景', this.submitUpload],
                    ['添加图元', this.addPixel],
                    ['新建工程', this.createProject],
                    ['打开工程', this.createProject],
                ]);
                return fn.get(this.edgeType)()
            },
            submitUpload() {
                let formData = new FormData();
                let fileList = this.$refs['import'].uploadFiles[0];
                formData.append("file", fileList.raw);
                this.$http.post('attachment', formData, "/upload").then(res => {
                    if (res.code === 200 && res.data.attachmentList.length > 0) {
                    }
                })
            },
            addPixel() {
                let fileList = this.$refs['addPixel'].uploadFiles;
                let formData = new FormData();
                if (fileList.length > 0) {
                    fileList.forEach(file => {
                        formData.append("files", file.raw);
                    });
                }
                formData.append("resourceClass", this.shapeId);
                let addName = "";
                this.options.forEach(item => {
                    if (item.value === this.shapeId) {
                        return addName = item.label
                    }
                });
                let menu = {
                    menucode: this.shapeId,
                    menuname: addName,
                    menutype: 0,
                    parentid: 0,
                    systemtype: 0,
                };
                this.$http.post('upload', formData).then(res => {
                    if (res.code === 200) {
                        let message = res.message;
                        this.$http.post('addMenu', menu).then(res => {
                            this.$store.state.isChange = true;
                            this.$message.success(message);
                            setTimeout(() => {
                                this.close();
                            }, 1000);
                        })
                    }
                })
            },
            freshenJson() {
                if (typeof this.getJson === 'string') {
                    let currentTab = this.htObj.newTab.getView();
                    let dm = currentTab.dm();
                    try {
                        if (currentTab.sm().ld()) {
                            var node = currentTab.sm().ld();
                        }
                        dm.clear();
                        dm.deserialize(this.getJson, '', true);// 反序列化数据容器
                        currentTab.json = currentTab.dm().serialize();// 将这个导入的数据容器序列化 重置json内容
                        if (node) currentTab.sm().ss(dm.getDataById(node.getId()));
                        this.dialogVisible = false;
                    } catch (e) {
                        console.log(e);
                        return false;
                    }
                }
            },
            createProject() {
                if(this.projectInfo.projectName) {
                    if(this.edgeType === '新建工程'){
                        this.$emit('createTabView',this.projectInfo.projectName,this.projectInfo)
                    }else{
                        this.$emit('createTabView',this.projectInfo.projectName,this.projectInfo,this.projectInfo.content)
                    }
                }
                this.dialogVisible = false;
            },
            handleSelect(key, keyPath) {
                return this.actions.has(key) && this.actions.get(key)()
            },
            initMenu() {
                this.actions = new Map([
                    ['createProject',()=>{
                        this.edgeType = '新建工程';
                        this.dialogVisible = true;
                    }],
                    ['openProject', () => {
                        this.edgeType = '打开工程';
                        this.dialogVisible = true;
                    }],
                    ['updateScene', () => {
                        this.getJson = this.htObj.newTab.getView().dm().serialize();
                        this.edgeType = '修改场景';
                        this.dialogVisible = true;
                    }],
                    ['clearScene', () => {
                        this.$confirm('确定清空场景?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.$message({
                                type: 'success',
                                message: '清空成功!'
                            });
                            this.htObj.newTab.getView().dm().clear();
                            this.$emit('clearHistory');
                        }).catch((e) => {
                            console.log(e)
                        })
                    }],
                    ['importScene', () => {
                        this.edgeType = '导入场景';
                        this.dialogVisible = true;
                    }],
                    ['addGraph', () => {
                        this.edgeType = '添加图元';
                        this.dialogVisible = true;
                    }],
                    ['start',()=>{
                        if(this.htObj.newTab){
                            let info = this.htObj.newTab.getView().sceneInfo;
                            this.actions.get('save')();
                            const start = this.$router.resolve({name: '/run',query:{projectId:info.id}});
                            setTimeout(()=>{
                                window.open(start.href,'_blank');
                            },500);
                        }else{
                            this.$message.error('请新建或者打开工程');
                            return false;
                        }

                    }],
                    ['save',()=>{
                    let newTabInfo = this.htObj.newTab.getView();
                        // console.log(newTabInfo.toDataURL('rgb(0,0,0,0)'));
                    let projectInfo = newTabInfo.sceneInfo;
                        projectInfo.content = newTabInfo.dm().serialize();
                        projectInfo.history = JSON.stringify(newTabInfo.history);
                        projectInfo.imageInfo = newTabInfo.toDataURL('rgb(0,0,0,0)');
                        this.$http.put('project',projectInfo).then(res=>{
                        if(res.code === 200){
                            this.$message({
                                message: res.message,
                                type: 'success'
                            });
                        }
                    });
                    }],
                ]);
                return this.actions
            },

            close() {
                this.dialogVisible = false;
            }
        },
        mounted() {
            this.initMenu();
        }
    }
</script>

<style lang="less">
    .v-modal{
        z-index: 10 !important;
    }
    .header-menu {
        position: relative;
        z-index: 99;
    }

    .el-menu--horizontal > .el-submenu .el-submenu__title {
        height: 50px !important;
        line-height: 55px !important;
    }
</style>
