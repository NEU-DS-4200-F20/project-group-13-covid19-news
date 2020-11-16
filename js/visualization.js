// Immediately Invoked Function Expression to limit access to our 
// variables and prevent 
((() => {
  // get the csv data
  d3.csv('data/count_by_articles.csv').then((data) => {
    let bubbleChart = graphBubble()('#bubblechart', data); // draw the bubble chart
  });

  d3.csv('data/word_by_percent.csv').then((data) => {
    let lineChart = linechart()
      .x(d => d.Month)
      .y(d => d.Count)
      .yLabelOffset(40)
      // .selectionDispatcher(d3.dispatch(dispatchString))
      ('#linechart', data);
  });

})());