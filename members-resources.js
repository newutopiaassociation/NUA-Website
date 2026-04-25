// members-resources.js
// Logic for fetching resources, rendering cards, and handling UI interactions

let resourcesData = {};

document.addEventListener('DOMContentLoaded', () => {
    // Only proceed if authenticated (auth.js handles the overlay, but we can wait for the event)
    if (typeof isAuthenticated !== 'undefined' && isAuthenticated) {
        initResources();
    } else {
        document.addEventListener('nua-auth-success', initResources);
    }
});

async function initResources() {
    try {
        const response = await fetch('resources.json');
        if (!response.ok) throw new Error('Failed to load resources data');
        
        const data = await response.json();
        resourcesData = data.resources || {};
        
        setupUI();
        renderAll();
        
    } catch (error) {
        console.error('Error initializing resources:', error);
        document.getElementById('recent-resources-container').innerHTML = 
            '<p style="color: red;">Failed to load resources. Please try again later.</p>';
    }
}

function setupUI() {
    // Tab switching logic
    const tabBtns = document.querySelectorAll('.resources-tabs .tab-btn');
    const tabContents = document.querySelectorAll('.resources-tabs .tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active to clicked
            btn.classList.add('active');
            const targetId = 'tab-' + btn.getAttribute('data-tab');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // Search and Filter logic
    const searchInput = document.getElementById('resource-search');
    const yearFilter = document.getElementById('filter-year');
    const typeFilter = document.getElementById('filter-type');
    
    const applyFilters = () => {
        const q = searchInput.value.toLowerCase();
        const year = yearFilter.value;
        const type = typeFilter.value;
        renderAll(q, year, type);
    };
    
    searchInput.addEventListener('input', applyFilters);
    yearFilter.addEventListener('change', applyFilters);
    typeFilter.addEventListener('change', applyFilters);
}

function renderAll(query = "", yearFilter = "", typeFilter = "") {
    // Flatten all resources to find "Recent"
    let allItems = [];
    Object.keys(resourcesData).forEach(category => {
        if (resourcesData[category]) {
            resourcesData[category].forEach(item => {
                allItems.push({ ...item, category });
            });
        }
    });

    // Filter Items
    let filteredItems = allItems.filter(item => {
        const matchQuery = item.title.toLowerCase().includes(query);
        const matchYear = yearFilter ? item.date.startsWith(yearFilter) : true;
        const matchType = typeFilter ? item.type === typeFilter : true;
        return matchQuery && matchYear && matchType;
    });

    // Sort by Date Descending
    filteredItems.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Render Recent (Top 2) - Only if no filters applied, or show matching top 2
    renderGrid('recent-resources-container', filteredItems.slice(0, 2));

    // Render Categories
    let hasResults = false;
    
    const categories = ['mcMeetingMinutes', 'nuaMeetingMinutes', 'meetingPresentations', 'documents'];
    categories.forEach(cat => {
        const items = filteredItems.filter(item => item.category === cat);
        const container = document.getElementById(`grid-${cat}`);
        if (container) {
            renderGrid(`grid-${cat}`, items);
            if (items.length > 0) hasResults = true;
        }
    });

    // Handle No Results Message
    const noResultsMsg = document.getElementById('no-results-msg');
    const tabContents = document.querySelector('.tab-contents');
    
    if (noResultsMsg) {
         if (!hasResults && Object.keys(resourcesData).length > 0) {
             // Hide specific categories, show message
             document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none');
             noResultsMsg.classList.remove('hidden');
         } else {
             // Restore display logic
             document.querySelectorAll('.tab-content').forEach(el => el.style.display = ''); // Revert info to css class control
             noResultsMsg.classList.add('hidden');
         }
    }
}

function renderGrid(containerId, items) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    
    if (items.length === 0) {
        container.innerHTML = '<p style="opacity: 0.6; font-style: italic;">No resources found in this section.</p>';
        return;
    }
    
    items.forEach(item => {
        const icon = getIconForType(item.type);
        const formattedDate = new Date(item.date).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric'
        });
        
        const card = document.createElement('div');
        card.className = 'resource-card';
        card.innerHTML = `
            <div class="resource-icon">${icon}</div>
            <div class="resource-info">
                <h4>${item.title}</h4>
                <span class="resource-date">Uploaded: ${formattedDate}</span>
                <span class="resource-badge ${item.type}">${item.type.toUpperCase()}</span>
            </div>
            <div class="resource-actions">
                <a href="${item.url}" target="_blank" class="res-btn outline" title="View Document">👁️ View</a>
            </div>
        `;
        container.appendChild(card);
    });
}

function getIconForType(type) {
    switch(type.toLowerCase()) {
        case 'pdf': return '📄';
        case 'ppt': return '📊';
        case 'doc': case 'docx': return '📝';
        default: return '📁';
    }
}
