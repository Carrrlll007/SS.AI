scripts/README.md

This folder contains helper scripts to run `winget` non-interactively and avoid repeated agreement prompts.

Usage

1. Open PowerShell (recommended: open as Administrator only when you expect system-level installs).

2. Run the wrapper script to install a package (example: Node.js):

```powershell
# From the repository root
.\scripts\winget-install.ps1 -PackageId OpenJS.NodeJS
```

This script will:
- Add `--accept-source-agreements` and `--accept-package-agreements` to the `winget` command so you won't be asked to accept package/store terms interactively.
- Re-launch itself elevated (UAC) when necessary so installs that require administrative privileges succeed.

Optional: Add a convenience alias to your PowerShell profile

To avoid typing the full path every time, add an alias to your PowerShell profile (you will need to edit your profile manually or run the command below; it will open the profile file in Notepad if present or create it):

```powershell
notepad $PROFILE
```

Add a line like this to the profile file and save:

```powershell
function winget-install { param($pkg, [string[]]$args); & "${env:USERPROFILE}\\OneDrive\\Desktop\\Base44\\scripts\\winget-install.ps1" -PackageId $pkg -AdditionalArgs $args }
```

Replace the path above with the correct path to this repository if different.

Security notes

- You cannot completely bypass UAC for actions that need elevation without reducing system security. The script re-launches under elevation and will show a UAC prompt once per elevation request.
- Using `--accept-package-agreements` and `--accept-source-agreements` suppresses the interactive acceptance prompts from `winget` but does not remove UAC.

If you want, I can (1) run the script now to install a package (you will see a UAC prompt) or (2) add the alias to your PowerShell profile automatically (requires elevation to write profile in some setups). Which do you prefer?