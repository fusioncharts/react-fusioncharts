FusionCharts.ready(function () {
    var myDataSource = {
        chart: {
            caption: "Harry's SuperMart",
            subCaption: "Top 5 stores in last month by revenue",
            numberPrefix: "$",
            theme: "ocean"
        },
        data:[{
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
        }]
    };
    var props_column_chart = {
        id: "column_chart",
        renderAt: "column_chart_container",
        type: "column2d",
        width:600,
        height: 380,
        dataFormat: "json",
        dataSource: myDataSource,
        events : {
            dataplotclick: function (ev, props) {
                document.getElementById('value').innerHTML = props.displayValue;
            }
        }
    };
    React.render(
        <react_fc.FusionCharts {...props_column_chart} />,
        document.getElementById('fc_react_app')
    );
})