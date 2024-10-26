package tcc.leroma.pivestudo.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static tcc.leroma.pivestudo.domain.RegistroAcessoAsserts.*;
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
import tcc.leroma.pivestudo.domain.Automovel;
import tcc.leroma.pivestudo.domain.AutorizacaoAcesso;
import tcc.leroma.pivestudo.domain.PontoAcesso;
import tcc.leroma.pivestudo.domain.RegistroAcesso;
import tcc.leroma.pivestudo.domain.enumeration.TipoAcessoAutorizado;
import tcc.leroma.pivestudo.repository.RegistroAcessoRepository;

/**
 * Integration tests for the {@link RegistroAcessoResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class RegistroAcessoResourceIT {

    private static final Instant DEFAULT_DATA_HORA = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATA_HORA = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String DEFAULT_CADEIA_ANALISADA = "AAAAAAAAAA";
    private static final String UPDATED_CADEIA_ANALISADA = "BBBBBBBBBB";

    private static final TipoAcessoAutorizado DEFAULT_ACESSO_AUTORIZADO = TipoAcessoAutorizado.AUTORIZADO;
    private static final TipoAcessoAutorizado UPDATED_ACESSO_AUTORIZADO = TipoAcessoAutorizado.RECUSADO;

    private static final String ENTITY_API_URL = "/api/registro-acessos";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private ObjectMapper om;

    @Autowired
    private RegistroAcessoRepository registroAcessoRepository;

    @Mock
    private RegistroAcessoRepository registroAcessoRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restRegistroAcessoMockMvc;

    private RegistroAcesso registroAcesso;

    private RegistroAcesso insertedRegistroAcesso;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static RegistroAcesso createEntity(EntityManager em) {
        RegistroAcesso registroAcesso = new RegistroAcesso()
            .dataHora(DEFAULT_DATA_HORA)
            .cadeiaAnalisada(DEFAULT_CADEIA_ANALISADA)
            .acessoAutorizado(DEFAULT_ACESSO_AUTORIZADO);
        // Add required entity
        PontoAcesso pontoAcesso;
        if (TestUtil.findAll(em, PontoAcesso.class).isEmpty()) {
            pontoAcesso = PontoAcessoResourceIT.createEntity(em);
            em.persist(pontoAcesso);
            em.flush();
        } else {
            pontoAcesso = TestUtil.findAll(em, PontoAcesso.class).get(0);
        }
        registroAcesso.setPontoAcesso(pontoAcesso);
        // Add required entity
        Automovel automovel;
        if (TestUtil.findAll(em, Automovel.class).isEmpty()) {
            automovel = AutomovelResourceIT.createEntity(em);
            em.persist(automovel);
            em.flush();
        } else {
            automovel = TestUtil.findAll(em, Automovel.class).get(0);
        }
        registroAcesso.setAutomovel(automovel);
        // Add required entity
        AutorizacaoAcesso autorizacaoAcesso;
        if (TestUtil.findAll(em, AutorizacaoAcesso.class).isEmpty()) {
            autorizacaoAcesso = AutorizacaoAcessoResourceIT.createEntity(em);
            em.persist(autorizacaoAcesso);
            em.flush();
        } else {
            autorizacaoAcesso = TestUtil.findAll(em, AutorizacaoAcesso.class).get(0);
        }
        registroAcesso.setAutorizacaoAcesso(autorizacaoAcesso);
        return registroAcesso;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static RegistroAcesso createUpdatedEntity(EntityManager em) {
        RegistroAcesso updatedRegistroAcesso = new RegistroAcesso()
            .dataHora(UPDATED_DATA_HORA)
            .cadeiaAnalisada(UPDATED_CADEIA_ANALISADA)
            .acessoAutorizado(UPDATED_ACESSO_AUTORIZADO);
        // Add required entity
        PontoAcesso pontoAcesso;
        if (TestUtil.findAll(em, PontoAcesso.class).isEmpty()) {
            pontoAcesso = PontoAcessoResourceIT.createUpdatedEntity(em);
            em.persist(pontoAcesso);
            em.flush();
        } else {
            pontoAcesso = TestUtil.findAll(em, PontoAcesso.class).get(0);
        }
        updatedRegistroAcesso.setPontoAcesso(pontoAcesso);
        // Add required entity
        Automovel automovel;
        if (TestUtil.findAll(em, Automovel.class).isEmpty()) {
            automovel = AutomovelResourceIT.createUpdatedEntity(em);
            em.persist(automovel);
            em.flush();
        } else {
            automovel = TestUtil.findAll(em, Automovel.class).get(0);
        }
        updatedRegistroAcesso.setAutomovel(automovel);
        // Add required entity
        AutorizacaoAcesso autorizacaoAcesso;
        if (TestUtil.findAll(em, AutorizacaoAcesso.class).isEmpty()) {
            autorizacaoAcesso = AutorizacaoAcessoResourceIT.createUpdatedEntity(em);
            em.persist(autorizacaoAcesso);
            em.flush();
        } else {
            autorizacaoAcesso = TestUtil.findAll(em, AutorizacaoAcesso.class).get(0);
        }
        updatedRegistroAcesso.setAutorizacaoAcesso(autorizacaoAcesso);
        return updatedRegistroAcesso;
    }

    @BeforeEach
    public void initTest() {
        registroAcesso = createEntity(em);
    }

    @AfterEach
    public void cleanup() {
        if (insertedRegistroAcesso != null) {
            registroAcessoRepository.delete(insertedRegistroAcesso);
            insertedRegistroAcesso = null;
        }
    }

    @Test
    @Transactional
    void createRegistroAcesso() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the RegistroAcesso
        var returnedRegistroAcesso = om.readValue(
            restRegistroAcessoMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(registroAcesso)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            RegistroAcesso.class
        );

        // Validate the RegistroAcesso in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertRegistroAcessoUpdatableFieldsEquals(returnedRegistroAcesso, getPersistedRegistroAcesso(returnedRegistroAcesso));

        insertedRegistroAcesso = returnedRegistroAcesso;
    }

    @Test
    @Transactional
    void createRegistroAcessoWithExistingId() throws Exception {
        // Create the RegistroAcesso with an existing ID
        insertedRegistroAcesso = registroAcessoRepository.saveAndFlush(registroAcesso);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restRegistroAcessoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(registroAcesso)))
            .andExpect(status().isBadRequest());

        // Validate the RegistroAcesso in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkDataHoraIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        registroAcesso.setDataHora(null);

        // Create the RegistroAcesso, which fails.

        restRegistroAcessoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(registroAcesso)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkAcessoAutorizadoIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        registroAcesso.setAcessoAutorizado(null);

        // Create the RegistroAcesso, which fails.

        restRegistroAcessoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(registroAcesso)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllRegistroAcessos() throws Exception {
        // Initialize the database
        insertedRegistroAcesso = registroAcessoRepository.saveAndFlush(registroAcesso);

        // Get all the registroAcessoList
        restRegistroAcessoMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(registroAcesso.getId().toString())))
            .andExpect(jsonPath("$.[*].dataHora").value(hasItem(DEFAULT_DATA_HORA.toString())))
            .andExpect(jsonPath("$.[*].cadeiaAnalisada").value(hasItem(DEFAULT_CADEIA_ANALISADA)))
            .andExpect(jsonPath("$.[*].acessoAutorizado").value(hasItem(DEFAULT_ACESSO_AUTORIZADO.toString())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllRegistroAcessosWithEagerRelationshipsIsEnabled() throws Exception {
        when(registroAcessoRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restRegistroAcessoMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(registroAcessoRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllRegistroAcessosWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(registroAcessoRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restRegistroAcessoMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(registroAcessoRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getRegistroAcesso() throws Exception {
        // Initialize the database
        insertedRegistroAcesso = registroAcessoRepository.saveAndFlush(registroAcesso);

        // Get the registroAcesso
        restRegistroAcessoMockMvc
            .perform(get(ENTITY_API_URL_ID, registroAcesso.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(registroAcesso.getId().toString()))
            .andExpect(jsonPath("$.dataHora").value(DEFAULT_DATA_HORA.toString()))
            .andExpect(jsonPath("$.cadeiaAnalisada").value(DEFAULT_CADEIA_ANALISADA))
            .andExpect(jsonPath("$.acessoAutorizado").value(DEFAULT_ACESSO_AUTORIZADO.toString()));
    }

    @Test
    @Transactional
    void getNonExistingRegistroAcesso() throws Exception {
        // Get the registroAcesso
        restRegistroAcessoMockMvc.perform(get(ENTITY_API_URL_ID, UUID.randomUUID().toString())).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingRegistroAcesso() throws Exception {
        // Initialize the database
        insertedRegistroAcesso = registroAcessoRepository.saveAndFlush(registroAcesso);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the registroAcesso
        RegistroAcesso updatedRegistroAcesso = registroAcessoRepository.findById(registroAcesso.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedRegistroAcesso are not directly saved in db
        em.detach(updatedRegistroAcesso);
        updatedRegistroAcesso
            .dataHora(UPDATED_DATA_HORA)
            .cadeiaAnalisada(UPDATED_CADEIA_ANALISADA)
            .acessoAutorizado(UPDATED_ACESSO_AUTORIZADO);

        restRegistroAcessoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedRegistroAcesso.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedRegistroAcesso))
            )
            .andExpect(status().isOk());

        // Validate the RegistroAcesso in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedRegistroAcessoToMatchAllProperties(updatedRegistroAcesso);
    }

    @Test
    @Transactional
    void putNonExistingRegistroAcesso() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        registroAcesso.setId(UUID.randomUUID());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRegistroAcessoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, registroAcesso.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(registroAcesso))
            )
            .andExpect(status().isBadRequest());

        // Validate the RegistroAcesso in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchRegistroAcesso() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        registroAcesso.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRegistroAcessoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(registroAcesso))
            )
            .andExpect(status().isBadRequest());

        // Validate the RegistroAcesso in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamRegistroAcesso() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        registroAcesso.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRegistroAcessoMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(registroAcesso)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the RegistroAcesso in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateRegistroAcessoWithPatch() throws Exception {
        // Initialize the database
        insertedRegistroAcesso = registroAcessoRepository.saveAndFlush(registroAcesso);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the registroAcesso using partial update
        RegistroAcesso partialUpdatedRegistroAcesso = new RegistroAcesso();
        partialUpdatedRegistroAcesso.setId(registroAcesso.getId());

        partialUpdatedRegistroAcesso.dataHora(UPDATED_DATA_HORA).acessoAutorizado(UPDATED_ACESSO_AUTORIZADO);

        restRegistroAcessoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedRegistroAcesso.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedRegistroAcesso))
            )
            .andExpect(status().isOk());

        // Validate the RegistroAcesso in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertRegistroAcessoUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedRegistroAcesso, registroAcesso),
            getPersistedRegistroAcesso(registroAcesso)
        );
    }

    @Test
    @Transactional
    void fullUpdateRegistroAcessoWithPatch() throws Exception {
        // Initialize the database
        insertedRegistroAcesso = registroAcessoRepository.saveAndFlush(registroAcesso);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the registroAcesso using partial update
        RegistroAcesso partialUpdatedRegistroAcesso = new RegistroAcesso();
        partialUpdatedRegistroAcesso.setId(registroAcesso.getId());

        partialUpdatedRegistroAcesso
            .dataHora(UPDATED_DATA_HORA)
            .cadeiaAnalisada(UPDATED_CADEIA_ANALISADA)
            .acessoAutorizado(UPDATED_ACESSO_AUTORIZADO);

        restRegistroAcessoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedRegistroAcesso.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedRegistroAcesso))
            )
            .andExpect(status().isOk());

        // Validate the RegistroAcesso in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertRegistroAcessoUpdatableFieldsEquals(partialUpdatedRegistroAcesso, getPersistedRegistroAcesso(partialUpdatedRegistroAcesso));
    }

    @Test
    @Transactional
    void patchNonExistingRegistroAcesso() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        registroAcesso.setId(UUID.randomUUID());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRegistroAcessoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, registroAcesso.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(registroAcesso))
            )
            .andExpect(status().isBadRequest());

        // Validate the RegistroAcesso in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchRegistroAcesso() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        registroAcesso.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRegistroAcessoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(registroAcesso))
            )
            .andExpect(status().isBadRequest());

        // Validate the RegistroAcesso in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamRegistroAcesso() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        registroAcesso.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRegistroAcessoMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(registroAcesso)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the RegistroAcesso in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteRegistroAcesso() throws Exception {
        // Initialize the database
        insertedRegistroAcesso = registroAcessoRepository.saveAndFlush(registroAcesso);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the registroAcesso
        restRegistroAcessoMockMvc
            .perform(delete(ENTITY_API_URL_ID, registroAcesso.getId().toString()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return registroAcessoRepository.count();
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

    protected RegistroAcesso getPersistedRegistroAcesso(RegistroAcesso registroAcesso) {
        return registroAcessoRepository.findById(registroAcesso.getId()).orElseThrow();
    }

    protected void assertPersistedRegistroAcessoToMatchAllProperties(RegistroAcesso expectedRegistroAcesso) {
        assertRegistroAcessoAllPropertiesEquals(expectedRegistroAcesso, getPersistedRegistroAcesso(expectedRegistroAcesso));
    }

    protected void assertPersistedRegistroAcessoToMatchUpdatableProperties(RegistroAcesso expectedRegistroAcesso) {
        assertRegistroAcessoAllUpdatablePropertiesEquals(expectedRegistroAcesso, getPersistedRegistroAcesso(expectedRegistroAcesso));
    }
}
