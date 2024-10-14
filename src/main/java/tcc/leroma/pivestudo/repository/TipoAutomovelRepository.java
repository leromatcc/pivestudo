package tcc.leroma.pivestudo.repository;

import java.util.UUID;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import tcc.leroma.pivestudo.domain.TipoAutomovel;

/**
 * Spring Data JPA repository for the TipoAutomovel entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TipoAutomovelRepository extends JpaRepository<TipoAutomovel, UUID> {}
