//公共的变量、可以通用的函数放这里方便查找

var BASE_URL;//站点根目录
//---------有关点的
var pointsList = new Array(BMap.Point); //储存点的数组，按用户点击的顺序排列
//pointsList.length=0;//一开始长度就有1，百度给了个不知道什么点
pointsList = [];
var Address = new Array(); //地址单独放一个数组里，和pointsList[]对应

//---------有关路线计算的
var startPt = new BMap.Point;
var endPt = new BMap.Point;
var midPt = new Array(BMap.Point); //起、终、途经点
var num; //以上三类点总点数

//大神给咱打开了新思路
var Plans = new Array(BMap.RoutePlan);//存所有的行车方案
var bestPlan; //最优方案
var index_midPt = new Array(); //最优方案的途经点组合的midPt脚标


/*
js自定义类和对象
http://blog.sina.com.cn/s/blog_5efb7f730100ejsb.html
3、原型方式
*/
function rcdPoint(){
	/*此类表示一个推荐路线上的地点

	属性	      类型	           描述 
	pos           BMap.Point      地点的点位坐标
	name          string          地点的名称
	description   string          地点的简介 

	*/ 
	rcdPoint.prototype.pos= new BMap.Point;
	rcdPoint.prototype.name = '';
	rcdPoint.prototype.description = '';
}



//---------
function G(id) {
	return document.getElementById(id);
};

//js获取项目根路径，如： http://localhost:8083/uimcardprj/
function getRootPath(){
	//获取当前网址，如： http://localhost:8083/uimcardprj/share/meun.jsp
	var curWwwPath=window.document.location.href;
	//获取主机地址之后的目录，如： uimcardprj/share/meun.jsp
	var pathName=window.document.location.pathname;
	var pos=curWwwPath.indexOf(pathName);
	//获取主机地址，如： http://localhost:8083
	var localhostPaht=curWwwPath.substring(0,pos);
	//获取带"/"的项目名，如：/uimcardprj
	var projectName=pathName.substring(0,pathName.substr(1).indexOf('/')+1);
	if(localhostPaht.indexOf("http") > 0 )
		return (localhostPaht+projectName+'/');//网络空间返回网址
	else
		return pathName.substring(0, pathName.lastIndexOf('/')+1);//本机返回相对路径
}

function fomatFloat(src,pos){
	//四舍五入src保留pos位小数
	return Math.round(src*Math.pow(10, pos))/Math.pow(10, pos);     
};

function getType(o) {
var _t;return ((_t = typeof(o)) == "object" ? o==null && "null" || Object.prototype.toString.call(o).slice(8,-1):_t).toLowerCase();
};
// 执行结果：

// getType("abc"); //string
// getType(true); //boolean
// getType(123); //number
// getType([]); //array
// getType({}); //object
// getType(function(){}); //function
// getType(new Date); //date
// getType(new RegExp); //regexp
// getType(Math); //math
// getType(null); //null 

/*
function fact(n){
	//求n的阶乘
	for(i=1,ff=1;i<=n;i++){
		ff *= i;
	}
	return ff;//变量名不能是fact，否则第二次计算时会显示fact不是函数
}

function disAB(Pa,Pb){
	//计算Pa Pb点的相似性
	//行车路线中的关键点和途经点会有微小不同，故不能使用百度自带Pt.equals()
	return (Math.abs(Pa.lng-Pb.lng) + Math.abs(Pa.lat-Pb.lat));
};
*/