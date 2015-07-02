FusionCharts.ready(function () {
	var myDataSource = {
		chart: {
		  	caption: "Harry's SuperMart",
		  	subCaption: "Top 5 stores in last month by revenue",
		  	numberPrefix: "$",
		  	theme: "ocean"
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
	var revenueChartConfigs = {
		id: "revenue-chart",
	    renderAt: "revenue-chart-container",
		type: "column2d",
		width:600,
        height: 400,
	  	dataFormat: "json",
	  	dataSource: myDataSource
	};
	React.render(
		<react_fc.FusionCharts {...revenueChartConfigs} />,
		document.getElementById('chart-container')
	);
});