FusionCharts.ready(function () {
    var mYdataSource = {
        "chart": {
            "caption": "Quarterly Revenue for FY2013-2014",
            "subCaption": "Harry's SuperMart",
            "xAxisName": "Quarter",
            "yAxisName": "Revenue",
            "numberPrefix": "$",
            "paletteColors": "#0075c2",
            "bgColor": "#ffffff",
            "borderAlpha": "20",
            "canvasBorderAlpha": "0",
            "usePlotGradientColor": "0",
            "plotBorderAlpha": "10",
            "placevaluesInside": "1",
            "rotatevalues": "1",
            "valueFontColor": "#ffffff",
            "showXAxisLine": "1",
            "xAxisLineColor": "#999999",
            "divlineColor": "#999999",
            "divLineIsDashed": "1",
            "showAlternateHGridColor": "0",
            "subcaptionFontBold": "0",
            "subcaptionFontSize": "14"
        },
        "data": [{
            "label": "Q1",
            "value": "420000"
        }, {
            "label": "Q2",
            "value": "810000"
        }, {
            "label": "Q3",
            "value": "720000"
        }, {
            "label": "Q4",
            "value": "550000"
        }]
    };

    var FCApp = React.createClass({
        getInitialState: function () {
            return {
                event_target: ''
            };
        },
        leftAlignCaption: function () {
            this.setState(function () {
                return {
                    event_target: 'left'
                }
            });
        },
        centerAlignCaption: function () {
            this.setState(function () {
                return {
                    event_target: 'center'
                }
            });
        },
        rightAlignCaption: function () {
            this.setState(function () {
                return {
                    event_target: 'right'
                }
            });
        },
        render: function() {
            var that = this;

            // Initialize configurations for FusionCharts
            var fc_configs_object = {
                id: "column_chart",
                renderAt: "column_chart_container",
                width: 600,
                height: 400,
                type: "column2d",
                impactedBy: ['left','center','right'],
                eventTarget: this.state.event_target,
                dataSource: mYdataSource
            };

            if (that.state.event_target && that.state.event_target.length != 0) {
                fc_configs_object.dataSource.chart.captionAlignment = that.state.event_target;
            }
            else {
                fc_configs_object.dataSource.chart.captionAlignment = 'center';
            }

            return (
                <div id='fc_dashboard'>
                    <react_fc.FusionCharts {...fc_configs_object} />
                    Change Caption Alignment: <input type="radio" id="left" name="captionalignment" onClick={this.leftAlignCaption}> Left </input>
                    <input type="radio" id="center" checked name="captionalignment" onClick={this.centerAlignCaption}>Center</input>
                    <input type="radio" id="right" name="captionalignment" onClick={this.rightAlignCaption}> Right </input>
                </div>
            );
        }
    });

    React.render(
        <FCApp />,
        document.getElementById('fc_react_app')
    );
});