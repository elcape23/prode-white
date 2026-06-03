import { NextRequest, NextResponse } from "next/server";
import { validateSponsorCode } from "@/actions/registration";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code") ?? "";

  if (!code) {
    return NextResponse.json({ valid: false, reason: "Código vacío." });
  }

  const result = await validateSponsorCode(code);

  if (!result.valid) {
    return NextResponse.json({
      valid: false,
      reason: result.spotsLeft === 0 && result.sponsorName
        ? `Cupo completo para ${result.sponsorName}.`
        : "Código inválido.",
    });
  }

  return NextResponse.json(result);
}
