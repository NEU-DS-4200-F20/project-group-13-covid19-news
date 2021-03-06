/* global D3 */

// Initialize a line chart. Modeled after Mike Bostock's
// Reusable Chart framework https://bost.ocks.org/mike/chart/
const slices = []; // structure data/group words by month
function linechart() {

    // Based on Mike Bostock's margin convention
    // https://bl.ocks.org/mbostock/3019563
    let margin = {
            top: 90,
            left: 200,
            right: 30,
            bottom: 150
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
        dispatcher;

    // Create the chart by adding an svg to the div with the id 
    // specified by the selector using the given data
    function chart(selector, data) {
        const color = d3.scaleOrdinal(d3.schemeCategory10);

        data.forEach((word) => { // source: https://datawanderings.com/2019/10/28/tutorial-making-a-line-chart-in-d3-js-v-5/
            let wordObject = slices.find(el => el.id === word.Word);
            let total = 0;
            if (!wordObject) { // first time we see word
                wordObject = { // create an object with the id of the word and values for each month
                    id: word.Word,
                    values: [{
                        month: +word.Month,
                        percent: +word.Percent,
                        count: +word.Count
                    }]
                }
                slices.push(wordObject);

                total = +word.Count; // calculate a grand total for the words

            } else { // push percent to values (source: https://stackoverflow.com/questions/35206125/javascript-es6-es5-find-in-array-and-change)
                slices[slices.findIndex(el => el.id === word.Word)].values.push({
                    month: +word.Month,
                    percent: +word.Percent,
                    count: +word.Count
                });
                total += wordObject.values.map(item => item.count).reduce((prev, next) => prev + next);
            }
            wordObject.total = total; // add grand total of counts
        });

        // create the svg
        let svg = d3.select(selector)
            .append('svg')
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .attr('viewBox', [100, 20, 500, 380].join(' '))
            .classed('svg-content', true);

        svg = svg.append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        // to create the tooltip
        let div = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

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

        // array of months which we will use to format the x axis ticks
        let months = ['January', 'February', 'March', 'April'];

        // X axis
        let xAxis = svg.append('g')
            .attr('transform', 'translate(0,' + (height) + ')')
            .call(d3.axisBottom(xScale).tickFormat(function(d, i) {
                return months[i]
            })); // format the ticks. source: https://stackoverflow.com/questions/29385146/changing-ticks-values-to-text-using-d3

        // Put X axis tick labels at an angle
        xAxis.selectAll('text')
            .style('text-anchor', 'end')
            .attr('dx', '-.8em')
            .attr('dy', '.15em')
            .attr('transform', 'rotate(-65)');

        // Y axis
        let yAxis = svg.append('g')
            .call(d3.axisLeft(yScale))
            .append('text')
            .attr('class', 'axisLabel')
            .attr('transform', 'translate(' + 0 + ', 0)')

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
            .attr("id", function(d) {
                return d.id;
            }) // give each line a unique id
            .attr('class', 'line')
            .attr("d", function(d) {
                return line(d.values);
            })
            .style("stroke", function(d, i) { // color the lines based on word usage
                return color(i);
            }).on("mouseover", function(event, d) { // tooltip with word displayed - https://bl.ocks.org/d3noob/180287b6623496dbb5ac4b048813af52
                div.transition()
                    .duration(200)
                    .style("opacity", .9);
                let print = "The word <b>'" + d.id + "'</b> appeared in<br />";
                d.values.forEach((element) => {
                    print += Math.round((element.percent + Number.EPSILON) * 100) / 100 + "% of articles in " + months[element.month - 1] + "<br />";
                })
                div.html(print)
                    .style("left", (event.pageX) + "px")
                    .style("top", (event.pageY - 28) + "px");
                lines.selectAll("path").style("opacity", 0.1);
                d3.select(this).style("opacity", 1); // To reduce opacity of other lines - https://stackoverflow.com/questions/28376166/clear-opacity-in-d3-after-click
            })
            .on("mouseout", function(d) {
                div.transition()
                    .duration(500)
                    .style("opacity", 0);
                lines.selectAll("path").style("opacity", 1);
            });

        selectableElements = d3.selectAll('path');

        // this appends a title for the graph. Source: http://www.d3noob.org/2013/01/adding-title-to-your-d3js-graph.html
        svg.append("text")
            .attr("x", 195)
            .attr("y", -34)
            .attr("text-anchor", "middle")
            .style("font-size", "10px")
            .style("text-decoration", "underline")
            .attr('margin-bottom', 200)
            .text("Usage of Keywords in COVID-related Articles (January - April 2020)");

        // append axis labels
        svg.append("text")
            .attr("x", 1)
            .attr("y", -13)
            .attr("text-anchor", "middle")
            .style("font-weight", "bold")
            .style("font-size", "8px")
            .attr('margin-bottom', 200)
            .text("Percent of Total Articles");

        svg.append("text") // this appends the label for the month
            .attr("x", 380)
            .attr("y", 380)
            .attr("text-anchor", "middle")
            .style("font-size", "8px")
            .style("font-weight", "bold")
            .text("Month");


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

    chart.margin = function(_) {
        if (!arguments.length) return margin;
        margin = _;
        return chart;
    };

    chart.width = function(_) {
        if (!arguments.length) return width;
        width = _;
        return chart;
    };

    chart.height = function(_) {
        if (!arguments.length) return height;
        height = _;
        return chart;
    };

    chart.x = function(_) {
        if (!arguments.length) return xValue;
        xValue = _;
        return chart;
    };

    chart.y = function(_) {
        if (!arguments.length) return yValue;
        yValue = _;
        return chart;
    };

    chart.xLabel = function(_) {
        if (!arguments.length) return xLabelText;
        xLabelText = _;
        return chart;
    };

    chart.yLabel = function(_) {
        if (!arguments.length) return yLabelText;
        yLabelText = _;
        return chart;
    };

    chart.yLabelOffset = function(_) {
        if (!arguments.length) return yLabelOffsetPx;
        yLabelOffsetPx = _;
        return chart;
    };

    // Gets or sets the dispatcher we use for selection events
    chart.selectionDispatcher = function(_) {
        if (!arguments.length) return dispatcher;
        dispatcher = _;
        return chart;
    };

    // Given selected data from another visualization 
    // select the relevant elements here (linking)
    chart.updateSelection = function(selectedData) {
        if (!arguments.length) return;

        // Select an element if its datum was selected
        let selectedLines = [];
        for (let i = 0; i < selectedData.length; i++) { // first go through and construct an array with all the selected word strings
            let word = selectedData[i].Word || selectedData[i].data.Word;
            selectedLines.push(word);
        }

        let lines = document.getElementsByClassName('line');
        for (let i = 0; i < lines.length; i++) { // go through all the lines and show/hide depending on if the word is selected or not
            if (selectedLines.includes(lines[i].id)) {
                lines[i].style.display = 'block';
            } else {
                lines[i].style.display = 'none';
            }
        }
    };

    return chart;
}