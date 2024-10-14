package tcc.leroma.pivestudo.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import tcc.leroma.pivestudo.domain.Imagem;

/**
 * Spring Data JPA repository for the Imagem entity.
 */
@Repository
public interface ImagemRepository extends JpaRepository<Imagem, UUID> {
    default Optional<Imagem> findOneWithEagerRelationships(UUID id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Imagem> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Imagem> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select imagem from Imagem imagem left join fetch imagem.registroAcesso",
        countQuery = "select count(imagem) from Imagem imagem"
    )
    Page<Imagem> findAllWithToOneRelationships(Pageable pageable);

    @Query("select imagem from Imagem imagem left join fetch imagem.registroAcesso")
    List<Imagem> findAllWithToOneRelationships();

    @Query("select imagem from Imagem imagem left join fetch imagem.registroAcesso where imagem.id =:id")
    Optional<Imagem> findOneWithToOneRelationships(@Param("id") UUID id);
}
