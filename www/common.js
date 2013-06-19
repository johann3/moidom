var DATA_URL = "http://www.moidom.si/server/";
//DATA_URL = "http://localhost:8080/server/";
var HTML_URL = "";

function getDataUrl()
{
    // this is prefix for server call urls
    return DATA_URL;
}

function getHtmlUrl()
{
    // this is prefix for sibling html pages
    return HTML_URL;
}

var JSON_STATUS_OK = 0;
var JSON_STATUS_NOT_LOGGED_IN = 4;
var JSON_STATUS_SESSION_EXPIRED = 7;

// the functions checks the 'status', depending on it
// it either changes the web page to the login page (not logged in, no more logged in)
// or shows an error messages (other errors)
// or doesn noting special if status is fine
// The functions returns true if the status means an error.
function dataStatusIsBad (status, status_loc)
{
    if (status != JSON_STATUS_OK) {
        if (status == JSON_STATUS_NOT_LOGGED_IN  ||  status == JSON_STATUS_SESSION_EXPIRED) {
            alert('Niste (več) prijavljeni, sledi začetna stran');
            top.location.href = HTML_URL + 'index.html';
        } else {
            alert('Pošiljanje podatkov ni uspelo, strežnik je vrnil napako: ' + status_loc);
        }
        return true;
    }
    return false;
}


function ajaxError(data, textStatus, xhr)
{
    alert('Pošiljanje podatkov ni uspelo, strežnik ni dosegljiv: ' + textStatus);
}

function localizeDecimal (decimal)
{
    return decimal.toString().replace('.', ',');
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
