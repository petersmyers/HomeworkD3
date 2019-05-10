// First things first. WE need to set the margins of our SVG area.
//     **********************************************
//     ~~~~~~~~~~~~Responsive Graph~]~~~~~~~~~~~~~~~~
//     **********************************************
// function responsive() {
    // Here, we are defining our SVG area in a theoretical way as no SVG actually exists yet
    // #scatter is defined in the HTML under the body PromiseRejectionEvent.
    var svgarea = d3.select("#scatter").select("svg");
    // If an SVG is already there by some act of god, we get rid of it
    if (!svgarea.empty()) {
        svgarea.remove();
    }
    // Use the handy "window" function(command?) to grab the width of the actual window and the length of it
    // oh wait! Because of bootstrap column shit, we want to get the window height and width and then shrink it down proportionally so that it will actually fit on the screen. sigh.
    var svgwidth = (window.innerWidth)*.75;
    var svgheight = (window.innerHeight)*.75;
    // And now let's decide how large of a space we want around the SVG. No need to make it crowded
    var margin = {
        top: 150,
        bottom: 150,
        right: 150,
        left: 150
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
    
//     // **********************************************
//     // ~~~~~~~~~~~~~~~~Snag Data~~~~~~~~~~~~~~~~~~~~~
//     // **********************************************
//     // Using D3 to get the data into this lil function and we're gonna save it
//     // Here are the various data categories one can take a look into for funs
//     // id,
//     // state,
//     // abbr,
//     // poverty,
//     // povertyMoe,
//     // age,
//     // ageMoe,
//     // income,
//     // incomeMoe,
//     // healthcare,
//     // healthcareLow,
//     // healthcareHigh,
//     // obesity,
//     // obesityLow,
//     // obesityHigh,
//     // smokes,
//     // smokesLow,
//     // smokesHigh

//     d3.csv("assets/data/data.csv").then(function(journal) {
//         // Get the data into useful forms
//         journal.forEach(function(jour) {
//             jour.poverty = +jour.poverty;
//             jour.povertyMoe = +jour.povertyMoe;
//             jour.age = +jour.age;
//             jour.income = +jour.income;
//             jour.incomeMoe = +jour.incomeMoe;
//             jour.healthcare = +jour.healthcare;
//             jour.healthcareLow = +jour.healthcareLow;
//             jour.healthcareHigh = +jour.healthcareHigh;
//             jour.obesity = +jour.obesity;
//             jour.obesityLow = +jour.obesityLow;
//             jour.obesityHigh = +jour.obesityHigh;
//             jour.smokes = +jour.smokes;
//             jour.smokesLow = +jour.smokesLow;
//             jour.smokesHigh = +jour.smokesHigh;
//             // console.log(jour.abbr);
//         });
//     console.log(journal);
//     // **********************************************
//     // ~~~~~~~~~~~~~~Make Data axes~~~~~~~~~~~~~~~~~
//     // **********************************************
//     // Let's first look at overty vs. healthcare
//     var xscale = d3.scaleLinear()
//         .domain(d3.extent(journal, j => j.poverty))
//         .range([0, width]);

//     var yscale = d3.scaleLinear()
//         .domain(d3.extent(journal, j => j.healthcare))
//         .range([height,0]); 
//     // Convert scales to axes
//     var xaxis = d3.axisBottom(xscale).ticks(7);
//     var yaxis = d3.axisLeft(yscale).ticks(10);

//     // Add the axes to our chart group
//     chartGroup.append("g")
//         .attr("transform", `translate(0, ${height})`)
//         .call(xaxis);
//     chartGroup.append("g")
//         .call(yaxis);

//     // **********************************************
//     // ~~~~~~~~~~~~~~Make Some Circles~~~~~~~~~~~~~~~~
//     // **********************************************
//     var circleGroup = chartGroup.selectAll("g")
//         .data(journal)
//         .enter();
//     var add = circleGroup.append("g");

//     add.append("circle")
//         .attr("cx", j => xscale(j.poverty))
//         .attr("cy", j => yscale(j.healthcare))
//         .attr("r", "20")
//         .attr("fill", "lightsteelblue")
//         .attr("stroke", "black");
    
//     add.append("text")
//         .text(j => j.id)
//         .attr("x", j => xscale(j.poverty)-10)
//         .attr("y", j => yscale(j.healthcare)+5)
//         .attr("font-size", 20);

//     // **********************************************
//     // ~~~~~~~~~~~Make Some axis labels~~~~~~~~~~~~~
//     // **********************************************
//     var labelsGroup = chartGroup.append("g")
//     .attr("transform", `translate(${width / 2}, ${height + 20})`);
    
//     var hairLengthLabel = labelsGroup.append("text")
//         .attr("x", 0)
//         .attr("y", 20)
//         // .attr("value", "hair_length") // value to grab for event listener
//         // .classed("active", true)
//         .text("Poverty Rate");

//     chartGroup.append("text")
//         .attr("transform", "rotate(-90)")
//         .attr("y", 0 - margin.left)
//         .attr("x", 0 - (height / 2))
//         .attr("dy", "1em")
//         // .classed("axis-text", true)
//         .text("Healthcare");
    
//     // var albumsLabel = labelsGroup.append("text")
//     //     .attr("x", 0)
//     //     .attr("y", 40)
//     //     // .attr("value", "num_albums") // value to grab for event listener
//     //     // .classed("inactive", true)
//     //     .text("# of Albums Released");    

//     console.log(circleGroup)

// });
    
// };
// responsive();
// d3.select(window).on("resize", responsive);


// **********************************************
// ~~~~~~~~~~~Making a Dynamic Graph~~~~~~~~~~~~
// **********************************************
// XXXXXXXXX Initial setup for the X-axis XXXXXXXXX
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
var chosenXAxis = "poverty";
// Function used for updating x-scale var upon click on axis label
function XScale(journal, chosenXAxis) {
  // start scalin'
  var xscale = d3.scaleLinear()
    .domain([d3.min(journal, j => j[chosenXAxis]), d3.max(journal, j => j[chosenXAxis])])
    .range([0, width]);
  return xscale;
};
// Function to put some good labeling on the x-axis
function XrenderAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
    return xAxis;
};
// Function to update my lil circle groups.
function renderCirclesX(chartGroup, newXScale, chosenXAxis) {
    chartGroup.transition()
      .duration(1000)
      .attr("cx", j => newXScale(j[chosenXAxis]))
      .attr("x", j => newXScale(j[chosenXAxis]));  
    return chartGroup;
};

// YYYYYYYYY Initial setup for the Y-axis YYYYYYYYY
// YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY
var chosenYAxis = "healthcare";
// Function used for updating x-scale var upon click on axis label
function YScale(journal, chosenYAxis) {
  // start scalin'
  var yscale = d3.scaleLinear()
    .domain([d3.min(journal, j => j[chosenYAxis]), d3.max(journal, j => j[chosenYAxis])])
    .range([height, 0]);
  return yscale;
};
// Function to put some good labeling on the x-axis
function YrenderAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
    yAxis.transition()
      .duration(1000)
      .call(leftAxis);
    return yAxis;
};
// Function to update my lil circle groups.
function renderCirclesY(circleGroup, newYScale, chosenYAxis) {
    circleGroup.transition()
      .duration(1000)
      .attr("cy", j => newYScale(j[chosenYAxis]))
      .attr("y", j => newYScale(j[chosenYAxis]));  
    return chartGroup;
};
// // ~~~~~~~~~ Using tooltip to show the data ~~~~~~~~~
// // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// function updateToolTip(chosenXAxis, chosenYAxis, circleGroup) {
//     // Set the labels of the axes
//     if (chosenXAxis === "poverty") {
//         var xlabel = "Poverty:";
//     }
//     else {var xlabel = "Income:";
//     }
//     if (chosenYAxis === "healthcare") {
//         var ylabel = "Healthcare:";
//     }
//     else {var ylabel = "Age:";
//     }
//     // Use the d3 tooltip function to have a little window pop up when you hover over a circle
//     var toolTip = d3.tip()
//         .attr("class", "tooltip")
//         .offset([80, -60])
//         .html(function(j) {
//             // return ("hi");
//         return (`${xlabel} ${j[chosenXAxis]}<br>${ylabel} ${j[chosenYAxis]}`);
//     });
//     // Make the circle group responsive... errr... use the tooltip on them. or something

//     chartGroup.call(toolTip);
//     // When the mouse is over the circle, make the circle do something
//     chartGroup.on("mouseover", function(j) {
//         toolTip.show(j, this);
//     })
//     // When the mouse isn't there, then hide the information
//         .on("mouseout", function(j, index) {
//             toolTip.hide(j);
//     });  
//     return circleGroup;
// };



// GET THAT DATA INTO THIS DAMN PROGRAM
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
    });
    chartGroup.data(journal);
    // These axes are based on the functions defined above.
    var xscale = XScale(journal, chosenXAxis);
    var yscale = YScale(journal, chosenYAxis);

    // Convert scales to axes
    var bottoma = d3.axisBottom(xscale);
    var lefta = d3.axisLeft(yscale);

    // Add the axes to our chart group
    var xaxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottoma);

    var yaxis = chartGroup.append("g")
        .classed("y-axis", true)
        .call(lefta);

    var circleGroup = chartGroup.selectAll("circle")
        .data(journal)
        .enter();
    
    // Adding the initial circles to the graph
    circleGroup.append("circle")
        .attr("cx", j => xscale(j[chosenXAxis]))
        .attr("cy", j => yscale(j[chosenYAxis]))
        .attr("r", "15")
        .attr("fill", "lightsteelblue")
        .attr("stroke", "black")
        .attr("opacity", .7);
    // Then adding in the text
    circleGroup.append("text")
        .text(j => j.abbr)
        .attr("x", j => xscale(j[chosenXAxis])-7.5)
        .attr("y", j => yscale(j[chosenYAxis])+2.5)
        .attr("font-size", 10);
    // console.log(circleGroup);

    // var add = circleGroup.append("g");
    // add.append("circle")
    //     .attr("cx", j => xscale(j[chosenXAxis]))
    //     .attr("cy", j => yscale(j[chosenYAxis]))
    //     .attr("r", "20")
    //     .attr("fill", "lightsteelblue")
    //     .attr("stroke", "black")
    //     .attr("opacity", .7);
    // add.append("text")
    //     .text(j => j.id)
    //     .attr("x", j => xscale(j[chosenXAxis])-10)
    //     .attr("y", j => yscale(j[chosenYAxis])+5)
    //     .attr("font-size", 20);
    // console.log(circleGroup);


    // Create group for the multiple axes that we're trying to get working
    var xlabelGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);
    var povertyLabel = xlabelGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty") // value to grab for event listener
        .classed("active", true)
        .text("Poverty Rate");
    var incomeLabel = xlabelGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "income") // value to grab for event listener
        .classed("inactive", true)
        .text("Annual Income ($$$)");
  
    var ylabelGroup = chartGroup.append("g");
    var healthcareLabel = ylabelGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left+80)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("value", "healthcare") // value to grab for event listener
        .classed("active", true)
        .text("Healthcare Rate");
    var ageLabel = ylabelGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left+50)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("value", "age") // value to grab for event listener
        .classed("inactive", true)
        .text("Age (years)");
  
    // updateToolTip function above csv import
    // var circleGroup = updateToolTip(chosenXAxis, chosenYAxis, circleGroup);
  
    // x axis labels event listener
    xlabelGroup.selectAll("text")
      .on("click", function() {
        // get value of selection
        var value = d3.select(this).attr("value");
        if (value !== chosenXAxis) {
          // replaces chosenXAxis with value
          chosenXAxis = value;
          // functions here found above csv import
          // updates x scale for new data
          xscale = XScale(journal, chosenXAxis);
          console.log(chartGroup);
          // updates x axis with transition
          xaxis = XrenderAxes(xscale, xaxis);

          // updates circles with new x values
          circleGroup = renderCirclesX(circleGroup, xscale, chosenXAxis);
  
          // updates tooltips with new info
          // circleGroup = updateToolTip(chosenXAxis, chosenYAxis, circleGroup);
  
          // changes classes to change bold text
          if (chosenXAxis === "poverty") {
            povertyLabel
              .classed("active", true)
              .classed("inactive", false);
            incomeLabel
              .classed("active", false)
              .classed("inactive", true);
          }
          else {
            povertyLabel
              .classed("active", false)
              .classed("inactive", true);
            incomeLabel
              .classed("active", true)
              .classed("inactive", false);
          }
        }
      });

    //   Y axis label selection
      ylabelGroup.selectAll("text")
        .on("click", function() {
        // get value of selection
        var value = d3.select(this).attr("value");
        console.log(value);
        if (value !== chosenYAxis) {
          // replaces chosenXAxis with value
          chosenYAxis = value;
          // functions here found above csv import
          // updates x scale for new data
          yscale = YScale(journal, chosenYAxis);
          // updates x axis with transition
          yaxis = YrenderAxes(yscale, yaxis);
          // updates circles with new x values
          circleGroup = renderCirclesY(circleGroup, yscale, chosenYAxis);
          // updates tooltips with new info
          // circleGroup = updateToolTip(chosenXAxis, chosenYAxis, circleGroup);
          if (chosenYAxis === "healthcare") {
            healthcareLabel
              .classed("active", true)
              .classed("inactive", false);
            ageLabel
              .classed("active", false)
              .classed("inactive", true);
          }
          else {
            healthcareLabel
              .classed("active", false)
              .classed("inactive", true);
            ageLabel
              .classed("active", true)
              .classed("inactive", false);
          }
        }
      });  
});