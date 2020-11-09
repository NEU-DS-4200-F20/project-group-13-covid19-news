// Initialize a bubble chart. Modeled after Mike Bostock's
// Reusable Chart framework https://bost.ocks.org/mike/chart/
function graphBubble() {

    // Based on Mike Bostock's margin convention
    // https://bl.ocks.org/mbostock/3019563
    let margin = {
        top: 60,
        left: 50,
        right: 30,
        bottom: 0
      },
      width = 500 - margin.left - margin.right,
      height = 240;

    // Create the chart by adding an svg to the div with the id 
    // specified by the selector using the given data
    function chart(selector, dataFromCsv) {

        // create a dataset object from the data we get from the csv
        let dataset = {
            "children": dataFromCsv
        }

        const allCountArr = []; // create an array with all the word counts so we can use this later (for calculating quartiles)
        for (let i =0; i < dataFromCsv.length; i++) {
            allCountArr.push(parseInt(dataFromCsv[i].Count))
        }

        // set colors and settings for the bubbles
        const diameter = 200; 
        const color = d3.scaleOrdinal()
		  .range([ '#003f00', '#006500', '#198b19','#66b266']);

          const bubble = d3.pack(dataset)
            .size([diameter, diameter])
            .padding(1.5);

            // create svg that will contain our bubbles
            let svg = d3.select(selector)
                .append('svg')
                .attr('preserveAspectRatio', 'xMidYMid meet') // this will scale your visualization according to the size of the page.
                .attr('width', '100%') // this is now required by Chrome to ensure the SVG shows up at all
                .style('background-color', 'white') // change the background color to white
                .attr('viewBox', [0, 0, width, height].join(' '))
                // .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

              svg.append("text") // this appends a title for the graph. Source: http://www.d3noob.org/2013/01/adding-title-to-your-d3js-graph.html
                .attr("x", 210)
                .attr("y", 10)
                .attr("text-anchor", "middle")
                .style("font-size", "10px")
                .style("text-decoration", "underline")
                .text("Most used keywords During the COVID-19 Pandemic (January 2020 - May 2020)");

            // create a color legend. Source: https://bl.ocks.org/HarryStevens/6eb89487fc99ad016723b901cbd57fde  
            const colors = [{"color":"#fff","value":0}, {"color":"#66b266","value":25},{"color":"#198b19","value":50},{"color":"#006500","value":75},{"color":"#003f00","value":100}]
            const extent = d3.extent(colors, d => d.value);
    
            const padding = 9;
            const legendWidth = 320;
            const innerWidth = legendWidth - (padding * 2);
            const barHeight = 8;

            // create the scale with ticks
            const xScale = d3.scaleLinear()
                .range([0, innerWidth])
                .domain(extent);
        
                const xTicks = colors.map(d => d.value);
        
                let xAxis = d3.axisBottom(xScale)
                .tickSize(barHeight * 2)
                .tickValues(xTicks);
        
            
            let g = svg.append("g").attr("transform", "translate(" + 55 + ", 210)");
        
            // create gradients
            let defs = svg.append("defs");
            let linearGradient = defs.append("linearGradient").attr("id", "myGradient");
            linearGradient.selectAll("stop")
                .data(colors)
                .enter().append("stop")
                .attr("offset", d => ((d.value - extent[0]) / (extent[1] - extent[0]) * 100) + "%")
                .style("fill", '#fff');
        
            // append the rectangles to the group
            g.append("rect")
                .attr("width", innerWidth)
                .attr("height", barHeight)
                .style("fill", "url(#myGradient)");
        
            g.append("g")
                .call(xAxis)
                .select(".domain").remove();


            // add data to individual bubbles
            const nodes = d3.hierarchy(dataset)
            .sum(function(d) { 
                return d.Count; });

            const node = svg.selectAll(".node")
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

            // details on demand when user hovers over bubble
            node.append("title")
            .text(function(d) {
                return `the word "${d.data.Word}" was in ${d.data.Count} of X articles we analyzed` // place holder X, change later once we get the number of articles
            });

            // append the circles 
            node.append("circle")
            .attr("r", function(d) {
                return d.r;
            })
            .style("fill", function(d) { // color the circles based on size
                const count = parseInt(d.data.Count)
                if (count > d3.quantile(allCountArr, 0.75)) { // if greater/equal to 75th percentile, color dark green
                    return color(3)
                } else if (count >= d3.quantile(allCountArr, 0.5)) { // greater/equal to the 50th percentile, color lighter green
                    return color(2)
                } 
                else if (count >= d3.quantile(allCountArr, 0.25)) { // greater/equal to the 25th percentile, color even lighter green
                    return color(1)
                }
                else {
                    return color(0) // else, color the circle the lighest green 
                }
            });

            // append the words to the circles
            node.append("text")
            .attr("dy", ".2em")
            .style("text-anchor", "middle")
            .text(function(d) {
                return d.data.Word;
            })
            .attr("font-family", "sans-serif")
            .attr("font-size", function(d){
                return d.r/2.8; // font size for the text on the circles are based on the radius
            })
            .style("fill", function(d) {
                const count = parseInt(d.data.Count)
                if (count > d3.quantile(allCountArr, 0.75)) { // change font color based on quartiles, where dark green circles have white text and light green ones have black text
                    return 'white'
                } else if (count >= d3.quantile(allCountArr, 0.5)) {
                    return 'white'
                } 
             else if (count >= d3.quantile(allCountArr, 0.25)) {
                return 'white'
            }
                else {
                    return 'black'
                }
            });

        d3.select(self.frameElement)
            .style("height", diameter + "px");
            
            return chart;
    }

    chart.width = function (_) {
        if (!arguments.length) return width;
        width = _;
        return chart;
      };
    
      chart.height = function (_) {
        if (!arguments.length) return height;
        height = _;
        return chart;
      };

    return chart;
}