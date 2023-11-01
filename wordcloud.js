document.addEventListener('DOMContentLoaded', function () {
    const jsonUrl = 'https://raw.githubusercontent.com/reddiecc/Breastfeeding/main/data.json';

    fetch(jsonUrl)
        .then(response => response.json())
        .then(data => {
            const papers = data.map(d => d.paper);
            let text = '';
            papers.forEach(paper => {
                text += `${paper.title} ${paper.abstract} `;
            });

            generateWordCloud(text);
        })
        .catch(error => console.error('Error fetching data:', error));
});

function generateWordCloud(text) {
    const words = text.split(/\s+/).filter(word => word.length > 3).map(word => word.toLowerCase());
    const wordCount = {};
    words.forEach(word => {
        wordCount[word] = (wordCount[word] || 0) + 1;
    });
    const wordEntries = Object.entries(wordCount).map(([text, size]) => ({ text, size }));

    const layout = d3.layout.cloud()
        .size([800, 500])
        .words(wordEntries)
        .padding(1)
        .rotate(() => (~~(Math.random() * 6) - 3) * 30)
        .fontSize(d => Math.sqrt(d.size) * 10)
        .on("end", draw);

    layout.start();

    function draw(words) {
        d3.select("#wordCloud").append("svg")
            .attr("width", layout.size()[0])
            .attr("height", layout.size()[1])
            .append("g")
            .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
            .selectAll("text")
            .data(words)
            .enter().append("text")
            .style("font-size", d => d.size + "px")
            .style("fill", "#34495e")
            .attr("text-anchor", "middle")
            .attr("transform", d => "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")")
            .text(d => d.text)
            .attr("class", "word");
    }
}
