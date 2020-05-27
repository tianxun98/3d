<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>
  export default {
      mounted(){
          let searchParams = this.getRequest();
          this.$store.dispatch("setParams", searchParams);
      },
      methods:{
          getRequest(){
              let url = location.search; //获取url中"?"符后的字串
              let theRequest = {};
              if (url.indexOf("?") !== -1) {
                  let str = url.substr(1);
                  let strs = str.split("&");
                  for (var i = 0; i < strs.length; i++) {
                      theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
                  }
              }
              return theRequest;
          },
      }
  }
</script>
<style lang="less">
html {
  height: 100%;
  font-size: 12px;
  font-family: "Helvetica Neue", "微软雅黑", Helvetica, Arial, sans-serif;
}
body {
  padding: 0;
  height: 100%;
  margin: 0;
  overflow: hidden;
}
::-webkit-scrollbar-track-piece {
  width: 5px;
  background-color: #fff;
}

::-webkit-scrollbar {
  width: 5px;
}

::-webkit-scrollbar-thumb {
  height: 50px;
  background: #1890ff;
  cursor: pointer;
}

::-webkit-scrollbar-thumb:hover {
  background: #1890ff;
  cursor: pointer;
}
</style>
