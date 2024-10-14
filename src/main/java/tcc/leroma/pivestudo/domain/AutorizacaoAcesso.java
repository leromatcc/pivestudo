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
import tcc.leroma.pivestudo.domain.enumeration.StatusAutorizacao;

/**
 * A AutorizacaoAcesso.
 */
@Entity
@Table(name = "autorizacao_acesso")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class AutorizacaoAcesso implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue
    @JdbcTypeCode(SqlTypes.VARCHAR)
    @Column(name = "id", length = 36)
    private UUID id;

    @NotNull
    @Column(name = "descricao", nullable = false)
    private String descricao;

    @NotNull
    @Column(name = "data_inicial", nullable = false)
    private Instant dataInicial;

    @NotNull
    @Column(name = "data_final", nullable = false)
    private Instant dataFinal;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private StatusAutorizacao status;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(
        value = { "user", "tipoPessoa", "telefones", "documentos", "enderecos", "loteBlocoApartamentos", "automovels", "nomes" },
        allowSetters = true
    )
    private Pessoa pessoa;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = { "endereco", "pontoAcessos" }, allowSetters = true)
    private Estabelecimento estabelecimento;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public UUID getId() {
        return this.id;
    }

    public AutorizacaoAcesso id(UUID id) {
        this.setId(id);
        return this;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getDescricao() {
        return this.descricao;
    }

    public AutorizacaoAcesso descricao(String descricao) {
        this.setDescricao(descricao);
        return this;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public Instant getDataInicial() {
        return this.dataInicial;
    }

    public AutorizacaoAcesso dataInicial(Instant dataInicial) {
        this.setDataInicial(dataInicial);
        return this;
    }

    public void setDataInicial(Instant dataInicial) {
        this.dataInicial = dataInicial;
    }

    public Instant getDataFinal() {
        return this.dataFinal;
    }

    public AutorizacaoAcesso dataFinal(Instant dataFinal) {
        this.setDataFinal(dataFinal);
        return this;
    }

    public void setDataFinal(Instant dataFinal) {
        this.dataFinal = dataFinal;
    }

    public StatusAutorizacao getStatus() {
        return this.status;
    }

    public AutorizacaoAcesso status(StatusAutorizacao status) {
        this.setStatus(status);
        return this;
    }

    public void setStatus(StatusAutorizacao status) {
        this.status = status;
    }

    public Pessoa getPessoa() {
        return this.pessoa;
    }

    public void setPessoa(Pessoa pessoa) {
        this.pessoa = pessoa;
    }

    public AutorizacaoAcesso pessoa(Pessoa pessoa) {
        this.setPessoa(pessoa);
        return this;
    }

    public Estabelecimento getEstabelecimento() {
        return this.estabelecimento;
    }

    public void setEstabelecimento(Estabelecimento estabelecimento) {
        this.estabelecimento = estabelecimento;
    }

    public AutorizacaoAcesso estabelecimento(Estabelecimento estabelecimento) {
        this.setEstabelecimento(estabelecimento);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof AutorizacaoAcesso)) {
            return false;
        }
        return getId() != null && getId().equals(((AutorizacaoAcesso) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "AutorizacaoAcesso{" +
            "id=" + getId() +
            ", descricao='" + getDescricao() + "'" +
            ", dataInicial='" + getDataInicial() + "'" +
            ", dataFinal='" + getDataFinal() + "'" +
            ", status='" + getStatus() + "'" +
            "}";
    }
}
