(function($) {
    $(document).ready(function() {
        loadMenu();
    })
})(jQuery);

function onScroll() {
    /* Handle header on scroll - Start */
    const header = document.querySelector('#header')
    const content = document.querySelector('#content')
    const footer = document.querySelector('#footer')
    const headerHeight = header.offsetHeight;

    const totalHeight = header.offsetHeight + content.offsetHeight + footer.offsetHeight;

    if (window.innerHeight < totalHeight && window.scrollY > headerHeight) {
        header.classList.add('header--onscroll');
        content.classList.add('content--onscroll');
    } else {
        header.classList.remove('header--onscroll');
        content.classList.remove('content--onscroll');
    }
    /* Handle header on scroll - End */
    
    /* Handle floating button on scroll - Start */
    const floatButton = document.getElementById('float_button');

    // Adjust float button bottom position
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        floatButton.style.bottom = (footer.offsetHeight + 10) + "px";
    } else {
        floatButton.style.bottom = null;
    }
    /* Handle floating button on scroll - End */
}