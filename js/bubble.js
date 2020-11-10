// Initialize a bubble chart. Modeled after Mike Bostock's
// Reusable Chart framework https://bost.ocks.org/mike/chart/
function graphBubble() {

    // Based on Mike Bostock's margin convention
    // https://bl.ocks.org/mbostock/3019563
    let margin = {
        top: 0,
        left: 50,
        right: 30,
        bottom: 0
      },
      width = 500 - margin.left - margin.right,
      height = 250;

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
        const diameter = 205; 
        const color = d3.scaleOrdinal()
		  .range([ '#003f00', '#006500', '#198b19','#7fbf7f']);

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

              svg.append("text") // this appends a title for the graph. Source: http://www.d3noob.org/2013/01/adding-title-to-your-d3js-graph.html
                .attr("x", 100)
                .attr("y", 10)
                .attr("text-anchor", "middle")
                .style("font-size", "6px")
                .style("text-decoration", "underline")
                .attr('margin-bottom', 200)
                .text("Most Used Keywords During the COVID-19 Pandemic (January - May 2020)");

                // add color legend rectangles
                svg.append("rect")
                    .attr("x", 70)
                    .attr("y", 210)
                    .attr("width", 5)
                    .attr("height", 5)
                    .style("fill", "#7fbf7f");

                svg.append("rect")
                    .attr("x", 70)
                    .attr("y", 220)
                    .attr("width", 5)
                    .attr("height", 5)
                    .style("fill", "#198b19");

                svg.append("rect")
                    .attr("x", 70)
                    .attr("y", 230)
                    .attr("width", 5)
                    .attr("height", 5)
                    .style("fill", "#006500");

                    svg.append("rect")
                    .attr("x", 70)
                    .attr("y", 240)
                    .attr("width", 5)
                    .attr("height", 5)
                    .style("fill", "#003f00");

                // add color legend text
                svg.append("text") 
                    .attr("x", 77)
                    .attr("y", 212.75)
                    .text("In less than 25% of analyzed articles")
                    .style("font-size", "4px")
                    .attr("alignment-baseline", "middle");
                    svg.append("text") 
                    .attr("x", 77)
                    .attr("y", 222.75)
                    .text("In 25-50% of analyzed articles")
                    .style("font-size", "4px")
                    .attr("alignment-baseline", "middle");
                    svg.append("text") 
                    .attr("x", 77)
                    .attr("y", 232.75)
                    .text("In 50-75% of analyzed articles")
                    .style("font-size", "4px")
                    .attr("alignment-baseline", "middle");
                    svg.append("text") 
                    .attr("x", 77)
                    .attr("y", 242.75)
                    .text("In more than 75% of analyzed articles")
                    .style("font-size", "4px")
                    .attr("alignment-baseline", "middle");

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
                return `translate(${d.x}, ${d.y + 8})`
            })
            .attr("cx", 410).attr("cy", 190)

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
            })

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
            .style("fill", "white")
            .style('text-shadow', '.5px 0 0 #000, 0 -.5px 0 #000, 0 .5px 0 #000, -.5px 0 0 #000') // add a very thin line shadow

        d3.select(self.frameElement)
            .style("height", diameter + "px");
        
            return chart;
    }

    return chart;
}