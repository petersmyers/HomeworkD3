// First things first. WE need to set the margins of our SVG area.
    // **********************************************
    // ~~~~~~~~~~~~Responsive Graph~]~~~~~~~~~~~~~~~~
    // **********************************************
function responsive() {
    // Here, we are defining our SVG area in a theoretical way as no SVG actually exists yet
    // #scatter is defined in the HTML under the body PromiseRejectionEvent.
    var svgarea = d3.select("#scatter").select("svg");
    // If an SVG is already there by some act of god, we get rid of it
    if (!svgarea.empty()) {
      svgarea.remove();
    }
    // Use the handy "window" function(command?) to grab the width of the actual window and the length of it
    var svgwidth = window.innerWidth;
    var svgheight = window.innerHeight;
    // And now let's decide how large of a space we want around the SVG. No need to make it crowded
    var margin = {
      top: 50,
      bottom: 50,
      right: 50,
      left: 50
    };
    // Now define the actual bounds of the graph (NOT the svg)
    var height = svgheight - margin.top - margin.bottom;
    var width = svgwidth - margin.left - margin.right;
    // And create that SVG we've been talking about in theory up until now
    var svg = d3.select("#scatter")
      .append("svg")
      .attr("height", svgheight)
      .attr("width", svgwidth);
    // And now we make an SVG group which will help us affect the whole graph... or something
    var chartGroup = svg.append("g")
    // says "put the upper corner of the graph here"
      .attr("transform", `translate(${margin.left}, ${margin.top})`);
    
    // **********************************************
    // ~~~~~~~~~~~~~~~~Snag Data~~~~~~~~~~~~~~~~~~~~~
    // **********************************************
    // Using D3 to get the data into this lil function and we're gonna save it
    // Here are the various data categories one can take a look into for funs
    // id,
    // state,
    // abbr,
    // poverty,
    // povertyMoe,
    // age,
    // ageMoe,
    // income,
    // incomeMoe,
    // healthcare,
    // healthcareLow,
    // healthcareHigh,
    // obesity,
    // obesityLow,
    // obesityHigh,
    // smokes,
    // smokesLow,
    // smokesHigh

    d3.csv("assets/data/data.csv").then(function(journal) {
        // Get the data into useful forms
        journal.forEach(function(jour) {
            jour.poverty = +jour.poverty;
            jour.povertyMoe = +jour.povertyMoe;
            jour.age = +jour.age;
            jour.income = +jour.income;
            jour.incomeMoe = +jour.incomeMoe;
            jour.healthcare = +jour.healthcare;
            jour.healthcareLow = +jour.healthcareLow;
            jour.healthcareHigh = +jour.healthcareHigh;
            jour.obesity = +jour.obesity;
            jour.obesityLow = +jour.obesityLow;
            jour.obesityHigh = +jour.obesityHigh;
            jour.smokes = +jour.smokes;
            jour.smokesLow = +jour.smokesLow;
            jour.smokesHigh = +jour.smokesHigh;
            // console.log(jour.abbr);
        });
    // **********************************************
    // ~~~~~~~~~~~~~~Make Data axes~~~~~~~~~~~~~~~~~
    // **********************************************
    // Let's first look at overty vs. healthcare
    var xscale = d3.scaleLinear()
    .domain(d3.extent(journal, j => j.poverty))
    .range([0, width]);

    var yscale = d3.scaleLinear()
    .domain(d3.extent(journal, j => j.healthcare))
    .range([0, height]); 
    
    // Convert scales to axes
    var xaxis = d3.axisBottom(xscale).ticks(7);
    var yaxis = d3.axisLeft(yscale).ticks(10);

    // Add the axes to our chart group
    chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(xaxis);
    chartGroup.append("g")
    .call(yaxis);

    // **********************************************
    // ~~~~~~~~~~~~~~Make Some Circles~~~~~~~~~~~~~~~~
    // **********************************************
   
    var circlesGroup = chartGroup.selectAll("circle")
    .data(journal)
    .enter()
    .append("circle")
    .attr("cx", j => xscale(j.poverty))
    .attr("cy", j => yscale(j.healthcare))
    .attr("r", "20")
    .attr("fill", "lightsteelblue")
    // .append("text").text(function(j){return j.abbr})
    .attr("stroke", "black");
    
    var textGroup = chartGroup.selectAll("text")
    .data(journal)
    .enter()
    .append("text")
    .text(j => j.id)
    .attr("x", j => xscale(j.poverty)-10)
    .attr("y", j => yscale(j.healthcare)+5)
    .attr("font-size", 20);
    console.log(textGroup)

});
    
};
responsive();
d3.select(window).on("resize", responsive);
