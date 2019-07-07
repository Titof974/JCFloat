import { AbstractGraph } from "./abstractGraph";
import { Metric } from "../metric";
import * as d3 from 'd3';
import { IPoint } from "../point";

export class LinePlot extends AbstractGraph {
    
    constructor(chartElement: any, metrics: Metric[], props: any){
        super(chartElement, metrics, props);
        this.init();
    }

    protected convertPoint(point: IPoint): IPoint {
        return { x: new Date(point.x), y: point.y } as IPoint;
    }

    protected init(): void {
        // Convert metric to timestamp, number
        this.metrics.forEach(m => m.convert(this.convertPoint));

        // Body of the player
		this.elems.svg = d3.select(this.chartElement)
		.append('svg')
		.attr('width', this.props.containerWidth)
        .attr('height', this.props.containerHeight);

        this.elems.g = this.elems.svg.append('g')
		.attr('transform', 'translate(' + this.props.margin.left + ', ' + this.props.margin.top + ')')
        .attr('overflow', 'hidden');

        this.elems.x = d3.scaleLinear().range([0, this.metrics[0].size()]).domain([0, 100]);
        this.elems.y = d3.scaleLinear().range([0, 1]).domain([100, 0]);

        this.elems.xAxis = d3.axisBottom(this.elems.x);
        this.elems.yAxis = d3.axisLeft(this.elems.y);
      
        this.elems.svg.append("g")
        .attr("transform", "translate(0," + 100 + ")")
        .call(this.elems.xAxis).attr("fill", "#000");

        this.elems.svg.append("g")
        .call(this.elems.yAxis).attr("fill", "#000");

        let _this = this;

        this.elems.svg.append("path")
      .datum(this.metrics[0].get().data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function(d: any) { return _this.elems.x(d.x) })
        .y(function(d: any) { return _this.elems.y(d.y) })
        )
    }

}