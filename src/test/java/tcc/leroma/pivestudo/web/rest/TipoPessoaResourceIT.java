package tcc.leroma.pivestudo.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static tcc.leroma.pivestudo.domain.TipoPessoaAsserts.*;
import static tcc.leroma.pivestudo.web.rest.TestUtil.createUpdateProxyForBean;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityManager;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
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
import tcc.leroma.pivestudo.domain.TipoPessoa;
import tcc.leroma.pivestudo.domain.enumeration.ClassificaPessoa;
import tcc.leroma.pivestudo.repository.TipoPessoaRepository;

/**
 * Integration tests for the {@link TipoPessoaResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class TipoPessoaResourceIT {

    private static final String DEFAULT_DESCRICAO = "AAAAAAAAAA";
    private static final String UPDATED_DESCRICAO = "BBBBBBBBBB";

    private static final ClassificaPessoa DEFAULT_GRUPO = ClassificaPessoa.MORADOR;
    private static final ClassificaPessoa UPDATED_GRUPO = ClassificaPessoa.VISITANTE;

    private static final String ENTITY_API_URL = "/api/tipo-pessoas";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private TipoPessoaRepository tipoPessoaRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTipoPessoaMockMvc;

    private TipoPessoa tipoPessoa;

    private TipoPessoa insertedTipoPessoa;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TipoPessoa createEntity() {
        return new TipoPessoa().descricao(DEFAULT_DESCRICAO).grupo(DEFAULT_GRUPO);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TipoPessoa createUpdatedEntity() {
        return new TipoPessoa().descricao(UPDATED_DESCRICAO).grupo(UPDATED_GRUPO);
    }

    @BeforeEach
    public void initTest() {
        tipoPessoa = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedTipoPessoa != null) {
            tipoPessoaRepository.delete(insertedTipoPessoa);
            insertedTipoPessoa = null;
        }
    }

    @Test
    @Transactional
    void createTipoPessoa() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the TipoPessoa
        var returnedTipoPessoa = om.readValue(
            restTipoPessoaMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(tipoPessoa)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            TipoPessoa.class
        );

        // Validate the TipoPessoa in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertTipoPessoaUpdatableFieldsEquals(returnedTipoPessoa, getPersistedTipoPessoa(returnedTipoPessoa));

        insertedTipoPessoa = returnedTipoPessoa;
    }

    @Test
    @Transactional
    void createTipoPessoaWithExistingId() throws Exception {
        // Create the TipoPessoa with an existing ID
        tipoPessoa.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restTipoPessoaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(tipoPessoa)))
            .andExpect(status().isBadRequest());

        // Validate the TipoPessoa in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkDescricaoIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        tipoPessoa.setDescricao(null);

        // Create the TipoPessoa, which fails.

        restTipoPessoaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(tipoPessoa)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllTipoPessoas() throws Exception {
        // Initialize the database
        insertedTipoPessoa = tipoPessoaRepository.saveAndFlush(tipoPessoa);

        // Get all the tipoPessoaList
        restTipoPessoaMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(tipoPessoa.getId().intValue())))
            .andExpect(jsonPath("$.[*].descricao").value(hasItem(DEFAULT_DESCRICAO)))
            .andExpect(jsonPath("$.[*].grupo").value(hasItem(DEFAULT_GRUPO.toString())));
    }

    @Test
    @Transactional
    void getTipoPessoa() throws Exception {
        // Initialize the database
        insertedTipoPessoa = tipoPessoaRepository.saveAndFlush(tipoPessoa);

        // Get the tipoPessoa
        restTipoPessoaMockMvc
            .perform(get(ENTITY_API_URL_ID, tipoPessoa.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(tipoPessoa.getId().intValue()))
            .andExpect(jsonPath("$.descricao").value(DEFAULT_DESCRICAO))
            .andExpect(jsonPath("$.grupo").value(DEFAULT_GRUPO.toString()));
    }

    @Test
    @Transactional
    void getNonExistingTipoPessoa() throws Exception {
        // Get the tipoPessoa
        restTipoPessoaMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingTipoPessoa() throws Exception {
        // Initialize the database
        insertedTipoPessoa = tipoPessoaRepository.saveAndFlush(tipoPessoa);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the tipoPessoa
        TipoPessoa updatedTipoPessoa = tipoPessoaRepository.findById(tipoPessoa.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedTipoPessoa are not directly saved in db
        em.detach(updatedTipoPessoa);
        updatedTipoPessoa.descricao(UPDATED_DESCRICAO).grupo(UPDATED_GRUPO);

        restTipoPessoaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedTipoPessoa.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedTipoPessoa))
            )
            .andExpect(status().isOk());

        // Validate the TipoPessoa in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedTipoPessoaToMatchAllProperties(updatedTipoPessoa);
    }

    @Test
    @Transactional
    void putNonExistingTipoPessoa() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        tipoPessoa.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTipoPessoaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, tipoPessoa.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(tipoPessoa))
            )
            .andExpect(status().isBadRequest());

        // Validate the TipoPessoa in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchTipoPessoa() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        tipoPessoa.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTipoPessoaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(tipoPessoa))
            )
            .andExpect(status().isBadRequest());

        // Validate the TipoPessoa in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamTipoPessoa() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        tipoPessoa.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTipoPessoaMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(tipoPessoa)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the TipoPessoa in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateTipoPessoaWithPatch() throws Exception {
        // Initialize the database
        insertedTipoPessoa = tipoPessoaRepository.saveAndFlush(tipoPessoa);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the tipoPessoa using partial update
        TipoPessoa partialUpdatedTipoPessoa = new TipoPessoa();
        partialUpdatedTipoPessoa.setId(tipoPessoa.getId());

        partialUpdatedTipoPessoa.descricao(UPDATED_DESCRICAO);

        restTipoPessoaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTipoPessoa.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedTipoPessoa))
            )
            .andExpect(status().isOk());

        // Validate the TipoPessoa in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertTipoPessoaUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedTipoPessoa, tipoPessoa),
            getPersistedTipoPessoa(tipoPessoa)
        );
    }

    @Test
    @Transactional
    void fullUpdateTipoPessoaWithPatch() throws Exception {
        // Initialize the database
        insertedTipoPessoa = tipoPessoaRepository.saveAndFlush(tipoPessoa);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the tipoPessoa using partial update
        TipoPessoa partialUpdatedTipoPessoa = new TipoPessoa();
        partialUpdatedTipoPessoa.setId(tipoPessoa.getId());

        partialUpdatedTipoPessoa.descricao(UPDATED_DESCRICAO).grupo(UPDATED_GRUPO);

        restTipoPessoaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTipoPessoa.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedTipoPessoa))
            )
            .andExpect(status().isOk());

        // Validate the TipoPessoa in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertTipoPessoaUpdatableFieldsEquals(partialUpdatedTipoPessoa, getPersistedTipoPessoa(partialUpdatedTipoPessoa));
    }

    @Test
    @Transactional
    void patchNonExistingTipoPessoa() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        tipoPessoa.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTipoPessoaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, tipoPessoa.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(tipoPessoa))
            )
            .andExpect(status().isBadRequest());

        // Validate the TipoPessoa in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchTipoPessoa() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        tipoPessoa.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTipoPessoaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(tipoPessoa))
            )
            .andExpect(status().isBadRequest());

        // Validate the TipoPessoa in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamTipoPessoa() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        tipoPessoa.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTipoPessoaMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(tipoPessoa)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the TipoPessoa in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteTipoPessoa() throws Exception {
        // Initialize the database
        insertedTipoPessoa = tipoPessoaRepository.saveAndFlush(tipoPessoa);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the tipoPessoa
        restTipoPessoaMockMvc
            .perform(delete(ENTITY_API_URL_ID, tipoPessoa.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return tipoPessoaRepository.count();
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

    protected TipoPessoa getPersistedTipoPessoa(TipoPessoa tipoPessoa) {
        return tipoPessoaRepository.findById(tipoPessoa.getId()).orElseThrow();
    }

    protected void assertPersistedTipoPessoaToMatchAllProperties(TipoPessoa expectedTipoPessoa) {
        assertTipoPessoaAllPropertiesEquals(expectedTipoPessoa, getPersistedTipoPessoa(expectedTipoPessoa));
    }

    protected void assertPersistedTipoPessoaToMatchUpdatableProperties(TipoPessoa expectedTipoPessoa) {
        assertTipoPessoaAllUpdatablePropertiesEquals(expectedTipoPessoa, getPersistedTipoPessoa(expectedTipoPessoa));
    }
}
