var width =500;
var height= 500;

d3.csv("colleges.csv", function(error, dataset) {

    colleges = dataset;

    var avgCost = d3.extent(colleges, function(d){
        return +d["Average Cost"]; });
    var medEarnings = d3.extent(colleges, function(d){
        return +d["Median Earnings 8 years After Entry"]; });
    var numEmployed = d3.extent(colleges, function(d){
        return +d["Number of Employed 8 years after entry"]; });

    var medFamInc = d3.extent(colleges, function(d){
        return +d["Median Family Income"]; });
    var medDebt = d3.extent(colleges, function(d){
        return +d["Median Debt on Graduation"]; });
    var expenditure = d3.extent(colleges, function(d){
        return +d["Expenditure Per Student"]; });

    // var filter = d3.nest()
    //   .key(function(d) {
    //         if (d.Control == "Private") {
    //             return d;
    //         };
    //     })
    //   .entries(dataset);



    // Axis setup
    var xScale = d3.scaleLinear().domain(avgCost).range([50, 470]);
    var yScale = d3.scaleLinear().domain(medEarnings).range([470, 30]);
    var rScale = d3.scaleSqrt().domain(numEmployed).range([1,10]);

    var xScale2 = d3.scaleLinear().domain(medFamInc).range([50, 470]);
    var yScale2 = d3.scaleLinear().domain(medDebt).range([470, 30]);
    var rScale2 = d3.scaleSqrt().domain(expenditure).range([1,10]);

    var xAxis = d3.axisBottom().scale(xScale).ticks(10).tickFormat(d3.format(".2s"));
    var yAxis = d3.axisLeft().scale(yScale).ticks(10).tickFormat(d3.format(".2s"));

    var xAxis2 = d3.axisBottom().scale(xScale2).ticks(10).tickFormat(d3.format(".2s"));
    var yAxis2 = d3.axisLeft().scale(yScale2).ticks(10).tickFormat(d3.format(".2s"));


    //Create SVGs for charts
    var chart1 = d3.select("#chart1")
                    .append("svg:svg")
                    .attr("width",width)
                    .attr("height",height);

    var chart2 = d3.select("#chart2")
                    .append("svg:svg")
                    .attr("width",width)
                    .attr("height",height);

    /******************************************

        ADD BRUSHING CODE HERE

    ******************************************/

    var brush1 = d3.brush()
        .extent([[0,0], [width, height]])
        .on("start", handleBrushStart)
        .on("brush", handleBrushMove1)
        .on("end", handleBrushEnd);

    var brush2 = d3.brush()
        .extent([[0,0], [width, height]])
        .on("start", handleBrushStart)
        .on("brush", handleBrushMove2)
        .on("end", handleBrushEnd);

    selectedChart = undefined;

    function handleBrushStart() {
        clearSelection();
        brush1.move(d3.selectAll('.brush'), null);
        brush2.move(d3.selectAll('.brush'), null);

    }

    function handleBrushEnd() {
        if (d3.event.selection) {
            svg.selectAll('.hidden').classed('hidden', false);
            selectedChart = undefined;
        }
    }

    function clearSelection() {
        d3.selectAll("circle").classed('selected', false);
        d3.selectAll("circle").classed('selected2', false);
    }

    function fillText(d) {
        d3.select("#name").text(d["Name"]);
        d3.select("#control").text(d["Control"]);
        d3.select("#region").text(d["Region"]);
        d3.select("#locale").text(d["Locale"]);
        d3.select("#admissionRate").text(d["Admission Rate"]);
        d3.select("#act").text(d["ACT Median"]);
        d3.select("#sat").text(d["SAT Average"]);
        d3.select("#population").text(d["Undergrad Population"]);
        d3.select("#avgCost").text(d["Average Cost"]);
        d3.select("#expenditure").text(d["Expenditure Per Student"]);
        d3.select("#facultySalary").text(d["Average Faculty Salary"]);
        d3.select("#medDebt").text(d["Median Debt on Graduation"]);
        d3.select("#medFamInc").text(d["Median Family Income"]);
        d3.select("#numEmployed").text(d["Number of Employed 8 years after entry"]);
        d3.select("#medEarnings").text(d["Median Earnings 8 years After Entry"]);

    }

    function clearText() {
        d3.select("#name").text("");
        d3.select("#control").text("");
        d3.select("#region").text("");
        d3.select("#locale").text("");
        d3.select("#admissionRate").text("");
        d3.select("#act").text("");
        d3.select("#sat").text("");
        d3.select("#population").text("");
        d3.select("#avgCost").text("");
        d3.select("#expenditure").text("");
        d3.select("#facultySalary").text("");
        d3.select("#medDebt").text("");
        d3.select("#medFamInc").text("");
        d3.select("#numEmployed").text("");
        d3.select("#medEarnings").text("");
    }

    function handleBrushMove1() {
        var brushSelection1 = d3.event.selection
        if (brushSelection1) {
            var [[left, top], [right, bottom]] = brushSelection1;
            chart2.selectAll("circle")
                .classed("selected", function(d) {
                    var x = xScale(d["Average Cost"]);
                    var y = yScale(d["Median Earnings 8 years After Entry"]);
                    return left <= x && x <= right && top <= y && y <= bottom;
                });
        }
        clearText();
    }

    function handleBrushMove2() {
        var brushSelection2 = d3.event.selection
        if (brushSelection2) {
            var [[left, top], [right, bottom]] = brushSelection2;
            chart1.selectAll("circle")
                .classed("selected2", function(d) {
                    var x = xScale2(d["Median Family Income"]);
                    var y = yScale2(d["Median Debt on Graduation"]);
                    return left <= x && x <= right && top <= y && y <= bottom;
                });
        }
        clearText();
    }

        function handleMouseOver(d, i) {  // Add interactivity

            // Use D3 to select element, change color and size
            d3.select(this).attr({
              fill: "orange",
            });


          }

        function handleMouseOut(d, i) {
            // Use D3 to select element, change color back to normal
            d3.select(this).attr({
              fill: "black",
            });
          }


    chart1.append('g')
        .attr('class', 'brush')
        .call(brush1);

    chart2.append('g')
        .attr('class', 'brush')
        .call(brush2);

    //add scatterplot points
    var temp1 = chart1.selectAll("circle")
       .data(colleges)
       .enter()
       .append("circle")
       .attr("id",function(d,i) {return i;} )
       .style("fill", function(d) {
            if(d["Locale"] == "Mid-size Suburb" ||
               d["Locale"] == "Large Suburb" ||
               d["Locale"] == "Small Suburb") {
                return "#4169E1";
            }
            if (d["Locale"] == "Distant Rural" ||
                d["Locale"] == "Remote Rural" ||
                d["Locale"] == "Fringe Rural") {
                return "#66CC00"
            }
            if (d["Locale"] == "Small City" ||
                d["Locale"] == "Large City" ||
                d["Locale"] == "Mid-size City") {
                return "#ffc04d";
            } else {
                return "#9932CC"
            }
       })
       .attr("cx", function(d) {
            return xScale(d["Average Cost"]); })
       .attr("cy", function(d) {
            return yScale(d["Median Earnings 8 years After Entry"]); })
       .attr("r", function(d) {
            return rScale2(d["Number of Employed 8 years after entry"] * 6); })
        .on("mouseover", handleMouseOver)
        .on("mouseout", handleMouseOut)
        .on("click", function(d,i){
            clearSelection();
            fillText(d);
            chart1.selectAll("circle")
                .classed("selected", function(d2) {
                    return d == d2;
                });
            chart2.selectAll("circle")
                .classed("selected", function(d2) {
                    return d == d2;
                });

       });

    var temp2 = chart2.selectAll("circle")
       .data(colleges)
       .enter()
       .append("circle")
       .attr("id",function(d,i) {return i;} )
       .style("fill", function(d) {
           if (d["Control"] == "Public") {
               return "#DAA520";
           } else {
               return "00CCCC";
           }
       })
       .attr("cx", function(d) {
            return xScale2(d["Median Family Income"]); })
       .attr("cy", function(d) {
            return yScale2(d["Median Debt on Graduation"]); })
       .attr("r", function(d) {
            return rScale2(d["Expenditure Per Student"]); })
       .on("click", function(d,i){
            clearSelection();
            fillText(d);
            chart2.selectAll("circle")
                .classed("selected2", function(d2) {
                    return d == d2;
                });
            chart1.selectAll("circle")
                .classed("selected2", function(d2) {
                    return d == d2;
                });

       });

    // Create filter button
    d3.selectAll("circle")
        .append('p')
        .append('button')
        .style("border", "1px solid black")
        .text('Filter Data')
        // .on('click', function() {
        //     bars.selectAll('.bar')
        //         .transition()
        //         .duration(500)
        //         .delay(function(d) { return yScale(d.letter) })
        //         .style('fill', function(d) {
        //             if (d.frequency >= cutoffVal) {
        //                 return d3.select('select').property('value')
        //             }
        //         })
        //         .attr('width', function(d) {
        //             if (d.frequency >= cutoffVal) {
        //                 return xScale(d.frequency)
        //             } else {
        //                 return 0;
        //             }
        //         })
        // })
        ;


    chart1 // or something else that selects the SVG element in your visualizations
        .append("g") // create a group node
        .attr("transform", "translate(0,"+ (width -30)+ ")")
        .call(xAxis) // call the axis generator
        .append("text")
        .attr("class", "label")
        .attr("x", width-16)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text("Average Cost")
        .style("fill", "black");

    chart1 // or something else that selects the SVG element in your visualizations
        .append("g") // create a group node
        .attr("transform", "translate(50, 0)")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Median Earnings 8 Years After Entry")
        .style("fill", "black");

    chart2 // or something else that selects the SVG element in your visualizations
        .append("g") // create a group node
        .attr("transform", "translate(0,"+ (width - 30)+ ")")
        .call(xAxis2)
        .append("text")
        .attr("class", "label")
        .attr("x", width-16)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text("Median Family Income")
        .style("fill", "black");

    chart2 // or something else that selects the SVG element in your visualizations
        .append("g") // create a group node
        .attr("transform", "translate(50, 0)")
        .call(yAxis2)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Median Debt on Graduation")
        .style("fill", "black");
    });
