-- CreateTable
CREATE TABLE "Eta" (
    "id" SERIAL NOT NULL,
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "passportNumber" CHAR(8) NOT NULL,

    CONSTRAINT "Eta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Passport" (
    "passportNumber" CHAR(8) NOT NULL,
    "username" TEXT NOT NULL,
    "givenName" TEXT NOT NULL,
    "familyName" TEXT NOT NULL,
    "issuingAuthority" CHAR(3) NOT NULL,
    "nationality" TEXT NOT NULL,
    "expiryDate" DATE NOT NULL,
    "dateOfBirth" DATE NOT NULL,
    "placeOfBirth" TEXT NOT NULL,

    CONSTRAINT "Passport_pkey" PRIMARY KEY ("passportNumber")
);

-- CreateIndex
CREATE UNIQUE INDEX "Eta_passportNumber_key" ON "Eta"("passportNumber");

-- AddForeignKey
ALTER TABLE "Eta" ADD CONSTRAINT "Eta_passportNumber_fkey" FOREIGN KEY ("passportNumber") REFERENCES "Passport"("passportNumber") ON DELETE RESTRICT ON UPDATE CASCADE;
