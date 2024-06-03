var outputPt = function(PtArr){
	//输出坐标点信息
	var str;
	if(PtArr.length == undefined){
		if(PtArr.equals(pointsList[0])){
			str = "startPt:(";
		}else{
			if(PtArr.equals(pointsList[num-1])){
				str = "endPt:(";
			}else{
				str = "(";
			}
		}
		str += PtArr.lng + "," + PtArr.lat + ")";
	}else{
		str = "midPt:\n";
		for(var i=0;i<PtArr.length;i++){
			str+= i + ":(" + PtArr[i].lng + "," + PtArr[i].lat + ")\n";
		}
	}
	return str;
}


function timeof(things){
	var myDate = new Date();
	var t;
	t = myDate.getHours() + ':';       //获取当前小时数(0-23)
	t += myDate.getMinutes() + ':';    //获取当前分钟数(0-59)
	t += myDate.getSeconds() + '.';     //获取当前秒数(0-59)
	t += myDate.getMilliseconds();    //获取当前毫秒数(0-999)
	console.log(things + ' happens at ' + t);
};


var giveme4Pts = function(){
	pointsList = [];
	pointsList[0] = new BMap.Point("121.488923", "31.258882");//虹口
	pointsList[1] = new BMap.Point("121.464385", "31.214797");//复兴中路
	pointsList[2] = new BMap.Point("121.480394", "31.249281");//曲阜路
	pointsList[3] = new BMap.Point("121.388901", "31.108573");//闵行
	pointsList[4] = new BMap.Point("121.487396", "30.918681");//奉贤
	//最短应该是 [0][2][1][3][4]
};

function showEvent (event){
    var newLine = '';
    if (!event) { // 手动触发的事件可能没有事件参数，注意需要判断
        newLine = '手动触发了一个事件.type:'+event.type;
    } else { // 注意即使有event对象，但不保证type和target属性都包含，手动触发的事件参数内容是自定义的
        newLine = event.type + ' event from ' + event.target;
    }
    console.log(newLine);
}

// 触发事件
function triggerEvent(obj,act) {
    BMapLib.EventWrapper.trigger(obj, act);
}


//----备用零件
//console.log(outputPt(startPt));console.log(outputPt(midPt));console.log(outputPt(endPt));
//console.log(outputDis(Dis));console.log(outputDis(DistoEnd));
//driving.search(startPt,endPt,{startCity:cityName,endCity:"上海",waypoints:midPt});//可以搜途经点（max=10）
// setTimeout(function(){},1000);
//map.clearOverlays();
//---arrayObj.slice(start, [end]); 
//---以数组的形式返回数组的一部分，注意不包括 end 对应的元素，如果省略 end 将复制 start 之后的所有元素
