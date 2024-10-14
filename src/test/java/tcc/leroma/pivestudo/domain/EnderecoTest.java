package tcc.leroma.pivestudo.domain;

import static org.assertj.core.api.Assertions.assertThat;
import static tcc.leroma.pivestudo.domain.EnderecoTestSamples.*;
import static tcc.leroma.pivestudo.domain.PessoaTestSamples.*;

import org.junit.jupiter.api.Test;
import tcc.leroma.pivestudo.web.rest.TestUtil;

class EnderecoTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Endereco.class);
        Endereco endereco1 = getEnderecoSample1();
        Endereco endereco2 = new Endereco();
        assertThat(endereco1).isNotEqualTo(endereco2);

        endereco2.setId(endereco1.getId());
        assertThat(endereco1).isEqualTo(endereco2);

        endereco2 = getEnderecoSample2();
        assertThat(endereco1).isNotEqualTo(endereco2);
    }

    @Test
    void pessoaTest() {
        Endereco endereco = getEnderecoRandomSampleGenerator();
        Pessoa pessoaBack = getPessoaRandomSampleGenerator();

        endereco.setPessoa(pessoaBack);
        assertThat(endereco.getPessoa()).isEqualTo(pessoaBack);

        endereco.pessoa(null);
        assertThat(endereco.getPessoa()).isNull();
    }
}
