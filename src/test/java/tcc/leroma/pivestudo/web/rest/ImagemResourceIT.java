package tcc.leroma.pivestudo.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static tcc.leroma.pivestudo.domain.ImagemAsserts.*;
import static tcc.leroma.pivestudo.web.rest.TestUtil.createUpdateProxyForBean;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityManager;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Base64;
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
import tcc.leroma.pivestudo.domain.Imagem;
import tcc.leroma.pivestudo.domain.RegistroAcesso;
import tcc.leroma.pivestudo.repository.ImagemRepository;

/**
 * Integration tests for the {@link ImagemResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class ImagemResourceIT {

    private static final byte[] DEFAULT_ARQUIVO_IMAGEM = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_ARQUIVO_IMAGEM = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_ARQUIVO_IMAGEM_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_ARQUIVO_IMAGEM_CONTENT_TYPE = "image/png";

    private static final String DEFAULT_NOME = "AAAAAAAAAA";
    private static final String UPDATED_NOME = "BBBBBBBBBB";

    private static final String DEFAULT_CAMINHO = "AAAAAAAAAA";
    private static final String UPDATED_CAMINHO = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRICAO = "AAAAAAAAAA";
    private static final String UPDATED_DESCRICAO = "BBBBBBBBBB";

    private static final String DEFAULT_CADEIA_DETECTADA = "AAAAAAAAAA";
    private static final String UPDATED_CADEIA_DETECTADA = "BBBBBBBBBB";

    private static final Instant DEFAULT_DATE_ANALISE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE_ANALISE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/imagems";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private ObjectMapper om;

    @Autowired
    private ImagemRepository imagemRepository;

    @Mock
    private ImagemRepository imagemRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restImagemMockMvc;

    private Imagem imagem;

    private Imagem insertedImagem;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Imagem createEntity(EntityManager em) {
        Imagem imagem = new Imagem()
            .arquivoImagem(DEFAULT_ARQUIVO_IMAGEM)
            .arquivoImagemContentType(DEFAULT_ARQUIVO_IMAGEM_CONTENT_TYPE)
            .nome(DEFAULT_NOME)
            .caminho(DEFAULT_CAMINHO)
            .descricao(DEFAULT_DESCRICAO)
            .cadeiaDetectada(DEFAULT_CADEIA_DETECTADA)
            .dateAnalise(DEFAULT_DATE_ANALISE);
        // Add required entity
        RegistroAcesso registroAcesso;
        if (TestUtil.findAll(em, RegistroAcesso.class).isEmpty()) {
            registroAcesso = RegistroAcessoResourceIT.createEntity(em);
            em.persist(registroAcesso);
            em.flush();
        } else {
            registroAcesso = TestUtil.findAll(em, RegistroAcesso.class).get(0);
        }
        imagem.setRegistroAcesso(registroAcesso);
        return imagem;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Imagem createUpdatedEntity(EntityManager em) {
        Imagem updatedImagem = new Imagem()
            .arquivoImagem(UPDATED_ARQUIVO_IMAGEM)
            .arquivoImagemContentType(UPDATED_ARQUIVO_IMAGEM_CONTENT_TYPE)
            .nome(UPDATED_NOME)
            .caminho(UPDATED_CAMINHO)
            .descricao(UPDATED_DESCRICAO)
            .cadeiaDetectada(UPDATED_CADEIA_DETECTADA)
            .dateAnalise(UPDATED_DATE_ANALISE);
        // Add required entity
        RegistroAcesso registroAcesso;
        if (TestUtil.findAll(em, RegistroAcesso.class).isEmpty()) {
            registroAcesso = RegistroAcessoResourceIT.createUpdatedEntity(em);
            em.persist(registroAcesso);
            em.flush();
        } else {
            registroAcesso = TestUtil.findAll(em, RegistroAcesso.class).get(0);
        }
        updatedImagem.setRegistroAcesso(registroAcesso);
        return updatedImagem;
    }

    @BeforeEach
    public void initTest() {
        imagem = createEntity(em);
    }

    @AfterEach
    public void cleanup() {
        if (insertedImagem != null) {
            imagemRepository.delete(insertedImagem);
            insertedImagem = null;
        }
    }

    @Test
    @Transactional
    void createImagem() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Imagem
        var returnedImagem = om.readValue(
            restImagemMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(imagem)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Imagem.class
        );

        // Validate the Imagem in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertImagemUpdatableFieldsEquals(returnedImagem, getPersistedImagem(returnedImagem));

        insertedImagem = returnedImagem;
    }

    @Test
    @Transactional
    void createImagemWithExistingId() throws Exception {
        // Create the Imagem with an existing ID
        insertedImagem = imagemRepository.saveAndFlush(imagem);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restImagemMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(imagem)))
            .andExpect(status().isBadRequest());

        // Validate the Imagem in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNomeIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        imagem.setNome(null);

        // Create the Imagem, which fails.

        restImagemMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(imagem)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkCaminhoIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        imagem.setCaminho(null);

        // Create the Imagem, which fails.

        restImagemMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(imagem)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllImagems() throws Exception {
        // Initialize the database
        insertedImagem = imagemRepository.saveAndFlush(imagem);

        // Get all the imagemList
        restImagemMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(imagem.getId().toString())))
            .andExpect(jsonPath("$.[*].arquivoImagemContentType").value(hasItem(DEFAULT_ARQUIVO_IMAGEM_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].arquivoImagem").value(hasItem(Base64.getEncoder().encodeToString(DEFAULT_ARQUIVO_IMAGEM))))
            .andExpect(jsonPath("$.[*].nome").value(hasItem(DEFAULT_NOME)))
            .andExpect(jsonPath("$.[*].caminho").value(hasItem(DEFAULT_CAMINHO)))
            .andExpect(jsonPath("$.[*].descricao").value(hasItem(DEFAULT_DESCRICAO)))
            .andExpect(jsonPath("$.[*].cadeiaDetectada").value(hasItem(DEFAULT_CADEIA_DETECTADA)))
            .andExpect(jsonPath("$.[*].dateAnalise").value(hasItem(DEFAULT_DATE_ANALISE.toString())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllImagemsWithEagerRelationshipsIsEnabled() throws Exception {
        when(imagemRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restImagemMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(imagemRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllImagemsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(imagemRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restImagemMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(imagemRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getImagem() throws Exception {
        // Initialize the database
        insertedImagem = imagemRepository.saveAndFlush(imagem);

        // Get the imagem
        restImagemMockMvc
            .perform(get(ENTITY_API_URL_ID, imagem.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(imagem.getId().toString()))
            .andExpect(jsonPath("$.arquivoImagemContentType").value(DEFAULT_ARQUIVO_IMAGEM_CONTENT_TYPE))
            .andExpect(jsonPath("$.arquivoImagem").value(Base64.getEncoder().encodeToString(DEFAULT_ARQUIVO_IMAGEM)))
            .andExpect(jsonPath("$.nome").value(DEFAULT_NOME))
            .andExpect(jsonPath("$.caminho").value(DEFAULT_CAMINHO))
            .andExpect(jsonPath("$.descricao").value(DEFAULT_DESCRICAO))
            .andExpect(jsonPath("$.cadeiaDetectada").value(DEFAULT_CADEIA_DETECTADA))
            .andExpect(jsonPath("$.dateAnalise").value(DEFAULT_DATE_ANALISE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingImagem() throws Exception {
        // Get the imagem
        restImagemMockMvc.perform(get(ENTITY_API_URL_ID, UUID.randomUUID().toString())).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingImagem() throws Exception {
        // Initialize the database
        insertedImagem = imagemRepository.saveAndFlush(imagem);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the imagem
        Imagem updatedImagem = imagemRepository.findById(imagem.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedImagem are not directly saved in db
        em.detach(updatedImagem);
        updatedImagem
            .arquivoImagem(UPDATED_ARQUIVO_IMAGEM)
            .arquivoImagemContentType(UPDATED_ARQUIVO_IMAGEM_CONTENT_TYPE)
            .nome(UPDATED_NOME)
            .caminho(UPDATED_CAMINHO)
            .descricao(UPDATED_DESCRICAO)
            .cadeiaDetectada(UPDATED_CADEIA_DETECTADA)
            .dateAnalise(UPDATED_DATE_ANALISE);

        restImagemMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedImagem.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedImagem))
            )
            .andExpect(status().isOk());

        // Validate the Imagem in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedImagemToMatchAllProperties(updatedImagem);
    }

    @Test
    @Transactional
    void putNonExistingImagem() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        imagem.setId(UUID.randomUUID());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restImagemMockMvc
            .perform(put(ENTITY_API_URL_ID, imagem.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(imagem)))
            .andExpect(status().isBadRequest());

        // Validate the Imagem in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchImagem() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        imagem.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restImagemMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(imagem))
            )
            .andExpect(status().isBadRequest());

        // Validate the Imagem in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamImagem() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        imagem.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restImagemMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(imagem)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Imagem in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateImagemWithPatch() throws Exception {
        // Initialize the database
        insertedImagem = imagemRepository.saveAndFlush(imagem);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the imagem using partial update
        Imagem partialUpdatedImagem = new Imagem();
        partialUpdatedImagem.setId(imagem.getId());

        partialUpdatedImagem
            .arquivoImagem(UPDATED_ARQUIVO_IMAGEM)
            .arquivoImagemContentType(UPDATED_ARQUIVO_IMAGEM_CONTENT_TYPE)
            .descricao(UPDATED_DESCRICAO)
            .cadeiaDetectada(UPDATED_CADEIA_DETECTADA);

        restImagemMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedImagem.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedImagem))
            )
            .andExpect(status().isOk());

        // Validate the Imagem in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertImagemUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedImagem, imagem), getPersistedImagem(imagem));
    }

    @Test
    @Transactional
    void fullUpdateImagemWithPatch() throws Exception {
        // Initialize the database
        insertedImagem = imagemRepository.saveAndFlush(imagem);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the imagem using partial update
        Imagem partialUpdatedImagem = new Imagem();
        partialUpdatedImagem.setId(imagem.getId());

        partialUpdatedImagem
            .arquivoImagem(UPDATED_ARQUIVO_IMAGEM)
            .arquivoImagemContentType(UPDATED_ARQUIVO_IMAGEM_CONTENT_TYPE)
            .nome(UPDATED_NOME)
            .caminho(UPDATED_CAMINHO)
            .descricao(UPDATED_DESCRICAO)
            .cadeiaDetectada(UPDATED_CADEIA_DETECTADA)
            .dateAnalise(UPDATED_DATE_ANALISE);

        restImagemMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedImagem.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedImagem))
            )
            .andExpect(status().isOk());

        // Validate the Imagem in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertImagemUpdatableFieldsEquals(partialUpdatedImagem, getPersistedImagem(partialUpdatedImagem));
    }

    @Test
    @Transactional
    void patchNonExistingImagem() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        imagem.setId(UUID.randomUUID());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restImagemMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, imagem.getId()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(imagem))
            )
            .andExpect(status().isBadRequest());

        // Validate the Imagem in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchImagem() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        imagem.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restImagemMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(imagem))
            )
            .andExpect(status().isBadRequest());

        // Validate the Imagem in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamImagem() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        imagem.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restImagemMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(imagem)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Imagem in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteImagem() throws Exception {
        // Initialize the database
        insertedImagem = imagemRepository.saveAndFlush(imagem);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the imagem
        restImagemMockMvc
            .perform(delete(ENTITY_API_URL_ID, imagem.getId().toString()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return imagemRepository.count();
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

    protected Imagem getPersistedImagem(Imagem imagem) {
        return imagemRepository.findById(imagem.getId()).orElseThrow();
    }

    protected void assertPersistedImagemToMatchAllProperties(Imagem expectedImagem) {
        assertImagemAllPropertiesEquals(expectedImagem, getPersistedImagem(expectedImagem));
    }

    protected void assertPersistedImagemToMatchUpdatableProperties(Imagem expectedImagem) {
        assertImagemAllUpdatablePropertiesEquals(expectedImagem, getPersistedImagem(expectedImagem));
    }
}
