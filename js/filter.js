function filterNews() {
    const categories = ['rock', 'hiphop', 'rap'];
    const selectedCategories = categories.filter(cat => document.getElementById(cat).checked);
    
    const newsArticles = document.querySelectorAll('.news-article');
    newsArticles.forEach(article => {
        if (selectedCategories.length === 0 || selectedCategories.includes(article.getAttribute('data-category'))) {
            article.style.display = 'flex';
        } else {
            article.style.display = 'none';
        }
    });
    
    // Save filter settings to local storage
    categories.forEach(cat => {
        localStorage.setItem(cat, document.getElementById(cat).checked);
    });
}

const categories = ['rock', 'hiphop', 'rap'];
categories.forEach(cat => {
    const checked = localStorage.getItem(cat) === 'true';
    document.getElementById(cat).checked = checked;
});
filterNews(); // Apply filters on load
