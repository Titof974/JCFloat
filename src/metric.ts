import { IPoint } from './point';
import { Point } from '.';

interface IMetric {
    name: String;
    data: IPoint[];
}

class Metric {
    
    metric: IMetric;

    constructor(name: String, data: IPoint[]) {
        this.metric = { name: name, data: data } as IMetric;
    }

    size() {
        return this.metric.data.length;
    }

    get(): IMetric {
        return this.metric;
    }

    maxX(): number {
        return Math.max(...this.metric.data.map(d => d.x));
    }

    maxY(): number {
        return Math.max(...this.metric.data.map(d => d.y));
    }

    minX(): number {
        return Math.min(...this.metric.data.map(d => d.x));
    }

    minY(): number {
        return Math.min(...this.metric.data.map(d => d.y));
    }

    convert(cb: (p: IPoint) => IPoint) {
        this.metric.data = this.metric.data.map(p => cb(p));
    }
}

export { IMetric, Metric };