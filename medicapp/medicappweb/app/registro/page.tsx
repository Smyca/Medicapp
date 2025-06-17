"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function RegistroPage() {
  const [correo, setCorreo] = useState("")
  const [contrasena, setContrasena] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const users = JSON.parse(localStorage.getItem("adminUsers") || "[]")
    const exists = users.some((user: { correo: string }) => user.correo === correo)
    if (exists) {
      setError("Este correo ya está registrado.")
      return
    }
    users.push({ correo, contrasena })
    localStorage.setItem("adminUsers", JSON.stringify(users))
    localStorage.setItem("adminUser", JSON.stringify({ correo, contrasena }))
    router.push("/")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Registro Admin</CardTitle>
          <CardDescription>Completa los datos para registrarse como administrador</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="correo">Correo electrónico</Label>
              <Input
                id="correo"
                name="correo"
                type="email"
                required
                value={correo}
                onChange={e => {
                  setCorreo(e.target.value)
                  setError("")
                }}
              />
            </div>
            <div>
              <Label htmlFor="contrasena">Contraseña</Label>
              <Input
                id="contrasena"
                name="contrasena"
                type="password"
                required
                value={contrasena}
                onChange={e => {
                  setContrasena(e.target.value)
                  setError("")
                }}
              />
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <Button type="submit" className="w-full">Registrar</Button>
          </form>
        </CardContent>
        <CardFooter />
      </Card>
    </div>
  )
}