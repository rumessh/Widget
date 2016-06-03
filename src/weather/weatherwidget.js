(function(){

var scriptElement = document.createElement('script');
scriptElement.setAttribute('type', 'text/javascript');
scriptElement.setAttribute('name', 'angularscript');
scriptElement.setAttribute('src', 'https://ajax.googleapis.com/ajax/libs/angularjs/1.5.5/angular.min.js');
scriptElement.onreadystatechange = scriptElement.onload = function(){
	bootstrapAngular();
}

var styleSheet = document.createElement('link');
styleSheet.setAttribute('type', 'text/css');
styleSheet.setAttribute('rel', 'stylesheet');
styleSheet.setAttribute('href', 'weatherwidget.css');

var widgetDiv = document.createElement('div');
widgetDiv.setAttribute('ng-app', 'widgetApp');
widgetDiv.setAttribute('id', 'widgetApp');
var widgetContainerDiv = document.getElementById('weatherWidget');
window.locationName = widgetContainerDiv.dataset.location;
window.regionName = widgetContainerDiv.dataset.region; 
widgetContainerDiv.appendChild(widgetDiv); 
document.getElementsByTagName('head')[0].appendChild(scriptElement);
document.getElementsByTagName('head')[0].appendChild(styleSheet);

var widgetDirective = document.createElement('div');
widgetDirective.setAttribute('weather-widget', '');
document.getElementById('widgetApp').appendChild(widgetDirective);

var bootstrapAngular = function() {
	var widgetTemplate = '<div class="ww-container">'+
' <span class="ww-city">{{widget.weatherInfo.location}}</span>'+
' <div class="ww-temp-container">'+
'   <div class="ww-temp-inner-table">'+
'     <span class="ww-temp">{{widget.weatherInfo.temp}}&deg;{{widget.weatherInfo.tempUnit}}</span>'+
'     <div class="ww-temp-image-container">'+
'       <div class="ww-temp-image-inner-box">'+
'         <img ng-src="{{widget.weatherInfo.image}}">'+
'         <figcaption>{{widget.weatherInfo.condtionDesc}}</figcaption>'+
'       </div>'+
'     </div>'+
'   </div>'+
' </div>'+
' <div class="ww-forecast-container">'+
'   <div  ng-repeat= "forecast in widget.weatherInfo.forecasts" ng-show="$index < 5" class="ww-forecast-box">'+
'     <div  class="ww-forecast-day">'+
'       {{forecast.day}}'+
'     </div>'+
'     <div class="ww-forecast-img-box">'+
'       <img ng-src="{{forecast.image}}" class="ww-forecast-img">'+
'     </div>'+
'     <div>{{forecast.low}}&deg;/{{forecast.high}}&deg;</div>'+
'   </div>'+
' </div>'+
'</div>';
	angular.module('widgetApp', [])
  .controller('WidgetAppController', WidgetAppController)
  .directive('weatherWidget', WeatherWidget)
  .service('widgetUpdateService', WidgetUpdateService);
  
  WidgetAppController.$inject = ['widgetUpdateService'];
  function WidgetAppController(widgetService) {
  		var vm = this;
      vm.init = init;
      
      function init() {
      	getWeatherInfo();
      }
      
      function getWeatherInfo() {
      	widgetService.getWeatherInfo(function(weatherInfo){
        	vm.weatherInfo = weatherInfo;
          console.log(vm.weatherInfo);
        });
      }
  }
  
  function WeatherWidget(){
  	var directive = {
    	template: widgetTemplate,
      controller: 'WidgetAppController',
      controllerAs: 'widget',
      link: link
    };
    
    return directive;
    
    function link(scope, element, attrs, widget) {
    	widget.init();
    }
  }
  
  WidgetUpdateService.$inject = ['$http'];
  function WidgetUpdateService($http) {
    console.log(window.locationName);
  	var service = this;
    service.getWeatherInfo = function(callback) {
      $http.get("https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22"+window.locationName+"%2C%20"+window.regionName+".%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys").then(function(weatherInfo){
            processWeatherInfo(weatherInfo, callback);
          }, function(error) {
            console.log(error);
       });
    }
    function processWeatherInfo(weatherInfo, callback) {
     		var processedInfo = {};
        var tempObj = weatherInfo.data.query.results.channel;
        var tempUnit = tempObj.units.temperature;
        processedInfo.location = tempObj.location.city+", "+tempObj.location.region;
        processedInfo.temp = tempObj.item.condition.temp;
		processedInfo.tempUnit = tempUnit;
        processedInfo.image = "http://l.yimg.com/a/i/us/we/52/"+tempObj.item.condition.code+".gif";
        processedInfo.condtionDesc = tempObj.item.condition.text;
        processedInfo.forecasts = [];
        angular.forEach(tempObj.item.forecast, function(value, key) {
        	if(key != 0) {
            value.image = "http://l.yimg.com/a/i/us/we/52/"+value.code+".gif";
            this.push(value);
          }
				}, processedInfo.forecasts);
        callback(processedInfo);
     }
  }
}
}());