
const api = process.env.VUE_APP_API;
const interfaces = {
    upload:api + '/resource/upload',
    getList:api + '/resource/list'
};
export default interfaces;
