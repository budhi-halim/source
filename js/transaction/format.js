// Import Database
const rawProductList = document.getElementById('raw-product-list').textContent;
const rawPriceList = document.getElementById('raw-price-list').textContent;

// Product List
export const productList = rawProductList.split('|');

// Price List
// Split Each Row
const priceData = rawPriceList.split('>');

let priceListFormat = {};

for (let i = 0; i < priceData.length; i++) {
    // Split Price Code and Price Data
    const priceCode = priceData[i].split('/')[0];
    const priceValue = priceData[i].split('/')[1];

    // Split Price Data of Each Item
    const priceDetails = priceValue.split('|');

    let priceListArray = {};

    for (let j = 0; j < priceDetails.length; j += 2) {
        priceListArray[priceDetails[j]] = Number(priceDetails[j + 1]);
    }

    priceListFormat[priceCode] = priceListArray;
}

export const priceList = priceListFormat;