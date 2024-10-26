package tcc.leroma.pivestudo.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import java.util.UUID;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

/**
 * A Imagem.
 */
@Entity
@Table(name = "imagem")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Imagem implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue
    @JdbcTypeCode(SqlTypes.VARCHAR)
    @Column(name = "id", length = 36)
    private UUID id;

    @Lob
    @Column(name = "arquivo_imagem", nullable = false)
    private byte[] arquivoImagem;

    @NotNull
    @Column(name = "arquivo_imagem_content_type", nullable = false)
    private String arquivoImagemContentType;

    @NotNull
    @Column(name = "nome", nullable = false)
    private String nome;

    @NotNull
    @Column(name = "caminho", nullable = false)
    private String caminho;

    @Column(name = "descricao")
    private String descricao;

    @Column(name = "cadeia_detectada")
    private String cadeiaDetectada;

    @Column(name = "date_analise")
    private Instant dateAnalise;

    @JsonIgnoreProperties(value = { "pontoAcesso", "automovel", "autorizacaoAcesso", "imagem" }, allowSetters = true)
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @NotNull
    @JoinColumn(unique = true)
    private RegistroAcesso registroAcesso;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public UUID getId() {
        return this.id;
    }

    public Imagem id(UUID id) {
        this.setId(id);
        return this;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public byte[] getArquivoImagem() {
        return this.arquivoImagem;
    }

    public Imagem arquivoImagem(byte[] arquivoImagem) {
        this.setArquivoImagem(arquivoImagem);
        return this;
    }

    public void setArquivoImagem(byte[] arquivoImagem) {
        this.arquivoImagem = arquivoImagem;
    }

    public String getArquivoImagemContentType() {
        return this.arquivoImagemContentType;
    }

    public Imagem arquivoImagemContentType(String arquivoImagemContentType) {
        this.arquivoImagemContentType = arquivoImagemContentType;
        return this;
    }

    public void setArquivoImagemContentType(String arquivoImagemContentType) {
        this.arquivoImagemContentType = arquivoImagemContentType;
    }

    public String getNome() {
        return this.nome;
    }

    public Imagem nome(String nome) {
        this.setNome(nome);
        return this;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getCaminho() {
        return this.caminho;
    }

    public Imagem caminho(String caminho) {
        this.setCaminho(caminho);
        return this;
    }

    public void setCaminho(String caminho) {
        this.caminho = caminho;
    }

    public String getDescricao() {
        return this.descricao;
    }

    public Imagem descricao(String descricao) {
        this.setDescricao(descricao);
        return this;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public String getCadeiaDetectada() {
        return this.cadeiaDetectada;
    }

    public Imagem cadeiaDetectada(String cadeiaDetectada) {
        this.setCadeiaDetectada(cadeiaDetectada);
        return this;
    }

    public void setCadeiaDetectada(String cadeiaDetectada) {
        this.cadeiaDetectada = cadeiaDetectada;
    }

    public Instant getDateAnalise() {
        return this.dateAnalise;
    }

    public Imagem dateAnalise(Instant dateAnalise) {
        this.setDateAnalise(dateAnalise);
        return this;
    }

    public void setDateAnalise(Instant dateAnalise) {
        this.dateAnalise = dateAnalise;
    }

    public RegistroAcesso getRegistroAcesso() {
        return this.registroAcesso;
    }

    public void setRegistroAcesso(RegistroAcesso registroAcesso) {
        this.registroAcesso = registroAcesso;
    }

    public Imagem registroAcesso(RegistroAcesso registroAcesso) {
        this.setRegistroAcesso(registroAcesso);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Imagem)) {
            return false;
        }
        return getId() != null && getId().equals(((Imagem) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Imagem{" +
            "id=" + getId() +
            ", arquivoImagem='" + getArquivoImagem() + "'" +
            ", arquivoImagemContentType='" + getArquivoImagemContentType() + "'" +
            ", nome='" + getNome() + "'" +
            ", caminho='" + getCaminho() + "'" +
            ", descricao='" + getDescricao() + "'" +
            ", cadeiaDetectada='" + getCadeiaDetectada() + "'" +
            ", dateAnalise='" + getDateAnalise() + "'" +
            "}";
    }
}
