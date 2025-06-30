package Controller;

import Model.ContactEmergency;
import Repository.ContactEmergencyRepository;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;

@Path("/contactos-emergencia")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ContactEmergencyResource {

    @Inject
    ContactEmergencyRepository repository;

    @GET
    public List<ContactEmergency> getAll() {
        return repository.listAll();
    }

    @GET
    @Path("/usuario/{usuarioId}")
    public List<ContactEmergency> getByUsuario(@PathParam("usuarioId") Long usuarioId) {
        return repository.find("usuarioId", usuarioId).list();
    }

    @POST
    @Transactional
    public Response create(ContactEmergency nuevo) {
        // Validación simple: ajusta según tus campos obligatorios
        if (nuevo == null || 
            nuevo.getNombre() == null || nuevo.getNombre().trim().isEmpty() ||
            nuevo.getTelefono() == null || nuevo.getTelefono().trim().isEmpty()) {
            return Response.status(Response.Status.BAD_REQUEST)
                           .entity("El contacto de emergencia no puede estar vacío.").build();
        }
        repository.persist(nuevo);
        return Response.status(Response.Status.CREATED).entity(nuevo).build();
    }

    @PUT
    @Path("/usuario/{usuarioId}")
    @Transactional
    public Response updateByUsuario(@PathParam("usuarioId") Long usuarioId, List<ContactEmergency> contactos) {
        // Elimina los contactos actuales del usuario
        repository.delete("usuarioId", usuarioId);
        // Asigna el usuarioId a cada contacto y persiste
        for (ContactEmergency c : contactos) {
            c.setUsuarioId(usuarioId);
            repository.persist(c);
        }
        return Response.ok().build();
    }



    @DELETE
    @Path("/usuario/{usuarioId}")
    @Transactional
    public Response deleteByUsuario(@PathParam("usuarioId") Long usuarioId) {
        ContactEmergency existente = repository.find("usuarioId", usuarioId).firstResult();
        if (existente == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        repository.delete(existente);
        return Response.noContent().build();
    }
}