"use client";

import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { datosUsuarios } from "@/data/usuarios"
import MedicamentosChart from "@/components/MedicamentosChart"

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex-1 flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold text-white drop-shadow-lg mb-8">
              Bienvenido a MedicappAdmin!
            </h1>
            <div className="w-full max-w-2xl bg-card p-4 rounded-lg shadow-lg">
              <MedicamentosChart datos={datosUsuarios} />
              <p className="mt-4 text-center text-white font-semibold text-lg">
                Medicamentos más usados
              </p>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}