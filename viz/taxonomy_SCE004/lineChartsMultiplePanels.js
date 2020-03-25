/* For this function we assume that array of objs contain the following keys:
   taxon:String; treatment:String; abundance:float*/
function computeMeanByTreatmentByTaxon(data){
    let taxa = data.map(function (d){
        return d.taxon
    });
    taxa = taxa.filter(onlyUniqueArray);

    let treatments = data.map(function (d){
        return d.treatment
    });
    treatments = treatments.filter(onlyUniqueArray);
    //console.log(treatments);

    //console.log(data);

    //3 loops to compute averages for each treatment.
    //Has to be a more elegant way to do this, but for now it'll do.

    // First pass to compute averages.
    let obj = {};
    treatments.map(function(d){

        taxa.map(function(e){ 
            let values = [];
            data.forEach(function(f){
                if(f.treatment === d && f.taxon === e ){
                    values.push(f.abundance);
                }
            });
            let sum = values.reduce((a, b) => a + b, 0);
            let mean = (sum / values.length) || 0;
            obj[String(d + e)] = mean;
        });
    });

    // Second pass to assign computed average values.
    treatments.map(function(d){
        taxa.map(function(e){
            data.forEach(function(f){
                if(String(d + e)  == String(f.treatment + f.taxon)){
                    f.mean = obj[String(d + e)];
                }
            });
        });
    });
    //console.log(data);

    //Third pass to keep only one object per treatment;
    let data2 = [];
    treatments.map(function(d){
        taxa.map(function(e){ 
            let found = false;
            data.forEach(function(f){
                if(f.treatment == d && f.taxon == e && found == false){
                    data2.push(f);
                    found = true;
                }
            });
        });
    });
    //console.log("data2:");
    //console.log(data2);

    return data2;
}

function onlyUniqueArray(value, index, self) { 
    return self.indexOf(value) === index;
}

var dateSortAsc = function (date1, date2) {
  // This is a comparison function that will result in dates being sorted in
  // ASCENDING order. As you can see, JavaScript's native comparison operators
  // can be used to compare dates. This was news to me.
  if (date1 > date2) return 1;
  if (date1 < date2) return -1;
  return 0;
};



//########################
//### LINE CHARTS ########
//########################
function lineCharts() {
    var dispatcher = d3.dispatch("was_clicked", "other_event");

    // All options that should be accessible to caller
    var fillColors =  [
                        "#0000CD", "#00FF00", "#FF0000", "#808080", "#000000", "#B22222", "#DAA520", 
                        "#DDA0DD", "#FF00FF", "#4682B4", "#FF8C00", "#80008B", 
                        "#8FBC8F", "#00BFFF", "#FFFF00", "#808000", "#FFCCCC", "#FFE5CC", "#FFFFCC", "#E5FFCC"]; 
                   //     "#CCFFCC", "#CCFFE5", "#CCFFFF", "#CCE5FF", "#CCCCFF", "#E5CCFF", "#FFCCFF", "#FFCCE5", 
                   //     "#FFFFFF", "#990000", "#666600", "#006666", "#330066", "#A0A0A0", "#99004C"
                   // ]; //"#E6E6FA","#00FFFF",
    var data = [];
    var dataTaxa = [];
    var dataTaxa2 = [];
    var dataDates = [];
    var dataConditions = [];

    var bisectDate = d3.bisector(function(d) { return d.date; }).left;    
    // set the dimensions and margins of the graph

    /* Still difficult to setup margins. keep working ones in ref. */
    /*
    var margin =  { top: 20,  right: 900, bottom: 110, left: 50},
        margin2 = { top: 430, right: 10,  bottom: 20,  left: 40},
        width = 1560 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom,
        height2 = 500 - margin2.top - margin2.bottom;
    */

    //Here basically, height, height2 and margin2.top needs to be change simultanously.
    var margin =  { top: 20,  right: 20, bottom: 45, left: 40},
        margin2 = { top: 10, right: 20,  bottom: 20, left: 40},
        width = 700 - margin.left - margin.right,
        height = 150 - margin.top - margin.bottom,
        height2 = 70 - margin2.top - margin2.bottom;
        //width2 = 100 - margin2.left - margin2.right;

    var svg, dom, circle, caption, curYear, xScale, yScale, 
        zScale, xValue, yValue, mouseover, mouseout, mousemove, 
        mouseclick, names, colorsObject, xScale2, maxY, origTimePoints,
        domLegend, svgLegend, legend,
        domContext, svgContext, context;
    
    var line = d3.line()
        .x(function(d) { 
            //console.log("d inside line"); console.log(d); 
            return xScale(d.date); })
        .y(function(d) { return yScale(d.mean); })
        .curve(d3.curveBasis);
    
    //Variables for global plot dimension.
    var updateWidth;
    var updateHeight;
    var updateFillColors;
    var updateData;

    var formatRound = d3.format(".0f");
    var parseDate = d3.timeFormat("%Y-%m-%d");
    var convertToDate = d3.timeParse("%Y-%m-%d");
    var formatYear = d3.timeParse("%Y");

    var selectedTaxa = [
        "k__Fungi; p__Ascomycota; c__Saccharomycetes; o__Saccharomycetales; f__Saccharomycetales_fam_Incertae_sedis; g__Candida",
        "k__Fungi; p__Basidiomycota; c__Tremellomycetes; o__Tremellales; f__Tremellales_fam_Incertae_sedis; g__Hannaella",
        "k__Bacteria; p__Firmicutes; c__Bacilli; o__Lactobacillales; f__Lactobacillaceae; g__Lactobacillus",
        "k__Bacteria; p__Firmicutes; c__Bacilli; o__Lactobacillales; f__Lactobacillaceae; g__LactobacillaceaeFA"
    ]

    function chart(selection){
        selection.each(function () {
            //console.log("data inside lineCharts:"); console.log(data);

            // First take care of re-ordering data structure.
            data.forEach(function(d) { // Make every date in the csv data a javascript date object format
                var aDate = new Date(d.Date);
                d.Date = aDate;//convertToDate(aDate);
            });

            data.forEach(function(d) { // Make every date in the csv data a javascript date object format
               d.abundance = +d.abundance;
            });
    
            /*################################################
            ########## Data structure Management #############
            ################################################*/

            //First generate taxa array + dataLegend array of obj
            var taxa = Object.keys(data[1]).slice(1,21);
            //console.log("taxa:"); console.log(taxa);
            var dataLegend = taxa.map(function(d){
                return{
                    key : d,
                    visible : (selectedTaxa.indexOf(d) != -1 ? true : false)
                }
            });
            //console.log("dataLegend:");console.log(dataLegend);
 
            var dataAll = [];
            data.map(function(d){
                taxa.forEach(function(taxon){
                    let obj = {};
                    obj.taxon = taxon;
                    obj.abundance = d[taxon];
                    obj.condition = d.Condition;
                    obj.treatment = d.Treatment;
                    obj.timepoint = d.TimePoint;
                    obj.sample = d.Sample;
                    obj.date = d.Date;
                    obj.visible = (selectedTaxa.indexOf(taxon) != -1 ? true : false);
                    dataAll.push(obj);
                });
            });
            //Important to sort dates for d3.line call.
            dataAll.sort(function(a,b){
                return a.date - b.date;
            });
             
            //console.log("dataAll"); console.log(dataAll);
            
            /* To generate the appropriate nested data structure, we need to first generate a global unnested object. */ 
            var datesStr = dataAll.map(function (el) { return el.date; });
            datesStr = [...new Set(datesStr.map(date => date.toString()))];
            var dates = datesStr.map(date => new Date(date));
            //console.log("dates before sort:");console.log(dates);
            dates.sort(dateSortAsc);
            //console.log("dates after sort:");console.log(dates);
            
            var conditions = dataAll.map(function (el) { return el.condition; });
            conditions = conditions.filter(onlyUniqueArray);

            dataAll2 = computeMeanByTreatmentByTaxon(dataAll);
            //console.log("dataAll2:"); console.log(dataAll2); 
        
            /* Then use d3.nest() to double nest it */    
            var dataNested = d3.nest() // nest function allows to group the calculation per level of a factor
                .key(function(d) { return d.condition;})
                .key(function(d) { return d.taxon;})
                .entries(dataAll2);
                
            //Add visible key.
            dataNested.map(function(d){
                d.values.map(function(d2){
                    d2.visible = (selectedTaxa.indexOf(d2.key) != -1 ? true : false);
                });
            });
     
            console.log("dataNested:"); console.log(dataNested);
            
            /*################################################
            ####### End Data structure Management ############
            ################################################*/
    
            // color palette
            var color = d3.scaleOrdinal()
                .domain(taxa)
                .range(fillColors);
            /* Here we want one plot per condition. Using the dataConditions double-nested data structure - 
            see https://stackoverflow.com/questions/60346382/how-to-generate-multiple-panels-of-multilines-plots-in-d3*/
            dom = d3.select(this);
            svg = dom.selectAll("multipleLineCharts")
                .data(dataNested)
                .enter()
                .append("div")
                .attr("class", "chart")
                .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                    //.attr("fake", function(d) {console.log("d inside svg:"); console.log(d);})
            
            // Create invisible rect for mouse tracking
            svg.append("rect")
                .attr("width", width)
                .attr("height", height)                                    
                .attr("x", 0) 
                .attr("y", 0)
                .attr("id", "mouse-tracker")
                .style("fill", "#e9ecef");    
            
            // Add title
            svg
                .append("text")
                .attr("class", "title")
                .attr("text-anchor", "start")
                .attr("y", -5)
                .attr("x", 5)
                .text(function(d){ return(d.key)})
                .style("fill", function(d){ 
                    return "#003366";
                })
                .style("font-weight", 900);
 
            // Add X axis --> it is a date format
            xScale = d3.scaleTime()
                .rangeRound([0, width])
            xScale.domain(d3.extent(dates));
            
            xScale2 = d3.scaleTime()
                .rangeRound([0, width])
            xScale2.domain(xScale.domain()); // Setting a duplicate xdomain for brushing reference later

            svg
                .append("g")
                .attr("transform", "translate(0," + height + ")")
                .attr("class", "x axis")
                .call(d3.axisBottom(xScale))
                .selectAll("text")
                .style("text-anchor", "end")
                .attr("transform", "rotate(-45)")
                .attr("dx", "-0.8em")
                .attr("dy", "-0.45em");

            //Slider part - append clip path for lines plotted, hiding those part out of bounds
            svg.append("defs")
              .append("clipPath") 
              .attr("id", "clip")
              .append("rect")
              .attr("width", width)
              .attr("height", height); 

            //Add Y axis - Here because we want all panels to be on same scale, we cant use the dates from the global data structure.
            yScale = d3.scaleLinear()
                .domain([
                    d3.min(dataAll, function(d) { return d.mean; } ),
                    findMaxY()
                ])
                .range([ height, 0 ]);
            
            svg.append("g")
                .attr("class", "y axis")
                .call(d3.axisLeft(yScale).ticks(5));

            //Add Z scale (colors)
            zScale = d3.scaleOrdinal()
                .range(fillColors);
            zScale.domain(taxa);
            /*###################
            ## For slider part:##
            ###################*/

            //########
            domContext = d3.select("#vizContext")
            svgContext = domContext.append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)

            //Slider part
            var context = svgContext.append("g") // Brushing context box container
                //.attr("transform", "translate(" + 0 + "," + (margin2.top - 10) + ")")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                .attr("class", "context");
            
            var brush = d3.brushX()//for slider bar at the bottom
                .extent([[0,0], [width, height2]])
                .on("brush", brushed)
                .on("end", brushEnd)

            context.append("g") // Create brushing xAxis
                .attr("class", "x axis1")
                .attr("transform", "translate(0," + height2 + ")")
                .call(d3.axisBottom(xScale2))

            var contextArea = d3.area() // Set attributes for area chart in brushing context graph
                .curve(d3.curveMonotoneX)
                .x(function(d) { return xScale2(d.date); }) // x is scaled to xScale2
                .y0(height2) // Bottom line begins at height2 (area chart not inverted) 
                .y1(0); // Top line of area, 0 (area chart not inverted)

            //plot the rect as the bar at the bottom
            context.append("path") // Path is created using svg.area details
                .attr("class", "area")
                //.attr("d", contextArea(dataTaxa2[0].values)) // pass first categories data .values to area path generator 
                .attr("d", contextArea(dataNested[0].values[0].values)) // pass first categories data .values to area path generator 
                //.attr("fill", "#e9ecef");
                .attr("fill", "#CCCCCC");
              
            //append the brush for the selection of subsection  
            context.append("g")
                .attr("class", "x-brush")
                .call(brush)
                .selectAll("rect")
                .attr("height", height2) // Make brush rects same height 
            //end slider part-----------------------------------------------------------------------------------

            //Add custom area to each plots.
            // Create a <g> element for each city
            // Note that 3 1st level arrays, so we get 3 g's
            //var lineages = svg.selectAll(".lineage")
            var lineages = svg.selectAll("lines")
                .data(function(d) {return d.values;})
                .enter()
                .append("g")
                .attr("class", "lineage")
                //.append("g")
                //.attr("class", "lineage")
                //.attr("fake", function(d) {console.log(d);})

            // Create a <path> element inside of each lineage <g>
            // Use line generator function to convert <xyz> data points into SVG path string
            lineages
                .append("path")
                .attr("class", "line")
                .attr("d", function(d) {
                    return d.visible ? line(d.values) : null; // If d.visible is true then draw line for this d selection
                })
                .style("stroke", function(d) { return zScale(d.key); })
                .style("pointer-events", "none") // Stop line interferring with cursor
                .attr("id", function(d) {
                    return "line-" + d.key.replace(/\s/g, "").replace(/;/g, ""); // Give line id of line-(insert issue name, with any spaces replaced with no spaces)
                })
                .attr("clip-path", "url(#clip)")//use clip path to make irrelevant part invisible

            /*########################
            #### DRAW LEGEND #########
            ########################*/
            // draw legend
            var legendSpace = 200 / taxa.length; // 450/number of issues (ex. 40)    
            
            domLegend = d3.select("#legendArea")
            svgLegend = domLegend.append("svg")
                .attr('class', 'legend')
                .attr('height', height + 200)
                .attr('width', width + 100)
                .style('fill', "black")
                .style('font-weight', "700")
                .style('font-size', "9px")

            legend = svgLegend.append("g")
                .classed("legend", true) 
                .selectAll("g.legend")
                .data(dataLegend)//taxa.slice().reverse())
                .enter().append("g")
                  .classed("legend", true) 
                  .attr("transform", function(d, i) { return "translate(0," + i * 4 + ")"; })
                
            legend.append("rect")
                .attr("width", 10)
                .attr("height", 10)                                    
                .attr("x", margin.left)
                //.attr("x", (width + 100))
                .attr("y", function (d, i) { 
                    //console.log("d inside legeng y:"); console.log(d);console.log(i);
                    return (legendSpace)+i*(legendSpace) - 8; 
                })  // spacing
                .attr("fill",function(d) {
                    return d.visible ? color(d.key) : "#F1F1F2"; // If array key "visible" = true then color rect, if not then make it grey 
                })
                .attr("stroke", "#808080")
                .attr("class", "legend-box")
                .on("click", function(d){ // On click make d.visible 
                    //console.log("d inside legend:"); console.log(d);
                    console.log("click");console.log(this);
                    d.visible = !d.visible; // If array key for this data selection is "visible" = true then make it false, if false then make it true
                    
                    if(d.visible){
                        d.visible = true;
                        //also se visible in dataNested
                        dataNested.map(function(e) {
                            e.values.map(function(f){
                                if(f.key === d.key){
                                    f.visible = true;
                                    //e.values.map(function(g){
                                    //    //console.log(f);
                                    //    maxYValues.push(f.mean); 
                                    //});
                                }
                            });
                        });
                    }else{
                        d.visible = false;
                        //also se visible in dataNested
                        dataNested.map(function(e) {
                            e.values.map(function(f){
                                if(f.key === d.key){
                                    f.visible = false;
                                    //e.values.map(function(g){
                                    //    //console.log(f);
                                    //    maxYValues.push(f.mean); 
                                    //});
                                }
                            });
                        });
                    }        
 
                    maxY = findMaxY(); // Find max Y rating value categories data with "visible"; true
                    console.log("maxY:", maxY);
                    yScale.domain([0,maxY]); // Redefine yAxis domain based on highest y value of categories data with "visible"; true
                    svg.select(".y.axis")
                        .transition()
                        .call(d3.axisLeft(yScale).ticks(5));   

                    lineages
                        .select("path")
                        .transition()
                        .attr("d", function(d){
                            return d.visible ? line(d.values) : null; // If d.visible is true then draw line for this d selection
                        })

                    legend
                        .select("rect")
                        .transition()
                        .attr("fill", function(d) {
                            return d.visible ? color(d.key) : "#F1F1F2";
                        });
                })
                .on("mouseover", function(d){

                    d3.select(this)
                        .transition()
                        .attr("fill", function(d) { return color(d.key); });

                    d3.select("#line-" + d.key.replace(/\s/g, "").replace(/;/g, ""))
                        .transition()
                        .style("stroke-width", 2.5);  
                })
                .on("mouseout", function(d){

                    d3.select(this)
                        .transition()
                        .attr("fill", function(d) {
                        return d.visible ? color(d.key) : "#F1F1F2";});

                    d3.select("#line-" + d.key.replace(/\s/g, "").replace(/;/g, ""))
                        .transition()
                        .style("stroke-width", 1.5);
                })
                
            legend.append("text")
                .attr("x", 65) 
                .attr("y", function (d, i) { return (legendSpace)+i*(legendSpace); })  // (return (11.25/2 =) 5.625) + i * (5.625) 
                .text(function(d) {
                    //console.log("d inside legend.text:");console.log(d);
                    return d.key; 
                });                     

            /*#############
            ## HOVER LINE #
            #############*/
            // Hover line 
            var hoverLineGroup = svg.append("g") 
                .attr("class", "hover-line");

            var hoverLine = hoverLineGroup // Create line with basic attributes
                .append("line")
                .attr("id", "hover-line")
                .attr("x1", 10).attr("x2", 10) 
                .attr("y1", 0).attr("y2", height + 10)
                .style("pointer-events", "none") // Stop line interferring with cursor
                .style("opacity", 1e-6); // Set opacity to zero 

            var hoverDate = hoverLineGroup
                .append('text')
                .attr("class", "hover-text")
                .attr("y", height - (height-40)) // hover date text position
                .attr("x", width - 150) // hover date text position
                .style("fill", "#E6E7E8");

            var columnNames = taxa;

            var focus = lineages.select("g") // create group elements to house tooltip text
                .data(columnNames) // bind each column name date to each g element
                .enter().append("g") //create one <g> for each columnName
                .attr("class", "focus"); 

            focus.append("text") // http://stackoverflow.com/questions/22064083/d3-js-multi-series-chart-with-y-value-tracking
                .attr("class", "tooltip-private")
                .attr("x", width + 20) // position tooltips  
                .attr("y", function (d, i) { return (legendSpace)+i*(legendSpace); }); // (return (11.25/2 =) 5.625) + i * (5.625) // position tooltips       

            // Add mouseover events for hover line.
            d3.select("#mouse-tracker") // select chart plot background rect #mouse-tracker
                .on("mousemove", mousemove) // on mousemove activate mousemove function defined below
                .on("mouseout", function() {
                    hoverDate
                        .text(null) // on mouseout remove text for hover date
                   
                    d3.select("#hover-line")
                        .style("opacity", 1e-6); // On mouse out making line invisible
                });

            /*###############
            ### MOUSE MOVE ##
            ###############*/
            function mousemove() { 
                //Only moves when in main plot - not in brush area...
                //console.log("Mouse move()...");
                var mouse_x = d3.mouse(this)[0]; // Finding mouse x position on rect
                //var graph_x = scalePointPosition(mouse_x);
                var graph_x = xScale.invert(mouse_x);

                //var mouse_y = d3.mouse(this)[1]; // Finding mouse y position on rect
                //var graph_y = yScale.invert(mouse_y);
                //console.log(graph_x);
              
                var format = d3.timeFormat('%b %Y'); // Format hover date text to show three letter month and full year 
                //hoverDate.text(format(graph_x)); // scale mouse position to xScale date and format it to show month and year
                hoverDate.text(graph_x); // scale mouse position to xScale date and format it to show month and year
              
                d3.select("#hover-line") // select hover-line and changing attributes to mouse position
                    .attr("x1", mouse_x) 
                    .attr("x2", mouse_x)
                    .style("opacity", 1); // Making line visible

                // Legend tooltips // http://www.d3noob.org/2014/07/my-favourite-tooltip-method-for-line.html

                //var x0 = scalePointPosition(d3.mouse(this)[0]),
                var x0 = xScale.invert(d3.mouse(this)[0]), 
                                                             /* d3.mouse(this)[0] returns the x position on the screen of the mouse. 
                                                             xScale.invert function is reversing the process that we use to map the domain (date) to range (position on screen). 
                                                             So it takes the position on the screen and converts it into an equivalent date! */
                    i = bisectDate(dataDates, x0, 1), // use our bisectDate function that we declared earlier to find the index of our data array that is close to the mouse cursor
                    /*It takes our data array and the date corresponding to the position of or mouse cursor and returns the index number of the data array which has a 
                    date that is higher than the cursor position.*/
                    d0 = dataDates[i - 1],
                    d1 = dataDates[i],
                    /*d0 is the combination of date and rating that is in the data array at the index to the left of the cursor and d1 is the combination of date i
                    and close that is in the data array at the index to the right of the cursor. In other words we now have two variables that know the value and 
                    date above and below the date that corresponds to the position of the cursor.*/
                    d = x0 - d0.date > d1.date - x0 ? d1 : d0;
                    /*The final line in this segment declares a new array d that is represents the date and close combination that is closest to the cursor. 
                    It is using the magic JavaScript short hand for an if statement that is essentially saying if the distance between the mouse cursor and the date and close combination on the left 
                    is greater than the distance between the mouse cursor and the date and close combination on the right then d is an array of the date and close on the right of the cursor (d1). 
                    Otherwise d is an array of the date and close on the left of the cursor (d0).*/

                //d is now the data row for the date closest to the mouse position

                focus.select("text").text(function(columnName){
                    //because you didn't explictly set any data on the <text>
                    //elements, each one inherits the data from the focus <g>
                    //console.log(columnName);
                    //console.log(d[columnName]);
                    return (d[columnName]);
                });
            }; 

            /*############
            ## BRUSHED ###
            ############*/
            function brushEnd(){
                if (!d3.event.selection){
                    xScale.domain(d3.extent(dates));
                    svg.select(".x.axis") // replot xAxis with transition when brush used
                        .transition()
                        .call(
                            d3.axisBottom(xScale)
                        )
                        .selectAll("text")
                        .style("text-anchor", "end")
                        .attr("transform", "rotate(-45)")
                        .attr("dx", "-0.8em")
                        .attr("dy", "-0.45em");
                }
                //maxY = findMaxY(dataConditions[0].values[0]); // Find max Y rating value categories data with "visible"; true
                //maxY = 0.9;
                //yScale.domain([0,+maxY]); // Redefine yAxis domain based on highest y value of categories data with "visible"; true
              
                svg.select(".y.axis") // Redraw yAxis
                    .transition()
                    .call(d3.axisLeft(yScale).ticks(5));

                lineages.select("path") // Redraw lines based on brush xAxis scale and domain
                    .transition()
                    .attr("d", function(d){
                        return d.visible ? line(d.values) : null; // If d.visible is true then draw line for this d selection
                    });

            }
            //for brusher of the slider bar at the bottom
            function brushed() {
                var selection = d3.event.selection;
                
                //let updatedTimePoints; 
                if (!d3.event.selection){
                    xScale.domain(d3.extent(dates));
                }else{
                    xScale.domain( selection.map(xScale2.invert, xScale2) )
                }
                
                svg.select(".x.axis") // replot xAxis with transition when brush used
                    .transition()
                    .call(
                        d3.axisBottom(xScale)
                    )
                    .selectAll("text")
                    .style("text-anchor", "end")
                    .attr("transform", "rotate(-45)")
                    .attr("dx", "-0.8em")
                    .attr("dy", "-0.45em");

                //maxY = findMaxY(dataConditions[0].values[0]); // Find max Y rating value categories data with "visible"; true
                //maxY = 0.9;
                //yScale.domain([0,+maxY]); // Redefine yAxis domain based on highest y value of categories data with "visible"; true
              
                svg.select(".y.axis") // Redraw yAxis
                    .transition()
                    .call(d3.axisLeft(yScale).ticks(5));

                lineages.select("path") // Redraw lines based on brush xAxis scale and domain
                    .transition()
                    .attr("d", function(d){
                        return d.visible ? line(d.values) : null; // If d.visible is true then draw line for this d selection
                    });
              
            };
        

            function findMaxY(){  // Define function "findMaxY"
                // test loop to find max y value if d.visible eq true.
                let maxYValues = [];
                dataNested.map(function(d) {
                    d.values.map(function(e){
                        if(e.visible){
                            e.values.map(function(f){
                                //console.log(f);
                                maxYValues.push(f.mean); 
                            });
                        }
                    });
                });
                //console.log(maxYValues);
                //console.log(d3.max(maxYValues));
                return d3.max(maxYValues);
            }
            /*############### 
            Implement Isotope
            ################*/
            //doIsotope();
            /*##################
            ## END ISOTOPE #####
            ##################*/

            // update functions
            updateWidth = function() {
                //widthScale = width / maxValue;
                //bars.transition().duration(1000).attr('width', function(d) { return d * widthScale; });
                //svg.transition().duration(1000).attr('width', width);
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
                //console.log("Entering updateData()");
                width = 140 - margin.left - margin.right;
                height = 110 - margin.top - margin.bottom;
                //console.log("width:" + width)
                sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
                    .key(function(d) { return d.name;})
                    .entries(data);

                // What is the list of groups?
                names = sumstat.map(function(d){return d.key})
               
                //console.log("sumstat");
                //console.log(sumstat);
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
                    //.style('opacity', 0)
                    //.transition()
                    //.duration(1000)
                    //.style('opacity', 1);
                    
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
                    //.attr("class", function(d){ 
                    //    console.log(d.values[0].sex); 
                    //    return "sex" + d.values[0].sex; 
                    //})
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
            
                //doIsotope();
                //$grid.isotope( 'reloadItems' );
                //$grid.isotope( 'destroy' );
                //doIsotope();

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
