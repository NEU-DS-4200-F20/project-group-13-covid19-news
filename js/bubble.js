// Initialize a bubble chart. Modeled after Mike Bostock's
// Reusable Chart framework https://bost.ocks.org/mike/chart/

// make a global array so linechart.js can access it
const allCountArr = []; // will fill array with all the word counts so we can use this later (for calculating quartiles)

function graphBubble() {

    // Based on Mike Bostock's margin convention
    // https://bl.ocks.org/mbostock/3019563
    let margin = {
        top: 0,
        left: 50,
        right: 30,
        bottom: 35
      },
      ourBrush = null,
      selectableElements = d3.select(null),
      dispatcher,
      svg;

    // Create the chart by adding an svg to the div with the id 
    // specified by the selector using the given data
    function chart(selector, dataFromCsv) {

        // create a dataset object from the data we get from the csv
        let dataset = {
            "children": dataFromCsv
        }

        
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

            svg = d3.select(selector)
            .append('svg')
              .attr('preserveAspectRatio', 'xMidYMid meet')
              .attr('viewBox', [50, 0, 205, 250].join(' '))
              .classed('svg-content', true);
      
          svg = svg.append('g')
              .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

              svg.append("text") // this appends a title for the graph. Source: http://www.d3noob.org/2013/01/adding-title-to-your-d3js-graph.html
                .attr("x", 100)
                .attr("y", 7)
                .attr("text-anchor", "middle")
                .style("font-size", "4px")
                .style("text-decoration", "underline")
                .attr('margin-bottom', 200)
                .text("Most Used Keywords During the COVID-19 Pandemic (January - April 2020)")
                .style("fill", "rgb(0, 0, 0)")
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
                    .text("Bottom 25% most commonly used words in articles")
                    .style("font-size", "4px")
                    .style("fill", "rgb(0, 0, 0)")
                    .attr("alignment-baseline", "middle");
                    svg.append("text") 
                    .attr("x", 77)
                    .attr("y", 222.75)
                    .text("25-50% most commonly used words in articles")
                    .style("font-size", "4px")
                    .style("fill", "rgb(0, 0, 0)")
                    .attr("alignment-baseline", "middle");
                    svg.append("text") 
                    .attr("x", 77)
                    .attr("y", 232.75)
                    .text("50-75% most commonly used words in articles")
                    .style("font-size", "4px")
                    .style("fill", "rgb(0, 0, 0)")
                    .attr("alignment-baseline", "middle");
                    svg.append("text") 
                    .attr("x", 77)
                    .attr("y", 242.75)
                    .text("Top 25% most commonly used words in articles")
                    .style("font-size", "4px")
                    .style("fill", "rgb(0, 0, 0)")
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


    svg.call(brush);

    // Highlight points when brushed
    function brush(g) {
      const brush = d3.brush() // Create a 2D interactive brush
        .on('start brush', highlight) // When the brush starts/continues do...
        .on('end', brushEnd) // When the brush ends do...
        .extent([
          [0,0],
          [208,208]
        ]);
        
      ourBrush = brush;

      g.call(brush); // Adds the brush to this element

      // Highlight the selected circles
      function highlight(event, d) {
        if (event.selection === null) return;
        const [
          [x0, y0],
          [x1, y1]
        ] = event.selection;
        let circles = svg.selectAll('circle')
        circles.classed("selected", function(d){ 
          return (x0 <= d.x + d.r && d.x - d.r <= x1 && y0 <= d.y + 8 + d.r && d.y + 8 - d.r <= y1)
        })

        // Get the name of our dispatcher's event
        let dispatchString = Object.getOwnPropertyNames(dispatcher._)[0];
      
        // Let other charts know about our selection
        dispatcher.call(dispatchString, this, svg.selectAll('.selected').data());
      }
      
      function brushEnd(event, d){
        // We don't want infinite recursion
        if(event.sourceEvent !== undefined && event.sourceEvent.type!='end'){
          d3.select(this).call(brush.move, null);
        }
      }
    }        
            return chart;
    }

    // Gets or sets the dispatcher we use for selection events
  chart.selectionDispatcher = function (_) {
    if (!arguments.length) return dispatcher;
    dispatcher = _;
    return chart;
  };

  // Given selected data from another visualization 
  // select the relevant elements here (linking)
  chart.updateSelection = function (selectedData) {
    console.log(selectedData)
    let selectedWords = [] // keep track of words in a string array
    for (let i =0; i < selectedData.length; i++) {
      selectedWords.push(selectedData[i].Word)
    }
    if (!arguments.length) return;
    let circles = svg.selectAll('circle')
    circles.classed("selected", function(d){ // if bubble is selected, color it
      return selectedWords.includes(d.data.Word)
    })
  };


    return chart;
}