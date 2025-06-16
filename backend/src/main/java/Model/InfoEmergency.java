package Model;

import jakarta.persistence.*;

@Entity
@Table(name = "info_emergencia")
public class InfoEmergency {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_info")
    private Long id;

    @Column(name = "usuario_id", nullable = false)
    private Long usuarioId;

    @Column(name = "zona_direccion")
    private String zonaDireccion;

    @Column(name = "contacto_principal")
    private String contactoPrincipal;

    @Column(name = "notas_generales", columnDefinition = "TEXT")
    private String notasGenerales;

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

    public String getZonaDireccion() {
        return zonaDireccion;
    }

    public void setZonaDireccion(String zonaDireccion) {
        this.zonaDireccion = zonaDireccion;
    }

    public String getContactoPrincipal() {
        return contactoPrincipal;
    }

    public void setContactoPrincipal(String contactoPrincipal) {
        this.contactoPrincipal = contactoPrincipal;
    }

    public String getNotasGenerales() {
        return notasGenerales;
    }

    public void setNotasGenerales(String notasGenerales) {
        this.notasGenerales = notasGenerales;
    }
}