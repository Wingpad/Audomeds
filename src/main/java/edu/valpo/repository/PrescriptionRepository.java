package edu.valpo.repository;

import edu.valpo.objects.Prescription;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

/** Prescription Repository Placeholder
 *
 * Created by jszaday on 11/30/2015.
 */

@RepositoryRestResource(collectionResourceRel = "prescription", path = "prescription")
public interface PrescriptionRepository extends MongoRepository<Prescription, Long> {
}
