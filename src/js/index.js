/* 1. 判断缓存中是否有 token
 * 2. onopen 初始化，失败则返回原因，清除 token 重新登录
 * 3. 成功，则调用好友列表接口，群组列表接口渲染页面
 * 4. 监听好友消息，好友上/下线提醒，群组消息，世界消息
 * 5. 监听用户发送的三种消息
 * 6. 关掉页面时，清除缓存
 */

var token = JSON.parse(sessionStorage.getItem('token'));

console.log(token);

if(token==undefined){
	location.href = loginUrl;
}

var ws = new WebSocket('ws://118.24.77.25:9502');

ws.onopen = function (ev) {
    console.log('页面初始化...');
    var data = {
        "controller":"OnOpen",
        "action":"init",
        "content":{"token":token}
    };
    console.log(data);
    var data = JSON.stringify(data);
    ws.send(data);
};

ws.onmessage = function (ev) {
	var data = eval('(' + ev.data + ')');
	console.log(ev.data);
	if(data.method !=undefined && data.method != null && data.method != ""){
		var method = data.method;
		eval(method+"(data)");
	} else{
//		layer.msg(data);
		if( data.errorCode == 50000){
			location.href = loginUrl;
		}
	}
//	var fn = eval(method+"()");
//	fn(data);
};

function Statistics(data){
	$(".user-info span").text(data.data.count);
//	console.log("在线人数统计，后台返回数据成功");
}

ws.onclose = function (ev) {
    layer.msg('服务器故障，请重新登录');
    // 清除本地缓存
    // todo
    setTimeout(function (){
    	location.href = loginUrl;
    }, 2000); 
    
};

ws.onerror = function (ev) {
    console.log('error:'+ ev.data);
};


/*好友/分组点击切换*/
//$(".friend .friend-top div").on("click",function(){
//	$(this).find("i").toggleClass("fa-caret-up");
//	$(this).siblings("div").find("i").addClass("fa-caret-up");
//})

/*添加好友*/
$(".friend .friend-top div .add-friends").on("click",function(){
	var thisText = $(this).parent().text();
	layer.prompt({title: '请输入您要添加的'+thisText+'id', formType: 3}, function(pass, index){
	  layer.close(index);
	    var data = {
	        "controller":"Friend",
	        "action":"sendReq",
	        "content":{"token":token,"number":pass}
	    };
	    console.log(data);
	    var data = JSON.stringify(data);
	    ws.send(data);
	});
})

function sendReq(){
	console.log("添加好友，后台返回数据成功");
}
/*添加/创建群组*/
$(".friend .friend-top div .btn-group").on("click",function(){
	$(this).siblings("ul").toggle();
})
$(".friend .friend-top div .add-group").on("click",function(){
	var thisText = $(this).parent().text();
	layer.prompt({title: '请输入您要添加的群组id', formType: 3}, function(pass, index){
	  layer.close(index);
	    var data = {
	        "controller":pass,
	        "action":"getFriends",
	        "content":{"token":token}
	    };
	    console.log(data);
	    var data = JSON.stringify(data);
	    ws.send(data);
	});
})

$(".friend .friend-top div .create-group").on("click",function(){
	var thisText = $(this).parent().text();
	layer.prompt({title: '请输入您要创建的群组名称', formType: 3}, function(pass, index){
	  layer.close(index);
	  layer.msg(thisText+'账户：'+ pass);
	});
})