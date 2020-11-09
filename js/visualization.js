// Immediately Invoked Function Expression to limit access to our 
// variables and prevent 
((() => {
  
  d3.csv('data/count_by_articles.csv').then((data) => {
    let bubbleChart = graphBubble()('.vis-holder', data);
  });

})());