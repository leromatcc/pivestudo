package tcc.leroma.pivestudo.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static tcc.leroma.pivestudo.domain.DocumentoAsserts.*;
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
import tcc.leroma.pivestudo.domain.Documento;
import tcc.leroma.pivestudo.domain.Pessoa;
import tcc.leroma.pivestudo.domain.enumeration.TipoDocumento;
import tcc.leroma.pivestudo.repository.DocumentoRepository;

/**
 * Integration tests for the {@link DocumentoResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class DocumentoResourceIT {

    private static final TipoDocumento DEFAULT_TIPO_DOCUMENTO = TipoDocumento.RG;
    private static final TipoDocumento UPDATED_TIPO_DOCUMENTO = TipoDocumento.CPF;

    private static final String DEFAULT_NUMERO_DOCUMENTO = "AAAAAAAAAA";
    private static final String UPDATED_NUMERO_DOCUMENTO = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRICAO = "AAAAAAAAAA";
    private static final String UPDATED_DESCRICAO = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/documentos";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private ObjectMapper om;

    @Autowired
    private DocumentoRepository documentoRepository;

    @Mock
    private DocumentoRepository documentoRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restDocumentoMockMvc;

    private Documento documento;

    private Documento insertedDocumento;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Documento createEntity(EntityManager em) {
        Documento documento = new Documento()
            .tipoDocumento(DEFAULT_TIPO_DOCUMENTO)
            .numeroDocumento(DEFAULT_NUMERO_DOCUMENTO)
            .descricao(DEFAULT_DESCRICAO);
        // Add required entity
        Pessoa pessoa;
        if (TestUtil.findAll(em, Pessoa.class).isEmpty()) {
            pessoa = PessoaResourceIT.createEntity(em);
            em.persist(pessoa);
            em.flush();
        } else {
            pessoa = TestUtil.findAll(em, Pessoa.class).get(0);
        }
        documento.setPessoa(pessoa);
        return documento;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Documento createUpdatedEntity(EntityManager em) {
        Documento updatedDocumento = new Documento()
            .tipoDocumento(UPDATED_TIPO_DOCUMENTO)
            .numeroDocumento(UPDATED_NUMERO_DOCUMENTO)
            .descricao(UPDATED_DESCRICAO);
        // Add required entity
        Pessoa pessoa;
        if (TestUtil.findAll(em, Pessoa.class).isEmpty()) {
            pessoa = PessoaResourceIT.createUpdatedEntity(em);
            em.persist(pessoa);
            em.flush();
        } else {
            pessoa = TestUtil.findAll(em, Pessoa.class).get(0);
        }
        updatedDocumento.setPessoa(pessoa);
        return updatedDocumento;
    }

    @BeforeEach
    public void initTest() {
        documento = createEntity(em);
    }

    @AfterEach
    public void cleanup() {
        if (insertedDocumento != null) {
            documentoRepository.delete(insertedDocumento);
            insertedDocumento = null;
        }
    }

    @Test
    @Transactional
    void createDocumento() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Documento
        var returnedDocumento = om.readValue(
            restDocumentoMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(documento)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Documento.class
        );

        // Validate the Documento in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertDocumentoUpdatableFieldsEquals(returnedDocumento, getPersistedDocumento(returnedDocumento));

        insertedDocumento = returnedDocumento;
    }

    @Test
    @Transactional
    void createDocumentoWithExistingId() throws Exception {
        // Create the Documento with an existing ID
        insertedDocumento = documentoRepository.saveAndFlush(documento);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restDocumentoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(documento)))
            .andExpect(status().isBadRequest());

        // Validate the Documento in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNumeroDocumentoIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        documento.setNumeroDocumento(null);

        // Create the Documento, which fails.

        restDocumentoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(documento)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllDocumentos() throws Exception {
        // Initialize the database
        insertedDocumento = documentoRepository.saveAndFlush(documento);

        // Get all the documentoList
        restDocumentoMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(documento.getId().toString())))
            .andExpect(jsonPath("$.[*].tipoDocumento").value(hasItem(DEFAULT_TIPO_DOCUMENTO.toString())))
            .andExpect(jsonPath("$.[*].numeroDocumento").value(hasItem(DEFAULT_NUMERO_DOCUMENTO)))
            .andExpect(jsonPath("$.[*].descricao").value(hasItem(DEFAULT_DESCRICAO)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllDocumentosWithEagerRelationshipsIsEnabled() throws Exception {
        when(documentoRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restDocumentoMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(documentoRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllDocumentosWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(documentoRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restDocumentoMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(documentoRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getDocumento() throws Exception {
        // Initialize the database
        insertedDocumento = documentoRepository.saveAndFlush(documento);

        // Get the documento
        restDocumentoMockMvc
            .perform(get(ENTITY_API_URL_ID, documento.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(documento.getId().toString()))
            .andExpect(jsonPath("$.tipoDocumento").value(DEFAULT_TIPO_DOCUMENTO.toString()))
            .andExpect(jsonPath("$.numeroDocumento").value(DEFAULT_NUMERO_DOCUMENTO))
            .andExpect(jsonPath("$.descricao").value(DEFAULT_DESCRICAO));
    }

    @Test
    @Transactional
    void getNonExistingDocumento() throws Exception {
        // Get the documento
        restDocumentoMockMvc.perform(get(ENTITY_API_URL_ID, UUID.randomUUID().toString())).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingDocumento() throws Exception {
        // Initialize the database
        insertedDocumento = documentoRepository.saveAndFlush(documento);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the documento
        Documento updatedDocumento = documentoRepository.findById(documento.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedDocumento are not directly saved in db
        em.detach(updatedDocumento);
        updatedDocumento.tipoDocumento(UPDATED_TIPO_DOCUMENTO).numeroDocumento(UPDATED_NUMERO_DOCUMENTO).descricao(UPDATED_DESCRICAO);

        restDocumentoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedDocumento.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedDocumento))
            )
            .andExpect(status().isOk());

        // Validate the Documento in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedDocumentoToMatchAllProperties(updatedDocumento);
    }

    @Test
    @Transactional
    void putNonExistingDocumento() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        documento.setId(UUID.randomUUID());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDocumentoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, documento.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(documento))
            )
            .andExpect(status().isBadRequest());

        // Validate the Documento in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchDocumento() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        documento.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDocumentoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(documento))
            )
            .andExpect(status().isBadRequest());

        // Validate the Documento in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamDocumento() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        documento.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDocumentoMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(documento)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Documento in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateDocumentoWithPatch() throws Exception {
        // Initialize the database
        insertedDocumento = documentoRepository.saveAndFlush(documento);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the documento using partial update
        Documento partialUpdatedDocumento = new Documento();
        partialUpdatedDocumento.setId(documento.getId());

        restDocumentoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDocumento.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedDocumento))
            )
            .andExpect(status().isOk());

        // Validate the Documento in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertDocumentoUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedDocumento, documento),
            getPersistedDocumento(documento)
        );
    }

    @Test
    @Transactional
    void fullUpdateDocumentoWithPatch() throws Exception {
        // Initialize the database
        insertedDocumento = documentoRepository.saveAndFlush(documento);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the documento using partial update
        Documento partialUpdatedDocumento = new Documento();
        partialUpdatedDocumento.setId(documento.getId());

        partialUpdatedDocumento
            .tipoDocumento(UPDATED_TIPO_DOCUMENTO)
            .numeroDocumento(UPDATED_NUMERO_DOCUMENTO)
            .descricao(UPDATED_DESCRICAO);

        restDocumentoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDocumento.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedDocumento))
            )
            .andExpect(status().isOk());

        // Validate the Documento in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertDocumentoUpdatableFieldsEquals(partialUpdatedDocumento, getPersistedDocumento(partialUpdatedDocumento));
    }

    @Test
    @Transactional
    void patchNonExistingDocumento() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        documento.setId(UUID.randomUUID());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDocumentoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, documento.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(documento))
            )
            .andExpect(status().isBadRequest());

        // Validate the Documento in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchDocumento() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        documento.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDocumentoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(documento))
            )
            .andExpect(status().isBadRequest());

        // Validate the Documento in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamDocumento() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        documento.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDocumentoMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(documento)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Documento in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteDocumento() throws Exception {
        // Initialize the database
        insertedDocumento = documentoRepository.saveAndFlush(documento);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the documento
        restDocumentoMockMvc
            .perform(delete(ENTITY_API_URL_ID, documento.getId().toString()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return documentoRepository.count();
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

    protected Documento getPersistedDocumento(Documento documento) {
        return documentoRepository.findById(documento.getId()).orElseThrow();
    }

    protected void assertPersistedDocumentoToMatchAllProperties(Documento expectedDocumento) {
        assertDocumentoAllPropertiesEquals(expectedDocumento, getPersistedDocumento(expectedDocumento));
    }

    protected void assertPersistedDocumentoToMatchUpdatableProperties(Documento expectedDocumento) {
        assertDocumentoAllUpdatablePropertiesEquals(expectedDocumento, getPersistedDocumento(expectedDocumento));
    }
}
