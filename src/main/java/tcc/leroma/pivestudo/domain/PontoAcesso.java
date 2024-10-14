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
 * A PontoAcesso.
 */
@Entity
@Table(name = "ponto_acesso")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class PontoAcesso implements Serializable {

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
    @JsonIgnoreProperties(value = { "endereco", "pontoAcessos" }, allowSetters = true)
    private Estabelecimento estabelecimento;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "pontoAcesso")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "pontoAcesso" }, allowSetters = true)
    private Set<Camera> cameras = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public UUID getId() {
        return this.id;
    }

    public PontoAcesso id(UUID id) {
        this.setId(id);
        return this;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getDescricao() {
        return this.descricao;
    }

    public PontoAcesso descricao(String descricao) {
        this.setDescricao(descricao);
        return this;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public Estabelecimento getEstabelecimento() {
        return this.estabelecimento;
    }

    public void setEstabelecimento(Estabelecimento estabelecimento) {
        this.estabelecimento = estabelecimento;
    }

    public PontoAcesso estabelecimento(Estabelecimento estabelecimento) {
        this.setEstabelecimento(estabelecimento);
        return this;
    }

    public Set<Camera> getCameras() {
        return this.cameras;
    }

    public void setCameras(Set<Camera> cameras) {
        if (this.cameras != null) {
            this.cameras.forEach(i -> i.setPontoAcesso(null));
        }
        if (cameras != null) {
            cameras.forEach(i -> i.setPontoAcesso(this));
        }
        this.cameras = cameras;
    }

    public PontoAcesso cameras(Set<Camera> cameras) {
        this.setCameras(cameras);
        return this;
    }

    public PontoAcesso addCamera(Camera camera) {
        this.cameras.add(camera);
        camera.setPontoAcesso(this);
        return this;
    }

    public PontoAcesso removeCamera(Camera camera) {
        this.cameras.remove(camera);
        camera.setPontoAcesso(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof PontoAcesso)) {
            return false;
        }
        return getId() != null && getId().equals(((PontoAcesso) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "PontoAcesso{" +
            "id=" + getId() +
            ", descricao='" + getDescricao() + "'" +
            "}";
    }
}
