package tcc.leroma.pivestudo.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import tcc.leroma.pivestudo.domain.enumeration.ClassificaPessoa;

/**
 * A TipoPessoa.
 */
@Entity
@Table(name = "tipo_pessoa")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class TipoPessoa implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "descricao", nullable = false)
    private String descricao;

    @Enumerated(EnumType.STRING)
    @Column(name = "grupo")
    private ClassificaPessoa grupo;

    @JsonIgnoreProperties(
        value = { "user", "tipoPessoa", "telefones", "documentos", "enderecos", "loteBlocoApartamentos", "automovels", "nomes" },
        allowSetters = true
    )
    @OneToOne(fetch = FetchType.LAZY, mappedBy = "tipoPessoa")
    private Pessoa pessoa;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public TipoPessoa id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescricao() {
        return this.descricao;
    }

    public TipoPessoa descricao(String descricao) {
        this.setDescricao(descricao);
        return this;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public ClassificaPessoa getGrupo() {
        return this.grupo;
    }

    public TipoPessoa grupo(ClassificaPessoa grupo) {
        this.setGrupo(grupo);
        return this;
    }

    public void setGrupo(ClassificaPessoa grupo) {
        this.grupo = grupo;
    }

    public Pessoa getPessoa() {
        return this.pessoa;
    }

    public void setPessoa(Pessoa pessoa) {
        if (this.pessoa != null) {
            this.pessoa.setTipoPessoa(null);
        }
        if (pessoa != null) {
            pessoa.setTipoPessoa(this);
        }
        this.pessoa = pessoa;
    }

    public TipoPessoa pessoa(Pessoa pessoa) {
        this.setPessoa(pessoa);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof TipoPessoa)) {
            return false;
        }
        return getId() != null && getId().equals(((TipoPessoa) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "TipoPessoa{" +
            "id=" + getId() +
            ", descricao='" + getDescricao() + "'" +
            ", grupo='" + getGrupo() + "'" +
            "}";
    }
}
