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
import tcc.leroma.pivestudo.domain.LoteBlocoApartamento;
import tcc.leroma.pivestudo.repository.LoteBlocoApartamentoRepository;
import tcc.leroma.pivestudo.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link tcc.leroma.pivestudo.domain.LoteBlocoApartamento}.
 */
@RestController
@RequestMapping("/api/lote-bloco-apartamentos")
@Transactional
public class LoteBlocoApartamentoResource {

    private static final Logger LOG = LoggerFactory.getLogger(LoteBlocoApartamentoResource.class);

    private static final String ENTITY_NAME = "loteBlocoApartamento";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final LoteBlocoApartamentoRepository loteBlocoApartamentoRepository;

    public LoteBlocoApartamentoResource(LoteBlocoApartamentoRepository loteBlocoApartamentoRepository) {
        this.loteBlocoApartamentoRepository = loteBlocoApartamentoRepository;
    }

    /**
     * {@code POST  /lote-bloco-apartamentos} : Create a new loteBlocoApartamento.
     *
     * @param loteBlocoApartamento the loteBlocoApartamento to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new loteBlocoApartamento, or with status {@code 400 (Bad Request)} if the loteBlocoApartamento has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<LoteBlocoApartamento> createLoteBlocoApartamento(@Valid @RequestBody LoteBlocoApartamento loteBlocoApartamento)
        throws URISyntaxException {
        LOG.debug("REST request to save LoteBlocoApartamento : {}", loteBlocoApartamento);
        if (loteBlocoApartamento.getId() != null) {
            throw new BadRequestAlertException("A new loteBlocoApartamento cannot already have an ID", ENTITY_NAME, "idexists");
        }
        loteBlocoApartamento = loteBlocoApartamentoRepository.save(loteBlocoApartamento);
        return ResponseEntity.created(new URI("/api/lote-bloco-apartamentos/" + loteBlocoApartamento.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, loteBlocoApartamento.getId().toString()))
            .body(loteBlocoApartamento);
    }

    /**
     * {@code PUT  /lote-bloco-apartamentos/:id} : Updates an existing loteBlocoApartamento.
     *
     * @param id the id of the loteBlocoApartamento to save.
     * @param loteBlocoApartamento the loteBlocoApartamento to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated loteBlocoApartamento,
     * or with status {@code 400 (Bad Request)} if the loteBlocoApartamento is not valid,
     * or with status {@code 500 (Internal Server Error)} if the loteBlocoApartamento couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<LoteBlocoApartamento> updateLoteBlocoApartamento(
        @PathVariable(value = "id", required = false) final UUID id,
        @Valid @RequestBody LoteBlocoApartamento loteBlocoApartamento
    ) throws URISyntaxException {
        LOG.debug("REST request to update LoteBlocoApartamento : {}, {}", id, loteBlocoApartamento);
        if (loteBlocoApartamento.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, loteBlocoApartamento.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!loteBlocoApartamentoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        loteBlocoApartamento = loteBlocoApartamentoRepository.save(loteBlocoApartamento);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, loteBlocoApartamento.getId().toString()))
            .body(loteBlocoApartamento);
    }

    /**
     * {@code PATCH  /lote-bloco-apartamentos/:id} : Partial updates given fields of an existing loteBlocoApartamento, field will ignore if it is null
     *
     * @param id the id of the loteBlocoApartamento to save.
     * @param loteBlocoApartamento the loteBlocoApartamento to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated loteBlocoApartamento,
     * or with status {@code 400 (Bad Request)} if the loteBlocoApartamento is not valid,
     * or with status {@code 404 (Not Found)} if the loteBlocoApartamento is not found,
     * or with status {@code 500 (Internal Server Error)} if the loteBlocoApartamento couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<LoteBlocoApartamento> partialUpdateLoteBlocoApartamento(
        @PathVariable(value = "id", required = false) final UUID id,
        @NotNull @RequestBody LoteBlocoApartamento loteBlocoApartamento
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update LoteBlocoApartamento partially : {}, {}", id, loteBlocoApartamento);
        if (loteBlocoApartamento.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, loteBlocoApartamento.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!loteBlocoApartamentoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<LoteBlocoApartamento> result = loteBlocoApartamentoRepository
            .findById(loteBlocoApartamento.getId())
            .map(existingLoteBlocoApartamento -> {
                if (loteBlocoApartamento.getBloco() != null) {
                    existingLoteBlocoApartamento.setBloco(loteBlocoApartamento.getBloco());
                }
                if (loteBlocoApartamento.getAndar() != null) {
                    existingLoteBlocoApartamento.setAndar(loteBlocoApartamento.getAndar());
                }
                if (loteBlocoApartamento.getNumero() != null) {
                    existingLoteBlocoApartamento.setNumero(loteBlocoApartamento.getNumero());
                }

                return existingLoteBlocoApartamento;
            })
            .map(loteBlocoApartamentoRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, loteBlocoApartamento.getId().toString())
        );
    }

    /**
     * {@code GET  /lote-bloco-apartamentos} : get all the loteBlocoApartamentos.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of loteBlocoApartamentos in body.
     */
    @GetMapping("")
    public List<LoteBlocoApartamento> getAllLoteBlocoApartamentos(
        @RequestParam(name = "eagerload", required = false, defaultValue = "true") boolean eagerload
    ) {
        LOG.debug("REST request to get all LoteBlocoApartamentos");
        if (eagerload) {
            return loteBlocoApartamentoRepository.findAllWithEagerRelationships();
        } else {
            return loteBlocoApartamentoRepository.findAll();
        }
    }

    /**
     * {@code GET  /lote-bloco-apartamentos/:id} : get the "id" loteBlocoApartamento.
     *
     * @param id the id of the loteBlocoApartamento to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the loteBlocoApartamento, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<LoteBlocoApartamento> getLoteBlocoApartamento(@PathVariable("id") UUID id) {
        LOG.debug("REST request to get LoteBlocoApartamento : {}", id);
        Optional<LoteBlocoApartamento> loteBlocoApartamento = loteBlocoApartamentoRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(loteBlocoApartamento);
    }

    /**
     * {@code DELETE  /lote-bloco-apartamentos/:id} : delete the "id" loteBlocoApartamento.
     *
     * @param id the id of the loteBlocoApartamento to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLoteBlocoApartamento(@PathVariable("id") UUID id) {
        LOG.debug("REST request to delete LoteBlocoApartamento : {}", id);
        loteBlocoApartamentoRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
