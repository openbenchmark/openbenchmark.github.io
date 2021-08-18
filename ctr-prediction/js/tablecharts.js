
function model_tab(tableId, dataUrl) {
  $('#' + tableId).DataTable({
    "pageLength": 20,
    "lengthMenu": [[20, 50, 100, -1], [20, 50, 100, "All"]],
    "ajax": {
      "url": dataUrl,
      "dataSrc": "data"
    },
    "columns": [
      { "data": "year", "title": "Year" },
      { "data": "pub", "title": "Publication" },
      { "data": "model", "title": "Model" },
      { "title": "Paper",
        render: function (data, type, row, meta)
        {
          company = ""
          if (row.company != "") {
            company = '&nbsp;&nbsp;&nbsp;<i class="fa fa-flag-checkered fa-lg" aria-hidden="true" style="color:#c70404"></i> <strong>' + row.company + '</strong>';
          }
          return type === 'display' ?
            '<a href="' + row.link + '" target="_blank">' + row.paper + '</a>, by ' + row.authors + company : row.paper;
        }
      },
      { "data": "available", "title": "Available",
        render: function (data, type, row, meta)
        {
          return type === 'display' && data == "Y" ?
            '<i class="fa fa-check-square-o fa-lg" aria-hidden="true" style="color:#058f03"></i>' : "";
        }
      },
      { "data": "tags", "title": "Tags" }
    ]
  });
}


function result_tab(tableId, dataUrl) {
  $('#' + tableId).DataTable({
    "pageLength": 10,
    "lengthMenu": [[10, 20, 50, -1], [10, 20, 50, "All"]],
    "ajax": {
      "url": dataUrl,
      "dataSrc": "data"
    },
    "columns": [
      { "data": "year", "title": "Year" },
      { "data": "pub", "title": "Publication" },
      { "data": "model", "title": "Model" },
      { "data": "logloss", "title": "Logloss" },
      { "data": "auc", "title": "AUC" },
      { "data": "link", "title": "Reproducing-Steps",
        render: function (data, type, row, meta)
        {
          if (type === 'display')
          {
            data = '<a href=' + data + ' target="_blank">Link</a>';
          }
          return data;
        }
      },
      { "data": "contr", "title": "Contributor",
        render: function (data, type, row, meta)
        {
          if (type === 'display')
          {
            data = '<a href=https://github.com/' + data + ' target="_blank">' + data + '</a>';
          }
          return data;
        }
      }
    ]
  });
}