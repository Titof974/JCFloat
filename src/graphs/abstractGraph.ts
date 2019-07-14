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
        let max: number = -Infinity;
        for (let index = 0; index < this.metrics.length; index++) {
            const metric = this.metrics[index];
            if (metric.maxX() > max) {
                max = metric.maxX();
            }
        }
        return max;
    }

    protected maxYMetrics(): number{
        let max: number = -Infinity;
        for (let index = 0; index < this.metrics.length; index++) {
            const metric = this.metrics[index];
            if (metric.maxY() > max) {
                max = metric.maxY();
            }
        }
        return max;
    }

    protected minXMetrics(): number{
        let min: number = +Infinity;
        for (let index = 0; index < this.metrics.length; index++) {
            const metric = this.metrics[index];
            if (metric.minX() < min) {
                min = metric.minX();
            }
        }
        return min;
    }

    protected minYMetrics(): number{
        let min: number = +Infinity;
        for (let index = 0; index < this.metrics.length; index++) {
            const metric = this.metrics[index];
            if (metric.minY() < min) {
                min = metric.minY();
            }
        }
        return min;
    }

    protected maxSize(): number{
        let max: number = 0;
        for (let index = 0; index < this.metrics.length; index++) {
            const metric = this.metrics[index];
            if (metric.size() > max) {
                max = metric.size();
            }
        }
        return max;
    }
    
}