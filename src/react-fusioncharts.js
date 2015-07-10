var react_fc = {};

(function (ns) {

    //private scoping
    var global;

    ns.FusionCharts = React.createClass({displayName: "FusionCharts",
      componentWillMount: function () {
        global = this;
        global.fc_configs = global.props;
      },
      componentDidMount: function () {
        global = this;

        global.fc_chart = new FusionCharts(global.fc_configs);
        global.fc_chart.render();
      },
      render: function() {
        return (
          React.createElement("div", {className: global.fc_configs.className, id: global.fc_configs.renderAt})
        );
      },
      componentDidUpdate: function () {
        global = this;
        var arr_impacted_by = global.fc_configs.impactedBy;
        if (arr_impacted_by && arr_impacted_by.length > 0 && arr_impacted_by.indexOf(global.props.eventSource) > -1) {
          global.fc_chart.setChartAttribute(global.fc_configs);
          global.fc_chart.setChartData(global.fc_configs.dataSource);
        }
      }
    });

})(react_fc);