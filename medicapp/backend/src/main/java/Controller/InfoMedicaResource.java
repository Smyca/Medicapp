package Controller;

import Model.InfoMedica;
import Repository.InfoMedicaRepository;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;

@Path("/info-medica")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class InfoMedicaResource {

    @Inject
    InfoMedicaRepository repository;

    @GET
    public List<InfoMedica> getAll() {
        return repository.listAll();
    }

    @GET
    @Path("/usuario/{usuarioId}")
    public Response getByUsuario(@PathParam("usuarioId") Long usuarioId) {
        InfoMedica info = repository.find("usuarioId", usuarioId).firstResult();
        if (info == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.ok(info).build();
    }

    @POST
    @Transactional
    public Response create(InfoMedica nueva) {
        repository.persist(nueva);
        return Response.status(Response.Status.CREATED).entity(nueva).build();
    }

    @PUT
    @Path("/usuario/{usuarioId}")
    @Transactional
    public Response updateByUsuario(@PathParam("usuarioId") Long usuarioId, InfoMedica actualizada) {
        InfoMedica existente = repository.find("usuarioId", usuarioId).firstResult();
        if (existente == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        existente.setTipoSangre(actualizada.getTipoSangre());
        existente.setAlergias(actualizada.getAlergias());
        existente.setEnfermedadesCronicas(actualizada.getEnfermedadesCronicas());
        existente.setMedicacionImportante(actualizada.getMedicacionImportante());

        return Response.ok(existente).build();
    }

    @DELETE
    @Path("/usuario/{usuarioId}")
    @Transactional
    public Response deleteByUsuario(@PathParam("usuarioId") Long usuarioId) {
        InfoMedica existente = repository.find("usuarioId", usuarioId).firstResult();
        if (existente == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        repository.delete(existente);
        return Response.noContent().build();
    }
}
