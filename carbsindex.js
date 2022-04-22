var width = 1200, height = 800;
var giIndex = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100];
var gL = [5, 10, 15, 20, 25, 30];

var GLscale = d3.scaleLinear()
        .domain([0, d3.max(gL)])
        .range([0, width - 100]);

var GIscale = d3.scaleLinear()
        .domain([0, d3.max(giIndex)])
        .range([1600 / 2, 0]);

var x_axis = d3.axisBottom()
        .scale(GLscale);

var y_axis = d3.axisLeft()
        .scale(GIscale);

var color = d3.scaleOrdinal(d3.schemeCategory20);
var symbols = d3.scaleOrdinal(d3.symbols);
var symbol = d3.symbol().size(100);  //create symbols


//d3.select("#carbsindex").append('g');
var tooltip = d3.select("#carbsindex").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

d3.csv('food.csv', function (error, data) {
        data.forEach(function (d) {
                d.name = +d.name;
                d.index = +d.index;
                d.load = +d.load;
        });

        GIscale.domain(d3.extent(data, function (d) {
                return d.index;
        })).nice();

        GLscale.domain(d3.extent(data, function (d) {
                return d.load;
        })).nice();

        const svg = d3.select("#carbsindex").append('g');

        svg
                .attr("transform", "translate(50,10)")
                .call(y_axis);

        svg.append('g')
                .attr("transform", "translate(0," + height + ")")
                .call(x_axis);

        svg.append('text')
                .attr('x', 10)
                .attr('y', 10)
                .attr('class', 'label')
                .text('Hyperglycemic index');

        svg.append('text')
                .attr('x', width)
                .attr('y', height - 10)
                .attr('text-anchor', 'end')
                .attr('class', 'label')
                .text('Hyperglycemic Load');

        // we use the ordinal scale symbols to generate symbols
        // such as d3.symbolCross, etc..
        // -> symbol.type(d3.symbolCross)()
        svg.selectAll(".symbol")
                .data(data)
                .enter().append("path")
                .attr("class", "symbol")
                .attr("d", function (d, i) { return symbol.type(symbols(d.type))(); })
                .style("fill", function (d) { return color(d.type); })
                .attr("transform", function (d) {
                        return "translate(" + GLscale(d.load) + "," + GIscale(d.index) + ")";
                });

        var clicked = ""

        var legend = svg.selectAll(".legend")
                .data(color.domain())
                .enter().append("g")
                .attr("class", "legend")
                .attr("transform", function (d, i) { return "translate(0," + i * 20 + ")"; });

        legend.append("path")
                .style("fill", function (d) { return color(d); })
                .attr("d", function (d, i) { return symbol.type(symbols(d))(); })
                .attr("transform", function (d, i) {
                        return "translate(" + (width - 10) + "," + 10 + ")";
                })
                .on("click", function (d) {
                        d3.selectAll(".symbol").style("opacity", 1)

                        if (clicked !== d) {
                                d3.selectAll(".symbol")
                                        .filter(function (e) {
                                                return e.type !== d;
                                        })
                                        .style("opacity", 0.1)
                                clicked = d
                        }
                        else {
                                clicked = ""
                        }
                });

        legend.append("text")
                .attr("x", width - 24)
                .attr("y", 9)
                .attr("dy", ".35em")
                .style("text-anchor", "end")
                .style("color", "black")
                .text(function (d) { return d; });
})