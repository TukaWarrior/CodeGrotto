# Ensure winget is available
if (!(Get-Command winget -ErrorAction SilentlyContinue)) {
    Write-Host "Winget is not installed. Please install it first."
    exit
}

# winget install --id=Notepad++.Notepad++  -e

# List of applications to install
$apps = @(
    "Brave.Brave",
    "Notepad++.Notepad++",

    "Microsoft.VisualStudioCode",
    "Microsoft.VisualStudioCode.CLI",

    "Microsoft.VisualStudio.2022.Community",
    "JetBrains.IntelliJIDEA.Community",

    "Google.AndroidStudio",
    "ArduinoSA.IDE.stable",

    "Mozilla.Firefox",
    "Oracle.JDK.23",
    "OpenJS.NodeJS",



    "Valve.Steam",
    "EpicGames.EpicGamesLauncher",
    "ElectronicArts.EADesktop",
    "GOG.Galaxy",

    "TheDocumentFoundation.LibreOffice",
    # Affinity Photo 2
    "9P8DVF1XW02V", 
    # Affinity Designer 2
    "9N2D0P16C80H", 
    # Affinity Publisher 2
    "9NTV2DZ11KD9"


    # Add more applications here
)