package Repository;

import Model.ContactEmergency;
import jakarta.enterprise.context.ApplicationScoped;
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;

@ApplicationScoped
public class ContactEmergencyRepository implements PanacheRepositoryBase<ContactEmergency, Long> {
}
