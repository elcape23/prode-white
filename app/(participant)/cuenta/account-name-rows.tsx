"use client";

import { useState } from "react";
import { PencilEdit02Icon } from "hugeicons-react";

import { EditNameModal } from "./edit-name-modal";

/**
 * Filas de Nombre y Apellido con su botón de edición.
 * Al tocar cualquiera de los lápices se abre el modal de edición.
 */
export function AccountNameRows({
  firstName,
  lastName,
}: {
  firstName: string;
  lastName: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex items-center gap-1 px-3 py-2">
        <p className="text-[13px] font-medium leading-4 text-fg-default">
          Nombre:
        </p>
        <p className="flex-1 text-[13px] leading-4 text-fg-secondary">
          {firstName}
        </p>
        <button
          type="button"
          aria-label="Editar nombre"
          onClick={() => setOpen(true)}
          className="text-fg-secondary transition-colors hover:text-fg-brand"
        >
          <PencilEdit02Icon className="size-5" />
        </button>
      </div>

      <div className="flex items-center gap-1 px-3 py-2">
        <p className="text-[13px] font-medium leading-4 text-fg-default">
          Apellido:
        </p>
        <p className="flex-1 text-[13px] leading-4 text-fg-secondary">
          {lastName}
        </p>
        <button
          type="button"
          aria-label="Editar apellido"
          onClick={() => setOpen(true)}
          className="text-fg-secondary transition-colors hover:text-fg-brand"
        >
          <PencilEdit02Icon className="size-5" />
        </button>
      </div>

      <EditNameModal
        open={open}
        onOpenChange={setOpen}
        initialFirstName={firstName === "—" ? "" : firstName}
        initialLastName={lastName === "—" ? "" : lastName}
      />
    </>
  );
}
