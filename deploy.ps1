# Deploy changes from sandbox to production
Copy-Item -Path "sandbox\index.html" -Destination "index.html" -Force
Copy-Item -Path "sandbox\style.css" -Destination "style.css" -Force
Copy-Item -Path "sandbox\script.js" -Destination "script.js" -Force
Copy-Item -Path "sandbox\assets\*" -Destination "assets\" -Recurse -Force

Write-Host "Deployment complete! Changes moved from sandbox to production." -ForegroundColor Green
