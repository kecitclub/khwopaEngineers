document.addEventListener('DOMContentLoaded', function() {
    initializeSidebar();
    initializeResizableSidebar();
    initializeSubmenuBehavior();
    setActiveMenuItem();
});

function initializeSidebar() {
    const hamburger = document.querySelector('.hamburger');
    const sidebar = document.querySelector('.sidebar');
    const mainWrapper = document.querySelector('.main-wrapper');
    
    // Add resize handle to sidebar
    if (!document.querySelector('.sidebar-resize-handle')) {
        const resizeHandle = document.createElement('div');
        resizeHandle.className = 'sidebar-resize-handle';
        sidebar.appendChild(resizeHandle);
    }
    
    if (hamburger && sidebar && mainWrapper) {
        hamburger.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
            mainWrapper.classList.toggle('expanded');
            localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed'));
        });
        
        // Restore sidebar state
        const sidebarCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
        if (sidebarCollapsed) {
            sidebar.classList.add('collapsed');
            mainWrapper.classList.add('expanded');
        }
    }
}

function initializeResizableSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const resizeHandle = document.querySelector('.sidebar-resize-handle');
    const mainWrapper = document.querySelector('.main-wrapper');
    let isResizing = false;

    if (resizeHandle) {
        resizeHandle.addEventListener('mousedown', initResize);
    }

    function initResize(e) {
        isResizing = true;
        resizeHandle.classList.add('dragging');

        // Store initial values
        const initialX = e.clientX;
        const initialWidth = sidebar.offsetWidth;

        // Add event listeners for mouse movement and release
        document.addEventListener('mousemove', resize);
        document.addEventListener('mouseup', stopResize);

        function resize(e) {
            if (!isResizing) return;

            // Calculate new width
            const newWidth = initialWidth + (e.clientX - initialX);
            const minWidth = parseInt(getComputedStyle(document.documentElement)
                .getPropertyValue('--sidebar-collapsed-width'), 10);
            const maxWidth = window.innerWidth * 0.4;

            // Apply constraints
            if (newWidth >= minWidth && newWidth <= maxWidth) {
                requestAnimationFrame(() => {
                    document.documentElement.style.setProperty('--sidebar-width', `${newWidth}px`);
                    if (!sidebar.classList.contains('collapsed')) {
                        mainWrapper.style.marginLeft = `${newWidth}px`;
                    }
                });
            }
        }

        function stopResize() {
            isResizing = false;
            resizeHandle.classList.remove('dragging');
            document.removeEventListener('mousemove', resize);
            document.removeEventListener('mouseup', stopResize);
            
            // Store the final width
            localStorage.setItem('sidebarWidth', 
                getComputedStyle(document.documentElement).getPropertyValue('--sidebar-width'));
        }
    }

    // Restore saved width
    const savedWidth = localStorage.getItem('sidebarWidth');
    if (savedWidth) {
        document.documentElement.style.setProperty('--sidebar-width', savedWidth);
        if (!sidebar.classList.contains('collapsed')) {
            mainWrapper.style.marginLeft = savedWidth;
        }
    }
}

function initializeSubmenuBehavior() {
    const menuLinks = document.querySelectorAll('.menu-link[data-bs-toggle="collapse"]');
    
    menuLinks.forEach(link => {
        const collapse = new bootstrap.Collapse(
            document.querySelector(link.getAttribute('data-bs-target')), 
            { toggle: false }
        );

        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSubmenu = document.querySelector(this.getAttribute('data-bs-target'));
            const arrow = this.querySelector('.menu-arrow');

            // Close all other submenus
            menuLinks.forEach(otherLink => {
                if (otherLink !== this) {
                    const otherSubmenu = document.querySelector(otherLink.getAttribute('data-bs-target'));
                    const otherArrow = otherLink.querySelector('.menu-arrow');
                    
                    if (otherSubmenu && otherSubmenu.classList.contains('show')) {
                        bootstrap.Collapse.getInstance(otherSubmenu).hide();
                        if (otherArrow) {
                            otherArrow.style.transform = 'rotate(0deg)';
                        }
                    }
                }
            });

            // Toggle current submenu
            if (targetSubmenu.classList.contains('show')) {
                collapse.hide();
                if (arrow) arrow.style.transform = 'rotate(0deg)';
            } else {
                collapse.show();
                if (arrow) arrow.style.transform = 'rotate(90deg)';
            }
        });
    });
}

function setActiveMenuItem() {
    const currentPage = window.location.pathname;
    const menuItems = document.querySelectorAll('.menu-link');
    
    menuItems.forEach(item => {
        if (item.getAttribute('href') === currentPage) {
            item.classList.add('active');
            
            const submenu = item.closest('.submenu');
            if (submenu) {
                const parentLink = document.querySelector(`[data-bs-target="#${submenu.id}"]`);
                if (parentLink) {
                    const arrow = parentLink.querySelector('.menu-arrow');
                    submenu.classList.add('show');
                    parentLink.setAttribute('aria-expanded', 'true');
                    if (arrow) arrow.style.transform = 'rotate(90deg)';
                }
            }
        }
    });
}