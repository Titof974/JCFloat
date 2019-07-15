

https://bl.ocks.org/EfratVil/92f894ac0ba265192411e73f633a3e2f

```
<!DOCTYPE html>
<meta charset="utf-8">
<style>

 .line {
        fill: none;
        stroke: steelblue;
        stroke-width: 1.5px;
    }
.zoom {
  cursor: move;
  fill: none;
  pointer-events: all;
}

</style>
<svg width="960" height="500"></svg>
<script src="https://d3js.org/d3.v4.min.js"></script>
<script>

var svg = d3.select("svg"),
    margin = {top: 20, right: 20, bottom: 110, left: 40},
    margin2 = {top: 430, right: 20, bottom: 30, left: 40},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    height2 = +svg.attr("height") - margin2.top - margin2.bottom;

var parseDate = d3.timeParse("%m/%d/%Y %H:%M");

var x = d3.scaleTime().range([0, width]),
    x2 = d3.scaleTime().range([0, width]),
    y = d3.scaleLinear().range([height, 0]),
    y2 = d3.scaleLinear().range([height2, 0]);

var xAxis = d3.axisBottom(x),
    xAxis2 = d3.axisBottom(x2),
    yAxis = d3.axisLeft(y);

var brush = d3.brushX()
    .extent([[0, 0], [width, height2]])
    .on("brush end", brushed);

var zoom = d3.zoom()
    .scaleExtent([1, Infinity])
    .translateExtent([[0, 0], [width, height]])
    .extent([[0, 0], [width, height]])
    .on("zoom", zoomed);

    var line = d3.line()
        .x(function (d) { return x(d.Date); })
        .y(function (d) { return y(d.Air_Temp); });

    var line2 = d3.line()
        .x(function (d) { return x2(d.Date); })
        .y(function (d) { return y2(d.Air_Temp); });

    var clip = svg.append("defs").append("svg:clipPath")
        .attr("id", "clip")
        .append("svg:rect")
        .attr("width", width)
        .attr("height", height)
        .attr("x", 0)
        .attr("y", 0); 


    var Line_chart = svg.append("g")
        .attr("class", "focus")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr("clip-path", "url(#clip)");


    var focus = svg.append("g")
        .attr("class", "focus")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var context = svg.append("g")
    .attr("class", "context")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

d3.csv("CIMIS_Station_125.csv", type, function (error, data) {
  if (error) throw error;

  x.domain(d3.extent(data, function(d) { return d.Date; }));
  y.domain([0, d3.max(data, function (d) { return d.Air_Temp; })]);
  x2.domain(x.domain());
  y2.domain(y.domain());


    focus.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    focus.append("g")
        .attr("class", "axis axis--y")
        .call(yAxis);

    Line_chart.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line);

    context.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line2);


  context.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height2 + ")")
      .call(xAxis2);

  context.append("g")
      .attr("class", "brush")
      .call(brush)
      .call(brush.move, x.range());

  svg.append("rect")
      .attr("class", "zoom")
      .attr("width", width)
      .attr("height", height)
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .call(zoom);


  console.log(data);
});

function brushed() {
  if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
  var s = d3.event.selection || x2.range();
  x.domain(s.map(x2.invert, x2));
  Line_chart.select(".line").attr("d", line);
  focus.select(".axis--x").call(xAxis);
  svg.select(".zoom").call(zoom.transform, d3.zoomIdentity
      .scale(width / (s[1] - s[0]))
      .translate(-s[0], 0));
}

function zoomed() {
  if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
  var t = d3.event.transform;
  x.domain(t.rescaleX(x2).domain());
  Line_chart.select(".line").attr("d", line);
  focus.select(".axis--x").call(xAxis);
  context.select(".brush").call(brush.move, x.range().map(t.invertX, t));
}

function type(d) {
  d.Date = parseDate(d.Date);
  d.Air_Temp = +d.Air_Temp;
  return d;
}

</script>

```

D3js with quadtree and canvas
https://bl.ocks.org/emeeks/306e64e0d687a4374bcd

```
<html>
<head>
  <title>D3 in Action Chapter 11 - Example 8</title>
  <meta charset="utf-8" />
<script src="https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.5/d3.min.js"></script>
</head>
<style>
body, html {
    margin: 0;
  }
canvas {
  position: absolute;
  width: 500px;
  height: 500px;
}
svg {
  position: absolute;
  width:500px;
  height:500px;
}
path.country {
    fill: gray;
    stroke-width: 1;
    stroke: black;
    opacity: .5;
}
path.sample {
    stroke: black;
    stroke-width: 1px;
    fill: red;
    fill-opacity: .5;
}
line.link {
      stroke-width: 1px;
      stroke: black;
      stroke-opacity: .5;
}
circle.node {
  fill: red;
  stroke: white;
  stroke-width: 1px;
}
circle.xy {
  fill: pink;
  stroke: black;
  stroke-width: 1px;
}
rect.extent {
  fill-opacity:.1;
  stroke: black;
  stroke-width: 1px;
}
</style>
<body>
<canvas height="500" width="500"></canvas>
<div id="viz">
  <svg></svg>
</div>
</body>
  <footer>
    
<script>
  sampleData = d3.range(10000).map(function(d) {
    var datapoint = {};
    datapoint.id = "Sample Node " + d;
    datapoint.x = Math.random() * 500;
    datapoint.y = Math.random() * 500;
    
    return datapoint;
  })
  
  quadtree = d3.geom.quadtree()
    .extent([[0,0], [500,500]])
    .x(function(d) {return d.x})
    .y(function(d) {return d.y});
    
  quadData = quadtree(sampleData);
  
  d3.select("svg").selectAll("circle").data(sampleData)
  .enter()
  .append("circle")
  .attr("r", 3)
  .attr("cx", function(d) {return d.x})
  .attr("cy", function(d) {return d.y})
  .style("fill", "pink")
  .style("stroke", "black")
  .style("stroke-width", "1px")

  var brush = d3.svg.brush()
    .x(d3.scale.identity().domain([0, 500]))
    .y(d3.scale.identity().domain([0, 500]))
    .on("brush", brushed);
    
  d3.select("svg").call(brush);
  
function brushed() {
  var e = brush.extent();
  
  d3.selectAll("circle").filter(function(d) {return d.selected}).style("fill", "pink").each(function(d) {d.selected = false})

  quadData.visit(function(node,x1,y1,x2,y2) {
    if (node.point) {
      if (node.point.x >= e[0][0] && node.point.x <= e[1][0] && node.point.y >= e[0][1] && node.point.y <= e[1][1]) {
        node.point.selected = true;
      }
    }
    return x1 > e[1][0] || y1 > e[1][1] || x2 < e[0][0] || y2 < e[0][1];
  })
  d3.selectAll("circle").filter(function(d) {return d.selected}).style("fill", "darkred")
}
</script>
  </footer>

</html>```
https://blog.fastforwardlabs.com/2017/10/04/using-three-js-for-2d-data-visualization.html
https://blog.scottlogic.com/2019/05/28/drawing-2d-charts-with-webgl.html
