queue()

    .defer(d3.csv,"data/petrol.csv")
    .await(makeGraphs);

// Function to Make Graphs

function makeGraphs(error, petrolData) {

    // Define Variables
    var ndx = crossfilter(petrolData);

    var parseDate = d3.time.format("%d/%m/%Y").parse;
        petrolData.forEach(function (d) {
            d.date = parseDate(d.date);
            
        });
    
    // Show Graphs
    
    show_spend_by_company(ndx);
    show_spend_by_month(ndx);
    show_spend_by_litres(ndx);
    show_spend_by_miles(ndx);
    
    dc.renderAll();

}

// Show Spend By Company
function show_spend_by_company(ndx) {

    var dim = ndx.dimension(dc.pluck('company'));
    var total_spend_by_company = dim.group().reduceSum(dc.pluck('spend'));

    dc.barChart("#spend-by-company")
        .width(650)
        .height(250)
        .margins({top: 10, right: 50, bottom: 30, left: 50})
        .dimension(dim)
        .group(total_spend_by_company)
        .yAxisLabel("Spend")
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Company")
        .yAxis().ticks(20);

}

// Show Spend By Month
function show_spend_by_month(ndx) {

    // Define Variables
    
    var date_dim = ndx.dimension(dc.pluck('date'));
    var total_spend_by_month = date_dim.group().reduceSum(dc.pluck('spend'));
    var minDate = date_dim.bottom(1)[0].date;
    var maxDate = date_dim.top(1)[0].date;
        
    // Create Bar Chart
        
    dc.barChart("#spend-by-month")
            .width(1000)
            .height(300)
            .margins({top: 10, right: 50, bottom: 30, left: 50})
            .dimension(date_dim)
            .group(total_spend_by_month)
            .yAxisLabel("Spend")
            .transitionDuration(500)
            .x(d3.time.scale().domain([minDate, maxDate]))
            .xAxisLabel("Month")
            .yAxis().ticks(4);

}

// Show Spend by Litres
function show_spend_by_litres(ndx) {
    
    // Define Variables
    
    // Variable - Colors for Company
    var companyColors = d3.scale.ordinal()
        .domain(["BP", "Sainsburys", "Esso", "Applegreen", "Shell"])
        .range(["red", "green", "blue", "orange", "pink"]);
    
    
    // Variables for Maximum and Minimum Litres and Spend
    var litres_dim = ndx.dimension(dc.pluck('litres'));
    var min_litres = litres_dim.bottom(1)[0].litres;
    var max_litres = litres_dim.top(1)[0].litres;
    
    var spend_dim = ndx.dimension(function (d) {
            return [d.litres, d.spend, d.company];
        });
     
    var spend_group = spend_dim.group().reduceSum(dc.pluck('spend'));
    
    // Draw Scatter Plot
    dc.scatterPlot("#spend-by-litres")
        .width(800)
        .height(400)
        .x(d3.scale.linear().domain([min_litres, max_litres]))
        .brushOn(false)
        .symbolSize(8)
        .clipPadding(10)
        .xAxisLabel("Litres")
        .title(function(d) {
            return d.key[2] + " spent " + d.key[1];
        })
        .colorAccessor(function (d) {
            return d.key[2];
        })
        .colors(companyColors)
        .dimension(litres_dim)
        .group(spend_group)
        .margins({top: 10, right: 50, bottom: 75, left: 75});
    
}

// Show Spend by Miles
function show_spend_by_miles(ndx) {
    
    // Define Variables
    
    // Variable - Colors for Company
    var companyColors = d3.scale.ordinal()
        .domain(["BP", "Sainsburys", "Esso", "Applegreen", "Shell"])
        .range(["red", "green", "blue", "orange", "pink"]);
    
    // Variables - Maximum and Minimum Miles, Spend 
    var miles_dim = ndx.dimension(dc.pluck('miles'));
    var min_miles = miles_dim.bottom(1)[0].miles;
    var max_miles = miles_dim.top(1)[0].miles;
    var spend_dim = ndx.dimension(function (d) {
            return [d.miles, d.spend, d.company];
        });
     
    var spend_group = spend_dim.group().reduceSum(dc.pluck('spend'));
    
    // Draw Scatter Plot
    dc.scatterPlot("#spend-by-miles")
        .width(800)
        .height(400)
        .x(d3.scale.linear().domain([min_miles, max_miles]))
        .brushOn(false)
        .symbolSize(8)
        .clipPadding(10)
        .xAxisLabel("Miles")
        .title(function(d) {
            return d.key[2] + " spent " + d.key[1];
        })
        .colorAccessor(function (d) {
            return d.key[2];
        })
        .colors(companyColors)
        .dimension(miles_dim)
        .group(spend_group)
        .margins({top: 10, right: 50, bottom: 75, left: 75});
    
}
