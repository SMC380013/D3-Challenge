// @TODO: YOUR CODE HERE!
// Define SVG area dimensions
const svgWidth = 960;
const svgHeight = 500;

// Define the chart's margins as an object

const margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

// Define dimensions of the chart area
const chartWidth = svgWidth - margin.left - margin.right;
const chartHeight = svgHeight - margin.top - margin.bottom;

// Select body, append SVG area to it, and set its dimensions
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append a group area, then set its margins
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Load data from data.csv
// d3.csv("../data/data.csv", function(error, Data) {
d3.csv('/data.csv').then(function (data) {
  // Throw an error if one occurs
  // if (error) throw error;

  // Print the forceData
  console.log(data);
});

// Parse Data/Cast as numbers

data.forEach((data) => {
  data.poverty = +data.poverty;
  data.healthcare = +data.healthcare;
});

// Configure a time scale
// d3.extent returns the an array containing the min and max values for the property specified
let xLinearScale = d3.scaleLinear()
  .domain(d3.extent(data, data => data.poverty))
  .range([0, chartWidth]);


// Configure a linear scale with a range between the chartHeight and 0
let yLinearScale = d3.scaleLinear()
  .domain([0, d3.extent(data, data => data.healthcare)])
  .range([chartHeight, 0]);


//  Create two new functions passing the scales in as arguments
//  These will be used to create the chart's axes
let bottomAxis = d3.axisBottom(xLinearScale);
let leftAxis = d3.axisLeft(yLinearScale);

// set x to the bottom of the chart
chartGroup.append("g")
  .attr("transform", `translate(0, ${chartHeight})`)
  .call(xAxis);

// set y to the y axis
chartGroup.append("g")
  .call(yAxis);

// Create Circles

let circlesGroup = chartGroup.selectAll('circle')
  .data(data)
  .enter()
  .append('circle')
  .attr('cx', data => xLinearScale(data.poverty))
  .attr('cy', data => yLinearScale(data.healthcare))
  .attr('r', 15)
  .attr('fill', 'blue')
  .attr('opacity', '.5');


// Initialize tool tip

let toolTip = d3.tip()
  .attr('class', 'tooltip')
  .offset([80, -60])
  .html((data) => {
    return `${data.abbr}`;
  });

// Create tooltip in the chart

chartGroup.call(toolTip);

// Create event listeners to display and hide the tooltip

circlesGroup.on('click', function (data) {
  toolTip.show(data, this);
})
  .on('mouseout', function (data, index) {
    toolTip.hide(data);
  });

// Create axes labels
chartGroup.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left + 40)
  .attr("x", 0 - (height / 2))
  .attr("dy", "1em")
  .attr("class", "axisText")
  .text("Lacks Healthcare (%)");

chartGroup.append("text")
  .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
  .attr("class", "axisText")
  .text("In Poverty (%)");



