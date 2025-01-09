document.addEventListener('DOMContentLoaded', function() {
    // Sidebar toggle functionality
    const hamburger = document.querySelector('.hamburger');
    const sidebar = document.querySelector('.sidebar');
    const mainWrapper = document.querySelector('.main-wrapper');
    
    if (hamburger && sidebar && mainWrapper) {
        hamburger.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
            mainWrapper.classList.toggle('expanded');
        });
    }

    // Menu arrow rotation
    const menuLinks = document.querySelectorAll('.menu-link[data-bs-toggle="collapse"]');
    menuLinks.forEach(link => {
        link.addEventListener('click', function() {
            const arrow = this.querySelector('.menu-arrow');
            if (arrow) {
                if (this.getAttribute('aria-expanded') === 'false') {
                    arrow.style.transform = 'rotate(90deg)';
                } else {
                    arrow.style.transform = 'rotate(0deg)';
                }
            }
        });
    });

    // Initialize all dropdowns
    const dropdowns = document.querySelectorAll('.dropdown-toggle');
    dropdowns.forEach(dropdown => {
        new bootstrap.Dropdown(dropdown);
    });

    // Initialize all collapses
    const collapses = document.querySelectorAll('.collapse');
    collapses.forEach(collapse => {
        new bootstrap.Collapse(collapse, {
            toggle: false
        });
    });

    // Set active menu item based on current page
    function setActiveMenuItem() {
        const currentPage = window.location.pathname;
        const menuItems = document.querySelectorAll('.menu-link');
        
        menuItems.forEach(item => {
            if (item.getAttribute('href') === currentPage) {
                item.classList.add('active');
                // If item is in submenu, expand parent
                const submenu = item.closest('.submenu');
                if (submenu) {
                    submenu.classList.add('show');
                    const parentLink = document.querySelector(`[data-bs-target="#${submenu.id}"]`);
                    if (parentLink) {
                        parentLink.setAttribute('aria-expanded', 'true');
                        const arrow = parentLink.querySelector('.menu-arrow');
                        if (arrow) {
                            arrow.style.transform = 'rotate(90deg)';
                        }
                    }
                }
            }
        });
    }

    setActiveMenuItem();
});