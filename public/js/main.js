$(function(){
  
  $(".dropdown-menu li a").click(function(){
    
    $(".btn:first-child").innerHtml = $(this).text()+"<span class='caret'></span>";
  });

});


var regionSalesData;
var regionProfitData;
var categorySalesData;
var categoryProfitData;

var vis = d3.select("#vis"),
	margin = {top: 20, right: 20, bottom: 30, left: 60},
    width = +vis.attr("width") - margin.left - margin.right,
    height = +vis.attr("height") - margin.top - margin.bottom,
	chart = vis.append('svg')
		.classed("chart",true)
		.attr("width", vis.attr("width"))
		.attr("height", vis.attr("height"));

var x = d3.scaleBand().rangeRound([0, width]).padding(0.3),
	y = d3.scaleLinear().rangeRound([height, 0]);

var g = chart.append('g')
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Data aggregation
function initData() {
	d3.csv("data/CoffeeData.csv", function(error, csv_data) {

		if (error) throw error;
		
		regionSalesData = d3.nest()
			.key(function(d) {
				return d.region;
			})
			.rollup(function(d) {
				return d3.sum(d, function(g) {
					return g.sales;
				});
			})
			.entries(csv_data);
		console.log("regionSalesData", regionSalesData);

		regionProfitData = d3.nest()
			.key(function(d) {
				return d.region;
			})
			.rollup(function(d) {
				return d3.sum(d, function(g) {
					return g.profit;
				});
			})
			.entries(csv_data);
		console.log("regionProfitData", regionProfitData);

		categorySalesData = d3.nest()
			.key(function(d) {
				return d.category;
			})
			.rollup(function(d) {
				return d3.sum(d, function(g) {
					return g.sales;
				});
			})
			.entries(csv_data);
		console.log("categorySalesData", categorySalesData);

		categoryProfitData = d3.nest()
			.key(function(d) {
				return d.category;
			})
			.rollup(function(d) {
				return d3.sum(d, function(g) {
					return g.profit;
				});
			})
			.entries(csv_data);
		console.log("categoryProfitData", categoryProfitData);

		update(regionSalesData);

	});
}

function update(data) {
	x.domain(data.map(function(d) { return d.key;}));
	y.domain([0, d3.max(data, function(d) {return d.value;})]);

	g.append("g")
		.attr("class", "axis asix--x")
		.attr("transform", "translate(0," + height + ")")
      	.call(d3.axisBottom(x));

    g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y).ticks(6))
   	  .append("text")
      .attr("transform", "translate(" + width + "," + 0 + ")")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Sales");

    g.selectAll(".bar")
    .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.key); })
      .attr("y", function(d) { return y(d.value); })
      .attr("width", x.bandwidth())
      .attr("height", function(d) { return height - y(d.value); });
}

// Setup Axis

initData();

