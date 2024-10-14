package tcc.leroma.pivestudo.web.rest;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tcc.leroma.pivestudo.domain.Camera;
import tcc.leroma.pivestudo.repository.CameraRepository;
import tcc.leroma.pivestudo.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link tcc.leroma.pivestudo.domain.Camera}.
 */
@RestController
@RequestMapping("/api/cameras")
@Transactional
public class CameraResource {

    private static final Logger LOG = LoggerFactory.getLogger(CameraResource.class);

    private static final String ENTITY_NAME = "camera";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CameraRepository cameraRepository;

    public CameraResource(CameraRepository cameraRepository) {
        this.cameraRepository = cameraRepository;
    }

    /**
     * {@code POST  /cameras} : Create a new camera.
     *
     * @param camera the camera to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new camera, or with status {@code 400 (Bad Request)} if the camera has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Camera> createCamera(@Valid @RequestBody Camera camera) throws URISyntaxException {
        LOG.debug("REST request to save Camera : {}", camera);
        if (camera.getId() != null) {
            throw new BadRequestAlertException("A new camera cannot already have an ID", ENTITY_NAME, "idexists");
        }
        camera = cameraRepository.save(camera);
        return ResponseEntity.created(new URI("/api/cameras/" + camera.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, camera.getId().toString()))
            .body(camera);
    }

    /**
     * {@code PUT  /cameras/:id} : Updates an existing camera.
     *
     * @param id the id of the camera to save.
     * @param camera the camera to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated camera,
     * or with status {@code 400 (Bad Request)} if the camera is not valid,
     * or with status {@code 500 (Internal Server Error)} if the camera couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Camera> updateCamera(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Camera camera
    ) throws URISyntaxException {
        LOG.debug("REST request to update Camera : {}, {}", id, camera);
        if (camera.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, camera.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!cameraRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        camera = cameraRepository.save(camera);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, camera.getId().toString()))
            .body(camera);
    }

    /**
     * {@code PATCH  /cameras/:id} : Partial updates given fields of an existing camera, field will ignore if it is null
     *
     * @param id the id of the camera to save.
     * @param camera the camera to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated camera,
     * or with status {@code 400 (Bad Request)} if the camera is not valid,
     * or with status {@code 404 (Not Found)} if the camera is not found,
     * or with status {@code 500 (Internal Server Error)} if the camera couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Camera> partialUpdateCamera(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Camera camera
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Camera partially : {}, {}", id, camera);
        if (camera.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, camera.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!cameraRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Camera> result = cameraRepository
            .findById(camera.getId())
            .map(existingCamera -> {
                if (camera.getDescricao() != null) {
                    existingCamera.setDescricao(camera.getDescricao());
                }
                if (camera.getEnderecoRede() != null) {
                    existingCamera.setEnderecoRede(camera.getEnderecoRede());
                }
                if (camera.getApi() != null) {
                    existingCamera.setApi(camera.getApi());
                }

                return existingCamera;
            })
            .map(cameraRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, camera.getId().toString())
        );
    }

    /**
     * {@code GET  /cameras} : get all the cameras.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of cameras in body.
     */
    @GetMapping("")
    public List<Camera> getAllCameras(@RequestParam(name = "eagerload", required = false, defaultValue = "true") boolean eagerload) {
        LOG.debug("REST request to get all Cameras");
        if (eagerload) {
            return cameraRepository.findAllWithEagerRelationships();
        } else {
            return cameraRepository.findAll();
        }
    }

    /**
     * {@code GET  /cameras/:id} : get the "id" camera.
     *
     * @param id the id of the camera to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the camera, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Camera> getCamera(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Camera : {}", id);
        Optional<Camera> camera = cameraRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(camera);
    }

    /**
     * {@code DELETE  /cameras/:id} : delete the "id" camera.
     *
     * @param id the id of the camera to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCamera(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete Camera : {}", id);
        cameraRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
