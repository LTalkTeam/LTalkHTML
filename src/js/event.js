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
function initok(data) {
    $('#mynickname').val(data.nickname);
    $('#mynumber').val(data.number);
    $('#last_login').val(data.last_login);
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
//	console.log(thisHtml);
//  console.log(res);
}

/*
 * 好友下线提醒
 */
function friendOffLine(data){
    var number = data.number;
    var res = $(".friend-block[number$='"+number+"']");
    res.find(".status").removeClass("online");
    res.find(".status").addClass("offline");
    var thisHtml = res.prop("outerHTML");
    res.remove();
    $("#friend-list").append(thisHtml);
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
    var online = data.online==1?"online":"offline";
	layer.confirm("您已成功添加好友"+data.nickname, {
	  btn: ['确定'] //按钮
	}, function(){
		$("#friend-list").prepend(
	    	'<div class="friend-block" number="'+data.number+'" title="上次登录时间：'+data.last_login+'">'+
	        	'<div class="status '+online+'"></div>'+
	        	'<div class="info">'+
					'<div class="nackname">'+data.nickname+'</div>'+
					'<div class="number">'+data.number+'</div>'+
				'</div>'+
	        '</div>'
		);
		layer.closeAll();
	});
}


/*
 * 好友聊天消息
 * flag == 1 表示自己的消息 2 表示对方的
 *
 */
function chat(data) {
	var number = data.number;
	var flag = data.flag;
	var data = data.data;
	var me = flag==1?"me":"";
    var id = 'person'+number;
    var res = $('#ltalk ul[id="'+id+'"]');
    var text = "<li class="+me+">"+"<p>"+ "<span>"+ data+ "</span>"+ "</p>"+ "</li>";
    if(res.length>0){
        res.append(
            text
		);
    }else{
        $('.talk-content').append(
            "<ul id='"+id+"' style='display: none;'>"+
            	text+
            "</ul>"
        );
    }
    // 判断当前窗口是否是对话人，不是则加红点
	var msg_number = $('#msg-number').val();
	if(msg_number!=number){
        if($('.friend-block[number="'+number+'"] .ismsg').length===0){
            $('.friend-block[number="'+number+'"]').append(
                '<div class="ismsg"></div>'
            );
		}
	}
    var ul = $('#ltalk').children(':visible');
    setTimeout(function(){$('#ltalk').scrollTop( ul[0].scrollHeight );},100)
}

/*
 * 群组聊天消息
 * flag == 1 表示自己的消息 2 表示对方的
 *
 */
function groupChat(data) {
    var number = data.groupNumber;
    var flag = data.flag;
    var msg = data.msg;
    var user = data.user;
    var id = 'group'+number;
    var res = $('#ltalk ul[id="'+id+'"]');

    if(flag==1){
        var text = "<li class='me'>"+"<p>"+ "<span>"+ msg+ "</span>"+ "</p>"+ "</li>";
	}else{
        var text = "<li>"+"<p>"+ "<font>"+ user['nickname']+ " ( "+user['number']+" ) </font>"+"<span>"+ msg+ "</span>"+ "</p>"+ "</li>";
    }

    if(res.length>0){
        res.append(
            text
        );
    }else{
        $('.talk-content').append(
            "<ul id='"+id+"' style='display: none;'>"+
            text+
            "</ul>"
        );
    }
    // 判断当前窗口是否是对话人，不是则加红点
    var msg_number = $('#msg-number').val();
    var msg_type = $('#msg-type').val();
    if(!(msg_number==number && msg_type==2)){
        if($('#group-list .friend-block[number="'+number+'"] .ismsg').length===0){
            $('#group-list .friend-block[number="'+number+'"]').append(
                '<div class="ismsg"></div>'
            );
        }
    }
    var ul = $('#ltalk').children(':visible');
    setTimeout(function(){$('#ltalk').scrollTop( ul[0].scrollHeight );},100)
}


/*
 * 世界聊天
 */
function worldChat(data) {
	var msg = data.msg;
	var user = data.user;

    var text = "<li>"+"<p>"+ "<font>"+ user['nickname']+ " ( "+user['number']+" )</font>"+"<span>"+ msg+ "</span>"+ "</p>"+ "</li>";
    $('#world-talk').append(
        text
    );
}

function groupList(data){
    for(var i= 0;i<data.length;i++){
        $('#group-list').append(
            '<div class="friend-block" number="'+data[i].info.gnumber+'" ginfo="'+data[i].info.ginfo+'">'+
            '<i class="fa fa-group"></i>'+
            '<div class="info">'+
            '<div class="nackname">'+data[i].info.gname+'</div>'+
            '<div class="number">'+data[i].info.gnumber+'</div>'+
            '</div>'+
            '</div>'
        );
    }
}

/*创建组*/
function newGroup(data){
    $('#group-list').append(
        '<div class="friend-block" number="'+data.gnumber+'"  ginfo="'+data.ginfo+'">'+
        //      	'<div class="status '+data.gname+'"></div>'+
        '<i class="fa fa-group"></i>'+
        '<div class="info">'+
        '<div class="nackname">'+data.gname+'</div>'+
        '<div class="number">'+data.gnumber+'</div>'+
        '</div>'+
        '</div>'
    );
}