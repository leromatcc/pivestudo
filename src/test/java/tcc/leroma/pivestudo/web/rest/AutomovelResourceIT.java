package tcc.leroma.pivestudo.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static tcc.leroma.pivestudo.domain.AutomovelAsserts.*;
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
import tcc.leroma.pivestudo.domain.Automovel;
import tcc.leroma.pivestudo.domain.Pessoa;
import tcc.leroma.pivestudo.domain.TipoAutomovel;
import tcc.leroma.pivestudo.repository.AutomovelRepository;

/**
 * Integration tests for the {@link AutomovelResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class AutomovelResourceIT {

    private static final String DEFAULT_PLACA = "AAAAAAAAAA";
    private static final String UPDATED_PLACA = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRICAO = "AAAAAAAAAA";
    private static final String UPDATED_DESCRICAO = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/automovels";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private ObjectMapper om;

    @Autowired
    private AutomovelRepository automovelRepository;

    @Mock
    private AutomovelRepository automovelRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAutomovelMockMvc;

    private Automovel automovel;

    private Automovel insertedAutomovel;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Automovel createEntity(EntityManager em) {
        Automovel automovel = new Automovel().placa(DEFAULT_PLACA).descricao(DEFAULT_DESCRICAO);
        // Add required entity
        TipoAutomovel tipoAutomovel;
        if (TestUtil.findAll(em, TipoAutomovel.class).isEmpty()) {
            tipoAutomovel = TipoAutomovelResourceIT.createEntity();
            em.persist(tipoAutomovel);
            em.flush();
        } else {
            tipoAutomovel = TestUtil.findAll(em, TipoAutomovel.class).get(0);
        }
        automovel.setTipoAutomovel(tipoAutomovel);
        // Add required entity
        Pessoa pessoa;
        if (TestUtil.findAll(em, Pessoa.class).isEmpty()) {
            pessoa = PessoaResourceIT.createEntity(em);
            em.persist(pessoa);
            em.flush();
        } else {
            pessoa = TestUtil.findAll(em, Pessoa.class).get(0);
        }
        automovel.setPessoa(pessoa);
        return automovel;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Automovel createUpdatedEntity(EntityManager em) {
        Automovel updatedAutomovel = new Automovel().placa(UPDATED_PLACA).descricao(UPDATED_DESCRICAO);
        // Add required entity
        TipoAutomovel tipoAutomovel;
        if (TestUtil.findAll(em, TipoAutomovel.class).isEmpty()) {
            tipoAutomovel = TipoAutomovelResourceIT.createUpdatedEntity();
            em.persist(tipoAutomovel);
            em.flush();
        } else {
            tipoAutomovel = TestUtil.findAll(em, TipoAutomovel.class).get(0);
        }
        updatedAutomovel.setTipoAutomovel(tipoAutomovel);
        // Add required entity
        Pessoa pessoa;
        if (TestUtil.findAll(em, Pessoa.class).isEmpty()) {
            pessoa = PessoaResourceIT.createUpdatedEntity(em);
            em.persist(pessoa);
            em.flush();
        } else {
            pessoa = TestUtil.findAll(em, Pessoa.class).get(0);
        }
        updatedAutomovel.setPessoa(pessoa);
        return updatedAutomovel;
    }

    @BeforeEach
    public void initTest() {
        automovel = createEntity(em);
    }

    @AfterEach
    public void cleanup() {
        if (insertedAutomovel != null) {
            automovelRepository.delete(insertedAutomovel);
            insertedAutomovel = null;
        }
    }

    @Test
    @Transactional
    void createAutomovel() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Automovel
        var returnedAutomovel = om.readValue(
            restAutomovelMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(automovel)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Automovel.class
        );

        // Validate the Automovel in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertAutomovelUpdatableFieldsEquals(returnedAutomovel, getPersistedAutomovel(returnedAutomovel));

        insertedAutomovel = returnedAutomovel;
    }

    @Test
    @Transactional
    void createAutomovelWithExistingId() throws Exception {
        // Create the Automovel with an existing ID
        insertedAutomovel = automovelRepository.saveAndFlush(automovel);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAutomovelMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(automovel)))
            .andExpect(status().isBadRequest());

        // Validate the Automovel in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkPlacaIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        automovel.setPlaca(null);

        // Create the Automovel, which fails.

        restAutomovelMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(automovel)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllAutomovels() throws Exception {
        // Initialize the database
        insertedAutomovel = automovelRepository.saveAndFlush(automovel);

        // Get all the automovelList
        restAutomovelMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(automovel.getId().toString())))
            .andExpect(jsonPath("$.[*].placa").value(hasItem(DEFAULT_PLACA)))
            .andExpect(jsonPath("$.[*].descricao").value(hasItem(DEFAULT_DESCRICAO)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllAutomovelsWithEagerRelationshipsIsEnabled() throws Exception {
        when(automovelRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restAutomovelMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(automovelRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllAutomovelsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(automovelRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restAutomovelMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(automovelRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getAutomovel() throws Exception {
        // Initialize the database
        insertedAutomovel = automovelRepository.saveAndFlush(automovel);

        // Get the automovel
        restAutomovelMockMvc
            .perform(get(ENTITY_API_URL_ID, automovel.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(automovel.getId().toString()))
            .andExpect(jsonPath("$.placa").value(DEFAULT_PLACA))
            .andExpect(jsonPath("$.descricao").value(DEFAULT_DESCRICAO));
    }

    @Test
    @Transactional
    void getNonExistingAutomovel() throws Exception {
        // Get the automovel
        restAutomovelMockMvc.perform(get(ENTITY_API_URL_ID, UUID.randomUUID().toString())).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingAutomovel() throws Exception {
        // Initialize the database
        insertedAutomovel = automovelRepository.saveAndFlush(automovel);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the automovel
        Automovel updatedAutomovel = automovelRepository.findById(automovel.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedAutomovel are not directly saved in db
        em.detach(updatedAutomovel);
        updatedAutomovel.placa(UPDATED_PLACA).descricao(UPDATED_DESCRICAO);

        restAutomovelMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAutomovel.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedAutomovel))
            )
            .andExpect(status().isOk());

        // Validate the Automovel in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedAutomovelToMatchAllProperties(updatedAutomovel);
    }

    @Test
    @Transactional
    void putNonExistingAutomovel() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        automovel.setId(UUID.randomUUID());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAutomovelMockMvc
            .perform(
                put(ENTITY_API_URL_ID, automovel.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(automovel))
            )
            .andExpect(status().isBadRequest());

        // Validate the Automovel in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAutomovel() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        automovel.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAutomovelMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(automovel))
            )
            .andExpect(status().isBadRequest());

        // Validate the Automovel in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAutomovel() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        automovel.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAutomovelMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(automovel)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Automovel in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAutomovelWithPatch() throws Exception {
        // Initialize the database
        insertedAutomovel = automovelRepository.saveAndFlush(automovel);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the automovel using partial update
        Automovel partialUpdatedAutomovel = new Automovel();
        partialUpdatedAutomovel.setId(automovel.getId());

        partialUpdatedAutomovel.descricao(UPDATED_DESCRICAO);

        restAutomovelMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAutomovel.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedAutomovel))
            )
            .andExpect(status().isOk());

        // Validate the Automovel in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertAutomovelUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedAutomovel, automovel),
            getPersistedAutomovel(automovel)
        );
    }

    @Test
    @Transactional
    void fullUpdateAutomovelWithPatch() throws Exception {
        // Initialize the database
        insertedAutomovel = automovelRepository.saveAndFlush(automovel);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the automovel using partial update
        Automovel partialUpdatedAutomovel = new Automovel();
        partialUpdatedAutomovel.setId(automovel.getId());

        partialUpdatedAutomovel.placa(UPDATED_PLACA).descricao(UPDATED_DESCRICAO);

        restAutomovelMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAutomovel.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedAutomovel))
            )
            .andExpect(status().isOk());

        // Validate the Automovel in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertAutomovelUpdatableFieldsEquals(partialUpdatedAutomovel, getPersistedAutomovel(partialUpdatedAutomovel));
    }

    @Test
    @Transactional
    void patchNonExistingAutomovel() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        automovel.setId(UUID.randomUUID());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAutomovelMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, automovel.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(automovel))
            )
            .andExpect(status().isBadRequest());

        // Validate the Automovel in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAutomovel() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        automovel.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAutomovelMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(automovel))
            )
            .andExpect(status().isBadRequest());

        // Validate the Automovel in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAutomovel() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        automovel.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAutomovelMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(automovel)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Automovel in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAutomovel() throws Exception {
        // Initialize the database
        insertedAutomovel = automovelRepository.saveAndFlush(automovel);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the automovel
        restAutomovelMockMvc
            .perform(delete(ENTITY_API_URL_ID, automovel.getId().toString()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return automovelRepository.count();
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

    protected Automovel getPersistedAutomovel(Automovel automovel) {
        return automovelRepository.findById(automovel.getId()).orElseThrow();
    }

    protected void assertPersistedAutomovelToMatchAllProperties(Automovel expectedAutomovel) {
        assertAutomovelAllPropertiesEquals(expectedAutomovel, getPersistedAutomovel(expectedAutomovel));
    }

    protected void assertPersistedAutomovelToMatchUpdatableProperties(Automovel expectedAutomovel) {
        assertAutomovelAllUpdatablePropertiesEquals(expectedAutomovel, getPersistedAutomovel(expectedAutomovel));
    }
}
