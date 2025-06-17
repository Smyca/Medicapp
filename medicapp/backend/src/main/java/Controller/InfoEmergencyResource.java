package Controller;

import Model.InfoEmergency;
import Repository.InfoEmergencyRepository;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;

@Path("/info-emergencia")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class InfoEmergencyResource {

    @Inject
    InfoEmergencyRepository repository;

    @GET
    public List<InfoEmergency> getAll() {
        return repository.listAll();
    }

    @GET
    @Path("/usuario/{usuarioId}")
    public Response getByUsuario(@PathParam("usuarioId") Long usuarioId) {
        InfoEmergency info = repository.find("usuarioId", usuarioId).firstResult();
        if (info == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.ok(info).build();
    }

    @POST
    @Transactional
    public Response create(InfoEmergency nueva) {
        repository.persist(nueva);
        return Response.status(Response.Status.CREATED).entity(nueva).build();
    }

    @PUT
    @Path("/usuario/{usuarioId}")
    @Transactional
    public Response updateByUsuario(@PathParam("usuarioId") Long usuarioId, InfoEmergency actualizada) {
        InfoEmergency existente = repository.find("usuarioId", usuarioId).firstResult();
        if (existente == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        existente.setZonaDireccion(actualizada.getZonaDireccion());
        existente.setContactoPrincipal(actualizada.getContactoPrincipal());
        existente.setNotasGenerales(actualizada.getNotasGenerales());

        return Response.ok(existente).build();
    }

    @DELETE
    @Path("/usuario/{usuarioId}")
    @Transactional
    public Response deleteByUsuario(@PathParam("usuarioId") Long usuarioId) {
        InfoEmergency existente = repository.find("usuarioId", usuarioId).firstResult();
        if (existente == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        repository.delete(existente);
        return Response.noContent().build();
    }
}