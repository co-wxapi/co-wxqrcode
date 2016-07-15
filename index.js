'use strict';
var WxBase = require('co-wxbase');

class WxQRCode extends WxBase {
  constructor(config){
    super(config);
  }

  *getTicket(sceneId, expire, accessToken) {
    if (!accessToken) accessToken = yield this.provider.getAccessToken();
    var params = {action_info:{scene:{}}};
    if ( expire ) {
      params.action_name = 'QR_SCENE';
      params.expire_seconds = expire;
      params.action_info.scene.scene_id = sceneId;
    }
    else if ( typeof (sceneId) == 'string' ){
      params.action_name = 'QR_LIMIT_STR_SCENE';
      params.action_info.scene.scene_str = sceneId;
    }
    else {
      params.action_name = 'QR_LIMIT_SCENE';
      params.action_info.scene.scene_id = sceneId;
    }
    var url = `https://api.weixin.qq.com/cgi-bin/qrcode/create?access_token=${accessToken}`;
    var result = yield this.jsonRequest(url, 'POST', params);
    return result;
  }

  *getQRCode(ticket) {
    var url = `https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=${ticket}`;
    var data = yield this.rawRequest(url, 'GET', null, {encoding: null, withHeaders:true});
    return data;
  }

  *getShortUrl(longUrl, accessToken){
    if (!accessToken) accessToken = yield this.provider.getAccessToken();
    var url = `https://api.weixin.qq.com/cgi-bin/shorturl?access_token=${accessToken}`;
    var params = {
      access_token: accessToken,
      action: 'long2short',
      long_url: longUrl
    }
    console.log('shorturl', params);
    var result = yield this.jsonRequest(url, 'POST', params);
    return result;
  }
};

module.exports = function(config){
  var api = new WxQRCode(config);
  return api;
}
