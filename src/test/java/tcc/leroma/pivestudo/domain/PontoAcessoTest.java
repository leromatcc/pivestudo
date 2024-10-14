package tcc.leroma.pivestudo.domain;

import static org.assertj.core.api.Assertions.assertThat;
import static tcc.leroma.pivestudo.domain.CameraTestSamples.*;
import static tcc.leroma.pivestudo.domain.EstabelecimentoTestSamples.*;
import static tcc.leroma.pivestudo.domain.PontoAcessoTestSamples.*;

import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;
import tcc.leroma.pivestudo.web.rest.TestUtil;

class PontoAcessoTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(PontoAcesso.class);
        PontoAcesso pontoAcesso1 = getPontoAcessoSample1();
        PontoAcesso pontoAcesso2 = new PontoAcesso();
        assertThat(pontoAcesso1).isNotEqualTo(pontoAcesso2);

        pontoAcesso2.setId(pontoAcesso1.getId());
        assertThat(pontoAcesso1).isEqualTo(pontoAcesso2);

        pontoAcesso2 = getPontoAcessoSample2();
        assertThat(pontoAcesso1).isNotEqualTo(pontoAcesso2);
    }

    @Test
    void estabelecimentoTest() {
        PontoAcesso pontoAcesso = getPontoAcessoRandomSampleGenerator();
        Estabelecimento estabelecimentoBack = getEstabelecimentoRandomSampleGenerator();

        pontoAcesso.setEstabelecimento(estabelecimentoBack);
        assertThat(pontoAcesso.getEstabelecimento()).isEqualTo(estabelecimentoBack);

        pontoAcesso.estabelecimento(null);
        assertThat(pontoAcesso.getEstabelecimento()).isNull();
    }

    @Test
    void cameraTest() {
        PontoAcesso pontoAcesso = getPontoAcessoRandomSampleGenerator();
        Camera cameraBack = getCameraRandomSampleGenerator();

        pontoAcesso.addCamera(cameraBack);
        assertThat(pontoAcesso.getCameras()).containsOnly(cameraBack);
        assertThat(cameraBack.getPontoAcesso()).isEqualTo(pontoAcesso);

        pontoAcesso.removeCamera(cameraBack);
        assertThat(pontoAcesso.getCameras()).doesNotContain(cameraBack);
        assertThat(cameraBack.getPontoAcesso()).isNull();

        pontoAcesso.cameras(new HashSet<>(Set.of(cameraBack)));
        assertThat(pontoAcesso.getCameras()).containsOnly(cameraBack);
        assertThat(cameraBack.getPontoAcesso()).isEqualTo(pontoAcesso);

        pontoAcesso.setCameras(new HashSet<>());
        assertThat(pontoAcesso.getCameras()).doesNotContain(cameraBack);
        assertThat(cameraBack.getPontoAcesso()).isNull();
    }
}
