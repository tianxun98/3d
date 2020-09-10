
const api = process.env.VUE_APP_API;
const interfaces = {
    upload:api + '/resource/upload',
    getList:api + '/resource/list',
    addMenu:api + '/addPaletteMenu',
    project_category:api + '/v1/projectCategory',
    project:api + '/v1/project',
    getProject:api + '/v1/projectShortInfosByCategoryId',
    dataSource:api + '/v1/dataSource',
    rootSource:api + '/v1/RootNodeInfo',
    nodeSource:api + '/v1/NodeInfos',
    tagInfo:api + '/v1/tagBinding'
};
export default interfaces;
