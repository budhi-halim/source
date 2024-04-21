// Import Databases
import {
    productList,
    priceList
} from './format.js';

// Import Functions
import {
    addRow,
    priceCodeDropDown,
    priceCodeValidation,
    quantityValidation,
    deliveryFeeValidation,
    missingPrice,
    totalPurchaseCalc,
    grandTotalCalc,
    formatIDR,
    copyToClipboard,
    subtotalCalc
} from './function.js';

// Test
function whatFunction() {
    console.log('test');
};

// Product List Table Content
addRow(productList);

// Price Code Drop Down
priceCodeDropDown(priceList);

// Calculate Button
const calcButton = document.getElementById('calc');
calcButton.addEventListener('click', function() {
    buttonClick()
});

function buttonClick() {
    // Get and Validate User Inputs
    // Price Code
    const priceCodeInput = priceCodeValidation(priceList);

    // Quantity
    const quantityInput = quantityValidation(productList);

    // Delivery Fee
    let deliveryFeeInput = deliveryFeeValidation();

    // Order Confirmation
    // orderConfirmation(priceCodeInput, quantityInput);
    
    // Missing Price Alert and Input
    const finalPriceList = missingPrice(priceList, priceCodeInput, quantityInput);

    // Purchase Price Details
    const priceDetails = totalPurchaseCalc(quantityInput, finalPriceList);

    // Subtotal
    let subtotal = priceDetails['Subtotal'];

    // Total Purchase
    let totalPurchase = priceDetails['Total'];

    // Grand Total
    let grandTotal = grandTotalCalc(totalPurchase, deliveryFeeInput);

    // Format Price to IDR
    totalPurchase = formatIDR(totalPurchase);
    deliveryFeeInput = formatIDR(deliveryFeeInput);
    grandTotal = formatIDR(grandTotal);

    // Display Subtotal
    subtotalCalc(subtotal);

    // Display Grand Total
    document.getElementById('totalPrice').innerHTML = grandTotal;

    // Filter Purchased Items
    const purchasedItemsList = Object.keys(finalPriceList);
    document.getElementById('filter').value = '';

    for (let i = 0;  i < productList.length; i++) {
        const itemName = productList[i];

        const elementTag = document.getElementById(itemName + 'Tag');

        if (purchasedItemsList.includes(itemName)) {
            elementTag.style.display = '';
        } else {
            elementTag.style.display = 'none';
        }
    }

    // Display Order Details
    const block = document.getElementById('block');
    block.innerHTML = '<b>Order Details:</b>';
    block.classList.add('blockDrop');

    // Adjust Table Position
    const headers = document.getElementsByTagName('th');

    for (let i = 0; i < headers.length; i++) {
        headers[i].classList.add('tableDrop');
    }

    // Copy Message to Clipboard
    copyToClipboard(totalPurchase, deliveryFeeInput, grandTotal);
}
