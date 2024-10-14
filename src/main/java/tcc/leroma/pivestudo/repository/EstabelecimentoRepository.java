package tcc.leroma.pivestudo.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import tcc.leroma.pivestudo.domain.Estabelecimento;

/**
 * Spring Data JPA repository for the Estabelecimento entity.
 */
@Repository
public interface EstabelecimentoRepository extends JpaRepository<Estabelecimento, UUID> {
    default Optional<Estabelecimento> findOneWithEagerRelationships(UUID id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Estabelecimento> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Estabelecimento> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select estabelecimento from Estabelecimento estabelecimento left join fetch estabelecimento.endereco",
        countQuery = "select count(estabelecimento) from Estabelecimento estabelecimento"
    )
    Page<Estabelecimento> findAllWithToOneRelationships(Pageable pageable);

    @Query("select estabelecimento from Estabelecimento estabelecimento left join fetch estabelecimento.endereco")
    List<Estabelecimento> findAllWithToOneRelationships();

    @Query(
        "select estabelecimento from Estabelecimento estabelecimento left join fetch estabelecimento.endereco where estabelecimento.id =:id"
    )
    Optional<Estabelecimento> findOneWithToOneRelationships(@Param("id") UUID id);
}
