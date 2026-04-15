CREATE TABLE "User" (
    "id"        TEXT        NOT NULL,
    "email"     TEXT        NOT NULL,
    "name"      TEXT        NOT NULL,
    "password"  TEXT        NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

CREATE TABLE "Product" (
    "id"          TEXT        NOT NULL,
    "name"        TEXT        NOT NULL,
    "description" TEXT        NOT NULL,
    "category"    TEXT        NOT NULL,
    "imageUrl"    TEXT,
    "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Review" (
    "id"        TEXT        NOT NULL,
    "rating"    INTEGER     NOT NULL,
    "title"     TEXT        NOT NULL,
    "body"      TEXT        NOT NULL,
    "userId"    TEXT        NOT NULL,
    "productId" TEXT        NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Review_userId_productId_key" ON "Review"("userId", "productId");

ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Review" ADD CONSTRAINT "Review_productId_fkey"
    FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
