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
import tcc.leroma.pivestudo.domain.Estabelecimento;
import tcc.leroma.pivestudo.repository.EstabelecimentoRepository;
import tcc.leroma.pivestudo.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link tcc.leroma.pivestudo.domain.Estabelecimento}.
 */
@RestController
@RequestMapping("/api/estabelecimentos")
@Transactional
public class EstabelecimentoResource {

    private static final Logger LOG = LoggerFactory.getLogger(EstabelecimentoResource.class);

    private static final String ENTITY_NAME = "estabelecimento";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final EstabelecimentoRepository estabelecimentoRepository;

    public EstabelecimentoResource(EstabelecimentoRepository estabelecimentoRepository) {
        this.estabelecimentoRepository = estabelecimentoRepository;
    }

    /**
     * {@code POST  /estabelecimentos} : Create a new estabelecimento.
     *
     * @param estabelecimento the estabelecimento to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new estabelecimento, or with status {@code 400 (Bad Request)} if the estabelecimento has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Estabelecimento> createEstabelecimento(@Valid @RequestBody Estabelecimento estabelecimento)
        throws URISyntaxException {
        LOG.debug("REST request to save Estabelecimento : {}", estabelecimento);
        if (estabelecimento.getId() != null) {
            throw new BadRequestAlertException("A new estabelecimento cannot already have an ID", ENTITY_NAME, "idexists");
        }
        estabelecimento = estabelecimentoRepository.save(estabelecimento);
        return ResponseEntity.created(new URI("/api/estabelecimentos/" + estabelecimento.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, estabelecimento.getId().toString()))
            .body(estabelecimento);
    }

    /**
     * {@code PUT  /estabelecimentos/:id} : Updates an existing estabelecimento.
     *
     * @param id the id of the estabelecimento to save.
     * @param estabelecimento the estabelecimento to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated estabelecimento,
     * or with status {@code 400 (Bad Request)} if the estabelecimento is not valid,
     * or with status {@code 500 (Internal Server Error)} if the estabelecimento couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Estabelecimento> updateEstabelecimento(
        @PathVariable(value = "id", required = false) final UUID id,
        @Valid @RequestBody Estabelecimento estabelecimento
    ) throws URISyntaxException {
        LOG.debug("REST request to update Estabelecimento : {}, {}", id, estabelecimento);
        if (estabelecimento.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, estabelecimento.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!estabelecimentoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        estabelecimento = estabelecimentoRepository.save(estabelecimento);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, estabelecimento.getId().toString()))
            .body(estabelecimento);
    }

    /**
     * {@code PATCH  /estabelecimentos/:id} : Partial updates given fields of an existing estabelecimento, field will ignore if it is null
     *
     * @param id the id of the estabelecimento to save.
     * @param estabelecimento the estabelecimento to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated estabelecimento,
     * or with status {@code 400 (Bad Request)} if the estabelecimento is not valid,
     * or with status {@code 404 (Not Found)} if the estabelecimento is not found,
     * or with status {@code 500 (Internal Server Error)} if the estabelecimento couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Estabelecimento> partialUpdateEstabelecimento(
        @PathVariable(value = "id", required = false) final UUID id,
        @NotNull @RequestBody Estabelecimento estabelecimento
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Estabelecimento partially : {}, {}", id, estabelecimento);
        if (estabelecimento.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, estabelecimento.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!estabelecimentoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Estabelecimento> result = estabelecimentoRepository
            .findById(estabelecimento.getId())
            .map(existingEstabelecimento -> {
                if (estabelecimento.getDescricao() != null) {
                    existingEstabelecimento.setDescricao(estabelecimento.getDescricao());
                }

                return existingEstabelecimento;
            })
            .map(estabelecimentoRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, estabelecimento.getId().toString())
        );
    }

    /**
     * {@code GET  /estabelecimentos} : get all the estabelecimentos.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of estabelecimentos in body.
     */
    @GetMapping("")
    public List<Estabelecimento> getAllEstabelecimentos(
        @RequestParam(name = "eagerload", required = false, defaultValue = "true") boolean eagerload
    ) {
        LOG.debug("REST request to get all Estabelecimentos");
        if (eagerload) {
            return estabelecimentoRepository.findAllWithEagerRelationships();
        } else {
            return estabelecimentoRepository.findAll();
        }
    }

    /**
     * {@code GET  /estabelecimentos/:id} : get the "id" estabelecimento.
     *
     * @param id the id of the estabelecimento to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the estabelecimento, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Estabelecimento> getEstabelecimento(@PathVariable("id") UUID id) {
        LOG.debug("REST request to get Estabelecimento : {}", id);
        Optional<Estabelecimento> estabelecimento = estabelecimentoRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(estabelecimento);
    }

    /**
     * {@code DELETE  /estabelecimentos/:id} : delete the "id" estabelecimento.
     *
     * @param id the id of the estabelecimento to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEstabelecimento(@PathVariable("id") UUID id) {
        LOG.debug("REST request to delete Estabelecimento : {}", id);
        estabelecimentoRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
