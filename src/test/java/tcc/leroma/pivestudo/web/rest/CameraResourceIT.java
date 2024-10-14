package tcc.leroma.pivestudo.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static tcc.leroma.pivestudo.domain.CameraAsserts.*;
import static tcc.leroma.pivestudo.web.rest.TestUtil.createUpdateProxyForBean;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityManager;
import java.util.ArrayList;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
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
import tcc.leroma.pivestudo.domain.Camera;
import tcc.leroma.pivestudo.domain.PontoAcesso;
import tcc.leroma.pivestudo.repository.CameraRepository;

/**
 * Integration tests for the {@link CameraResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class CameraResourceIT {

    private static final String DEFAULT_DESCRICAO = "AAAAAAAAAA";
    private static final String UPDATED_DESCRICAO = "BBBBBBBBBB";

    private static final String DEFAULT_ENDERECO_REDE = "AAAAAAAAAA";
    private static final String UPDATED_ENDERECO_REDE = "BBBBBBBBBB";

    private static final String DEFAULT_API = "AAAAAAAAAA";
    private static final String UPDATED_API = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/cameras";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private CameraRepository cameraRepository;

    @Mock
    private CameraRepository cameraRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCameraMockMvc;

    private Camera camera;

    private Camera insertedCamera;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Camera createEntity(EntityManager em) {
        Camera camera = new Camera().descricao(DEFAULT_DESCRICAO).enderecoRede(DEFAULT_ENDERECO_REDE).api(DEFAULT_API);
        // Add required entity
        PontoAcesso pontoAcesso;
        if (TestUtil.findAll(em, PontoAcesso.class).isEmpty()) {
            pontoAcesso = PontoAcessoResourceIT.createEntity(em);
            em.persist(pontoAcesso);
            em.flush();
        } else {
            pontoAcesso = TestUtil.findAll(em, PontoAcesso.class).get(0);
        }
        camera.setPontoAcesso(pontoAcesso);
        return camera;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Camera createUpdatedEntity(EntityManager em) {
        Camera updatedCamera = new Camera().descricao(UPDATED_DESCRICAO).enderecoRede(UPDATED_ENDERECO_REDE).api(UPDATED_API);
        // Add required entity
        PontoAcesso pontoAcesso;
        if (TestUtil.findAll(em, PontoAcesso.class).isEmpty()) {
            pontoAcesso = PontoAcessoResourceIT.createUpdatedEntity(em);
            em.persist(pontoAcesso);
            em.flush();
        } else {
            pontoAcesso = TestUtil.findAll(em, PontoAcesso.class).get(0);
        }
        updatedCamera.setPontoAcesso(pontoAcesso);
        return updatedCamera;
    }

    @BeforeEach
    public void initTest() {
        camera = createEntity(em);
    }

    @AfterEach
    public void cleanup() {
        if (insertedCamera != null) {
            cameraRepository.delete(insertedCamera);
            insertedCamera = null;
        }
    }

    @Test
    @Transactional
    void createCamera() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Camera
        var returnedCamera = om.readValue(
            restCameraMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(camera)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Camera.class
        );

        // Validate the Camera in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertCameraUpdatableFieldsEquals(returnedCamera, getPersistedCamera(returnedCamera));

        insertedCamera = returnedCamera;
    }

    @Test
    @Transactional
    void createCameraWithExistingId() throws Exception {
        // Create the Camera with an existing ID
        camera.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCameraMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(camera)))
            .andExpect(status().isBadRequest());

        // Validate the Camera in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkDescricaoIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        camera.setDescricao(null);

        // Create the Camera, which fails.

        restCameraMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(camera)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkEnderecoRedeIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        camera.setEnderecoRede(null);

        // Create the Camera, which fails.

        restCameraMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(camera)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllCameras() throws Exception {
        // Initialize the database
        insertedCamera = cameraRepository.saveAndFlush(camera);

        // Get all the cameraList
        restCameraMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(camera.getId().intValue())))
            .andExpect(jsonPath("$.[*].descricao").value(hasItem(DEFAULT_DESCRICAO)))
            .andExpect(jsonPath("$.[*].enderecoRede").value(hasItem(DEFAULT_ENDERECO_REDE)))
            .andExpect(jsonPath("$.[*].api").value(hasItem(DEFAULT_API)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllCamerasWithEagerRelationshipsIsEnabled() throws Exception {
        when(cameraRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restCameraMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(cameraRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllCamerasWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(cameraRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restCameraMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(cameraRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getCamera() throws Exception {
        // Initialize the database
        insertedCamera = cameraRepository.saveAndFlush(camera);

        // Get the camera
        restCameraMockMvc
            .perform(get(ENTITY_API_URL_ID, camera.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(camera.getId().intValue()))
            .andExpect(jsonPath("$.descricao").value(DEFAULT_DESCRICAO))
            .andExpect(jsonPath("$.enderecoRede").value(DEFAULT_ENDERECO_REDE))
            .andExpect(jsonPath("$.api").value(DEFAULT_API));
    }

    @Test
    @Transactional
    void getNonExistingCamera() throws Exception {
        // Get the camera
        restCameraMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingCamera() throws Exception {
        // Initialize the database
        insertedCamera = cameraRepository.saveAndFlush(camera);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the camera
        Camera updatedCamera = cameraRepository.findById(camera.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedCamera are not directly saved in db
        em.detach(updatedCamera);
        updatedCamera.descricao(UPDATED_DESCRICAO).enderecoRede(UPDATED_ENDERECO_REDE).api(UPDATED_API);

        restCameraMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedCamera.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedCamera))
            )
            .andExpect(status().isOk());

        // Validate the Camera in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedCameraToMatchAllProperties(updatedCamera);
    }

    @Test
    @Transactional
    void putNonExistingCamera() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        camera.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCameraMockMvc
            .perform(put(ENTITY_API_URL_ID, camera.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(camera)))
            .andExpect(status().isBadRequest());

        // Validate the Camera in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchCamera() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        camera.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCameraMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(camera))
            )
            .andExpect(status().isBadRequest());

        // Validate the Camera in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamCamera() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        camera.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCameraMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(camera)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Camera in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateCameraWithPatch() throws Exception {
        // Initialize the database
        insertedCamera = cameraRepository.saveAndFlush(camera);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the camera using partial update
        Camera partialUpdatedCamera = new Camera();
        partialUpdatedCamera.setId(camera.getId());

        partialUpdatedCamera.descricao(UPDATED_DESCRICAO).api(UPDATED_API);

        restCameraMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCamera.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedCamera))
            )
            .andExpect(status().isOk());

        // Validate the Camera in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertCameraUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedCamera, camera), getPersistedCamera(camera));
    }

    @Test
    @Transactional
    void fullUpdateCameraWithPatch() throws Exception {
        // Initialize the database
        insertedCamera = cameraRepository.saveAndFlush(camera);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the camera using partial update
        Camera partialUpdatedCamera = new Camera();
        partialUpdatedCamera.setId(camera.getId());

        partialUpdatedCamera.descricao(UPDATED_DESCRICAO).enderecoRede(UPDATED_ENDERECO_REDE).api(UPDATED_API);

        restCameraMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCamera.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedCamera))
            )
            .andExpect(status().isOk());

        // Validate the Camera in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertCameraUpdatableFieldsEquals(partialUpdatedCamera, getPersistedCamera(partialUpdatedCamera));
    }

    @Test
    @Transactional
    void patchNonExistingCamera() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        camera.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCameraMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, camera.getId()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(camera))
            )
            .andExpect(status().isBadRequest());

        // Validate the Camera in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchCamera() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        camera.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCameraMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(camera))
            )
            .andExpect(status().isBadRequest());

        // Validate the Camera in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamCamera() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        camera.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCameraMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(camera)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Camera in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteCamera() throws Exception {
        // Initialize the database
        insertedCamera = cameraRepository.saveAndFlush(camera);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the camera
        restCameraMockMvc
            .perform(delete(ENTITY_API_URL_ID, camera.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return cameraRepository.count();
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

    protected Camera getPersistedCamera(Camera camera) {
        return cameraRepository.findById(camera.getId()).orElseThrow();
    }

    protected void assertPersistedCameraToMatchAllProperties(Camera expectedCamera) {
        assertCameraAllPropertiesEquals(expectedCamera, getPersistedCamera(expectedCamera));
    }

    protected void assertPersistedCameraToMatchUpdatableProperties(Camera expectedCamera) {
        assertCameraAllUpdatablePropertiesEquals(expectedCamera, getPersistedCamera(expectedCamera));
    }
}
