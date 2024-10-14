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
 * A Pessoa.
 */
@Entity
@Table(name = "pessoa")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Pessoa implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue
    @JdbcTypeCode(SqlTypes.VARCHAR)
    @Column(name = "id", length = 36)
    private UUID id;

    @NotNull
    @Size(min = 3)
    @Column(name = "nome", nullable = false)
    private String nome;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @NotNull
    @JoinColumn(unique = true)
    private User user;

    @JsonIgnoreProperties(value = { "pessoa" }, allowSetters = true)
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @NotNull
    @JoinColumn(unique = true)
    private TipoPessoa tipoPessoa;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "pessoa")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "pessoa" }, allowSetters = true)
    private Set<Telefone> telefones = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "pessoa")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "pessoa" }, allowSetters = true)
    private Set<Documento> documentos = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "pessoa")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "pessoa" }, allowSetters = true)
    private Set<Endereco> enderecos = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "pessoa")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "endereco", "pessoa" }, allowSetters = true)
    private Set<LoteBlocoApartamento> loteBlocoApartamentos = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "pessoa")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "tipoAutomovel", "pessoa" }, allowSetters = true)
    private Set<Automovel> automovels = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "pessoa")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "pessoa", "estabelecimento" }, allowSetters = true)
    private Set<AutorizacaoAcesso> nomes = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public UUID getId() {
        return this.id;
    }

    public Pessoa id(UUID id) {
        this.setId(id);
        return this;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getNome() {
        return this.nome;
    }

    public Pessoa nome(String nome) {
        this.setNome(nome);
        return this;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Pessoa user(User user) {
        this.setUser(user);
        return this;
    }

    public TipoPessoa getTipoPessoa() {
        return this.tipoPessoa;
    }

    public void setTipoPessoa(TipoPessoa tipoPessoa) {
        this.tipoPessoa = tipoPessoa;
    }

    public Pessoa tipoPessoa(TipoPessoa tipoPessoa) {
        this.setTipoPessoa(tipoPessoa);
        return this;
    }

    public Set<Telefone> getTelefones() {
        return this.telefones;
    }

    public void setTelefones(Set<Telefone> telefones) {
        if (this.telefones != null) {
            this.telefones.forEach(i -> i.setPessoa(null));
        }
        if (telefones != null) {
            telefones.forEach(i -> i.setPessoa(this));
        }
        this.telefones = telefones;
    }

    public Pessoa telefones(Set<Telefone> telefones) {
        this.setTelefones(telefones);
        return this;
    }

    public Pessoa addTelefone(Telefone telefone) {
        this.telefones.add(telefone);
        telefone.setPessoa(this);
        return this;
    }

    public Pessoa removeTelefone(Telefone telefone) {
        this.telefones.remove(telefone);
        telefone.setPessoa(null);
        return this;
    }

    public Set<Documento> getDocumentos() {
        return this.documentos;
    }

    public void setDocumentos(Set<Documento> documentos) {
        if (this.documentos != null) {
            this.documentos.forEach(i -> i.setPessoa(null));
        }
        if (documentos != null) {
            documentos.forEach(i -> i.setPessoa(this));
        }
        this.documentos = documentos;
    }

    public Pessoa documentos(Set<Documento> documentos) {
        this.setDocumentos(documentos);
        return this;
    }

    public Pessoa addDocumento(Documento documento) {
        this.documentos.add(documento);
        documento.setPessoa(this);
        return this;
    }

    public Pessoa removeDocumento(Documento documento) {
        this.documentos.remove(documento);
        documento.setPessoa(null);
        return this;
    }

    public Set<Endereco> getEnderecos() {
        return this.enderecos;
    }

    public void setEnderecos(Set<Endereco> enderecos) {
        if (this.enderecos != null) {
            this.enderecos.forEach(i -> i.setPessoa(null));
        }
        if (enderecos != null) {
            enderecos.forEach(i -> i.setPessoa(this));
        }
        this.enderecos = enderecos;
    }

    public Pessoa enderecos(Set<Endereco> enderecos) {
        this.setEnderecos(enderecos);
        return this;
    }

    public Pessoa addEndereco(Endereco endereco) {
        this.enderecos.add(endereco);
        endereco.setPessoa(this);
        return this;
    }

    public Pessoa removeEndereco(Endereco endereco) {
        this.enderecos.remove(endereco);
        endereco.setPessoa(null);
        return this;
    }

    public Set<LoteBlocoApartamento> getLoteBlocoApartamentos() {
        return this.loteBlocoApartamentos;
    }

    public void setLoteBlocoApartamentos(Set<LoteBlocoApartamento> loteBlocoApartamentos) {
        if (this.loteBlocoApartamentos != null) {
            this.loteBlocoApartamentos.forEach(i -> i.setPessoa(null));
        }
        if (loteBlocoApartamentos != null) {
            loteBlocoApartamentos.forEach(i -> i.setPessoa(this));
        }
        this.loteBlocoApartamentos = loteBlocoApartamentos;
    }

    public Pessoa loteBlocoApartamentos(Set<LoteBlocoApartamento> loteBlocoApartamentos) {
        this.setLoteBlocoApartamentos(loteBlocoApartamentos);
        return this;
    }

    public Pessoa addLoteBlocoApartamento(LoteBlocoApartamento loteBlocoApartamento) {
        this.loteBlocoApartamentos.add(loteBlocoApartamento);
        loteBlocoApartamento.setPessoa(this);
        return this;
    }

    public Pessoa removeLoteBlocoApartamento(LoteBlocoApartamento loteBlocoApartamento) {
        this.loteBlocoApartamentos.remove(loteBlocoApartamento);
        loteBlocoApartamento.setPessoa(null);
        return this;
    }

    public Set<Automovel> getAutomovels() {
        return this.automovels;
    }

    public void setAutomovels(Set<Automovel> automovels) {
        if (this.automovels != null) {
            this.automovels.forEach(i -> i.setPessoa(null));
        }
        if (automovels != null) {
            automovels.forEach(i -> i.setPessoa(this));
        }
        this.automovels = automovels;
    }

    public Pessoa automovels(Set<Automovel> automovels) {
        this.setAutomovels(automovels);
        return this;
    }

    public Pessoa addAutomovel(Automovel automovel) {
        this.automovels.add(automovel);
        automovel.setPessoa(this);
        return this;
    }

    public Pessoa removeAutomovel(Automovel automovel) {
        this.automovels.remove(automovel);
        automovel.setPessoa(null);
        return this;
    }

    public Set<AutorizacaoAcesso> getNomes() {
        return this.nomes;
    }

    public void setNomes(Set<AutorizacaoAcesso> autorizacaoAcessos) {
        if (this.nomes != null) {
            this.nomes.forEach(i -> i.setPessoa(null));
        }
        if (autorizacaoAcessos != null) {
            autorizacaoAcessos.forEach(i -> i.setPessoa(this));
        }
        this.nomes = autorizacaoAcessos;
    }

    public Pessoa nomes(Set<AutorizacaoAcesso> autorizacaoAcessos) {
        this.setNomes(autorizacaoAcessos);
        return this;
    }

    public Pessoa addNome(AutorizacaoAcesso autorizacaoAcesso) {
        this.nomes.add(autorizacaoAcesso);
        autorizacaoAcesso.setPessoa(this);
        return this;
    }

    public Pessoa removeNome(AutorizacaoAcesso autorizacaoAcesso) {
        this.nomes.remove(autorizacaoAcesso);
        autorizacaoAcesso.setPessoa(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Pessoa)) {
            return false;
        }
        return getId() != null && getId().equals(((Pessoa) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Pessoa{" +
            "id=" + getId() +
            ", nome='" + getNome() + "'" +
            "}";
    }
}
