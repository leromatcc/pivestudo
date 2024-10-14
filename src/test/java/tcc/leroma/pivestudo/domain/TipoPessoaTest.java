package tcc.leroma.pivestudo.domain;

import static org.assertj.core.api.Assertions.assertThat;
import static tcc.leroma.pivestudo.domain.PessoaTestSamples.*;
import static tcc.leroma.pivestudo.domain.TipoPessoaTestSamples.*;

import org.junit.jupiter.api.Test;
import tcc.leroma.pivestudo.web.rest.TestUtil;

class TipoPessoaTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(TipoPessoa.class);
        TipoPessoa tipoPessoa1 = getTipoPessoaSample1();
        TipoPessoa tipoPessoa2 = new TipoPessoa();
        assertThat(tipoPessoa1).isNotEqualTo(tipoPessoa2);

        tipoPessoa2.setId(tipoPessoa1.getId());
        assertThat(tipoPessoa1).isEqualTo(tipoPessoa2);

        tipoPessoa2 = getTipoPessoaSample2();
        assertThat(tipoPessoa1).isNotEqualTo(tipoPessoa2);
    }

    @Test
    void pessoaTest() {
        TipoPessoa tipoPessoa = getTipoPessoaRandomSampleGenerator();
        Pessoa pessoaBack = getPessoaRandomSampleGenerator();

        tipoPessoa.setPessoa(pessoaBack);
        assertThat(tipoPessoa.getPessoa()).isEqualTo(pessoaBack);
        assertThat(pessoaBack.getTipoPessoa()).isEqualTo(tipoPessoa);

        tipoPessoa.pessoa(null);
        assertThat(tipoPessoa.getPessoa()).isNull();
        assertThat(pessoaBack.getTipoPessoa()).isNull();
    }
}
