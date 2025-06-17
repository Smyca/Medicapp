package Model;


import jakarta.persistence.*;

@Entity
@Table(name = "usuarios")
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario") 
    public Long id;

    @Column(name = "correo_electronico", nullable = false, unique = true)
    public String correo;

    @Column(name = "hash_contrasenia", nullable = false)
    public String password;


     public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }



}
