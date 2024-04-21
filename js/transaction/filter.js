function filterTable() {
    const input = document.getElementById('filter').value.toUpperCase();
    const productList = document.getElementsByClassName('productName');

    for (let i = 0; i < productList.length; i++) {
        const itemName = productList[i].innerHTML;

        const elementTag = document.getElementById(itemName + 'Tag');
        
        if (itemName.toUpperCase().indexOf(input) > -1) {
            elementTag.style.display = '';
        } else {
            elementTag.style.display = 'none';
        }
    }

    // Clear Order Details
    const block = document.getElementById('block');
    block.innerHTML = '';
    block.classList.remove('blockDrop');

    // Adjust Table Position
    const headers = document.getElementsByTagName('th');

    for (let i = 0; i < headers.length; i++) {
        headers[i].classList.remove('tableDrop');
    }
}

function clearFilter() {
    document.getElementById('filter').value = '';
    filterTable();
}

// Hide Virtual Keyboard On Touch Move
document.addEventListener('touchmove', () => {
    document.getElementById('filter').blur();
})