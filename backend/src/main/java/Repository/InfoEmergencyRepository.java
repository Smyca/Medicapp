package Repository;

import Model.InfoEmergency;
import jakarta.enterprise.context.ApplicationScoped;
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;

@ApplicationScoped
public class InfoEmergencyRepository implements PanacheRepositoryBase<InfoEmergency, Long> {
}