package tcc.leroma.pivestudo.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.UUID;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import tcc.leroma.pivestudo.domain.enumeration.ClassificaAutomovel;

/**
 * A TipoAutomovel.
 */
@Entity
@Table(name = "tipo_automovel")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class TipoAutomovel implements Serializable {

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
    @Enumerated(EnumType.STRING)
    @Column(name = "grupo", nullable = false)
    private ClassificaAutomovel grupo;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public UUID getId() {
        return this.id;
    }

    public TipoAutomovel id(UUID id) {
        this.setId(id);
        return this;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getDescricao() {
        return this.descricao;
    }

    public TipoAutomovel descricao(String descricao) {
        this.setDescricao(descricao);
        return this;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public ClassificaAutomovel getGrupo() {
        return this.grupo;
    }

    public TipoAutomovel grupo(ClassificaAutomovel grupo) {
        this.setGrupo(grupo);
        return this;
    }

    public void setGrupo(ClassificaAutomovel grupo) {
        this.grupo = grupo;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof TipoAutomovel)) {
            return false;
        }
        return getId() != null && getId().equals(((TipoAutomovel) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "TipoAutomovel{" +
            "id=" + getId() +
            ", descricao='" + getDescricao() + "'" +
            ", grupo='" + getGrupo() + "'" +
            "}";
    }
}
