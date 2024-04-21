// Product List Table Content
export function addRow(data) {
    let tableBody = document.getElementById('productListTable');

    for (let i = 0; i < data.length; i++) {
        const row = `
            <tr id="${data[i]}Tag">
                <td class="productName">${data[i]}</td>
                <td>
                    <div class="wrapper">
                        <button class="counter decrement" onclick="
                            let currentValue = Number(document.getElementById('${data[i]}').value);
                            let newValue = 0;
                            
                            if (currentValue > 0)
                                newValue = currentValue - 1;
                            else
                                newValue = currentValue;
                            
                            document.getElementById('${data[i]}').value = newValue;">
                            −
                        </button>
                        <input type="text" class="dataInput" id="${data[i]}" value="0">
                        <button class="counter increment" onclick="
                            let currentValue = Number(document.getElementById('${data[i]}').value);
                            let newValue = 0;
                            
                            if (currentValue < 999)
                                newValue = currentValue + 1;
                            else
                                newValue = currentValue;
                            
                            document.getElementById('${data[i]}').value = newValue;">
                            +
                        </button>
                    </div>
                </td>
                <td>
                    <span class="subtotal" id="${data[i]}Subtotal">
                        -
                    </span>
                </td>
            </tr>`

            tableBody.innerHTML += row;
    }
}

// Price Code Drop Down
export function priceCodeDropDown(priceList) {
    const priceCodeList = Object.keys(priceList);
    let selector = document.getElementById('priceCode');

    for (let i = 0; i < priceCodeList.length; i++) {
        const option = `<option value="${priceCodeList[i]}">${priceCodeList[i]}</option>`;
        selector.innerHTML += option;
    }
}

// Get and Validate User Inputs
// Price Code
export function priceCodeValidation(priceList) {
    let priceCode = document.getElementById('priceCode').value;

    // Validation
    if (priceCode == 'Select') {
        alert('Please select customer price code.');
        throw 'Invalid price code.';
    } else {
        console.log(priceList[priceCode]);
        return priceCode;
    }
}

// Quantity
export function quantityValidation(productList) {
    let quantityArray = {};
    let isNumberArray = [];

    for (let i = 0; i < productList.length; i++) {
        const itemQuantity = Number(document.getElementById(productList[i]).value);

        if (itemQuantity > 0)
            quantityArray[productList[i]] = itemQuantity;

        // Validation
        const validity = Number.isInteger(itemQuantity);
        isNumberArray.push(validity);
    }

    if (isNumberArray.includes(false)) {
        alert('Please enter valid quantity.');
        throw 'Invalid item quantity';
    } else {
        console.log(quantityArray);
        return quantityArray;
    }
}

// Delivery Fee
export function deliveryFeeValidation() {
    const deliveryFee = Number(document.getElementById('deliveryFee').value);

    // Validation
    if (Number.isInteger(deliveryFee)) {
        console.log({'Delivery Fee': deliveryFee});
        return deliveryFee;        
    } else {
        alert('Please enter valid delivery fee.');
        throw 'Delivery fee invalid.';
    }
}

// Order Confirmation

export function orderConfirmation(priceCodeInput, quantityInput) {
    const purchasedItemsList = Object.keys(quantityInput);

    let text =
`Confirm your order:\n
Price Code: ${priceCodeInput}\n\n`;

    for (let i = 0; i < purchasedItemsList.length; i++) {
        const item = purchasedItemsList[i];
        const itemQuantity = quantityInput[item];

        text += `${item} ×${itemQuantity}\n`
    }
    
    const confirmation = confirm(text);

    if (!confirmation)
        throw 'Order not confirmed.'
}

// Missing Price Alert and Input
export function missingPrice(priceList, priceCodeInput, quantityInput) {
    const purchasedItemsList = Object.keys(quantityInput);

    // Filter Price List
    const activePriceList = priceList[priceCodeInput];
    let filteredPriceList = {};


    for (let i = 0; i < purchasedItemsList.length; i++) {
        const item = purchasedItemsList[i];
        let itemPrice = Number(activePriceList[item]);
        
        // Validation
        if (isNaN(itemPrice)) {
            alert(`Error: missing price for ${item}.`);

            // Price Manual Input
            itemPrice = prompt(`Enter price for ${item}:`)

            // Validation
            while (true) {
                if (itemPrice == null) {
                    throw 'Price input cancelled.';
                } else if (itemPrice == '') {
                    itemPrice = prompt('Input cannot be empty.');
                    continue;
                } else if (isNaN(itemPrice)) {
                    itemPrice = prompt('Please enter a valid number.');
                    continue;
                } else {
                    itemPrice = Number(itemPrice);
                    break;
                }
            }
        }

        filteredPriceList[item] = itemPrice;
    }

    console.log(filteredPriceList);
    return filteredPriceList;
}

// Total Purchase
export function totalPurchaseCalc(quantityInput, finalPriceList) {
    const purchasedItemsList = Object.keys(quantityInput);
    let totalPrice = 0;

    let totalPurchaseArray = {};

    for (let i = 0; i < purchasedItemsList.length; i++) {
        const item = purchasedItemsList[i];
        const itemQuantity = quantityInput[item];
        const itemPrice =  itemQuantity * finalPriceList[item];

        totalPrice += itemPrice;

        totalPurchaseArray[item] = {'Quantity': itemQuantity, 'Subtotal': itemPrice};
    }

    console.log(totalPurchaseArray);
    console.log({'Total Purchase': totalPrice})

    return {
        'Total': totalPrice,
        "Subtotal": totalPurchaseArray
    };
}

// Subtotal
export function subtotalCalc(subtotal) {
    const purchasedItemsList = Object.keys(subtotal);

    for (let i = 0; i < purchasedItemsList.length; i++) {
        const item = purchasedItemsList[i]
        let itemPrice = subtotal[item]['Subtotal'];

        // Format to IDR
        itemPrice = formatIDR(itemPrice);

        // Display Subtotal
        document.getElementById(item + 'Subtotal').innerHTML = itemPrice;
    }
}

// Grand Total
export function grandTotalCalc(totalPurchase, deliveryFeeInput) {
    const grandTotal = totalPurchase + deliveryFeeInput;
    console.log({'Grand Total': grandTotal});
    return grandTotal;
}

// Format to IDR
export function formatIDR(price) {
    const rupiah = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR'
        }).format(number);
    }

    const displayedText = rupiah(price).toString().slice(0, rupiah(price).length - 2) + '-';
    return displayedText;
}

// Copy Message to Clipboard
export async function copyToClipboard(totalPurchase, deliveryFeeInput, grandTotal) {
    // Message Template
    const message =

`Total pemesanan ${totalPurchase}
Ongkos kirim ${deliveryFeeInput}
*Total ${grandTotal}*
        
Pembayaran silakan transfer ke:
BCA 3191954431
Harijono
        
Terima kasih atas pemesanan produk *Sweet Times*`;

    // Create Temporary Text Area
    const textArea = document.createElement('textarea');
    textArea.setAttribute('id', 'message');
    document.body.append(textArea);

    // Set Message to Text Area
    textArea.value = message;
    
    // Select Message in Text Area
    textArea.select();
    
    // Copy Selected Text
    try {
        navigator.clipboard.writeText(textArea.value);
        const fromClipboard = await navigator.clipboard.readText();
        console.log(fromClipboard);
        textArea.remove();
        popUp('Copied to clipboard.')
    } catch (err) {
        popUp('Failed to copy.')
        document.getElementById('log').textContent = 'Failed to copy. Please copy the selected text below manually.';
    };
};

function popUp(text) {
    // Create Pop Up Message
    // Create Element
    const popUpElement = document.createElement('div');
    popUpElement.setAttribute('id', 'popUpMessage');
    document.body.appendChild(popUpElement);
    document.getElementById('popUpMessage').innerHTML = text;
    
    // Drop Opacity Function
    function dropInterval() {
        const popUpMessage = document.querySelector('#popUpMessage');
        let opacity = 0.5;
        let interval = setInterval(function() {

            if (opacity > 0) {
                opacity -= 0.005;
                popUpMessage.style.opacity = opacity;
            } else {
                clearInterval(interval);
    
                // Remove Element
                popUpElement.parentNode.removeChild(popUpElement);
            }
        }, 4);
    };

    // Delay Opacity Drop
    setTimeout(dropInterval, 500);
};