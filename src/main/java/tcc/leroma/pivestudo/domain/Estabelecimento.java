package tcc.leroma.pivestudo.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

/**
 * A Estabelecimento.
 */
@Entity
@Table(name = "estabelecimento")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Estabelecimento implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue
    @JdbcTypeCode(SqlTypes.VARCHAR)
    @Column(name = "id", length = 36)
    private UUID id;

    @NotNull
    @Column(name = "descricao", nullable = false)
    private String descricao;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = { "pessoa" }, allowSetters = true)
    private Endereco endereco;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "estabelecimento")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "estabelecimento", "cameras" }, allowSetters = true)
    private Set<PontoAcesso> pontoAcessos = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public UUID getId() {
        return this.id;
    }

    public Estabelecimento id(UUID id) {
        this.setId(id);
        return this;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getDescricao() {
        return this.descricao;
    }

    public Estabelecimento descricao(String descricao) {
        this.setDescricao(descricao);
        return this;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public Endereco getEndereco() {
        return this.endereco;
    }

    public void setEndereco(Endereco endereco) {
        this.endereco = endereco;
    }

    public Estabelecimento endereco(Endereco endereco) {
        this.setEndereco(endereco);
        return this;
    }

    public Set<PontoAcesso> getPontoAcessos() {
        return this.pontoAcessos;
    }

    public void setPontoAcessos(Set<PontoAcesso> pontoAcessos) {
        if (this.pontoAcessos != null) {
            this.pontoAcessos.forEach(i -> i.setEstabelecimento(null));
        }
        if (pontoAcessos != null) {
            pontoAcessos.forEach(i -> i.setEstabelecimento(this));
        }
        this.pontoAcessos = pontoAcessos;
    }

    public Estabelecimento pontoAcessos(Set<PontoAcesso> pontoAcessos) {
        this.setPontoAcessos(pontoAcessos);
        return this;
    }

    public Estabelecimento addPontoAcesso(PontoAcesso pontoAcesso) {
        this.pontoAcessos.add(pontoAcesso);
        pontoAcesso.setEstabelecimento(this);
        return this;
    }

    public Estabelecimento removePontoAcesso(PontoAcesso pontoAcesso) {
        this.pontoAcessos.remove(pontoAcesso);
        pontoAcesso.setEstabelecimento(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Estabelecimento)) {
            return false;
        }
        return getId() != null && getId().equals(((Estabelecimento) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Estabelecimento{" +
            "id=" + getId() +
            ", descricao='" + getDescricao() + "'" +
            "}";
    }
}
