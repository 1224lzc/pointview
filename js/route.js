function calRoutePlan(){
	//计算驾车最优方案

	// giveme4Pts();//测试时省得点鼠标用
	
	//---目前以点击点的首尾点为起终点，中间的为途经点
	//---比如点了5个点，则地图上的点234是midPt[0]到[2] */
	num=pointsList.length;
	if(num<2){
		alert("请至少选择两点");
		return;
	}

	document.getElementById('btnCalRoutePlan').disabled=true;
	var vorHtml; //点计算前的html源码，因为计算时间比较长，给人以假死的感觉
	vorHtml = document.getElementById('points').innerHTML + "<br/>======================<br/>";

	startPt=pointsList[0];
	endPt=pointsList[num-1];
	midPt=[];
	midPt = pointsList.slice(1, num-1);

	document.getElementById('points').innerHTML = vorHtml + "<p>正在计算行车计划中……</p>";
	var waypoints = new Array(); //中间点排列组合暂存一下
	(function (arr) {  
	    (function fn(n) { //为第n个位置选择元素  
	        for(var i=n;i<arr.length;i++) {  
	            swap(arr,i,n);  
	            if(n+1<arr.length-1) //判断数组中剩余的待全排列的元素是否大于1个  
	                fn(n+1); //从第n+1个下标进行全排列  
	            else
	            	waypoints.push(arr.concat());
				swap(arr,i,n);  
	        }  
	    })(0);  
	})(midPt);
	// timeof('全排列中间点结束');
	if(midPt.length == 0)waypoints[0]=midPt;//空数组不会排列
	//算所有中间点排列的行车计划
	 var promises = [];
	 for (var i = 0; i < waypoints.length; i++) {
	 	var drivingRoute = new BMap.DrivingRoute(map, {policy:BMAP_DRIVING_POLICY_LEAST_TIME});
	 	var promise = drivingRoute.searchAsync(startPt, endPt, {startCity:cityName,endCity:cityName,waypoints:waypoints[i]});
	 	promises.push(promise);
	 }
	 Plans=[];
	 Q.all(promises)
	 .then(function (results) {
	 	for (var i = results.length - 1; i >= 0; i--) {
	 		var plan = results[i].getPlan(0); //取第一种方案.其实也就给一种
			Plans[i]=plan;
	 	};
	 	// timeof('所有的驾车计划都算好了');
	 	//开始最优方案的选择.最短时间为准则
		var timemin = 9999999999;
		var index_min = 9999; //最优方案的脚标
		for(var i=0;i<Plans.length;i++){
			// timeof('Plans[i].getDuration(false) ' + Plans[i].getDuration(false));
				if(Plans[i].getDuration(false) < timemin){
					timemin = Plans[i].getDuration(false);
					index_min = i;
				}
		}
		bestPlan = Plans[index_min];
		// console.log('脚标是 ' + index_min + ' 的方案时间最短：需 ' + bestPlan.getDuration(true));
		Plans =[]; //释放掉数组

		//最优路线的中间点是什么组合
		var best_midPt = [];
		best_midPt=waypoints[index_min];
		// timeof('最佳途经点'+outputPt(best_midPt));
		waypoints=[];
		index_midPt=[];
		for (var i = best_midPt.length - 1; i >= 0; i--) {
			var tmp = best_midPt[i];
			var index_tmp = 99;
			for (var j = midPt.length - 1; j >= 0; j--) {
				if( tmp.equals(midPt[j]) )
					index_tmp = j;
			};
			index_midPt[i]=index_tmp;
		};
		//结果输出。投机方法，让百度再算一次方案（呵呵
		var driving = new BMap.DrivingRoute(map, {
			renderOptions: {map: map}, //结果呈现到地图上
			policy:BMAP_DRIVING_POLICY_LEAST_TIME, //驾车策略：最少时间
			onSearchComplete: function(results){
				if (driving.getStatus() != BMAP_STATUS_SUCCESS){
				  console.log("driving寻找路线不成功");
				  return ;
				}
			}
		});
		return driving.searchAsync(startPt, endPt, {startCity:cityName,endCity:cityName,waypoints:best_midPt});
	 })
	.then(function (results){
		//得到最后方案进行的动作
		var line = '1 - ';
		for(var i=0;i<num-2;i++){
			line += (index_midPt[i]+2) + " - ";
		};
		line += " " + num;
		var Rresult = 'rresult'; //具体行车路线存放的容器id
		for (var i = 0; i < results.getNumPlans(); i++) { // 遍历所有方案
			var routePlan = results.getPlan(i);
			G(Rresult).innerHTML += '方案['+line+']的具体路线 <br />';
			for (var j = 0; j < routePlan.getNumRoutes(); j++) { // 遍历所有路线
				var route = routePlan.getRoute(j);
				switch(j){
					case 0:
					if(num!=2)
						G(Rresult).innerHTML += "===[1 - " + (index_midPt[0]+2) + "]路线 <br />";
					break;

					case (routePlan.getNumRoutes()-1):
					G(Rresult).innerHTML += "===["+ (index_midPt[num-3]+2)+" - " + num + "]路线 <br />";
					break;
					
					default:
					G(Rresult).innerHTML += "===["+ (index_midPt[j-1]+2) +" - " + (index_midPt[j]+2) + "]路线 <br />";
				}
				for (var k = 0; k < route.getNumSteps(); k++) { // 遍历所有关键点
					var step = route.getStep(k);
					G(Rresult).innerHTML += "第 " + (k+1) + " 步：" + step.getDescription(true) +"<br />";
				}
			}
			G(Rresult).innerHTML += "<br />";
		}
		var plan = results.getPlan(0); //取第一种方案
		var time = plan.getDuration(true); //获取时间距离,返回字符串
		var distance = plan.getDistance(true); 
		var output = "最佳驾车方案为： " + line +"。";
		output += "共需要 " + time + "，\n";
		output += '总路程 ' + distance + '。<a href="javascript:void(0)" onclick="show(\'light\')">具体路线</a>';
		G('points').innerHTML = vorHtml + "<p>"  + output + "</p>";
	　　G('btnCalRoutePlan').disabled=false;
	});
};//end calRoutePlan()

function swap(arr,i,j) {  
    if(i!=j) {  
        var temp=arr[i];  
        arr[i]=arr[j];  
        arr[j]=temp;  
    }  
}