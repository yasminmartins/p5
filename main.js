var width =500;
var height= 500;

d3.csv("colleges.csv", function(error, dataset) {

    colleges = dataset;

    var avgCost = d3.extent(colleges, function(d){
        return +d["Average Cost"]; });

    var medFamInc = d3.extent(colleges, function(d){
        return +d["Median Family Income"]; });
    var medEarnings = d3.extent(colleges, function(d){
        return +d["Median Earnings 8 years After Entry"]; });
    var numEmployed = d3.extent(colleges, function(d){
        return +d["Number of Employed 8 years after entry"]; });

    // Axis setup
    var xScale = d3.scaleLinear().domain(avgCost).range([50, 470]);
    var yScale = d3.scaleLinear().domain(medFamInc).range([470, 30]);

    var xScale2 = d3.scaleLinear().domain(medEarnings).range([50, 470]);
    var yScale2 = d3.scaleLinear().domain(numEmployed).range([470, 30]);

    var xAxis = d3.axisBottom().scale(xScale);
    var yAxis = d3.axisLeft().scale(yScale);

    var xAxis2 = d3.axisBottom().scale(xScale2);
    var yAxis2 = d3.axisLeft().scale(yScale2);


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
        d3.select("#avgCost").text(d["Average Cost"]);
        d3.select("#medFamInc").text(d["Median Family Income"]);
        d3.select("#medEarnings").text(d["Median Earnings 8 years After Entry"]);
        d3.select("#numEmployed").text(d["Number of Employed 8 years after entry"]);
    }

    function clearText() {
        d3.select("#avgCost").text("");
        d3.select("#medFamInc").text("");
        d3.select("#medEarnings").text("");
        d3.select("#numEmployed").text("");
    }

    function handleBrushMove1() {
        var brushSelection1 = d3.event.selection
        if (brushSelection1) {
            var [[left, top], [right, bottom]] = brushSelection1;
            chart2.selectAll("circle")
                .classed("selected", function(d) {
                    var x = xScale(d["Average Cost"]);
                    var y = yScale(d["Median Family Income"]);
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
                    var x = xScale2(d["Median Earnings 8 years After Entry"]);
                    var y = yScale2(d["Number of Employed 8 years after entry"]);
                    return left <= x && x <= right && top <= y && y <= bottom;
                });
        }
        clearText();
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
       .attr("stroke", "black")
       .attr("cx", function(d) {
            return xScale(d["Average Cost"]); })
       .attr("cy", function(d) {
            return yScale(d["Median Family Income"]); })
       .attr("r", 5);
       //  .on("click", function(d,i){
       //      clearSelection();
       //      fillText(d);
       //      chart2.selectAll("circle")
       //          .classed("selected", function(d2) {
       //              return d == d2;
       //          });

       // });

    var temp2 = chart2.selectAll("circle")
       .data(colleges)
       .enter()
       .append("circle")
       .attr("id",function(d,i) {return i;} )
       .attr("stroke", "black")
       .attr("cx", function(d) {
            return xScale2(d["Median Earnings 8 years After Entry"]); })
       .attr("cy", function(d) {
            return yScale2(d["Number of Employed 8 years after entry"]); })
       .attr("r", 5);
       // .on("click", function(d,i){
       //      clearSelection();
       //      fillText(d);
       //      chart1.selectAll("circle")
       //          .classed("selected2", function(d2) {
       //              return d == d2;
       //          });

       // });


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
        .text("Median Family Income")
        .style("fill", "black");

    chart2 // or something else that selects the SVG element in your visualizations
        .append("g") // create a group node
        .attr("transform", "translate(0,"+ (width -30)+ ")")
        .call(xAxis2)
        .append("text")
        .attr("class", "label")
        .attr("x", width-16)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text("Median Earnings 8 years After Entry")
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
        .text("Number of Employed 8 Years After Entry")
        .style("fill", "black");
    });
