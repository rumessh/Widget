# Widget
Repository for embeddable widgets
#Weather widget
Embeddable widget build on AngularJS. It can be embedded in any website. Yahoo weather API is used to get the weather updates
###Preview <a href="http://rumessh.github.io/src/weather/WeatherWidgetDemo.html" target="_blank">here</a>
##Usage
Include the following line after ```<body>``` tag
```html
<script type="text/javascript" src="weatherwidget.js"></script>
```
And Include the following div where you want to place the widget.
```html
<div id="weatherWidget" data-location="Atlanta" data-region="GA">
</div>
```
###data-location
  location to get the weather updates.
###data-region
  State of the location


