package tcc.leroma.pivestudo.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import tcc.leroma.pivestudo.domain.Automovel;

/**
 * Spring Data JPA repository for the Automovel entity.
 */
@Repository
public interface AutomovelRepository extends JpaRepository<Automovel, UUID> {
    default Optional<Automovel> findOneWithEagerRelationships(UUID id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Automovel> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Automovel> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select automovel from Automovel automovel left join fetch automovel.tipoAutomovel left join fetch automovel.pessoa",
        countQuery = "select count(automovel) from Automovel automovel"
    )
    Page<Automovel> findAllWithToOneRelationships(Pageable pageable);

    @Query("select automovel from Automovel automovel left join fetch automovel.tipoAutomovel left join fetch automovel.pessoa")
    List<Automovel> findAllWithToOneRelationships();

    @Query(
        "select automovel from Automovel automovel left join fetch automovel.tipoAutomovel left join fetch automovel.pessoa where automovel.id =:id"
    )
    Optional<Automovel> findOneWithToOneRelationships(@Param("id") UUID id);
}
