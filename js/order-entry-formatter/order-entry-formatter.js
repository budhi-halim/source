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
//
// Set Default Date
const now = new Date();
const currentYear = now.getFullYear();
const currentMonth = ('0' + (now.getMonth() + 1)).slice(-2);
const currentDate = ('0' + now.getDate()).slice(-2);
const currentFullYear = `${currentYear}-01-01`;
const currentFullDate = `${currentYear}-${currentMonth}-${currentDate}`;

document.getElementById('start').value = currentFullYear;
document.getElementById('end').value = currentFullDate;

// Excel Table to JSON
function tableToJSON(sheetName) {
    
    // Get Sheet
    const table = sheetName;

    // Occupied Cells
    const cellNames = Object.keys(table);
    cellNames.shift();

    // Occupied Columns
    const occupiedColumns = []
    
    for (let i = 0; i < cellNames.length; i++) {
        let name = cellNames[i];
        name = name.slice(0, name.length - 1);

        if (occupiedColumns.includes(name)) {
            break;
        } else {
            occupiedColumns.push(name);
        };
    };

    // Occupied Rows
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

    // Object
    const tableObject = {};

    for (let i = 1; i < rowCount; i++) {
        tableObject['record-' + i] = {};

        for (let j = 0; j < occupiedColumns.length; j++) {
            const cellName = occupiedColumns[j] + (i + 1);
            let colName = occupiedColumns[j] + '1';
            colName = table[colName]['v'];

            let value = null;

            if (cellNames.includes(cellName)) {
                value = table[cellName]['v'];
            };

            tableObject['record-' + i][colName] = value;
        };
    };

    return tableObject;
};

// Read File
function format(event) {
    const data = event.target.result;
    const workbook = XLSX.read(data, {
        type: 'array',
    });

    // Get Sheets
    const orderEntry = workbook['Sheets']['Order Entry'];
    const priceList = workbook['Sheets']['Price List'];
    const productMaster = workbook['Sheets']['Product Master'];
    const custMaster = workbook['Sheets']['Cust Master'];

    const orderEntryObject = tableToJSON(orderEntry);
    const priceListObject = tableToJSON(priceList);
    const productMasterObject = tableToJSON(productMaster);
    const custMasterObject = tableToJSON(custMaster);

    // Date Value
    const start = Number(document.getElementById('start').value.replaceAll('-', ''));
    const end = Number(document.getElementById('end').value.replaceAll('-', ''));

    if (end < start) {
        document.getElementById('message').textContent = 'End date must be larger than start date.';
        throw 'Error: End date smaller than start date.'
    } else {
        // Filter by Date
        const orderEntryObjectFiltered = {};
        let recordNumber = 1;

        for (let i = 0; i < Object.keys(orderEntryObject).length; i++) {
            let recordDate = orderEntryObject['record-' + (i + 1)]['Tanggal Trx'];
            recordDate = new Date(Math.round((recordDate - 25569) * 86400 * 1000));
            const year = recordDate.getFullYear();
            const month = ('0' + (recordDate.getMonth() + 1)).slice(-2);
            const date = ('0' + recordDate.getDate()).slice(-2);
            recordDate = Number(`${year}${month}${date}`);

            if (recordDate >=start && recordDate <= end) {
                orderEntryObjectFiltered['record-' + recordNumber] = orderEntryObject['record-' + (i + 1)];
                recordNumber++;
            };
        };

        // Product List
        const productMasterKeys = Object.keys(productMasterObject);
        const productList = {};

        for (let i = 0; i < productMasterKeys.length; i++) {
            productList[productMasterObject[productMasterKeys[i]]['Kode Pemesanan']] = {};
            productList[productMasterObject[productMasterKeys[i]]['Kode Pemesanan']]['name'] = productMasterObject[productMasterKeys[i]]['Nama Product'];
            productList[productMasterObject[productMasterKeys[i]]['Kode Pemesanan']]['code'] = productMasterObject[productMasterKeys[i]]['Kode Product'];

            // COGS
            for (let j = 0; j < Object.keys(priceListObject).length; j++) {
                const row = 'record-' + (j + 1);
                const productName = priceListObject[row]['Nama Product'];

                if (productName === productMasterObject[productMasterKeys[i]]['Nama Product']) {
                    productList[productMasterObject[productMasterKeys[i]]['Kode Pemesanan']]['cogs'] = priceListObject[row]['COGS'];
                    break;
                };
            };
        };

        const transaction = [];
        let transactionNumber = 1;

        // Analysis
        const orderEntryKeys = Object.keys(orderEntryObjectFiltered);

        for (let i = 0; i < orderEntryKeys.length; i++) {
            const record = orderEntryObjectFiltered[orderEntryKeys[i]];
            const custName = record['Nama Customer'];
            let custCode = null;
            console.log(custMasterObject);

            for (let j = 0; j < Object.keys(custMasterObject).length; j++) {
                const name = custMasterObject['record-' + (j + 1)]['Nama Cust'];
                console.log(name);

                if (name === custName) {
                    custCode = custMasterObject['record-' + (j + 1)]['Kode Cust'];
                    break;
                };
            };
            console.log(custCode);
            for (let j = 0; j < Object.keys(productList).length; j++) {
                const productCode = Object.keys(productList)[j];
                const amount = record[productCode];

                if (amount > 0) {
                    // PL-Prod Code
                    const priceListProductCode = record['Kode Harga'] + productList[productCode]['code'];

                    // Price
                    let price = null;

                    if (record['Type Trx'] === 'REG' || record['Type Trx'] === 'CSR') {
                        for (let k = 0; k < Object.keys(priceListObject).length; k++) {
                            const identifier = priceListObject['record-' + (k + 1)]['Kode PL-Prod'];
        
                            if (identifier === priceListProductCode) {
                                price = priceListObject['record-' + (k + 1)]['Harga'];
                                break;
                            };
                        };
                    } else {
                        price = 0;
                    }
                    
                    const totalPrice = amount * price;

                    // Table Construction
                    const jsonTable = {};

                    jsonTable['No'] = transactionNumber;
                    jsonTable['Tanggal Trx'] = record['Tanggal Trx'];
                    jsonTable['Kode Customer'] = custCode;
                    jsonTable['Nama Customer'] = custName;
                    jsonTable['Type Trx'] = record['Type Trx'];
                    jsonTable['Kode Product'] = productList[productCode]['code'];;
                    jsonTable['Nama Product'] = productList[productCode]['name'];
                    jsonTable['Jumlah'] = amount;
                    jsonTable['Dipesan oleh'] = record['Dipesan oleh'];
                    jsonTable['Harga Jual'] = price;
                    jsonTable['Total Sales'] = totalPrice;
                    jsonTable['Kode PL'] = record['Kode Harga'];
                    jsonTable['Kode PL-Prod'] = priceListProductCode;
                    jsonTable['COGS'] = productList[productCode]['cogs'];
                    jsonTable['Keterangan'] = record['Keterangan'];

                    transaction.push(jsonTable);

                    transactionNumber++;
                };
            };
        };
        
        // Save Excel File
        const now = new Date();
        const date = now.getDate();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();
        const fullDate = `${date}-${month}-${year}`;
        
        const newSheet = XLSX.utils.json_to_sheet(transaction);
        const newWorkbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(newWorkbook, newSheet, 'Transaction');
        XLSX.writeFile(newWorkbook, `Transaction Data ${fullDate}.xlsx`);
    };
};

// File Upload
let fileName = null;
const boxContent = document.getElementById('box-content');

const fileUpload = document.getElementById('file-upload');
fileUpload.addEventListener('change', function(event) {
    selectedFile = event.target.files[0];
    showFileName(selectedFile);
});

// Drag and Drop File Upload
const dropArea = document.getElementById('drop-area');

function active() {
    dropArea.classList.add('drop-area-highlight');
    boxContent.textContent = '+';
    dropArea.classList.remove('drop-area-file-name');
};

function inactive() {
    dropArea.classList.remove('drop-area-highlight');
};

function prevents(e) {
    e.preventDefault();
}

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(function(eventName) {
    dropArea.addEventListener(eventName, prevents);
});

['dragenter', 'dragover'].forEach(function(eventName) {
    dropArea.addEventListener(eventName, active);
});

dropArea.addEventListener('dragleave', function(event) {
    if (!dropArea.contains(event.relatedTarget)) {
        dropArea.classList.remove('drop-area-highlight');
        inactive();
        showFileName(selectedFile);
    };
});

dropArea.addEventListener('drop', function(event) {
    inactive();
    selectedFile = event.dataTransfer.files[0];
    showFileName(selectedFile);
});

function showFileName(file) {
    fileName = file['name'];
    const fileExtension = fileName.split('.').pop();
    dropArea.classList.add('drop-area-file-name');
    if (fileExtension === 'xlsx') {
        boxContent.textContent = fileName;
    } else {
        boxContent.textContent = 'Unsupported file type';
        throw 'Error: Unsupported file type.';
    };
};

// File Processing
document.getElementById('submit').addEventListener('click', function() {
    if (selectedFile) {
        document.getElementById('message').textContent = 'Please wait ...';
        const fileReader = new FileReader();
        fileReader.readAsArrayBuffer(selectedFile);
        fileReader.onload = format;
        document.getElementById('message').textContent = 'Done!';
    };
});