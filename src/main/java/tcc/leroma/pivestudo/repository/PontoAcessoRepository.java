package tcc.leroma.pivestudo.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import tcc.leroma.pivestudo.domain.PontoAcesso;

/**
 * Spring Data JPA repository for the PontoAcesso entity.
 */
@Repository
public interface PontoAcessoRepository extends JpaRepository<PontoAcesso, UUID> {
    default Optional<PontoAcesso> findOneWithEagerRelationships(UUID id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<PontoAcesso> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<PontoAcesso> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select pontoAcesso from PontoAcesso pontoAcesso left join fetch pontoAcesso.estabelecimento",
        countQuery = "select count(pontoAcesso) from PontoAcesso pontoAcesso"
    )
    Page<PontoAcesso> findAllWithToOneRelationships(Pageable pageable);

    @Query("select pontoAcesso from PontoAcesso pontoAcesso left join fetch pontoAcesso.estabelecimento")
    List<PontoAcesso> findAllWithToOneRelationships();

    @Query("select pontoAcesso from PontoAcesso pontoAcesso left join fetch pontoAcesso.estabelecimento where pontoAcesso.id =:id")
    Optional<PontoAcesso> findOneWithToOneRelationships(@Param("id") UUID id);
}
