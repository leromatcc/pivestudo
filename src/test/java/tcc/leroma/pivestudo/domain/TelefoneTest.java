package tcc.leroma.pivestudo.domain;

import static org.assertj.core.api.Assertions.assertThat;
import static tcc.leroma.pivestudo.domain.PessoaTestSamples.*;
import static tcc.leroma.pivestudo.domain.TelefoneTestSamples.*;

import org.junit.jupiter.api.Test;
import tcc.leroma.pivestudo.web.rest.TestUtil;

class TelefoneTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Telefone.class);
        Telefone telefone1 = getTelefoneSample1();
        Telefone telefone2 = new Telefone();
        assertThat(telefone1).isNotEqualTo(telefone2);

        telefone2.setId(telefone1.getId());
        assertThat(telefone1).isEqualTo(telefone2);

        telefone2 = getTelefoneSample2();
        assertThat(telefone1).isNotEqualTo(telefone2);
    }

    @Test
    void pessoaTest() {
        Telefone telefone = getTelefoneRandomSampleGenerator();
        Pessoa pessoaBack = getPessoaRandomSampleGenerator();

        telefone.setPessoa(pessoaBack);
        assertThat(telefone.getPessoa()).isEqualTo(pessoaBack);

        telefone.pessoa(null);
        assertThat(telefone.getPessoa()).isNull();
    }
}
