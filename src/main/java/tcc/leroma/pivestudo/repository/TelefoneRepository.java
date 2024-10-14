package tcc.leroma.pivestudo.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import tcc.leroma.pivestudo.domain.Telefone;

/**
 * Spring Data JPA repository for the Telefone entity.
 */
@Repository
public interface TelefoneRepository extends JpaRepository<Telefone, UUID> {
    default Optional<Telefone> findOneWithEagerRelationships(UUID id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Telefone> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Telefone> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select telefone from Telefone telefone left join fetch telefone.pessoa",
        countQuery = "select count(telefone) from Telefone telefone"
    )
    Page<Telefone> findAllWithToOneRelationships(Pageable pageable);

    @Query("select telefone from Telefone telefone left join fetch telefone.pessoa")
    List<Telefone> findAllWithToOneRelationships();

    @Query("select telefone from Telefone telefone left join fetch telefone.pessoa where telefone.id =:id")
    Optional<Telefone> findOneWithToOneRelationships(@Param("id") UUID id);
}
