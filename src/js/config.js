/*
 * 配置文件
 * */

var ajaxUrl = 'http://118.24.77.25:9502';/*域名*/

var loginUrl = 'login.html';

var indexUrl = 'index.html';

//var loginUrl = '/Users/yuzhang/www/LTalk-html/login.html';
//
//var indexUrl = '/Users/yuzhang/www/LTalk-html/index.html';

var token = JSON.parse(sessionStorage.getItem('token'));
if(token==undefined){
    location.href = loginUrl;
}