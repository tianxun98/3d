<template>
    <el-dialog :title="title" :visible.sync="isShow"  @close="close"  :close-on-click-modal="false"
               width="70%">
        <codemirror v-if="type !=='jump'"
                ref="mycode"
                :value="curCode"
                :options="cmOptions"
                @input="onCmCodeChange"
                class="code">
        </codemirror>
        <main class="flex" v-if="type ==='jump'">
            <div class="left-main">
                <el-tree class="custom-tree custom-tree-bg"
                         :data="categoryData" highlight-current
                         node-key="id"
                         default-expand-all  :props="categoryProps" @node-click="initProject"
                         :expand-on-click-node="false">
                    <span class="custom-tree-node" slot-scope="{ node, data }"  >
                        <span>{{ node.label }}</span>
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
                        <span>{{ node.label }}</span>
                  </span>
                </el-tree>
            </div>
        </main>
             <span slot="footer" class="dialog-footer">
              <el-button type="primary" @click="confirm" size="small">确 定</el-button>
              <el-button @click="close" size="small">取 消</el-button>
            </span>
    </el-dialog>
</template>

<script>
    import { codemirror } from 'vue-codemirror'
    import "codemirror/theme/ambiance.css";  // 这里引入的是主题样式，根据设置的theme的主题引入，一定要引入！！
    require("codemirror/mode/javascript/javascript"); // 这里引入的模式的js，根据设置的mode引入，一定要引入！！
    export default {
        name: "custom-pop",
        components:{
            codemirror
        },
        props:{
            isDialog:false,
            title:{
                type:String,
                default:'自定义脚本'
            },
            type:{
                type:String,
                default:'custom'
            },
            modalData:{
                type:Object,
                default:{}
            }
        },
        watch:{
            isDialog(){
                if(this.isDialog){
                    this.initCategory();
                    let typeValue = this.modalData.sm().ld().s(this.type);
                    if(this.type === 'jump'){
                        this.currentKey = typeValue?typeValue:1;
                    }else{
                        this.curCode = typeValue?typeValue:'';
                    }
                }
                return this.isShow = this.isDialog
            }
        },
        data(){
            return{
                isShow:false,
                currentKey:1,
                categoryData: [],
                projectData:[],
                categoryProps:{
                    label:'categoryName',
                    id:'id'
                },
                projectProps:{
                    label:'projectName',
                    id:'projectId'
                },
                curCode: '',
                cmOptions: {
                    tabSize: 4,
                    mode: 'text/javascript',
                    theme: 'base16-dark',
                    lineNumbers: true,
                    line: true,
                    // more codemirror options, 更多 codemirror 的高级配置...
                }
            }
        },
        methods:{
            confirm(){
                if(this.type === 'jump'){
                    this.modalData.sm().ld().s(this.type,this.currentKey);
                }else{
                    this.modalData.sm().ld().s(this.type, this.curCode);
                }
                this.close();
            },
            handleProjectName(node){
                this.currentKey = node.id;
            },
            initProject(data){
                this.$http.get('getProject',{categoryId: data.id }).then(res=>{
                    if(res.code === 200){
                        this.projectData = (res.data);
                    }
                })
            },
            initCategory(){
                this.$http.get('project_category',{condition:''}).then(res=>{
                    if(res.code === 200){
                        this.categoryData = res.data;
                    }
                })
            },
            onCmCodeChange(newCode) {
                this.curCode = newCode;
            },
            close(){
                this.$emit('close');
            }
        }
    }
</script>

<style lang="less">
.code{
    border: 1px solid #eee;
}
</style>
