var token = JSON.parse(sessionStorage.getItem('token'));
if(token==undefined){
    location.href = loginUrl;
}

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
    var number = data.number;
    var res = $(".friend-block[number$='"+number+"']");
    // 替换在线状态，去掉上次登陆时间属性
	// 移动到列表最开始
	res.find(".status").removeClass("offline");
	res.find(".status").addClass("online");
	res.attr("title",'');
	var thisHtml = res.prop("outerHTML");
	res.remove();
	$("#friend-list").prepend(thisHtml);
	$
//	console.log(thisHtml);
//  console.log(res);
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
        	'<div class="friend-block" number="'+value.number+'" title="上次登录时间：'+value.last_login+'">'+
            	'<div class="status '+online+'"></div>'+
            	'<div class="info">'+
					'<div class="nackname">'+value.nickname+'</div>'+
					'<div class="number">'+value.number+'</div>'+
				'</div>'+
            '</div>'
		);
    }
}

/*收到添加好友的申请*/
function friendRequest(data){
	var numberId = data.from.number;
	layer.confirm(data.from.nickname+'申请添加您为好友', {
	  btn: ['同意','拒绝'] //按钮
	}, function(){
	    var data = {
	        "controller":"Friend",
	        "action":"doReq",
	        "content":{"token":token,"number":numberId,"check":1}
	    };
	    var data = JSON.stringify(data);
	    ws.send(data);
	    layer.closeAll();
	}, function(){
		var data = {
	        "controller":"Friend",
	        "action":"doReq",
	        "content":{"token":token,"number":numberId,"check":0}
	    };
	    var data = JSON.stringify(data);
	    ws.send(data);
		layer.closeAll();
		layer.msg("您拒绝了好友添加的申请");
	});
}

/*添加好友的结果处理*/
/*拒绝添加好友*/
function newFriendFail(data){
	layer.confirm(data, {
	  btn: ['知道了'] //按钮
	}, function(){
		layer.closeAll();
	});
}
/*添加好友成功后*/
function newFriend(data){
	layer.confirm("您已成功添加好友"+data.nickname, {
	  btn: ['确定'] //按钮
	}, function(){
		$("#friend-list").prepend(
	    	'<div class="friend-block" number="'+data.number+'" title="上次登录时间：'+data.last_login+'">'+
	        	'<div class="status '+data.online+'"></div>'+
	        	'<div class="info">'+
					'<div class="nackname">'+data.nickname+'</div>'+
					'<div class="number">'+data.number+'</div>'+
				'</div>'+
	        '</div>'
		);
		layer.closeAll();
	});
}