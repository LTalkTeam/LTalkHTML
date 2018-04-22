/* 1. 判断缓存中是否有 token
 * 2. onopen 初始化，失败则返回原因，清除 token 重新登录
 * 3. 成功，则调用好友列表接口，群组列表接口渲染页面
 * 4. 监听好友消息，好友上/下线提醒，群组消息，世界消息
 * 5. 监听用户发送的三种消息
 * 6. 关掉页面时，清除缓存
 */

var token = JSON.parse(localStorage.getItem('token'));

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
    var data = JSON.stringify(data);
    ws.send(data);
};

ws.onmessage = function (ev) {
	var data = eval('(' + ev.data + ')');
	var method = data.method;
	eval(method+"()");
//	var fn = eval(method+"()");
//	fn(data);
};

function Statistics(){
	console.log("成功")
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