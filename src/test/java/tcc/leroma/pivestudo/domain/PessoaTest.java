package tcc.leroma.pivestudo.domain;

import static org.assertj.core.api.Assertions.assertThat;
import static tcc.leroma.pivestudo.domain.AutomovelTestSamples.*;
import static tcc.leroma.pivestudo.domain.AutorizacaoAcessoTestSamples.*;
import static tcc.leroma.pivestudo.domain.DocumentoTestSamples.*;
import static tcc.leroma.pivestudo.domain.EnderecoTestSamples.*;
import static tcc.leroma.pivestudo.domain.LoteBlocoApartamentoTestSamples.*;
import static tcc.leroma.pivestudo.domain.PessoaTestSamples.*;
import static tcc.leroma.pivestudo.domain.TelefoneTestSamples.*;
import static tcc.leroma.pivestudo.domain.TipoPessoaTestSamples.*;

import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;
import tcc.leroma.pivestudo.web.rest.TestUtil;

class PessoaTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Pessoa.class);
        Pessoa pessoa1 = getPessoaSample1();
        Pessoa pessoa2 = new Pessoa();
        assertThat(pessoa1).isNotEqualTo(pessoa2);

        pessoa2.setId(pessoa1.getId());
        assertThat(pessoa1).isEqualTo(pessoa2);

        pessoa2 = getPessoaSample2();
        assertThat(pessoa1).isNotEqualTo(pessoa2);
    }

    @Test
    void tipoPessoaTest() {
        Pessoa pessoa = getPessoaRandomSampleGenerator();
        TipoPessoa tipoPessoaBack = getTipoPessoaRandomSampleGenerator();

        pessoa.setTipoPessoa(tipoPessoaBack);
        assertThat(pessoa.getTipoPessoa()).isEqualTo(tipoPessoaBack);

        pessoa.tipoPessoa(null);
        assertThat(pessoa.getTipoPessoa()).isNull();
    }

    @Test
    void telefoneTest() {
        Pessoa pessoa = getPessoaRandomSampleGenerator();
        Telefone telefoneBack = getTelefoneRandomSampleGenerator();

        pessoa.addTelefone(telefoneBack);
        assertThat(pessoa.getTelefones()).containsOnly(telefoneBack);
        assertThat(telefoneBack.getPessoa()).isEqualTo(pessoa);

        pessoa.removeTelefone(telefoneBack);
        assertThat(pessoa.getTelefones()).doesNotContain(telefoneBack);
        assertThat(telefoneBack.getPessoa()).isNull();

        pessoa.telefones(new HashSet<>(Set.of(telefoneBack)));
        assertThat(pessoa.getTelefones()).containsOnly(telefoneBack);
        assertThat(telefoneBack.getPessoa()).isEqualTo(pessoa);

        pessoa.setTelefones(new HashSet<>());
        assertThat(pessoa.getTelefones()).doesNotContain(telefoneBack);
        assertThat(telefoneBack.getPessoa()).isNull();
    }

    @Test
    void documentoTest() {
        Pessoa pessoa = getPessoaRandomSampleGenerator();
        Documento documentoBack = getDocumentoRandomSampleGenerator();

        pessoa.addDocumento(documentoBack);
        assertThat(pessoa.getDocumentos()).containsOnly(documentoBack);
        assertThat(documentoBack.getPessoa()).isEqualTo(pessoa);

        pessoa.removeDocumento(documentoBack);
        assertThat(pessoa.getDocumentos()).doesNotContain(documentoBack);
        assertThat(documentoBack.getPessoa()).isNull();

        pessoa.documentos(new HashSet<>(Set.of(documentoBack)));
        assertThat(pessoa.getDocumentos()).containsOnly(documentoBack);
        assertThat(documentoBack.getPessoa()).isEqualTo(pessoa);

        pessoa.setDocumentos(new HashSet<>());
        assertThat(pessoa.getDocumentos()).doesNotContain(documentoBack);
        assertThat(documentoBack.getPessoa()).isNull();
    }

    @Test
    void enderecoTest() {
        Pessoa pessoa = getPessoaRandomSampleGenerator();
        Endereco enderecoBack = getEnderecoRandomSampleGenerator();

        pessoa.addEndereco(enderecoBack);
        assertThat(pessoa.getEnderecos()).containsOnly(enderecoBack);
        assertThat(enderecoBack.getPessoa()).isEqualTo(pessoa);

        pessoa.removeEndereco(enderecoBack);
        assertThat(pessoa.getEnderecos()).doesNotContain(enderecoBack);
        assertThat(enderecoBack.getPessoa()).isNull();

        pessoa.enderecos(new HashSet<>(Set.of(enderecoBack)));
        assertThat(pessoa.getEnderecos()).containsOnly(enderecoBack);
        assertThat(enderecoBack.getPessoa()).isEqualTo(pessoa);

        pessoa.setEnderecos(new HashSet<>());
        assertThat(pessoa.getEnderecos()).doesNotContain(enderecoBack);
        assertThat(enderecoBack.getPessoa()).isNull();
    }

    @Test
    void loteBlocoApartamentoTest() {
        Pessoa pessoa = getPessoaRandomSampleGenerator();
        LoteBlocoApartamento loteBlocoApartamentoBack = getLoteBlocoApartamentoRandomSampleGenerator();

        pessoa.addLoteBlocoApartamento(loteBlocoApartamentoBack);
        assertThat(pessoa.getLoteBlocoApartamentos()).containsOnly(loteBlocoApartamentoBack);
        assertThat(loteBlocoApartamentoBack.getPessoa()).isEqualTo(pessoa);

        pessoa.removeLoteBlocoApartamento(loteBlocoApartamentoBack);
        assertThat(pessoa.getLoteBlocoApartamentos()).doesNotContain(loteBlocoApartamentoBack);
        assertThat(loteBlocoApartamentoBack.getPessoa()).isNull();

        pessoa.loteBlocoApartamentos(new HashSet<>(Set.of(loteBlocoApartamentoBack)));
        assertThat(pessoa.getLoteBlocoApartamentos()).containsOnly(loteBlocoApartamentoBack);
        assertThat(loteBlocoApartamentoBack.getPessoa()).isEqualTo(pessoa);

        pessoa.setLoteBlocoApartamentos(new HashSet<>());
        assertThat(pessoa.getLoteBlocoApartamentos()).doesNotContain(loteBlocoApartamentoBack);
        assertThat(loteBlocoApartamentoBack.getPessoa()).isNull();
    }

    @Test
    void automovelTest() {
        Pessoa pessoa = getPessoaRandomSampleGenerator();
        Automovel automovelBack = getAutomovelRandomSampleGenerator();

        pessoa.addAutomovel(automovelBack);
        assertThat(pessoa.getAutomovels()).containsOnly(automovelBack);
        assertThat(automovelBack.getPessoa()).isEqualTo(pessoa);

        pessoa.removeAutomovel(automovelBack);
        assertThat(pessoa.getAutomovels()).doesNotContain(automovelBack);
        assertThat(automovelBack.getPessoa()).isNull();

        pessoa.automovels(new HashSet<>(Set.of(automovelBack)));
        assertThat(pessoa.getAutomovels()).containsOnly(automovelBack);
        assertThat(automovelBack.getPessoa()).isEqualTo(pessoa);

        pessoa.setAutomovels(new HashSet<>());
        assertThat(pessoa.getAutomovels()).doesNotContain(automovelBack);
        assertThat(automovelBack.getPessoa()).isNull();
    }

    @Test
    void nomeTest() {
        Pessoa pessoa = getPessoaRandomSampleGenerator();
        AutorizacaoAcesso autorizacaoAcessoBack = getAutorizacaoAcessoRandomSampleGenerator();

        pessoa.addNome(autorizacaoAcessoBack);
        assertThat(pessoa.getNomes()).containsOnly(autorizacaoAcessoBack);
        assertThat(autorizacaoAcessoBack.getPessoa()).isEqualTo(pessoa);

        pessoa.removeNome(autorizacaoAcessoBack);
        assertThat(pessoa.getNomes()).doesNotContain(autorizacaoAcessoBack);
        assertThat(autorizacaoAcessoBack.getPessoa()).isNull();

        pessoa.nomes(new HashSet<>(Set.of(autorizacaoAcessoBack)));
        assertThat(pessoa.getNomes()).containsOnly(autorizacaoAcessoBack);
        assertThat(autorizacaoAcessoBack.getPessoa()).isEqualTo(pessoa);

        pessoa.setNomes(new HashSet<>());
        assertThat(pessoa.getNomes()).doesNotContain(autorizacaoAcessoBack);
        assertThat(autorizacaoAcessoBack.getPessoa()).isNull();
    }
}
