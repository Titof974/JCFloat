var el = document.getElementById("test");
console.log(new jcfloat.LinePlot(el, [
    new jcfloat.Metric('test', [
        new jcfloat.Point(1,1),
        new jcfloat.Point(2,2),
    ])
], {
    containerWidth: 100,
    containerHeight: 200,
    margin: {
        left: 10,
        top: 10
    }
}));