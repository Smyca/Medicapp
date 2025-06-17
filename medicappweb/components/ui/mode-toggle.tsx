// components/mode-toggle.tsx
"use client"; // Importante: indica que este componente se renderiza en el cliente

import * as React from "react";
import { Moon, Sun } from "lucide-react"; // Para los íconos de sol y luna
import { useTheme } from "next-themes"; // Hook de next-themes para gestionar el tema

import { Button } from "@/components/ui/button"; // Componente Button de Shadcn UI
import { // Componentes Dropdown de Shadcn UI
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ModeToggle() {
  const { setTheme } = useTheme(); // Obtiene la función para establecer el tema

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          {/* Ícono de sol: visible en modo claro, se esconde y rota en modo oscuro */}
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          {/* Ícono de luna: se esconde y rota en modo claro, visible en modo oscuro */}
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span> {/* Texto para lectores de pantalla */}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {/* Opciones del menú para cambiar el tema */}
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Claro
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Oscuro
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          Sistema
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}