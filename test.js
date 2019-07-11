var el = document.getElementById("test");
console.log(new jcfloat.LinePlot(el, [
    new jcfloat.Metric('test', [
        new jcfloat.Point(1,1),
        new jcfloat.Point(2,2),
    ])
], {
    containerWidth: 500,
    containerHeight: 500,
    margin: {
        left: 50,
        top: 50,
        bottom: 50,
        right : 50,
    }
}));
