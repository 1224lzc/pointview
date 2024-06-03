/*
 * Extends DrivingRoute Class
 * Method searchAsync
 * Syntax
 *     searchAsync(start, end, [options])
 * Parameters
 *     start  : required, String | Point | LocalResultPoi
 *     end    : required, String | Point | LocalResultPoi
 *     options: optional, object { startCity, endCity, waypoints }
 *         startCity: String
 *         endCity  : String
 *         waypoints: Array(String | Point)
 * Return Value
 *     Promise (with DrivingRouteResult instance)
 * Usage
 *     var d = new DrivingRoute(location, options);
 *     d
 *         .searchAsync(start, end, options)
 *         .then(function (result) {}, function (reason) {});
 *
 */
(function () {
	if (!BMap.DrivingRoute || !Q)
		return;
	BMap.DrivingRoute.prototype.searchAsync = function (start, end, options) {
		var deferred = Q.defer();
		this.setSearchCompleteCallback(function (result) {
			deferred.resolve(result);
		});
		this.search(start, end, options);
		return deferred.promise;
	};
})();

