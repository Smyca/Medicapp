package Controller;


import Model.Usuario;
import Repository.UsuarioRepository;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.*;
import java.util.List;

@Path("/usuarios")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class UsuarioResource {

    @Inject
    UsuarioRepository repo;

    @GET
    public List<Usuario> listAll() {
        return repo.listAll();
    }

    @GET
    @Path("{id}")
    public Response getById(@PathParam("id") Long id) {
        Usuario u = repo.findById(id);
        if (u == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.ok(u).build();
    }

    @POST
    @Transactional
    public Response create(Usuario usuario, @Context UriInfo uriInfo) {
        // En producción, aquí deberías hashear la contraseña
        repo.persist(usuario);
        UriBuilder builder = uriInfo.getAbsolutePathBuilder().path(usuario.getId().toString());
        return Response.created(builder.build()).entity(usuario).build();
    }

    @PUT
    @Path("{id}")
    @Transactional
    public Response update(@PathParam("id") Long id, Usuario updated) {
        Usuario existing = repo.findById(id);
        if (existing == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        existing.setNombre(updated.getNombre());
        existing.setFechaNacimiento(updated.getFechaNacimiento());
        existing.setCorreoElectronico(updated.getCorreoElectronico());
        existing.setPassword(updated.getPassword());
        existing.setFotoPerfil(updated.getFotoPerfil());
        return Response.ok(existing).build();
    }

    @DELETE
    @Path("{id}")
    @Transactional
    public Response delete(@PathParam("id") Long id) {
        boolean deleted = repo.deleteById(id);
        return deleted ? Response.noContent().build()
                : Response.status(Response.Status.NOT_FOUND).build();
    }
}