"use server";

import prisma from "@/lib/prisma";
import {
  SPONSOR_CODES,
  GENERAL_PRICE,
  SPONSOR_PRICE,
  MAX_USES_PER_SPONSOR,
} from "@/lib/sponsor-codes";

export type RegistrationState =
  | { success: true; name: string; phone: string; price: number; paymentReference: string }
  | { error: string; field?: string }
  | undefined;

export async function submitRegistration(
  _state: RegistrationState,
  formData: FormData
): Promise<RegistrationState> {
  const name = (formData.get("name") as string)?.trim();
  const phone = (formData.get("phone") as string)?.trim();
  const sponsorCode = (formData.get("sponsorCode") as string)?.trim().toUpperCase();
  const paymentReference = (formData.get("paymentReference") as string)?.trim();

  if (!name) return { error: "El nombre es obligatorio.", field: "name" };
  if (!phone) return { error: "El teléfono es obligatorio.", field: "phone" };
  if (!paymentReference)
    return { error: "La referencia de pago es obligatoria.", field: "paymentReference" };

  // Check for duplicate phone
  const existing = await prisma.participant.findUnique({ where: { phone } });
  if (existing) {
    return { error: "Ese número de teléfono ya está registrado.", field: "phone" };
  }

  let sponsorCodeId: string | null = null;
  let pricePaid = GENERAL_PRICE;

  if (sponsorCode) {
    const codeDef = SPONSOR_CODES[sponsorCode];
    if (!codeDef) {
      return { error: "Código sponsor inválido.", field: "sponsorCode" };
    }

    const dbCode = await prisma.sponsorCode.findUnique({ where: { code: sponsorCode } });
    if (!dbCode || !dbCode.active) {
      return { error: "Código sponsor inválido.", field: "sponsorCode" };
    }

    // Count APPROVED + PENDING to prevent over-booking
    const usedCount = await prisma.participant.count({
      where: {
        sponsorCodeId: dbCode.id,
        status: { in: ["APPROVED", "PENDING"] },
      },
    });

    if (usedCount >= MAX_USES_PER_SPONSOR) {
      return {
        error: `El cupo del código ${sponsorCode} está completo (${MAX_USES_PER_SPONSOR}/${MAX_USES_PER_SPONSOR}).`,
        field: "sponsorCode",
      };
    }

    sponsorCodeId = dbCode.id;
    pricePaid = SPONSOR_PRICE;
  }

  await prisma.participant.create({
    data: {
      name,
      phone,
      paymentReference,
      sponsorCodeId,
      pricePaid,
      status: "PENDING",
    },
  });

  return { success: true, name, phone, price: pricePaid, paymentReference };
}

export async function validateSponsorCode(code: string): Promise<{
  valid: boolean;
  spotsLeft: number;
  sponsorName: string;
  price: number;
}> {
  const normalized = code.trim().toUpperCase();
  const codeDef = SPONSOR_CODES[normalized];

  if (!codeDef) {
    return { valid: false, spotsLeft: 0, sponsorName: "", price: GENERAL_PRICE };
  }

  const dbCode = await prisma.sponsorCode.findUnique({ where: { code: normalized } });
  if (!dbCode || !dbCode.active) {
    return { valid: false, spotsLeft: 0, sponsorName: "", price: GENERAL_PRICE };
  }

  const usedCount = await prisma.participant.count({
    where: {
      sponsorCodeId: dbCode.id,
      status: { in: ["APPROVED", "PENDING"] },
    },
  });

  const spotsLeft = Math.max(0, MAX_USES_PER_SPONSOR - usedCount);
  const valid = spotsLeft > 0;

  return {
    valid,
    spotsLeft,
    sponsorName: codeDef.sponsorName,
    price: valid ? SPONSOR_PRICE : GENERAL_PRICE,
  };
}
