package Controller;



import Repository.UsuarioRepository;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/auth")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class UsuarioResource {

    public static class LoginRequest {
        public String username;
        public String password;
    }

    public static class LoginResponse {
        public boolean success;
        public String message;
        public Long usuarioId; 

    }

    @Inject
    UsuarioRepository usuarioRepository;

    @POST
    public Response login(LoginRequest request) {
        var usuario = usuarioRepository.findByUsernameAndPassword(request.username, request.password);
        LoginResponse resp = new LoginResponse();
        if (usuario != null) {
            resp.success = true;
            resp.message = "Login correcto";
            resp.usuarioId = usuario.getId(); // Asumiendo que el usuario tiene un método getId()
            return Response.ok(resp).build();
        } else {
            resp.success = false;
            resp.message = "Usuario o contraseña incorrectos";
            return Response.status(Response.Status.UNAUTHORIZED).entity(resp).build();
        }
    }
}