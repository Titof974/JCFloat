import { Metric } from "../metric";

export abstract class AbstractGraph {
    metrics: Metric[] = [];
    chartElement: any;
    elems: any = {};
    props: any;

    constructor(chartElement: any, metrics: Metric[], props: any) {
        this.chartElement = chartElement;
        this.metrics = metrics;
        this.props = props;
    }

    protected abstract init(): void;

    protected maxXMetrics(): number{
        return Math.max(...this.metrics.map(m => m.maxX()));
    }

    protected maxYMetrics(): number{
        return Math.max(...this.metrics.map(m => m.maxY()));
    }

    protected minXMetrics(): number{
        return Math.min(...this.metrics.map(m => m.minX()));
    }

    protected minYMetrics(): number{
        return Math.min(...this.metrics.map(m => m.minY()));
    }

    protected maxSize(): number{
        return Math.max(...this.metrics.map(m => m.size()));
    }
    
}