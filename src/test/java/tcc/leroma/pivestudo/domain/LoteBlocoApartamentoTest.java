package tcc.leroma.pivestudo.domain;

import static org.assertj.core.api.Assertions.assertThat;
import static tcc.leroma.pivestudo.domain.EnderecoTestSamples.*;
import static tcc.leroma.pivestudo.domain.LoteBlocoApartamentoTestSamples.*;
import static tcc.leroma.pivestudo.domain.PessoaTestSamples.*;

import org.junit.jupiter.api.Test;
import tcc.leroma.pivestudo.web.rest.TestUtil;

class LoteBlocoApartamentoTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(LoteBlocoApartamento.class);
        LoteBlocoApartamento loteBlocoApartamento1 = getLoteBlocoApartamentoSample1();
        LoteBlocoApartamento loteBlocoApartamento2 = new LoteBlocoApartamento();
        assertThat(loteBlocoApartamento1).isNotEqualTo(loteBlocoApartamento2);

        loteBlocoApartamento2.setId(loteBlocoApartamento1.getId());
        assertThat(loteBlocoApartamento1).isEqualTo(loteBlocoApartamento2);

        loteBlocoApartamento2 = getLoteBlocoApartamentoSample2();
        assertThat(loteBlocoApartamento1).isNotEqualTo(loteBlocoApartamento2);
    }

    @Test
    void enderecoTest() {
        LoteBlocoApartamento loteBlocoApartamento = getLoteBlocoApartamentoRandomSampleGenerator();
        Endereco enderecoBack = getEnderecoRandomSampleGenerator();

        loteBlocoApartamento.setEndereco(enderecoBack);
        assertThat(loteBlocoApartamento.getEndereco()).isEqualTo(enderecoBack);

        loteBlocoApartamento.endereco(null);
        assertThat(loteBlocoApartamento.getEndereco()).isNull();
    }

    @Test
    void pessoaTest() {
        LoteBlocoApartamento loteBlocoApartamento = getLoteBlocoApartamentoRandomSampleGenerator();
        Pessoa pessoaBack = getPessoaRandomSampleGenerator();

        loteBlocoApartamento.setPessoa(pessoaBack);
        assertThat(loteBlocoApartamento.getPessoa()).isEqualTo(pessoaBack);

        loteBlocoApartamento.pessoa(null);
        assertThat(loteBlocoApartamento.getPessoa()).isNull();
    }
}
