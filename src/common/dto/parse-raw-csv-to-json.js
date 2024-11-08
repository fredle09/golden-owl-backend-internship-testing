const csv = require('csvtojson');
const fs = require('fs');

// Path to your CSV file
const csvFilePath = './diem_thi_thpt_2024.csv';  // Replace with your actual CSV file path
const jsonFilePath = './output.json'; // Path to save the JSON output file

// Define the column rename mapping
const columnMapping = {
  sbd: 'studentId',
  toan: 'math',
  ngu_van: 'literature',
  ngoai_ngu: 'foreignLanguage',
  vat_li: 'physics',
  hoa_hoc: 'chemistry',
  sinh_hoc: 'biology',
  lich_su: 'history',
  dia_li: 'geography',
  gdcd: 'civics',
  ma_ngoai_ngu: 'foreignCode'
};

// Function to parse CSV, rename columns, and save as JSON
async function parseAndRenameCsv() {
  try {
    // Read the CSV file and convert it to JSON
    const jsonArray = await csv().fromFile(csvFilePath);

    // Rename the columns and parse scores into numbers
    const renamedData = jsonArray.map((row) => {
      const renamedRow = {};

      for (const key in row) {
        if (row.hasOwnProperty(key)) {
          // Get the new key using the column mapping, or use the original key
          const newKey = columnMapping[key] || key;

          // Check if the key is a score-related field and convert it to a number (or null if empty)
          if (['toan', 'ngu_van', 'ngoai_ngu', 'vat_li', 'hoa_hoc', 'sinh_hoc', 'lich_su', 'dia_li', 'gdcd'].includes(key)) {
            renamedRow[newKey] = row[key] === "" ? null : Number(row[key]);
          } else {
            renamedRow[newKey] = row[key];
          }
        }
      }

      return renamedRow;
    });

    // Write the renamed JSON data to a file
    fs.writeFileSync(jsonFilePath, JSON.stringify(renamedData, null, 2));

    console.log(`CSV has been successfully parsed and saved as JSON! Output saved to ${jsonFilePath}`);
  } catch (err) {
    console.error('Error parsing CSV and renaming columns:', err);
  }
}

// Call the function to parse and rename the CSV
parseAndRenameCsv();
