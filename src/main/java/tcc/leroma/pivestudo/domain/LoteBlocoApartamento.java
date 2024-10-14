package tcc.leroma.pivestudo.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.UUID;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

/**
 * A LoteBlocoApartamento.
 */
@Entity
@Table(name = "lote_bloco_apartamento")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class LoteBlocoApartamento implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue
    @JdbcTypeCode(SqlTypes.VARCHAR)
    @Column(name = "id", length = 36)
    private UUID id;

    @Column(name = "bloco")
    private String bloco;

    @Column(name = "andar")
    private String andar;

    @Column(name = "numero")
    private String numero;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = { "pessoa" }, allowSetters = true)
    private Endereco endereco;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(
        value = { "user", "tipoPessoa", "telefones", "documentos", "enderecos", "loteBlocoApartamentos", "automovels", "nomes" },
        allowSetters = true
    )
    private Pessoa pessoa;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public UUID getId() {
        return this.id;
    }

    public LoteBlocoApartamento id(UUID id) {
        this.setId(id);
        return this;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getBloco() {
        return this.bloco;
    }

    public LoteBlocoApartamento bloco(String bloco) {
        this.setBloco(bloco);
        return this;
    }

    public void setBloco(String bloco) {
        this.bloco = bloco;
    }

    public String getAndar() {
        return this.andar;
    }

    public LoteBlocoApartamento andar(String andar) {
        this.setAndar(andar);
        return this;
    }

    public void setAndar(String andar) {
        this.andar = andar;
    }

    public String getNumero() {
        return this.numero;
    }

    public LoteBlocoApartamento numero(String numero) {
        this.setNumero(numero);
        return this;
    }

    public void setNumero(String numero) {
        this.numero = numero;
    }

    public Endereco getEndereco() {
        return this.endereco;
    }

    public void setEndereco(Endereco endereco) {
        this.endereco = endereco;
    }

    public LoteBlocoApartamento endereco(Endereco endereco) {
        this.setEndereco(endereco);
        return this;
    }

    public Pessoa getPessoa() {
        return this.pessoa;
    }

    public void setPessoa(Pessoa pessoa) {
        this.pessoa = pessoa;
    }

    public LoteBlocoApartamento pessoa(Pessoa pessoa) {
        this.setPessoa(pessoa);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof LoteBlocoApartamento)) {
            return false;
        }
        return getId() != null && getId().equals(((LoteBlocoApartamento) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "LoteBlocoApartamento{" +
            "id=" + getId() +
            ", bloco='" + getBloco() + "'" +
            ", andar='" + getAndar() + "'" +
            ", numero='" + getNumero() + "'" +
            "}";
    }
}
