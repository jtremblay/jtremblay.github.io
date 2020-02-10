var formatYear = d3.timeFormat("%Y");
var formatRound = d3.format(".0f");

/*#################################
##### BAR CHART ###################
###################################*/

function barChart() {
    //Variables for global plot dimension.
    var data = []; 
    var year, names;
    var div, dom, svg, yScale, xScale;
    
    var margin = {top: 30, right: 0, bottom: 90, left: 50};
    var width = 1090 - margin.left - margin.right;
    var height = 160 - margin.top - margin.bottom;
    var barPadding = 0;
    var barWidth = 11;
    
    var updateWidth;
    var updateHeight;
    var updateFillColors;
    var updateData;
    var updateYear;
    //var sex;

    function chart(selection){
        selection.each(function () {
            
            //For initial graph select the first date.
            var sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
              .key(function(d) { return (d.year);})
              .entries(data);

            // Define the div for the tooltip
            div = d3.select("body").append("div")   
                .attr("class", "tooltip")               
                .style("opacity", 0);

            sumstat = sumstat[0].values;
            year = sumstat[0].year;
            names = uniqueBy(sumstat, "name");
            
            width = barWidth * names.length
            sumstat.forEach(function(d) {
                d.n = +d.n;
            });
            sumstat.sort(function(a, b) {
                return b.n - a.n;
            });
            
            // set the ranges
            xScale = d3.scaleBand()
                 .range([0, width])
                 .padding(0.1);
            yScale = d3.scaleLinear()
                 .range([height, 0]);
            // Scale the range of the data in the domains
            xScale.domain(sumstat.map(function(d) { return d.name; }));
            yScale.domain([0, d3.max(sumstat, function(d) { return +d.n; })]);
            
            // append the svg object to the body of the page
            // append a 'group' element to 'svg'
            // moves the 'group' element to the top left margin
            dom = d3.select(this);
            svg = dom.append('svg')
                .attr("class", "bar-chart")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            // append the rectangles for the bar chart
            var bars = svg.selectAll("rect.display-bar")
                .data(sumstat)
                .enter()
                .append("rect")
                .attr("class", "display-bar")
                .attr("x", function(d) { return xScale(d.name); })
                .attr("width", xScale.bandwidth())
                .attr("y", function(d) { return yScale(+d.n); })
                .attr("height", function(d) { return height - yScale(+d.n); })
                .on("mouseover", function(d){ showToolTip(d) })
                .on("mouseout", function(d) { hideToolTip(d) });      

            // add the x Axis
            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .attr("class", "xAxis")
                .call(d3.axisBottom(xScale))
                .selectAll("text")
                .style("text-anchor", "end")
                .attr("transform", "rotate(-90)")
                .attr("dx", "-0.8em")
                .attr("dy", "-0.45em");

            // add the y Axis
            svg.append("g")
                .attr("class", "yAxis")
                .call(d3.axisLeft(yScale).ticks(3));
            
            d3.select("#year")
                .append("text")
                .attr("class", "title-bar-chart")
                .attr("text-anchor", "start")
                .attr("y", 10)
                .attr("x", 100)
                .text(function(d){ return(year) })
                .style("fill", "#3973ac")
        
            //#####################
            // Tooltip functions:

            function showToolTip(d) {      
                div
                    .transition()        
                    .duration(200)      
                    .style("opacity", .9) 
                div
                    .html(function(){
                        var content = "<span style='margin-left: 2.5px;'><b>" + d.year + "</b></span><br>";
                        content +=`
                            <table style="margin-top: 2.5px;">
                                <tr><td>Name: </td><td style="text-align: right">`   + d.name + `</td></tr>
                                <tr><td>Number: </td><td style="text-align: right">` + d.n + `</td></tr>
                            </table>
                        `;
                        return content;
                    })
                    .style("left", (d3.event.pageX) + "px")     
                    .style("top", (d3.event.pageY - 28) + "px");
            }                  
            function hideToolTip(d) { 
                div
                    .transition()        
                    .duration(500)      
                    .style("opacity", 0);   
            }
 
            //##################### 
            // update functions
            updateWidth = function() {
                
                d3.select(".bar-chart").attr("width", width + margin.left + margin.right);
                xScale = d3.scaleBand()
                    .range([0, width])
                    .padding(0.1);
                
                // Scale the range of the data in the domains
                xScale.domain(sumstat.map(function(d) { return d.name; }));
                
                bars
                    .attr("width", xScale.bandwidth())
                    .attr("x", function(d) { return xScale(d.name); });

                d3.select(".xAxis")
                    .attr("class", "xAxis")
                    .transition().duration(1000)
                    .call(d3.axisBottom(xScale))
                    .selectAll("text")
                    .style("text-anchor", "end")
                    .attr("transform", "rotate(-90)")
                    .attr("dx", "-0.8em")
                    .attr("dy", "-0.45em");
            };

            updateHeight = function() {

                d3.select(".bar-chart").attr("height", height + margin.top + margin.bottom);
                yScale = d3.scaleLinear()
                    .range([height, 0]);
                yScale.domain([0, d3.max(sumstat, function(d) { return +d.n; })]);

                bars
                    .transition()
                    .duration(1000)
                    .attr("height", function(d) { return height - yScale(+d.n); })
                    .attr("y", function(d) { return yScale(+d.n); });

                d3.select(".yAxis")
                    .transition().duration(1000)
                    .call(d3.axisLeft(yScale).ticks(3));
                d3.select(".xAxis")
                    .attr("transform", "translate(0," + height + ")");
            };

            updateFillColor = function() {
                svg.transition().duration(1000).style('fill', fillColor);
            };

            updateData = function() {
                var sumstat2 = d3.nest()
                  .key(function(d) { return d.year;})
                  .entries(data);
        
                //Set year if year is unique... (global variable)
                years = uniqueBy(sumstat2, "key");
                //If more than one year, means we dont update. if multiple years: we'll take the one at index 0.
                // Could be multiple years when updating name. But we only want to show the filered names at the current year.
                if(years.length == 1){
                    year = sumstat2[0].key; 
                }

                var sumstat3 = sumstat2.filter(function(d) {
                    return d.key == year;
                });

                // Then filter by name
                sumstat3 = sumstat3[0].values;
                year = sumstat3[0].year;
                sex = sumstat3[0].sex;

                //Set names (global variables);
                names = uniqueBy(sumstat3, "name");
                
                //We target 9 px for bar width.
                //So we target 9px * names.length
                width = barWidth * names.length
                updateWidth(); 
                sumstat3.forEach(function(d) {
                    d.n = +d.n;
                });
                sumstat3.sort(function(a, b) {
                    return b.n - a.n;
                });
                
                xScale.domain(sumstat3.map(function(d) { return d.name; }));
                yScale.domain([0, d3.max(sumstat3, function(d) { return +d.n; })]);
                
                var update = svg.selectAll(".display-bar")
                   .remove().exit();
                       
                update.data(sumstat3).enter()
                    .append('rect')
                    .attr('class', "display-bar")
                    .attr("x", function(d) { return xScale(d.name); })
                    .attr("width", xScale.bandwidth())
                    .attr("y", function(d) { return yScale(+d.n); })
                    .attr("height", function(d) { return height - yScale(+d.n); })
                    .style('opacity', 0)
                    .on("mouseover", function(d){ showToolTip(d) })
                    .on("mouseout", function(d) { hideToolTip(d) }) 
                    .transition()
                    .duration(1000)
                    .style('opacity', 1);

                svg.select(".yAxis")
                        .transition().duration(1000)
                        .call(d3.axisLeft(yScale).ticks(3));
                
                svg.select(".xAxis")
                        .attr("class", "xAxis")
                        .transition().duration(1000)
                        .call(d3.axisBottom(xScale))
                        .selectAll("text")
                        .style("text-anchor", "end")
                        .attr("transform", "rotate(-90)")
                        .attr("dx", "-0.8em")
                        .attr("dy", "-0.45em")
            
                d3.select(".title-bar-chart")
                    .transition().duration(1000)
                    .text(function(d){ return(year)})
            }
            
            updateName = function(){
                console.log("Names: " + names);
            }
        });
    }

   /* 
    chart.updateYear = function(value) {
        if (!arguments.length) return "1980";
        year = value;
        if (typeof updateYear === 'function') updateYear();
        return chart;
    }
    chart.updateName = function(value) {
        if (!arguments.length) return "1980";
        names = value;
        if (typeof updateName === 'function') updateName();
        return chart;
    }
    */
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
        console.log("fillColors:");
        console.log(fillColors);
        if (typeof updateFillColors === 'function') updateFillColors();
        return chart;
    };

    chart.data = function(value) {
        if (!arguments.length) return data;
        data = value;
        if(data.length == 0){
            data = [{n: 1, name: "NO SELECTION", prop: "0.0", sex: "M", year: year}];
        }
        if (typeof updateData === 'function') updateData();
        return chart;
    };
    
    chart.getData = function() {
        return data;
    };
    return chart;
}
