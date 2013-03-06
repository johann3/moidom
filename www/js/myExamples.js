//**********************************************************************
// This script contains the code for drawing the charts on the main 
// page (index.html) and retrieval of the data from the server.
//**********************************************************************

//----------------------------------------------------------------------
//
// Example histogram which uses the local data
//

$.plot($("#histogram"),
	[
		{
			label: "Total Things",
			data: [ [2010, 450], [2012, 550], [2013, 320], [2014, 700] ],
			bars: {
				show: true,
				barWidth: 1,
				align: "left"
			}   
		}
	],
	{
		xaxis: {
			ticks: [
				[2010, "2010"],
				[2011, "2011"],
				[2012, "2012"],
				[2013, "2013"],
				[2014, "2014"]
			]
		}   
	}
);

//----------------------------------------------------------------------
//
// Time diagram which uses the data from the server
//

// Get data from the server (time sequence)
var srvtimeseq = new Array();

$.ajaxSetup({
	async: false
});

	$.getJSON("http://moidom.cosylab.com:8080/moidom/rest/timeSequences/tsretrievejson", function(json) {
		srvtimeseq = json.timeSeq;
	}
);

var data = [
	{data: srvtimeseq}
];
	
var options = {
	series: {
		lines: { show: true },
		points: { show: true },
		},
	xaxis: {
		mode: "time", 
		timeformat: "%d %b %y",
		minTickSize: [1, "month"],
		min: (new Date(2012, 0, 1)).getTime(),
		max: (new Date(2012, 5, 1)).getTime(),
		monthNames: ["jan", "feb", "mar", "apr", "maj", "jun", "jul", "avg", "sep", "okt", "nov", "dec"]
	}
};
	
$.plot($("#servertime"), data, options);
