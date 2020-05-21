<template>
  <div id="app">
    <router-view/>
  </div>
</template>

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
