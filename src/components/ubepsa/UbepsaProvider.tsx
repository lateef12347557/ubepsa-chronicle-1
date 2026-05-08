import { createContext, useContext, type ReactNode } from "react";
import { useUbepsaStore } from "@/lib/ubepsa-store";

const Ctx = createContext<ReturnType<typeof useUbepsaStore> | null>(null);

export function UbepsaProvider({ children }: { children: ReactNode }) {
  const store = useUbepsaStore();
  return <Ctx.Provider value={store}>{children}</Ctx.Provider>;
}

export function useUbepsa() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useUbepsa must be used inside UbepsaProvider");
  return c;
}
