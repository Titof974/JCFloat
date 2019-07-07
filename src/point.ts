interface IPoint {
	readonly x: any;
	readonly y: any;
}

function Point(x: any, y: any): IPoint {
	return { x, y } as IPoint;
}

export { IPoint, Point };
