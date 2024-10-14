package tcc.leroma.pivestudo.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import tcc.leroma.pivestudo.domain.LoteBlocoApartamento;

/**
 * Spring Data JPA repository for the LoteBlocoApartamento entity.
 */
@Repository
public interface LoteBlocoApartamentoRepository extends JpaRepository<LoteBlocoApartamento, UUID> {
    default Optional<LoteBlocoApartamento> findOneWithEagerRelationships(UUID id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<LoteBlocoApartamento> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<LoteBlocoApartamento> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select loteBlocoApartamento from LoteBlocoApartamento loteBlocoApartamento left join fetch loteBlocoApartamento.endereco left join fetch loteBlocoApartamento.pessoa",
        countQuery = "select count(loteBlocoApartamento) from LoteBlocoApartamento loteBlocoApartamento"
    )
    Page<LoteBlocoApartamento> findAllWithToOneRelationships(Pageable pageable);

    @Query(
        "select loteBlocoApartamento from LoteBlocoApartamento loteBlocoApartamento left join fetch loteBlocoApartamento.endereco left join fetch loteBlocoApartamento.pessoa"
    )
    List<LoteBlocoApartamento> findAllWithToOneRelationships();

    @Query(
        "select loteBlocoApartamento from LoteBlocoApartamento loteBlocoApartamento left join fetch loteBlocoApartamento.endereco left join fetch loteBlocoApartamento.pessoa where loteBlocoApartamento.id =:id"
    )
    Optional<LoteBlocoApartamento> findOneWithToOneRelationships(@Param("id") UUID id);
}
