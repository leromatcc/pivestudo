package tcc.leroma.pivestudo.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static tcc.leroma.pivestudo.domain.TipoAutomovelAsserts.*;
import static tcc.leroma.pivestudo.web.rest.TestUtil.createUpdateProxyForBean;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityManager;
import java.util.UUID;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import tcc.leroma.pivestudo.IntegrationTest;
import tcc.leroma.pivestudo.domain.TipoAutomovel;
import tcc.leroma.pivestudo.domain.enumeration.ClassificaAutomovel;
import tcc.leroma.pivestudo.repository.TipoAutomovelRepository;

/**
 * Integration tests for the {@link TipoAutomovelResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class TipoAutomovelResourceIT {

    private static final String DEFAULT_DESCRICAO = "AAAAAAAAAA";
    private static final String UPDATED_DESCRICAO = "BBBBBBBBBB";

    private static final ClassificaAutomovel DEFAULT_GRUPO = ClassificaAutomovel.MOTO;
    private static final ClassificaAutomovel UPDATED_GRUPO = ClassificaAutomovel.CARRO;

    private static final String ENTITY_API_URL = "/api/tipo-automovels";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private ObjectMapper om;

    @Autowired
    private TipoAutomovelRepository tipoAutomovelRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTipoAutomovelMockMvc;

    private TipoAutomovel tipoAutomovel;

    private TipoAutomovel insertedTipoAutomovel;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TipoAutomovel createEntity() {
        return new TipoAutomovel().descricao(DEFAULT_DESCRICAO).grupo(DEFAULT_GRUPO);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TipoAutomovel createUpdatedEntity() {
        return new TipoAutomovel().descricao(UPDATED_DESCRICAO).grupo(UPDATED_GRUPO);
    }

    @BeforeEach
    public void initTest() {
        tipoAutomovel = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedTipoAutomovel != null) {
            tipoAutomovelRepository.delete(insertedTipoAutomovel);
            insertedTipoAutomovel = null;
        }
    }

    @Test
    @Transactional
    void createTipoAutomovel() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the TipoAutomovel
        var returnedTipoAutomovel = om.readValue(
            restTipoAutomovelMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(tipoAutomovel)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            TipoAutomovel.class
        );

        // Validate the TipoAutomovel in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertTipoAutomovelUpdatableFieldsEquals(returnedTipoAutomovel, getPersistedTipoAutomovel(returnedTipoAutomovel));

        insertedTipoAutomovel = returnedTipoAutomovel;
    }

    @Test
    @Transactional
    void createTipoAutomovelWithExistingId() throws Exception {
        // Create the TipoAutomovel with an existing ID
        insertedTipoAutomovel = tipoAutomovelRepository.saveAndFlush(tipoAutomovel);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restTipoAutomovelMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(tipoAutomovel)))
            .andExpect(status().isBadRequest());

        // Validate the TipoAutomovel in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkDescricaoIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        tipoAutomovel.setDescricao(null);

        // Create the TipoAutomovel, which fails.

        restTipoAutomovelMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(tipoAutomovel)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkGrupoIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        tipoAutomovel.setGrupo(null);

        // Create the TipoAutomovel, which fails.

        restTipoAutomovelMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(tipoAutomovel)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllTipoAutomovels() throws Exception {
        // Initialize the database
        insertedTipoAutomovel = tipoAutomovelRepository.saveAndFlush(tipoAutomovel);

        // Get all the tipoAutomovelList
        restTipoAutomovelMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(tipoAutomovel.getId().toString())))
            .andExpect(jsonPath("$.[*].descricao").value(hasItem(DEFAULT_DESCRICAO)))
            .andExpect(jsonPath("$.[*].grupo").value(hasItem(DEFAULT_GRUPO.toString())));
    }

    @Test
    @Transactional
    void getTipoAutomovel() throws Exception {
        // Initialize the database
        insertedTipoAutomovel = tipoAutomovelRepository.saveAndFlush(tipoAutomovel);

        // Get the tipoAutomovel
        restTipoAutomovelMockMvc
            .perform(get(ENTITY_API_URL_ID, tipoAutomovel.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(tipoAutomovel.getId().toString()))
            .andExpect(jsonPath("$.descricao").value(DEFAULT_DESCRICAO))
            .andExpect(jsonPath("$.grupo").value(DEFAULT_GRUPO.toString()));
    }

    @Test
    @Transactional
    void getNonExistingTipoAutomovel() throws Exception {
        // Get the tipoAutomovel
        restTipoAutomovelMockMvc.perform(get(ENTITY_API_URL_ID, UUID.randomUUID().toString())).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingTipoAutomovel() throws Exception {
        // Initialize the database
        insertedTipoAutomovel = tipoAutomovelRepository.saveAndFlush(tipoAutomovel);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the tipoAutomovel
        TipoAutomovel updatedTipoAutomovel = tipoAutomovelRepository.findById(tipoAutomovel.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedTipoAutomovel are not directly saved in db
        em.detach(updatedTipoAutomovel);
        updatedTipoAutomovel.descricao(UPDATED_DESCRICAO).grupo(UPDATED_GRUPO);

        restTipoAutomovelMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedTipoAutomovel.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedTipoAutomovel))
            )
            .andExpect(status().isOk());

        // Validate the TipoAutomovel in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedTipoAutomovelToMatchAllProperties(updatedTipoAutomovel);
    }

    @Test
    @Transactional
    void putNonExistingTipoAutomovel() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        tipoAutomovel.setId(UUID.randomUUID());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTipoAutomovelMockMvc
            .perform(
                put(ENTITY_API_URL_ID, tipoAutomovel.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(tipoAutomovel))
            )
            .andExpect(status().isBadRequest());

        // Validate the TipoAutomovel in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchTipoAutomovel() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        tipoAutomovel.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTipoAutomovelMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(tipoAutomovel))
            )
            .andExpect(status().isBadRequest());

        // Validate the TipoAutomovel in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamTipoAutomovel() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        tipoAutomovel.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTipoAutomovelMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(tipoAutomovel)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the TipoAutomovel in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateTipoAutomovelWithPatch() throws Exception {
        // Initialize the database
        insertedTipoAutomovel = tipoAutomovelRepository.saveAndFlush(tipoAutomovel);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the tipoAutomovel using partial update
        TipoAutomovel partialUpdatedTipoAutomovel = new TipoAutomovel();
        partialUpdatedTipoAutomovel.setId(tipoAutomovel.getId());

        restTipoAutomovelMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTipoAutomovel.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedTipoAutomovel))
            )
            .andExpect(status().isOk());

        // Validate the TipoAutomovel in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertTipoAutomovelUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedTipoAutomovel, tipoAutomovel),
            getPersistedTipoAutomovel(tipoAutomovel)
        );
    }

    @Test
    @Transactional
    void fullUpdateTipoAutomovelWithPatch() throws Exception {
        // Initialize the database
        insertedTipoAutomovel = tipoAutomovelRepository.saveAndFlush(tipoAutomovel);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the tipoAutomovel using partial update
        TipoAutomovel partialUpdatedTipoAutomovel = new TipoAutomovel();
        partialUpdatedTipoAutomovel.setId(tipoAutomovel.getId());

        partialUpdatedTipoAutomovel.descricao(UPDATED_DESCRICAO).grupo(UPDATED_GRUPO);

        restTipoAutomovelMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTipoAutomovel.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedTipoAutomovel))
            )
            .andExpect(status().isOk());

        // Validate the TipoAutomovel in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertTipoAutomovelUpdatableFieldsEquals(partialUpdatedTipoAutomovel, getPersistedTipoAutomovel(partialUpdatedTipoAutomovel));
    }

    @Test
    @Transactional
    void patchNonExistingTipoAutomovel() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        tipoAutomovel.setId(UUID.randomUUID());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTipoAutomovelMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, tipoAutomovel.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(tipoAutomovel))
            )
            .andExpect(status().isBadRequest());

        // Validate the TipoAutomovel in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchTipoAutomovel() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        tipoAutomovel.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTipoAutomovelMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(tipoAutomovel))
            )
            .andExpect(status().isBadRequest());

        // Validate the TipoAutomovel in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamTipoAutomovel() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        tipoAutomovel.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTipoAutomovelMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(tipoAutomovel)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the TipoAutomovel in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteTipoAutomovel() throws Exception {
        // Initialize the database
        insertedTipoAutomovel = tipoAutomovelRepository.saveAndFlush(tipoAutomovel);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the tipoAutomovel
        restTipoAutomovelMockMvc
            .perform(delete(ENTITY_API_URL_ID, tipoAutomovel.getId().toString()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return tipoAutomovelRepository.count();
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

    protected TipoAutomovel getPersistedTipoAutomovel(TipoAutomovel tipoAutomovel) {
        return tipoAutomovelRepository.findById(tipoAutomovel.getId()).orElseThrow();
    }

    protected void assertPersistedTipoAutomovelToMatchAllProperties(TipoAutomovel expectedTipoAutomovel) {
        assertTipoAutomovelAllPropertiesEquals(expectedTipoAutomovel, getPersistedTipoAutomovel(expectedTipoAutomovel));
    }

    protected void assertPersistedTipoAutomovelToMatchUpdatableProperties(TipoAutomovel expectedTipoAutomovel) {
        assertTipoAutomovelAllUpdatablePropertiesEquals(expectedTipoAutomovel, getPersistedTipoAutomovel(expectedTipoAutomovel));
    }
}
