package tcc.leroma.pivestudo.domain;

import static org.assertj.core.api.Assertions.assertThat;
import static tcc.leroma.pivestudo.domain.CameraTestSamples.*;
import static tcc.leroma.pivestudo.domain.PontoAcessoTestSamples.*;

import org.junit.jupiter.api.Test;
import tcc.leroma.pivestudo.web.rest.TestUtil;

class CameraTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Camera.class);
        Camera camera1 = getCameraSample1();
        Camera camera2 = new Camera();
        assertThat(camera1).isNotEqualTo(camera2);

        camera2.setId(camera1.getId());
        assertThat(camera1).isEqualTo(camera2);

        camera2 = getCameraSample2();
        assertThat(camera1).isNotEqualTo(camera2);
    }

    @Test
    void pontoAcessoTest() {
        Camera camera = getCameraRandomSampleGenerator();
        PontoAcesso pontoAcessoBack = getPontoAcessoRandomSampleGenerator();

        camera.setPontoAcesso(pontoAcessoBack);
        assertThat(camera.getPontoAcesso()).isEqualTo(pontoAcessoBack);

        camera.pontoAcesso(null);
        assertThat(camera.getPontoAcesso()).isNull();
    }
}
