package tcc.leroma.pivestudo.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static tcc.leroma.pivestudo.domain.LoteBlocoApartamentoAsserts.*;
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
import tcc.leroma.pivestudo.domain.Endereco;
import tcc.leroma.pivestudo.domain.LoteBlocoApartamento;
import tcc.leroma.pivestudo.domain.Pessoa;
import tcc.leroma.pivestudo.repository.LoteBlocoApartamentoRepository;

/**
 * Integration tests for the {@link LoteBlocoApartamentoResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class LoteBlocoApartamentoResourceIT {

    private static final String DEFAULT_BLOCO = "AAAAAAAAAA";
    private static final String UPDATED_BLOCO = "BBBBBBBBBB";

    private static final String DEFAULT_ANDAR = "AAAAAAAAAA";
    private static final String UPDATED_ANDAR = "BBBBBBBBBB";

    private static final String DEFAULT_NUMERO = "AAAAAAAAAA";
    private static final String UPDATED_NUMERO = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/lote-bloco-apartamentos";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private ObjectMapper om;

    @Autowired
    private LoteBlocoApartamentoRepository loteBlocoApartamentoRepository;

    @Mock
    private LoteBlocoApartamentoRepository loteBlocoApartamentoRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restLoteBlocoApartamentoMockMvc;

    private LoteBlocoApartamento loteBlocoApartamento;

    private LoteBlocoApartamento insertedLoteBlocoApartamento;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static LoteBlocoApartamento createEntity(EntityManager em) {
        LoteBlocoApartamento loteBlocoApartamento = new LoteBlocoApartamento()
            .bloco(DEFAULT_BLOCO)
            .andar(DEFAULT_ANDAR)
            .numero(DEFAULT_NUMERO);
        // Add required entity
        Endereco endereco;
        if (TestUtil.findAll(em, Endereco.class).isEmpty()) {
            endereco = EnderecoResourceIT.createEntity();
            em.persist(endereco);
            em.flush();
        } else {
            endereco = TestUtil.findAll(em, Endereco.class).get(0);
        }
        loteBlocoApartamento.setEndereco(endereco);
        // Add required entity
        Pessoa pessoa;
        if (TestUtil.findAll(em, Pessoa.class).isEmpty()) {
            pessoa = PessoaResourceIT.createEntity(em);
            em.persist(pessoa);
            em.flush();
        } else {
            pessoa = TestUtil.findAll(em, Pessoa.class).get(0);
        }
        loteBlocoApartamento.setPessoa(pessoa);
        return loteBlocoApartamento;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static LoteBlocoApartamento createUpdatedEntity(EntityManager em) {
        LoteBlocoApartamento updatedLoteBlocoApartamento = new LoteBlocoApartamento()
            .bloco(UPDATED_BLOCO)
            .andar(UPDATED_ANDAR)
            .numero(UPDATED_NUMERO);
        // Add required entity
        Endereco endereco;
        if (TestUtil.findAll(em, Endereco.class).isEmpty()) {
            endereco = EnderecoResourceIT.createUpdatedEntity();
            em.persist(endereco);
            em.flush();
        } else {
            endereco = TestUtil.findAll(em, Endereco.class).get(0);
        }
        updatedLoteBlocoApartamento.setEndereco(endereco);
        // Add required entity
        Pessoa pessoa;
        if (TestUtil.findAll(em, Pessoa.class).isEmpty()) {
            pessoa = PessoaResourceIT.createUpdatedEntity(em);
            em.persist(pessoa);
            em.flush();
        } else {
            pessoa = TestUtil.findAll(em, Pessoa.class).get(0);
        }
        updatedLoteBlocoApartamento.setPessoa(pessoa);
        return updatedLoteBlocoApartamento;
    }

    @BeforeEach
    public void initTest() {
        loteBlocoApartamento = createEntity(em);
    }

    @AfterEach
    public void cleanup() {
        if (insertedLoteBlocoApartamento != null) {
            loteBlocoApartamentoRepository.delete(insertedLoteBlocoApartamento);
            insertedLoteBlocoApartamento = null;
        }
    }

    @Test
    @Transactional
    void createLoteBlocoApartamento() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the LoteBlocoApartamento
        var returnedLoteBlocoApartamento = om.readValue(
            restLoteBlocoApartamentoMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(loteBlocoApartamento)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            LoteBlocoApartamento.class
        );

        // Validate the LoteBlocoApartamento in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertLoteBlocoApartamentoUpdatableFieldsEquals(
            returnedLoteBlocoApartamento,
            getPersistedLoteBlocoApartamento(returnedLoteBlocoApartamento)
        );

        insertedLoteBlocoApartamento = returnedLoteBlocoApartamento;
    }

    @Test
    @Transactional
    void createLoteBlocoApartamentoWithExistingId() throws Exception {
        // Create the LoteBlocoApartamento with an existing ID
        insertedLoteBlocoApartamento = loteBlocoApartamentoRepository.saveAndFlush(loteBlocoApartamento);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restLoteBlocoApartamentoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(loteBlocoApartamento)))
            .andExpect(status().isBadRequest());

        // Validate the LoteBlocoApartamento in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllLoteBlocoApartamentos() throws Exception {
        // Initialize the database
        insertedLoteBlocoApartamento = loteBlocoApartamentoRepository.saveAndFlush(loteBlocoApartamento);

        // Get all the loteBlocoApartamentoList
        restLoteBlocoApartamentoMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(loteBlocoApartamento.getId().toString())))
            .andExpect(jsonPath("$.[*].bloco").value(hasItem(DEFAULT_BLOCO)))
            .andExpect(jsonPath("$.[*].andar").value(hasItem(DEFAULT_ANDAR)))
            .andExpect(jsonPath("$.[*].numero").value(hasItem(DEFAULT_NUMERO)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllLoteBlocoApartamentosWithEagerRelationshipsIsEnabled() throws Exception {
        when(loteBlocoApartamentoRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restLoteBlocoApartamentoMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(loteBlocoApartamentoRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllLoteBlocoApartamentosWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(loteBlocoApartamentoRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restLoteBlocoApartamentoMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(loteBlocoApartamentoRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getLoteBlocoApartamento() throws Exception {
        // Initialize the database
        insertedLoteBlocoApartamento = loteBlocoApartamentoRepository.saveAndFlush(loteBlocoApartamento);

        // Get the loteBlocoApartamento
        restLoteBlocoApartamentoMockMvc
            .perform(get(ENTITY_API_URL_ID, loteBlocoApartamento.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(loteBlocoApartamento.getId().toString()))
            .andExpect(jsonPath("$.bloco").value(DEFAULT_BLOCO))
            .andExpect(jsonPath("$.andar").value(DEFAULT_ANDAR))
            .andExpect(jsonPath("$.numero").value(DEFAULT_NUMERO));
    }

    @Test
    @Transactional
    void getNonExistingLoteBlocoApartamento() throws Exception {
        // Get the loteBlocoApartamento
        restLoteBlocoApartamentoMockMvc.perform(get(ENTITY_API_URL_ID, UUID.randomUUID().toString())).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingLoteBlocoApartamento() throws Exception {
        // Initialize the database
        insertedLoteBlocoApartamento = loteBlocoApartamentoRepository.saveAndFlush(loteBlocoApartamento);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the loteBlocoApartamento
        LoteBlocoApartamento updatedLoteBlocoApartamento = loteBlocoApartamentoRepository
            .findById(loteBlocoApartamento.getId())
            .orElseThrow();
        // Disconnect from session so that the updates on updatedLoteBlocoApartamento are not directly saved in db
        em.detach(updatedLoteBlocoApartamento);
        updatedLoteBlocoApartamento.bloco(UPDATED_BLOCO).andar(UPDATED_ANDAR).numero(UPDATED_NUMERO);

        restLoteBlocoApartamentoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedLoteBlocoApartamento.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedLoteBlocoApartamento))
            )
            .andExpect(status().isOk());

        // Validate the LoteBlocoApartamento in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedLoteBlocoApartamentoToMatchAllProperties(updatedLoteBlocoApartamento);
    }

    @Test
    @Transactional
    void putNonExistingLoteBlocoApartamento() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        loteBlocoApartamento.setId(UUID.randomUUID());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLoteBlocoApartamentoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, loteBlocoApartamento.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(loteBlocoApartamento))
            )
            .andExpect(status().isBadRequest());

        // Validate the LoteBlocoApartamento in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchLoteBlocoApartamento() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        loteBlocoApartamento.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLoteBlocoApartamentoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(loteBlocoApartamento))
            )
            .andExpect(status().isBadRequest());

        // Validate the LoteBlocoApartamento in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamLoteBlocoApartamento() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        loteBlocoApartamento.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLoteBlocoApartamentoMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(loteBlocoApartamento)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the LoteBlocoApartamento in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateLoteBlocoApartamentoWithPatch() throws Exception {
        // Initialize the database
        insertedLoteBlocoApartamento = loteBlocoApartamentoRepository.saveAndFlush(loteBlocoApartamento);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the loteBlocoApartamento using partial update
        LoteBlocoApartamento partialUpdatedLoteBlocoApartamento = new LoteBlocoApartamento();
        partialUpdatedLoteBlocoApartamento.setId(loteBlocoApartamento.getId());

        partialUpdatedLoteBlocoApartamento.bloco(UPDATED_BLOCO).numero(UPDATED_NUMERO);

        restLoteBlocoApartamentoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLoteBlocoApartamento.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedLoteBlocoApartamento))
            )
            .andExpect(status().isOk());

        // Validate the LoteBlocoApartamento in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertLoteBlocoApartamentoUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedLoteBlocoApartamento, loteBlocoApartamento),
            getPersistedLoteBlocoApartamento(loteBlocoApartamento)
        );
    }

    @Test
    @Transactional
    void fullUpdateLoteBlocoApartamentoWithPatch() throws Exception {
        // Initialize the database
        insertedLoteBlocoApartamento = loteBlocoApartamentoRepository.saveAndFlush(loteBlocoApartamento);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the loteBlocoApartamento using partial update
        LoteBlocoApartamento partialUpdatedLoteBlocoApartamento = new LoteBlocoApartamento();
        partialUpdatedLoteBlocoApartamento.setId(loteBlocoApartamento.getId());

        partialUpdatedLoteBlocoApartamento.bloco(UPDATED_BLOCO).andar(UPDATED_ANDAR).numero(UPDATED_NUMERO);

        restLoteBlocoApartamentoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLoteBlocoApartamento.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedLoteBlocoApartamento))
            )
            .andExpect(status().isOk());

        // Validate the LoteBlocoApartamento in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertLoteBlocoApartamentoUpdatableFieldsEquals(
            partialUpdatedLoteBlocoApartamento,
            getPersistedLoteBlocoApartamento(partialUpdatedLoteBlocoApartamento)
        );
    }

    @Test
    @Transactional
    void patchNonExistingLoteBlocoApartamento() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        loteBlocoApartamento.setId(UUID.randomUUID());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLoteBlocoApartamentoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, loteBlocoApartamento.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(loteBlocoApartamento))
            )
            .andExpect(status().isBadRequest());

        // Validate the LoteBlocoApartamento in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchLoteBlocoApartamento() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        loteBlocoApartamento.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLoteBlocoApartamentoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(loteBlocoApartamento))
            )
            .andExpect(status().isBadRequest());

        // Validate the LoteBlocoApartamento in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamLoteBlocoApartamento() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        loteBlocoApartamento.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLoteBlocoApartamentoMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(loteBlocoApartamento)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the LoteBlocoApartamento in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteLoteBlocoApartamento() throws Exception {
        // Initialize the database
        insertedLoteBlocoApartamento = loteBlocoApartamentoRepository.saveAndFlush(loteBlocoApartamento);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the loteBlocoApartamento
        restLoteBlocoApartamentoMockMvc
            .perform(delete(ENTITY_API_URL_ID, loteBlocoApartamento.getId().toString()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return loteBlocoApartamentoRepository.count();
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

    protected LoteBlocoApartamento getPersistedLoteBlocoApartamento(LoteBlocoApartamento loteBlocoApartamento) {
        return loteBlocoApartamentoRepository.findById(loteBlocoApartamento.getId()).orElseThrow();
    }

    protected void assertPersistedLoteBlocoApartamentoToMatchAllProperties(LoteBlocoApartamento expectedLoteBlocoApartamento) {
        assertLoteBlocoApartamentoAllPropertiesEquals(
            expectedLoteBlocoApartamento,
            getPersistedLoteBlocoApartamento(expectedLoteBlocoApartamento)
        );
    }

    protected void assertPersistedLoteBlocoApartamentoToMatchUpdatableProperties(LoteBlocoApartamento expectedLoteBlocoApartamento) {
        assertLoteBlocoApartamentoAllUpdatablePropertiesEquals(
            expectedLoteBlocoApartamento,
            getPersistedLoteBlocoApartamento(expectedLoteBlocoApartamento)
        );
    }
}
