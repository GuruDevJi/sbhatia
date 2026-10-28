# Getting Started & Installation Notes

This guide outlines the tools, dependencies, and plugins required when setting up this project (`sb1`) from scratch on a fresh **Google Antigravity** installation.

---

## 1. System Prerequisites & Runtimes

### Node.js (Required)
The project is built with **Eleventy (11ty) v3.x**, which runs on Node.js.

  - **Installer**: Download from [nodejs.org](https://nodejs.org/).
  - **Version check**:
    ```powershell
    node -v
    npm -v
    ```

### Git (Required)
Required for source control and GitHub deployment workflows.
- **Windows (winget)**:
  ```powershell
  winget install Git.Git
  ```
- **Version check**:
  ```powershell
  git --version
  ```

---

## 2. Recommended Antigravity Plugins & Skills

When configuring Antigravity, the following agent plugins from the Agent Marketplace enhance web development:

| Plugin / Tool | Catalog ID | Description |
| :--- | :--- | :--- |
| **Modern Web Guidance** | `antigravity-plugins-official/plugin/modern-web-guidance-plugin` | Keeps the coding agent aligned with modern HTML, CSS, and JS web standards and accessibility patterns. |
| **Chrome DevTools** | `antigravity-plugins-official/plugin/chrome-devtools-plugin` | Browser automation, visual inspection, and live debugging via Chrome DevTools and Puppeteer. |
| **Google Developer Knowledge** | `antigravity-plugins-official/plugin/google-developer-knowledge` | Quick retrieval of official web and developer documentation. |

---

## 3. Recommended Editor Extensions

To get syntax highlighting, auto-formatting, and linting in the editor for this codebase:

1. **Nunjucks Support**:
   - *Extension*: `ronnidc.nunjucks` or `monosans.nunjucks`
   - *Purpose*: All pages and layouts in `src/` use `.njk` (Nunjucks) templating syntax.
2. **Prettier - Code Formatter**:
   - *Extension*: `esbenp.prettier-vscode`
   - *Purpose*: Standard code formatting across HTML, Nunjucks, CSS (`src/assets/css/`), JavaScript, and JSON data files (`src/_data/`).
3. **ESLint**:
   - *Extension*: `dbaeumer.vscode-eslint`
   - *Purpose*: Linting for scripts and frontend JavaScript.

---

## 4. Project Setup & Quickstart

Once Node.js and Git are installed, follow these steps to bootstrap the project:

### Step 1: Clone or Open the Repository
```powershell
cd "c:\Users\Sorabius\OneDrive\Project 2025\Website\sbhatia\sb1"
```

### Step 2: Install Project Dependencies
Run `npm install` to install Eleventy and utility packages:
```powershell
npm install
```

### Step 3: Run Development Server
Start the local Eleventy development server with hot reload:
```powershell
npm run serve
```
- Open `http://localhost:8080` in your browser.
- Any edits made inside `src/` will trigger an automatic incremental rebuild.

### Step 4: Build for Production
To generate a static build ready for deployment:
```powershell
npm run build
```
- The production output is compiled into the `_site/` directory.

---

## 5. Troubleshooting (Windows PowerShell)

### "npm.ps1 cannot be loaded because running scripts is disabled"
Windows PowerShell blocks script execution by default. To fix this permanently for your user account:
```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```
*(Press `Y` when prompted)*

Alternatively, you can bypass the script wrapper directly by typing `.cmd`:
```powershell
npm.cmd run build
npm.cmd run serve
```

---

## 6. Helpful Project References

- **Configuration**: [`.eleventy.js`](file:///c:/Users/Sorabius/OneDrive/Project%202025/Website/sbhatia/sb1/.eleventy.js)
- **Project Structure**: [`fileStructure.md`](file:///c:/Users/Sorabius/OneDrive/Project%202025/Website/sbhatia/sb1/fileStructure.md)
- **Source Templates**: [`src/`](file:///c:/Users/Sorabius/OneDrive/Project%202025/Website/sbhatia/sb1/src)
- **Data Files**: [`src/_data/`](file:///c:/Users/Sorabius/OneDrive/Project%202025/Website/sbhatia/sb1/src/_data)
- **Copilot / Assistant Instructions**: [`.github/copilot-instructions.md`](file:///c:/Users/Sorabius/OneDrive/Project%202025/Website/sbhatia/sb1/.github/copilot-instructions.md)

