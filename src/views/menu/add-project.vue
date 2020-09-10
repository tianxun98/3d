<template>
    <el-dialog
            width="50%"
            :title="title" :modal="false"
            :visible.sync="isShow" @close="close" :close-on-click-modal="false"
            append-to-body>
        <el-input type="text" size="small" v-model="projectValue" class="custom-input">
        </el-input>
        <span slot="footer" class="dialog-footer">
              <el-button type="primary" @click="confirm" size="small">确 定</el-button>
              <el-button @click="close" size="small">取 消</el-button>
            </span>
    </el-dialog>
</template>

<script>
    export default {
        name: "add-project",
        props:{
            title:{
                type:String,
                default:'添加工程'
            },
            type:{
                type:String,
                default:'project'
            },
            innerVisible:{
                type:Boolean,
                default:false
            },
            projectId:{
                type:Number,
                default:0
            },
            projectName:{
                type:String,
                default:''
            }
        },
        watch:{
            innerVisible(){
                console.log(this.projectName);
                if(this.type === 'update'){
                    this.projectValue = this.projectName;
                }else{
                    this.projectValue = "";
                }
                return this.isShow = this.innerVisible
            }
        },
        data(){
            return{
                projectValue:'',
                isShow:false,
                formInfo:{},
                url:'project_category',
                methods: 'post'
            }
        },
        methods:{
            confirm(){
                if(this.projectValue){
                    switch (this.type) {
                        case 'project':
                            this.formInfo = {
                                projectName:this.projectValue,
                                categoryId:this.projectId,
                                templateId:1,
                                palettemenuId:0,
                                usetemplate:-1,
                            };
                            this.url = 'project';
                            this.methods = 'post';
                            break;
                        case 'update':
                            this.formInfo = {
                                projectName:this.projectValue,
                                categoryId:this.projectId,
                                templateId:1,
                                palettemenuId:0,
                                usetemplate:-1,
                            };
                            this.url = 'project';
                            this.methods = 'put';
                            break;
                        case 'sort':
                            this.formInfo = {
                                categoryName:this.projectValue
                            };
                            this.url = 'project_category';
                            this.methods = 'post';
                            break;
                    }
                    this.$http[this.methods](this.url, this.formInfo).then(res=>{
                            if(res.code === 200){
                                this.type === 'sort'? this.$emit('initCategory'):this.$emit('initProject');
                                this.close();
                            }
                    })
                }
            },
            close(){
                this.$emit('close');
            }
        }
    }
</script>

<style scoped>

</style>
