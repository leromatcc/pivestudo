package tcc.leroma.pivestudo.domain;

import static org.assertj.core.api.Assertions.assertThat;
import static tcc.leroma.pivestudo.domain.EnderecoTestSamples.*;
import static tcc.leroma.pivestudo.domain.EstabelecimentoTestSamples.*;
import static tcc.leroma.pivestudo.domain.PontoAcessoTestSamples.*;

import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;
import tcc.leroma.pivestudo.web.rest.TestUtil;

class EstabelecimentoTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Estabelecimento.class);
        Estabelecimento estabelecimento1 = getEstabelecimentoSample1();
        Estabelecimento estabelecimento2 = new Estabelecimento();
        assertThat(estabelecimento1).isNotEqualTo(estabelecimento2);

        estabelecimento2.setId(estabelecimento1.getId());
        assertThat(estabelecimento1).isEqualTo(estabelecimento2);

        estabelecimento2 = getEstabelecimentoSample2();
        assertThat(estabelecimento1).isNotEqualTo(estabelecimento2);
    }

    @Test
    void enderecoTest() {
        Estabelecimento estabelecimento = getEstabelecimentoRandomSampleGenerator();
        Endereco enderecoBack = getEnderecoRandomSampleGenerator();

        estabelecimento.setEndereco(enderecoBack);
        assertThat(estabelecimento.getEndereco()).isEqualTo(enderecoBack);

        estabelecimento.endereco(null);
        assertThat(estabelecimento.getEndereco()).isNull();
    }

    @Test
    void pontoAcessoTest() {
        Estabelecimento estabelecimento = getEstabelecimentoRandomSampleGenerator();
        PontoAcesso pontoAcessoBack = getPontoAcessoRandomSampleGenerator();

        estabelecimento.addPontoAcesso(pontoAcessoBack);
        assertThat(estabelecimento.getPontoAcessos()).containsOnly(pontoAcessoBack);
        assertThat(pontoAcessoBack.getEstabelecimento()).isEqualTo(estabelecimento);

        estabelecimento.removePontoAcesso(pontoAcessoBack);
        assertThat(estabelecimento.getPontoAcessos()).doesNotContain(pontoAcessoBack);
        assertThat(pontoAcessoBack.getEstabelecimento()).isNull();

        estabelecimento.pontoAcessos(new HashSet<>(Set.of(pontoAcessoBack)));
        assertThat(estabelecimento.getPontoAcessos()).containsOnly(pontoAcessoBack);
        assertThat(pontoAcessoBack.getEstabelecimento()).isEqualTo(estabelecimento);

        estabelecimento.setPontoAcessos(new HashSet<>());
        assertThat(estabelecimento.getPontoAcessos()).doesNotContain(pontoAcessoBack);
        assertThat(pontoAcessoBack.getEstabelecimento()).isNull();
    }
}
