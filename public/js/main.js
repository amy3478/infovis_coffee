
var regionSalesData;
var regionProfitData;
var categorySalesData;
var categoryProfitData;

var vis,
	chart,
	margin = {top: 20, right: 40, bottom: 30, left: 20},
    width = $("#vis").width(),
    height = width / 4 * 3,
    visW = width - margin.left - margin.right,
    visH = height - margin.top - margin.bottom;

var x = d3.scaleBand().rangeRound([0, visW]).padding(0.3),
	y = d3.scaleLinear().rangeRound([visH, 0]).domain([0, 1000]);


function init() {
	chart = d3.select("#vis").append('svg')
		.classed("chart",true)
		.attr("width", width)
		.attr("height", height);

	vis = chart.append('g')
		.attr("width", visW)
		.attr("height", visH)
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	initData();

	vis.append("g")
		.attr("class", "axis axis--x")
		.attr("transform", "translate(0," + visH + ")")
		.call(d3.axisBottom(x));

    vis.append("g")
      .attr("class", "axis axis--y")
      .attr("transform", "translate(" + visW + ", 0 )")
      .call(d3.axisRight(y).ticks(6));

   updateClicked();
}


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

function updateClicked(){
  var xOption = getXSelectedOption();
  var yOption = getYSelectedOption();

  console.log("xOption", xOption);
  switch (xOption) {
  	case "Region":
  		if (yOption === "Sales") {
  			console.log("regionSalesData");
  			update(regionSalesData);
  		} else if (yOption === "Profit") {
  			console.log("regionProfitData");
  			update(regionProfitData);
  		}
  		break;
  	case "Category":
  		if (yOption === "Sales") {
  			console.log("categorySalesData");
  			update(categorySalesData);
  		} else if (yOption === "Profit") {
  			console.log("categoryProfitData");
  			update(categoryProfitData);
  		}
  		break;
  }
}

function update(data) {
	var myX = d3.scaleBand()
		.rangeRound([0, visW])
		.padding(0.3)
		.domain(data.map(function(d) { return d.key;}));

	var myY = d3.scaleLinear()
		.rangeRound([visH, 0])
		.domain([0, d3.max(data, function(d) {return d.value;})]);



	vis.select(".axis--x")
		.transition()
		.duration(500)
		.call(d3.axisBottom().scale(myX));

	vis.select(".axis--y")
		.transition()
		.duration(500)
		.call(d3.axisRight().scale(myY).ticks(6));

	var u = vis.selectAll(".bar")
		.data(data);

	u.enter()
		.append("rect")
		.classed("bar", true)
		.attr("x", function(d) { return myX(d.key); })
		.attr("y", function(d) { return visH; })
		.attr("width", myX.bandwidth())
		.attr("height", function(d) { return 0; })
		.merge(u)
	    .transition()
	    .duration(500)
		.attr("y", function(d) { return myY(d.value); })
		.attr("height", function(d) { return visH - myY(d.value); });

	u.exit()
		.transition()
		.duration(500)
		.attr("y", function(d) { return visH; })
		.attr("height", function(d) { return 0; })
		.each('end', function() {
			d3.select(this).remove();
		});
}

// Returns the selected option in the X-axis dropdown. Use d[getXSelectedOption()] to retrieve value instead of d.getXSelectedOption()
function getXSelectedOption(){
  var node = d3.select('#xdropdown').node();
  var i = node.selectedIndex;
  return node[i].value;
}

// Returns the selected option in the X-axis dropdown. 
function getYSelectedOption(){
  var node = d3.select('#ydropdown').node();
  var i = node.selectedIndex;
  return node[i].value;
}



