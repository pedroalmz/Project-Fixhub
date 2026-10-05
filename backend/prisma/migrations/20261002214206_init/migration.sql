-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('ABERTO', 'DIAGNOSTICO', 'ORCAMENTO', 'AGUARDANDO_APROVACAO', 'MANUTENCAO', 'FINALIZADO');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('BAIXA', 'NORMAL', 'ALTA');

-- CreateEnum
CREATE TYPE "ServiceMode" AS ENUM ('PRESENCIAL', 'REMOTO');

-- CreateTable
CREATE TABLE "tickets" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "TicketStatus" NOT NULL DEFAULT 'ABERTO',
    "priority" "Priority" NOT NULL DEFAULT 'NORMAL',
    "mode" "ServiceMode" NOT NULL DEFAULT 'PRESENCIAL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tickets_pkey" PRIMARY KEY ("id")
);
