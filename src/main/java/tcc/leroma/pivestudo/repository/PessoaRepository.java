package tcc.leroma.pivestudo.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import tcc.leroma.pivestudo.domain.Pessoa;

/**
 * Spring Data JPA repository for the Pessoa entity.
 */
@Repository
public interface PessoaRepository extends JpaRepository<Pessoa, UUID> {
    default Optional<Pessoa> findOneWithEagerRelationships(UUID id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Pessoa> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Pessoa> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select pessoa from Pessoa pessoa left join fetch pessoa.user left join fetch pessoa.tipoPessoa",
        countQuery = "select count(pessoa) from Pessoa pessoa"
    )
    Page<Pessoa> findAllWithToOneRelationships(Pageable pageable);

    @Query("select pessoa from Pessoa pessoa left join fetch pessoa.user left join fetch pessoa.tipoPessoa")
    List<Pessoa> findAllWithToOneRelationships();

    @Query("select pessoa from Pessoa pessoa left join fetch pessoa.user left join fetch pessoa.tipoPessoa where pessoa.id =:id")
    Optional<Pessoa> findOneWithToOneRelationships(@Param("id") UUID id);
}
