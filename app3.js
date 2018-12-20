var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("data.csv")
  .then(function(healthdata) {

    // Step 1: Parse Data/Cast as numbers
    // ==============================
    // healthdata.forEach(function(data) {
    //   data.hair_length = +data.hair_length;
    //   data.num_hits = +data.num_hits;
    // });

    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
    .range([0, width]); 
    var yLinearScale = d3.scaleLinear()
    .range([height, 0]);
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);
    xLinearScale.domain([9, d3.max(healthdata, function(data){
          return +data.poverty
      })]);
   

    yLinearScale.domain([0, d3.max(healthdata, function(data){
        return +data.healthcare
    })]);
    
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -20])
      .html(function(d) {
        return (`${d.state}<br>Poverty: ${d.poverty}<br>Healthcare: ${d.healthcare}`);
      });

    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    // Step 3: Create axis functions
    // ==============================
    // var bottomAxis = d3.axisBottom(xLinearScale);
    // var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    // chartGroup.append("g")
    //   .attr("transform", `translate(0, ${height})`)
    //   .call(bottomAxis);

    // chartGroup.append("g")
    // //   .call(leftAxis);

    // Step 5: Create Circles
    // ==============================
    var circlesGroup = svg.selectAll("g").data(healthdata).enter();
    circlesGroup.append("circle")
            .attr("cx", function(data, index){
                return xLinearScale(data.poverty);
                    })
            .attr("cy", function(data, index){
                return yLinearScale(data.healthcare);
            })
            .attr("r", "15")
            .attr("fill", "blue")
            .attr("opacity", ".5")
            .attr("class", function(d){
            return "stateCirle";
            })
            .attr("fill", "blue")
            .on ("click", function(data){
                toolTip.show(data)
            });

circlesGroup.append("text", "circle")
     .text(function(d) {
       return d.abbr;
     })
     .attr("dx", function(d) {
       return xLinearScale(d.poverty);
     })
     .attr("dy", function(d) {
       return yLinearScale(d.healthcare) + 15 / 2.5;;
     })
     .attr("font-size", "15")
     .attr("class", "stateText")
     // onmouseout event
      .on("mouseover", function(d) {
       // Show the tooltip
       toolTip.show(d);
       // Highlight the state circle's border
       d3.select(this).style("stroke", "#323232");
      })
     .on("mouseout", function(d) {
       // Remove the tooltip
       toolTip.hide(d);
       // Remove highlight
       d3.select(this).style("stroke", "#e3e3e3");
     });
    

    // Step 6: Initialize tool tip
    // ==============================
    // var toolTip = d3.tip()
    //   .attr("class", "tooltip")
    //   .offset([80, -60])
    //   .html(function(d) {
    //     return (`${d.state}<br>Poverty: ${d.poverty}<br>Healthcare: ${d.healthcare}`);
    //   });

    // // Step 7: Create tooltip in the chart
    // // ==============================
    // chartGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    // circlesGroup.on("click", function(data) {
    //   toolTip.show(data, this);
    // })
    //   // onmouseout event
    //   .on("mouseout", function(data, index) {
    //     toolTip.hide(data);
    //   });

    // Create axes labels
 // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
       .call(leftAxis);

    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Healthcare");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("Poverty");
  });
