var accordionTitles = document.querySelectorAll(".accordion-title");

accordionTitles.forEach(title => {
    title.addEventListener("click", () => {
        var content = title.nextElementSibling;

        if (content.style.display === "block") {
            content.style.display = "none";
        } else {
            content.style.display = "block";
        }
    });
});