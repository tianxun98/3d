<template>
    <el-dialog :visible.sync="innerVisible" title="选择测点" top="15px"
               width="70%" append-to-body @close="close">
        <section class="main-content">
            <main class="left-main">
                <header class="header">
                    <el-select v-model="dataSource" filterable clearable @change="changeRoot"
                               placeholder="请选择数据源" size="small">
                        <el-option
                                v-for="item in sourceList"
                                :key="item.id"
                                :label="item.url"
                                :value="item.id">
                        </el-option>
                    </el-select>
                    <el-button type="success" size="small" @click="sourceVisible = true"
                               style="margin-left: 10px">配置数据源</el-button>
                </header>
                <section class="main-height">
                    <el-tree
                            node-key="id" highlight-current
                            :data="orgData" show-checkbox   :props="orgProps"
                            :load="loadNode" @check="handleTable"
                            lazy
                            ref="tree">
                    </el-tree>
                </section>

            </main>
            <main class="right-main">
                <header class="header">
                    <el-input v-model="searchValue" placeholder="查询测点"  style="width: 300px;margin-right: 10px"
                              size="small" clearable @keyup.enter.native="searchTag">
                    </el-input>
                    <el-button type="warning" @click="searchTag" size="small">查询</el-button>
                </header>
                <el-table :data="tableData" height="250"
                          border   highlight-current-row
                          @current-change="handleCurrentChange"
                          style="width: 100%">
                    <el-table-column prop="nodeId" label="测点代码">
                    </el-table-column>
                    <el-table-column prop="nodeName" label="测点名称">
                    </el-table-column>
                </el-table>
            </main>
        </section>
        <source-option :visible="sourceVisible" @close="sourceVisible = false"></source-option>
        <span slot="footer" class="dialog-footer">
              <el-button type="primary" @click="confirm" size="small">确 定</el-button>
              <el-button @click="close" size="small">取 消</el-button>
            </span>
    </el-dialog>
</template>

<script>
    import sourceOption from "./source-option"
    export default {
        name: "select-tag",
        props: {
            visible: {
                type: Boolean,
                default: false,
            },
        },
        components:{
            sourceOption
        },
        watch: {
            visible() {
                if(this.visible){
                    this.initSource();
                    // this.orgData = [];
                    // this.tableData = [];
                }
                return this.innerVisible = this.visible;
            }
        },
        data() {
            return {
                dataSource: '',
                searchValue: '',
                sourceList: [],
                innerVisible:false,
                orgData: [],
                orgProps:{
                    label:'nodeName',
                    id:'nodeId'
                },
                tableData: [],
                sourceVisible:false,
                tagInfo:{},
                sendId:''
            }
        },

        methods: {
            changeRoot(value){
                this.sendId = value;
                this.sourceList.filter(item=>{
                    if(item.id === value){
                        this.tagInfo.opcuaServerUrl = item.url;
                    }
                });
                this.$http.get('rootSource',{opcuaUrl: this.tagInfo.opcuaServerUrl}).then(res=>{
                    if(res.code === 200){
                        this.orgData = Array.isArray(res.data)?res.data:[res.data];
                        return this.orgData
                    }
                })
            },
            loadNode(node, resolve){
                if (node.level > 0){
                    let nodeList = {
                        opcuaUrl:this.tagInfo.opcuaServerUrl,
                        nodeName:node.data.nodeName,
                        nodeId: node.data.nodeId,
                        nodeClass: node.data.nodeClass,
                        deviceCode:''
                    };
                    this.$http.get('nodeSource',nodeList).then(res=>{
                        if(res.code === 200){
                             resolve(res.data?res.data:[]);
                        }
                    })
                }
            },
            handleCurrentChange(val){
                this.tagInfo = val;
            },
            handleTable(){
                this.tableData = this.$refs.tree.getCheckedNodes();
                this.tableData.filter(item=>{
                    if(item.nodeClass === '"Variable"'){
                        return item
                    }
                });
            },
            confirm() {
                this.tagInfo.id = this.sendId;
                this.$emit('getTagInfo', this.tagInfo);
                this.close();
            },
            searchTag(value){
            },
            initSource(){
                this.$http.get('dataSource').then(res=>{
                    if(res.code === 200){
                       this.sourceList = res.data;
                        this.tagInfo.opcuaServerUrl = this.sourceList[1].id;
                    }
                })
            },
            close() {
                this.$emit('hide');
            }
        }
    }
</script>

<style scoped lang="less">
    .main-height {
        height: 250px;
        overflow-y: auto;
    }
</style>
