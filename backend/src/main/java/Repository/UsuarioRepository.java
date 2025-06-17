package Repository;


import Model.Usuario;
import jakarta.enterprise.context.ApplicationScoped;
import io.quarkus.hibernate.orm.panache.PanacheRepository;

@ApplicationScoped
public class UsuarioRepository implements PanacheRepository<Usuario> {
    /**
     * Método de autenticación básico (no recomendado para producción sin hashing)
     */
public Usuario findByUsernameAndPassword(String username, String password) {
        return find("correoElectronico = ?1 and password = ?2", username, password)
                .firstResult();
    }
}