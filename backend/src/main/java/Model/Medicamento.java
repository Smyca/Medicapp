package Model;

import jakarta.persistence.*;
import java.time.LocalTime;
import java.time.LocalDateTime;

@Entity
@Table(name = "medicamentos")
public class Medicamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_medicamento")
    private Long id;

    @Column(name = "usuario_id", nullable = false)
    private Long usuarioId;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private String dosis;

    @Column(name = "frecuencia_personalizada")
    private String frecuenciaPersonalizada;

    @Column(name = "hora_personalizada")
    private LocalTime horaPersonalizada;

    @Column(name = "recordatorio_activo", nullable = false)
    private Boolean recordatorioActivo = false;

    @Column(name = "notas_adicionales", columnDefinition = "TEXT")
    private String notasAdicionales;

    @Column(name = "creado_en", nullable = false)
    private LocalDateTime creadoEn;

    // === Getters y Setters ===

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(Long usuarioId) {
        this.usuarioId = usuarioId;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDosis() {
        return dosis;
    }

    public void setDosis(String dosis) {
        this.dosis = dosis;
    }

    public String getFrecuenciaPersonalizada() {
        return frecuenciaPersonalizada;
    }

    public void setFrecuenciaPersonalizada(String frecuenciaPersonalizada) {
        this.frecuenciaPersonalizada = frecuenciaPersonalizada;
    }

    public LocalTime getHoraPersonalizada() {
        return horaPersonalizada;
    }

    public void setHoraPersonalizada(LocalTime horaPersonalizada) {
        this.horaPersonalizada = horaPersonalizada;
    }

    public Boolean getRecordatorioActivo() {
        return recordatorioActivo;
    }

    public void setRecordatorioActivo(Boolean recordatorioActivo) {
        this.recordatorioActivo = recordatorioActivo;
    }

    public String getNotasAdicionales() {
        return notasAdicionales;
    }

    public void setNotasAdicionales(String notasAdicionales) {
        this.notasAdicionales = notasAdicionales;
    }

    public LocalDateTime getCreadoEn() {
        return creadoEn;
    }

    public void setCreadoEn(LocalDateTime creadoEn) {
        this.creadoEn = creadoEn;
    }
}