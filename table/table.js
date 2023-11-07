document.addEventListener('DOMContentLoaded', function () {
    const jsonUrl = 'https://raw.githubusercontent.com/reddiecc/Breastfeeding/main/data.json';

    fetch(jsonUrl)
        .then(response => response.json())
        .then(data => {
            renderTable(data);
        })
        .catch(error => console.error('Error fetching JSON:', error));
});

function renderTable(papers) {
    const tableBody = document.getElementById('papers-table-body');
    papers.forEach(paper => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${paper.paper.title}</td>
            <td>${paper.paper.authors.join(', ')}</td>
            <td>${extractKeywords(paper.paper.abstract).join(', ')}</td>
            <td>${paper.paper.year}</td>
            <td>${paper.paper.Journal}</td>
            <td><span class="abstract-preview">${paper.paper.abstract.substring(0, 100)}...</span> <a href="#" onclick="toggleAbstract(this)">Read More</a><span class="abstract-full" style="display:none;">${paper.paper.abstract}</span></td>  
        `;
        tableBody.appendChild(row);
    });
}

function toggleAbstract(element) {
    const fullAbstract = element.previousElementSibling;
    const previewAbstract = element.previousElementSibling.previousElementSibling;

    if (fullAbstract.style.display === 'none') {
        fullAbstract.style.display = 'inline';
        previewAbstract.style.display = 'none';
        element.textContent = 'Read Less';
    } else {
        fullAbstract.style.display = 'none';
        previewAbstract.style.display = 'inline';
        element.textContent = 'Read More';
    }
}

function extractKeywords(abstract) {
    const stopWords = new Set(['and', 'the', 'is', 'of', 'in', 'to', 'that', 'it', 'with', 'as', 'for', 'on', 'was', 'at', 'by', 'an', 'this', 'are', 'or', 'from', 'but', 'not', 'be', 'which', 'you', 'one', 'we', 'all', 'she', 'up', 'out', 'her', 'there', 'would', 'their', 'what', 'so', 'can', 'will', 'if', 'has', 'about', 'my', 'they', 'more', 'when', 'had', 'have', 'your', 'some', 'also', 'after', 'no', 'other', 'been', 'than', 'most', 'its', 'into', 'such', 'only', 'new', 'these', 'may', 'many', 'then', 'them', 'did', 'use', 'like', 'used', 'each', 'which', 'how', 'said', 'now', 'could', 'made', 'over', 'our', 'where', 'under', 'more', 'here', 'much', 'before', 'those', 'through', 'same', 'go', 'just', 'very', 'should', 'because', 'much', 'too', 'us']);

    let words = abstract
        .toLowerCase()
        .replace(/[^\w\s]/g, '') // Remove punctuation
        .split(/\s+/) // Split by spaces
        .filter(word => !stopWords.has(word) && word.length > 2); // Remove stop words and short words

    let frequency = {};
    words.forEach(word => {
        frequency[word] = (frequency[word] || 0) + 1;
    });

    //let sortedWords = Object.keys(frequency)
        .sort((a, b) => frequency[b] - frequency[a])
        .slice(0, 5); // Get top 5 words

    //return sortedWords;
}
