//路线推荐

var RouteRecommand = function(Rindex){
	var Route = new Array(rcdPoint());
	var Routes = new Array(Route);
	Routes=[];
	//R0
	Route=[];
	Route[0]={
		pos:new BMap.Point("121.506296", "31.245287"),
		name:'东方明珠',
		description:'上海市的地标建筑，世界第六高塔，登顶可俯瞰上海美景'
	};
	Route[1]={
		pos:new BMap.Point("121.499571", "31.190526"),
		name:'世博源',
		description:'“世博源”是由2010年上海世界博览会的永久性建筑——世博轴改建而成的超广域型综合购物中心，周围遍布原世博场馆'
	};
	Route[2]={
		pos:new BMap.Point("121.444505", "31.200086"),
		name:'徐家汇',
		description:'位于上海中心城区的西南繁华徐家汇部，紧邻上海交通大学和徐汇区委区政府，是上海市十大著名的商业中心之一，该商圈是集购物、娱乐、办公、商贸、休闲、住宿、餐饮、培训教育为一体的综合性商业区域。'
	};
	Route[3]={
		pos:new BMap.Point("121.482197", "31.24051"),
		name:'南京路',
		description:'南京东路步行街被誉为“中华商业第一街”，是上海对外开放的窗口，也是国内外购物者的天堂，还有着美丽的外滩风景。'
	};
	Route[4]={
		pos:new BMap.Point("121.497487", "31.246291"),
		name:'外滩',
		description:'上海最繁华之地，中西多种风格建筑汇聚，周围多上海地标景点。'
	};
	Routes.push(Route);
	//R1
	Route=[];
	Route[0]={
		pos:new BMap.Point("121.488923", "31.258882"),
		name:'虹口',
		description:'hongkou'
	};
	Route[1]={
		pos:new BMap.Point("121.388901", "31.108573"),
		name:'闵行',
		description:'闵行'
	};
	Routes.push(Route);
	//R2依次类推
	Route=[];

	var RPts = Routes[Rindex];
	pointsList = [];
	Address=[];
	G('points').innerHTML ='地点列表：<ol id="ol_points" class="ui list"></ol>';
	map.clearOverlays();

	for(var i=0;i<RPts.length;i++)pointsList[i]=RPts[i].pos;

	for(var i=0;i<RPts.length;i++){
		addMarker(pointsList[i],i,RPts[i].name,'<div style="margin:0;line-height:20px;padding:2px;"><img src="'+BASE_URL+'pic/'+Rindex+'/' + i + '.jpg" alt="" style="float:right;zoom:1;overflow:hidden;width:100px;height:100px;margin-left:3px;"/>简介：'+RPts[i].description+'<br /></div>');
	}

	//还是异步函数的问题，为了显示效果必须在地址都显示完之后再计算路线，故calRoutePlan()放在填充地址那里进行判断
};

function addMarker(point,index,wTitle,wContent){
	// 编写自定义函数,创建标注,添加地址，展示框
	var marker = new BMap.Marker(point);
	var label = new BMap.Label('第'+(index+1)+'点',{offset:new BMap.Size(-30,-6)});
	map.addOverlay(marker);
	marker.setLabel(label);
	marker.setZIndex(999);//计算路线画出的标志会遮挡点标，使得点击不了。所以把它层数放高一点
	geoc.getLocation(point, function(rs){
		var addComp = rs.addressComponents;
		var str = addComp.city + addComp.district + addComp.street + addComp.streetNumber;//addComp.province + 
		return (function(Aindex,string){
			Address[Aindex]=string;//使用Address.push(str);会错乱
			//单击星标显示简介
			marker.addEventListener("click", function(poi,title,content){
				return function(e){
					e.domEvent.stopPropagation();
					var searchInfoWindow2 = new BMapLib.SearchInfoWindow(map, content+'地址：'+string,
					{
						title: title, //标题
						panel : "panel", //检索结果面板
						//enableMessage:true, //设置允许信息窗发送短息
						enableAutoPan : true, //自动平移
						searchTypes :[
							BMAPLIB_TAB_SEARCH   //周边检索
						]
					});
					searchInfoWindow2.open(poi);
				}
			}(point,'第'+(Aindex+1)+'点 ' + wTitle,wContent));
			// triggerEvent(marker,'click');//能激活但没反应
			if(Address.length==pointsList.length && AddOK()){
				for(var i=0;i<Address.length;i++){
					document.getElementById('ol_points').innerHTML +="<li>" +  Address[i] + "</li>";
				}
				calRoutePlan();
			}
		})(index,str);
	});
};

function AddOK(){
	//地址都填充好了吗
	for(var i=0;i<Address.length;i++){
		if(Address[i]==undefined)return false;
	}
	return true;
}
