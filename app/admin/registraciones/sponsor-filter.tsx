"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateParticipantSponsor } from "@/actions/admin/registrations";

export function SponsorSelect({
  participantId,
  currentSponsorCodeId,
  sponsors,
}: {
  participantId: string;
  currentSponsorCodeId: string | null;
  sponsors: { id: string; sponsorName: string; code: string }[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleChange(value: string) {
    startTransition(async () => {
      await updateParticipantSponsor(participantId, value || null);
      router.refresh();
    });
  }

  return (
    <select
      defaultValue={currentSponsorCodeId ?? ""}
      onChange={(e) => handleChange(e.target.value)}
      disabled={isPending}
      className="w-full border rounded-md px-2 py-1 text-sm bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:opacity-50"
    >
      <option value="">Sin sponsor</option>
      {sponsors.map((s) => (
        <option key={s.id} value={s.id}>
          {s.sponsorName} ({s.code})
        </option>
      ))}
    </select>
  );
}
