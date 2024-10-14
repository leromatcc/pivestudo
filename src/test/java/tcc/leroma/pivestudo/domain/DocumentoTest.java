package tcc.leroma.pivestudo.domain;

import static org.assertj.core.api.Assertions.assertThat;
import static tcc.leroma.pivestudo.domain.DocumentoTestSamples.*;
import static tcc.leroma.pivestudo.domain.PessoaTestSamples.*;

import org.junit.jupiter.api.Test;
import tcc.leroma.pivestudo.web.rest.TestUtil;

class DocumentoTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Documento.class);
        Documento documento1 = getDocumentoSample1();
        Documento documento2 = new Documento();
        assertThat(documento1).isNotEqualTo(documento2);

        documento2.setId(documento1.getId());
        assertThat(documento1).isEqualTo(documento2);

        documento2 = getDocumentoSample2();
        assertThat(documento1).isNotEqualTo(documento2);
    }

    @Test
    void pessoaTest() {
        Documento documento = getDocumentoRandomSampleGenerator();
        Pessoa pessoaBack = getPessoaRandomSampleGenerator();

        documento.setPessoa(pessoaBack);
        assertThat(documento.getPessoa()).isEqualTo(pessoaBack);

        documento.pessoa(null);
        assertThat(documento.getPessoa()).isNull();
    }
}
