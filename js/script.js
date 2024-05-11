// Pagination configuration
const totalPages = 10; // Total number of pages
const visiblePages = 20; // Number of visible pagination buttons
let currentPage = 1;
const itemsPerPage=10;
let firstpage=1; // Current active page


async function fetchData(page) {
    try {
        const response = await fetch(`https://raw.githubusercontent.com/Rajavasanthan/jsondata/master/pagenation.json?page=${page}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Fetched data:', data); // Log the fetched data
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}


async function displayData(page) {
    const dataTableBody = document.querySelector('#table tbody');
    dataTableBody.innerHTML = ''; 

    const data = await fetchData(page);
    if (!data) return; // Return if data is null

    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    // Slice the data array to get only the items for the current page
    const pageData = data.slice(startIndex, endIndex);
    if (Array.isArray(pageData)) {
        pageData.forEach(item => {
            const row = document.createElement('tr');
            const idCell = document.createElement('td');
            const nameCell = document.createElement('td');
            idCell.textContent = item.id;
            nameCell.textContent = item.name;
            row.appendChild(idCell);
            row.appendChild(nameCell);
            dataTableBody.appendChild(row);
        });
    } else {
        console.error('Data format is incorrect:', data);
    }
     ;

    // Update pagination buttons
    createPaginationButtons();
}



// Function to create pagination buttons
function createPaginationButtons() {
    const paginationContainer = document.getElementById("buttons");
    paginationContainer.innerHTML = ''; // Clear previous buttons

    // Calculate start and end page numbers based on current page and visible pages
    let startPage = currentPage - Math.floor(visiblePages / 2);
     startPage = Math.max(startPage, 1); // Ensure startPage is not less than 1
    let endPage = startPage + visiblePages - 1;
    endPage = Math.min(endPage, totalPages);
     
     
    // Create pagination buttons
    for (let i = startPage; i <= endPage; i++) {
        const button = document.createElement('button');
        button.classList.add('pagination-btn');
        
        document.getElementById("currentPageInput").value = currentPage;
        if(i==firstpage)
        {
            button.textContent = "First"; 
        }
        else {
            button.textContent = i;
        }
    
        if (i === currentPage) {
            button.classList.add('active');
        }
        button.addEventListener('click', () => {
            currentPage = i;
            displayData(currentPage)
            createPaginationButtons(); // Update pagination buttons
        });
        paginationContainer.appendChild(button);
    }
    const previousButton = document.createElement('button');
    previousButton.textContent = "Previous";
    previousButton.classList.add('pagination-btn');
    previousButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            displayData(currentPage);
            createPaginationButtons(); // Update pagination buttons
        }
    });
    paginationContainer.appendChild(previousButton);
   
        
    
}

// Initial call to create pagination buttons
createPaginationButtons();
displayData(currentPage)
