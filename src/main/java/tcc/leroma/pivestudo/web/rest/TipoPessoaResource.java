package tcc.leroma.pivestudo.web.rest;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.StreamSupport;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tcc.leroma.pivestudo.domain.TipoPessoa;
import tcc.leroma.pivestudo.repository.TipoPessoaRepository;
import tcc.leroma.pivestudo.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link tcc.leroma.pivestudo.domain.TipoPessoa}.
 */
@RestController
@RequestMapping("/api/tipo-pessoas")
@Transactional
public class TipoPessoaResource {

    private static final Logger LOG = LoggerFactory.getLogger(TipoPessoaResource.class);

    private static final String ENTITY_NAME = "tipoPessoa";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TipoPessoaRepository tipoPessoaRepository;

    public TipoPessoaResource(TipoPessoaRepository tipoPessoaRepository) {
        this.tipoPessoaRepository = tipoPessoaRepository;
    }

    /**
     * {@code POST  /tipo-pessoas} : Create a new tipoPessoa.
     *
     * @param tipoPessoa the tipoPessoa to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new tipoPessoa, or with status {@code 400 (Bad Request)} if the tipoPessoa has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<TipoPessoa> createTipoPessoa(@Valid @RequestBody TipoPessoa tipoPessoa) throws URISyntaxException {
        LOG.debug("REST request to save TipoPessoa : {}", tipoPessoa);
        if (tipoPessoa.getId() != null) {
            throw new BadRequestAlertException("A new tipoPessoa cannot already have an ID", ENTITY_NAME, "idexists");
        }
        tipoPessoa = tipoPessoaRepository.save(tipoPessoa);
        return ResponseEntity.created(new URI("/api/tipo-pessoas/" + tipoPessoa.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, tipoPessoa.getId().toString()))
            .body(tipoPessoa);
    }

    /**
     * {@code PUT  /tipo-pessoas/:id} : Updates an existing tipoPessoa.
     *
     * @param id the id of the tipoPessoa to save.
     * @param tipoPessoa the tipoPessoa to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated tipoPessoa,
     * or with status {@code 400 (Bad Request)} if the tipoPessoa is not valid,
     * or with status {@code 500 (Internal Server Error)} if the tipoPessoa couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<TipoPessoa> updateTipoPessoa(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody TipoPessoa tipoPessoa
    ) throws URISyntaxException {
        LOG.debug("REST request to update TipoPessoa : {}, {}", id, tipoPessoa);
        if (tipoPessoa.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, tipoPessoa.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!tipoPessoaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        tipoPessoa = tipoPessoaRepository.save(tipoPessoa);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, tipoPessoa.getId().toString()))
            .body(tipoPessoa);
    }

    /**
     * {@code PATCH  /tipo-pessoas/:id} : Partial updates given fields of an existing tipoPessoa, field will ignore if it is null
     *
     * @param id the id of the tipoPessoa to save.
     * @param tipoPessoa the tipoPessoa to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated tipoPessoa,
     * or with status {@code 400 (Bad Request)} if the tipoPessoa is not valid,
     * or with status {@code 404 (Not Found)} if the tipoPessoa is not found,
     * or with status {@code 500 (Internal Server Error)} if the tipoPessoa couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<TipoPessoa> partialUpdateTipoPessoa(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody TipoPessoa tipoPessoa
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update TipoPessoa partially : {}, {}", id, tipoPessoa);
        if (tipoPessoa.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, tipoPessoa.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!tipoPessoaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<TipoPessoa> result = tipoPessoaRepository
            .findById(tipoPessoa.getId())
            .map(existingTipoPessoa -> {
                if (tipoPessoa.getDescricao() != null) {
                    existingTipoPessoa.setDescricao(tipoPessoa.getDescricao());
                }
                if (tipoPessoa.getGrupo() != null) {
                    existingTipoPessoa.setGrupo(tipoPessoa.getGrupo());
                }

                return existingTipoPessoa;
            })
            .map(tipoPessoaRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, tipoPessoa.getId().toString())
        );
    }

    /**
     * {@code GET  /tipo-pessoas} : get all the tipoPessoas.
     *
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of tipoPessoas in body.
     */
    @GetMapping("")
    public List<TipoPessoa> getAllTipoPessoas(@RequestParam(name = "filter", required = false) String filter) {
        if ("pessoa-is-null".equals(filter)) {
            LOG.debug("REST request to get all TipoPessoas where pessoa is null");
            return StreamSupport.stream(tipoPessoaRepository.findAll().spliterator(), false)
                .filter(tipoPessoa -> tipoPessoa.getPessoa() == null)
                .toList();
        }
        LOG.debug("REST request to get all TipoPessoas");
        return tipoPessoaRepository.findAll();
    }

    /**
     * {@code GET  /tipo-pessoas/:id} : get the "id" tipoPessoa.
     *
     * @param id the id of the tipoPessoa to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the tipoPessoa, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<TipoPessoa> getTipoPessoa(@PathVariable("id") Long id) {
        LOG.debug("REST request to get TipoPessoa : {}", id);
        Optional<TipoPessoa> tipoPessoa = tipoPessoaRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(tipoPessoa);
    }

    /**
     * {@code DELETE  /tipo-pessoas/:id} : delete the "id" tipoPessoa.
     *
     * @param id the id of the tipoPessoa to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTipoPessoa(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete TipoPessoa : {}", id);
        tipoPessoaRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
