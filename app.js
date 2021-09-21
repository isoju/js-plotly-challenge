//making init function first for default page
function init(){


    d3.json("data/samples.json").then((x => {
        //setting dropdown option variable
        let dropdown = d3.select("#selDataset");

        x.names.forEach((sample => {
            let option = dropdown.append("option");
            option.text(sample);
        }))

        let initialid = dropdown.property("value")
        // console.log(initialid)
        plots(initialid);
    }))
}

// setting variables to call later
let demoinfo = d3.select("#sample-metadata");
let barchart = d3.select("#bar");
let bubblechart = d3.select("#bubble")

//making the big function
function plots(id){
    //reading data
    d3.json("data/samples.json").then((data => {

        //making demographic info
        let idmeta = data.metadata.filter(test => test.id == id)[0];

        Object.entries(idmeta).forEach(([key, value]) => {

            let testlist = demoinfo.append("ul");
            testlist.attr("class", "list-group")

            let tlitem = testlist.append("li");

            tlitem.attr("class", "list-group-item")

            tlitem.text(`${key}: ${value}`);
            //console.log(tlitem)
            // console.log(testlist)
        })
        console.log(idmeta)

        // setting up data for graphs/plots
        let otu_ids = []
        let sample_values = []
        let otu_labels = [] 

        let chosenid = data.samples.filter(sample => sample.id == id)[0];

        Object.entries(chosenid).forEach(([key, value]) => {
            // trying switch case, using push because append didn't work
            switch (key){
                case "otu_ids":
                    otu_ids.push(value)
                    break
                case "sample_values":
                    sample_values.push(value)
                    break
                case "otu_labels":
                    otu_labels.push(value);
                    break
                default:
                    // console.log("test")
                    break;
            }
        })
        // console.log(otu_ids)
        // console.log(sample_values)
        // console.log(otu_labels)


        //setting up data for horizontal bar plot
        let filteredids = otu_ids[0].slice(0,10).reverse();
        let filteredidsedit = filteredids.map(otuid => "OTU " + otuid)
        let filteredlabels = otu_labels[0].slice(0,10).reverse();
        let filteredvalues = sample_values[0].slice(0,10).reverse();
        // console.log(filteredids)
        // console.log(filteredidsedit)
        // console.log(filteredlabels)
        // console.log(filteredvalues)


        let trace1 = {
            x: filteredvalues,
            y: filteredidsedit,
            text: filteredlabels,
            type: 'bar',
            orientation: 'h'
        }

        let data1 = [trace1];

        Plotly.newPlot("bar", data1)


        // making bubble chart
        let trace2 = {
            x: otu_ids[0],
            y: sample_values[0],
            text: otu_labels[0],
            mode: 'markers',
            marker: {
                size: sample_values[0],
                color: otu_ids[0],
                colorscale: 'Picnic'
            }
        }

        let data2 = [trace2]

        Plotly.newPlot('bubble', data2)
    }))
}

// to agree with html formatting
function optionChanged(id){
    
    demoinfo.html("")
    barchart.html("")
    bubblechart.html("")

    plots(id)
}

init();


