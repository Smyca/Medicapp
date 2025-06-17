package Repository;

import Model.InfoMedica;
import jakarta.enterprise.context.ApplicationScoped;
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;

@ApplicationScoped
public class InfoMedicaRepository implements PanacheRepositoryBase<InfoMedica, Long> {
}