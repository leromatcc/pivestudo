package tcc.leroma.pivestudo.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static tcc.leroma.pivestudo.domain.OperacaoAsserts.*;
import static tcc.leroma.pivestudo.web.rest.TestUtil.createUpdateProxyForBean;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityManager;
import java.util.Base64;
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
import tcc.leroma.pivestudo.domain.Operacao;
import tcc.leroma.pivestudo.repository.OperacaoRepository;

/**
 * Integration tests for the {@link OperacaoResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class OperacaoResourceIT {

    private static final byte[] DEFAULT_ARQUIVO_IMAGEM = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_ARQUIVO_IMAGEM = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_ARQUIVO_IMAGEM_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_ARQUIVO_IMAGEM_CONTENT_TYPE = "image/png";

    private static final String ENTITY_API_URL = "/api/operacaos";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private OperacaoRepository operacaoRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restOperacaoMockMvc;

    private Operacao operacao;

    private Operacao insertedOperacao;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Operacao createEntity() {
        return new Operacao().arquivoImagem(DEFAULT_ARQUIVO_IMAGEM).arquivoImagemContentType(DEFAULT_ARQUIVO_IMAGEM_CONTENT_TYPE);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Operacao createUpdatedEntity() {
        return new Operacao().arquivoImagem(UPDATED_ARQUIVO_IMAGEM).arquivoImagemContentType(UPDATED_ARQUIVO_IMAGEM_CONTENT_TYPE);
    }

    @BeforeEach
    public void initTest() {
        operacao = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedOperacao != null) {
            operacaoRepository.delete(insertedOperacao);
            insertedOperacao = null;
        }
    }

    @Test
    @Transactional
    void createOperacao() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Operacao
        var returnedOperacao = om.readValue(
            restOperacaoMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(operacao)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Operacao.class
        );

        // Validate the Operacao in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertOperacaoUpdatableFieldsEquals(returnedOperacao, getPersistedOperacao(returnedOperacao));

        insertedOperacao = returnedOperacao;
    }

    @Test
    @Transactional
    void createOperacaoWithExistingId() throws Exception {
        // Create the Operacao with an existing ID
        operacao.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restOperacaoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(operacao)))
            .andExpect(status().isBadRequest());

        // Validate the Operacao in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllOperacaos() throws Exception {
        // Initialize the database
        insertedOperacao = operacaoRepository.saveAndFlush(operacao);

        // Get all the operacaoList
        restOperacaoMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(operacao.getId().intValue())))
            .andExpect(jsonPath("$.[*].arquivoImagemContentType").value(hasItem(DEFAULT_ARQUIVO_IMAGEM_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].arquivoImagem").value(hasItem(Base64.getEncoder().encodeToString(DEFAULT_ARQUIVO_IMAGEM))));
    }

    @Test
    @Transactional
    void getOperacao() throws Exception {
        // Initialize the database
        insertedOperacao = operacaoRepository.saveAndFlush(operacao);

        // Get the operacao
        restOperacaoMockMvc
            .perform(get(ENTITY_API_URL_ID, operacao.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(operacao.getId().intValue()))
            .andExpect(jsonPath("$.arquivoImagemContentType").value(DEFAULT_ARQUIVO_IMAGEM_CONTENT_TYPE))
            .andExpect(jsonPath("$.arquivoImagem").value(Base64.getEncoder().encodeToString(DEFAULT_ARQUIVO_IMAGEM)));
    }

    @Test
    @Transactional
    void getNonExistingOperacao() throws Exception {
        // Get the operacao
        restOperacaoMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingOperacao() throws Exception {
        // Initialize the database
        insertedOperacao = operacaoRepository.saveAndFlush(operacao);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the operacao
        Operacao updatedOperacao = operacaoRepository.findById(operacao.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedOperacao are not directly saved in db
        em.detach(updatedOperacao);
        updatedOperacao.arquivoImagem(UPDATED_ARQUIVO_IMAGEM).arquivoImagemContentType(UPDATED_ARQUIVO_IMAGEM_CONTENT_TYPE);

        restOperacaoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedOperacao.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedOperacao))
            )
            .andExpect(status().isOk());

        // Validate the Operacao in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedOperacaoToMatchAllProperties(updatedOperacao);
    }

    @Test
    @Transactional
    void putNonExistingOperacao() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        operacao.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOperacaoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, operacao.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(operacao))
            )
            .andExpect(status().isBadRequest());

        // Validate the Operacao in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchOperacao() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        operacao.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOperacaoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(operacao))
            )
            .andExpect(status().isBadRequest());

        // Validate the Operacao in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamOperacao() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        operacao.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOperacaoMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(operacao)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Operacao in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateOperacaoWithPatch() throws Exception {
        // Initialize the database
        insertedOperacao = operacaoRepository.saveAndFlush(operacao);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the operacao using partial update
        Operacao partialUpdatedOperacao = new Operacao();
        partialUpdatedOperacao.setId(operacao.getId());

        restOperacaoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedOperacao.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedOperacao))
            )
            .andExpect(status().isOk());

        // Validate the Operacao in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertOperacaoUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedOperacao, operacao), getPersistedOperacao(operacao));
    }

    @Test
    @Transactional
    void fullUpdateOperacaoWithPatch() throws Exception {
        // Initialize the database
        insertedOperacao = operacaoRepository.saveAndFlush(operacao);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the operacao using partial update
        Operacao partialUpdatedOperacao = new Operacao();
        partialUpdatedOperacao.setId(operacao.getId());

        partialUpdatedOperacao.arquivoImagem(UPDATED_ARQUIVO_IMAGEM).arquivoImagemContentType(UPDATED_ARQUIVO_IMAGEM_CONTENT_TYPE);

        restOperacaoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedOperacao.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedOperacao))
            )
            .andExpect(status().isOk());

        // Validate the Operacao in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertOperacaoUpdatableFieldsEquals(partialUpdatedOperacao, getPersistedOperacao(partialUpdatedOperacao));
    }

    @Test
    @Transactional
    void patchNonExistingOperacao() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        operacao.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOperacaoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, operacao.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(operacao))
            )
            .andExpect(status().isBadRequest());

        // Validate the Operacao in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchOperacao() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        operacao.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOperacaoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(operacao))
            )
            .andExpect(status().isBadRequest());

        // Validate the Operacao in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamOperacao() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        operacao.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOperacaoMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(operacao)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Operacao in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteOperacao() throws Exception {
        // Initialize the database
        insertedOperacao = operacaoRepository.saveAndFlush(operacao);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the operacao
        restOperacaoMockMvc
            .perform(delete(ENTITY_API_URL_ID, operacao.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return operacaoRepository.count();
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

    protected Operacao getPersistedOperacao(Operacao operacao) {
        return operacaoRepository.findById(operacao.getId()).orElseThrow();
    }

    protected void assertPersistedOperacaoToMatchAllProperties(Operacao expectedOperacao) {
        assertOperacaoAllPropertiesEquals(expectedOperacao, getPersistedOperacao(expectedOperacao));
    }

    protected void assertPersistedOperacaoToMatchUpdatableProperties(Operacao expectedOperacao) {
        assertOperacaoAllUpdatablePropertiesEquals(expectedOperacao, getPersistedOperacao(expectedOperacao));
    }
}
