/**
 * Copyright (c) 2013 by Cosylab d.d.
 *
 * The full license specifying the redistribution, modification, usage and other
 * rights and obligations is included with the distribution of this project in
 * the file LICENSE.
 *
 * THIS SOFTWARE IS PROVIDED AS-IS WITHOUT WARRANTY OF ANY KIND, NOT EVEN THE
 * IMPLIED WARRANTY OF MERCHANTABILITY. THE AUTHOR OF THIS SOFTWARE, ASSUMES
 * _NO_ RESPONSIBILITY FOR ANY CONSEQUENCE RESULTING FROM THE USE, MODIFICATION,
 * OR REDISTRIBUTION OF THIS SOFTWARE.
 */

$(function () {
    var partial = [];
    var prev_e = 0;

    var energy = [];
    var power  = [];
    var timestamps = [];

    // dirty trick to force getJSON into immediately loading the object
    // TODO: replace once the loading is settup properly
    $.ajaxSetup({
        async: false
    });

    var j = $.getJSON("sungate.json", { inverter: "1" }, function(json) {
        energy = json.energy;
        power  = json.power;
    });

    // first correct the timestamps - they are recorded as the daily
    // midnights in UTC+0100, but Flot always displays dates in UTC
    // so we have to add one hour to hit the midnights in the plot
    for (var i = 0; i < energy.length; ++i) {
      prev_e = energy[i > 0 ? i - 1 : 0][1];
      partial[i] = new Array(energy[i][0], energy[i][1] - prev_e);
    }

    // helper for returning the weekends in a period
    function nightAreas(axes) {
        var markings = [];
        var d = new Date(axes.xaxis.min);
        // go to the first Saturday
        d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 1) % 7))
        d.setUTCSeconds(0);
        d.setUTCMinutes(0);
        d.setUTCHours(0);
        var i = d.getTime();
        do {
            // when we don't set yaxis, the rectangle automatically
            // extends to infinity upwards and downwards
            markings.push({ xaxis: { from: i, to: i + 2 * 24 * 60 * 60 * 1000 } });
            i += 7 * 24 * 60 * 60 * 1000;
        } while (i < axes.xaxis.max);

        return markings;
    }

    function kwFormatter(val, axis) {
        return val.toFixed(axis.tickDecimals) + " kW";
    }

    var options = {
        xaxes: [ { mode: "time", timeformat: "%d %b %H:%M", tickLength: 5 } ],
        yaxes: [ { min: 0 }, { alignTicksWithAxis: true, position: "right" } ],
        selection: { mode: "x" },
        crosshair: { mode: "xy" },
        grid: { markings: nightAreas, hoverable: true, autoHighlight: true },
        series: { lines: { show: true } },
        legend: { position: 'ne' }
    };

    var data = [
        { data: power, tickFormatter: function (v) { return v + " kW"; }, label: "Actual power (kW)" },
        { data: energy, tickFormatter: kwFormatter, label: "Cumulative power (kW)" , yaxis: 2 }
    ];
    var plot = $.plot($("#placeholder"), data, options);

    var overview = $.plot($("#overview"), data, {
        series: {
            lines: { show: true, lineWidth: 1 },
            shadowSize: 0
        },
        xaxis: { ticks: [], mode: "time" },
        yaxis: { ticks: [], min: 0, autoscaleMargin: 0.1 },
        selection: { mode: "x" },
        legend: false,
    });

    /*
    legends.each(function () {
        // fix the widths so they don't jump around
        $(this).css('width', $(this).width());
    });
    */

    // now connect the two
    
    $("#placeholder").bind("plotselected", function (event, ranges) {
        // do the zooming
        plot = $.plot($("#placeholder"), data,
                      $.extend(true, {}, options, {
                          xaxis: { min: ranges.xaxis.from, max: ranges.xaxis.to }
                      }));

        // don't fire event on the overview to prevent eternal loop
        overview.setSelection(ranges, true);
    });

    $("#overview").bind("plotselected", function (event, ranges) {
        plot.setSelection(ranges);
    });

    var updateLegendTimeout = null;
    var latestPosition = null;

    function updateLegend() {
        updateLegendTimeout = null;

        var legends = $("#placeholder .legendLabel");
        var pos = latestPosition;

        var axes = plot.getAxes();
        if (pos.x < axes.xaxis.min || pos.x > axes.xaxis.max ||
            pos.y < axes.yaxis.min || pos.y > axes.yaxis.max)
            return;

        var i, j, dataset = plot.getData();
        for (i = 0; i < dataset.length; ++i) {
            var series = dataset[i];

            // find the nearest points, x-wise
            for (j = 0; j < series.data.length; ++j)
                if (series.data[j][0] > pos.x)
                    break;

            // now interpolate
            var y, p1 = series.data[j - 1], p2 = series.data[j];
            if (p1 == null)
                y = p2[1];
            else if (p2 == null)
                y = p1[1];
            else
                y = p1[1] + (p2[1] - p1[1]) * (pos.x - p1[0]) / (p2[0] - p1[0]);

            if (series.label.match(/.*=.*/))
                legends.eq(i).text(series.label.replace(/=.*/, "= " + y.toFixed(2) + " kW"));
            else
                legends.eq(i).text(series.label.replace(/\(.*/, "= " + y.toFixed(2) + " kW"));
        }
    }

    function showTooltip(x, y, contents) {
        $('<div id="tooltip">' + contents + '</div>').css( {
            position: 'absolute',
            display: 'none',
            top: y - 5,
            left: x + 5,
            border: '1px solid #fdd',
            padding: '2px',
            'background-color': '#fee',
            opacity: 0.80
        }).appendTo("body").fadeIn(200);
    }

    var previousPoint = null;
    $("#placeholder").bind("plothover", function (event, pos, item) {
        $("#x").text(pos.x.toFixed(2));
        $("#y").text(pos.y.toFixed(2));

        if (item) {
            if (previousPoint != item.dataIndex) {
                previousPoint = item.dataIndex;

                $("#tooltip").remove();
                var x = item.datapoint[0].toFixed(2);
                var y = item.datapoint[1].toFixed(2);
                var d = $.plot.formatDate(new Date(item.datapoint[0]), "%b %d at %H:%M:%S", null);

                showTooltip(item.pageX, item.pageY,
                            item.series.label + " on " + d + " = " + y);
            }
        }
        else {
            $("#tooltip").remove();
            previousPoint = null;
        }

        latestPosition = pos;
        if (!updateLegendTimeout)
            updateLegendTimeout = setTimeout(updateLegend, 50);
    });

});