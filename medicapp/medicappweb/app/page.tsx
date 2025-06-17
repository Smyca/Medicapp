"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ModeToggle } from "@/components/ui/mode-toggle";

export default function LoginPage() {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = localStorage.getItem("adminUser");
    if (user) {
      const { correo: savedCorreo, contrasena: savedContrasena } = JSON.parse(user);
      if (correo === savedCorreo && contrasena === savedContrasena) {
        router.push("/home");
      } else {
        setError("Correo o contraseña incorrectos");
      }
    } else {
      setError("No hay usuario registrado");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative">
      <div className="absolute top-4 right-4 z-10">
        <ModeToggle />
      </div>
      <Card className="w-full max-w-sm relative">
        <CardHeader>
          <CardTitle>Inicio de sesión</CardTitle>
          <CardDescription>
            Ingresa correo y contraseña para acceder a la página
          </CardDescription>
          <CardAction>
            <Button variant="link" onClick={() => router.push("/registro")}>Registrarse</Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={correo}
                  onChange={e => setCorreo(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Contraseña</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={contrasena}
                  onChange={e => setContrasena(e.target.value)}
                />
              </div>
              {error && <div className="text-red-500 text-sm">{error}</div>}
            </div>
            <CardFooter className="flex-col gap-2 mt-6 p-0">
              <Button type="submit" className="w-full">
                Ingresar
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}