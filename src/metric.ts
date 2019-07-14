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
        let max: number = -Infinity;
        for (let index = 0; index < this.metric.data.length; index++) {
            const item = this.metric.data[index];
            if (item.x > max) {
                max = item.x;
            }
        }
        return max;
    }

    maxY(): number {
        let max: number = -Infinity;
        for (let index = 0; index < this.metric.data.length; index++) {
            const item = this.metric.data[index];
            if (item.y > max) {
                max = item.y;
            }
        }
        return max;
    }

    minX(): number {
        let min: number = +Infinity;
        for (let index = 0; index < this.metric.data.length; index++) {
            const item = this.metric.data[index];
            if (item.x < min) {
                min = item.x;
            }
        }
        return min;
    }

    minY(): number {
        let min: number = +Infinity;
        for (let index = 0; index < this.metric.data.length; index++) {
            const item = this.metric.data[index];
            if (item.y < min) {
                min = item.y;
            }
        }
        return min;
    }

    convert(cb: (p: IPoint) => IPoint) {
        this.metric.data = this.metric.data.map(p => cb(p));
    }
}

export { IMetric, Metric };