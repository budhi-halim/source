// Math Functions
export function maxArray(array) {
    let maxValue = null;
    for (let i = 0; i < array.length; i++) {
        if (array[i] > maxValue) maxValue = array[i];
    };
    return +maxValue;
};

export function minArray(array) {
    let minValue = null;
    for (let i = 0; i < array.length; i++) {
        if (array[i] < minValue) minValue = array[i];
    };
    return minValue;
};

export function sumArray(array) {
    let sum = 0;
    for (let i = 0; i < array.length; i++) {
        sum += array[i];
    };
    return sum;
};

export function averageArray(array) {
    let sum = 0;
    for (let i = 0; i < array.length; i++) {
        sum += array[i];
    };
    const average = sum / array.length;
    return average;
};

export function varSArray(array) {
    let sum = 0;
    for (let i = 0; i < array.length; i++) {
        sum += array[i];
    };
    const average = sum / array.length;
    let sqDev = 0;
    for (let i = 0; i < array.length; i++) {
        sqDev += (array[i] - average) ** 2;
    };
    const variance = sqDev / (array.length - 1);
    return variance;
};

export function stDevSArray(array) {
    let sum = 0;
    for (let i = 0; i < array.length; i++) {
        sum += array[i];
    };
    const average = sum / array.length;
    let sqDev = 0;
    for (let i = 0; i < array.length; i++) {
        sqDev += (array[i] - average) ** 2;
    };
    const stDev = Math.sqrt(sqDev / (array.length - 1));
    return stDev;
};

export function varPArray(array) {
    let sum = 0;
    for (let i = 0; i < array.length; i++) {
        sum += array[i];
    };
    const average = sum / array.length;
    let sqDev = 0;
    for (let i = 0; i < array.length; i++) {
        sqDev += (array[i] - average) ** 2;
    };
    const variance = sqDev / array.length;
    return variance;
};

export function stDevPArray(array) {
    let sum = 0;
    for (let i = 0; i < array.length; i++) {
        sum += array[i];
    };
    const average = sum / array.length;
    let sqDev = 0;
    for (let i = 0; i < array.length; i++) {
        sqDev += (array[i] - average) ** 2;
    };
    const stDev = Math.sqrt(sqDev / array.length);
    return stDev;
};

// Greetings
export function greetings() {
    const now = new Date();
    const hour = now.getHours();
    let message = null;
    if (hour >= 20 || hour < 4) {
        message = 'Good Night!';
    } else if (hour < 10) {
        message = 'Good Morning!';
    } else if (hour < 16) {
        message = 'Good Afternoon!';
    } else {
        message = 'Good Evening!';
    }
    return message;
};

// Today's Date
export function today(format = 'string', showDay = false) {
    const now = new Date();
    const year = now.getFullYear();
    let month = now.getMonth() + 1;
    let date = now.getDate();
    let day = now.getDay();
    let today = null;
    if (format === 'string') {
        today = `${date}-${month}-${year}`;
    } else if (format === '3-letters') {
        const monthName = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        month = month - 1;
        today = `${date} ${monthName[month]} ${year}`;
    } else if (format === 'full') {
        const monthName = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        month--;
        today = `${date} ${monthName[month]} ${year}`;
    } else if (format === 'number') {
        if (showDay === false) {
            today = Number(`${year}${('0' + month).slice(-2)}${('0' + date).slice(-2)}`);
        } else {
            throw 'Error: number format cannot show day.'
        };
    } else {
        throw "Error: format argument must be one of the following: 'string', '3-letters', 'full', or 'number'.";
    }
    if (showDay === '3-letters') {
        const dayName = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        day--;
        today = `${dayName[day]}, ${today}`;
    } else if (showDay === 'full') {
        const dayName = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        day--;
        today = `${dayName[day]}, ${today}`;
    } else if (showDay === false) {
    } else {
        throw "Error: format argument must be one of the following: '3-letters', 'full', or false.";
    };
    return today;
};

// Format to IDR
export function rupiah(price, cent = '') {
    if (typeof(cent) != 'string') {
        throw "Error: 'cent' argument must be a string ('rupiah' function)";
    } else {
        console.log('go');
        const IDR = Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
        });
        price = IDR.format(price);
        if (cent === '') {
            price = price.slice(0, price.length - 3);
        } else if (cent === '00') {
            price = price;
        } else {
            price = price.slice(0, price.length - 2) + cent;
        };
        return price;
    };
};

export function excelToJSON(arrayBuffer, sheetName) {
    const workbook =
};
// Excel Table to JSON
// <script src="https://budhi-halim.github.io/source/js/other/sheet.js"></script>
export function excelToJSON(arrayBuffer, sheetName) {
    const workbook = XLSX.read(arrayBuffer, {type: 'array',});
    const table = workbook['Sheets'][sheetName];
    const cellNames = Object.keys(table);
    cellNames.shift();
    const occupiedColumns = [];
    for (let i = 0; i < cellNames.length; i++) {
        let name = cellNames[i];
        name = name.slice(0, name.length - 1);
        if (occupiedColumns.includes(name)) {
            break;
        } else {
            occupiedColumns.push(name)
        };
    };
    let rowNumber = 1;
    let rowCount = -1;
    while (true) {
        const name = 'A' + rowNumber;
        if (cellNames.includes(name)) {
            rowCount = rowNumber;
            rowNumber++;
        } else {
            break;
        };
    };
    const tableJSON = [];
    for (let i = 1; i < rowCount; i++) {
        const tableRow = {};
        for (let j = 0; j < occupiedColumns.length; j++) {
            const cellName = occupiedColumns[j] + (i + 1);
            let colName = occupiedColumns[j] + '1';
            colName = table[colName]['v'];
            let value = null;
            if (cellNames.includes(cellName)) {
                value = table[cellName]['v'];
            };
            tableRow[colName] = value;
        };
        tableJSON.push(tableRow);
    };
    return tableJSON;
};

//  JSON to Excel Table
// <script src="https://budhi-halim.github.io/source/js/other/sheet.js"></script>
export function JSONToExcel(JSON, sheetName = 'Sheet1', fileName = 'JSON To Excel') {
    const newSheet = XLSX.utils.json_to_sheet(JSON);
    const newWorkbook = XLSX.util.book_new();
    XLSX.utils.book_append_sheet(newWorkbook, newSheet, sheetName);
    XLSX.writeFile(newWorkbook, `${fileName}.xlsx`);
};