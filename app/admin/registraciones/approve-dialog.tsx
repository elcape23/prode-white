"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { approveRegistration } from "@/actions/admin/registrations";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

function buildWhatsAppUrl(phone: string, name: string, pin: string): string {
  const digits = phone.replace(/\D/g, "");
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const text = [
    `¡Hola ${name}! 🏆`,
    ``,
    `Tu inscripción al *Prode White* fue *aprobada* ✅`,
    ``,
    `Tu PIN de acceso es: *${pin}*`,
    ``,
    `Ingresá con tu teléfono y este PIN en:`,
    `👉 ${appUrl}/login`,
    ``,
    `¡Mucha suerte!`,
  ].join("\n");
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

export function ApproveDialog({
  participantId,
  participantName,
  participantPhone,
}: {
  participantId: string;
  participantName: string;
  participantPhone: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pin, setPin] = useState("");
  const [whatsappUrl, setWhatsappUrl] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleApprove = () => {
    startTransition(async () => {
      const result = await approveRegistration(participantId);
      if ("error" in result) {
        alert(result.error);
        return;
      }
      setPin(result.pin);
      setWhatsappUrl(buildWhatsAppUrl(participantPhone, participantName, result.pin));
      setOpen(true);
    });
  };

  const handleClose = () => {
    setOpen(false);
    router.refresh();
  };

  return (
    <>
      <Button
        size="sm"
        className="flex-1 bg-success hover:bg-success/90 text-success-foreground"
        disabled={isPending}
        onClick={handleApprove}
      >
        {isPending ? "Generando..." : "Aprobar"}
      </Button>

      <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>✅ {participantName} aprobado</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div className="bg-surface-raised border rounded-lg p-4 text-center">
              <p className="text-xs font-medium text-fg-success uppercase tracking-wide mb-1">
                PIN generado
              </p>
              <p className="text-3xl font-mono font-black text-fg-brand tracking-widest">
                {pin}
              </p>
            </div>

            <p className="text-sm text-muted-foreground text-center">
              Tocá el botón para abrir WhatsApp con el mensaje listo para enviar.
            </p>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-3 px-4 rounded-lg transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Notificar por WhatsApp
            </a>

            <Button variant="outline" className="w-full" onClick={handleClose}>
              Cerrar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
