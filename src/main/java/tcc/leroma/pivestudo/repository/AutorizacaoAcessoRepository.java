package tcc.leroma.pivestudo.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import tcc.leroma.pivestudo.domain.AutorizacaoAcesso;

/**
 * Spring Data JPA repository for the AutorizacaoAcesso entity.
 */
@Repository
public interface AutorizacaoAcessoRepository extends JpaRepository<AutorizacaoAcesso, UUID> {
    default Optional<AutorizacaoAcesso> findOneWithEagerRelationships(UUID id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<AutorizacaoAcesso> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<AutorizacaoAcesso> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select autorizacaoAcesso from AutorizacaoAcesso autorizacaoAcesso left join fetch autorizacaoAcesso.pessoa left join fetch autorizacaoAcesso.estabelecimento",
        countQuery = "select count(autorizacaoAcesso) from AutorizacaoAcesso autorizacaoAcesso"
    )
    Page<AutorizacaoAcesso> findAllWithToOneRelationships(Pageable pageable);

    @Query(
        "select autorizacaoAcesso from AutorizacaoAcesso autorizacaoAcesso left join fetch autorizacaoAcesso.pessoa left join fetch autorizacaoAcesso.estabelecimento"
    )
    List<AutorizacaoAcesso> findAllWithToOneRelationships();

    @Query(
        "select autorizacaoAcesso from AutorizacaoAcesso autorizacaoAcesso left join fetch autorizacaoAcesso.pessoa left join fetch autorizacaoAcesso.estabelecimento where autorizacaoAcesso.id =:id"
    )
    Optional<AutorizacaoAcesso> findOneWithToOneRelationships(@Param("id") UUID id);
}
