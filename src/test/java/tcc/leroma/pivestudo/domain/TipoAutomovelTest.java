package tcc.leroma.pivestudo.domain;

import static org.assertj.core.api.Assertions.assertThat;
import static tcc.leroma.pivestudo.domain.TipoAutomovelTestSamples.*;

import org.junit.jupiter.api.Test;
import tcc.leroma.pivestudo.web.rest.TestUtil;

class TipoAutomovelTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(TipoAutomovel.class);
        TipoAutomovel tipoAutomovel1 = getTipoAutomovelSample1();
        TipoAutomovel tipoAutomovel2 = new TipoAutomovel();
        assertThat(tipoAutomovel1).isNotEqualTo(tipoAutomovel2);

        tipoAutomovel2.setId(tipoAutomovel1.getId());
        assertThat(tipoAutomovel1).isEqualTo(tipoAutomovel2);

        tipoAutomovel2 = getTipoAutomovelSample2();
        assertThat(tipoAutomovel1).isNotEqualTo(tipoAutomovel2);
    }
}
