function createModelTable(tableId, dataUrl) {
    $('#' + tableId).DataTable({
        "pageLength": 20,
        "lengthMenu": [
            [20, 50, 100, -1],
            [20, 50, 100, "All"]
        ],
        "ajax": {
            "url": dataUrl,
            "dataSrc": "data"
        },
        "order": [
            [0, "desc"]
        ],
        "columns": [
            { "data": "year", "title": "Year" },
            { "data": "pub", "title": "Publication" },
            { "data": "model", "title": "Model" },
            {
                "title": "Paper",
                render: function(data, type, row, meta) {

                    var company = ""
                    var content = row.paper
                    if (row.company != "") {
                        company = '&nbsp;&nbsp;&nbsp;<i class="fa fa-flag-checkered fa-lg" aria-hidden="true" style="color:#c70404"></i> <strong>' + row.company + '</strong>';
                    }
                    if (type === 'display')
                        if (row.link != "") {
                            content = '<a href=' + row.link + ' target="_blank">' + row.paper + '</a>, by ' + row.authors + company
                        } else {
                            content = row.paper + ' by ' + row.authors + company
                        }
                    return content
                }
            },
            { "data": "tags", "title": "Tags" },
            {
                "data": "code",
                "title": "Code",
                render: function(data, type, row, meta) {
                    if (data != '' & type === 'display') {
                        data = '<a href=' + data + ' target="_blank"><i class="fa fa-external-link fa-lg" aria-hidden="true" style="color:#058f03"></i></a>';
                    }
                    return data;
                }
            }
        ]
    });
}


function createTableChart(tableId, chartId, dataUrl) {
    $('#' + tableId).DataTable({
        "pageLength": 10,
        "lengthMenu": [
            [10, 20, 50, -1],
            [10, 20, 50, "All"]
        ],
        "ajax": {
            "url": dataUrl,
            "dataSrc": "data"
        },
        "order": [
            [5, "desc"]
        ],
        "columns": [
            { "data": null, "title": "No", "orderable": false, "searchable": false },
            { "data": "year", "title": "Year" },
            { "data": "pub", "title": "Publication" },
            { "data": "model", "title": "Model" },
            { "data": "logloss", "title": "Logloss" },
            { "data": "auc", "title": "AUC" },
            {
                "data": "link",
                "title": "Reproduce-Steps",
                render: function(data, type, row, meta) {
                    if (data != '' & type === 'display') {
                        data = '<a href=' + data + ' target="_blank"><i class="fa fa-external-link fa-lg" aria-hidden="true" style="color:#058f03"></i></a>';
                    }
                    return data;
                }
            },
            {
                "title": "Contributor",
                render: function(data, type, row, meta) {
                    var content = row.contr
                    if (type === 'display') {
                        content = '<a href=' + row.contr_url + ' target="_blank">' + row.contr + '</a>';
                    }
                    return content;
                }
            }
        ],
        "drawCallback": function(settings) {
            var table = this.api();
            // get row id
            table.column(0, { search: 'applied' }).nodes().each(function(cell, i) {
                    cell.innerHTML = i + 1;
                })
                // get table data
            var dataArray = chartData(table);
            // Output the data for the visible rows to the browser's console
            console.log(dataArray);
            // create Highcharts
            plotChart(dataArray, chartId);
        }
    });
}


function chartData(table) {
    var dataArray = [],
        xArray = [],
        yMetric1 = [],
        yMetric2 = [];
    // loop table rows
    table.rows({ search: "applied" }).every(function() {
        var data = this.data();
        xArray.push(data.model);
        yMetric1.push(parseFloat(data.auc));
        yMetric2.push(parseFloat(data.logloss));
    });
    // store all data in dataArray
    dataArray.push(xArray, yMetric1, yMetric2);
    return dataArray;
}


function plotChart(data, chartId) {
    Highcharts.setOptions({
        lang: {
            thousandsSep: ","
        }
    });

    Highcharts.chart(chartId, {
        title: {
            text: "Benchmarking Results of Existing Models"
        },

        subtitle: {
            text: ""
        },

        xAxis: [{
            categories: data[0],
            labels: {
                rotation: -50
            }
        }],

        yAxis: [{
                // first yaxis
                title: {
                    text: "AUC"
                }
            },

            {
                // secondary yaxis
                title: {
                    text: "Logloss"
                },

                // min: 0,
                opposite: true
            }
        ],

        series: [{
                name: "AUC",
                color: "#FF404E",
                type: "spline",
                data: data[1]
            },

            {
                name: "Logloss",
                color: "#0071A7",
                type: "spline",
                data: data[2],
                yAxis: 1
            }
        ],

        tooltip: {
            shared: true
        },

        legend: {
            backgroundColor: "#fcfcfc",
            shadow: true
        },

        credits: {
            enabled: false
        },

        noData: {
            style: {
                fontSize: "20px"
            }
        }
    });
}