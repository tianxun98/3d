<template>
    <el-dialog :visible.sync="isShow" title="OPCUA地址管理" top="15px" :close-on-click-modal="false"
               width="50%" append-to-body @close="close">
        <p>
            <el-input type="text" size="small" placeholder="输入数据源地址" clearable
                      v-model="inputValue" class="custom-input">
            </el-input>
            <el-button  type="primary" size="small" @click="handleOption('add',{})">
                添加
            </el-button>
        </p>
        <el-table :data="tableData"
                  border
                  style="width: 100%">
            <el-table-column prop="sourceName" label="数据源地址">
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="primary"
                               size="small"
                               @click="handleOption('del',scope.row)">
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
              <el-button @click="close" size="small">关闭</el-button>
            </span>
    </el-dialog>
</template>

<script>
    export default {
        name: "source-option",
        props: {
            visible: {
                type: Boolean,
                default: false,
            },
        },
        watch: {
            visible() {
                if(this.visible){

                }
                return this.isShow = this.visible;
            }
        },
        data(){
            return{
                isShow:false,
                tableData:[
                    {sourceName:'www.baidu.com'}
                ],
                inputValue:''
            }
        },
        methods:{
            handleOption(type,row){
                switch (type) {
                    case 'add':
                        if(this.inputValue){

                        }else{
                            this.$message.warning('请输入opcua地址');
                            return
                        }
                        break;
                    case 'del':
                        this.$confirm('是否删除地址?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                        }).catch(() => {
                            this.$message({
                                type: 'info',
                                message: '已取消删除'
                            });
                        });
                        break;
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
