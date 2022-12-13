function scatterCharts() {
    //var dispatcher = d3.dispatch("was_clicked", "other_event");
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
    var margin = {top: 20, right: 10, bottom: 20, left: 40};                                               
    var marginLegend = {top: 20, right: 10, bottom: 20, left: 100};                                               
    var width = 400 - margin.left - margin.right;                                                         
    var height = 320 - margin.top - margin.bottom;
    var heightLegend = 230 - marginLegend.top - marginLegend.bottom;
    var widthLegend = 400 - marginLegend.right - marginLegend.left;
    var xAxisFontSize = "8px";
    var legendSpacingBetweenPlotsAndLegend = 650;

    var updateWidth;
    var updateHeight;
    var updateFillColors;
    var updateData;
    var updatePointsToHighlight;
    var updatePointsToIncreaseSize;
    var pointsToHighlight = [];
    var pointToHighlight = [];
    var pointsToIncreaseSize = [];

    var data, tooltip, xScale, yScale, zScale, shapes, shapesLarge, points, xAxis, yAxis, svg, brush, clip, scatter, xExtent, yExtent, idleTimeout, svgLegend;
    var color = d3.scaleOrdinal(d3.schemeCategory10);
    var circleInfo, brushInfo; 
    var fmt = d3.format(".2f");
    var idleDelay = 350;
    
    //var dom, svg, yScale, zScale, domLegend, svgLegend, legend;
    //var xScales = {}; var xAxes = {};

    function chart(selection){
        selection.each(function () {
    
            console.log("[scatter] data:");
            console.log(data);
            var keys = [];
            var variable2 = []; 
            data.forEach(function(d){
                d.posx = +d.posx;
                d.posy = +d.posy;
                if(keys.indexOf(d.TimePoint) == -1){
                    keys.push(d.TimePoint);
                }
                if(variable2.indexOf(d.Condition) == -1){
                    variable2.push(d.Condition);
                }
                d.highlight = false;
                d.highlightSampleID = false;
            });
            console.log("[scatter] keys:");
            console.log(keys);
    
            tooltip = d3.select("#tooltip")

	        xScale = d3.scaleLinear().range([0, width]);
	        yScale = d3.scaleLinear().range([height, 0]);

	        xAxis = d3.axisBottom(xScale);
	        yAxis = d3.axisLeft(yScale);

	        //Create scales
	        brush = d3.brush().extent([[0, 0], [width, height]]).on("brush", brushCb).on("end", brushended); //each time the brush selection changes, trigger the brushended function.

            dom = d3.select(this);
            svg = dom
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            /*
            svg = dom.selectAll('uniqueChart')
                .data(data)
                .enter()
                .append("div")
                .attr("class", "chart")
                .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                    .attr("class", "group");
            */
            clip = svg.append("defs").append("svg:clipPath")
	            .attr("id", "clip")
	            .append("svg:rect")
	            .attr("width", width )
                .attr("height", height )
	            .attr("x", 0) 
	            .attr("y", 0); 
    
            xExtent = d3.extent(data, function (d) { return d.posx; });
            yExtent = d3.extent(data, function (d) { return d.posy; });
            xScale.domain(d3.extent(data, function (d) { return d.posx; })).nice();
            yScale.domain(d3.extent(data, function (d) { return d.posy; })).nice();
	
	        scatter = svg.append("g")
   		        .attr("id", "scatterplot")
     	        .attr("clip-path", "url(#clip)");
   
            // set the colors
            zScale = d3.scaleOrdinal()
                .range(fillColors);
            zScale.domain(keys);

            //set the shapes
            //shapes = d3.scaleOrdinal(data.map(d => d.category), d3.symbols.map(s => d3.symbol().type(s)()))
            shapes = d3.scaleOrdinal(data.map(d => d.Condition), d3.symbols.map(s => d3.symbol().type(s).size(64)()))
            shapesLarge = d3.scaleOrdinal(data.map(d => d.Condition), d3.symbols.map(s => d3.symbol().type(s).size(164)()))
 
            //X axis
            svg.append("g")
                .attr("class", "x axis")
                .attr('id', "axis--x")
                .attr("transform", "translate(0," + (height - 0) + ")")
                .call(xAxis)
                .selectAll("text")
                .style("text-anchor", "end");

            //Y axis
            svg.append("g")
                .attr("class", "y axis")
                .attr('id', "axis--y")
                .attr("transform", "translate(" + 0 + ",0)")
                .call(yAxis)
                .selectAll("text")
                .style("text-anchor", "end");

            scatter.append("g")
                .attr("class", "brush")
                .call(brush);
            
            circleInfo = d3.select('#tooltip')
                .append('p')
                .html('<i>Click any circle</i>');
            
            brushInfo = d3.select('#tooltip')
                .append('p')
                .html('<i>Select a region</i>');
           
            //for circles
            /* 
            scatter.selectAll(".dot")
                .data(data)
                .enter()
                .append("circle")
                .attr("class", "dot")
                .attr("r", function(d) {return 5;})
                .attr("cx", function (d) { return xScale(d.posx); })
                .attr("cy", function (d) { return yScale(d.posy); })
                .attr("opacity", 0.82)
                .style("fill-opacity", 0.82)
                .style("fill", function(d) { return zScale(d.TimePoint); })
                //.attr("d", function(d) { return shapes(d.Condition) })
            */

            //for shapes
            scatter.selectAll(".dot")
                .data(data)
                .enter()
                .append("path")
                .attr("class", "dot")
                .attr("opacity", 0.82)
                .style("fill-opacity", 0.82)
                .style("stroke-opacity", 1.0)
                .style("fill", function(d) { return zScale(d.TimePoint); })
                .attr("d", function(d) { return shapes(d.Condition) })
                .attr("transform", function(d) { 
                    return "translate(" + xScale(d.posx) + "," + yScale(d.posy) + ")"; 
                })
            //text
            scatter.selectAll("text")
                .data(data).enter()
                .append("text")
                .text(function(d){
                    if(d.highlightSampleID == true){
                        return(d.SampleID);
                    }else{
                        return "";
                    }
                 })
                 .attr("x", d => xScale(d.posx) + 15)
                 .attr("y", d => yScale(d.posy) + 15)
                 .attr("font_family", "sans-serif")  // Font type
                 .attr("font-size", "11px")  // Font size
                 .attr("fill", "black");  

            //event
            points = scatter.selectAll(".dot")
                .data(data);
                
                points.on("mouseover", function (d, i) {
                    //console.log("Mouse over...\n");
                    var xy = d3.mouse(svg.node()),
                        xInv = xScale.invert(xy[0]),
                        yInv = yScale.invert(xy[1]);

                    //brush.extent([[xInv, yInv], [xInv, yInv]]);
                    circleInfo
                        .html(
                            "<b>x:</b>"     + fmt(d.posx) + 
                            "   <b>y:</b>"    + fmt(d.posy) + 
                            "   <b>SampleID:</b>" + (d.SampleID) +
                            "   <b>Variable1:</b>" + (d.TimePoint) +
                            "   <b>Variable2:</b>" + (d.Condition)
                        );
                });
            

            // Add titles
            svg 
                .append("text")
                .attr("class", "title")
                .attr("text-anchor", "start")
                .attr("y", -6) 
                .attr("x", (margin.left * (-1) + 10))
                .text("PCoA")
                .style("fill", "#4682B4")
                //.text(function(d){return(d.SampleID)})
                //.style("fill", function(d){ return "#4682B4"; })
                .style("font-weight", 900);

            //Add legend
            //domLegend = d3.select("#legendArea")
            svgLegend = dom.append("svg")
                .attr('class', 'legend')
                .attr("width", widthLegend + marginLegend.left + marginLegend.right)
                .attr("height", heightLegend + marginLegend.top + marginLegend.bottom)
                .attr("transform", "translate(" + marginLegend.left + "," + marginLegend.top + ")")
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

            // in each <g class legend translate(... block add color, text + shape + text.
            legend.append("rect")
                .classed("legend rect", true)
                .style("stroke-width", "1.5")
                .style("stroke", "#383838")
                .attr("rx", "4")
                .attr("x", 5)
                .attr("y", 4)
                .attr("width", 12) 
                .attr("height", 12) 
                .attr("fill", function(d){return zScale(d)})
                //.attr("fake", function(d){ console.log("fake: " + d)})
                .on("mouseover", function(d){
                    //console.log("click legend element:");console.log(d);
                    data.forEach(function(f){
                        if(d.indexOf(f.TimePoint) !== -1){
                            f.highlight = true;
                        }else{
                            f.highlight = false;
                        }
                    });
                    
                    points = scatter.selectAll(".dot")
                        .data(data)
                        .transition().duration(750)
                        .style("stroke-opacity", function(f){
                            if(f.highlight == false){
                                return 0.2;
                            }else{
                                return 1.0;
                            }
                        })
                        .style("opacity", function(f){
                            if(f.highlight == false){
                                return 0.2;
                            }else{
                                return 1.0;
                            }
                        })
                })
                .on("mouseout", function(d){
                    data.forEach(function(f){
                        f.highlight = false;
                    });
                    points = scatter.selectAll(".dot")
                        .data(data)
                        .transition().duration(750)
                        .style("stroke-opacity", function(f){
                            return 1.0;
                        })
                        .style("opacity", function(f){
                            return 1.0;
                        })

                })

            legend.append("text")
                //.attr("x", width - 24 - 25 )
                .attr("x", 30) 
                .attr("y", 9.5)
                .attr("dy", "0.32em")
                .text(function(d) { return d; });
     
            // then... shape + text.
            legend2 = svgLegend.append("g")
                .classed("legend2", true) 
                .selectAll("g.legend2")
                .data(variable2.slice().reverse())
                .enter().append("g")
                  .classed("legend2", true) 
                  .attr("transform", function(d, i) { return "translate(80," + ((i * 20) + 10) + ")"; })

            legend2.append("path")
                .classed("legend", true)
                .style("stroke-width", "1.5")
                .style("stroke", "#383838")
                .attr("x", 5)
                .attr("y", 5)
                .attr("width", 12) 
                .attr("height", 12) 
                .attr("d", shapes )
                .style("fill", function(d) { return "#333333"; })

            legend2.append("text")
                //.attr("x", width - 24 - 25 )
                .attr("x", 20) 
                .attr("y", 1)
                .attr("dy", "0.32em")
                .text(function(d) { return d; });

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
            
            updatePointsToHighlight = function() {
                data.forEach(function(d){
                    if(pointsToHighlight.indexOf(d.Treatment) !== -1){
                        d.highlight = true;
                    }else{
                        d.highlight = false;
                    }
                });
                
                points = scatter.selectAll(".dot")
                    .data(data)
                    .transition().duration(0.1)
                    .style("stroke-opacity", function(d){
                        if(d.highlight == false){
                            return 0.7;
                        }else{
                            return 1.0;
                        }
                    })
                    .style("opacity", function(d){
                        if(d.highlight == false){
                            return 0.7;
                        }else{
                            return 1.0;
                        }
                    })
            }

            updatePointToHighlight = function() {
                //console.log("point to highlight: ");console.log(pointToHighlight);
                data.forEach(function(d){
                    if(pointToHighlight.indexOf(d.SampleID) !== -1){
                        d.highlightSampleID = true;
                        //console.log("indexOf: ");console.log(d);
                    }else{
                        d.highlightSampleID = false;
                    }
                });
                
                points = scatter.selectAll(".dot")
                    .data(data)
                    .transition().duration(0.1)
                    .style("stroke-opacity", function(d){
                        if(d.highlightSampleID == false){
                            return 0.7;
                        }else{
                            return 1.0;
                        }
                    })
                    .style("opacity", function(d){
                        if(d.highlightSampleID == false){
                            return 0.7;
                        }else{
                            return 1.0;
                        }
                    })
                    .attr("d", function(d) {
                        if(d.highlightSampleID == true){
                            return shapesLarge(d.Condition);
                        }else{
                            return shapes(d.Condition);
                        }
                    })
                  
                  points = scatter.selectAll("text")
                    .data(data)
                    //.enter()
                    //.append("text")
                        .text(function(d){
                            if(d.highlightSampleID == true){
                                return(d.SampleID);
                                //console.log("appendText: ");console.log(d);
                            }else{
                                return "";
                            }
                        })
                        //.attr("x", d => y(d.posx))
                        //.attr("y", d => y(d.posy))
            }

            updatePointsToIncreaseSize = function() {
                data.forEach(function(d){
                    if(pointsToIncreaseSize.indexOf(d.Treatment) !== -1){
                        d.highlight = true;
                    }else{
                        d.highlight = false;
                    }
                });
                
                // Here it is not really an updateData(), only one property was potentially changed.
                points = scatter.selectAll(".dot")
                    .data(data)
                    .transition().duration(550)
                    //.style("stroke-opacity", function(d){
                    //    if(d.highlight == false){
                    //        return 0.4;
                    //    }else{
                    //        return 1.0;
                    //    }
                    //})
                    .attr("d", function(d) {
                        if(d.highlight == true){
                            return shapesLarge(d.Condition);
                        }else{
                            return shapes(d.Condition);
                        }
                    })
            };

            function brushCb() {
                var t = 0;

                var s = d3.event.selection;
                if (s === null){
                    t = 0;
                } else {
                    var x0 = xScale.invert(s[0][0]);
                    var x1 = xScale.invert(s[1][0]);
                    var y0 = yScale.invert(s[1][1]);
                    var y1 = yScale.invert(s[0][1]);
                    
                    //console.log("x0:" + x0 + "\n" + "y0:" + y0 + "\n" + "x1:" + x1 + "\n" + "y1:" + y1 + "\n");

                    data.forEach(function (d) {
                        //console.log("d.posx: " + d.posx + "\n");
                        if (x0 <= d.posx && d.posx <= x1 && y0 <= d.posy && d.posy <= y1){
                            t += 1;
                            //console.log("yes");
                        }
                    });
                }

                brushInfo
                    .html('<b>Selected circles:</b> ' + t);
            }

            function brushended() {

                var s = d3.event.selection;
                if (!s) {
                    if (!idleTimeout) return idleTimeout = setTimeout(idled, idleDelay);
                    xScale.domain(d3.extent(data, function (d) { return d.posx; })).nice();
                    yScale.domain(d3.extent(data, function (d) { return d.posy; })).nice();
                } else {
                    
                    xScale.domain([s[0][0], s[1][0]].map(xScale.invert, xScale));
                    yScale.domain([s[1][1], s[0][1]].map(yScale.invert, yScale));
                    scatter.select(".brush").call(brush.move, null);
                }
                console.log("calling zoom()");
                zoom();
                updateData();
            }

            function idled() {
                idleTimeout = null;
            }

            function zoom() {

                var t = scatter.transition().duration(750);
                svg.select("#axis--x").transition(t).call(xAxis);
                svg.select("#axis--y").transition(t).call(yAxis);
                
                scatter
                 .selectAll(".dot")
                 .transition(t)
                 //.attr("cx", function (d) { return xScale(d.posx); })
                 //.attr("cy", function (d) { return yScale(d.posy); });
                 .attr("transform", function(d) { 
                    return "translate(" + xScale(d.posx) + "," + yScale(d.posy) + ")"; 
                 });

            }


            updateData = function() {
                //for circles
                /*
                var circles = scatter.selectAll("circle")
                    .data(data);

                circles.enter()
                 .append("circle")
                 .style("fill-opacity", 1.0)
                 //.style("fill", function(d) { return "#21908dff";  })
                 .style("fill", function(d) { return zScale(d.TimePoint); })
                 .attr("cx", function (d) { return xScale(d.posx); })
                 .attr("cy", function (d) { return yScale(d.posy); })
                 .attr("r", function(d) {return 5;});

                console.log("inside scatter.enter()");
                
                circles.exit()
                 .remove();

                circles.on("mousedown", function (d, i) {
                    console.log("Mouse down...\n");
                    var xy = d3.mouse(svg.node()),
                        xInv = xScale.invert(xy[0]),
                        yInv = yScale.invert(xy[1]);

                    //brush.extent([[xInv, yInv], [xInv, yInv]]);
                    circleInfo
                        .html(
                            "<b>x:</b>"     + fmt(d.posx) + 
                            "   <b>y:</b>"    + fmt(d.posy) + 
                            "   <b>Size:</b>" + fmt(d.Treatment)
                        );
                });
                */
                //for shapes
                
                points = scatter.selectAll(".dot")
                    .data(data);
                //console.log("[pcoa]");

                points.enter()
                 .append("path")
                 .style("fill-opacity", 0.82)
                 .style("stroke-opacity", function(d){
                    if(d.highlight == false){
                        return 0.4;
                    }else{
                        return 1.0;
                    }
                 })
                 //.style("fill", function(d) { return "#21908dff";  })
                 .style("fill", function(d) { return zScale(d.TimePoint); })
                 .attr("d", function(d) { return shapes(d.Condition) })
                 .attr("transform", function(d) { 
                    return "translate(" + xScale(d.posx) + "," + yScale(d.posy) + ")"; 
                 });
            
                //console.log("inside scatter.enter()");
                
                points.exit()
                 .remove();

                points.on("mouseover", function (d, i) {
                    //console.log("Mouse over...\n");
                    var xy = d3.mouse(svg.node()),
                        xInv = xScale.invert(xy[0]),
                        yInv = yScale.invert(xy[1]);

                    //brush.extent([[xInv, yInv], [xInv, yInv]]);
                    circleInfo
                        .html(
                            "<b>x:</b>"     + fmt(d.posx) + 
                            "   <b>y:</b>"    + fmt(d.posy) + 
                            "   <b>SampleID:</b>" + (d.SampleID) +
                            "   <b>Variable1:</b>" + (d.TimePoint) +
                            "   <b>Variable2:</b>" + (d.Condition)
                        );
                });
            };
        });
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
    
    chart.pointsToHighlight = function(value) {
        if (!arguments.length) return pointsToHighlight;
        pointsToHighlight = value;
        //console.log("pointsToHighlight");
        //console.log(pointsToHighlight);
        if (typeof updatePointsToHighlight  === 'function') updatePointsToHighlight();
        return chart;
    };
    chart.pointToHighlight = function(value) {
        if (!arguments.length) return pointToHighlight;
        pointToHighlight = [value];
        //console.log("pointToHighlight");
        //console.log(pointToHighlight);
        if (typeof updatePointToHighlight  === 'function') updatePointToHighlight();
        return chart;
    };
    
    chart.pointsToIncreaseSize = function(value) {
        if (!arguments.length) return pointsToIncreaseSize;
        pointsToIncreaseSize = value;
        //console.log("pointsToIncreaseSize");
        //console.log(pointsToIncreaseSize);
        if (typeof updatePointsToHighlight  === 'function') updatePointsToIncreaseSize();
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
