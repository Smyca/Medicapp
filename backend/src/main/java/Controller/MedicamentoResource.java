package Controller;

import Model.Medicamento;
import Repository.MedicamentoRepository;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;

@Path("/medicamentos")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class MedicamentoResource {

    @Inject
    MedicamentoRepository repository;

    @GET
    public List<Medicamento> getAll() {
        return repository.listAll();
    }

    @GET
    @Path("/usuario/{usuarioId}")
    public List<Medicamento> getByUsuario(@PathParam("usuarioId") Long usuarioId) {
        return repository.find("usuarioId", usuarioId).list();
    }

    // Obtener un solo medicamento por su id
    @GET
    @Path("/{id}")
    public Response getById(@PathParam("id") Long id) {
        Medicamento med = repository.findById(id);
        if (med == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.ok(med).build();
    }

    @POST
    @Transactional
    public Response create(Medicamento nuevo) {
        repository.persist(nuevo);
        return Response.status(Response.Status.CREATED).entity(nuevo).build();
    }

    @PUT
    @Path("/{id}")
    @Transactional
    public Response update(@PathParam("id") Long id, Medicamento actualizado) {
        Medicamento existente = repository.findById(id);
        if (existente == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        existente.setUsuarioId(actualizado.getUsuarioId());
        existente.setNombre(actualizado.getNombre());
        existente.setDosis(actualizado.getDosis());
        existente.setFrecuenciaPersonalizada(actualizado.getFrecuenciaPersonalizada());
        existente.setHoraPersonalizada(actualizado.getHoraPersonalizada());
        existente.setRecordatorioActivo(actualizado.getRecordatorioActivo());
        existente.setNotasAdicionales(actualizado.getNotasAdicionales());


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
