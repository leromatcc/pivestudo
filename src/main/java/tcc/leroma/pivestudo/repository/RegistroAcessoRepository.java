package tcc.leroma.pivestudo.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import tcc.leroma.pivestudo.domain.RegistroAcesso;

/**
 * Spring Data JPA repository for the RegistroAcesso entity.
 */
@Repository
public interface RegistroAcessoRepository extends JpaRepository<RegistroAcesso, UUID> {
    default Optional<RegistroAcesso> findOneWithEagerRelationships(UUID id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<RegistroAcesso> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<RegistroAcesso> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select registroAcesso from RegistroAcesso registroAcesso left join fetch registroAcesso.pontoAcesso left join fetch registroAcesso.automovel left join fetch registroAcesso.autorizacaoAcesso",
        countQuery = "select count(registroAcesso) from RegistroAcesso registroAcesso"
    )
    Page<RegistroAcesso> findAllWithToOneRelationships(Pageable pageable);

    @Query(
        "select registroAcesso from RegistroAcesso registroAcesso left join fetch registroAcesso.pontoAcesso left join fetch registroAcesso.automovel left join fetch registroAcesso.autorizacaoAcesso"
    )
    List<RegistroAcesso> findAllWithToOneRelationships();

    @Query(
        "select registroAcesso from RegistroAcesso registroAcesso left join fetch registroAcesso.pontoAcesso left join fetch registroAcesso.automovel left join fetch registroAcesso.autorizacaoAcesso where registroAcesso.id =:id"
    )
    Optional<RegistroAcesso> findOneWithToOneRelationships(@Param("id") UUID id);
}
