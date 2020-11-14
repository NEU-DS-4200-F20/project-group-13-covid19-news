/* global D3 */

// Initialize a line chart. Modeled after Mike Bostock's
// Reusable Chart framework https://bost.ocks.org/mike/chart/
function linechart() {

    // Based on Mike Bostock's margin convention
    // https://bl.ocks.org/mbostock/3019563
    let margin = {
        top: 90,
        left: 200,
        right: 30,
        bottom: 35
      },
      width = 500 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom,
      xValue = d => d[0],
      yValue = d => d[3],
      xLabelText = '',
      yLabelText = '',
      yLabelOffsetPx = 0,
      xScale = d3.scalePoint(),
      yScale = d3.scaleLinear(),
      ourBrush = null,
      selectableElements = d3.select(null),
      dispatcher;
  
    // Create the chart by adding an svg to the div with the id 
    // specified by the selector using the given data
    function chart(selector, data) { 

      // structure data/group words by month
      const slices = [];
      const timeConv = d3.timeParse("%d-%b-%Y");
      

      data.forEach((word) => { // source: https://datawanderings.com/2019/10/28/tutorial-making-a-line-chart-in-d3-js-v-5/
        const month = new Date();
        month.setMonth(word.Month - 1)
        let wordObject = slices.find(el => el.id === word.Word );
        if (!wordObject) { // first time we see word
          wordObject = {
            id: word.Word,
            values: [{
              month: +word.Month,
              percent: +word.Percent
            }]
          }
          slices.push(wordObject)
        } else { // push percent to values (source: https://stackoverflow.com/questions/35206125/javascript-es6-es5-find-in-array-and-change)
          slices[slices.findIndex(el => el.id === word.Word)].values.push({
            month: +word.Month,
            percent: +word.Percent
          })
        }
      });

      let svg = d3.select(selector)
        .append('svg')
          .attr('preserveAspectRatio', 'xMidYMid meet')
          .attr('viewBox', [150, 0, 500, 500].join(' '))
          .classed('svg-content', true);
  
      svg = svg.append('g')
          .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
  
      //Define scales
      xScale
        .domain(d3.group(data, xValue).keys())
        .rangeRound([0, 350]);
        
      yScale
        .domain([
            0,
            100
        ])
        .rangeRound([height, 0]);
  
      // X axis
      let xAxis = svg.append('g')
          .attr('transform', 'translate(0,' + (height) + ')')
          .call(d3.axisBottom(xScale));
          
      // Put X axis tick labels at an angle
      xAxis.selectAll('text')	
          .style('text-anchor', 'end')
          .attr('dx', '-.8em')
          .attr('dy', '.15em')
          .attr('transform', 'rotate(-65)');
          
      // X axis label
      xAxis.append('text')        
          .attr('class', 'axisLabel')
          .attr('transform', 'translate(' + 0 + ',0)')
          .text(xLabelText);
      
      // Y axis and label
      let yAxis = svg.append('g')
          .call(d3.axisLeft(yScale))
        .append('text')
          .attr('class', 'axisLabel')
          .attr('transform', 'translate(' + 0 + ', 0)')
          .text(yLabelText);
  
      // Add the line
      let line = d3.line()
      .x(function(d) {
          return xScale(d.month);
      })
      .y(function(d) {
          return yScale(d.percent);
      });

      // create the lines
const lines = svg.selectAll("lines")
    .data(slices)
    .enter()
    .append("g");

    lines.append("path")
    .attr("id", function(d) { return d.id }) // give each line a unique id
    .attr('class', 'line')
    .attr("d", function(d) { return line(d.values); });

    lines.append("text")
    .attr("class","serie_label")
    .datum(function(d) {
        return {
            id: d.id,
            value: d.values[d.values.length - 1]}; })
    .attr("transform", function(d) {
            return "translate(" + (xScale(d.value.month) + 10)  
            + "," + (yScale(d.value.percent)) + ")";})
    .attr("x", 5)
    .attr("font-size", '6px')
    .text(function(d) { return d.id; });
      
      return chart;
    }
  
    // The x-accessor from the datum
    function X(d) {
      return xScale(xValue(d));
    }
  
    // The y-accessor from the datum
    function Y(d) {
      return yScale(yValue(d));
    }
  
    chart.margin = function (_) {
      if (!arguments.length) return margin;
      margin = _;
      return chart;
    };
  
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
  
    chart.x = function (_) {
      if (!arguments.length) return xValue;
      xValue = _;
      return chart;
    };
  
    chart.y = function (_) {
      if (!arguments.length) return yValue;
      yValue = _;
      return chart;
    };
  
    chart.xLabel = function (_) {
      if (!arguments.length) return xLabelText;
      xLabelText = _;
      return chart;
    };
  
    chart.yLabel = function (_) {
      if (!arguments.length) return yLabelText;
      yLabelText = _;
      return chart;
    };
  
    chart.yLabelOffset = function (_) {
      if (!arguments.length) return yLabelOffsetPx;
      yLabelOffsetPx = _;
      return chart;
    };
  
    // Gets or sets the dispatcher we use for selection events
    chart.selectionDispatcher = function (_) {
      if (!arguments.length) return dispatcher;
      dispatcher = _;
      return chart;
    };
  
    // Given selected data from another visualization 
    // select the relevant elements here (linking)
    chart.updateSelection = function (selectedData) {
      if (!arguments.length) return;
  
      // Select an element if its datum was selected
      selectableElements.classed('selected', d =>
        selectedData.includes(d)
      );
    };
  
    return chart;
  }