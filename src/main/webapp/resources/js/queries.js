var endpointUrl = "http://localhost:3030/ds/query";

function getQueryUrl(queryString) {
    return endpointUrl + "?query=" + encodeURIComponent(queryString) + "&format=json";
}

function getDataQuery(uri) {
    var query = "PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>\
                 PREFIX music: <http://localhost:8080/music/resources/xml/ontology#>\
                 PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\
                 SELECT ?pred ?obj ?predLbl ?objLbl\
				 WHERE {\
					<" + uri + "> ?pred ?obj.\
  					?pred rdfs:label ?predLbl.\
  					FILTER (CONTAINS(?predLbl, \"\"@en)).\
  					OPTIONAL {?obj rdfs:label ?objLbl}\
				}";
	return getQueryUrl(query);			
}

function getLabelQuery(uri) {
	var query = "PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>\
				PREFIX music: <http://localhost:8080/music/resources/xml/ontology#>\
				PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\
				SELECT ?label\
				WHERE {\
					<" + uri + "> rdfs:label ?label.\
					FILTER(CONTAINS(?label, \"\"@en))\
				}";
	return	getQueryUrl(query);
}

function getSeeAlsoQuery(uri) {
  var query = "PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>\
              PREFIX music: <http://localhost:8080/music/resources/xml/ontology#>\
              PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\
              SELECT ?pred ?obj \
              WHERE { \
              <" + uri + "> rdfs:seeAlso ?obj.\
              }";
  return getQueryUrl(query)
}

var queryGetGroups = "PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>\
                      PREFIX music: <http://localhost:8080/music/resources/xml/ontology#>\
                      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\
                      SELECT ?name ?url\
                      WHERE {\
                      	?url a music:MusicalGroup.\
                      	?url music:hasName ?name.\
                      }\
                      LIMIT 5";
var queryGetArtists = "PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>\
                      PREFIX music: <http://localhost:8080/music/resources/xml/ontology#>\
                      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\
                      SELECT ?name ?url\
                      WHERE {\
                      	?url a music:Artist.\
                      	?url music:hasName ?name.\
                      }\
                      LIMIT 5";
var queryGetSongs = "PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>\
                      PREFIX music: <http://localhost:8080/music/resources/xml/ontology#>\
                      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\
                      SELECT ?name ?url\
                      WHERE {\
                      	?url a music:Song.\
                      	?url music:hasName ?name.\
                      }\
                      LIMIT 5";
