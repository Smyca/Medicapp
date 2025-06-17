"use client";

import React, { useState } from "react";
import { AppSidebar } from "@/components/app-sidebar3";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";


interface UserData {
  nombre: string;
  correo: string;
  contrasena: string;
  rut: string;
}

const datosInicialesCompletos: UserData[] = [
  {
    nombre: "Juan Pérez",
    correo: "juan@example.com",
    contrasena: "123456",
    rut: "11.111.111-1",
  },
  {
    nombre: "Ana Gómez",
    correo: "ana@example.com",
    contrasena: "abcdef",
    rut: "22.222.222-2",
  },
  {
    nombre: "Carlos Ruiz",
    correo: "carlos@example.com",
    contrasena: "qwerty",
    rut: "33.333.333-3",
  },
  {
    nombre: "María López",
    correo: "maria@example.com",
    contrasena: "maria123",
    rut: "44.444.444-4",
  },
  {
    nombre: "Pedro Sánchez",
    correo: "pedro@example.com",
    contrasena: "pedro456",
    rut: "55.555.555-5",
  },
  {
    nombre: "Lucía Torres",
    correo: "lucia@example.com",
    contrasena: "lucia789",
    rut: "66.666.666-6",
  },
  {
    nombre: "Miguel Díaz",
    correo: "miguel@example.com",
    contrasena: "miguel321",
    rut: "77.777.777-7",
  },
  {
    nombre: "Sofía Ramírez",
    correo: "sofia@example.com",
    contrasena: "sofia654",
    rut: "88.888.888-8",
  },
  {
    nombre: "Diego Herrera",
    correo: "diego@example.com",
    contrasena: "diego987",
    rut: "99.999.999-9",
  },
  {
    nombre: "Valentina Castro",
    correo: "valentina@example.com",
    contrasena: "valen123",
    rut: "10.101.010-1",
  },
  {
    nombre: "Andrés Molina",
    correo: "andres@example.com",
    contrasena: "andres456",
    rut: "12.121.212-1",
  },
];

export default function CycPage() {
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroCorreo, setFiltroCorreo] = useState("");
  const [filtroRut, setFiltroRut] = useState("");

  const [datos, setDatos] = useState<UserData[]>(datosInicialesCompletos);

  const [seleccionados, setSeleccionados] = useState<string[]>([]);

  const datosFiltrados = () => {
    return datos.filter(
      (dato) =>
        dato.nombre.toLowerCase().includes(filtroNombre.toLowerCase()) &&
        dato.correo.toLowerCase().includes(filtroCorreo.toLowerCase()) &&
        dato.rut.toLowerCase().includes(filtroRut.toLowerCase())
    );
  };
  const todosSeleccionados =
    datosFiltrados().length > 0 &&
    datosFiltrados().every((d) => seleccionados.includes(d.correo));

  const [showMailModal, setShowMailModal] = useState(false);
  const [mailMessage, setMailMessage] = useState(
    "Hola, este es un mensaje para el usuario."
  );
  const [mailEdit, setMailEdit] = useState(false);

  const handleDelete = (correo: string) => {
    if (window.confirm("¿Estás seguro de que deseas borrar esta cuenta?")) {
      setDatos(datos.filter((dato) => dato.correo !== correo));
      setSeleccionados(seleccionados.filter((c) => c !== correo));
    }
  };

  const handleSelect = (correo: string) => {
    setSeleccionados((prev) =>
      prev.includes(correo)
        ? prev.filter((c) => c !== correo)
        : [...prev, correo]
    );
  };

  const handleSelectAll = () => {
    if (todosSeleccionados) {
      setSeleccionados(
        seleccionados.filter((correo) =>
          !datosFiltrados().some((d) => d.correo === correo)
        )
      );
    } else {
      setSeleccionados([
        ...seleccionados,
        ...datosFiltrados()
          .map((d) => d.correo)
          .filter((correo) => !seleccionados.includes(correo)),
      ]);
    }
  };

  const handleSendMail = () => {
    if (seleccionados.length === 0) {
      alert("Selecciona al menos un usuario.");
      return;
    }
    setShowMailModal(true);
    setMailEdit(false);
  };

  const handleSendMailFinal = () => {
    alert(`Correo enviado a: ${seleccionados.join(", ")} con el mensaje: "${mailMessage}"`);
    setShowMailModal(false);
    setMailEdit(false);
    setSeleccionados([]);
  };

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
        <div className="flex flex-1 flex-col items-center justify-center gap-4 p-4 pt-0">
          <h2 className="text-2xl font-bold mb-6 text-white">
            Gestión de Usuarios
          </h2>
          <div className="flex flex-wrap gap-4 mb-4 w-full max-w-6xl">
            <Input
              type="text"
              placeholder="Filtrar por nombre"
              value={filtroNombre}
              onChange={(e) => setFiltroNombre(e.target.value)}
              className="px-2 py-1 rounded border bg-background text-foreground"
            />
            <Input
              type="text"
              placeholder="Filtrar por correo"
              value={filtroCorreo}
              onChange={(e) => setFiltroCorreo(e.target.value)}
              className="px-2 py-1 rounded border bg-background text-foreground"
            />
            <Input
              type="text"
              placeholder="Filtrar por RUT"
              value={filtroRut}
              onChange={(e) => setFiltroRut(e.target.value)}
              className="px-2 py-1 rounded border bg-background text-foreground"
            />
          </div>
          <div className="flex w-full max-w-6xl justify-end mb-2">
            <Button onClick={handleSendMail} disabled={seleccionados.length === 0}>
              Enviar correo a ({seleccionados.length})
            </Button>
          </div>
          <div className="overflow-x-auto w-full max-w-6xl">
            <table className="min-w-full border border-gray-700 rounded-lg bg-card text-card-foreground text-xs">
              <thead>
                <tr>
                  <th className="px-2 py-1 border text-center">
                    <input
                      type="checkbox"
                      checked={todosSeleccionados}
                      onChange={handleSelectAll}
                      aria-label="Seleccionar todos"
                    />
                  </th>
                  <th className="px-2 py-1 border">Nombre</th>
                  <th className="px-2 py-1 border">Correo electrónico</th>
                  <th className="px-2 py-1 border">Contraseña</th>
                  <th className="px-2 py-1 border">RUT</th>
                  <th className="px-2 py-1 border">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {datosFiltrados().length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-4 text-muted-foreground">
                      No se encontraron resultados.
                    </td>
                  </tr>
                ) : (
                  datosFiltrados().map((dato, idx) => (
                    <tr key={dato.correo || idx}>
                      <td className="px-2 py-1 border text-center">
                        <input
                          type="checkbox"
                          checked={seleccionados.includes(dato.correo)}
                          onChange={() => handleSelect(dato.correo)}
                          aria-label={`Seleccionar ${dato.nombre}`}
                        />
                      </td>
                      <td className="px-2 py-1 border">{dato.nombre}</td>
                      <td className="px-2 py-1 border">{dato.correo}</td>
                      <td className="px-2 py-1 border">{dato.contrasena}</td>
                      <td className="px-2 py-1 border">{dato.rut}</td>
                      <td className="px-2 py-1 border">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(dato.correo)}
                        >
                          X
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {showMailModal && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
                <h3 className="text-lg font-bold mb-4 text-black">
                  Enviar correo
                </h3>
                {!mailEdit ? (
                  <div className="mb-4 flex flex-col gap-2">
                    <div className="mb-2">
                      <span className="font-semibold text-black">Mensaje:</span>
                      <div className="mt-1 p-2 border rounded text-black bg-gray-100">
                        {mailMessage}
                      </div>
                    </div>
                    <Button
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => setMailEdit(true)}
                    >
                      Editar mensaje
                    </Button>
                  </div>
                ) : (
                  <div className="mb-4 flex flex-col gap-2">
                    <textarea
                      value={mailMessage}
                      onChange={(e) => setMailMessage(e.target.value)}
                      className="px-2 py-1 rounded border w-full mb-2 text-black"
                      rows={5}
                    />
                    <div className="flex gap-2">
                      <Button onClick={() => setMailEdit(false)}>Guardar</Button>
                      <Button
                        variant="destructive"
                        onClick={() => setShowMailModal(false)}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                )}
                {!mailEdit && (
                  <div className="flex gap-2">
                    <Button onClick={handleSendMailFinal}>Enviar</Button>
                    <Button
                      variant="destructive"
                      onClick={() => setShowMailModal(false)}
                    >
                      Cancelar
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}