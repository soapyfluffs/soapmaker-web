-- CreateTable
CREATE TABLE "Material" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "sapValue" REAL,
    "cost" REAL NOT NULL,
    "unit" TEXT NOT NULL,
    "alternativeUnits" TEXT,
    "conversionRates" TEXT,
    "stock" REAL NOT NULL,
    "supplier" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Recipe" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "waterRatio" REAL NOT NULL,
    "superFat" REAL NOT NULL,
    "instructions" TEXT,
    "yield" INTEGER NOT NULL,
    "totalWeight" REAL NOT NULL,
    "laborTime" INTEGER NOT NULL,
    "laborCost" REAL NOT NULL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "RecipeOil" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "recipeId" INTEGER NOT NULL,
    "materialId" INTEGER NOT NULL,
    "weight" REAL NOT NULL,
    CONSTRAINT "RecipeOil_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "RecipeOil_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "weight" REAL NOT NULL,
    "price" REAL NOT NULL,
    "cost" REAL NOT NULL,
    "sku" TEXT NOT NULL,
    "shopifyId" TEXT,
    "recipeId" INTEGER,
    "status" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Product_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Batch" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "batchNumber" TEXT NOT NULL,
    "recipeId" INTEGER NOT NULL,
    "startDate" DATETIME NOT NULL,
    "status" TEXT NOT NULL,
    "yield" INTEGER NOT NULL,
    "actualCost" REAL NOT NULL,
    "laborHours" REAL NOT NULL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Batch_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "QualityCheck" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "batchId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "QualityCheck_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "Batch" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Document" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "batchId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Document_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "Batch" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Settings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "defaultWeightUnit" TEXT NOT NULL DEFAULT 'g',
    "defaultCurrency" TEXT NOT NULL DEFAULT 'USD',
    "laborCostPerHour" REAL NOT NULL DEFAULT 15,
    "defaultSuperFat" REAL NOT NULL DEFAULT 5,
    "defaultWaterRatio" REAL NOT NULL DEFAULT 38,
    "shopifyDomain" TEXT,
    "shopifyAccessToken" TEXT,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_sku_key" ON "Product"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "Product_shopifyId_key" ON "Product"("shopifyId");

-- CreateIndex
CREATE UNIQUE INDEX "Batch_batchNumber_key" ON "Batch"("batchNumber");
