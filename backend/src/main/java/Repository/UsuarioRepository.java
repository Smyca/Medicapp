package Repository;


import Model.Usuario;
import jakarta.enterprise.context.ApplicationScoped;
import io.quarkus.hibernate.orm.panache.PanacheRepository;

@ApplicationScoped
public class UsuarioRepository implements PanacheRepository<Usuario> {
    public Usuario findByUsernameAndPassword(String username, String password) {
        return find("correo = ?1 and password = ?2", username, password).firstResult();
    }
}