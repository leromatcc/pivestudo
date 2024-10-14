package tcc.leroma.pivestudo.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static tcc.leroma.pivestudo.domain.PontoAcessoAsserts.*;
import static tcc.leroma.pivestudo.web.rest.TestUtil.createUpdateProxyForBean;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityManager;
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
import tcc.leroma.pivestudo.domain.Estabelecimento;
import tcc.leroma.pivestudo.domain.PontoAcesso;
import tcc.leroma.pivestudo.repository.PontoAcessoRepository;

/**
 * Integration tests for the {@link PontoAcessoResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class PontoAcessoResourceIT {

    private static final String DEFAULT_DESCRICAO = "AAAAAAAAAA";
    private static final String UPDATED_DESCRICAO = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/ponto-acessos";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private ObjectMapper om;

    @Autowired
    private PontoAcessoRepository pontoAcessoRepository;

    @Mock
    private PontoAcessoRepository pontoAcessoRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPontoAcessoMockMvc;

    private PontoAcesso pontoAcesso;

    private PontoAcesso insertedPontoAcesso;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PontoAcesso createEntity(EntityManager em) {
        PontoAcesso pontoAcesso = new PontoAcesso().descricao(DEFAULT_DESCRICAO);
        // Add required entity
        Estabelecimento estabelecimento;
        if (TestUtil.findAll(em, Estabelecimento.class).isEmpty()) {
            estabelecimento = EstabelecimentoResourceIT.createEntity(em);
            em.persist(estabelecimento);
            em.flush();
        } else {
            estabelecimento = TestUtil.findAll(em, Estabelecimento.class).get(0);
        }
        pontoAcesso.setEstabelecimento(estabelecimento);
        return pontoAcesso;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PontoAcesso createUpdatedEntity(EntityManager em) {
        PontoAcesso updatedPontoAcesso = new PontoAcesso().descricao(UPDATED_DESCRICAO);
        // Add required entity
        Estabelecimento estabelecimento;
        if (TestUtil.findAll(em, Estabelecimento.class).isEmpty()) {
            estabelecimento = EstabelecimentoResourceIT.createUpdatedEntity(em);
            em.persist(estabelecimento);
            em.flush();
        } else {
            estabelecimento = TestUtil.findAll(em, Estabelecimento.class).get(0);
        }
        updatedPontoAcesso.setEstabelecimento(estabelecimento);
        return updatedPontoAcesso;
    }

    @BeforeEach
    public void initTest() {
        pontoAcesso = createEntity(em);
    }

    @AfterEach
    public void cleanup() {
        if (insertedPontoAcesso != null) {
            pontoAcessoRepository.delete(insertedPontoAcesso);
            insertedPontoAcesso = null;
        }
    }

    @Test
    @Transactional
    void createPontoAcesso() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the PontoAcesso
        var returnedPontoAcesso = om.readValue(
            restPontoAcessoMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(pontoAcesso)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            PontoAcesso.class
        );

        // Validate the PontoAcesso in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertPontoAcessoUpdatableFieldsEquals(returnedPontoAcesso, getPersistedPontoAcesso(returnedPontoAcesso));

        insertedPontoAcesso = returnedPontoAcesso;
    }

    @Test
    @Transactional
    void createPontoAcessoWithExistingId() throws Exception {
        // Create the PontoAcesso with an existing ID
        insertedPontoAcesso = pontoAcessoRepository.saveAndFlush(pontoAcesso);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restPontoAcessoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(pontoAcesso)))
            .andExpect(status().isBadRequest());

        // Validate the PontoAcesso in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkDescricaoIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        pontoAcesso.setDescricao(null);

        // Create the PontoAcesso, which fails.

        restPontoAcessoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(pontoAcesso)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllPontoAcessos() throws Exception {
        // Initialize the database
        insertedPontoAcesso = pontoAcessoRepository.saveAndFlush(pontoAcesso);

        // Get all the pontoAcessoList
        restPontoAcessoMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(pontoAcesso.getId().toString())))
            .andExpect(jsonPath("$.[*].descricao").value(hasItem(DEFAULT_DESCRICAO)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllPontoAcessosWithEagerRelationshipsIsEnabled() throws Exception {
        when(pontoAcessoRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restPontoAcessoMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(pontoAcessoRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllPontoAcessosWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(pontoAcessoRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restPontoAcessoMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(pontoAcessoRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getPontoAcesso() throws Exception {
        // Initialize the database
        insertedPontoAcesso = pontoAcessoRepository.saveAndFlush(pontoAcesso);

        // Get the pontoAcesso
        restPontoAcessoMockMvc
            .perform(get(ENTITY_API_URL_ID, pontoAcesso.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(pontoAcesso.getId().toString()))
            .andExpect(jsonPath("$.descricao").value(DEFAULT_DESCRICAO));
    }

    @Test
    @Transactional
    void getNonExistingPontoAcesso() throws Exception {
        // Get the pontoAcesso
        restPontoAcessoMockMvc.perform(get(ENTITY_API_URL_ID, UUID.randomUUID().toString())).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingPontoAcesso() throws Exception {
        // Initialize the database
        insertedPontoAcesso = pontoAcessoRepository.saveAndFlush(pontoAcesso);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the pontoAcesso
        PontoAcesso updatedPontoAcesso = pontoAcessoRepository.findById(pontoAcesso.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedPontoAcesso are not directly saved in db
        em.detach(updatedPontoAcesso);
        updatedPontoAcesso.descricao(UPDATED_DESCRICAO);

        restPontoAcessoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedPontoAcesso.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedPontoAcesso))
            )
            .andExpect(status().isOk());

        // Validate the PontoAcesso in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedPontoAcessoToMatchAllProperties(updatedPontoAcesso);
    }

    @Test
    @Transactional
    void putNonExistingPontoAcesso() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        pontoAcesso.setId(UUID.randomUUID());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPontoAcessoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, pontoAcesso.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(pontoAcesso))
            )
            .andExpect(status().isBadRequest());

        // Validate the PontoAcesso in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchPontoAcesso() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        pontoAcesso.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPontoAcessoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(pontoAcesso))
            )
            .andExpect(status().isBadRequest());

        // Validate the PontoAcesso in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamPontoAcesso() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        pontoAcesso.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPontoAcessoMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(pontoAcesso)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the PontoAcesso in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdatePontoAcessoWithPatch() throws Exception {
        // Initialize the database
        insertedPontoAcesso = pontoAcessoRepository.saveAndFlush(pontoAcesso);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the pontoAcesso using partial update
        PontoAcesso partialUpdatedPontoAcesso = new PontoAcesso();
        partialUpdatedPontoAcesso.setId(pontoAcesso.getId());

        restPontoAcessoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPontoAcesso.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedPontoAcesso))
            )
            .andExpect(status().isOk());

        // Validate the PontoAcesso in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPontoAcessoUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedPontoAcesso, pontoAcesso),
            getPersistedPontoAcesso(pontoAcesso)
        );
    }

    @Test
    @Transactional
    void fullUpdatePontoAcessoWithPatch() throws Exception {
        // Initialize the database
        insertedPontoAcesso = pontoAcessoRepository.saveAndFlush(pontoAcesso);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the pontoAcesso using partial update
        PontoAcesso partialUpdatedPontoAcesso = new PontoAcesso();
        partialUpdatedPontoAcesso.setId(pontoAcesso.getId());

        partialUpdatedPontoAcesso.descricao(UPDATED_DESCRICAO);

        restPontoAcessoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPontoAcesso.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedPontoAcesso))
            )
            .andExpect(status().isOk());

        // Validate the PontoAcesso in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPontoAcessoUpdatableFieldsEquals(partialUpdatedPontoAcesso, getPersistedPontoAcesso(partialUpdatedPontoAcesso));
    }

    @Test
    @Transactional
    void patchNonExistingPontoAcesso() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        pontoAcesso.setId(UUID.randomUUID());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPontoAcessoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, pontoAcesso.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(pontoAcesso))
            )
            .andExpect(status().isBadRequest());

        // Validate the PontoAcesso in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchPontoAcesso() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        pontoAcesso.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPontoAcessoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(pontoAcesso))
            )
            .andExpect(status().isBadRequest());

        // Validate the PontoAcesso in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamPontoAcesso() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        pontoAcesso.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPontoAcessoMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(pontoAcesso)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the PontoAcesso in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deletePontoAcesso() throws Exception {
        // Initialize the database
        insertedPontoAcesso = pontoAcessoRepository.saveAndFlush(pontoAcesso);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the pontoAcesso
        restPontoAcessoMockMvc
            .perform(delete(ENTITY_API_URL_ID, pontoAcesso.getId().toString()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return pontoAcessoRepository.count();
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

    protected PontoAcesso getPersistedPontoAcesso(PontoAcesso pontoAcesso) {
        return pontoAcessoRepository.findById(pontoAcesso.getId()).orElseThrow();
    }

    protected void assertPersistedPontoAcessoToMatchAllProperties(PontoAcesso expectedPontoAcesso) {
        assertPontoAcessoAllPropertiesEquals(expectedPontoAcesso, getPersistedPontoAcesso(expectedPontoAcesso));
    }

    protected void assertPersistedPontoAcessoToMatchUpdatableProperties(PontoAcesso expectedPontoAcesso) {
        assertPontoAcessoAllUpdatablePropertiesEquals(expectedPontoAcesso, getPersistedPontoAcesso(expectedPontoAcesso));
    }
}
