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
        }]
    };

    var FCDashboard = React.createClass({
        getInitialState: function () {
            return {
                eventTarget: ''
            };
        },
        handleCLick: function () {
            this.setState({
                event_target: 'btn_update_data'
            });
        },
        render: function () {
            var props_col_chart = {
                id: "column_chart",
                renderAt: "column_chart_container",
                type: "column2d",
                width:600,
                height: 400,
                dataFormat: "json",
                dataSource: myDataSource,
                eventTarget: this.state.event_target,
                impactedBy: ['btn_update_data']
            };

            // Filter the column chart's data
            if (this.state.event_target && this.state.event_target.length != 0) {
                props_col_chart.dataSource.data[2].label = "Art Supply Store";
                props_col_chart.dataSource.data[2].value = "420000";
                props_col_chart.dataSource.data[3].label = "P.C. Richard & Son";
                props_col_chart.dataSource.data[3].value = "210000";
            }
            else {
                props_col_chart.dataSource = myDataSource;
            }

            return (
                <div>
                    <react_fc.FusionCharts {...props_col_chart} />
                    <a  id='btn_update_data'
                        onClick={this.handleCLick}
                        className="btn btn-default"
                        href="#">{'Click me to change data'}</a>
                </div>
            );
        }
    })

    React.render(
        <FCDashboard />,
        document.getElementById('fc_react_app')
    );
});