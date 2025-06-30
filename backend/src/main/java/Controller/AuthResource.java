package Controller;

import Model.Usuario;
import Services.AuthService;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import io.quarkus.runtime.annotations.RegisterForReflection;

@Path("/auth")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AuthResource {
    
    @RegisterForReflection
    public static class LoginRequest {
        public String username;
        public String password;
    }

    @RegisterForReflection
    public static class LoginResponse {
        public boolean success;
        public String message;
        public Long usuarioId;
    }

    @Inject
    AuthService authService;

    @POST
    @Path("/login")
    public Response login(LoginRequest request) {
        Usuario u = authService.authenticate(request.username, request.password);
        LoginResponse resp = new LoginResponse();
        if (u != null) {
            resp.success = true;
            resp.message = "Login correcto";
            resp.usuarioId = u.getId();
            return Response.ok(resp).build();
        }
        resp.success = false;
        resp.message = "Credenciales inválidas";
        return Response.status(Response.Status.UNAUTHORIZED).entity(resp).build();
    }
}