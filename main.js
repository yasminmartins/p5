var width = 500;
var height = 500;

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

    var percentWhite = d3.extent(colleges, function(d){
        return +d["% White"]; });
    var percentBlack = d3.extent(colleges, function(d){
        return +d["% Black"]; });
    var percentHispanic = d3.extent(colleges, function(d){
        return +d["% Hispanic"]; });
    var percentAsian = d3.extent(colleges, function(d){
        return +d["% Asian"]; });
    var percentAmericanIndian = d3.extent(colleges, function(d){
        return +d["% AmericanIndian"]; });
    var percentPacificIslander = d3.extent(colleges, function(d){
        return +d["% PacificIslander"]; });
    var percentBiracial = d3.extent(colleges, function(d){
        return +d["% Biracial"]; });

    var xDemScale = d3.scaleOrdinal().domain(["% White", "% Black", "% Hispanic", "% Asian", "% American Indian", "% Pacific Islander", "%Biracial"]).range([0,10]);
    var yDemMax = Math.max(percentWhite, percentBlack, percentHispanic, percentAsian, percentAmericanIndian, percentPacificIslander, percentBiracial);
    var percentScale = d3.scaleLinear().domain([0, yDemMax]).range([550,50]);
    var yDemScale = d3.axisLeft(percentScale);
    var xAxisDem = d3.axisBottom().scale(xDemScale);
    var yAxisDem = d3.axisBottom().scale(yDemScale);

    // var demSVG = d3.select("#chart3").append('g')
    // .attr('width', width)
    // .attr('height', height);
    // demSVG.selectAll('.bar') //region bar graphs
    //     .data(colleges)
    //     .enter()
    //     .append("circle")
    //     .attr("id",function(d,i) {return i;} )
    //     .attr("cx", function(d) {
    //         return xDemScale(d["Median Family Income"]); })
    //     .attr("cy", function(d) {
    //         return yDemScale(d["Median Debt on Graduation"]); });


    // Axis setup
    var xScale = d3.scaleLinear().domain(avgCost).range([50, 470]);
    var yScale = d3.scaleLinear().domain(medEarnings).range([460, 30]);
    var rScale = d3.scaleSqrt().domain(numEmployed).range([1,10]);

    var xScale2 = d3.scaleLinear().domain(medFamInc).range([50, 470]);
    var yScale2 = d3.scaleLinear().domain(medDebt).range([460, 30]);
    var rScale2 = d3.scaleSqrt().domain(expenditure).range([1,10]);

    var xAxis = d3.axisBottom().scale(xScale).ticks(10).tickFormat(d3.format(".2s"));
    var yAxis = d3.axisLeft().scale(yScale).ticks(10).tickFormat(d3.format(".2s"));

    var xAxis2 = d3.axisBottom().scale(xScale2).ticks(10).tickFormat(d3.format(".2s"));
    var yAxis2 = d3.axisLeft().scale(yScale2).ticks(10).tickFormat(d3.format(".2s"));

    var tooltip1 = d3.select("#chart1")
        .append("div")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("background", "white");

    var tooltip2 = d3.select("#chart2")
        .append("div")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("background", "white");



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
            if(d["Locale"].match(/Suburb/)){
                return "slategray";
            }
            if (d["Locale"].match(/Rural/)) {
                return "steelblue";
            }
            if (d["Locale"].match(/City/)) {
                return "darkblue";
            } else {
                return "darkgreen"
            }
       })
       .attr("cx", function(d) {
            return xScale(d["Average Cost"]); })
       .attr("cy", function(d) {
            return yScale(d["Median Earnings 8 years After Entry"]); })
       .attr("r", function(d) {
            return rScale(d["Number of Employed 8 years after entry"]); })
        .on("mouseover", function(d){
            tooltip1.text(d["Name"]);
            return tooltip1.style("visibility", "visible");})
        .on("mousemove", function(){
            return tooltip1.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");})
        .on("mouseout", function(){
            return tooltip1.style("visibility", "hidden");})
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
               return "thistle";
           } else {
               return "darkmagenta";
           }
       })
       .attr("cx", function(d) {
            return xScale2(d["Median Family Income"]); })
       .attr("cy", function(d) {
            return yScale2(d["Median Debt on Graduation"]); })
       .attr("r", function(d) {
            return rScale2(d["Expenditure Per Student"]); })
        .on("mouseover", function(d){
            tooltip2.text(d["Name"]);
            return tooltip2.style("visibility", "visible");})
        .on("mousemove", function(){
            return tooltip2.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");})
        .on("mouseout", function(){
            return tooltip2.style("visibility", "hidden");})
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

    chart1.append('text')
       .attr('class', 'title')
       .attr('transform', "translate(" + (width / 4 + 10) + ", " + 15 + ")")
       .text("Cost of College v. Median Earnings 8 Years Post-Entry");

    chart2.append('text')
       .attr('class', 'title')
       .attr('transform', "translate(" + (width / 2 - 100) + ", " + 15 + ")")
       .text("Median Family Income v. Median Debt at Graduation");

    chart1 // or something else that selects the SVG element in your visualizations
        .append("g") // create a group node
        .attr("transform", "translate(0,"+ (width -40)+ ")")
        .call(xAxis) // call the axis generator
        .append("text")
        .attr("class", "label")
        .attr("x", width-200)
        .attr("y", 30)
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
        .attr("y", -45)
        .attr("x", -150)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Median Earnings 8 Years After Entry")
        .style("fill", "black");

    chart2 // or something else that selects the SVG element in your visualizations
        .append("g") // create a group node
        .attr("transform", "translate(0,"+ (width - 40)+ ")")
        .call(xAxis2)
        .append("text")
        .attr("class", "label")
        .attr("x", width-200)
        .attr("y", 30)
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
        .attr("y", -40)
        .attr("x", -180)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Median Debt on Graduation")
        .style("fill", "black");

    var regions = ['Far West','Great Lakes', 'Great Plains', 'Mid-Atlantic', 'New England', 'Outlying Areas', 'Rocky Mountains', 'Southeast', 'Southwest']

    var dropdown = d3.select("#chart3")
        .append('select')
        .style("border", "1px solid black")
        .on('change', filter);

    dropdown.selectAll('option')
        .data(regions)
        .enter()
        .append('option')
        .text(function(d){
            return d; })

    function filter() {
        clearText();
        selectValue = d3.select("select").property("value");
        chart1.selectAll("circle")
            .transition()
            .style('fill', function(d) {
                if (d.Region == selectValue) {
                    if(d["Locale"].match(/Suburb/)){
                        return "slategray";
                    }
                    if (d["Locale"].match(/Rural/)) {
                        return "steelblue";
                    }
                    if (d["Locale"].match(/City/)) {
                        return "darkblue";
                    } else {
                        return "darkgreen"
                    }
                } else
                    return 'rgba(255,255,255,0)';
            })
        chart2.selectAll("circle")
            .transition()
            .style('fill', function(d) {
                if (d.Region == selectValue) {
                    if (d["Control"] == "Public") {
                        return "thistle";
                    } else {
                        return "darkmagenta";
                    }
                } else {
                    return 'rgba(255,255,255,0)';
                }
            })
        };

    d3.select("#chart3")
        .append('p')
        .append('button')
        .style("border", "1px solid black")
        .text('Reset Filter')
        .on('click', function() {
            clearText()
            chart1.selectAll("circle")
            .transition()
            .style('fill', function(d) {
                if(d["Locale"].match(/Suburb/)){
                        return "slategray";
                    }
                    if (d["Locale"].match(/Rural/)) {
                        return "steelblue";
                    }
                    if (d["Locale"].match(/City/)) {
                        return "darkblue";
                    } else {
                        return "darkgreen"
                    }
            })
            chart2.selectAll("circle")
            .transition()
            .style('fill', function(d) {
                if (d["Control"] == "Public") {
                    return "thistle";
                } else {
                    return "darkmagenta";
                }
            })

        });

});