var el = document.getElementById("test");
var offset = 60000;
var start_at = 1562796060000;
var nbpoints = 100;
var dataset = [];
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

for(var i = 0; i < nbpoints; i++) {
    dataset.push(new jcfloat.Point(start_at + offset * i , getRandomInt(10000)))
}
console.log(dataset);   
console.log(new jcfloat.LinePlot(el, [
    new jcfloat.Metric('test', dataset)
], {
    containerWidth: 1000,
    containerHeight: 500,
    margin: {
        left: 50,
        top: 50,
        bottom: 50,
        right : 50,
    }
}));
