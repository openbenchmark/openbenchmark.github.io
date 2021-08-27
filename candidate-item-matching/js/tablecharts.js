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
                    if (row.company != "") {
                        company = '&nbsp;&nbsp;&nbsp;<i class="fa fa-flag-checkered fa-lg" aria-hidden="true" style="color:#c70404"></i> <strong>' + row.company + '</strong>';
                    }
                    return type === 'display' & data != '' ?
                        '<a href="' + row.link + '" target="_blank">' + row.paper + '</a>, by ' + row.authors + company : row.paper;
                }
            },
            {
                "data": "available",
                "title": "Available",
                render: function(data, type, row, meta) {
                    return type === 'display' && data == "Y" ?
                        '<i class="fa fa-check-square-o fa-lg" aria-hidden="true" style="color:#058f03"></i>' : "";
                }
            },
            { "data": "tags", "title": "Tags" }
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
            [4, "desc"]
        ],
        "columns": [
            { "data": null, "title": "No", "orderable": false, "searchable": false },
            { "data": "year", "title": "Year" },
            { "data": "pub", "title": "Publication" },
            { "data": "model", "title": "Model" },
            { "data": "recall_20", "title": "Recall@20" },
            { "data": "recall_50", "title": "Recall@50" },
            { "data": "ndcg_20", "title": "NDCG@20" },
            { "data": "ndcg_50", "title": "NDCG@50" },
            { "data": "hit_rate_20", "title": "Hit Rate@20" },
            { "data": "hit_rate_50", "title": "Hit Rate@50" },

            {
                "data": "link",
                "title": "Reproducing-Steps",
                render: function(data, type, row, meta) {
                    if (data != '' & type === 'display') {
                        data = '<a href=' + data + ' target="_blank">Link</a>';
                    }
                    return data;
                }
            },
            {
                "data": "contr",
                "title": "Contributor",
                render: function(data, type, row, meta) {
                    if (type === 'display') {
                        data = '<a href=https://github.com/' + data + ' target="_blank">' + data + '</a>';
                    }
                    return data;
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
        yMetric1.push(parseFloat(data.recall_20));
        yMetric2.push(parseFloat(data.ndcg_20));

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
                    text: "Recall@20"
                }
            },

            {
                // secondary yaxis
                title: {
                    text: "NDCG@20"
                },

                // min: 0,
                opposite: true
            }
        ],

        series: [{
                name: "Recall@20",
                color: "#FF404E",
                type: "spline",
                data: data[1]
            },

            {
                name: "NDCG@20",
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