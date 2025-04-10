/*
  App Name: TidyRows
  Author: Wes Foster
  Author URL: https://wesfoster.com
*/

// Get DOM elements
const separatorInput = document.getElementById('separator');
const sameLineCheckbox = document.getElementById('same-line');
const rowsToFormatSelect = document.getElementById('rows-to-format');
const instructions = document.getElementById('instructions');
const formattedWindow = document.getElementById('formatted-window');
const formattedData = document.getElementById('formatted-data');
const copyPlainBtn = document.getElementById('copy-plain');
const copyMarkdownBtn = document.getElementById('copy-markdown');
const copyFormattedBtn = document.getElementById('copy-formatted');
const resetBtn = document.getElementById('reset');

// Variables to store parsed data and formatted outputs
let headers = [];
let dataRows = [];
let plainText = '';
let markdownText = '';
let htmlText = '';

// Capture paste event anywhere on the page
document.body.addEventListener('paste', (event) => {
  event.preventDefault();
  const pastedData = event.clipboardData.getData('text').trim();
  parseAndFormat(pastedData);
});

// Parse pasted data and format it
function parseAndFormat(data) {
  // Split into rows, preserving newlines within cells by handling tab-separated data
  const rows = [];
  let currentRow = '';
  let inQuotes = false;

  // Iterate through each character to handle quoted fields with newlines
  for (let i = 0; i < data.length; i++) {
    const char = data[i];
    if (char === '"') {
      inQuotes = !inQuotes; // Toggle quote state
      continue; // Skip the quote character itself
    }
    if (char === '\n' && !inQuotes) {
      if (currentRow.trim() !== '') {
        rows.push(currentRow);
      }
      currentRow = '';
    } else {
      currentRow += char;
    }
  }
  // Add the last row if it’s not empty
  if (currentRow.trim() !== '') {
    rows.push(currentRow);
  }

  if (rows.length < 1) {
    alert('No data pasted');
    return;
  }

  // Split rows into headers and data, assuming tab-separated values
  headers = rows[0].split('\t');
  dataRows = rows.slice(1).map(row => {
    const cells = [];
    let currentCell = '';
    inQuotes = false;
    for (let i = 0; i < row.length; i++) {
      const char = row[i];
      if (char === '"') {
        inQuotes = !inQuotes;
        continue;
      }
      if (char === '\t' && !inQuotes) {
        cells.push(currentCell);
        currentCell = '';
      } else {
        currentCell += char;
      }
    }
    cells.push(currentCell); // Add the last cell
    return cells;
  });

  if (dataRows.length === 0) {
    alert('No data rows found');
    return;
  }

  formatData();
  showFormattedWindow();
}

// Format data based on current options
function formatData() {
  const separator = separatorInput.value;
  const sameLine = sameLineCheckbox.checked;
  const rowsToFormat = rowsToFormatSelect.value;

  let rows = [];
  if (rowsToFormat === 'last' && dataRows.length > 0) {
    rows = [dataRows[dataRows.length - 1]]; // Last row only
  } else if (rowsToFormat === 'all') {
    rows = dataRows; // All rows
  }

  // Generate HTML format
  htmlText = rows.map(row => {
    return headers
      .map((header, index) => {
        const value = row[index] || '';
        if (value.trim() === '') return ''; // Skip empty or whitespace-only values
        const formattedValue = value.replace(/\n/g, '<br>'); // Preserve newlines in HTML
        return sameLine ? `<b>${header}</b>${separator}${formattedValue}` : `<b>${header}</b><br>${formattedValue}`;
      })
      .filter(line => line !== '') // Remove empty lines
      .join('<br><br>'); // Join non-empty lines with double break
  }).join('<hr>');

  // Generate plain text format
  plainText = rows.map(row => {
    return headers
      .map((header, index) => {
        const value = row[index] || '';
        if (value.trim() === '') return ''; // Skip empty or whitespace-only values
        return sameLine ? `${header}${separator}${value}` : `${header}\n${value}`;
      })
      .filter(line => line !== '') // Remove empty lines
      .join('\n\n'); // Join non-empty lines with double newline
  }).join('\n---\n');

  // Generate markdown format
  markdownText = rows.map(row => {
    return headers
      .map((header, index) => {
        const value = row[index] || '';
        if (value.trim() === '') return ''; // Skip empty or whitespace-only values
        return sameLine ? `**${header}**${separator}${value}` : `**${header}**\n${value}`;
      })
      .filter(line => line !== '') // Remove empty lines
      .join('\n\n'); // Join non-empty lines with double newline
  }).join('\n---\n');

  // Display HTML in the formatted window
  formattedData.innerHTML = htmlText;
}

// Show the formatted window and buttons
function showFormattedWindow() {
  instructions.style.display = 'none';
  formattedWindow.style.display = 'block';
  document.querySelector('.buttons').style.display = 'flex';
}

// Update formatted data when options change
separatorInput.addEventListener('input', formatData);
sameLineCheckbox.addEventListener('change', formatData);
rowsToFormatSelect.addEventListener('change', formatData);

// Copy text to clipboard with feedback
function copyToClipboard(text, button) {
  const originalText = button.textContent;
  navigator.clipboard.writeText(text).then(() => {
    button.textContent = 'Copied!';
    setTimeout(() => {
      button.textContent = originalText;
    }, 1000);
  });
}

// Copy button event listeners
copyPlainBtn.addEventListener('click', () => {
  copyToClipboard(plainText, copyPlainBtn);
});

copyMarkdownBtn.addEventListener('click', () => {
  copyToClipboard(markdownText, copyMarkdownBtn);
});

copyFormattedBtn.addEventListener('click', () => {
  copyToClipboard(htmlText, copyFormattedBtn);
});

// Reset the application
resetBtn.addEventListener('click', () => {
  headers = [];
  dataRows = [];
  plainText = '';
  markdownText = '';
  htmlText = '';
  formattedData.innerHTML = '';
  formattedWindow.style.display = 'none';
  document.querySelector('.buttons').style.display = 'none';
  instructions.style.display = 'block';
});