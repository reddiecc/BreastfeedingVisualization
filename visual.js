document.addEventListener('DOMContentLoaded', function () {
    const jsonUrl = 'https://raw.githubusercontent.com/reddiecc/Breastfeeding/main/data.json';

    fetch(jsonUrl)
        .then(response => response.json())
        .then(data => {
            renderChart(data);
        })
        .catch(error => console.error('Error fetching JSON:', error));
});

function renderChart(data) {
    // Prepare the data
    // Prepare the data
    const yearData = Array.from(d3.rollup(data, v => v.length, d => d.paper.year).entries())
        .sort((a, b) => d3.descending(a[0], b[0])); // Sort years in descending order
    const journalData = d3.rollup(data, v => v.map(d => d.paper.Journal), d => d.paper.year);

    // Set dimensions and margins of the graph
    const margin = { top: 30, right: 30, bottom: 70, left: 60 },
        barPadding = 0.2,
        barWidth = 30, // Adjust as needed
        width = yearData.length * barWidth / (1 - barPadding),
        height = 300 - margin.top - margin.bottom;

    // Append the svg object to the body of the page
    const svg = d3.select("#bar-chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
    // X axis
    const x = d3.scaleBand()
        .range([0, width])
        .domain(yearData.map(d => d[0])) // Use sorted years
        .padding(barPadding);

    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

    // Add Y axis
    const y = d3.scaleLinear()
        .domain([0, d3.max(yearData, d => d[1])])
        .range([height, 0]);

    svg.append("g")
        .call(d3.axisLeft(y));

    // Tooltip for bar chart
    const tooltip = d3.select('body').append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0)
        .style('position', 'absolute')
        .style('text-align', 'center')
        .style('padding', '8px')
        .style('font', '12px sans-serif')
        .style('background', 'lightpink')
        .style('border', '0px')
        .style('border-radius', '8px')
        .style('pointer-events', 'none')
        .style('white-space', 'pre-line'); // Preserve line breaks
    // Bars
    svg.selectAll(".bar")
        .data(yearData)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d[0]))
        .attr("y", d => y(d[1]))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d[1]))
        .attr("fill", "lightblue") // Set bar color to blue
        .on('mouseover', function (event, d) {
            tooltip.transition()
                .duration(200)
                .style('opacity', .9);
            const journals = journalData.get(d[0]).map(j => `- ${j}`).join('\n');
            tooltip.html(`${d[0]}<br>${journals}<br>${d[1]} papers`)
                .style('left', (event.pageX + 5) + 'px')
                .style('top', (event.pageY - 28) + 'px');
        })
        .on('mouseout', function (d) {
            tooltip.transition()
                .duration(500)
                .style('opacity', 0);
        });

    // Center the bar chart in the container
    const svgContainer = d3.select("#bar-chart").node().getBoundingClientRect();
    const translateX = Math.max(0, (svgContainer.width - width - margin.left - margin.right) / 2);
    svg.attr('transform', `translate(${translateX + margin.left}, ${margin.top})`);
    // Add title to the chart
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("text-decoration", "underline")
        .text("Journal Publication Over the Years");
}
