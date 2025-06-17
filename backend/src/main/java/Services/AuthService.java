package Services;

import Model.Usuario;
import Repository.UsuarioRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

@ApplicationScoped
public class AuthService {

    @Inject
    UsuarioRepository usuarioRepo;

    /**
     * Autentica usando el repositorio.
     */
    public Usuario authenticate(String username, String password) {
        return usuarioRepo.findByUsernameAndPassword(username, password);
    }
}