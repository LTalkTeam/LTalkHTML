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
	    console.log(data);
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