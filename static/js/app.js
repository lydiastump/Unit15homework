function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    var metadataurl = "/metadata/<sample>";
    d3.json(metadataurl).then(response) => {

   console.log(response)
  // Use d3 to select the panel with id of `#sample-metadata`
    var panel =  d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(response).forEach(([key, value]) => {
      panel.appen("h6").text(`${key}: ${value}`);
    })
  })

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then((response) => {
    console.log(response)
    var otu_ids = response.otu_ids;
    var otu_labels = response.otu_labels;
    var sample_values = response.sample_values;
  })

    // @TODO: Build a Bubble Chart using the sample data

    var bubbleData = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: "Earth"
      }
    }];

    var bubbleLayout = {
      margin: { t: 0},
      hovermode: "closest",
      xaxis: {title: "OTU ID"}
    };

Plotly.plot("bubble", bubbleData, bubbleLayout);

    // @TODO: Build a Pie Chart
    var piedata = [{
      values: sample_values.slice(0, 10),
      labels: otu_ids.slice(0, 10)
      hovertext: otu_labels.slice(0, 10),
      hoverinfo: "hovertext",
      type: "pie"
    }];

    var pielayout = {
      margin: {t: 0, 1:0}
    }
    Plotly.plot("pie", piedata, pielayout)
  })
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
