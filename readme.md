# TidyRows

**TidyRows** (tinyrows.com) is a lightweight, single-page web application designed to quickly format raw spreadsheet data into a clean, readable structure. Paste your tab-separated data (e.g., from Google Sheets or Excel), customize the formatting options, and copy the result as plain text, Markdown, or HTML. Perfect for transforming messy client data into polished outputs for tools like Google Docs, ClickUp, or anywhere else you need structured text.

Built by [Wes Foster](https://wesfoster.com).

## Features

- **Instant Formatting**: Paste spreadsheet data (Ctrl+V) and see it formatted instantly—no buttons required.
- **Customizable Options**:
  - **Separator**: Define the separator between keys and values (default: `: `).
  - **Same Line**: Toggle whether keys and values appear on the same line or separate lines (default: separate).
  - **Rows to Format**: Choose to format the last row only or all rows (default: last row).
- **Multiple Output Formats**:
  - **Plain Text**: Simple, unstyled text with newlines.
  - **Markdown**: Bold keys with Markdown syntax (e.g., `**Key**: Value`).
  - **HTML**: Formatted with bold keys (`<b>Key</b>`) and `<br>` for line breaks, ideal for rich text editors.
- **Clean Design**: Minimalist interface with a fixed top menu, centered content, and a fixed footer.
- **Mobile-Friendly**: Responsive layout adjusts for smaller screens.
- **No Dependencies**: Runs entirely client-side with vanilla HTML, CSS, and JavaScript.

## Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/tidyrows.git
