// Initialize a table. Modeled after Mike Bostock's
// Reusable Chart framework https://bost.ocks.org/mike/chart/
function graphTable() {
    let selectableElements; // create placeholder for the selectable elements (aka rows of the table)
    let dispatcher; // create placeholder for the dispatcher
    
    // Create the table by adding an table to the div with the id 
    // specified by the selector using the given data
    function chart(selector, data) {
      let columns = ['Word','Usage by Left-leaning Domains (%)','Usage by Neutral Domains (%)','Usage by Right-leaning Domains (%)','# of Articles Used In']
      let table = d3.select(selector).append('table')
      let thead = table.append('thead')
      let tbody = table.append('tbody');
  
    // append the header row
    thead.append('tr')
        .selectAll('th')
        .data(columns).enter()
        .append('th')
        .text(function (d) { return d; })
        .style('font-size', '10px');

    // to keep track of mouseclick
    let isClicking = false;

		// create a row for each object in the data
		var rows = tbody.selectAll('tr')
		  .data(data)
		  .enter()
      .append('tr')
      .on("mousedown", function(d){ // on mousedown event, highlight row that was clicked
          isClicking = true;

        // remove any previous classes, if there were any (eg. styling from when cells were clicked/hovered before)
        d3.selectAll('tr').classed('highlighted', false)
        d3.selectAll('tr').classed('currently-hovered-gray', false)

        // apply new classes
        d3.select(this).classed('highlighted', true)
        d3.select(this).classed('currently-highlighted', true)

        // let other charts know (only for the clicked element)
        let data = d3.select(this).data();
        let dispatchString = Object.getOwnPropertyNames(dispatcher._)[0];
        dispatcher.call(dispatchString, this, data);
      })
      .on('mouseover', function(e) {
        if (isClicking) { // if click + mousemove, highlight the rows over move
          d3.select(this).classed('highlighted', true)
          // Get the name of our dispatcher's event
          let dispatchString = Object.getOwnPropertyNames(dispatcher._)[0];
          // Let other charts know
          let data = d3.selectAll('.highlighted').data()
          dispatcher.call(dispatchString, this, data);
        }

        // get an array of the current classes applied to the given element. This allows us to see if we 
        // should apply the grayish background hover or the dark pink background hover
        const currentClasses = this.className.split(' ');

        if (currentClasses.includes('highlighted')) { // user is hovering highlighted cell 
          d3.selectAll('tr').classed('currently-highlighted', false) // turn off any other currently highlighted row, if there are any
          d3.select(this).classed('currently-highlighted', true) // highlight this row
        } else {
          d3.select(this).classed('currently-hovered-gray', true) // otherwise, not highlighted cell so change to gray hover
        }
      })
      .on('mouseout', function(d) { // on mouseout, remove any classes applied during hover
        const currentClasses = this.className.split(' '); // get current classes (I know this from previous experience with DOM events)

        if (currentClasses.includes('highlighted')) { // when the row is no longer highlighted, turn off currently-highlighted class
          d3.select(this).classed('currently-highlighted', false)
        }

        else if (!currentClasses.includes('highlighted')) { // if not highlighted, undo gray hover
          d3.select(this).classed('currently-hovered-gray', false)
        } 
      })

      rows
      .on('mouseup', (d) => { // on mouseup, change isClicking to false
        isClicking = false;
      })


		// create a cell in each row for each column
		let cells = rows.selectAll('td')
		  .data(function (row) {
		    return columns.map(function (column) {
		      return {column: column, value: row[column]};
		    });
		  })
		  .enter()
      .append('td')
      .text(function (d) { return d.value; })
      .style('font-size', '10px');
      
      selectableElements = rows;

      return chart;
    }
    
      // Gets or sets the dispatcher we use for selection events (copied from scatterplot.js/linechart.js)
      chart.selectionDispatcher = function (_) {
        if (!arguments.length) return dispatcher;
        dispatcher = _;
        return chart;
      };
    
      // Given selected data from another visualization 
      // select the relevant elements here (linking) (modified from scatterplot.js/linechart.js)
      chart.updateSelection = function (selectedData) {
        if (!arguments.length) return;
        const rows = document.getElementsByTagName("table")[0].rows // get all rows from table

        // remove any styling from previous brushing
        for (let i = 0; i <rows.length; i++) {
          rows[i].classList = []; // remove any applied classes
        }

        // Select an element if its datum was selected
        for (let i = 0; i < selectedData.length; i++) { // first go through and construct an array with all the selected word strings
          let searchWord = selectedData[i].data.Word
          for (let j = 0; j < rows.length; j++) {
            if (rows[j].cells[0].innerText == searchWord) { // if selected
              rows[j].classList.add("highlighted")
            } 
          }
        }
      };
      return chart;
}