import { AbstractGraph } from "./abstractGraph";
import { Metric } from "../metric";
import * as d3 from 'd3';
import { IPoint } from "../point";
import { stringToColour } from "../utils/color";

export class LinePlot extends AbstractGraph {
    
    constructor(chartElement: any, metrics: Metric[], props: any){
        super(chartElement, metrics, props);
        this.init();
    }

    protected convertPoint(point: IPoint): IPoint {
        return { x: new Date(point.x), y: point.y } as IPoint;
    }

    protected init(): void {
      let _this = this;

      

        let width = this.props.containerWidth - this.props.margin.left - this.props.margin.right;
        let height = this.props.containerHeight - this.props.margin.top -  this.props.margin.bottom - 150;
        let height2 = this.props.containerHeight - this.props.margin.top -  this.props.margin.bottom;

        // Convert metric to timestamp, number
        this.metrics.forEach(m => m.convert(this.convertPoint));


        // Chart body
      this.elems.svg = d3.select(this.chartElement)
      .append("svg")
      .attr("width", this.props.containerWidth)
      .attr("height", this.props.containerHeight)
      .append("g")
      .attr("transform",
            "translate(" +  this.props.margin.left + "," +  this.props.margin.top + ")");


      // Add X axis --> it is a date format
      var formatMillisecond = d3.timeFormat("%Q"),
      formatSecond = d3.timeFormat(":%S"),
      formatMinute = d3.timeFormat("%I:%M"),
      formatHour = d3.timeFormat("%I %p"),
      formatDay = d3.timeFormat("%a %d"),
      formatWeek = d3.timeFormat("%b %d"),
      formatMonth = d3.timeFormat("%B"),
      formatYear = d3.timeFormat("%Y");
  
    this.elems.multiFormat = function(date: Date) {
    return (d3.timeSecond(date) < date ? formatMillisecond
        : d3.timeMinute(date) < date ? formatSecond
        : d3.timeHour(date) < date ? formatMinute
        : d3.timeDay(date) < date ? formatHour
        : d3.timeMonth(date) < date ? (d3.timeWeek(date) < date ? formatDay : formatWeek)
        : d3.timeYear(date) < date ? formatMonth
        : formatYear)(date);
  }

                // create a tooltip
let Tooltip = d3.select(this.chartElement)
.append("div")
.style("opacity", 0)
.attr("class", "tooltip")
.style("background-color", "white")
.style("border", "solid")
.style("border-width", "2px")
.style("border-radius", "5px")
.style("padding", "5px")
.style("position", "absolute");


var mouseover = function(d: any, i: number, group: any) {
  Tooltip
    .style("opacity", 1)
  d3.select(group[i])
    .style("stroke", "black")
    .style("opacity", 1)
}
var mousemove = function(d: any, i: number, group: any) {
  Tooltip
    .html("The exact value of<br>this cell is: " + d.x)
    .style("left", (d3.mouse(group[i])[0]+70) + "px")
    .style("top", (d3.mouse(group[i])[1]) + "px")
}
var mouseleave = function(d: any, i: number, group: any) {
  Tooltip
    .style("opacity", 0)
  d3.select(group[i])
    .style("stroke", "red")
}

    // Add X axis

    this.elems.x = d3.scaleTime()
    .domain([this.metrics[0].minX(), this.metrics[0].maxX()])
    .range([ 0, width ]);

    this.elems.xAxis = this.elems.svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom( this.elems.x).tickFormat(_this.elems.multiFormat));

    // Add X axis preview

    this.elems.x2 = d3.scaleTime()
    .domain([this.metrics[0].minX(), this.metrics[0].maxX()])
    .range([ 0, width ]);

    this.elems.xAxis2 = this.elems.svg.append("g")
    .attr("transform", "translate(0," + height2 + ")")
      .call(d3.axisBottom( this.elems.x2).tickFormat(_this.elems.multiFormat));



    // Add Y axis
    this.elems.y = d3.scaleLinear()
      .domain([0, this.metrics[0].maxY()])
      .range([ height, 0 ]);
      this.elems.yAxis = this.elems.svg.append("g")
      .call(d3.axisLeft(this.elems.y));
    
      // Add Y Preview
      this.elems.y2 = d3.scaleLinear()
      .domain([0, this.metrics[0].maxY()])
      .range([ 100, 0 ]);

    // Add a clipPath: everything out of this area won't be drawn.
    this.elems.clip = this.elems.svg.append("defs").append("svg:clipPath")
        .attr("id", "clip")
        .append("svg:rect")
        .attr("width", width )
        .attr("height", height )
        .attr("x", 0)
        .attr("y", 0);

    // Add brushing
    this.elems.brush = d3.brushX()                   // Add the brush feature using the d3.brush function
        .extent( [ [0,0], [width,height] ] )  // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
        .on("end", updateChart(this))               // Each time the brush selection changes, trigger the 'updateChart' function

    // Create the line variable: where both the line and the brush take place
    var line = this.elems.svg.append('g')
      .attr("clip-path", "url(#clip)");

    // Add the line
    line.append("path")
    .datum(this.metrics[0].get().data)
          .attr("class", "line")  // I add the class line to be able to modify this line later on.
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function(d:any) { return _this.elems.x(d.x) })
        .y(function(d:any) { return _this.elems.y(d.y) })
        )

    // Add the brushing
    line
      .append("g")
        .attr("class", "brush")
        .call(this.elems.brush);

        line.selectAll(".dot")
                .data(this.metrics[0].get().data)
              .enter().append("circle") 
                    .attr("fill", "white")
                .attr("stroke", "red") 
                .attr("cx", function(d: any) { return _this.elems.x(d.x) })
                .attr("cy",function(d: any) { return _this.elems.y(d.y) })
                .attr("r",5)
                .on("mouseover", mouseover)
                        .on("mousemove", mousemove)
                        .on("mouseleave", mouseleave)


        
    this.elems.context = this.elems.svg.append("g")
    .attr("class", "context")
    .attr("transform", "translate(" + 0 + "," + 250 + ")");

    // Add the line
    this.elems.context.append("path")
    .datum(this.metrics[0].get().data)
          .attr("class", "line")  // I add the class line to be able to modify this line later on.
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function(d:any) { return _this.elems.x2(d.x) })
        .y(function(d:any) { return _this.elems.y2(d.y) })
        )

        this.elems.brush2 = d3.brushX()
        .extent([[0, 0], [width, 100]]).on("start brush end", brushed2);

        this.elems.gBrush2 = this.elems.context.append("g")
        .attr("class", "brush2")
        .call(this.elems.brush2)
        .call(this.elems.brush2.move, this.elems.x2.range());

        function brushed2() {
          if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
          var s = d3.event.selection;
          if (s) {
            _this.elems.x.domain([ _this.elems.x2.invert(s[0]), _this.elems.x2.invert(s[1]) ]);
            // Update axis and line position
            _this.elems.xAxis.transition().duration(1000).call(d3.axisBottom(_this.elems.x).tickFormat(_this.elems.multiFormat))
        .selectAll("text")	
        .style("text-anchor", "end")
              .attr("dx", "-.8em")
              .attr("dy", ".15em")
              .attr("transform", "rotate(-65)" );

              var t = _this.elems.svg.transition().duration(750);

              line
              .select('.line')
              .transition(t)
              .attr("d", d3.line()
                .x(function(d: any) { return _this.elems.x(d.x) })
                .y(function(d: any) { return _this.elems.y(d.y) })
              )

              line.selectAll("circle")
              .transition(t)
              .attr("cx", function(d: any) { return _this.elems.x(d.x); })
              .attr("cy", function(d: any) { return _this.elems.y(d.y); });
    
          }

     
        }
        

    // A function that set idleTimeOut to null
    let idleTimeout: any;
    function idled() { idleTimeout = null; }


    // A function that update the chart for given boundaries
    function updateChart(context: any) {
      return () => {
        var t = context.elems.svg.transition().duration(750);
      // What are the selected boundaries?
      let extent = d3.event.selection;


      // If no selection, back to initial coordinate. Otherwise, update X axis domain
      if(!extent){
        return;
      }else{
        context.elems.x.domain([ context.elems.x.invert(extent[0]), context.elems.x.invert(extent[1]) ]);
        context.elems.gBrush2.transition()
        .call(context.elems.brush2.move,[ context.elems.x2(context.elems.x.invert(extent[0])), context.elems.x2(context.elems.x.invert(extent[1])) ]);

        line.select(".brush").call(context.elems.brush.move, null) // This remove the grey brush area as soon as the selection has been done
      }

      // Update axis and line position
      context.elems.xAxis.transition(t).call(d3.axisBottom(context.elems.x).tickFormat(_this.elems.multiFormat))
      .selectAll("text")	
      .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-65)" );

      line
          .select('.line')
          .transition(t)
          .attr("d", d3.line()
            .x(function(d: any) { return context.elems.x(d.x) })
            .y(function(d: any) { return context.elems.y(d.y) })
          );


          line.selectAll("circle")
          .transition(t)
          .attr("cx", function(d: any) { return context.elems.x(d.x); })
          .attr("cy", function(d: any) { return context.elems.y(d.y); });
        }


      
    }

    // If user double click, reinitialize the chart
    this.elems.svg.on("dblclick",function(){

      _this.elems.gBrush2.call(_this.elems.brush2.move, _this.elems.x2.range());

    });



    }

}
