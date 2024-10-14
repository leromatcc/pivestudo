package tcc.leroma.pivestudo.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static tcc.leroma.pivestudo.domain.TelefoneAsserts.*;
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
import tcc.leroma.pivestudo.domain.Pessoa;
import tcc.leroma.pivestudo.domain.Telefone;
import tcc.leroma.pivestudo.repository.TelefoneRepository;

/**
 * Integration tests for the {@link TelefoneResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class TelefoneResourceIT {

    private static final String DEFAULT_TIPO_TELEFONE = "AAAAAAAAAA";
    private static final String UPDATED_TIPO_TELEFONE = "BBBBBBBBBB";

    private static final String DEFAULT_NUMERO = "AAAAAAAAAA";
    private static final String UPDATED_NUMERO = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/telefones";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private ObjectMapper om;

    @Autowired
    private TelefoneRepository telefoneRepository;

    @Mock
    private TelefoneRepository telefoneRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTelefoneMockMvc;

    private Telefone telefone;

    private Telefone insertedTelefone;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Telefone createEntity(EntityManager em) {
        Telefone telefone = new Telefone().tipoTelefone(DEFAULT_TIPO_TELEFONE).numero(DEFAULT_NUMERO);
        // Add required entity
        Pessoa pessoa;
        if (TestUtil.findAll(em, Pessoa.class).isEmpty()) {
            pessoa = PessoaResourceIT.createEntity(em);
            em.persist(pessoa);
            em.flush();
        } else {
            pessoa = TestUtil.findAll(em, Pessoa.class).get(0);
        }
        telefone.setPessoa(pessoa);
        return telefone;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Telefone createUpdatedEntity(EntityManager em) {
        Telefone updatedTelefone = new Telefone().tipoTelefone(UPDATED_TIPO_TELEFONE).numero(UPDATED_NUMERO);
        // Add required entity
        Pessoa pessoa;
        if (TestUtil.findAll(em, Pessoa.class).isEmpty()) {
            pessoa = PessoaResourceIT.createUpdatedEntity(em);
            em.persist(pessoa);
            em.flush();
        } else {
            pessoa = TestUtil.findAll(em, Pessoa.class).get(0);
        }
        updatedTelefone.setPessoa(pessoa);
        return updatedTelefone;
    }

    @BeforeEach
    public void initTest() {
        telefone = createEntity(em);
    }

    @AfterEach
    public void cleanup() {
        if (insertedTelefone != null) {
            telefoneRepository.delete(insertedTelefone);
            insertedTelefone = null;
        }
    }

    @Test
    @Transactional
    void createTelefone() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Telefone
        var returnedTelefone = om.readValue(
            restTelefoneMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(telefone)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Telefone.class
        );

        // Validate the Telefone in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertTelefoneUpdatableFieldsEquals(returnedTelefone, getPersistedTelefone(returnedTelefone));

        insertedTelefone = returnedTelefone;
    }

    @Test
    @Transactional
    void createTelefoneWithExistingId() throws Exception {
        // Create the Telefone with an existing ID
        insertedTelefone = telefoneRepository.saveAndFlush(telefone);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restTelefoneMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(telefone)))
            .andExpect(status().isBadRequest());

        // Validate the Telefone in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNumeroIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        telefone.setNumero(null);

        // Create the Telefone, which fails.

        restTelefoneMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(telefone)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllTelefones() throws Exception {
        // Initialize the database
        insertedTelefone = telefoneRepository.saveAndFlush(telefone);

        // Get all the telefoneList
        restTelefoneMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(telefone.getId().toString())))
            .andExpect(jsonPath("$.[*].tipoTelefone").value(hasItem(DEFAULT_TIPO_TELEFONE)))
            .andExpect(jsonPath("$.[*].numero").value(hasItem(DEFAULT_NUMERO)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllTelefonesWithEagerRelationshipsIsEnabled() throws Exception {
        when(telefoneRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restTelefoneMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(telefoneRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllTelefonesWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(telefoneRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restTelefoneMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(telefoneRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getTelefone() throws Exception {
        // Initialize the database
        insertedTelefone = telefoneRepository.saveAndFlush(telefone);

        // Get the telefone
        restTelefoneMockMvc
            .perform(get(ENTITY_API_URL_ID, telefone.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(telefone.getId().toString()))
            .andExpect(jsonPath("$.tipoTelefone").value(DEFAULT_TIPO_TELEFONE))
            .andExpect(jsonPath("$.numero").value(DEFAULT_NUMERO));
    }

    @Test
    @Transactional
    void getNonExistingTelefone() throws Exception {
        // Get the telefone
        restTelefoneMockMvc.perform(get(ENTITY_API_URL_ID, UUID.randomUUID().toString())).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingTelefone() throws Exception {
        // Initialize the database
        insertedTelefone = telefoneRepository.saveAndFlush(telefone);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the telefone
        Telefone updatedTelefone = telefoneRepository.findById(telefone.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedTelefone are not directly saved in db
        em.detach(updatedTelefone);
        updatedTelefone.tipoTelefone(UPDATED_TIPO_TELEFONE).numero(UPDATED_NUMERO);

        restTelefoneMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedTelefone.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedTelefone))
            )
            .andExpect(status().isOk());

        // Validate the Telefone in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedTelefoneToMatchAllProperties(updatedTelefone);
    }

    @Test
    @Transactional
    void putNonExistingTelefone() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        telefone.setId(UUID.randomUUID());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTelefoneMockMvc
            .perform(
                put(ENTITY_API_URL_ID, telefone.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(telefone))
            )
            .andExpect(status().isBadRequest());

        // Validate the Telefone in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchTelefone() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        telefone.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTelefoneMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(telefone))
            )
            .andExpect(status().isBadRequest());

        // Validate the Telefone in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamTelefone() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        telefone.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTelefoneMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(telefone)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Telefone in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateTelefoneWithPatch() throws Exception {
        // Initialize the database
        insertedTelefone = telefoneRepository.saveAndFlush(telefone);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the telefone using partial update
        Telefone partialUpdatedTelefone = new Telefone();
        partialUpdatedTelefone.setId(telefone.getId());

        partialUpdatedTelefone.tipoTelefone(UPDATED_TIPO_TELEFONE).numero(UPDATED_NUMERO);

        restTelefoneMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTelefone.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedTelefone))
            )
            .andExpect(status().isOk());

        // Validate the Telefone in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertTelefoneUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedTelefone, telefone), getPersistedTelefone(telefone));
    }

    @Test
    @Transactional
    void fullUpdateTelefoneWithPatch() throws Exception {
        // Initialize the database
        insertedTelefone = telefoneRepository.saveAndFlush(telefone);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the telefone using partial update
        Telefone partialUpdatedTelefone = new Telefone();
        partialUpdatedTelefone.setId(telefone.getId());

        partialUpdatedTelefone.tipoTelefone(UPDATED_TIPO_TELEFONE).numero(UPDATED_NUMERO);

        restTelefoneMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTelefone.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedTelefone))
            )
            .andExpect(status().isOk());

        // Validate the Telefone in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertTelefoneUpdatableFieldsEquals(partialUpdatedTelefone, getPersistedTelefone(partialUpdatedTelefone));
    }

    @Test
    @Transactional
    void patchNonExistingTelefone() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        telefone.setId(UUID.randomUUID());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTelefoneMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, telefone.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(telefone))
            )
            .andExpect(status().isBadRequest());

        // Validate the Telefone in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchTelefone() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        telefone.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTelefoneMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(telefone))
            )
            .andExpect(status().isBadRequest());

        // Validate the Telefone in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamTelefone() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        telefone.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTelefoneMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(telefone)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Telefone in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteTelefone() throws Exception {
        // Initialize the database
        insertedTelefone = telefoneRepository.saveAndFlush(telefone);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the telefone
        restTelefoneMockMvc
            .perform(delete(ENTITY_API_URL_ID, telefone.getId().toString()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return telefoneRepository.count();
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

    protected Telefone getPersistedTelefone(Telefone telefone) {
        return telefoneRepository.findById(telefone.getId()).orElseThrow();
    }

    protected void assertPersistedTelefoneToMatchAllProperties(Telefone expectedTelefone) {
        assertTelefoneAllPropertiesEquals(expectedTelefone, getPersistedTelefone(expectedTelefone));
    }

    protected void assertPersistedTelefoneToMatchUpdatableProperties(Telefone expectedTelefone) {
        assertTelefoneAllUpdatablePropertiesEquals(expectedTelefone, getPersistedTelefone(expectedTelefone));
    }
}
