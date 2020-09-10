<template>
    <el-dialog :title="title" :visible.sync="isShow"  @close="close"
               top="15px"   width="70%">
        <el-form ref="form" :model="formInfo" label-width="120px">
            <el-form-item label="属性名">
                {{formInfo.attrName}}
            </el-form-item>
            <el-form-item label="测点信息">
                <span  class="tag-length">
                    {{formInfo.tagInfo}}
                    <i class="el-icon-close set-ico" @click="clearTag"></i>
                </span>
                <el-button type="primary" @click="innerVisible = true" size="small">
                    选择测点
                </el-button>
            </el-form-item>
        </el-form>
        <codemirror
                    ref="mycode"
                    :value="editCode"
                    :options="cmOptions"
                    @input="onCmCodeChange"
                    class="code">
        </codemirror>

        <span slot="footer" class="dialog-footer">
              <el-button type="primary" @click="confirm" size="small">确 定</el-button>
              <el-button @click="close" size="small">取 消</el-button>
            </span>
        <select-tag :visible="innerVisible" @hide="innerVisible=false" @getTagInfo="getTagInfo">
        </select-tag>
    </el-dialog>
</template>

<script>
    import selectTag from "./select-tag"
    import { codemirror } from 'vue-codemirror'
    import "codemirror/theme/ambiance.css";  // 这里引入的是主题样式，根据设置的theme的主题引入，一定要引入！！
    require("codemirror/mode/javascript/javascript"); // 这里引入的模式的js，根据设置的mode引入，一定要引入！！
    export default {
        name: "bind-pop",
        components:{
            codemirror,
            selectTag
        },
        props:{
            isDialog:false,
            title:{
                type:String,
                default:'绑定测点'
            },
            type:{
                type:String,
                default:'3d.visible'
            },
            modalData:{
                type:Object,
                default:{}
            },
            getId:{
                type:Number,
                default:0
            },
            currentLd:{
                type:Object,
                default:{}
            }
        },
        watch:{
            isDialog(){
                if(this.isDialog){
                    this.addTagInfo = {};
                    this.addTagInfo.projectName = this.modalData.sceneInfo.projectName;
                    this.addTagInfo.projectId = this.modalData.sceneInfo.id;
                    this.addTagInfo.propertyName = this.type;
                    this.addTagInfo.objectId = this.getId;
                    this.formInfo.attrName = this.type;
                    this.getBindTag();
                }
                return this.isShow = this.isDialog
            }
        },
        data(){
            return{
                isShow:false,
                formInfo:{
                    attrName:'',
                    tagInfo:''
                },
                editCode: '',
                cmOptions: {
                    tabSize: 3,
                    mode: 'text/javascript',
                    theme: 'base16-dark',
                    lineNumbers: true,
                    line: true,
                },
                addTagInfo:{},
                innerVisible:false
            }
        },
        methods:{
            clearTag(){
                this.formInfo.tagInfo = "";
                this.currentLd.s('setTag',false);
            },
            confirm(){
                this.$http.post('tagInfo',this.addTagInfo).then(res=>{
                    if(res.code === 200){
                        if(this.formInfo.tagInfo){
                            this.currentLd.s('setTag',true);
                            this.currentLd.s('getId',this.getId);
                        }
                        this.$message.success(res.message);
                        this.close();
                    }
                });
            },
            getTagInfo(info){
                this.formInfo.tagInfo = `[${info.nodeId}}]`;
                this.addTagInfo.tagId = `{"id":${info.id},"tags":["${info.nodeId}"]}`;
                this.addTagInfo.url = info.opcuaServerUrl;
            },
            getBindTag(){
                this.$http.get('tagInfo', this.addTagInfo).then(res=>{
                   if(res.code === 200 && res.data){
                       let info = res.data;
                       this.addTagInfo.tagId = this.formInfo.tagInfo =info.tagId;
                       this.addTagInfo.id = info.id;
                       this.editCode = info.func?info.func:'';
                   }else{
                       this.addTagInfo.tagId = this.formInfo.tagInfo = "";
                       this.addTagInfo.id = '';
                       this.editCode = '';
                       this.currentLd.s('setTag',false);
                   }
                })
            },
            onCmCodeChange(newCode) {
                this.addTagInfo.func = newCode;
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
    .set-ico{
        font-size: 16px;
        margin-top: 12px;
        position: absolute;
        right: 1px;
        cursor: pointer;
        transition: all 0.3s;
        opacity: 0;
    }
    .tag-length:hover{
        .set-ico{
            opacity: 1;
        }
    }
</style>
