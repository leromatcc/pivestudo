package tcc.leroma.pivestudo.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static tcc.leroma.pivestudo.domain.AutorizacaoAcessoAsserts.*;
import static tcc.leroma.pivestudo.web.rest.TestUtil.createUpdateProxyForBean;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityManager;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.UUID;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import tcc.leroma.pivestudo.IntegrationTest;
import tcc.leroma.pivestudo.domain.AutorizacaoAcesso;
import tcc.leroma.pivestudo.domain.Estabelecimento;
import tcc.leroma.pivestudo.domain.Pessoa;
import tcc.leroma.pivestudo.domain.enumeration.StatusAutorizacao;
import tcc.leroma.pivestudo.repository.AutorizacaoAcessoRepository;

/**
 * Integration tests for the {@link AutorizacaoAcessoResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class AutorizacaoAcessoResourceIT {

    private static final String DEFAULT_DESCRICAO = "AAAAAAAAAA";
    private static final String UPDATED_DESCRICAO = "BBBBBBBBBB";

    private static final Instant DEFAULT_DATA_INICIAL = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATA_INICIAL = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_DATA_FINAL = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATA_FINAL = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final StatusAutorizacao DEFAULT_STATUS = StatusAutorizacao.ATIVO;
    private static final StatusAutorizacao UPDATED_STATUS = StatusAutorizacao.INATIVO;

    private static final String ENTITY_API_URL = "/api/autorizacao-acessos";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private ObjectMapper om;

    @Autowired
    private AutorizacaoAcessoRepository autorizacaoAcessoRepository;

    @Mock
    private AutorizacaoAcessoRepository autorizacaoAcessoRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAutorizacaoAcessoMockMvc;

    private AutorizacaoAcesso autorizacaoAcesso;

    private AutorizacaoAcesso insertedAutorizacaoAcesso;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AutorizacaoAcesso createEntity(EntityManager em) {
        AutorizacaoAcesso autorizacaoAcesso = new AutorizacaoAcesso()
            .descricao(DEFAULT_DESCRICAO)
            .dataInicial(DEFAULT_DATA_INICIAL)
            .dataFinal(DEFAULT_DATA_FINAL)
            .status(DEFAULT_STATUS);
        // Add required entity
        Pessoa pessoa;
        if (TestUtil.findAll(em, Pessoa.class).isEmpty()) {
            pessoa = PessoaResourceIT.createEntity(em);
            em.persist(pessoa);
            em.flush();
        } else {
            pessoa = TestUtil.findAll(em, Pessoa.class).get(0);
        }
        autorizacaoAcesso.setPessoa(pessoa);
        // Add required entity
        Estabelecimento estabelecimento;
        if (TestUtil.findAll(em, Estabelecimento.class).isEmpty()) {
            estabelecimento = EstabelecimentoResourceIT.createEntity(em);
            em.persist(estabelecimento);
            em.flush();
        } else {
            estabelecimento = TestUtil.findAll(em, Estabelecimento.class).get(0);
        }
        autorizacaoAcesso.setEstabelecimento(estabelecimento);
        return autorizacaoAcesso;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AutorizacaoAcesso createUpdatedEntity(EntityManager em) {
        AutorizacaoAcesso updatedAutorizacaoAcesso = new AutorizacaoAcesso()
            .descricao(UPDATED_DESCRICAO)
            .dataInicial(UPDATED_DATA_INICIAL)
            .dataFinal(UPDATED_DATA_FINAL)
            .status(UPDATED_STATUS);
        // Add required entity
        Pessoa pessoa;
        if (TestUtil.findAll(em, Pessoa.class).isEmpty()) {
            pessoa = PessoaResourceIT.createUpdatedEntity(em);
            em.persist(pessoa);
            em.flush();
        } else {
            pessoa = TestUtil.findAll(em, Pessoa.class).get(0);
        }
        updatedAutorizacaoAcesso.setPessoa(pessoa);
        // Add required entity
        Estabelecimento estabelecimento;
        if (TestUtil.findAll(em, Estabelecimento.class).isEmpty()) {
            estabelecimento = EstabelecimentoResourceIT.createUpdatedEntity(em);
            em.persist(estabelecimento);
            em.flush();
        } else {
            estabelecimento = TestUtil.findAll(em, Estabelecimento.class).get(0);
        }
        updatedAutorizacaoAcesso.setEstabelecimento(estabelecimento);
        return updatedAutorizacaoAcesso;
    }

    @BeforeEach
    public void initTest() {
        autorizacaoAcesso = createEntity(em);
    }

    @AfterEach
    public void cleanup() {
        if (insertedAutorizacaoAcesso != null) {
            autorizacaoAcessoRepository.delete(insertedAutorizacaoAcesso);
            insertedAutorizacaoAcesso = null;
        }
    }

    @Test
    @Transactional
    void createAutorizacaoAcesso() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the AutorizacaoAcesso
        var returnedAutorizacaoAcesso = om.readValue(
            restAutorizacaoAcessoMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(autorizacaoAcesso)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            AutorizacaoAcesso.class
        );

        // Validate the AutorizacaoAcesso in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertAutorizacaoAcessoUpdatableFieldsEquals(returnedAutorizacaoAcesso, getPersistedAutorizacaoAcesso(returnedAutorizacaoAcesso));

        insertedAutorizacaoAcesso = returnedAutorizacaoAcesso;
    }

    @Test
    @Transactional
    void createAutorizacaoAcessoWithExistingId() throws Exception {
        // Create the AutorizacaoAcesso with an existing ID
        insertedAutorizacaoAcesso = autorizacaoAcessoRepository.saveAndFlush(autorizacaoAcesso);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAutorizacaoAcessoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(autorizacaoAcesso)))
            .andExpect(status().isBadRequest());

        // Validate the AutorizacaoAcesso in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkDescricaoIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        autorizacaoAcesso.setDescricao(null);

        // Create the AutorizacaoAcesso, which fails.

        restAutorizacaoAcessoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(autorizacaoAcesso)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkDataInicialIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        autorizacaoAcesso.setDataInicial(null);

        // Create the AutorizacaoAcesso, which fails.

        restAutorizacaoAcessoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(autorizacaoAcesso)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkDataFinalIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        autorizacaoAcesso.setDataFinal(null);

        // Create the AutorizacaoAcesso, which fails.

        restAutorizacaoAcessoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(autorizacaoAcesso)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkStatusIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        autorizacaoAcesso.setStatus(null);

        // Create the AutorizacaoAcesso, which fails.

        restAutorizacaoAcessoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(autorizacaoAcesso)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllAutorizacaoAcessos() throws Exception {
        // Initialize the database
        insertedAutorizacaoAcesso = autorizacaoAcessoRepository.saveAndFlush(autorizacaoAcesso);

        // Get all the autorizacaoAcessoList
        restAutorizacaoAcessoMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(autorizacaoAcesso.getId().toString())))
            .andExpect(jsonPath("$.[*].descricao").value(hasItem(DEFAULT_DESCRICAO)))
            .andExpect(jsonPath("$.[*].dataInicial").value(hasItem(DEFAULT_DATA_INICIAL.toString())))
            .andExpect(jsonPath("$.[*].dataFinal").value(hasItem(DEFAULT_DATA_FINAL.toString())))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllAutorizacaoAcessosWithEagerRelationshipsIsEnabled() throws Exception {
        when(autorizacaoAcessoRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restAutorizacaoAcessoMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(autorizacaoAcessoRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllAutorizacaoAcessosWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(autorizacaoAcessoRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restAutorizacaoAcessoMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(autorizacaoAcessoRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getAutorizacaoAcesso() throws Exception {
        // Initialize the database
        insertedAutorizacaoAcesso = autorizacaoAcessoRepository.saveAndFlush(autorizacaoAcesso);

        // Get the autorizacaoAcesso
        restAutorizacaoAcessoMockMvc
            .perform(get(ENTITY_API_URL_ID, autorizacaoAcesso.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(autorizacaoAcesso.getId().toString()))
            .andExpect(jsonPath("$.descricao").value(DEFAULT_DESCRICAO))
            .andExpect(jsonPath("$.dataInicial").value(DEFAULT_DATA_INICIAL.toString()))
            .andExpect(jsonPath("$.dataFinal").value(DEFAULT_DATA_FINAL.toString()))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS.toString()));
    }

    @Test
    @Transactional
    void getNonExistingAutorizacaoAcesso() throws Exception {
        // Get the autorizacaoAcesso
        restAutorizacaoAcessoMockMvc.perform(get(ENTITY_API_URL_ID, UUID.randomUUID().toString())).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingAutorizacaoAcesso() throws Exception {
        // Initialize the database
        insertedAutorizacaoAcesso = autorizacaoAcessoRepository.saveAndFlush(autorizacaoAcesso);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the autorizacaoAcesso
        AutorizacaoAcesso updatedAutorizacaoAcesso = autorizacaoAcessoRepository.findById(autorizacaoAcesso.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedAutorizacaoAcesso are not directly saved in db
        em.detach(updatedAutorizacaoAcesso);
        updatedAutorizacaoAcesso
            .descricao(UPDATED_DESCRICAO)
            .dataInicial(UPDATED_DATA_INICIAL)
            .dataFinal(UPDATED_DATA_FINAL)
            .status(UPDATED_STATUS);

        restAutorizacaoAcessoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAutorizacaoAcesso.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedAutorizacaoAcesso))
            )
            .andExpect(status().isOk());

        // Validate the AutorizacaoAcesso in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedAutorizacaoAcessoToMatchAllProperties(updatedAutorizacaoAcesso);
    }

    @Test
    @Transactional
    void putNonExistingAutorizacaoAcesso() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        autorizacaoAcesso.setId(UUID.randomUUID());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAutorizacaoAcessoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, autorizacaoAcesso.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(autorizacaoAcesso))
            )
            .andExpect(status().isBadRequest());

        // Validate the AutorizacaoAcesso in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAutorizacaoAcesso() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        autorizacaoAcesso.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAutorizacaoAcessoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(autorizacaoAcesso))
            )
            .andExpect(status().isBadRequest());

        // Validate the AutorizacaoAcesso in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAutorizacaoAcesso() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        autorizacaoAcesso.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAutorizacaoAcessoMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(autorizacaoAcesso)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the AutorizacaoAcesso in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAutorizacaoAcessoWithPatch() throws Exception {
        // Initialize the database
        insertedAutorizacaoAcesso = autorizacaoAcessoRepository.saveAndFlush(autorizacaoAcesso);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the autorizacaoAcesso using partial update
        AutorizacaoAcesso partialUpdatedAutorizacaoAcesso = new AutorizacaoAcesso();
        partialUpdatedAutorizacaoAcesso.setId(autorizacaoAcesso.getId());

        restAutorizacaoAcessoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAutorizacaoAcesso.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedAutorizacaoAcesso))
            )
            .andExpect(status().isOk());

        // Validate the AutorizacaoAcesso in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertAutorizacaoAcessoUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedAutorizacaoAcesso, autorizacaoAcesso),
            getPersistedAutorizacaoAcesso(autorizacaoAcesso)
        );
    }

    @Test
    @Transactional
    void fullUpdateAutorizacaoAcessoWithPatch() throws Exception {
        // Initialize the database
        insertedAutorizacaoAcesso = autorizacaoAcessoRepository.saveAndFlush(autorizacaoAcesso);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the autorizacaoAcesso using partial update
        AutorizacaoAcesso partialUpdatedAutorizacaoAcesso = new AutorizacaoAcesso();
        partialUpdatedAutorizacaoAcesso.setId(autorizacaoAcesso.getId());

        partialUpdatedAutorizacaoAcesso
            .descricao(UPDATED_DESCRICAO)
            .dataInicial(UPDATED_DATA_INICIAL)
            .dataFinal(UPDATED_DATA_FINAL)
            .status(UPDATED_STATUS);

        restAutorizacaoAcessoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAutorizacaoAcesso.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedAutorizacaoAcesso))
            )
            .andExpect(status().isOk());

        // Validate the AutorizacaoAcesso in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertAutorizacaoAcessoUpdatableFieldsEquals(
            partialUpdatedAutorizacaoAcesso,
            getPersistedAutorizacaoAcesso(partialUpdatedAutorizacaoAcesso)
        );
    }

    @Test
    @Transactional
    void patchNonExistingAutorizacaoAcesso() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        autorizacaoAcesso.setId(UUID.randomUUID());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAutorizacaoAcessoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, autorizacaoAcesso.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(autorizacaoAcesso))
            )
            .andExpect(status().isBadRequest());

        // Validate the AutorizacaoAcesso in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAutorizacaoAcesso() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        autorizacaoAcesso.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAutorizacaoAcessoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(autorizacaoAcesso))
            )
            .andExpect(status().isBadRequest());

        // Validate the AutorizacaoAcesso in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAutorizacaoAcesso() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        autorizacaoAcesso.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAutorizacaoAcessoMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(autorizacaoAcesso)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the AutorizacaoAcesso in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAutorizacaoAcesso() throws Exception {
        // Initialize the database
        insertedAutorizacaoAcesso = autorizacaoAcessoRepository.saveAndFlush(autorizacaoAcesso);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the autorizacaoAcesso
        restAutorizacaoAcessoMockMvc
            .perform(delete(ENTITY_API_URL_ID, autorizacaoAcesso.getId().toString()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return autorizacaoAcessoRepository.count();
    }

    protected void assertIncrementedRepositoryCount(long countBefore) {
        assertThat(countBefore + 1).isEqualTo(getRepositoryCount());
    }

    protected void assertDecrementedRepositoryCount(long countBefore) {
        assertThat(countBefore - 1).isEqualTo(getRepositoryCount());
    }

    protected void assertSameRepositoryCount(long countBefore) {
        assertThat(countBefore).isEqualTo(getRepositoryCount());
    }

    protected AutorizacaoAcesso getPersistedAutorizacaoAcesso(AutorizacaoAcesso autorizacaoAcesso) {
        return autorizacaoAcessoRepository.findById(autorizacaoAcesso.getId()).orElseThrow();
    }

    protected void assertPersistedAutorizacaoAcessoToMatchAllProperties(AutorizacaoAcesso expectedAutorizacaoAcesso) {
        assertAutorizacaoAcessoAllPropertiesEquals(expectedAutorizacaoAcesso, getPersistedAutorizacaoAcesso(expectedAutorizacaoAcesso));
    }

    protected void assertPersistedAutorizacaoAcessoToMatchUpdatableProperties(AutorizacaoAcesso expectedAutorizacaoAcesso) {
        assertAutorizacaoAcessoAllUpdatablePropertiesEquals(
            expectedAutorizacaoAcesso,
            getPersistedAutorizacaoAcesso(expectedAutorizacaoAcesso)
        );
    }
}
