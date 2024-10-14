package tcc.leroma.pivestudo.domain;

import static org.assertj.core.api.Assertions.assertThat;
import static tcc.leroma.pivestudo.domain.AutomovelTestSamples.*;
import static tcc.leroma.pivestudo.domain.AutorizacaoAcessoTestSamples.*;
import static tcc.leroma.pivestudo.domain.ImagemTestSamples.*;
import static tcc.leroma.pivestudo.domain.PontoAcessoTestSamples.*;
import static tcc.leroma.pivestudo.domain.RegistroAcessoTestSamples.*;

import org.junit.jupiter.api.Test;
import tcc.leroma.pivestudo.web.rest.TestUtil;

class RegistroAcessoTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(RegistroAcesso.class);
        RegistroAcesso registroAcesso1 = getRegistroAcessoSample1();
        RegistroAcesso registroAcesso2 = new RegistroAcesso();
        assertThat(registroAcesso1).isNotEqualTo(registroAcesso2);

        registroAcesso2.setId(registroAcesso1.getId());
        assertThat(registroAcesso1).isEqualTo(registroAcesso2);

        registroAcesso2 = getRegistroAcessoSample2();
        assertThat(registroAcesso1).isNotEqualTo(registroAcesso2);
    }

    @Test
    void pontoAcessoTest() {
        RegistroAcesso registroAcesso = getRegistroAcessoRandomSampleGenerator();
        PontoAcesso pontoAcessoBack = getPontoAcessoRandomSampleGenerator();

        registroAcesso.setPontoAcesso(pontoAcessoBack);
        assertThat(registroAcesso.getPontoAcesso()).isEqualTo(pontoAcessoBack);

        registroAcesso.pontoAcesso(null);
        assertThat(registroAcesso.getPontoAcesso()).isNull();
    }

    @Test
    void automovelTest() {
        RegistroAcesso registroAcesso = getRegistroAcessoRandomSampleGenerator();
        Automovel automovelBack = getAutomovelRandomSampleGenerator();

        registroAcesso.setAutomovel(automovelBack);
        assertThat(registroAcesso.getAutomovel()).isEqualTo(automovelBack);

        registroAcesso.automovel(null);
        assertThat(registroAcesso.getAutomovel()).isNull();
    }

    @Test
    void autorizacaoAcessoTest() {
        RegistroAcesso registroAcesso = getRegistroAcessoRandomSampleGenerator();
        AutorizacaoAcesso autorizacaoAcessoBack = getAutorizacaoAcessoRandomSampleGenerator();

        registroAcesso.setAutorizacaoAcesso(autorizacaoAcessoBack);
        assertThat(registroAcesso.getAutorizacaoAcesso()).isEqualTo(autorizacaoAcessoBack);

        registroAcesso.autorizacaoAcesso(null);
        assertThat(registroAcesso.getAutorizacaoAcesso()).isNull();
    }

    @Test
    void imagemTest() {
        RegistroAcesso registroAcesso = getRegistroAcessoRandomSampleGenerator();
        Imagem imagemBack = getImagemRandomSampleGenerator();

        registroAcesso.setImagem(imagemBack);
        assertThat(registroAcesso.getImagem()).isEqualTo(imagemBack);
        assertThat(imagemBack.getRegistroAcesso()).isEqualTo(registroAcesso);

        registroAcesso.imagem(null);
        assertThat(registroAcesso.getImagem()).isNull();
        assertThat(imagemBack.getRegistroAcesso()).isNull();
    }
}
