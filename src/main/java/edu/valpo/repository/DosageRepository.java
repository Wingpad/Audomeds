package edu.valpo.repository;

import edu.valpo.objects.Dosage;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;

/** Prescription Repository Placeholder
 *
 * Created by jszaday on 11/30/2015.
 */

@RepositoryRestResource(collectionResourceRel = "dosage", path = "dosage")
public interface DosageRepository extends MongoRepository<Dosage, Long> {
    @Query("{ 'enabled' : true }")
    List<Dosage> findEnabled();
}
