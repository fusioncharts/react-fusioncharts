react-fusioncharts
==================

Simple and effective React bindings for FusionCharts JavaScript Charting Library. It helps build UI components and include interactivity for FusionCharts.

### Features
* Add a chart using just a single ReactJS component
* Auto-updates your chart object on modifying the dataSource
* Option to include interactivity between charts
* Offers advanced control by giving you access to full FusionCharts object
* Has variety of ways to add a chart, from JSON URL to Props Array Binding

### Examples
Here is the syntax for rendering a FusionChart.
```javascript
var chartConfigs = {
    type: ...,
    renderAt: ...,
    className: ..., // ReactJS attribute-name for DOM classes
    dataFormat: ...,
    dataSource: ...
};

React.render(
    <react_fc.FusionCharts {...chartConfigs} />,
    document.getElementById('chart-container')
);
```

OR

```javascript
React.render(
    <react_fc.FusionCharts
        type: ...,
        renderAt: ...,
        className: ...,
        dataFormat: ...,
        dataSource: ... />,
    document.getElementById('chart-container')
);
```

Let's take an example of rendering a bar chart depicting the revenue of top five stores of Harry's Supermarket.
```javascript
var myDataSource = {
   	chart: {
       	caption: "Harry's SuperMart",
       	subCaption: "Top 5 stores in last month by revenue",
       	numberPrefix: "$",
   	},
   	data:[
	    {
	       	label: "Bakersfield Central",
	       	value: "880000"
	   	},
	   	{
	       	label: "Garden Groove harbour",
	       	value: "730000"
	    },
	    {
	       	label: "Los Angeles Topanga",
	       	value: "590000"
	    },
	    {
	       	label: "Compton-Rancho Dom",
	       	value: "520000"
	    },
	    {
	       	label: "Daly City Serramonte",
	       	value: "330000"
	    }
   	]
};

var chartConfigs = {
   	id: "revenue-chart",
   	renderAt: "revenue-chart-container",
   	type: "column2d",
   	width:600,
   	height: 400,
   	dataFormat: "json",
   	dataSource: myDataSource
};

React.render(
   	<react_fc.FusionCharts {...chartConfigs} />,
   	document.getElementById("chart-container")
);
```

### [Demos and Documentation](http://fusioncharts.github.io/react-fusioncharts/)
##### Contributors: [Pykih](https://pykih.com/)