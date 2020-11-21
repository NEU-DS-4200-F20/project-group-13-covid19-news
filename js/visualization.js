// Immediately Invoked Function Expression to limit access to our 
// variables and prevent 
((() => {

  // General event type for selections, used by d3-dispatch
  // https://github.com/d3/d3-dispatch
  const dispatchString = 'selectionUpdated';
  let bubbleChart;
  let lineChart;
  // get the csv data
  d3.csv('data/count_by_articles.csv').then((data) => {
    bubbleChart = graphBubble()
    .selectionDispatcher(d3.dispatch(dispatchString))
    ('#bubblechart', data) // draw the bubble chart

    d3.csv('data/word_by_percent.csv').then((data) => {
      lineChart = linechart() // draw the line chart
        .x(d => d.Month)
        .y(d => d.Count)
        .yLabelOffset(40)
        .selectionDispatcher(d3.dispatch(dispatchString))
        ('#linechart', data);
        
      // when the bubble chart is updated via brushing, tell the lineplot to update its selection
      bubbleChart.selectionDispatcher()
      .on(`${dispatchString}.bc-to-lc`, lineChart.updateSelection)

      d3.csv('data/bias.csv').then((data) => {
        let tblWordByPercent = graphTable()
        .selectionDispatcher(d3.dispatch(dispatchString))
        ('#table', data);

        bubbleChart.selectionDispatcher()
        .on(`${dispatchString}.bc-to-tbl`, tblWordByPercent.updateSelection)

        tblWordByPercent.selectionDispatcher()
        .on(`${dispatchString}.tbl-to-bc`, bubbleChart.updateSelection)

        tblWordByPercent.selectionDispatcher()
        .on(`${dispatchString}.tbl-to-lc`, lineChart.updateSelection)
      })

      
    });


    
  });

  

  


})());