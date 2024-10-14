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
import tcc.leroma.pivestudo.domain.PontoAcesso;
import tcc.leroma.pivestudo.repository.PontoAcessoRepository;
import tcc.leroma.pivestudo.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link tcc.leroma.pivestudo.domain.PontoAcesso}.
 */
@RestController
@RequestMapping("/api/ponto-acessos")
@Transactional
public class PontoAcessoResource {

    private static final Logger LOG = LoggerFactory.getLogger(PontoAcessoResource.class);

    private static final String ENTITY_NAME = "pontoAcesso";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PontoAcessoRepository pontoAcessoRepository;

    public PontoAcessoResource(PontoAcessoRepository pontoAcessoRepository) {
        this.pontoAcessoRepository = pontoAcessoRepository;
    }

    /**
     * {@code POST  /ponto-acessos} : Create a new pontoAcesso.
     *
     * @param pontoAcesso the pontoAcesso to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new pontoAcesso, or with status {@code 400 (Bad Request)} if the pontoAcesso has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<PontoAcesso> createPontoAcesso(@Valid @RequestBody PontoAcesso pontoAcesso) throws URISyntaxException {
        LOG.debug("REST request to save PontoAcesso : {}", pontoAcesso);
        if (pontoAcesso.getId() != null) {
            throw new BadRequestAlertException("A new pontoAcesso cannot already have an ID", ENTITY_NAME, "idexists");
        }
        pontoAcesso = pontoAcessoRepository.save(pontoAcesso);
        return ResponseEntity.created(new URI("/api/ponto-acessos/" + pontoAcesso.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, pontoAcesso.getId().toString()))
            .body(pontoAcesso);
    }

    /**
     * {@code PUT  /ponto-acessos/:id} : Updates an existing pontoAcesso.
     *
     * @param id the id of the pontoAcesso to save.
     * @param pontoAcesso the pontoAcesso to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated pontoAcesso,
     * or with status {@code 400 (Bad Request)} if the pontoAcesso is not valid,
     * or with status {@code 500 (Internal Server Error)} if the pontoAcesso couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<PontoAcesso> updatePontoAcesso(
        @PathVariable(value = "id", required = false) final UUID id,
        @Valid @RequestBody PontoAcesso pontoAcesso
    ) throws URISyntaxException {
        LOG.debug("REST request to update PontoAcesso : {}, {}", id, pontoAcesso);
        if (pontoAcesso.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, pontoAcesso.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!pontoAcessoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        pontoAcesso = pontoAcessoRepository.save(pontoAcesso);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, pontoAcesso.getId().toString()))
            .body(pontoAcesso);
    }

    /**
     * {@code PATCH  /ponto-acessos/:id} : Partial updates given fields of an existing pontoAcesso, field will ignore if it is null
     *
     * @param id the id of the pontoAcesso to save.
     * @param pontoAcesso the pontoAcesso to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated pontoAcesso,
     * or with status {@code 400 (Bad Request)} if the pontoAcesso is not valid,
     * or with status {@code 404 (Not Found)} if the pontoAcesso is not found,
     * or with status {@code 500 (Internal Server Error)} if the pontoAcesso couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<PontoAcesso> partialUpdatePontoAcesso(
        @PathVariable(value = "id", required = false) final UUID id,
        @NotNull @RequestBody PontoAcesso pontoAcesso
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update PontoAcesso partially : {}, {}", id, pontoAcesso);
        if (pontoAcesso.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, pontoAcesso.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!pontoAcessoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<PontoAcesso> result = pontoAcessoRepository
            .findById(pontoAcesso.getId())
            .map(existingPontoAcesso -> {
                if (pontoAcesso.getDescricao() != null) {
                    existingPontoAcesso.setDescricao(pontoAcesso.getDescricao());
                }

                return existingPontoAcesso;
            })
            .map(pontoAcessoRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, pontoAcesso.getId().toString())
        );
    }

    /**
     * {@code GET  /ponto-acessos} : get all the pontoAcessos.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of pontoAcessos in body.
     */
    @GetMapping("")
    public List<PontoAcesso> getAllPontoAcessos(
        @RequestParam(name = "eagerload", required = false, defaultValue = "true") boolean eagerload
    ) {
        LOG.debug("REST request to get all PontoAcessos");
        if (eagerload) {
            return pontoAcessoRepository.findAllWithEagerRelationships();
        } else {
            return pontoAcessoRepository.findAll();
        }
    }

    /**
     * {@code GET  /ponto-acessos/:id} : get the "id" pontoAcesso.
     *
     * @param id the id of the pontoAcesso to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the pontoAcesso, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<PontoAcesso> getPontoAcesso(@PathVariable("id") UUID id) {
        LOG.debug("REST request to get PontoAcesso : {}", id);
        Optional<PontoAcesso> pontoAcesso = pontoAcessoRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(pontoAcesso);
    }

    /**
     * {@code DELETE  /ponto-acessos/:id} : delete the "id" pontoAcesso.
     *
     * @param id the id of the pontoAcesso to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePontoAcesso(@PathVariable("id") UUID id) {
        LOG.debug("REST request to delete PontoAcesso : {}", id);
        pontoAcessoRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
