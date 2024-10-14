package tcc.leroma.pivestudo.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import tcc.leroma.pivestudo.domain.Documento;

/**
 * Spring Data JPA repository for the Documento entity.
 */
@Repository
public interface DocumentoRepository extends JpaRepository<Documento, UUID> {
    default Optional<Documento> findOneWithEagerRelationships(UUID id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Documento> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Documento> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select documento from Documento documento left join fetch documento.pessoa",
        countQuery = "select count(documento) from Documento documento"
    )
    Page<Documento> findAllWithToOneRelationships(Pageable pageable);

    @Query("select documento from Documento documento left join fetch documento.pessoa")
    List<Documento> findAllWithToOneRelationships();

    @Query("select documento from Documento documento left join fetch documento.pessoa where documento.id =:id")
    Optional<Documento> findOneWithToOneRelationships(@Param("id") UUID id);
}
