package tcc.leroma.pivestudo.domain;

import static org.assertj.core.api.Assertions.assertThat;
import static tcc.leroma.pivestudo.domain.AutomovelTestSamples.*;
import static tcc.leroma.pivestudo.domain.PessoaTestSamples.*;
import static tcc.leroma.pivestudo.domain.TipoAutomovelTestSamples.*;

import org.junit.jupiter.api.Test;
import tcc.leroma.pivestudo.web.rest.TestUtil;

class AutomovelTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Automovel.class);
        Automovel automovel1 = getAutomovelSample1();
        Automovel automovel2 = new Automovel();
        assertThat(automovel1).isNotEqualTo(automovel2);

        automovel2.setId(automovel1.getId());
        assertThat(automovel1).isEqualTo(automovel2);

        automovel2 = getAutomovelSample2();
        assertThat(automovel1).isNotEqualTo(automovel2);
    }

    @Test
    void tipoAutomovelTest() {
        Automovel automovel = getAutomovelRandomSampleGenerator();
        TipoAutomovel tipoAutomovelBack = getTipoAutomovelRandomSampleGenerator();

        automovel.setTipoAutomovel(tipoAutomovelBack);
        assertThat(automovel.getTipoAutomovel()).isEqualTo(tipoAutomovelBack);

        automovel.tipoAutomovel(null);
        assertThat(automovel.getTipoAutomovel()).isNull();
    }

    @Test
    void pessoaTest() {
        Automovel automovel = getAutomovelRandomSampleGenerator();
        Pessoa pessoaBack = getPessoaRandomSampleGenerator();

        automovel.setPessoa(pessoaBack);
        assertThat(automovel.getPessoa()).isEqualTo(pessoaBack);

        automovel.pessoa(null);
        assertThat(automovel.getPessoa()).isNull();
    }
}
