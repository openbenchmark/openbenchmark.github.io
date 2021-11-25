function add_nav_li(link, link_name, page_name, mode = 0) {
    var new_nav = document.createElement('li');
    var a = document.createElement('a');
    if(window.location.href.split('/').reverse()[1]=='leaderboard' && data[i]["link"].substring(0,4)!='http'){
        a.href = "../"+link;
    }
    else{
        a.href = link;
    }
    a.innerHTML = link_name;
    if (mode == 1) {
        a.setAttribute("target",'_blank');
    }
    if (page_name==link_name) {
        new_nav.setAttribute("class","active");
    }
    new_nav.appendChild(a);
    document.getElementById("nav_ul").appendChild(new_nav);
}
function add_nav_ul(name, data, page_name) {
    var new_li = document.createElement('li');
    var a0 = document.createElement("a");
    a0.href = "#LeadBoard";
    a0.setAttribute("data-toggle", "collapse");
    a0.setAttribute("aria-expanded", false);
    a0.setAttribute("class","dropdown-toggle");
    a0.innerHTML = name;
    new_li.appendChild(a0);
    var new_ul = document.createElement('ul');
    new_ul.setAttribute("class","collapse list-unstyled");
    new_ul.setAttribute("id","LeadBoard");

    for (var i = 0; i < data.length; i = i + 1) {
        var sub_li = document.createElement('li');
        var sub_a = document.createElement('a');
        if(data[i]["name"]==page_name){
            sub_li.setAttribute("class","active");
        }
        if(window.location.href.split('/').reverse()[1]=='leaderboard' && data[i]["link"].substring(0,4)!='http'){

            sub_a.href = "../"+data[i]["link"];
        }
        else{
            sub_a.href = data[i]["link"];
        }
        sub_a.innerHTML = data[i]["name"];
        sub_li.appendChild(sub_a);
        new_ul.appendChild(sub_li);
    }
    new_li.appendChild(new_ul);
    document.getElementById("nav_ul").appendChild(new_li);

}

function add_nav(page_name) {
    // load nav json data 
    var nav_json = "https://openbenchmark.github.io/candidate-matching/nav.json"
    var request = new XMLHttpRequest();
    request.open("get", nav_json);
    request.send(null);
    request.onload = function () {
        if (request.status == 200) {
            var nav_data = JSON.parse(request.responseText);
            for (var i = 0; i < nav_data.length; i = i + 1) {
                if (nav_data[i].hasOwnProperty("type")) {
                    add_nav_ul(name=nav_data[i]["name"],data=nav_data[i]["data"],page_name=page_name);
                }
                else {
                    if (nav_data[i].hasOwnProperty("name")) {
                        add_nav_li(link = nav_data[i]['link'], link_name = nav_data[i]["name"], page_name,mode = nav_data[i]["mode"]);
                    }
                    else {
                        add_nav_li(link = nav_data[i]["link"], link = nav_data[i]["name"],page_name);
                    }
                }

            }
        }
    }
}