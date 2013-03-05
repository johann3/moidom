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
