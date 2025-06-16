-- 1. Tabla de usuarios (autenticación)
CREATE TABLE `usuarios` (
  `id_usuario`        INT            NOT NULL AUTO_INCREMENT,
  `correo_electronico` VARCHAR(255)  NOT NULL UNIQUE,
  `hash_contrasenia`  VARCHAR(255)   NOT NULL,
  `creado_en`         TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Información de emergencia (1:1 con usuarios)
CREATE TABLE `informacion_emergencia` (
  `id_info`             INT          NOT NULL AUTO_INCREMENT,
  `usuario_id`          INT          NOT NULL,
  `tipo_sangre`         VARCHAR(3),
  `alergias`            TEXT,
  `enfermedades_cronicas` TEXT,
  `medicacion_importante` TEXT,
  `contacto_principal`  VARCHAR(255),
  `zona_direccion`      VARCHAR(255),
  `notas_medicas`       TEXT,
  PRIMARY KEY (`id_info`),
  UNIQUE KEY `uq_info_usuario` (`usuario_id`),
  CONSTRAINT `fk_info_usuario`
    FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id_usuario`)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Catálogo de opciones de frecuencia
CREATE TABLE `opciones_frecuencia` (
  `id_frecuencia`   INT         NOT NULL AUTO_INCREMENT,
  `etiqueta`        VARCHAR(50) NOT NULL,
  `intervalo_horas` INT         NOT NULL,
  PRIMARY KEY (`id_frecuencia`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Catálogo de opciones de franja horaria
CREATE TABLE `opciones_horario` (
  `id_horario` INT         NOT NULL AUTO_INCREMENT,
  `etiqueta`   VARCHAR(50) NOT NULL,
  PRIMARY KEY (`id_horario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Medicamentos y recordatorios
CREATE TABLE `medicamentos` (
  `id_medicamento`     INT         NOT NULL AUTO_INCREMENT,
  `usuario_id`         INT         NOT NULL,
  `nombre`             VARCHAR(100) NOT NULL,
  `dosis`              VARCHAR(50)  NOT NULL,
  `frecuencia_id`      INT,
  `frecuencia_personalizada` VARCHAR(100),
  `horario_id`         INT,
  `hora_personalizada` TIME,
  `recordatorio_activo` BOOLEAN    NOT NULL DEFAULT FALSE,
  `notas_adicionales`  TEXT,
  `creado_en`          TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_medicamento`),
  INDEX `idx_medic_user` (`usuario_id`),
  CONSTRAINT `fk_med_usuario`
    FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id_usuario`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_med_frecuencia`
    FOREIGN KEY (`frecuencia_id`) REFERENCES `opciones_frecuencia`(`id_frecuencia`),
  CONSTRAINT `fk_med_horario`
    FOREIGN KEY (`horario_id`) REFERENCES `opciones_horario`(`id_horario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Población inicial de catálogos
INSERT INTO `opciones_frecuencia` (`etiqueta`, `intervalo_horas`)
VALUES
  ('Cada 8 horas',  8),
  ('Cada 12 horas', 12),
  ('Cada 24 horas', 24);

INSERT INTO `opciones_horario` (`etiqueta`)
VALUES
  ('Mañana'),
  ('Tarde'),
  ('Noche');
