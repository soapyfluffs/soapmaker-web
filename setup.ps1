# Check if Node.js is installed
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Error "Node.js is not installed. Please install Node.js from https://nodejs.org/"
    exit 1
}

# Check if npm is installed
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Error "npm is not installed. Please install Node.js which includes npm."
    exit 1
}

Write-Host "Installing dependencies..." -ForegroundColor Green
npm install

Write-Host "Generating Prisma client..." -ForegroundColor Green
npx prisma generate

Write-Host "Creating database and running migrations..." -ForegroundColor Green
npx prisma migrate dev --name init

Write-Host "Setup complete!" -ForegroundColor Green
Write-Host @"

To start the development server:
    npm start

To launch Prisma Studio (database explorer):
    npx prisma studio

To run tests:
    npm test

To build for production:
    npm run build
"@