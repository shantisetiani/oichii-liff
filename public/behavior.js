(function($) {
    $(document).ready(function() {
        registerWindowScroll();
        loadMenu();
    })
})(jQuery);

function registerWindowScroll() {
    const header = document.querySelector('#header')
    const content = document.querySelector('#content')
    const footer = document.querySelector('#footer')
    const headerHeight = header.offsetHeight;

    // Set #content min height
    content.style.minHeight = (window.innerHeight - footer.offsetHeight) + "px";

    function handleScroll() {
        window.removeEventListener("scroll", handleScroll, true);
        if (window.scrollY > headerHeight) {
            header.classList.add('header--onscroll');
            content.style.marginTop = (headerHeight + 20) + "px";
        } else {
            header.classList.remove('header--onscroll');
            content.style.marginTop = null;
        }
    }
    window.addEventListener('scroll', handleScroll);
}

function onScroll() {
    const floatButton = document.getElementById('float_button');

    // Adjust float button bottom position
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        floatButton.style.bottom = (footer.offsetHeight + 10) + "px";
    } else {
        floatButton.style.bottom = null;
    }
}