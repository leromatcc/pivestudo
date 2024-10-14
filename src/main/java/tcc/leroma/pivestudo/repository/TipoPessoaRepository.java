package tcc.leroma.pivestudo.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import tcc.leroma.pivestudo.domain.TipoPessoa;

/**
 * Spring Data JPA repository for the TipoPessoa entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TipoPessoaRepository extends JpaRepository<TipoPessoa, Long> {}
