package tcc.leroma.pivestudo.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import tcc.leroma.pivestudo.domain.Operacao;

/**
 * Spring Data JPA repository for the Operacao entity.
 */
@SuppressWarnings("unused")
@Repository
public interface OperacaoRepository extends JpaRepository<Operacao, Long> {}
