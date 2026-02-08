-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_products" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "imageUrl" TEXT,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'active',
    "variants" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_products" ("category", "createdAt", "description", "id", "imageUrl", "name", "price", "status", "updatedAt", "variants") SELECT "category", "createdAt", "description", "id", "imageUrl", "name", "price", "status", "updatedAt", "variants" FROM "products";
DROP TABLE "products";
ALTER TABLE "new_products" RENAME TO "products";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
