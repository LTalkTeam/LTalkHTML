/*
 * 公共js文件
 * */

var token = JSON.parse(sessionStorage.getItem('token'));
if(token==undefined){
    location.href = loginUrl;
}

/*
 * 时间戳转日期
 * 参数一，时间戳，参数二输出的时间格式，1只有年月日，2年月日加时分秒
 */
 function timestampConversion(timestamp,id) {
 	if(timestamp != null && timestamp != undefined && timestamp != ""){
 		var newDate = new Date(timestamp);
 	} else {
 		var newDate = new Date();
 	}
    var newYear = newDate.getFullYear();
    var newMonth = newDate.getMonth()+1;
    var newDay = newDate.getDate();
   	var newHour = newDate.getHours();
    var newMin = newDate.getMinutes();
    var newSen = newDate.getSeconds();
    if (id == 1) {
    	var newTime = newYear + '-' + addZero(newMonth) + '-' + addZero(newDay);/*最后拼接时间*/
    } else if (id == 2) {
    	var newTime = newYear + '-' + addZero(newMonth) + '-' + addZero(newDay) + ' ' + addZero(newHour) + ':' + addZero(newMin) + ':' + addZero(newSen);/*最后拼接时间*/
    }
    return newTime;
}; 

/*补0操作*/
function addZero(num) {
    if (parseInt(num) < 10) {
        num = '0'+num;
    }
    return num;
}

/*2017-12-14 00:00:00格式的时间字符串拆分保留年月日*/
function dateSplit(date) {
	var dateArray = date.split(" ");
	return dateArray[0];
}

/*2017-12-14 00:00:00格式的时间字符串拆分 20171214000000*/
function dateFormat(date) {
	var dateNumber = date.replace(/:/g, '');
	dateNumber = dateNumber.replace(/-/g, '');
	return dateNumber;
}

/*2017-12-14 00:00:00格式的时间字符串拆分保留年月日 20171214 000000*/
function dateFormatObj(date) {
	var dateNumber = date.replace(/:/g, '');
	var dateNumberArray = dateNumber.split('-');
	var dateNumberObj = {};
	dateNumberObj.start = dateNumberArray[0];
	dateNumberObj.end = dateNumberArray[1];
	return dateNumberObj;
}

/*
 * 获取当前年与临近两年
 * @return array
 * @author zhangyu
 */
function getYearArr() {
    var myDate = new Date();
    var year = myDate.getFullYear();
    return [year-4,year-3,year-2,year-1,year,year+1,year+2,year+3,year+4];
}
