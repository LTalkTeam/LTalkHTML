
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
	    var data = JSON.stringify(data);
	    ws.send(data);
	});
});


/*添加/创建群组*/
$(".friend .friend-top div .btn-group").on("click",function(){
	$(this).siblings("ul").toggle();
});

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
});

$(".friend .friend-top div .create-group").on("click",function(){
	var thisText = $(this).parent().text();
	layer.prompt({title: '请输入您要创建的群组名称', formType: 3}, function(pass, index){
	  layer.close(index);
	  layer.msg(thisText+'账户：'+ pass);
	});
});