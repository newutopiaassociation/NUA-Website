# Sandbox Development Workflow

This directory is your "test folder" for experimenting with changes without affecting the live site.

## How to use:

1.  **Edit Files**: Make all your changes to the files in this `sandbox/` folder (`index.html`, `style.css`, `script.js`).
2.  **Test**: Open `sandbox/index.html` in your browser to verify your work.
3.  **Release**: When you are happy with the changes and they meet your requirements, run the `deploy.ps1` script in the root directory.

### Commands to Deploy:
Open PowerShell in the project root and run:
```powershell
.\deploy.ps1
```

> [!IMPORTANT]
> Always test your changes in the sandbox before deploying to the root!
