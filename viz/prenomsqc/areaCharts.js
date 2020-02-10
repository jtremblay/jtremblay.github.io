var formatYear = d3.timeFormat("%Y");
var formatRound = d3.format(".0f");

function uniqueBy(arr, prop){
   return arr.reduce((a, d) => {
     if (!a.includes(d[prop])) { a.push(d[prop]); }
        return a;
     }, []);
}

function genCharArray(charA, charZ) {
    var a = [], i = charA.charCodeAt(0), j = charZ.charCodeAt(0);
    for (; i <= j; ++i) {
        a.push(String.fromCharCode(i));
    }
    return a;
}

function generateAlphabetColorObject(colorArray){
    let letters = genCharArray('A', 'Z');
    let object = {};
    for (let i = 0; i < letters.length; i++) {
        object[letters[i]] = colorArray[i];
    } 
    return object;
}

//########################
//### AREA CHARTS ########
//########################
function areaCharts() {
    var dispatcher = d3.dispatch("was_clicked", "other_event");

    // All options that should be accessible to caller
    var fillColors =  [
                        "#0000CD", "#00FF00", "#FF0000", "#808080", "#000000", "#B22222", "#DAA520", 
                        "#DDA0DD", "#FF00FF", "#4682B4", "#FF8C00", "#80008B", 
                        "#8FBC8F", "#00BFFF", "#FFFF00", "#808000", "#FFCCCC", "#FFE5CC", "#FFFFCC", "#E5FFCC", 
                        "#CCFFCC", "#CCFFE5", "#CCFFFF", "#CCE5FF", "#CCCCFF", "#E5CCFF", "#FFCCFF", "#FFCCE5", 
                        "#FFFFFF", "#990000", "#666600", "#006666", "#330066", "#A0A0A0", "#99004C"
                    ]; //"#E6E6FA","#00FFFF",
    var fillColor = 'coral';
    var data = [];
    
    // set the dimensions and margins of the graph
    var margin = {top: 15, right: 0, bottom: 40, left: 50};
        width = 140 - margin.left - margin.right;
        height = 110 - margin.top - margin.bottom;
    var barPadding = 0;
    //var widthBar, heightBar; 

    var svg, dom, circle, caption, curYear, xScale, yScale, xValue, yValue, mouseover, mouseout, mousemove, mouseclick, names, colorsObject;
    var bisect = d3.bisector(function(d) {
        return d.year;
    }).left;

    //Variables for global plot dimension.
    var updateWidth;
    var updateHeight;
    var updateFillColors;
    var updateData;

    function chart(selection){
        selection.each(function () {

            // group the data: I want to draw one line per group
            var sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
                .key(function(d) { return d.name;})
                .entries(data);

            // What is the list of groups?
            names = sumstat.map(function(d){return d.key})
            
            // color palette
            var color = d3.scaleOrdinal()
                .domain(names)
                .range(fillColors);
            
            colorsObject = generateAlphabetColorObject(fillColors);

            dom = d3.select(this);
            svg = dom.selectAll('uniqueChart')
                .data(sumstat)
                .enter()
                .append("div").attr("class", "chart")
                .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                .on("mouseover", mouseover)
                .on("mousemove", mousemove)
                .on("mouseout", mouseout)
                .on("click", function(d){
                    dispatcher.call("was_clicked", this, formatRound(xScale.invert(d3.mouse(this)[0])));
                })
                
            // Add X axis --> it is a date format
            xScale = d3.scaleLinear()
                .domain(d3.extent(data, function(d) { return d.year; }))
                .range([ 0, width ]);
          
            svg
                .append("g")
                .attr("transform", "translate(0," + height + ")")
                .attr("class", "static_year")
                .call(
                    d3.axisBottom(xScale)
                    .ticks(3)
                    .tickFormat(d3.format(".0f"))
                )
                .selectAll("text")
                .style("text-anchor", "end")
                .attr("transform", "rotate(-90)")
                .attr("dx", "-0.8em")
                .attr("dy", "-0.45em");
          
            //Add Y axis
            yScale = d3.scaleLinear()
                .domain([0, d3.max(data, function(d) { return +d.n; })])
                .range([ height, 0 ]);
            svg.append("g")
                .call(d3.axisLeft(yScale).ticks(5));

            //Add custom area to each plots.
            svg
                .append("path")
                .attr("fill", function(d){
                    return "#4682B4";
                })
                .attr("stroke", "none")
                .attr("d", function(d){
                    return d3.area()
                        .x(function(d) { return xScale(d.year) })
                        .y0(yScale(0))
                        .y1(function(d) { return yScale(+d.n) })
                        (d.values);
                });
         
            // Add titles
            svg
                .append("text")
                .attr("class", "title")
                .attr("text-anchor", "start")
                .attr("y", -5)
                .attr("x", 5)
                .text(function(d){ return(d.key)})
                .style("fill", function(d){ 
                    return "#4682B4";
                })
          
            /*
                Interactions
            */ 
            circle = svg.append("circle")
                .attr("r", 2.2)
                .attr("opacity", 0)
                .style("pointer-events", "none")
 
            caption = svg.append("text")
                .attr("class", "caption")
                .attr("text-anchor", "middle")
                .style("pointer-events", "none")
                .attr("dy", -8)
     
            curYear = svg.append("text")
                .attr("class", "year")
                .attr("text-anchor", "middle")
                .style("pointer-events", "none")
                .attr("dy", 13)
                .attr("y", height)
    
            /*############### 
            Implement Isotope
            ################*/
            doIsotope();
            /*##################
            ## END ISOTOPE #####
            ##################*/

            // update functions
            updateWidth = function() {
                //TODO
            };

            updateHeight = function() {
                barSpacing = height / data.length;
                barHeight = barSpacing - barPadding;
                bars.transition().duration(1000).attr('y', function(d, i) { return i * barSpacing; })
                    .attr('height', barHeight);
                svg.transition().duration(1000).attr('height', height);
            };

            updateFillColors = function() {
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
                width = 140 - margin.left - margin.right;
                height = 110 - margin.top - margin.bottom;
                sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
                    .key(function(d) { return d.name;})
                    .entries(data);

                // What is the list of groups?
                names = sumstat.map(function(d){return d.key})
               
                svg = dom.selectAll('.chart')
                    .remove().exit();
                
                svg = dom.selectAll("uniqueChart")
                    .data(sumstat)
                    .enter()
                    .append("div").attr("class", "chart")
                    .append("svg")
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom)
                        .attr("fake", function(d){console.log("width:" + width)})
                    .append("g")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                    .on("mouseover", mouseover)
                    .on("mousemove", mousemove)
                    .on("mouseout", mouseout)
                    .on("click", function(d){
                        dispatcher.call("was_clicked", this, formatRound(xScale.invert(d3.mouse(this)[0])));
                    })
                    
                // Add X axis --> it is a date format
                xScale = d3.scaleLinear()
                    .domain(d3.extent(data, function(d) {return d.year; }))
                    .range([ 0, width ]);
              
                svg
                    .append("g")
                    .attr("transform", "translate(0," + height + ")")
                    .attr("class", "static_year")
                    .call(
                        d3.axisBottom(xScale)
                        .ticks(3)
                        .tickFormat(d3.format(".0f"))
                    )
                    .selectAll("text")
                    .style("text-anchor", "end")
                    .attr("transform", "rotate(-90)")
                    .attr("dx", "-0.8em")
                    .attr("dy", "-0.45em");
              
                //Add Y axis
                yScale = d3.scaleLinear()
                    .domain([0, d3.max(data, function(d) { return +d.n; })])
                    .range([ height, 0 ]);
                svg.append("g")
                    .call(d3.axisLeft(yScale).ticks(5));

                //Add custom area to each plots.
                svg
                    .append("path")
                    .attr("fill", function(d){
                        return "#4682B4";
                    })
                    .attr("stroke", "none")
                    .attr("d", function(d){
                        return d3.area()
                            .x(function(d) { return xScale(d.year) })
                            .y0(yScale(0))
                            .y1(function(d) { return yScale(+d.n) })
                            (d.values);
                    })
             
                // Add titles
                svg
                    .append("text")
                    .attr("class", "title")
                    .attr("text-anchor", "start")
                    .attr("y", -5)
                    .attr("x", 5)
                    .text(function(d){ return(d.key)})
                    .style("fill", function(d){ 
                        return "#4682B4";
                    })
                svg
                    .style('opacity', 0)
                    .transition()
                    .duration(1000)
                    .style('opacity', 1)

                /*
                    Interactions
                */
                circle = svg.append("circle")
                    .attr("r", 2.2)
                    .attr("opacity", 0)
                    .style("pointer-events", "none")
     
                caption = svg.append("text")
                    .attr("class", "caption")
                    .attr("text-anchor", "middle")
                    .style("pointer-events", "none")
                    .attr("dy", -8)
         
                curYear = svg.append("text")
                    .attr("class", "year")
                    .attr("text-anchor", "middle")
                    .style("pointer-events", "none")
                    .attr("dy", 13)
                    .attr("y", height)
            };
        }); 
    }

    // The '.on' instance method that accepts event
    // listeners. Unlike d3 v4, this cannot be simply
    // achieved via d3.rebind, which no longer exists
    chart.on = function() {
        var value = dispatcher.on.apply(dispatcher, arguments);
        return value === dispatcher ? chart : value;
    }

    chart.width = function(value) {
        if (!arguments.length) return width;
        width = value;
        console.log("chard.width: " + width);
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
    
    
    /*##################
    MOUSE LISTENERS
    ###################*/
    yValue = function(d) {
        return d.n;
    };

    xValue = function(d) {
        return d.year;
    };  

    mouseover = function(){
        circle.attr("opacity", 1.0)
        d3.selectAll(".static_year")
            .classed("hidden", true);
        return mousemove.call(this);
    };  

    mouseout = function(){
        d3.selectAll(".static_year").classed("hidden", false)
        circle
            .attr("opacity", 0)
        caption.text("");
        return curYear.text("");
    }; 
    
    mousemove = function() {
        var index, year;
        year = xScale.invert(d3.mouse(this)[0])
        index = 0;
        circle
            .attr("cx", xScale(year))
            .attr("cy", function(c) {
                index = bisect(c.values, year, 0, c.values.length - 1);
                return yScale(yValue(c.values[index]));
            });
        caption
            .attr("x", xScale(year))
            .attr("y", function(c) {
                index = bisect(c.values, year, 0, c.values.length - 1);
                return yScale(yValue(c.values[index]));
            })
            .text(function(c) {
                index = bisect(c.values, year, 0, c.values.length - 1);
                return yValue(c.values[index]);
            });
        return curYear.attr("x", xScale(year)).text(formatRound(year));
    };
    /*###################
    #END MOUSE LISTENERS#
    ###################*/

    return chart;
};
