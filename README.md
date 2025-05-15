# SoapMaker Web Application

A comprehensive soap making management solution that helps you manage recipes, track production batches, and handle inventory.

## Features

- Recipe Management
  - Create and manage soap recipes
  - Automatic lye and water calculations
  - Cost calculation
  - Multiple oils and ingredients support

- Material Management
  - Track materials inventory
  - Cost tracking
  - Multiple unit support
  - SAP value database

- Product Management
  - Link products to recipes
  - Cost and pricing management
  - SKU tracking
  - Shopify integration

- Batch Production
  - Track production batches
  - Quality control checks
  - Document attachments
  - Cost tracking
  - Status management

- Export and Print
  - PDF generation for recipes
  - Print-friendly views
  - Batch history export
  - CSV export support

## Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)
- SQLite3

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/soapmaker-web.git
   cd soapmaker-web
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the database:

   PowerShell:
   ```powershell
   npx prisma generate
   npx prisma migrate dev --name init
   ```

   Optional: Launch Prisma Studio to explore the database:
   ```powershell
   npx prisma studio
   ```

4. Start the development server:
   ```powershell
   npm start
   ```

The application will be available at http://localhost:3000

## Shopify Integration

To integrate with Shopify:

1. Create a custom app in your Shopify admin
2. Generate an access token with the following permissions:
   - read_products
   - write_products
   - read_inventory
   - write_inventory

3. In the application settings:
   - Enter your Shopify domain (your-store.myshopify.com)
   - Enter the access token

## Testing

Run the test suite:
```bash
npm test
```

Run tests with coverage:
```bash
npm test -- --coverage
```

## Building for Production

Build the application:
```bash
npm run build
```

The build artifacts will be in the `build` directory.

## Data Export

The application supports several export formats:

- PDF: Recipes and batch details
- CSV: Batch history and production records
- JSON: Complete data export

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.