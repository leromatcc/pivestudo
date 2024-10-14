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
import tcc.leroma.pivestudo.domain.TipoAutomovel;
import tcc.leroma.pivestudo.repository.TipoAutomovelRepository;
import tcc.leroma.pivestudo.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link tcc.leroma.pivestudo.domain.TipoAutomovel}.
 */
@RestController
@RequestMapping("/api/tipo-automovels")
@Transactional
public class TipoAutomovelResource {

    private static final Logger LOG = LoggerFactory.getLogger(TipoAutomovelResource.class);

    private static final String ENTITY_NAME = "tipoAutomovel";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TipoAutomovelRepository tipoAutomovelRepository;

    public TipoAutomovelResource(TipoAutomovelRepository tipoAutomovelRepository) {
        this.tipoAutomovelRepository = tipoAutomovelRepository;
    }

    /**
     * {@code POST  /tipo-automovels} : Create a new tipoAutomovel.
     *
     * @param tipoAutomovel the tipoAutomovel to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new tipoAutomovel, or with status {@code 400 (Bad Request)} if the tipoAutomovel has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<TipoAutomovel> createTipoAutomovel(@Valid @RequestBody TipoAutomovel tipoAutomovel) throws URISyntaxException {
        LOG.debug("REST request to save TipoAutomovel : {}", tipoAutomovel);
        if (tipoAutomovel.getId() != null) {
            throw new BadRequestAlertException("A new tipoAutomovel cannot already have an ID", ENTITY_NAME, "idexists");
        }
        tipoAutomovel = tipoAutomovelRepository.save(tipoAutomovel);
        return ResponseEntity.created(new URI("/api/tipo-automovels/" + tipoAutomovel.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, tipoAutomovel.getId().toString()))
            .body(tipoAutomovel);
    }

    /**
     * {@code PUT  /tipo-automovels/:id} : Updates an existing tipoAutomovel.
     *
     * @param id the id of the tipoAutomovel to save.
     * @param tipoAutomovel the tipoAutomovel to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated tipoAutomovel,
     * or with status {@code 400 (Bad Request)} if the tipoAutomovel is not valid,
     * or with status {@code 500 (Internal Server Error)} if the tipoAutomovel couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<TipoAutomovel> updateTipoAutomovel(
        @PathVariable(value = "id", required = false) final UUID id,
        @Valid @RequestBody TipoAutomovel tipoAutomovel
    ) throws URISyntaxException {
        LOG.debug("REST request to update TipoAutomovel : {}, {}", id, tipoAutomovel);
        if (tipoAutomovel.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, tipoAutomovel.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!tipoAutomovelRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        tipoAutomovel = tipoAutomovelRepository.save(tipoAutomovel);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, tipoAutomovel.getId().toString()))
            .body(tipoAutomovel);
    }

    /**
     * {@code PATCH  /tipo-automovels/:id} : Partial updates given fields of an existing tipoAutomovel, field will ignore if it is null
     *
     * @param id the id of the tipoAutomovel to save.
     * @param tipoAutomovel the tipoAutomovel to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated tipoAutomovel,
     * or with status {@code 400 (Bad Request)} if the tipoAutomovel is not valid,
     * or with status {@code 404 (Not Found)} if the tipoAutomovel is not found,
     * or with status {@code 500 (Internal Server Error)} if the tipoAutomovel couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<TipoAutomovel> partialUpdateTipoAutomovel(
        @PathVariable(value = "id", required = false) final UUID id,
        @NotNull @RequestBody TipoAutomovel tipoAutomovel
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update TipoAutomovel partially : {}, {}", id, tipoAutomovel);
        if (tipoAutomovel.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, tipoAutomovel.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!tipoAutomovelRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<TipoAutomovel> result = tipoAutomovelRepository
            .findById(tipoAutomovel.getId())
            .map(existingTipoAutomovel -> {
                if (tipoAutomovel.getDescricao() != null) {
                    existingTipoAutomovel.setDescricao(tipoAutomovel.getDescricao());
                }
                if (tipoAutomovel.getGrupo() != null) {
                    existingTipoAutomovel.setGrupo(tipoAutomovel.getGrupo());
                }

                return existingTipoAutomovel;
            })
            .map(tipoAutomovelRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, tipoAutomovel.getId().toString())
        );
    }

    /**
     * {@code GET  /tipo-automovels} : get all the tipoAutomovels.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of tipoAutomovels in body.
     */
    @GetMapping("")
    public List<TipoAutomovel> getAllTipoAutomovels() {
        LOG.debug("REST request to get all TipoAutomovels");
        return tipoAutomovelRepository.findAll();
    }

    /**
     * {@code GET  /tipo-automovels/:id} : get the "id" tipoAutomovel.
     *
     * @param id the id of the tipoAutomovel to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the tipoAutomovel, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<TipoAutomovel> getTipoAutomovel(@PathVariable("id") UUID id) {
        LOG.debug("REST request to get TipoAutomovel : {}", id);
        Optional<TipoAutomovel> tipoAutomovel = tipoAutomovelRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(tipoAutomovel);
    }

    /**
     * {@code DELETE  /tipo-automovels/:id} : delete the "id" tipoAutomovel.
     *
     * @param id the id of the tipoAutomovel to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTipoAutomovel(@PathVariable("id") UUID id) {
        LOG.debug("REST request to delete TipoAutomovel : {}", id);
        tipoAutomovelRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
