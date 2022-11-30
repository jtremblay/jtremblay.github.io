function barCharts() {
    var dispatcher = d3.dispatch("was_clicked", "other_event", "mouseover", "mouseoverSample");
    // All options that should be accessible to caller
    var barPadding = 1;
    var fillColors =  [
                        "#0000CD", "#00FF00", "#FF0000", "#808080", "#000000", "#B22222", "#DAA520", 
                        "#DDA0DD", "#FF00FF", "#00FFFF", "#4682B4", "#E6E6FA", "#FF8C00", "#80008B", 
                        "#8FBC8F", "#00BFFF", "#FFFF00", "#808000", "#FFCCCC", "#FFE5CC", "#FFFFCC", "#E5FFCC", 
                        "#CCFFCC", "#CCFFE5", "#CCFFFF", "#CCE5FF", "#CCCCFF", "#E5CCFF", "#FFCCFF", "#FFCCE5", 
                        "#FFFFFF", "#990000", "#666600", "#006666", "#330066", "#A0A0A0", "#99004C"
                    ];
    var fillColor = 'coral';
    var data = [];
    var margin = {top: 20, right: 10, bottom: 100, left: 40};                                               
    var width = 350 - margin.left - margin.right;                                                         
    var height = 200 - margin.top - margin.bottom;
    var xAxisFontSize = "8px";
    var legendSpacingBetweenPlotsAndLegend = 650;

    var updateWidth;
    var updateHeight;
    var updateFillColors;
    var updateData;
    var highlightBars;
    var sortByTaxon;
    var samplesToHighlight = [];

    var dom, svg, yScale, zScale, domLegend, svgLegend, legend;
    var xScales = {}; var xAxes = {};

    function chart(selection){
        selection.each(function () {

            var keys = data.columns.slice(1);
            console.log("[taxa] data.columns");
            console.log(data.columns);
            console.log("[taxa]keys");
            console.log(keys);
            
            console.log("[taxa] data");
            console.log(data);

            dom = d3.select(this);
            svg = dom.selectAll('uniqueChart')
                .data(data)
                .enter()
                .append("div")
                //.attr("class", "chart")
                .attr("class", function(d){
                    let str = d.values[0].TimePoint;
                    str = str.replace(".", "");
                    return "chart " + str;
                })
                .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                    .attr("class", "group");
            
            /* X-Axis - custom to each sub charts*/
            svg
                .append("g")
                .attr("transform", "translate(0," + height + ")")
                .attr("class", "x-axis")
                .each(function(d,i){
                    var sampleList = d.values.map(function (el) { return el.Sample });
                    var xScale = d3.scaleBand()
                        .rangeRound([0, width])
                        .paddingInner(0.05)
                        .paddingOuter(0.2)
                        .align(0.1);
                    xScale.domain(sampleList);
                    
                    var xAxis = d3.axisBottom(xScale); 
                    d3.select(this).call(xAxis);
                    xScales[d.key] = xScale;
                    xAxes[d.key] = xAxis;

                })
                .selectAll("text")
                .style("text-anchor", "end")
                .attr("transform", "rotate(-90)")
                .style("font-weight", "bold")
                .style("font-size", xAxisFontSize)
                .attr("dx", "-0.8em")
                .attr("dy", "-0.45em");
           
            console.log(xScales);
            //console.log(xScales["Control.Day.2"].domain());
            console.log(xScales[data[0].key].domain());
            // set y scale
            yScale = d3.scaleLinear()
                .rangeRound([height, 0]);
            yScale.domain([0, 1]).nice();
            
            svg.append("g")
                .attr("class", "y-axis")
                .call(d3.axisLeft(yScale).ticks(5))
                .append("text")
                .attr("x", 2)
                .attr("y", yScale(yScale.ticks().pop()) + 0.5)
                .attr("dy", "0.32em")

            // set the colors
            zScale = d3.scaleOrdinal()
                .range(fillColors);

            // Define the div for the tooltip
            var tooltip = d3
              .select('body')
              .append('div')
              .attr('class', 'tooltip')
              .style('opacity', 0);

            zScale.domain(keys);
             
            //Then add rectangles (i.e. stacked bars).
            svg.append("g") // ->g
                .selectAll("g.layer")
                .data(function(d, i){
                    let innerArray = d3.stack()
                        .keys(keys)
                        (d.values);
                    return innerArray;
                })
                .enter().append("g")
                    .classed("layer", true) // -> g fill (populate) 
                    .attr("fill", d => zScale(d.key))
                .each(function(d,i){
                    /*The key here is to englobe the rect drawings into a .each block. First defile the x axis and then populate 
                        the rect with a d3.select(this).selectAll("rect")...*/
                    var sampleList = d.map(function (el) { return el.data.Sample });
                    //console.log(sampleList);
                    var xScale = d3.scaleBand()
                        .rangeRound([0, width])
                        .paddingInner(0.05)
                        .paddingOuter(0.2)
                        .align(0.1);
                    xScale.domain(sampleList);
                    
                    d3.select(this)
                        .selectAll("rect")
                        .data(d => d)
                        .enter()
                        //***
                        //.append("g")
                        //.attr("class", d => d.data.Sample)
                        //**
                        .append("rect")
                        .attr("class", d => d.data.Sample)
                        .attr("x", d => xScale(d.data.Sample))
                        .attr("y", d => yScale(d[1]))
                        .attr("height", d => yScale(d[0]) - yScale(d[1]))
                        .attr("width", xScale.bandwidth())
                        .style("stroke-width", "0.0")
                        .style('stroke', '#2378ae')
                        .on('mouseover', d => { //mouse over a given bar
                            //d3.select(this).style('opacity', 0.1);
                            samplesToHighlight = [d.data.Sample]
                            highlightBars();       
                            dispatcher.call("mouseoverSample", this, d.data.Sample)
                        })
                        .on('mouseout', d => { //mouse over a given bar
                            //d3.select(this).style('opacity', 0.1);
                            samplesToHighlight = [d.data.Sample]
                            unhighlightBars();       
                            //dispatcher.call("mouseoverSample", this, d.data.Sample)
                        })
                 })
                //mouse over a given panel
                .on('mouseover', d => {
                    let currValues = [];
                    d.map(function(e){
                        currValues.push(e[1].toFixed(2).toString()); 
                    });
                    tooltip
                        .transition()
                        .duration(200)
                        .style('opacity', 0.9);
                    tooltip
                        //.html(d.key + "<br/>" + currValues)// + '<br/>' + d.close)
                        .html(d.key + "<br/>")// + '<br/>' + d.close)
                        .style('left', d3.event.pageX + 'px')
                        .style('top', d3.event.pageY - 28 + 'px');
                    
                    dispatcher.call("mouseover", this, d[0].data.Treatment)
                 })
                .on('mouseout', () => {
                    tooltip
                        .transition()
                        .duration(500)
                        .style('opacity', 0);
                 })
                .on("click", function(d){
                    //console.log("[taxa] click:");
                    //console.log(d);
                    //console.log("[taxa] click2:");
                    //console.log(d[0].data.Treatment);
                    //TODO find a way to find x coord so we can extrapolate which sample is hovered.
                    dispatcher.call("was_clicked", this, d[0].data.Treatment)
                 });

            // Add titles
            svg 
                .append("text")
                .attr("class", "title")
                .attr("text-anchor", "start")
                .attr("y", -6) 
                .attr("x", (margin.left * (-1) + 10))
                .text(function(d){return(d.key)})
                .style("fill", function(d){ 
                    return "#4682B4";
                })
                .style("font-weight", 900);

            //Add legend
            domLegend = d3.select("#legendArea")
            svgLegend = domLegend.append("svg")
                .attr('class', 'legend')
                .attr('height', height + 400)
                .attr('width', width + legendSpacingBetweenPlotsAndLegend)
                .style('fill', "black")
                .style('font-weight', "600")
                .style('font-size', "11px")
            
            // would not work if I would have just wrote: svgLegend.append()... I'm still confused about why... 
            // Here I had to include a var legend ... statement to force embeeding the next appended g into svg class=legend
            legend = svgLegend.append("g")
                .classed("legend", true) 
                .selectAll("g.legend")
                .data(keys.slice().reverse())
                .enter().append("g")
                  .classed("legend", true) 
                  .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; })
            
            legend.append("rect")
                .classed("legend rect", true)
                .style("stroke-width", "1.5")
                .style("stroke", "#383838")
                .attr("rx", "4")
                .attr("x", 5)
                .attr("y", 4)
                .attr("width", 12)
                .attr("height", 12)
                .attr("fill", zScale)
                .on("click", function(d){
                    console.log("click legend element:");console.log(d);
                    sortByTaxon(d);
                    updateData();
                    //console.log("after sort:");console.log(data);
                })

            legend.append("text")
                //.attr("x", width - 24 - 25 )
                .attr("x", 30)
                .attr("y", 9.5)
                .attr("dy", "0.32em")
                .text(function(d) { return d; });
            /**********************************/
         
            // misc functions
            sortByTaxon = function(taxon) {
                data.map(function(d){
                    //console.log("d:");console.log(d);
                    return d.values.sort(function(a, b) { return b[taxon] - a[taxon]; });
                });  
            } 

            // update functions
            updateWidth = function() {
                widthScale = width / maxValue;
                bars.transition().duration(1000).attr('width', function(d) { return d * widthScale; });
                svg.transition().duration(1000).attr('width', width);
            };

            updateHeight = function() {
                barSpacing = height / data.length;
                barHeight = barSpacing - barPadding;
                bars.transition().duration(1000).attr('y', function(d, i) { return i * barSpacing; })
                    .attr('height', barHeight);
                svg.transition().duration(1000).attr('height', height);
            };

            updateFillColors = function() {
                //svg.transition().duration(1000).style('fill', fillColor);
                keys = data.columns.slice(1);
                z = d3.scaleOrdinal()
                    .range(fillColors);
                z.domain(keys);
                
                //update the plot itself
                svg.transition().duration(800).selectAll("g.layer").attr("fill", d => z(d.key));
                //update legend
                svgLegend.transition().duration(800).selectAll("rect.legend").attr("fill", z);
            };
            
            updateData = function() {
                //console.log("inside update:");console.log(data);
                keys = data.columns.slice(1);
                //console.log("keys:");console.log(keys);
                var speed = 1000;
            
                yScale.domain([0, 1]).nice();
               
                //Oh boy I struggled for this one. Basically, first loop through new updated data object and update the original xScales[n] according to their treatment unique key. So each loop we get the corresponding samples for the current treatment and update the original xScales domain xAxes.
                //Then We select all x.axis dom and their bound data, we loop with a .each() function and we update the current axis with d3.select(this)... .call(xAxes[d.key])...
                // Once the axes are updated, should be relatively straight forward to update the bar columns as well.
               
                let sampleToScale = {};
                data.map(function(d){
                    var sampleList = d.values.map(function(e){
                        sampleToScale[e.Sample] = d.key;
                        return e.Sample
                    })
                    //console.log("d");console.log(d);
                    //console.log("sampleList:")
                    //console.log(sampleList);

                    xScales[d.key].domain(sampleList);
                    xAxes[d.key] = d3.axisBottom(xScales[d.key]);
                }) 
                svg.selectAll(".x-axis")//.transition().duration(speed)
                    .each(function(d,i){
                        //console.log("d");
                        //console.log(d);
                        d3.select(this).transition().duration(speed)
                            .call(xAxes[d.key])
                            .selectAll("text")
                            .style("text-anchor", "end")
                            .attr("transform", "rotate(-90)")
                            .style("font-weight", "bold")
                            .style("font-size", xAxisFontSize)
                            .attr("dx", "-0.8em")
                            .attr("dy", "-0.45em");
                });
                svg.selectAll("g.layer").selectAll("rect")
                    //.data(d => d, e => e.data.Sample);
                    //.data(function(d){
                    //    console.log("d bars");
                    //    console.log(d);
                    //    return d;
                    //});
                    .each(function(d,i){
                        //console.log("d");console.log(d);
                        //currSampleName = d.values[i].Sample
                    
                        var bars = d3.select(this)
                        bars.exit().remove()
                        //console.log(bars);
                        bars.enter().append("rect")
                            .merge(bars)
                            .transition().duration(speed)
                            .attr("x", d => xScales[sampleToScale[d.data.Sample]](d.data.Sample))
                            .attr("y", d => yScale(d[1]))
                            .attr("height", d => yScale(d[0]) - yScale(d[1]))
                    })
            };

            highlightBars = function(){
               d3.selectAll("rect").filter("." + samplesToHighlight)//.selectAll(samplesToHighlight)
                    .transition().duration(200)
                    .style("stroke-width", function(d){
                        //console.log("stroke-width:");console.log(d);
                        return "2";
                    })
            }
            unhighlightBars = function(){
               d3.selectAll("rect").filter("." + samplesToHighlight)//.selectAll(samplesToHighlight)
                    .transition().duration(200)
                    .style("stroke-width", function(d){
                        //console.log("stroke-width:");console.log(d);
                        return "0";
                    })
            }
        });
    }

    chart.on = function() {
        var value = dispatcher.on.apply(dispatcher, arguments);
        return value === dispatcher ? chart : value;
    }

    chart.width = function(value) {
        if (!arguments.length) return width;
        width = value;
        if (typeof updateWidth === 'function') updateWidth();
        return chart;
    };

    chart.height = function(value) {
        if (!arguments.length) return height;
        height = value;
        if (typeof updateHeight === 'function') updateHeight();
        return chart;
    };

    chart.fillColors = function(value) {
        if (!arguments.length) return fillColors;
        fillColors = value;
        //console.log("fillColors:");
        //console.log(fillColors);
        if (typeof updateFillColors === 'function') updateFillColors();
        return chart;
    };

    chart.data = function(value) {
        if (!arguments.length) return data;
        data = value;
        if (typeof updateData === 'function') updateData();
        return chart;
    };
    
    chart.getData = function() {
        return data;
    };

    return chart;
}
