package tcc.leroma.pivestudo.web.rest;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tcc.leroma.pivestudo.domain.Automovel;
import tcc.leroma.pivestudo.repository.AutomovelRepository;
import tcc.leroma.pivestudo.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link tcc.leroma.pivestudo.domain.Automovel}.
 */
@RestController
@RequestMapping("/api/automovels")
@Transactional
public class AutomovelResource {

    private static final Logger LOG = LoggerFactory.getLogger(AutomovelResource.class);

    private static final String ENTITY_NAME = "automovel";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AutomovelRepository automovelRepository;

    public AutomovelResource(AutomovelRepository automovelRepository) {
        this.automovelRepository = automovelRepository;
    }

    /**
     * {@code POST  /automovels} : Create a new automovel.
     *
     * @param automovel the automovel to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new automovel, or with status {@code 400 (Bad Request)} if the automovel has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Automovel> createAutomovel(@Valid @RequestBody Automovel automovel) throws URISyntaxException {
        LOG.debug("REST request to save Automovel : {}", automovel);
        if (automovel.getId() != null) {
            throw new BadRequestAlertException("A new automovel cannot already have an ID", ENTITY_NAME, "idexists");
        }
        automovel = automovelRepository.save(automovel);
        return ResponseEntity.created(new URI("/api/automovels/" + automovel.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, automovel.getId().toString()))
            .body(automovel);
    }

    /**
     * {@code PUT  /automovels/:id} : Updates an existing automovel.
     *
     * @param id the id of the automovel to save.
     * @param automovel the automovel to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated automovel,
     * or with status {@code 400 (Bad Request)} if the automovel is not valid,
     * or with status {@code 500 (Internal Server Error)} if the automovel couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Automovel> updateAutomovel(
        @PathVariable(value = "id", required = false) final UUID id,
        @Valid @RequestBody Automovel automovel
    ) throws URISyntaxException {
        LOG.debug("REST request to update Automovel : {}, {}", id, automovel);
        if (automovel.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, automovel.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!automovelRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        automovel = automovelRepository.save(automovel);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, automovel.getId().toString()))
            .body(automovel);
    }

    /**
     * {@code PATCH  /automovels/:id} : Partial updates given fields of an existing automovel, field will ignore if it is null
     *
     * @param id the id of the automovel to save.
     * @param automovel the automovel to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated automovel,
     * or with status {@code 400 (Bad Request)} if the automovel is not valid,
     * or with status {@code 404 (Not Found)} if the automovel is not found,
     * or with status {@code 500 (Internal Server Error)} if the automovel couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Automovel> partialUpdateAutomovel(
        @PathVariable(value = "id", required = false) final UUID id,
        @NotNull @RequestBody Automovel automovel
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Automovel partially : {}, {}", id, automovel);
        if (automovel.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, automovel.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!automovelRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Automovel> result = automovelRepository
            .findById(automovel.getId())
            .map(existingAutomovel -> {
                if (automovel.getPlaca() != null) {
                    existingAutomovel.setPlaca(automovel.getPlaca());
                }
                if (automovel.getDescricao() != null) {
                    existingAutomovel.setDescricao(automovel.getDescricao());
                }

                return existingAutomovel;
            })
            .map(automovelRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, automovel.getId().toString())
        );
    }

    /**
     * {@code GET  /automovels} : get all the automovels.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of automovels in body.
     */
    @GetMapping("")
    public List<Automovel> getAllAutomovels(@RequestParam(name = "eagerload", required = false, defaultValue = "true") boolean eagerload) {
        LOG.debug("REST request to get all Automovels");
        if (eagerload) {
            return automovelRepository.findAllWithEagerRelationships();
        } else {
            return automovelRepository.findAll();
        }
    }

    /**
     * {@code GET  /automovels/:id} : get the "id" automovel.
     *
     * @param id the id of the automovel to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the automovel, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Automovel> getAutomovel(@PathVariable("id") UUID id) {
        LOG.debug("REST request to get Automovel : {}", id);
        Optional<Automovel> automovel = automovelRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(automovel);
    }

    /**
     * {@code DELETE  /automovels/:id} : delete the "id" automovel.
     *
     * @param id the id of the automovel to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAutomovel(@PathVariable("id") UUID id) {
        LOG.debug("REST request to delete Automovel : {}", id);
        automovelRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
