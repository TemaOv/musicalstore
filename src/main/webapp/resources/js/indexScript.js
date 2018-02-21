$(document).ready(function () {
    $("#searchContent").css("display", "none");
    $("#searchComponents").css("display", "none");

    $.ajax({
        type: "GET",
        url: "http://localhost:8983/solr/music_core/select?",
        success: function (data) {
            console.log("Solr core online.");
            $("#searchComponents").css("display", "block");
        },
        error: function (e) {
            console.log("Solr core not online. Hide search components.");
        }
    });
	$.ajax({
        type: "POST",
        url: getQueryUrl(queryGetGroups),
        success: function (response) {
            var groups = response["results"]["bindings"];
            groups.forEach(function(item){
            	var link = parseUrl(item);
            	var template = "<div class=\"groupData\">" + link + "</div>";
            	$("#groupsContent").append(template);
            });
        },
        error: function (e) {
            console.log("ERROR : ", e);
        }
    });	
    $.ajax({
        type: "POST",
        url: getQueryUrl(queryGetArtists),
        success: function (response) {
            var artists = response["results"]["bindings"];
            artists.forEach(function(item){
            	var link = parseUrl(item);
            	var template = "<div class=\"artistData\">" + link + "</div>";
            	$("#artistsContent").append(template);
            });
        },
        error: function (e) {
            console.log("ERROR : ", e);
        }
    });
    $.ajax({
        type: "POST",
        url: getQueryUrl(queryGetSongs),
        success: function (response) {
            var songs = response["results"]["bindings"];
            songs.forEach(function(item){
            	var link = parseUrl(item);
            	var template = "<div class=\"songData\">" + link + "</div>";
            	$("#songsContent").append(template);
            });
        },
        error: function (e) {
            console.log("ERROR : ", e);
        }
    });
});

function parseUrl(obj) {
	return "<a href=\"" + obj["url"]["value"] + "\">" + obj["name"]["value"] + "</a>"
}

function search() {
    var searchString = $("#search").val();
    if(!searchString) {
        alert("Empty searcg string!");
        return;
    }

    var requestString = "http://localhost:8983/solr/music_core/select?q=" + searchString;
    $.ajax({
        type: "GET",
        url: requestString,
        success: function (data) {
            //var json = JSON.parse(data);
            var json = data;
            if (json["response"]["numFound"] == 0) {
                alert("Not found");
                return;
            }
            $("#searchResults").empty();

            var results = json["response"]["docs"];
            for(var i = 0; i < results.length; i++) {
                var uri = results[i]["uri"];
                var template = "<div class=\"search-result\">\
                                    <a href=\"" + uri + "\">" + uri + "</a>\
                                </div>";
                $("#searchResults").append(template);
            }

            $("#defaultContent").css("display", "none");
            $("#searchContent").css("display", "block");
        },
        error: function (e) {
            console.log("ERROR : ", e);
        }
    });
}