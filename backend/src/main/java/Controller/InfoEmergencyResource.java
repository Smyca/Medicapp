package Controller;

import Model.InfoEmergency;
import Repository.InfoEmergencyRepository;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;

@Path("/infoEmergencia")
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
    @Path("/{id}")
    @Transactional
    public Response update(@PathParam("id") Long id, InfoEmergency actualizada) {
        InfoEmergency existente = repository.findById(id);
        if (existente == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        existente.setUsuarioId(actualizada.getUsuarioId());
        existente.setTipoSangre(actualizada.getTipoSangre());
        existente.setAlergias(actualizada.getAlergias());
        existente.setEnfermedadesCronicas(actualizada.getEnfermedadesCronicas());
        existente.setMedicacionImportante(actualizada.getMedicacionImportante());
        existente.setContactoPrincipal(actualizada.getContactoPrincipal());
        existente.setZonaDireccion(actualizada.getZonaDireccion());
        existente.setNotasMedicas(actualizada.getNotasMedicas());

        return Response.ok(existente).build();
    }

    @DELETE
    @Path("/{id}")
    @Transactional
    public Response delete(@PathParam("id") Long id) {
        boolean eliminado = repository.deleteById(id);
        if (!eliminado) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.noContent().build();
    }
}
