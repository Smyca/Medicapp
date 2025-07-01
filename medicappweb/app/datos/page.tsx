"use client";
<<<<<<< HEAD
=======

>>>>>>> 63ef9e3a199cba129ab49f2344bbb95491c6e563
import React, { useState, useEffect } from "react";
import { AppSidebar } from "@/components/app-sidebar2";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

// Función para generar una fecha aleatoria entre 2022 y 2024
function fechaAleatoria() {
  const start = new Date(2022, 0, 1).getTime();
  const end = new Date(2024, 5, 30).getTime();
  const date = new Date(start + Math.random() * (end - start));
  return date.toLocaleDateString();
}

const datosIniciales = [
  {
    nombre: "Juan Pérez",
    correo: "juan@example.com",
    edad: 32,
    tipoSangre: "O+",
    alergias: "Ninguna",
    medicamentoImportante: "Losartán",
    contacto1: "María Pérez - 555-1234",
    contacto2: "Carlos Pérez - 555-5678",
    direccion: "Calle Falsa 123, Ciudad",
    creacion: fechaAleatoria(),
  },
  {
    nombre: "Ana Gómez",
    correo: "ana@example.com",
    edad: 28,
    tipoSangre: "A-",
    alergias: "Penicilina",
    medicamentoImportante: "Ibuprofeno",
    contacto1: "Luis Gómez - 555-8765",
    contacto2: "Sofía Gómez - 555-4321",
    direccion: "Av. Siempre Viva 742, Ciudad",
    creacion: fechaAleatoria(),
  },
  {
    nombre: "Carlos Ruiz",
    correo: "carlos@example.com",
    edad: 45,
    tipoSangre: "B+",
    alergias: "Ninguna",
    medicamentoImportante: "Metformina",
    contacto1: "Laura Ruiz - 555-1111",
    contacto2: "Pedro Ruiz - 555-2222",
    direccion: "Calle Luna 456, Ciudad",
    creacion: fechaAleatoria(),
  },
  {
    nombre: "María López",
    correo: "maria@example.com",
    edad: 36,
    tipoSangre: "AB+",
    alergias: "Aspirina",
    medicamentoImportante: "Salbutamol",
    contacto1: "José López - 555-3333",
    contacto2: "Elena López - 555-4444",
    direccion: "Calle Sol 789, Ciudad",
    creacion: fechaAleatoria(),
  },
  {
    nombre: "Pedro Sánchez",
    correo: "pedro@example.com",
    edad: 52,
    tipoSangre: "O-",
    alergias: "Ninguna",
    medicamentoImportante: "Enalapril",
    contacto1: "Marta Sánchez - 555-5555",
    contacto2: "Luis Sánchez - 555-6666",
    direccion: "Av. Central 101, Ciudad",
    creacion: fechaAleatoria(),
  },
  {
    nombre: "Lucía Torres",
    correo: "lucia@example.com",
    edad: 29,
    tipoSangre: "A+",
    alergias: "Gluten",
    medicamentoImportante: "Paracetamol",
    contacto1: "Carlos Torres - 555-7777",
    contacto2: "Ana Torres - 555-8888",
    direccion: "Calle Norte 202, Ciudad",
    creacion: fechaAleatoria(),
  },
  {
    nombre: "Miguel Díaz",
    correo: "miguel@example.com",
    edad: 41,
    tipoSangre: "B-",
    alergias: "Ninguna",
    medicamentoImportante: "Atorvastatina",
    contacto1: "Paula Díaz - 555-9999",
    contacto2: "Sara Díaz - 555-0000",
    direccion: "Av. Sur 303, Ciudad",
    creacion: fechaAleatoria(),
  },
  {
    nombre: "Sofía Ramírez",
    correo: "sofia@example.com",
    edad: 34,
    tipoSangre: "AB-",
    alergias: "Lácteos",
    medicamentoImportante: "Loratadina",
    contacto1: "Javier Ramírez - 555-1212",
    contacto2: "Carmen Ramírez - 555-3434",
    direccion: "Calle Este 404, Ciudad",
    creacion: fechaAleatoria(),
  },
  {
    nombre: "Diego Herrera",
    correo: "diego@example.com",
    edad: 38,
    tipoSangre: "O+",
    alergias: "Ninguna",
    medicamentoImportante: "Levotiroxina",
    contacto1: "Patricia Herrera - 555-5656",
    contacto2: "Alberto Herrera - 555-7878",
    direccion: "Av. Oeste 505, Ciudad",
    creacion: fechaAleatoria(),
  },
  {
    nombre: "Valentina Castro",
    correo: "valentina@example.com",
    edad: 27,
    tipoSangre: "A-",
    alergias: "Mariscos",
    medicamentoImportante: "Epinefrina",
    contacto1: "Gabriel Castro - 555-9090",
    contacto2: "Isabel Castro - 555-2323",
    direccion: "Calle Sur 606, Ciudad",
    creacion: fechaAleatoria(),
  },
  {
    nombre: "Andrés Molina",
    correo: "andres@example.com",
    edad: 50,
    tipoSangre: "B+",
    alergias: "Ninguna",
    medicamentoImportante: "Ibuprofeno",
    contacto1: "Rosa Molina - 555-4545",
    contacto2: "Mario Molina - 555-6767",
    direccion: "Av. Norte 707, Ciudad",
    creacion: fechaAleatoria(),
  },
];

export default function DatosPage() {
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroCorreo, setFiltroCorreo] = useState("");
<<<<<<< HEAD
  const [filtroTipoSangre, setFiltroTipoSangre] = useState("");
  const [datos, setDatos] = useState<any[]>([]);

  // Nuevo: Cargar datos desde el endpoint al montar el componente
  useEffect(() => {
    // Solo genera los datos iniciales en el cliente
    setDatos([
      {
        nombre: "Juan Pérez",
        correo: "juan@example.com",
        edad: 32,
        tipoSangre: "O+",
        alergias: "Ninguna",
        medicamentoImportante: "Losartán",
        contacto1: "María Pérez - 555-1234",
        contacto2: "Carlos Pérez - 555-5678",
        direccion: "Calle Falsa 123, Ciudad",
        creacion: fechaAleatoria(),
      },
      {
        nombre: "Ana Gómez",
        correo: "ana@example.com",
        edad: 28,
        tipoSangre: "A-",
        alergias: "Penicilina",
        medicamentoImportante: "Ibuprofeno",
        contacto1: "Luis Gómez - 555-8765",
        contacto2: "Sofía Gómez - 555-4321",
        direccion: "Av. Siempre Viva 742, Ciudad",
        creacion: fechaAleatoria(),
      },
      {
        nombre: "Carlos Ruiz",
        correo: "carlos@example.com",
        edad: 45,
        tipoSangre: "B+",
        alergias: "Ninguna",
        medicamentoImportante: "Metformina",
        contacto1: "Laura Ruiz - 555-1111",
        contacto2: "Pedro Ruiz - 555-2222",
        direccion: "Calle Luna 456, Ciudad",
        creacion: fechaAleatoria(),
      },
      {
        nombre: "María López",
        correo: "maria@example.com",
        edad: 36,
        tipoSangre: "AB+",
        alergias: "Aspirina",
        medicamentoImportante: "Salbutamol",
        contacto1: "José López - 555-3333",
        contacto2: "Elena López - 555-4444",
        direccion: "Calle Sol 789, Ciudad",
        creacion: fechaAleatoria(),
      },
      {
        nombre: "Pedro Sánchez",
        correo: "pedro@example.com",
        edad: 52,
        tipoSangre: "O-",
        alergias: "Ninguna",
        medicamentoImportante: "Enalapril",
        contacto1: "Marta Sánchez - 555-5555",
        contacto2: "Luis Sánchez - 555-6666",
        direccion: "Av. Central 101, Ciudad",
        creacion: fechaAleatoria(),
      },
      {
        nombre: "Lucía Torres",
        correo: "lucia@example.com",
        edad: 29,
        tipoSangre: "A+",
        alergias: "Gluten",
        medicamentoImportante: "Paracetamol",
        contacto1: "Carlos Torres - 555-7777",
        contacto2: "Ana Torres - 555-8888",
        direccion: "Calle Norte 202, Ciudad",
        creacion: fechaAleatoria(),
      },
      {
        nombre: "Miguel Díaz",
        correo: "miguel@example.com",
        edad: 41,
        tipoSangre: "B-",
        alergias: "Ninguna",
        medicamentoImportante: "Atorvastatina",
        contacto1: "Paula Díaz - 555-9999",
        contacto2: "Sara Díaz - 555-0000",
        direccion: "Av. Sur 303, Ciudad",
        creacion: fechaAleatoria(),
      },
      {
        nombre: "Sofía Ramírez",
        correo: "sofia@example.com",
        edad: 34,
        tipoSangre: "AB-",
        alergias: "Lácteos",
        medicamentoImportante: "Loratadina",
        contacto1: "Javier Ramírez - 555-1212",
        contacto2: "Carmen Ramírez - 555-3434",
        direccion: "Calle Este 404, Ciudad",
        creacion: fechaAleatoria(),
      },
      {
        nombre: "Diego Herrera",
        correo: "diego@example.com",
        edad: 38,
        tipoSangre: "O+",
        alergias: "Ninguna",
        medicamentoImportante: "Levotiroxina",
        contacto1: "Patricia Herrera - 555-5656",
        contacto2: "Alberto Herrera - 555-7878",
        direccion: "Av. Oeste 505, Ciudad",
        creacion: fechaAleatoria(),
      },
      {
        nombre: "Valentina Castro",
        correo: "valentina@example.com",
        edad: 27,
        tipoSangre: "A-",
        alergias: "Mariscos",
        medicamentoImportante: "Epinefrina",
        contacto1: "Gabriel Castro - 555-9090",
        contacto2: "Isabel Castro - 555-2323",
        direccion: "Calle Sur 606, Ciudad",
        creacion: fechaAleatoria(),
      },
      {
        nombre: "Andrés Molina",
        correo: "andres@example.com",
        edad: 50,
        tipoSangre: "B+",
        alergias: "Ninguna",
        medicamentoImportante: "Ibuprofeno",
        contacto1: "Rosa Molina - 555-4545",
        contacto2: "Mario Molina - 555-6767",
        direccion: "Av. Norte 707, Ciudad",
        creacion: fechaAleatoria(),
      },
    ]);
=======
  const [datos, setDatos] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://54.81.211.180:8080/usuarios")
      .then((res) => res.json())
      .then((data) => {
        console.log("API usuarios:", data); // <-- Agrega esto temporalmente
        setDatos(data);
      })
      .catch((err) => {
        console.error("Error al obtener usuarios:", err);
        setDatos([]);
      });
>>>>>>> 63ef9e3a199cba129ab49f2344bbb95491c6e563
  }, []);

  const [seleccionados, setSeleccionados] = useState<string[]>([]);
  const [showMailModal, setShowMailModal] = useState(false);
  const [mailEdit, setMailEdit] = useState(false);
  const [mailMessage, setMailMessage] = useState("Hola, este es un mensaje para los usuarios seleccionados.");
  const todosSeleccionados =
    datosFiltrados().length > 0 &&
    datosFiltrados().every((d) => seleccionados.includes(d.correoElectronico));

  function datosFiltrados() {
    return datos.filter(
      (dato) =>
        dato.nombre?.toLowerCase().includes(filtroNombre.toLowerCase()) &&
        (dato.correoElectronico?.toLowerCase().includes(filtroCorreo.toLowerCase()) ?? true)
    );
  }

  const handleDelete = (correo: string) => {
    if (window.confirm("¿Estás seguro de que deseas borrar esta cuenta?")) {
      setDatos(datos.filter((dato) => dato.correoElectronico !== correo));
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
          !datosFiltrados().some((d) => d.correoElectronico === correo)
        )
      );
    } else {
      setSeleccionados([
        ...seleccionados,
        ...datosFiltrados()
          .map((d) => d.correoElectronico)
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
    alert(`Correo enviado a: ${seleccionados.join(", ")}`);
    setShowMailModal(false);
    setMailEdit(false);
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
            Usuarios registrados
          </h2>
          <div className="flex flex-wrap gap-4 mb-4 w-full max-w-6xl">
            <input
              type="text"
              placeholder="Filtrar por nombre"
              value={filtroNombre}
              onChange={(e) => setFiltroNombre(e.target.value)}
              className="px-2 py-1 rounded border bg-background text-foreground"
            />
            <input
              type="text"
              placeholder="Filtrar por correo"
              value={filtroCorreo}
              onChange={(e) => setFiltroCorreo(e.target.value)}
              className="px-2 py-1 rounded border bg-background text-foreground"
            />
          </div>
          <div className="flex w-full max-w-6xl justify-end mb-2">
            <Button onClick={handleSendMail} disabled={seleccionados.length === 0}>
              Enviar correo
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
                  <th className="px-2 py-1 border">ID</th>
                  <th className="px-2 py-1 border">Nombre</th>
                  <th className="px-2 py-1 border">Correo</th>
<<<<<<< HEAD
                  <th className="px-2 py-1 border">Correo electrónico</th> {}
                  <th className="px-2 py-1 border">Edad</th>
                  <th className="px-2 py-1 border">Tipo de Sangre</th>
                  <th className="px-2 py-1 border">Alergias</th>
                  <th className="px-2 py-1 border">Creacion</th>
                  <th className="px-2 py-1 border">Medicamento Importante</th>
                  <th className="px-2 py-1 border">Contacto 1</th>
                  <th className="px-2 py-1 border">Contacto 2</th>
                  <th className="px-2 py-1 border">Dirección</th>
=======
                  <th className="px-2 py-1 border">Fecha de nacimiento</th>
                  <th className="px-2 py-1 border">Creado en</th>
>>>>>>> 63ef9e3a199cba129ab49f2344bbb95491c6e563
                  <th className="px-2 py-1 border">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {datosFiltrados().length === 0 ? (
                  <tr>
<<<<<<< HEAD
                    <td colSpan={13} className="text-center py-4 text-muted-foreground">
=======
                    <td colSpan={7} className="text-center py-4 text-muted-foreground">
>>>>>>> 63ef9e3a199cba129ab49f2344bbb95491c6e563
                      No se encontraron resultados.
                    </td>
                  </tr>
                ) : (
                  datosFiltrados().map((dato, idx) => (
                    <tr key={idx}>
                      <td className="px-2 py-1 border text-center">
                        <input
                          type="checkbox"
                          checked={seleccionados.includes(dato.correoElectronico)}
                          onChange={() => handleSelect(dato.correoElectronico)}
                          aria-label={`Seleccionar ${dato.nombre}`}
                        />
                      </td>
                      <td className="px-2 py-1 border">{dato.id}</td>
                      <td className="px-2 py-1 border">{dato.nombre}</td>
<<<<<<< HEAD
                      <td className="px-2 py-1 border">{dato.correo}</td>
                      <td className="px-2 py-1 border">{dato.correo}</td>
                      <td className="px-2 py-1 border">{dato.edad}</td>
                      <td className="px-2 py-1 border">{dato.tipoSangre}</td>
                      <td className="px-2 py-1 border">{dato.alergias}</td>
                      <td className="px-2 py-1 border">{dato.creacion}</td>
                      <td className="px-2 py-1 border">{dato.medicamentoImportante}</td>
                      <td className="px-2 py-1 border">{dato.contacto1}</td>
                      <td className="px-2 py-1 border">{dato.contacto2}</td>
                      <td className="px-2 py-1 border">{dato.direccion}</td>
=======
                      <td className="px-2 py-1 border">{dato.correoElectronico}</td>
                      <td className="px-2 py-1 border">
                        {dato.fechaNacimiento
                          ? (() => {
                              const d = new Date(dato.fechaNacimiento);
                              const day = String(d.getDate()).padStart(2, "0");
                              const month = String(d.getMonth() + 1).padStart(2, "0");
                              const year = d.getFullYear();
                              return `${day}-${month}-${year}`;
                            })()
                          : ""}
                      </td>
                      <td className="px-2 py-1 border">
                        {dato.creadoEn ? new Date(dato.creadoEn).toLocaleString("es-CL", { dateStyle: "medium", timeStyle: "short" }) : ""}
                      </td>
>>>>>>> 63ef9e3a199cba129ab49f2344bbb95491c6e563
                      <td className="px-2 py-1 border">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(dato.correoElectronico)}
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
                <h3 className="text-lg font-bold mb-4 text-black">Enviar correo</h3>
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
                    <Button onClick={handleSendMailFinal}>
                      Enviar
                    </Button>
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