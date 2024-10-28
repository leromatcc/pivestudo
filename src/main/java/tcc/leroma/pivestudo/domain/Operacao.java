package tcc.leroma.pivestudo.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Operacao.
 */
@Entity
@Table(name = "operacao")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Operacao implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Lob
    @Column(name = "arquivo_imagem", nullable = false)
    private byte[] arquivoImagem;

    @NotNull
    @Column(name = "arquivo_imagem_content_type", nullable = false)
    private String arquivoImagemContentType;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Operacao id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public byte[] getArquivoImagem() {
        return this.arquivoImagem;
    }

    public Operacao arquivoImagem(byte[] arquivoImagem) {
        this.setArquivoImagem(arquivoImagem);
        return this;
    }

    public void setArquivoImagem(byte[] arquivoImagem) {
        this.arquivoImagem = arquivoImagem;
    }

    public String getArquivoImagemContentType() {
        return this.arquivoImagemContentType;
    }

    public Operacao arquivoImagemContentType(String arquivoImagemContentType) {
        this.arquivoImagemContentType = arquivoImagemContentType;
        return this;
    }

    public void setArquivoImagemContentType(String arquivoImagemContentType) {
        this.arquivoImagemContentType = arquivoImagemContentType;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Operacao)) {
            return false;
        }
        return getId() != null && getId().equals(((Operacao) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Operacao{" +
            "id=" + getId() +
            ", arquivoImagem='" + getArquivoImagem() + "'" +
            ", arquivoImagemContentType='" + getArquivoImagemContentType() + "'" +
            "}";
    }
}
