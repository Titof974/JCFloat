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
        let width = this.props.containerWidth - this.props.margin.left - this.props.margin.right;
        let height = this.props.containerHeight - this.props.margin.top -  this.props.margin.bottom;
        

        // Convert metric to timestamp, number
        this.metrics.forEach(m => m.convert(this.convertPoint));

        // Body of the player
		this.elems.svg = d3.select(this.chartElement)
		.append('svg')
		.attr('width', this.props.containerWidth )
        .attr('height', this.props.containerHeight);

        this.elems.g = this.elems.svg.append('g')
		.attr('transform', 'translate(' + this.props.margin.left + ', ' + this.props.margin.top + ')')
        .attr('overflow', 'hidden');

        this.elems.x0 = d3.scaleTime().range([0, width]).domain([this.minXMetrics(), this.maxXMetrics()]);
        this.elems.y0 = d3.scaleLinear().range([height, 0]).domain([this.minYMetrics(), this.maxYMetrics()]);
        this.elems.x = d3.scaleTime().range([0, width]).domain([this.minXMetrics(), this.maxXMetrics()]);
        this.elems.y = d3.scaleLinear().range([height, 0]).domain([this.minYMetrics(), this.maxYMetrics()]);

        this.elems.xAxis = d3.axisBottom(this.elems.x);
        this.elems.yAxis = d3.axisLeft(this.elems.y);
      
        this.elems.g.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .attr("fill", "#000")
        .call(this.elems.xAxis);

        this.elems.g.append("g")
        .attr("class", "y axis")
        .attr("fill", "#000")
        .call(this.elems.yAxis);

        let _this = this;

        let color = stringToColour(this.metrics[0].get().name);

        this.elems.g.append("path")
      .datum(this.metrics[0].get().data)
      .attr("fill", "none")
      .attr("stroke", color)
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function(d: any) { return _this.elems.x(d.x) })
        .y(function(d: any) { return _this.elems.y(d.y) })
        );


        // brush
        let idleTimeout: any,
        idleDelay = 350
        let brush = d3.brush().on("end", brushended(this, zoom));
        this.elems.g.append("g")
    .attr("class", "brush")
    .call(brush);
        function brushended(context: LinePlot, zoom: any) {
          return () => {
            var s = d3.event.selection;
          if (!s) {
            if (!idleTimeout) return idleTimeout = setTimeout(idled, idleDelay);
            context.elems.x.domain(context.elems.x0);
            context.elems.y.domain(context.elems.y0);
          } else {
            context.elems.x.domain([s[0][0], s[1][0]].map(context.elems.x.invert, context.elems.x));
            context.elems.y.domain([s[1][1], s[0][1]].map(context.elems.y.invert, context.elems.y));
            context.elems.svg.select(".brush").call(brush.move, null);
          }
          zoom(context)();
          }
          
        }

        
function zoom(context: LinePlot) {
  return () => {
    var t = context.elems.svg.transition().duration(750);
    context.elems.svg.select(".axis--x").transition(t).call(context.elems.xAxis);
    context.elems.svg.select(".axis--y").transition(t).call(context.elems.yAxis);
    context.elems.svg.selectAll("circle").transition(t)
        .attr("cx", function(d: any) { return context.elems.x(d.x); })
        .attr("cy", function(d: any) { return context.elems.y(d.y); });
  }
}

        function idled() {
          idleTimeout = null;
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
      .style("stroke", color)
  }


        this.elems.g.selectAll(".dot")
        .data(this.metrics[0].get().data)
      .enter().append("circle") 
            .attr("fill", "white")
        .attr("stroke", color) 
        .attr("cx", function(d: any) { return _this.elems.x(d.x) })
        .attr("cy",function(d: any) { return _this.elems.y(d.y) })
        .attr("r",5)    .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)
    }

}
