// Import Database
const database = document.getElementById('database').textContent;
const traySize = Number(document.getElementById('tray-size').textContent);

// Greeting
function greeting() {
    const now = new Date();
    const hour = now.getHours();
    
    let message = '';
    if ( hour < 4 ) {
        message = 'Good Night!';
    } else if ( hour < 10 ) {
        message = 'Good Morning!';
    } else if ( hour < 16 ) {
        message = 'Good Afternoon!';
    } else if ( hour < 20 ) {
        message = 'Good Evening!';
    } else {
        message = 'Good Night!';
    }
    
    document.getElementById('greeting').innerHTML = message;
}

setInterval(greeting, 1000);

// Ingredient Database
const ingredientDatabase = database.split('/');

// Product Type
const productType = ingredientDatabase[0].split('|').slice(2);

// Product List
const productListClass = [];
for (let i = 0; i < productType.length; i++) {
    productListClass.push([productType[i], productType[i].replaceAll(' ', '')]);
}

for (let i = 0; i < (productType.length - 1); i++) {
    for (let j = (i + 1); j < productType.length; j++) {
        const str = `Mix ${productType[i]} & ${productType[j]}`;
        const classLabel = `${productType[i].replaceAll(' ', '')} ${productType[j].replaceAll(' ', '')} mix`;
        productListClass.push([str, classLabel]);
    }
}

const productList = [];
for (let i = 0; i < productListClass.length; i++) {
    productList.push(productListClass[i][0]);
}

//Ingredient
const ingredientUnparsed = ingredientDatabase.slice(1);
const ingredientParsed = [];

for (let i = 0; i < ingredientUnparsed.length; i++) {
    const ingredientArray = ingredientUnparsed[i].split('|');
    ingredientParsed.push(ingredientArray);
}
let ingredient = {};

for (let i = 0; i < productType.length; i++) {
    const type = productType[i];
    ingredient[type] = {};
    for (let j = 2; j < ingredientParsed.length; j++) {
        const item = ingredientParsed[j][0];
        const unit = ingredientParsed[j][1];
        const amount = Number(ingredientParsed[j][i + 2]);
        ingredient[type][item] = [amount, unit];
    }
}

// Cookie Yield and Bake Time
const recipeYield = {};
const bakeTime = {};

for (let i = 0; i < productType.length; i++) {
    const type = productType[i];
    const cookieYield = Number(ingredientParsed[0][i + 2]);
    const time = Number(ingredientParsed[1][i + 2]);

    recipeYield[type] = cookieYield;
    bakeTime[type] = time;
}

// Order Details Table
const orderDetailsEl = document.getElementById('order-details');

let orderDetailsInnerHTML = '';

for (let i = 0; i < productListClass.length; i++) {
    orderDetailsInnerHTML += `
    <tr id="${productListClass[i][0]}">
        <td>${productListClass[i][0]} Cookies</td>
        <td>
            <div class="counter">
                <button id="${productListClass[i][0]}-decrement" class="btn decrement">-</button>
                <input type="number" id="${productListClass[i][0]}-order-details" class="${productListClass[i][1]} input-number" readonly value="0">
                <button id="${productListClass[i][0]}-increment" class="btn increment">+</button>
            </div>
        </td>
    </tr>`
}

orderDetailsEl.innerHTML = orderDetailsInnerHTML;

document.getElementById('calc-btn').addEventListener('click', calcButton);

// Functions
// Search Filter
function filter() {
    const text = document.getElementById('search-bar').value;

    for (let i = 0; i < productList.length; i++) {
        if (productList[i].toLowerCase().indexOf(text.toLowerCase()) > -1) {
            document.getElementById(productList[i]).removeAttribute('hidden', true);
        } else {
            document.getElementById(productList[i]).setAttribute('hidden', true)
        }
    }

    if (text != '') {
        document.getElementById('clear-btn').removeAttribute('hidden', true);
    } else {
        document.getElementById('clear-btn').setAttribute('hidden', true);
    }
}

document.getElementById('search-bar').addEventListener('keyup', filter);
document.getElementById('search-bar').addEventListener('search', filter);

// Clear Filter
function clear() {
    for (let i = 0; i < productList.length; i++) {
        document.getElementById(productList[i]).removeAttribute('hidden', true)
    }

    document.getElementById('clear-btn').setAttribute('hidden', true);
}

document.getElementById('clear-btn').addEventListener('click', clear);

// Counter Button
// Decrement
for (let i = 0; i < productListClass.length; i++) {
    const buttonId = productListClass[i][0] + '-decrement'
    const inputId = productListClass[i][0] + '-order-details';

    function decrement() {
        const currentValue = Number(document.getElementById(inputId).value);

        if (currentValue > 0) {
            document.getElementById(inputId).value = currentValue - 1
        }
    }

    // Click
    document.getElementById(buttonId).addEventListener('click', decrement);

    // Hold
    document.getElementById(buttonId).addEventListener('mousedown', function() {
        // Set First Timeout
        const delayFirst = setTimeout(function() {
            // Set First Interval
            const intervalFirst = setInterval(decrement, 100);
            // Set Second Timeout
            const delaySecond = setTimeout(function() {
                // Remove First Interval
                clearInterval(intervalFirst);
                // Set Second Interval
                const intervalSecond = setInterval(decrement, 10);
                // Remove Second Interval
                document.getElementById(buttonId).addEventListener('mouseup', function() {
                    clearInterval(intervalSecond)
                });
                document.getElementById(buttonId).addEventListener('mouseout', function() {
                    clearInterval(intervalSecond)
                });
            }, 1500)
            // Remove Second Timeout
            document.getElementById(buttonId).addEventListener('mouseup', function() {
                clearTimeout(delaySecond)
            });
            document.getElementById(buttonId).addEventListener('mouseout', function() {
                clearTimeout(delaySecond)
            });
            // Remove First Interval
            document.getElementById(buttonId).addEventListener('mouseup', function() {
                clearInterval(intervalFirst)
            });
            document.getElementById(buttonId).addEventListener('mouseout', function() {
                clearInterval(intervalFirst)
            });
        }, 100)
        // Remove First Timeout
        document.getElementById(buttonId).addEventListener('mouseup', function() {
            clearTimeout(delayFirst)
        });
        document.getElementById(buttonId).addEventListener('mouseout', function() {
            clearTimeout(delayFirst)
        });
    })

    // Touch
    document.getElementById(buttonId).addEventListener('touchstart', function() {
        // Set First Timeout
        const delayFirst = setTimeout(function() {
            // Set First Interval
            const intervalFirst = setInterval(decrement, 100);
            // Set Second Timeout
            const delaySecond = setTimeout(function() {
                // Remove First Interval
                clearInterval(intervalFirst);
                // Set Second Interval
                const intervalSecond = setInterval(decrement, 10);
                // Remove Second Interval
                document.getElementById(buttonId).addEventListener('touchend', function() {
                    clearInterval(intervalSecond)
                });
                document.getElementById(buttonId).addEventListener('touchmove', function() {
                    clearInterval(intervalSecond)
                });
            }, 1500)
            // Remove Second Timeout
            document.getElementById(buttonId).addEventListener('touchend', function() {
                clearTimeout(delaySecond)
            });
            document.getElementById(buttonId).addEventListener('touchmove', function() {
                clearTimeout(delaySecond)
            });
            // Remove First Interval
            document.getElementById(buttonId).addEventListener('touchend', function() {
                clearInterval(intervalFirst)
            });
            document.getElementById(buttonId).addEventListener('touchmove', function() {
                clearInterval(intervalFirst)
            });
        }, 100)
        // Remove First Timeout
        document.getElementById(buttonId).addEventListener('touchend', function() {
            clearTimeout(delayFirst)
        });
        document.getElementById(buttonId).addEventListener('touchmove', function() {
            clearTimeout(delayFirst)
        });
    })
}

// Increment
for (let i = 0; i < productListClass.length; i++) {
    const buttonId = productListClass[i][0] + '-increment'
    const inputId = productListClass[i][0] + '-order-details';

    function increment() {
        const currentValue = Number(document.getElementById(inputId).value);

        if (currentValue < 999) {
            document.getElementById(inputId).value = currentValue + 1
        }
    }

    // Click
    document.getElementById(buttonId).addEventListener('click', increment);

    // Hold
    document.getElementById(buttonId).addEventListener('mousedown', function() {
        // Set First Timeout
        const delayFirst = setTimeout(function() {
            // Set First Interval
            const intervalFirst = setInterval(increment, 100);
            // Set Second Timeout
            const delaySecond = setTimeout(function() {
                // Remove First Interval
                clearInterval(intervalFirst);
                // Set Second Interval
                const intervalSecond = setInterval(increment, 10);
                // Remove Second Interval
                document.getElementById(buttonId).addEventListener('mouseup', function() {
                    clearInterval(intervalSecond)
                });
                document.getElementById(buttonId).addEventListener('mouseout', function() {
                    clearInterval(intervalSecond)
                });
            }, 1500)
            // Remove Second Timeout
            document.getElementById(buttonId).addEventListener('mouseup', function() {
                clearTimeout(delaySecond)
            });
            document.getElementById(buttonId).addEventListener('mouseout', function() {
                clearTimeout(delaySecond)
            });
            // Remove First Interval
            document.getElementById(buttonId).addEventListener('mouseup', function() {
                clearInterval(intervalFirst)
            });
            document.getElementById(buttonId).addEventListener('mouseout', function() {
                clearInterval(intervalFirst)
            });
        }, 100)
        // Remove First Timeout
        document.getElementById(buttonId).addEventListener('mouseup', function() {
            clearTimeout(delayFirst)
        });
        document.getElementById(buttonId).addEventListener('mouseout', function() {
            clearTimeout(delayFirst)
        });
    })

    // Touch
    document.getElementById(buttonId).addEventListener('touchstart', function() {
        // Set First Timeout
        const delayFirst = setTimeout(function() {
            // Set First Interval
            const intervalFirst = setInterval(increment, 100);
            // Set Second Timeout
            const delaySecond = setTimeout(function() {
                // Remove First Interval
                clearInterval(intervalFirst);
                // Set Second Interval
                const intervalSecond = setInterval(increment, 10);
                // Remove Second Interval
                document.getElementById(buttonId).addEventListener('touchend', function() {
                    clearInterval(intervalSecond)
                });
                document.getElementById(buttonId).addEventListener('touchmove', function() {
                    clearInterval(intervalSecond)
                });
            }, 1500)
            // Remove Second Timeout
            document.getElementById(buttonId).addEventListener('touchend', function() {
                clearTimeout(delaySecond)
            });
            document.getElementById(buttonId).addEventListener('touchmove', function() {
                clearTimeout(delaySecond)
            });
            // Remove First Interval
            document.getElementById(buttonId).addEventListener('touchend', function() {
                clearInterval(intervalFirst)
            });
            document.getElementById(buttonId).addEventListener('touchμοωε', function() {
                clearInterval(intervalFirst)
            });
        }, 100)
        // Remove First Timeout
        document.getElementById(buttonId).addEventListener('touchend', function() {
            clearTimeout(delayFirst)
        });
        document.getElementById(buttonId).addEventListener('touchmove', function() {
            clearTimeout(delayFirst)
        });
    })
}

// Calculate Button
function calcButton() {
    // Order Amount
    const orderAmount = {};

    for (let i = 0; i < productType.length; i++) {
        const type = productType[i];
        const typeLabel = productType[i].replaceAll(' ', '');
        const orderedCookies = document.getElementsByClassName(typeLabel);
        const orderedCookiesMixed = document.getElementsByClassName(typeLabel + ' mix');

        let orderedCookiesCount = 0;
        let orderedCookiesMixedCount = 0;

        // All Cookies
        for (let j = 0; j < orderedCookies.length; j++) {
            orderedCookiesCount += Number(orderedCookies[j].value)
        }

        // Mixed Cookies
        for (let j = 0; j < orderedCookiesMixed.length; j++) {
            orderedCookiesMixedCount += Number(orderedCookiesMixed[j].value)
        }

        // Whole Cookies
        const orderedCookiesWholeCount = orderedCookiesCount - orderedCookiesMixedCount;

        orderAmount[type] = (10 * orderedCookiesWholeCount) + (5 * orderedCookiesMixedCount);
    }

    // Recipe Count Calculation
    const recipeCount = {};

    for (let i = 0; i < productType.length; i++) {
        const type = productType[i];
        const ordered = orderAmount[type];
        const cookieYield = recipeYield[type];
        const count = ordered / cookieYield;

        let countFinal = null;

        if (count === 0) {
            countFinal = 0
        } else if (count < 1) {
            countFinal = 1
        } else if (Number.isInteger(count)) {
            countFinal = count + 0.5
        } else {
            countFinal = Math.ceil(2 * count) / 2
        }

        recipeCount[type] = countFinal;
    }

    // Ordered Product Type
    const orderedProductType = [];

    for (let i = 0; i < productType.length; i++) {
        const type = productType[i];
        const amount = orderAmount[type];

        if (amount > 0) {
            orderedProductType.push(type);
        }
    }

    // Estimated Time
    const estimatedTime = {};

    for (let i = 0; i < orderedProductType.length; i++) {
        const type = orderedProductType[i];
        const amount = recipeYield[type] * recipeCount[type];
        const batchTime = bakeTime[type];

        const batchNumber = amount / traySize;
        const time = Math.ceil(2 * batchNumber * batchTime * 1.1 / 60) / 2;

        estimatedTime[type] = time;
    }

    // Production Details Table
    const productionDetailsBodyEl = document.getElementById('production-details-body');
    const productionDetailsFooterEl = document.getElementById('production-details-footer');
    let productionDetailsInnerHTML = '';

    let totalCookieCount = 0;
    let totalRecipeNumber = 0;
    let totalTimeEstimate = 0;

    for (let i = 0; i < orderedProductType.length; i++) {
        const type = orderedProductType[i];
        const cookieCount = orderAmount[type];
        const recipeNumber = recipeCount[type];
        const yieldPerRecipe = recipeYield[type];
        const timeEstimate = estimatedTime[type];

        totalCookieCount += cookieCount;
        totalRecipeNumber += recipeNumber;
        totalTimeEstimate += timeEstimate;

        productionDetailsInnerHTML+= `
        <tr>
            <td>${type}</td>
            <td>${cookieCount} pcs</td>
            <td>${recipeNumber}×</td>
            <td>${yieldPerRecipe} pcs</td>
            <td>${timeEstimate} hrs</td>
        </tr>`
    }

    productionDetailsBodyEl.innerHTML = productionDetailsInnerHTML;

    productionDetailsFooterEl.innerHTML = `
    <tr>
        <th scope="row">Total</th>
        <td>${totalCookieCount} pcs</td>
        <td>${totalRecipeNumber}×</td>
        <td>-</td>
        <td>${totalTimeEstimate} hrs</td>
    </tr>`;

    // Recipe Count Details
    const orderedRecipeCount = {};

    for (let i = 0; i < orderedProductType.length; i++) {
        const type = orderedProductType[i];
        const amount = recipeCount[type];

        if (amount > 0) {
            orderedRecipeCount[type] = amount
        }
    }

    const recipeCountDetails = {};

    for (let i = 0; i < orderedProductType.length; i++) {
        const type = orderedProductType[i];
        let amount = orderedRecipeCount[type];
        let countOne = 0;
        let countOneHalf = 0;

        while (amount > 0) {
            if (amount % 1.5 === 0) {
                countOneHalf += 1;
                amount -= 1.5;
            } else {
                countOne += 1;
                amount -= 1;
            }
        }

        recipeCountDetails[type] = {};

        recipeCountDetails[type][1] = countOne;
        recipeCountDetails[type][1.5] = countOneHalf;
    }

    // Recipe Count Details Table
    const recipeCountDetailsEl = document.getElementById('recipe-count-details');
    let recipeCountDetailsInnerHTML = '';

    for (let i = 0; i < orderedProductType.length; i++) {
        const type = orderedProductType[i];
        const countOne = recipeCountDetails[type][1];
        const countOneHalf = recipeCountDetails[type][1.5];

        recipeCountDetailsInnerHTML += `
        <tr>
            <td>${type}</td>
            <td>${countOne}</td>
            <td>${countOneHalf}</td>
        </tr>`
    }

    recipeCountDetailsEl.innerHTML = recipeCountDetailsInnerHTML;

    // Used Ingredient
    const ingredientList = [];

    for (let i = 2; i < ingredientParsed.length; i++) {
        const item = ingredientParsed[i];
        ingredientList.push(item);
    }

    const ingredientAmount = {};

    for (let i = 0; i < ingredientList.length; i++) {
        const ingredientName = ingredientList[i][0];
        const unit = ingredientList[i][1];
        const ingredientPerRecipe = ingredientList[i].slice(2);
        ingredientAmount[ingredientName] = {};
        let amount = 0;
        
        for (let j = 0; j < productType.length; j++) {
            const type = productType[j];
            const recipeNumber = recipeCount[type];
            const ingredientNeeded = recipeNumber * ingredientPerRecipe[j];

            amount += ingredientNeeded;

            ingredientAmount[ingredientName][type] = ingredientNeeded;
        }

        ingredientAmount[ingredientName]['Total'] = amount;
        ingredientAmount[ingredientName]['Unit'] = unit;
    }

    // Ingredient Details Table
    const ingredientDetailsTypeEl = document.getElementById('ingredient-details-type');
    const ingredientDetailsHeadEl = document.getElementById('ingredient-details-head');
    const ingredientDetailsBodyEl = document.getElementById('ingredient-details-body');

    ingredientDetailsTypeEl.setAttribute('colspan', orderedProductType.length);

    // Table Head
    ingredientDetailsHeadEl.innerHTML = '';

    for (let i = 0; i < orderedProductType.length; i++) {
        const type = orderedProductType[i];

        ingredientDetailsHeadEl.innerHTML += `<th scope="col">${type}</th>`
    }

    // Table Body
    ingredientDetailsBodyEl.innerHTML = '';

    for (let i = 0; i < ingredientList.length; i++) {
        const ingredientName = ingredientList[i][0];
        const unit = ingredientAmount[ingredientName]['Unit'];

        let ingredientUsed = 0;

        let row = `<td>${ingredientName}</td>`;

        for (let j = 0; j < orderedProductType.length; j++) {
            const type = orderedProductType[j];
            const ingredientAmountDetails = ingredientAmount[ingredientName][type];
            
            ingredientUsed += ingredientAmountDetails;

            row += `<td>${ingredientAmountDetails} ${unit}</td>`
        }

        if (ingredientUsed > 0) {
            row += `<td>${ingredientAmount[ingredientName]['Total']} ${unit}</td>`;

            ingredientDetailsBodyEl.innerHTML += `<tr>${row}</tr>`; 
        }
    }

    // Show Result
    if (Math.max(...Object.values(orderAmount)) > 0) {
        document.getElementById('result').removeAttribute('hidden', true)

        // Reset Filter
        for (let i = 0; i < productList.length; i++) {
            const item = productList[i];
            const amount = Number(document.getElementById(`${item}-order-details`).value);

            if (amount > 0) {
                document.getElementById(item).removeAttribute('hidden', true)
            } else {
                document.getElementById(item).setAttribute('hidden', true)
            }
        }

        document.getElementById('clear-btn').removeAttribute('hidden', true);

        // Move Back to Top
        window.location.replace('#');
    }

    // Clear Button
    document.getElementById('clear-btn').addEventListener('click', clear);
    
    // Download Button
    document.getElementById('download-btn').addEventListener('click', function() {
        const now = new Date();
        const date = now.getDate();
        const month = now.getMonth();
        const year = now.getFullYear();
        
        const fileName = `Ingredients ${date}-${month}-${year}.xlsx`;
        const table = document.getElementById('export');
        const wb = XLSX.utils.table_to_book(table);
        XLSX.writeFile(wb, fileName);
    })
}

document.addEventListener('keyup', function(e) {
    if (e.key === 'Enter') {
        calcButton()
    }
})