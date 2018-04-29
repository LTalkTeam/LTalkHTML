var token = JSON.parse(sessionStorage.getItem('token'));
if(token==undefined){
    location.href = loginUrl;
}

/*添加好友*/
$(".friend .friend-top div .add-friends").on("click",function(){
	$(".friend .friend-top div .btn-group").siblings("ul").hide();
	var thisText = $(this).parent().text();
	layer.prompt({title: '请输入您要添加的'+thisText+'id', formType: 3}, function(pass, index){
	  layer.close(index);
	    var data = {
	        "controller":"Friend",
	        "action":"sendReq",
	        "content":{"token":token,"number":pass}
	    };
	    var data = JSON.stringify(data);
	    ws.send(data);
	});
});


/*添加/创建群组*/
$(".friend .friend-top div .btn-group").on("click",function(){
	$(this).siblings("ul").toggle();
});

$(".friend .friend-top div .add-group").on("click",function(){
	$(".friend .friend-top div .btn-group").siblings("ul").hide();
	var thisText = $(this).parent().text();
	layer.prompt({title: '请输入您要添加的群组id', formType: 3}, function(pass, index){
	  layer.close(index);
	    var data = {
	        "controller":pass,
	        "action":"getFriends",
	        "content":{"token":token}
	    };
	    var data = JSON.stringify(data);
	    ws.send(data);
	});
});

$(".friend .friend-top div .create-group").on("click",function(){
	$(".friend .friend-top div .btn-group").siblings("ul").hide();
	var thisText = $(this).parent().text();
	layer.prompt({title: '请输入您要创建的群组名称', formType: 3}, function(pass, index){
	  layer.close(index);
	  layer.msg(thisText+'账户：'+ pass);
	});
});

/*
 * 点击好友列表块，开始聊天
 */
$("#friend-list").delegate('.friend-block',"click",function(){
	var number = $(this).attr("number");
	var talkName = $(this).find(".info .nackname").text();
    $('#msg-number').val(number);
    $('#msg-type').val(1);
    // 隐藏其他所有聊天框，展示当前好友聊天框
	var id = 'person'+number;
	$('.msg-init').css('display','none');
	$('#ltalk-name').text(talkName);
    $(this).find('.ismsg').remove();

    $('#ltalk ul').not("#".id).css('display','none');
    var res = $('#ltalk ul[id="'+id+'"]');
	if(res.length>0){
        res.css('display','block');
	}else{
        $('.talk-content').append(
        	"<ul id='"+id+"'>"+
			"</ul>"
		);
	}
});

/*
 * 发送好友消息
 */
$('#msg-button').on("click",function(){
    var msg = $("#msg").val();
    if(msg===null||msg===undefined||msg===""){
        layer.msg("不能发送空白消息");
        return false;
	}
	var number = $('#msg-number').val();
	var type   = $('#msg-type').val();
	if(number===null||number===undefined||number===""){
        layer.msg("number获取失败");
        return false;
	}

	if(type==1){		// 好友消息
        var data = {
            "controller":'Chat',
            "action":"personalChat",
            "content":{"token":token,'number':number,'data':msg}
        };
	}else if(type==2){	// 群组消息
        var data = {
            "controller":'',
            "action":"",
            "content":{"token":token}
        };
	}else{
        layer.msg("未知错误");
        return false;
	}
    var data = JSON.stringify(data);
    ws.send(data);
    $("#msg").val("");
});


/*
 * 发送世界消息
 */
$('#world-button').on("click",function(){
    var msg = $("#world-msg").val();
    if(msg===null||msg===undefined||msg===""){
        layer.msg("不能发送空白消息");
        return false;
    }
    var data = {
        "controller":'World',
        "action":"chat",
        "content":{"token":token,'data':msg}
    };
    var data = JSON.stringify(data);
    ws.send(data);
    $("#world-msg").val("");

    var text = "<li class='me'>"+"<p>"+ "<font>"+ "我"+ "</font>"+"<span>"+ msg+ "</span>"+ "</p>"+ "</li>";
    $('#world-talk').append(
        text
    );
});
