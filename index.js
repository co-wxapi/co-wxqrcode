'use strict';
var WxBase = require('co-wxbase');

class WxQRCode extends WxBase {
  constructor(config){
    super(config);
  }

  *getTicket(sceneId, data, expire, accessToken) {
    if (!accessToken) accessToken = yield this.provider.getAccessToken();
    var params = {};
    if ( expire ) params.action_name = 'QR_SCENE';
    else if ( typeof (sceneId) == 'string' ){
      params.action_name = 'QR_LIMIT_STR_SCENE';
      params.scene_str = sceneId;
    }
    else {
      params.action_name = 'QR_LIMIT_SCENE';
      params.scene_id = sceneId;
    }
    params.action_info = data;
    var url = `https://api.weixin.qq.com/cgi-bin/qrcode/create?access_token=${accessToken}`;
    var result = this.jsonRequest(url, 'POST', params);
    return result;
  }

  *getQRCode(ticket) {
    var url = `https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=${ticket}`;
    var data = yield this.rawRequest(url, 'GET', null, {encoding: null});
    return data;
  }
};

module.exports = function(config){
  var api = new WxQRCode(config);
  return api;
}
