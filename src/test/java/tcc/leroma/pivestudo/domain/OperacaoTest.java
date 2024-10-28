package tcc.leroma.pivestudo.domain;

import static org.assertj.core.api.Assertions.assertThat;
import static tcc.leroma.pivestudo.domain.OperacaoTestSamples.*;

import org.junit.jupiter.api.Test;
import tcc.leroma.pivestudo.web.rest.TestUtil;

class OperacaoTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Operacao.class);
        Operacao operacao1 = getOperacaoSample1();
        Operacao operacao2 = new Operacao();
        assertThat(operacao1).isNotEqualTo(operacao2);

        operacao2.setId(operacao1.getId());
        assertThat(operacao1).isEqualTo(operacao2);

        operacao2 = getOperacaoSample2();
        assertThat(operacao1).isNotEqualTo(operacao2);
    }
}
