window.addEventListener("hashchange", function() {
	location.reload();
}, false);

$(document).ready(function () {
    var currentURI = window.location;
    var dataAboutUri;
    var labelForUri;
    $.ajax({
        type: "POST",
        url: getDataQuery(currentURI),
        async: false,
        success: function (response) {
            dataAboutUri = response["results"]["bindings"];
        },
        error: function (e) {
            console.log("ERROR : ", e);
        }
    });
    $.ajax({
        type: "POST",
        url: getLabelQuery(currentURI),
        async: false,
        success: function (response) {
            labelForUri = response["results"]["bindings"];
        },
        error: function (e) {
            console.log("ERROR : ", e);
        }
    });
    if (labelForUri[0] != null) {
    	var lblTemplate = "<div class=\"label\"> " + labelForUri[0]["label"]["value"] + " </div><hr/>"
    } else {
    	var lblTemplate = "<div class=\"label\"> " + getLabelFromURI() + " </div><hr/>"
    }
    $("#content").append(lblTemplate);

    var processedTypes = [];
    for (var i = 0; i < dataAboutUri.length; i++) {
    	var item = dataAboutUri[i];
    	var type = item["obj"]["type"];
    	if (processedTypes.indexOf(type) > -1) {
    		continue;
    	}
    	processedTypes[processedTypes.length] = type;

    	var itemsWithType = findAllItemsWithType(dataAboutUri, type);
    	switch(type) {
    		case "literal":
    			$("#content").append(parseAllLiterals(itemsWithType));
    			break;
    		case "uri":
    			$("#content").append(parseAllURIs(itemsWithType));
    			break;
    	}
    }
});

function parseAllLiterals(items) {
	var names = [];
	items.forEach(function(item){
		names[names.length] = getLiteralName(item);
	});
	names = names.filter(onlyUnique);
	
	var html = "";
	names.forEach(function(name){
		var values = "";
		for (var i = 0; i < items.length; i++) {
			if (getLiteralName(items[i]) == name) {
				values += getLiteralValue(items[i]) + ", ";
			}
		}
		values = values.substring(0, values.length - 2); // delete last ', '
		html += "<div class=\"dataItem\">" + name + " : " + values + "</div>\n";
	});
	return html;
}

function parseAllURIs(items) {
	var names = [];
	items.forEach(function(item){
		names[names.length] = getURIName(item);
	});
	names = names.filter(onlyUnique);

	var html = "";
	names.forEach(function(name){
		var values = "";
		for (var i = 0; i < items.length; i++) {
			if (getURIName(items[i]) == name) {
				values += "<a href=\"" + getURILink(items[i]) + "\">" + getLinkName(items[i]) + "</a>, ";
			}
		}
		values = values.substring(0, values.length - 2);
		html += "<div class=\"dataItem\">" + name + " : " + values + "</div>\n";
	});
	return html;
}

function getLiteralName(item) {
	return item["predLbl"]["value"];
}

function getLiteralValue(item) {
	var itemValue = item["obj"]["value"];
	if (item["obj"]["datatype"] === "http://www.w3.org/2001/XMLSchema#dateTime") {
		itemValue = itemValue.substring(0, itemValue.indexOf("T"));
	}
	return itemValue;
}

function getURIName(item) {
	return item["predLbl"]["value"];
}

function getURILink(item) {
	return item["obj"]["value"];
}

function getLinkName(item) {
	return item["objLbl"]["value"];
}

function getLabelFromURI(){
	var uri = window.location.href;
	return uri.substring(uri.indexOf("#") + 1);
}

function findAllItemsWithType(items, type) {
	var allItemWithType = [];
    for (var j = 0; j < items.length; j++){
    	if (items[j]["obj"]["type"] === type) {
    		allItemWithType[allItemWithType.length] = items[j];
    	}
    }
    return allItemWithType;
}

function onlyUnique(value, index, self) {
	return self.indexOf(value) === index;
}