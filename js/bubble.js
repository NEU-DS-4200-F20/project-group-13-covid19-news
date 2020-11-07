function graphBubble() {
    let margin = {
        top: 60,
        left: 50,
        right: 30,
        bottom: 20
      },
      width = 500 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom,
      xValue = d => d[0],
      yValue = d => d[1],
      xLabelText = '',
      yLabelText = '',
      yLabelOffsetPx = 0,
      xScale = d3.scaleLinear(),
      yScale = d3.scaleLinear(),
      ourBrush = null,
      selectableElements = d3.select(null),
      dispatcher

    function chart(selector, dataFromCsv) {

        let minData = d3.min(dataFromCsv, (d) => parseInt(d.Count)),
        maxData = d3.max(dataFromCsv, (d) => parseInt(d.Count));
        let dataset = {
            "children": dataFromCsv
        }

        const allCountArr = [];
        for (let i =0; i < dataFromCsv.length; i++) {
            allCountArr.push(parseInt(dataFromCsv[i].Count))
        }
        console.log(allCountArr)
        var diameter = 600;
        // color = d3.scaleOrdinal(d3.schemeCategory10)
        var color = d3.scaleOrdinal()
		//   .domain(data.map(function(d){ return d.departement;}))
		  .range([ '#003f00', '#006500', '#198b19','#66b266']);

        var bubble = d3.pack(dataset)
            .size([diameter, diameter])
            .padding(1.5);

            var svg = d3.select(selector)
            .append("svg")
            .attr("width", diameter)
            .attr("height", diameter)
            .attr("class", "bubble");

            


            var nodes = d3.hierarchy(dataset)
            .sum(function(d) { 
                return d.Count; });

            var node = svg.selectAll(".node")
            .data(bubble(nodes).descendants())
            .enter()
            .filter(function(d){
                return  !d.children
            })
            .append("g")
            .attr("class", "node")
            .attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")";
            });

            node.append("title")
            .text(function(d) {
                return `the word "${d.data.Word}" was in ${d.data.Count} of X articles we analyzed` // place holder X, change later once we get the number of articles
            });

            node.append("circle")
            .attr("r", function(d) {
                return d.r;
            })
            .style("fill", function(d,i) {
                const count = parseInt(d.data.Count)
                if (count > d3.quantile(allCountArr, 0.75)) {
                    return color(3)
                } else if (count >= d3.quantile(allCountArr, 0.5)) {
                    return color(2)
                } 
             else if (count >= d3.quantile(allCountArr, 0.25)) {
                return color(1)
            }
                else {
                    return color(0)
                }
            });

            node.append("text")
            .attr("dy", ".2em")
            .style("text-anchor", "middle")
            .text(function(d) {
                return d.data.Word;
            })
            .attr("font-family", "sans-serif")
            .attr("font-size", function(d){
                return d.r/2.8;
            })
            .attr("fill", "white");

        d3.select(self.frameElement)
            .style("height", diameter + "px");


            
    }

    return chart;

}