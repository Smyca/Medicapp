package Model;

import jakarta.persistence.*;

@Entity
@Table(name = "informacion_emergencia")
public class InfoEmergency {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_info")
    private Long id;

    @Column(name = "usuario_id", nullable = false)
    private Long usuarioId;

    @Column(name = "tipo_sangre")
    private String tipoSangre;

    @Column(columnDefinition = "TEXT")
    private String alergias;

    @Column(name = "enfermedades_cronicas", columnDefinition = "TEXT")
    private String enfermedadesCronicas;

    @Column(name = "medicacion_importante", columnDefinition = "TEXT")
    private String medicacionImportante;

    @Column(name = "contacto_principal")
    private String contactoPrincipal;

    @Column(name = "zona_direccion")
    private String zonaDireccion;

    @Column(name = "notas_medicas", columnDefinition = "TEXT")
    private String notasMedicas;

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

    public String getTipoSangre() {
        return tipoSangre;
    }

    public void setTipoSangre(String tipoSangre) {
        this.tipoSangre = tipoSangre;
    }

    public String getAlergias() {
        return alergias;
    }

    public void setAlergias(String alergias) {
        this.alergias = alergias;
    }

    public String getEnfermedadesCronicas() {
        return enfermedadesCronicas;
    }

    public void setEnfermedadesCronicas(String enfermedadesCronicas) {
        this.enfermedadesCronicas = enfermedadesCronicas;
    }

    public String getMedicacionImportante() {
        return medicacionImportante;
    }

    public void setMedicacionImportante(String medicacionImportante) {
        this.medicacionImportante = medicacionImportante;
    }

    public String getContactoPrincipal() {
        return contactoPrincipal;
    }

    public void setContactoPrincipal(String contactoPrincipal) {
        this.contactoPrincipal = contactoPrincipal;
    }

    public String getZonaDireccion() {
        return zonaDireccion;
    }

    public void setZonaDireccion(String zonaDireccion) {
        this.zonaDireccion = zonaDireccion;
    }

    public String getNotasMedicas() {
        return notasMedicas;
    }

    public void setNotasMedicas(String notasMedicas) {
        this.notasMedicas = notasMedicas;
    }
}