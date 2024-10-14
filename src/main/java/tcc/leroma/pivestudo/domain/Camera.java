package tcc.leroma.pivestudo.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Camera.
 */
@Entity
@Table(name = "camera")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Camera implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "descricao", nullable = false)
    private String descricao;

    @NotNull
    @Column(name = "endereco_rede", nullable = false)
    private String enderecoRede;

    @Column(name = "api")
    private String api;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = { "estabelecimento", "cameras" }, allowSetters = true)
    private PontoAcesso pontoAcesso;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Camera id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescricao() {
        return this.descricao;
    }

    public Camera descricao(String descricao) {
        this.setDescricao(descricao);
        return this;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public String getEnderecoRede() {
        return this.enderecoRede;
    }

    public Camera enderecoRede(String enderecoRede) {
        this.setEnderecoRede(enderecoRede);
        return this;
    }

    public void setEnderecoRede(String enderecoRede) {
        this.enderecoRede = enderecoRede;
    }

    public String getApi() {
        return this.api;
    }

    public Camera api(String api) {
        this.setApi(api);
        return this;
    }

    public void setApi(String api) {
        this.api = api;
    }

    public PontoAcesso getPontoAcesso() {
        return this.pontoAcesso;
    }

    public void setPontoAcesso(PontoAcesso pontoAcesso) {
        this.pontoAcesso = pontoAcesso;
    }

    public Camera pontoAcesso(PontoAcesso pontoAcesso) {
        this.setPontoAcesso(pontoAcesso);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Camera)) {
            return false;
        }
        return getId() != null && getId().equals(((Camera) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Camera{" +
            "id=" + getId() +
            ", descricao='" + getDescricao() + "'" +
            ", enderecoRede='" + getEnderecoRede() + "'" +
            ", api='" + getApi() + "'" +
            "}";
    }
}
