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
import tcc.leroma.pivestudo.domain.enumeration.TipoAcessoAutorizado;

/**
 * A RegistroAcesso.
 */
@Entity
@Table(name = "registro_acesso")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class RegistroAcesso implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue
    @JdbcTypeCode(SqlTypes.VARCHAR)
    @Column(name = "id", length = 36)
    private UUID id;

    @NotNull
    @Column(name = "data_hora", nullable = false)
    private Instant dataHora;

    @Column(name = "cadeia_analisada")
    private String cadeiaAnalisada;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "acesso_autorizado", nullable = false)
    private TipoAcessoAutorizado acessoAutorizado;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = { "estabelecimento", "cameras" }, allowSetters = true)
    private PontoAcesso pontoAcesso;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = { "tipoAutomovel", "pessoa" }, allowSetters = true)
    private Automovel automovel;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = { "pessoa", "estabelecimento" }, allowSetters = true)
    private AutorizacaoAcesso autorizacaoAcesso;

    @JsonIgnoreProperties(value = { "registroAcesso" }, allowSetters = true)
    @OneToOne(fetch = FetchType.LAZY, mappedBy = "registroAcesso")
    private Imagem imagem;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public UUID getId() {
        return this.id;
    }

    public RegistroAcesso id(UUID id) {
        this.setId(id);
        return this;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public Instant getDataHora() {
        return this.dataHora;
    }

    public RegistroAcesso dataHora(Instant dataHora) {
        this.setDataHora(dataHora);
        return this;
    }

    public void setDataHora(Instant dataHora) {
        this.dataHora = dataHora;
    }

    public String getCadeiaAnalisada() {
        return this.cadeiaAnalisada;
    }

    public RegistroAcesso cadeiaAnalisada(String cadeiaAnalisada) {
        this.setCadeiaAnalisada(cadeiaAnalisada);
        return this;
    }

    public void setCadeiaAnalisada(String cadeiaAnalisada) {
        this.cadeiaAnalisada = cadeiaAnalisada;
    }

    public TipoAcessoAutorizado getAcessoAutorizado() {
        return this.acessoAutorizado;
    }

    public RegistroAcesso acessoAutorizado(TipoAcessoAutorizado acessoAutorizado) {
        this.setAcessoAutorizado(acessoAutorizado);
        return this;
    }

    public void setAcessoAutorizado(TipoAcessoAutorizado acessoAutorizado) {
        this.acessoAutorizado = acessoAutorizado;
    }

    public PontoAcesso getPontoAcesso() {
        return this.pontoAcesso;
    }

    public void setPontoAcesso(PontoAcesso pontoAcesso) {
        this.pontoAcesso = pontoAcesso;
    }

    public RegistroAcesso pontoAcesso(PontoAcesso pontoAcesso) {
        this.setPontoAcesso(pontoAcesso);
        return this;
    }

    public Automovel getAutomovel() {
        return this.automovel;
    }

    public void setAutomovel(Automovel automovel) {
        this.automovel = automovel;
    }

    public RegistroAcesso automovel(Automovel automovel) {
        this.setAutomovel(automovel);
        return this;
    }

    public AutorizacaoAcesso getAutorizacaoAcesso() {
        return this.autorizacaoAcesso;
    }

    public void setAutorizacaoAcesso(AutorizacaoAcesso autorizacaoAcesso) {
        this.autorizacaoAcesso = autorizacaoAcesso;
    }

    public RegistroAcesso autorizacaoAcesso(AutorizacaoAcesso autorizacaoAcesso) {
        this.setAutorizacaoAcesso(autorizacaoAcesso);
        return this;
    }

    public Imagem getImagem() {
        return this.imagem;
    }

    public void setImagem(Imagem imagem) {
        if (this.imagem != null) {
            this.imagem.setRegistroAcesso(null);
        }
        if (imagem != null) {
            imagem.setRegistroAcesso(this);
        }
        this.imagem = imagem;
    }

    public RegistroAcesso imagem(Imagem imagem) {
        this.setImagem(imagem);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof RegistroAcesso)) {
            return false;
        }
        return getId() != null && getId().equals(((RegistroAcesso) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "RegistroAcesso{" +
            "id=" + getId() +
            ", dataHora='" + getDataHora() + "'" +
            ", cadeiaAnalisada='" + getCadeiaAnalisada() + "'" +
            ", acessoAutorizado='" + getAcessoAutorizado() + "'" +
            "}";
    }
}
