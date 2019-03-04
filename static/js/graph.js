queue()

    .defer(d3.csv, "data/petrol-2018.csv")
    .await(makeGraphs);

// Function to Make Graphs

function makeGraphs(error, petrolData) {

    // Define Variable
    var ndx = crossfilter(petrolData);

    

    // Show Graphs
    
    show_spend_by_company(ndx);
    show_spend_by_month(ndx);
    
    
    dc.renderAll();

}

// Show Spend By Company
function show_spend_by_company(ndx) {

    // Define Variables
    
    var dim = ndx.dimension(dc.pluck('company'));
    var total_spend_by_company = dim.group();

    // Create Bar Chart

    dc.barChart("#spend-by-company")
        .width(350)
        .height(250)
        .margins({top: 10, right: 50, bottom: 30, left: 50})
        .dimension(dim)
        .group(total_spend_by_company)
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Company")
        .yAxis().ticks(20);

}

// Show Spend By Month
function show_spend_by_month(ndx) {

    // Define Variables
    
    var date_dim = ndx.dimension(dc.pluck('visit_date'));
    var total_spend_by_month = date_dim.group();
    var minDate = date_dim.bottom(1)[0].visit_date;
    var maxDate = date_dim.top(1)[0].visit_date;
        
    // Create Line Chart
        
    dc.lineChart("#spend-per-month")
            .width(1000)
            .height(300)
            .margins({top: 10, right: 50, bottom: 30, left: 50})
            .dimension(date_dim)
            .group(total_spend_by_month)
            .transitionDuration(500)
            .x(d3.time.scale().domain([minDate, maxDate]))
            .xAxisLabel("Month")
            .yAxis().ticks(4);

}