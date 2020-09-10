<template>
    <div>
        <header class="add-sort-header"  v-if="types === '新建工程'">
            <el-button size="small" type="primary" @click="append('sort')">添加分类</el-button>
            <el-input type="text" v-model="searchSort" placeholder="搜索工程分类" clearable
                      @keyup.enter.native="initCategory" class="custom-input" size="small">
            </el-input>
        </header>
        <main class="flex">
            <div class="left-main">
                <el-tree class="custom-tree custom-tree-bg"
                         :data="categoryData" highlight-current
                         node-key="id"
                         default-expand-all  :props="categoryProps" @node-click="handleTree"
                         :expand-on-click-node="false">
                    <span class="custom-tree-node" slot-scope="{ node, data }"  >
                        <span>{{ node.label }}</span>
                        <span v-if="types === '新建工程'">
                        <el-button
                                type="text"
                                size="mini"
                                @click="() => append('project',data)">
                        添加工程
                      </el-button>
                    </span>
                  </span>
                </el-tree>
            </div>
            <div class="right-main">
                <el-tree class="custom-tree"
                         :data="projectData" highlight-current
                         node-key="id"  :props="projectProps"
                         default-expand-all @node-click="handleProjectName"
                         :expand-on-click-node="false">
                    <span class="custom-tree-node" slot-scope="{ node, data }"  >
                        <span class="">{{ node.label }}</span>
                        <span v-if="types === '新建工程'">
                        <el-button
                                type="text"
                                size="mini"
                                @click="() => append('update',data)">
                        修改
                        </el-button>
                    </span>
                  </span>
                </el-tree>
            </div>
        </main>
    <add-project :inner-visible="innerVisible" :type="type" v-if="types === '新建工程'"
                 :projectId="projectId" :projectName="projectName" :title="title"
                 @close="innerVisible = false"  @initProject="initProject" @initCategory="initCategory">
    </add-project>
    </div>

</template>

<script>
    import addProject from "./add-project"
    export default {
        name: "project",
        props:{
            types:{
                type:String,
                default:'新建工程'
            }
        },
        components:{
            addProject
        },
        data() {
            return {
                innerVisible:false,
                searchSort: '',
                title:'添加工程',
                projectId:0,
                projectName:'',
                type:'project',
                categoryData: [],
                projectData:[],
                categoryProps:{
                    label:'categoryName',
                    id:'id'
                },
                projectProps:{
                    label:'projectName',
                    id:'projectId'
                }
            }
        },
        methods: {
            append(type,data = {}) {
                this.type = type;
                this.projectId = data.id;
                switch (type) {
                    case 'project':
                        this.title = '添加工程';
                        break;
                    case 'sort':
                        this.title = '添加分类';
                        break;
                    case 'update':
                        this.title = '修改工程';
                        this.projectName = data.projectName;
                        break;
                }
                this.innerVisible = true;
            },
            handleTree(data,node){
                this.initProject(data.id);
            },
            handleProjectName(data){
                this.$store.state.getProjectInfo = data;
            },
            initProject(id = this.projectId){
                this.$http.get('getProject',{categoryId: id }).then(res=>{
                    if(res.code === 200){
                        this.projectData = (res.data);
                    }
                })
            },
            initCategory(){
                this.$http.get('project_category',{condition:this.searchSort}).then(res=>{
                        if(res.code === 200){
                          this.categoryData = res.data;
                        }
                })
            }
        },
        mounted(){
            this.initCategory()
        }
    }
</script>

<style scoped lang="less">
    .add-sort-header {
             /*border-bottom: 1px solid #eee;*/
             padding-bottom: 10px;
         }

    .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 12px;
        padding: 8px;
    }
</style>
