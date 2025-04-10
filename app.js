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
const pasteShortcut = document.getElementById('paste-shortcut');
const helpPasteShortcut = document.getElementById('help-paste-shortcut');
const helpToggle = document.getElementById('help-toggle');
const helpSection = document.getElementById('help-section');
const formattedWindow = document.getElementById('formatted-window');
const formattedData = document.getElementById('formatted-data');
const copyPlainBtn = document.getElementById('copy-plain');
const copyMarkdownBtn = document.getElementById('copy-markdown');
const copyHtmlBtn = document.getElementById('copy-html');
const copyFormattedBtn = document.getElementById('copy-formatted');
const resetBtn = document.getElementById('reset');

// Variables to store parsed data and formatted outputs
let headers = [];
let dataRows = [];
let plainText = '';
let markdownText = '';
let htmlText = '';

// Detect if the user is on a Mac and update the paste shortcut text
function updatePasteShortcut() {
  const isMac = /Mac|iPhone|iPad|iPod/i.test(navigator.platform) || /Mac|iPhone|iPad|iPod/i.test(navigator.userAgent);
  const shortcutText = isMac ? 'Cmd+V' : 'Ctrl+V';
  pasteShortcut.textContent = shortcutText;
  helpPasteShortcut.textContent = shortcutText;
}

// Toggle the help section
function toggleHelpSection() {
  helpSection.classList.toggle('open');
}

// Run on page load
updatePasteShortcut();
helpToggle.addEventListener('click', toggleHelpSection);

// Capture paste event anywhere on the page
document.body.addEventListener('paste', (event) => {
  event.preventDefault();
  const pastedData = event.clipboardData.getData('text').trim();
  parseAndFormat(pastedData);
});

// Parse pasted data and format it
function parseAndFormat(data) {
  const rows = [];
  let currentRow = '';
  let inQuotes = false;

  for (let i = 0; i < data.length; i++) {
    const char = data[i];
    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
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
  if (currentRow.trim() !== '') {
    rows.push(currentRow);
  }

  if (rows.length < 1) {
    alert('No data pasted');
    return;
  }

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
    cells.push(currentCell);
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
    rows = [dataRows[dataRows.length - 1]];
  } else if (rowsToFormat === 'all') {
    rows = dataRows;
  }

  htmlText = rows.map(row => {
    return headers
      .map((header, index) => {
        const value = row[index] || '';
        if (value.trim() === '') return '';
        const formattedValue = value.replace(/\n/g, '<br>');
        return `
          <div class="key-value-pair">
            <strong>${header}</strong>
            ${sameLine ? `${separator}${formattedValue}` : `<br>${formattedValue}`}
          </div>
        `;
      })
      .filter(line => line !== '')
      .join('');
  }).join('<hr>');

  plainText = rows.map(row => {
    return headers
      .map((header, index) => {
        const value = row[index] || '';
        if (value.trim() === '') return '';
        return sameLine ? `${header}${separator}${value}` : `${header}\n${value}`;
      })
      .filter(line => line !== '')
      .join('\n\n');
  }).join('\n---\n');

  markdownText = rows.map(row => {
    return headers
      .map((header, index) => {
        const value = row[index] || '';
        if (value.trim() === '') return '';
        return sameLine ? `**${header}**${separator}${value}` : `**${header}**\n${value}`;
      })
      .filter(line => line !== '')
      .join('\n\n');
  }).join('\n---\n');

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

// Copy text to clipboard with feedback (for plain text, markdown, HTML)
function copyTextToClipboard(text, button) {
  const originalText = button.textContent;
  navigator.clipboard.writeText(text).then(() => {
    button.textContent = 'Copied!';
    setTimeout(() => {
      button.textContent = originalText;
    }, 1000);
  });
}

// Copy formatted content with rich text formatting
function copyFormattedToClipboard(button) {
  const originalText = button.textContent;
  const htmlContent = formattedData.innerHTML;
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const data = [new ClipboardItem({ 'text/html': blob })];
  navigator.clipboard.write(data).then(() => {
    button.textContent = 'Copied!';
    setTimeout(() => {
      button.textContent = originalText;
    }, 1000);
  }).catch(err => {
    console.error('Failed to copy formatted content: ', err);
    alert('Failed to copy formatted content. Please copy manually.');
  });
}

// Copy button event listeners
copyPlainBtn.addEventListener('click', () => {
  copyTextToClipboard(plainText, copyPlainBtn);
});

copyMarkdownBtn.addEventListener('click', () => {
  copyTextToClipboard(markdownText, copyMarkdownBtn);
});

copyHtmlBtn.addEventListener('click', () => {
  copyTextToClipboard(htmlText, copyHtmlBtn);
});

copyFormattedBtn.addEventListener('click', () => {
  copyFormattedToClipboard(copyFormattedBtn);
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