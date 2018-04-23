/*
 * 在线人数统计
 */
function Statistics(data) {
    $(".statistics span").text(data.count);
}

/*
 * 初始化后获取好友列表
 */
function initok() {
    // 获取好友列表
    getFriendsList();
    // 获取群组列表
    getGroupsList();
}

/*
 * 所有弹出成功的回调函数
 */
function ok(data){
	layer.msg(data);
}

/*
 * 好友上线
 */
function friendOnLine(data) {

}

/*
 * 好友列表
 */
function getFriends(data) {
    var online=[];
    var offline=[];
    for(var i=0; i< data.length;i++){
        if(data[i].online==1){
            online.push(data[i]);
        }else{
            offline.push(data[i]);
        }
    }

	var all = online.concat(offline);
    for(var y=0; y<all.length; y++){
        var value = all[y];
    	var online = value.online==1?"online":"offline";
		$("#friend-list").append(
        	'<div class="friend-block" title="上次登录时间：'+value.last_login+'">'+
            	'<div class="status '+online+'"></div>'+
            	'<div class="info">'+
					'<div class="nackname">'+value.nickname+'</div>'+
					'<div class="number">'+value.number+'</div>'+
				'</div>'+
            '</div>'
		);
    }
}