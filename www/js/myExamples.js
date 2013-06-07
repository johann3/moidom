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
	 	
	// Two-line diagram
	var d1 = [ [1, 1], [2, 2], [3, 2], [4, 3] ];
	var d2 = [ [1, 3], [2, 2], [3, 1], [4, 0] ];
	var data = [
		{data: d1},
	    {data: d2}
	];
	var options = {
		series: {
			lines: { show: true },
			points: { show: true },
			},
		xaxis: {
			ticks: [ 1, 2, 3, 4 ]
		}	
	};
	
		
	$.plot($("#twolines"), data, options);
	
	// Fancy histogram
	$.plot($("#fancyhist"),
		[
		 	{
		 		color: "rgba(0, 255, 0, 1 )",
		 		data: [ [10,5] ],
		 		bars: {
		 			show: true,
		 			barWidth: 10,
		 			align: "left" 
		 		}
		 	},
		 	{
		 		color: "yellow",
		 		data: [ [20,8] ],
		 		bars: {
		 			show: true,
		 			barWidth: 20,
		 			align: "left" 
		 		}
		 	},
		 	{
	 			color: "rgba(255, 140, 0, 1 )",
	 			data: [ [40,4] ],
	 			bars: {
	 				show: true,
	 				barWidth: 20,
	 				align: "left" 
	 			}
		 	},
		 	{
	 			color: "red",
	 			data: [ [60,2] ],
	 			bars: {
	 				show: true,
	 				barWidth: 10,
	 				align: "left" 
	 			}
		 	}
		], 
		{
			xaxis: {
				min: 0,
				max: 80,
				ticks: [ 10, 20, 40, 60, 70 ]
			}
		}
	);
	
	// Get data from the server (data sequence)
	//var srvdata = [ [10, 2], [20, 6], [40, 11], [60, 8] ];	// server data (simulation)
	var srvdata = new Array();
	var jx = new Array();
	var jy = new Array();

    $.ajaxSetup({
        async: false
    });

		$.getJSON("http://moidom.cosylab.com:8080/moidom/rest/timeSequences/dsretrievejson", function(json) {
			srvdata = json.dataSeq;
		}
	);
	
	/* srvdata = [ [10, 2], [20, 6], [40, 11], [60, 8] ]; */
	
	for (var cnt = 0; cnt < 4; cnt++)
	{
		jx[cnt] = srvdata[cnt][0];
		jy[cnt] = srvdata[cnt][1];
	}
	
	// Draw a graph
	// Server-data histogram
	
	$.plot($("#serverhist"),
		[
		 	{
		 		color: "rgba(0, 255, 0, 1)",
		 		data: [ [ jx[0], jy[0] ] ],
		 		bars: {
		 			show: true,
		 			barWidth: 10,
		 			align: "left" 
		 		}
		 	},
		 	{
		 		color: "rgba(255, 255, 0, 1)",
		 		data: [ [ jx[1], jy[1] ] ],
		 		bars: {
		 			show: true,
		 			barWidth: 20,
		 			align: "left" 
		 		}
		 	},
		 	{
	 			color: "rgba(255, 140, 0, 1)",
	 			data: [ [ jx[2], jy[2] ] ],
	 			bars: {
	 				show: true,
	 				barWidth: 20,
	 				align: "left" 
	 			}
		 	},
		 	{
	 			color: "rgba(255, 0, 0, 1)",
	 			data: [ [ jx[3], jy[3] ] ],
	 			bars: {
	 				show: true,
	 				barWidth: 10,
	 				align: "left" 
	 			}
		 	}
		], 
		{
			xaxis: {
				min: 0,
				max: 80,
				ticks: [ 10, 20, 40, 60, 70 ]
			}
		}
	);

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
		
