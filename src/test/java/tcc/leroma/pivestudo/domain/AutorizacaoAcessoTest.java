package tcc.leroma.pivestudo.domain;

import static org.assertj.core.api.Assertions.assertThat;
import static tcc.leroma.pivestudo.domain.AutorizacaoAcessoTestSamples.*;
import static tcc.leroma.pivestudo.domain.EstabelecimentoTestSamples.*;
import static tcc.leroma.pivestudo.domain.PessoaTestSamples.*;

import org.junit.jupiter.api.Test;
import tcc.leroma.pivestudo.web.rest.TestUtil;

class AutorizacaoAcessoTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(AutorizacaoAcesso.class);
        AutorizacaoAcesso autorizacaoAcesso1 = getAutorizacaoAcessoSample1();
        AutorizacaoAcesso autorizacaoAcesso2 = new AutorizacaoAcesso();
        assertThat(autorizacaoAcesso1).isNotEqualTo(autorizacaoAcesso2);

        autorizacaoAcesso2.setId(autorizacaoAcesso1.getId());
        assertThat(autorizacaoAcesso1).isEqualTo(autorizacaoAcesso2);

        autorizacaoAcesso2 = getAutorizacaoAcessoSample2();
        assertThat(autorizacaoAcesso1).isNotEqualTo(autorizacaoAcesso2);
    }

    @Test
    void pessoaTest() {
        AutorizacaoAcesso autorizacaoAcesso = getAutorizacaoAcessoRandomSampleGenerator();
        Pessoa pessoaBack = getPessoaRandomSampleGenerator();

        autorizacaoAcesso.setPessoa(pessoaBack);
        assertThat(autorizacaoAcesso.getPessoa()).isEqualTo(pessoaBack);

        autorizacaoAcesso.pessoa(null);
        assertThat(autorizacaoAcesso.getPessoa()).isNull();
    }

    @Test
    void estabelecimentoTest() {
        AutorizacaoAcesso autorizacaoAcesso = getAutorizacaoAcessoRandomSampleGenerator();
        Estabelecimento estabelecimentoBack = getEstabelecimentoRandomSampleGenerator();

        autorizacaoAcesso.setEstabelecimento(estabelecimentoBack);
        assertThat(autorizacaoAcesso.getEstabelecimento()).isEqualTo(estabelecimentoBack);

        autorizacaoAcesso.estabelecimento(null);
        assertThat(autorizacaoAcesso.getEstabelecimento()).isNull();
    }
}
