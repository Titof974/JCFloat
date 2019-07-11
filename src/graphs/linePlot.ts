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

        // Chart body
      this.elems.svg = d3.select(this.chartElement)
      .append("svg")
      .attr("width", this.props.containerWidth)
      .attr("height", this.props.containerHeight)
      .append("g")
      .attr("transform",
            "translate(" +  this.props.margin.left + "," +  this.props.margin.top + ")");


      // Add X axis --> it is a date format
      this.elems.x = d3.scaleTime()
    .domain([this.metrics[0].minX(), this.metrics[0].maxX()])
    .range([ 0, width ]);

    this.elems.xAxis = this.elems.svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom( this.elems.x));

    // Add Y axis
    this.elems.y = d3.scaleLinear()
      .domain([0, this.metrics[0].maxY()])
      .range([ height, 0 ]);
      this.elems.yAxis = this.elems.svg.append("g")
      .call(d3.axisLeft(this.elems.y));
    

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
      .attr("clip-path", "url(#clip)")

      let _this = this;

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



    // A function that set idleTimeOut to null
    let idleTimeout: any;
    function idled() { idleTimeout = null; }


    // A function that update the chart for given boundaries
    function updateChart(context: any) {
      return () => {

      // What are the selected boundaries?
      let extent = d3.event.selection

      // If no selection, back to initial coordinate. Otherwise, update X axis domain
      if(!extent){
        if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
        context.elems.x.domain([ 4,8])
      }else{
        context.elems.x.domain([ context.elems.x.invert(extent[0]), context.elems.x.invert(extent[1]) ])
        line.select(".brush").call(context.elems.brush.move, null) // This remove the grey brush area as soon as the selection has been done
      }

      // Update axis and line position
      context.elems.xAxis.transition().duration(1000).call(d3.axisBottom(context.elems.x))
      line
          .select('.line')
          .transition()
          .duration(1000)
          .attr("d", d3.line()
            .x(function(d: any) { return context.elems.x(d.x) })
            .y(function(d: any) { return context.elems.y(d.y) })
          )
        }
    }

    // If user double click, reinitialize the chart
    this.elems.svg.on("dblclick",function(){
      _this.elems.x.domain([_this.metrics[0].minX(), _this.metrics[0].maxX()])
      _this.elems.xAxis.transition().call(d3.axisBottom(_this.elems.x))
      line
        .select('.line')
        .transition()
        .attr("d", d3.line()
          .x(function(d: any) { return _this.elems.x(d.x) })
          .y(function(d: any) { return _this.elems.y(d.y) })
      )
    });


    }

}
