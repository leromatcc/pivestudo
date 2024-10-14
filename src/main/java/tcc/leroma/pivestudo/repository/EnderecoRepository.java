package tcc.leroma.pivestudo.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import tcc.leroma.pivestudo.domain.Endereco;

/**
 * Spring Data JPA repository for the Endereco entity.
 */
@Repository
public interface EnderecoRepository extends JpaRepository<Endereco, UUID> {
    default Optional<Endereco> findOneWithEagerRelationships(UUID id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Endereco> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Endereco> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select endereco from Endereco endereco left join fetch endereco.pessoa",
        countQuery = "select count(endereco) from Endereco endereco"
    )
    Page<Endereco> findAllWithToOneRelationships(Pageable pageable);

    @Query("select endereco from Endereco endereco left join fetch endereco.pessoa")
    List<Endereco> findAllWithToOneRelationships();

    @Query("select endereco from Endereco endereco left join fetch endereco.pessoa where endereco.id =:id")
    Optional<Endereco> findOneWithToOneRelationships(@Param("id") UUID id);
}
