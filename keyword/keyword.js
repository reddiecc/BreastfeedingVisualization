document.addEventListener('DOMContentLoaded', function () {
    const jsonUrl = 'https://raw.githubusercontent.com/reddiecc/Breastfeeding/main/data.json';

    fetch(jsonUrl)
        .then(response => response.json())
        .then(data => {
            const allAbstracts = data.map(paper => paper.paper.abstract).join(' ');
            const keywords = extractKeywords(allAbstracts);
            renderChart(keywords);
        })
        .catch(error => console.error('Error fetching JSON:', error));
});

function extractKeywords(text) {
    // Define a set of common English stop words
    const stopWords = new Set(['and', 'the', 'is', 'of', 'in', 'to', 'that', 'it', 'with', 'as', 'for', 'on', 'was', 'at', 'by', 'an', 'this', 'are', 'or', 'from', 'but', 'not', 'be', 'which', 'you', 'one', 'we', 'all', 'she', 'up', 'out', 'her', 'there', 'would', 'their', 'what', 'so', 'can', 'will', 'if', 'has', 'about', 'my', 'they', 'more', 'when', 'had', 'have', 'your', 'some', 'also', 'after', 'no', 'other', 'been', 'than', 'most', 'its', 'into', 'such', 'only', 'new', 'these', 'may', 'many', 'then', 'them', 'did', 'use', 'like', 'used', 'each', 'how', 'said', 'now', 'could', 'made', 'over', 'our', 'where', 'under', 'more', 'here', 'much', 'before', 'those', 'through', 'same', 'go', 'just', 'very', 'should', 'because', 'much', 'too', 'us']);

    // Tokenize the text, remove stop words and short words, and count word frequencies
    const words = text.toLowerCase().match(/\b(\w+)\b/g);
    words.reduce((acc, word) => {
        if (!stopWords.has(word) && word.length > 2) {
            acc[word] = (acc[word] || 0) + 1;
        }
        return acc;
    }, {})

        // Convert the word frequencies object to an array of { word, count } objects and sort by count descending
        //const sortedKeywords = Object.entries(wordFrequencies)
        .map(([word, count]) => ({ word, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 30);
// Get the top 30 keywords

    //return sortedKeywords;
}

function renderChart(keywords) {
    const ctx = document.getElementById('keywordsChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: keywords.map(keyword => keyword.word),
            datasets: [{
                label: 'Frequency',
                data: keywords.map(keyword => keyword.count),
                backgroundColor: 'rgba(75,192,192,1)',
                borderWidth: 1
            }]
        },
        options:{
            scales:{
            y:{
            beginAtZero: true
            }
            }
        }
        });
    }

