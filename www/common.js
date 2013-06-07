var DATAURL = "http://www.moidom.si/server/";
//DATAURL = "http://localhost:8080/server/";
var HTMLURL = "";

function getDataUrl()
{
    // this is prefix for server call urls
    return DATAURL;
}

function getHtmlUrl()
{
    // this is prefix sibling html pages
    return HTMLURL;
}


function errorText(id) {
	switch(id) {
	case 0:
		return "ni napake";
	case 1:
		return "podatek že obstaja";
	case 2:
		return "neveljavno uporabniško ime ali geslo";
	case 3:
		return "napačni vhodni podatki";
	case 4:
		return "uporabnik ni prijavljen";
	case 5:
		return "episma se ne da poslati";
	case 6:
		return "uporabnik ni potrjen";
	case 7:
		return "uporabnik je blokiran";
	case 8:
		return "prezgodnji datum ali čas";
	case 9:
		return "napačna obremenitev";
	case 10:
		return "napačni podatki v datoteki";
	case 11:
		return "izvoz podatkov je skrajšan, ker je preveč podatkov";
	case 12:
		return "napačni epoštni naslov, ima ločilo";
	case 13:
		return "uporabnikova seja je potekla, prijavi se ponovno";
	case 14:
	    return "uporabnik nima vzdrževalnih pravic";
	default:
		return "neopredeljena napaka";
	}
}


function parseDateTime(dateValue, dateFormat, timeValue, timeFormat) {
	var dateFmt = new Array(), timeFmt = new Array();
	var i = 0, j = 0;
	var dateParts = dateValue.match(/(\d+)/g);
	var timeParts = timeValue.match(/(\d+)/g);
	dateFormat.replace(/(yyyy|dd|mm)/g, function(part) { dateFmt[part] = i++; });
	timeFormat.replace(/(hh|mm|ss)/g, function(part) { timeFmt[part] = j++; });
	var date = new Date(dateParts[dateFmt['yyyy']], dateParts[dateFmt['mm']] - 1, dateParts[dateFmt['dd']],
						timeParts[timeFmt['hh']], timeParts[timeFmt['mm']], timeParts[timeFmt['ss']]);

	return date.getTime();
}
