//点的辅助搜索功能和储存

var onList = function(e) {  //鼠标放在下拉列表上的事件
	var str = "";
	var _value = e.fromitem.value;
	var value = "";
	if (e.fromitem.index > -1) {
		value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
	}    
	str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;
	
	value = "";
	if (e.toitem.index > -1) {
		_value = e.toitem.value;
		value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
	}    
	str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
	G("searchResultPanel").innerHTML = str;
};

var myListVal;//智能补充填上去的地址

var clickList = function(e) {    //鼠标点击下拉列表后的事件
	var _value = e.item.value;
	myListVal = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
	G("searchResultPanel").innerHTML ="onconfirm<br />index = " + e.item.index + "<br />myListVal = " + myListVal;
	
	setPlace();
};

function setPlace(){
	//map.clearOverlays();    //清除地图上所有覆盖物
	var local2 = new BMap.LocalSearch(cityName, {
	  onSearchComplete: function(){
		var pp = local2.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
		map.centerAndZoom(pp, 18);
		map.addOverlay(new BMap.Marker(pp));    //添加标注
	  }
	});
	local2.search(myListVal);
	// G("manSearchDiv").style = "display: block;"; //chrome不可以 FF可以
	G("manSearchDiv").style.display = "inline";
};

function manSearch(LocalSearch){
	LocalSearch.search(document.getElementById('suggestId').value);
	//如果搜索错误则重新搜索
	//比如搜"同济"，选“上海市杨浦区同济大学-地铁站”会定位到国权路，而第二个结果才是正确的
};


var geoc = new BMap.Geocoder();//百度地图API提供Geocoder类进行地址解析

var map_Click = function(e) {
	//点击了地图上的点，加上星标
	var marker = new BMap.Marker(e.point);
	var pt = marker.getPosition();
	pointsList[pointsList.length] = pt;
	var label = new BMap.Label("第" + pointsList.length + "点",{offset:new BMap.Size(-30,-6)});
	map.addOverlay(marker);
	marker.setLabel(label);
	// marker.disableMassClear();//禁止覆盖物在map.clearOverlays方法中被清除。
	// label.disableMassClear();
	//右击星标删除之(百度API BUG:火狐IE 无法工作，Chrome可以；但改单击删除时IE不能工作火狐可以。)
	marker.addEventListener("rightclick", function(e2){
		showEvent(e2);
		e2.domEvent.stopPropagation();
		deletePoint();//不管点哪个标记都删最后一个
	});

	geoc.getLocation(pt, function(rs){
		var addComp = rs.addressComponents;
		var str = addComp.city + addComp.district + addComp.street + addComp.streetNumber;//addComp.province + 
		Address.push(str);
		pointsListen(); //显示在左边列表里
		//单击星标显示地址和周边搜索(地址返回得慢，所以SearchInfoWindow放这里处理)
		marker.addEventListener("click", function(poi,label,content){
			return function(e){
				e.domEvent.stopPropagation();//IE会出错
				var searchInfoWindow2 = new BMapLib.SearchInfoWindow(map, '搜索中心地址：'+content, //内容就写地址吧
				{
					title: label, //标题
					panel : "panel", //检索结果面板
					enableMessage:true, //设置允许信息窗发送短息
					enableAutoPan : true, //自动平移
					searchTypes :[
						BMAPLIB_TAB_SEARCH   //周边检索
					]
				});
				searchInfoWindow2.open(poi);
			}
		}(pt,'在'+label.content+'周边搜索',str));
	}); 
};//end map_Click

function pointsListen(){ 
	//页面左边输出点的地址
	document.getElementById('ol_points').innerHTML ="";
	for(var i=0;i<pointsList.length;i++){
		document.getElementById('ol_points').innerHTML +="<li>" +  Address[i] + "</li>";
	}
};



function deletePoint(){
	var allOverlay = map.getOverlays();
	map.removeOverlay(allOverlay[allOverlay.length - 1]);
	pointsList.pop();//最后一点出栈，长度减一
	Address.pop();
	pointsListen(); //删除后也需要重新显示
};
