<template>
    <div class="h-100">
        <el-header class="run-header">
            <el-input v-model="searchProject" size="small" placeholder="查询项目工程"
                      class="custom-input" @keyup.enter.native="init" clearable>
            </el-input>
            <el-button type="primary" size="small" @click="init">查询</el-button>
        </el-header>
        <el-row :gutter="15" class="layout">
            <el-col :span="8" v-for="(item,index) in projectData" :key="index" class="text-center">
                <img :src="item.imagePath" class="img"/>
                <p class="text-center">
                    {{item.projectName}}
                    <i class="el-icon-video-play run-ico" @click="handleRun(item)"></i>
                </p>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        name: "run-time",
        data() {
            return {
                projectData: [],
                searchProject: ''
            }
        },
        methods: {
            init() {
                this.$http.get('project', {condition: this.searchProject}).then(res => {
                    if (res.code === 200) {
                        this.projectData = res.data;
                    }
                });
            },
            handleRun(item) {
                const start = this.$router.resolve({name: '/run', query: {projectId: item.id}});
                setTimeout(() => {
                    window.open(start.href, '_blank');
                }, 500);
            }
        },
        mounted() {
            this.init();
        }
    }
</script>

<style scoped>
    .layout {
        background: #fff;
    }

    .run-header {
        background-color: #fff;
        padding: 10px 0 0;
        box-shadow: 0 3px 11px #a3a3a3;
        margin: 0 0 10px 0;
    }

    .img {
        width: 300px;
        height: 150px;
        margin: 10px 0 0;
    }

    .run-ico {
        font-size: 18px;
        vertical-align: text-bottom;
        cursor: pointer;
    }
</style>
