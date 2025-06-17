-- Usuarios (base)
CREATE TABLE usuarios (
  id_usuario         INT AUTO_INCREMENT PRIMARY KEY,
  nombre             VARCHAR(100)   NOT NULL,
  fecha_nacimiento   DATE           NOT NULL,
  correo_electronico VARCHAR(255)   NOT NULL UNIQUE,
  hash_contrasenia   VARCHAR(255)   NOT NULL,
  foto_perfil        VARCHAR(255)   NULL,
  creado_en          TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Información de emergencia general
CREATE TABLE `info_emergencia` (
  `id_info`        INT AUTO_INCREMENT PRIMARY KEY,
  `usuario_id`     INT NOT NULL,
  `zona_direccion` VARCHAR(255),
  `contacto_principal` VARCHAR(255),
  `notas_generales` TEXT,
  UNIQUE KEY `uk_usuario_emergencia` (`usuario_id`),
  FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Información médica (separada)
CREATE TABLE `info_medica` (
  `id_medica`              INT AUTO_INCREMENT PRIMARY KEY,
  `usuario_id`             INT NOT NULL,
  `tipo_sangre`            VARCHAR(3),
  `alergias`               TEXT,
  `enfermedades_cronicas`  TEXT,
  `medicacion_importante`  TEXT,
  UNIQUE KEY `uk_usuario_medica` (`usuario_id`),
  FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Medicamentos
CREATE TABLE `medicamentos` (
  `id_medicamento`           INT AUTO_INCREMENT PRIMARY KEY,
  `usuario_id`               INT NOT NULL,
  `nombre`                   VARCHAR(100) NOT NULL,
  `dosis`                    VARCHAR(50) NOT NULL,
  `frecuencia_personalizada` VARCHAR(100),
  `hora_personalizada`       TIME,
  `recordatorio_activo`      BOOLEAN NOT NULL DEFAULT FALSE,
  `notas_adicionales`        TEXT,
  `creado_en`                TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Contactos de emergencia (pueden ser múltiples por usuario)
CREATE TABLE `contactos_emergencia` (
  `id_contacto`       INT AUTO_INCREMENT PRIMARY KEY,
  `usuario_id`        INT NOT NULL,
  `nombre`            VARCHAR(100) NOT NULL,
  `relacion`          VARCHAR(100),
  `telefono`          VARCHAR(20),
  `direccion`         VARCHAR(255),
  `observaciones`     TEXT,
  FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;







-- ---------------------------------------

INSERT INTO usuarios (nombre, fecha_nacimiento, correo_electronico, hash_contrasenia, foto_perfil)
VALUES (
  'Ana Pérez',
  '1990-05-15',
  'usuario',
  'password', 
  'https://cdn.ejemplo.com/fotos/ana.jpg'
);

INSERT INTO info_emergencia (usuario_id, zona_direccion, contacto_principal, notas_generales)
VALUES (1, 'Las Condes, Santiago', 'Juan Ramírez - +56912345678', 'Vive sola, antecedentes familiares de hipertensión.');


INSERT INTO info_medica (usuario_id, tipo_sangre, alergias, enfermedades_cronicas, medicacion_importante)
VALUES (1, 'A+', 'Ninguna', 'Asma', 'Salbutamol inhalador');

INSERT INTO medicamentos (
  usuario_id, nombre, dosis, frecuencia_personalizada, hora_personalizada,
  recordatorio_activo, notas_adicionales
)
VALUES (
  1, 'Salbutamol', '2 inhalaciones', 'Cada 8 horas', '08:00:00',
  TRUE, 'Usar solo en caso de síntomas respiratorios agudos.'
);


INSERT INTO contactos_emergencia (usuario_id, nombre, relacion, telefono, direccion, observaciones)
VALUES 
  (1, 'Juan Ramírez', 'Padre', '+56912345678', 'Av. Apoquindo 1234, Santiago', 'Disponible siempre'),
  (1, 'María Torres', 'Amiga', '+56987654321', 'Calle Falsa 123, Las Condes', 'Contacto secundario');



---------------------------------------------------
-- 1) Insert en usuarios (se generará id_usuario = 2)
INSERT INTO `usuarios` (
  nombre,
  fecha_nacimiento,
  correo_electronico,
  hash_contrasenia,
  foto_perfil
) VALUES (
  'Juan Pérez',
  '1985-05-20',
  'juan.perez@example.com',
  'password',
  NULL
);

-- 2) Insert en info_emergencia para el usuario 2
INSERT INTO `info_emergencia` (
  usuario_id,
  zona_direccion,
  contacto_principal,
  notas_generales
) VALUES (
  2,
  'Providencia, Santiago',
  'María González',
  'Vive cerca, avisar en caso de accidente.'
);

-- 3) Insert en info_medica para el usuario 2
INSERT INTO `info_medica` (
  usuario_id,
  tipo_sangre,
  alergias,
  enfermedades_cronicas,
  medicacion_importante
) VALUES (
  2,
  'O+',
  'Penicilina',
  'Hipertensión arterial',
  'Losartan 50 mg cada mañana'
);

-- 4) Insert en medicamentos para el usuario 2
INSERT INTO `medicamentos` (
  usuario_id,
  nombre,
  dosis,
  frecuencia_personalizada,
  hora_personalizada,
  recordatorio_activo,
  notas_adicionales
) VALUES
  (2, 'Paracetamol', '500 mg', 'Cada 8 horas', '08:00:00', TRUE,  'Tomar con alimentos'),
  (2, 'Ibuprofeno',  '400 mg', 'Cada 12 horas', '20:00:00', FALSE, 'Solo si hay dolor intenso');

-- 5) Insert en contactos_emergencia para el usuario 2
INSERT INTO `contactos_emergencia` (
  usuario_id,
  nombre,
  relacion,
  telefono,
  direccion,
  observaciones
) VALUES
  (2, 'Carlos Ramírez', 'Hermano', '+56 9 7654 3210', 'Av. Los Leones 1234, Providencia', 'Disponible 24/7'),
  (2, 'Ana Muñoz',      'Amiga',   '+56 9 1234 5678', 'Calle Ñuñoa 567, Ñuñoa',      'Avisar por WhatsApp primero');



