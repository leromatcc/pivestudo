package tcc.leroma.pivestudo.domain;

import static org.assertj.core.api.Assertions.assertThat;
import static tcc.leroma.pivestudo.domain.ImagemTestSamples.*;
import static tcc.leroma.pivestudo.domain.RegistroAcessoTestSamples.*;

import org.junit.jupiter.api.Test;
import tcc.leroma.pivestudo.web.rest.TestUtil;

class ImagemTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Imagem.class);
        Imagem imagem1 = getImagemSample1();
        Imagem imagem2 = new Imagem();
        assertThat(imagem1).isNotEqualTo(imagem2);

        imagem2.setId(imagem1.getId());
        assertThat(imagem1).isEqualTo(imagem2);

        imagem2 = getImagemSample2();
        assertThat(imagem1).isNotEqualTo(imagem2);
    }

    @Test
    void registroAcessoTest() {
        Imagem imagem = getImagemRandomSampleGenerator();
        RegistroAcesso registroAcessoBack = getRegistroAcessoRandomSampleGenerator();

        imagem.setRegistroAcesso(registroAcessoBack);
        assertThat(imagem.getRegistroAcesso()).isEqualTo(registroAcessoBack);

        imagem.registroAcesso(null);
        assertThat(imagem.getRegistroAcesso()).isNull();
    }
}
