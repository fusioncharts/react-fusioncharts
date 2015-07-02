var GTDDashboard = function (options) {

    /***
    ** Function to convert data in CSV to JSON
    ***/
    var csvToJson = function (csvData) {

        var rows=csvData.split("\n")
        ,   jsonData=[]
        ,   headers=rows[0].split(",")
        ,   rowsLength = rows.length

        for (var i=1 ; i<rowsLength ; i++) {
            var obj = {}
            ,   currentline=rows[i].split(",")
            ,   headersLength = headers.length;

            for(var j=0;j<headersLength;j++){
                obj[headers[j]] = currentline[j];
            }
            jsonData.push(obj);

        }

        /** CSV data converted to JSON format **/
        return jsonData;
    };


    /**
    ** Function to count the number of rows having
    ** a certain key with certain value.
    ***/
    var countBy = function () {
        var group = function(behavior) {
            return function(obj, iteratee, context) {
                var result = {};
                iteratee = iteratee;
                _each(obj, function(value, index) {
                    var key = iteratee(value, index, obj);
                    behavior(result, value, key);
                });
                return result;
            };
        };
        _countBy = group(function(result, value, key) {
            if (_has(result, key)) result[key]++; else result[key] = 1;
        });
        _has = function(obj, key) {
            return obj != null && Object.prototype.hasOwnProperty.call(obj, key);
        };
        _each = function(obj, iteratee, context) {
            iteratee = iteratee;
            var i, length;
            var keys = Object.keys(obj);
            for (i = 0, length = keys.length; i < length; i++) {
                iteratee(obj[keys[i]], keys[i], obj);
            }
            return obj;
        };
    };


    /***
    ** Function to look through each value in the list,
    ** returning an array of all the values that contain
    ** all of the key-value pairs listed in properties.
    ***/
    _where = function (list, key_value_pairs_to_be_searched) {
        var list_length = list.length,
            data_result = [];
        if(typeof list === "object") {
            for (var z in list) {
                var flag = 0,
                    no_of_keys = 0;
                for (var key in key_value_pairs_to_be_searched) {
                    if (list[z].hasOwnProperty(key) && list[z][key] === key_value_pairs_to_be_searched[key]) {
                        flag += 1;
                    }
                    else {
                        flag = 0;
                    }
                    no_of_keys += 1;
                }
                if (flag === no_of_keys) {
                    data_result.push(list[z]);
                }
            }
        } else {
            for (var z=0 ; z<list_length ; z++) {
                var flag = 0,
                    no_of_keys = 0;
                for (var key in key_value_pairs_to_be_searched) {
                    if (list[z].hasOwnProperty(key) && list[z][key] === key_value_pairs_to_be_searched[key]) {
                        flag += 1;
                    }
                    else {
                        flag = 0;
                    }
                    no_of_keys += 1;
                }
                if (flag === no_of_keys) {
                    data_result.push(list[z]);
                }
            }
        }
        return data_result;
    };


    /***
    ** Function to get the sum of a certain key where rows
    ** are having similar values.
    ***/
    var sumOf = function () {
        var getLength = function(key) {
            return function(obj) {
                return obj == null ? void 0 : obj[key];
            };
        };
        var isArrayLike = function(collection) {
            var length = getLength(collection);
            return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
        };


        /***
        ** Function to reduce down the data to a set of these rows
        ** where values of a certain key are similar.
        ***/
        function createReduce(dir) {
            function iterator(obj, iteratee, memo, keys, index, length) {
                for (; index >= 0 && index < length; index += dir) {
                    var currentKey = keys ? keys[index] : index;
                    memo = iteratee(memo, obj[currentKey], currentKey, obj);
                }
                return memo;
            }
            return function(obj, iteratee, memo, context) {
              var keys = !isArrayLike(obj) && Object.keys(obj),
                  length = (keys || obj).length,
                  index = dir > 0 ? 0 : length - 1;
                if (arguments.length < 3) {
                    memo = obj[keys ? keys[index] : index];
                    index += dir;
                }
                return iterator(obj, iteratee, memo, keys, index, length);
            };
        };
        _reduce = createReduce(1);
    }


    /***
    ** Function to get a list of of terrorist organizations
    ** and make a table with this data.
    ***/
    var gangNameList = function (data) {
        var gang_priority_data = []
        ,   gang_data = _countBy(data,function (d) {
                return d["gname"];
            });

        for(var gang in gang_data) {
            gang_priority_data.push({
                "name":gang,
                "count":gang_data[gang]
            });
        }

        // Creates the table for "Terrorist Organizations"
        gang_priority_data.sort(function(a,b) {
            return b.count - a.count;
        })
        var cnt = 1,i = 0;
        var html = '<table><tr class="tr_style"><th class="table_gang_name">Terrorist Organization</th><th class="table_no_of_attacks">No. of attacks</th></tr>'
        if(gang_priority_data.length > 5) {
            while(cnt < 6){
                if(gang_priority_data[i].name !== "Unknown") {
                    html += "<tr><td>" + gang_priority_data[i].name + "</td><td class='table_right'>" + gang_priority_data[i].count + "</td></tr>"
                    cnt++;
                }
                i++;
            }
        } else {
            while(i < gang_priority_data.length){
                html += "<tr><td>" + gang_priority_data[i].name + "</td><td class='table_right'>" + gang_priority_data[i].count + "</td></tr>"
                i++;
            }
        }
        $('#gangname').html(html+"</table>");
        $('.gangnames_header').show();
    }


    /***
    ** Function to execute the GTD Dashboard and
    ** fetch data and then call the render method
    ***/
    this.execute = function () {
        countBy();
        sumOf();

        /** Fetch CSV data **/
        $.ajax({
            url: 'data/globalterrorism.csv',
            type: 'get',
            dataType: 'text',
            success: function(data){
                var new_data = csvToJson(data);
                render(new_data);
            }
        });
    };


    /***
    ** Function to render the GTD Dashboard's elements
    ***/
    var render = function (new_data) {
        var map_data = []
        ,   attack_data = []
        ,   map
        ,   gang_priority_data = []
        ,   attack
        ,   numberOfAttacksByCountryConfigs
        ,   numberOfAttacksConfigs
        ,   numberOfAttacksByCountryDataSource
        ,   numberOfAttacksDataSource
        ,   numberOfCasualtiesDataSource
        ,   new_data_length = new_data.length
        ,   numberOfCasualtiesConfigs
        ,   chartHoverColor = "#81270C";


        /** Data and DataSource --- Pie Chart for "Number of Casualties" **/
        var num_killed = _reduce(new_data,function(memo,num){
            return memo+parseInt(num.nkill);
        },0);
        var num_wounded = _reduce(new_data,function(memo,num){
            return memo+parseInt(num.nwound);
        },0);
        numberOfCasualtiesDataSource = {
            chart: {
                caption: "NUMBER OF CASUALTIES",
                captionFontSize: "12",
                captionFont: '"AvenirLTStd-Heavy",sans-serif',
                captionAlignment: "center",
                theme: "zune",
                bgColor: "f6f6f6,f6f6f6",
                bgAlpha: "100,100",
                enableRotation: '0',
                enablemultislicing: "0",
                formatNumberScale: '0',
                paletteColors: "#D73200,#F6BD0F",
                plotFillHoverColor: chartHoverColor,
                plotFillHoverAlpha: "100",
            },
            data:[{
                "label":"Killed",
                "value":num_killed
            },
            {
                "label":"Wounded",
                "value":num_wounded
            }]
        }


        /** Data and DataSource --- Map for "Number of Attacks by Country" **/
        map = _countBy(new_data,function (d) {
            return d["country_code"];
        });
        for(d in map) {
            map_data.push(
                {
                    "id":d,
                    "value":map[d]
                }
            )
        }
        numberOfAttacksByCountryDataSource = {
            chart: {
                caption: "NUMBER OF ATTACKS BY COUNTRY",
                captionFontSize: "12",
                captionFontFamily: '"AvenirLTStd-Heavy",sans-serif',
                captionPosition: "top-left",
                subCaption: "Click on a country to filter by that country",
                subCaptionFontSize:'10',
                theme: "zune",
                bgColor: "f6f6f6,f6f6f6",
                bgAlpha: "100,100",
                fillColor: "#CED8D7",
                entityFillHoverColor: chartHoverColor,
                entityFillHoverAlpha: "100",
                entityBorderHoverThickness: "2",
                hoverOnEmpty: '0',
                showLegend: '0'
            },
            colorrange: {
                "color": [
                    {
                        "minvalue": "0",
                        "maxvalue": "100",
                        "code": "#F6BD0F"
                    },
                    {
                        "minvalue": "100",
                        "maxvalue": "1000",
                        "code": "#FB6725"
                    },
                    {
                        "minvalue": "1000",
                        "maxvalue": "10000",
                        "code": "#D73200"
                    }
                ]
            },
            data: map_data
        };


        /** Data and DataSource --- Column Chart for "Number of Attacks by Year" **/
        attack = _countBy(new_data,function (d) {
            return d["iyear"];
        });
        for(d in attack) {
            attack_data.push(
                {
                    "label":d,
                    "value":attack[d]
                }
            )
        }
        numberOfAttacksDataSource = {
            chart: {
                caption: "NUMBER  OF ATTACKS BY YEAR (2008-2013)",
                captionFontSize: "12",
                captionFont: '"AvenirLTStd-Heavy",sans-serif',
                captionAlignment: "left",
                subCaption: "Click on a column to filter by that year",
                theme: "zune",
                bgColor: "f6f6f6,f6f6f6",
                bgAlpha: "100,100",
                canvasBgAlpha: "0",
                paletteColors: "#F6BD0F",
                plotFillHoverColor: chartHoverColor,
                plotFillHoverAlpha: "100",
                placeValuesInside:'0',
                rotateValues: "0",
                valueFontColor: "#333333",
                subCaptionFontSize:'11',
                xAxisName: "Year",
                yAxisName: "Aggregated Number of Attacks",
                formatNumberScale: '0'
            },
            data:attack_data
        };


        /** React Parent Component --- GTDParent **/
        var GTDParent = React.createClass({
            getInitialState : function () {
                return {
                    country_selected: '',
                    year_selected: '',
                    event_target: ''
                }
            },
            filterCountry : function (selected_value, sender_id) {
                this.setState({
                    country_selected: selected_value,
                    event_target : sender_id
                });
            },
            filterYear : function (selected_value, sender_id) {
                this.setState({
                    year_selected: selected_value,
                    event_target : sender_id
                });
            },
            render: function () {
                var that = this
                ,   updated_attack_data = []
                ,   updated_data = []
                ,   updated_attack = []
                ,   numberOfAttacksAnnotations
                ,   numberOfAttacksByCountryAnnotations;


                /** Configuration options --- Column Chart for "Number of Attacks by Year" **/
                numberOfAttacksConfigs = {
                    id: "attacks-column-chart",
                    renderAt: "attacks-column-chart-container",
                    type: "column2d",
                    width: 750,
                    height: 250,
                    dataSource: numberOfAttacksDataSource,
                    eventTarget: this.state.event_target,
                    className:"attacks_years block",
                    impactedBy:['attacks-map'],
                    events: {
                        dataplotclick: function (event, args) {
                            var chartRef = event.sender,
                                createGroupItems = function() {
                                    if(numberOfAttacksAnnotations !== undefined && numberOfAttacksAnnotations.group && numberOfAttacksAnnotations.group.length >0) {
                                        numberOfAttacksAnnotations.destroy('yearWiseTotalAttack');
                                    }
                                    numberOfAttacksAnnotations = chartRef.annotations;

                                    // Adding a group, "totalFootfall"
                                    numberOfAttacksAnnotations.addGroup({
                                        'id': 'yearWiseTotalAttack'
                                    });

                                    //Adding rectangle annotation item to the annotation group
                                    numberOfAttacksAnnotations.addItem('yearWiseTotalAttack', {
                                        "id": "dyn-labelBG",
                                        "type": "rectangle",
                                        "radius": "3",
                                        "x": "$canvasEndX-200",
                                        "y": "$canvasStartY-40",
                                        "tox": "$canvasEndX",
                                        "toy": "$canvasStartY -10",
                                        "color": "#E46A3A",
                                        "alpha": "100"
                                    }, true);

                                    // Adding text annotation item to the annotation group
                                    numberOfAttacksAnnotations.addItem('yearWiseTotalAttack', {
                                        "id": "dyn-label",
                                        "type": "text",
                                        "text": args.categoryLabel + ": " + args.value + " attacks",
                                        "fillcolor": "#ffffff",
                                        "x": "$canvasEndX-100",
                                        "font": '"AvenirLTStd-Light",sans-serif',
                                        "fontsize": "14",
                                        "y": "$canvasStartY - 25"
                                    }, true);
                                }
                            that.filterYear(args.categoryLabel, event.sender.id);
                            createGroupItems();
                            // $('#selected-year').show().html(args.categoryLabel + ": " + args.value + " attacks");
                        }
                    }
                };

                /** Configuration options --- Pie Chart for "Number of Casualties" **/
                numberOfCasualtiesConfigs = {
                    id: "casulty-pie-chart",
                    renderAt: "casulty-pie-chart-container",
                    type: "pie2d",
                    width:500,
                    height: 500,
                    dataSource: numberOfCasualtiesDataSource,
                    eventTarget: this.state.event_target,
                    impactedBy:['attacks-map','attacks-column-chart'],
                    className:"casulty"
                };

                /** Configuration options --- Map for "Number of Attacks by Country" **/
                numberOfAttacksByCountryConfigs = {
                    id: "attacks-map",
                    renderAt: "attacks-map-container",
                    type: "Worldwithcountries",
                    width: 750,
                    height: 500,
                    dataSource: numberOfAttacksByCountryDataSource,
                    eventTarget: this.state.event_target,
                    className:"attack_world",
                    events: {
                        entityClick: function (event, args) {
                            var chartRef = event.sender,
                                createGroupItems = function() {
                                    if(numberOfAttacksAnnotations !== undefined && numberOfAttacksAnnotations.groups.length >0) {
                                        numberOfAttacksAnnotations.destroy('yearWiseTotalAttack')
                                    }
                                    if(numberOfAttacksByCountryAnnotations !== undefined) {
                                        numberOfAttacksByCountryAnnotations.destroy('countryWiseTotalAttack');
                                    }
                                    numberOfAttacksByCountryAnnotations = chartRef.annotations;

                                    // Adding a group, "totalFootfall"
                                    numberOfAttacksByCountryAnnotations.addGroup({
                                        'id': 'countryWiseTotalAttack'
                                    });

                                    //Adding rectangle annotation item to the annotation group
                                    numberOfAttacksByCountryAnnotations.addItem('countryWiseTotalAttack', {
                                        "id": "dyn-labelBG",
                                        "type": "rectangle",
                                        "radius": "3",
                                        "x": "$canvasEndX+535",
                                        "y": "$canvasStartY+10",
                                        "tox": "$canvasEndX+735",
                                        "toy": "$canvasStartY + 40",
                                        "color": "#E46A3A",
                                        "alpha": "100"
                                    }, true);

                                    // Adding text annotation item to the annotation group
                                    numberOfAttacksByCountryAnnotations.addItem('countryWiseTotalAttack', {
                                        "id": "dyn-label",
                                        "type": "text",
                                        "text": args.label + ": " + args.value + " attacks",
                                        "fillcolor": "#ffffff",
                                        "x": "$canvasEndX+635",
                                        "font": '"AvenirLTStd-Light",sans-serif',
                                        "fontsize": "14",
                                        "y": "$canvasStartY + 25"
                                    }, true);
                                };
                            if(args.value !== undefined) {
                                that.state.year_selected = "";
                                that.filterCountry(args.id, event.sender.id)
                                createGroupItems();
                            }
                        }
                    }
                };


                /** Filter data --- Column Chart for "Number of Attacks by Year" **/
                if(that.state.country_selected &&  that.state.country_selected.length !== 0 && !that.state.year_selected) {
                    updated_data = _where(new_data, {"country_code" : that.state.country_selected});
                    updated_attack = _countBy(updated_data,function (d) {
                        return d["iyear"];
                    });

                    for(d in updated_attack) {
                        updated_attack_data.push({
                            "label": d,
                            "value": updated_attack[d]
                        });
                    }

                    numberOfAttacksConfigs.dataSource.data = updated_attack_data;

                    var new_num_killed = _reduce(updated_data,function(memo,num){
                        return memo+parseInt(num.nkill);
                    },0)
                    var new_num_wounded = _reduce(updated_data,function(memo,num){
                        return memo+parseInt(num.nwound);
                    },0)
                    casulty_data = [{
                        "label":"Killed",
                        "value":new_num_killed
                    },
                    {
                        "label":"Wounded",
                        "value":new_num_wounded
                    }]
                    gangNameList(updated_data)
                    if(new_num_wounded !== 0 && new_num_killed !== 0) {
                        numberOfCasualtiesConfigs.dataSource.data = casulty_data;
                    } else {
                        numberOfCasualtiesConfigs.dataSource.data = []
                    }

                } else if(that.state.country_selected && that.state.country_selected.length !== 0 && that.state.year_selected && that.state.year_selected.length !== 0) {
                    updated_data_year = _where(new_data, {"iyear" : that.state.year_selected, "country_code" : that.state.country_selected});
                    var new_num_killed = _reduce(updated_data_year,function(memo,num){
                        return memo+parseInt(num.nkill);
                    },0)
                    var new_num_wounded = _reduce(updated_data_year,function(memo,num){
                        return memo+parseInt(num.nwound);
                    },0)
                    casulty_data = [{
                            "label":"Killed",
                            "value":new_num_killed
                        },
                        {
                            "label":"Wounded",
                            "value":new_num_wounded
                        }]
                    gangNameList(updated_data_year)
                    if(new_num_wounded !== 0 && new_num_killed !== 0) {
                        numberOfCasualtiesConfigs.dataSource.data = casulty_data;
                    } else {
                        numberOfCasualtiesConfigs.dataSource.data = []
                    }

                } else if (that.state.year_selected && that.state.year_selected.length !== 0) {
                    updated_data_year = _where(new_data, {"iyear" : that.state.year_selected});
                    var new_num_killed = _reduce(updated_data_year,function(memo,num){
                        return memo+parseInt(num.nkill);
                    },0)
                    var new_num_wounded = _reduce(updated_data_year,function(memo,num){
                        return memo+parseInt(num.nwound);
                    },0)
                    casulty_data = [{
                        "label":"Killed",
                        "value":new_num_killed
                    },
                    {
                        "label":"Wounded",
                        "value":new_num_wounded
                    }]
                    gangNameList(updated_data_year)
                    if(new_num_wounded !== 0 && new_num_killed !== 0) {
                        numberOfCasualtiesConfigs.dataSource.data = casulty_data;
                    } else {
                        numberOfCasualtiesConfigs.dataSource.data = []
                    }

                }

                return (
                    <div>
                        <div className="block">
                            <react_fc.FusionCharts {...numberOfAttacksByCountryConfigs} />
                            <span id="selected-country"></span>
                        </div>
                        <div id="casulty-data" className="block">
                            <react_fc.FusionCharts {...numberOfCasualtiesConfigs} />
                        </div>
                        <div style={{clear:"both"}}></div>
                        <hr className="hr-class"></hr>
                        <div className="block">
                            <react_fc.FusionCharts {...numberOfAttacksConfigs} />
                            <span id="selected-year"></span>
                        </div>
                        <div className="block">
                            <p className="gangnames_header">ATTACKS BY TOP 5 TERRORIST ORGANIZATIONS</p>
                            <div className="table_block" id="gangname"></div>
                        </div>
                    </div>
                );
            }
        });


        React.render(
            <GTDParent />,
            document.getElementById('gtd-dashboard-container')
        );

        gangNameList(new_data);
    };
};