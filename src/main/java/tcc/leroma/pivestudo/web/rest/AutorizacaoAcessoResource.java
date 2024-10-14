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
import tcc.leroma.pivestudo.domain.AutorizacaoAcesso;
import tcc.leroma.pivestudo.repository.AutorizacaoAcessoRepository;
import tcc.leroma.pivestudo.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link tcc.leroma.pivestudo.domain.AutorizacaoAcesso}.
 */
@RestController
@RequestMapping("/api/autorizacao-acessos")
@Transactional
public class AutorizacaoAcessoResource {

    private static final Logger LOG = LoggerFactory.getLogger(AutorizacaoAcessoResource.class);

    private static final String ENTITY_NAME = "autorizacaoAcesso";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AutorizacaoAcessoRepository autorizacaoAcessoRepository;

    public AutorizacaoAcessoResource(AutorizacaoAcessoRepository autorizacaoAcessoRepository) {
        this.autorizacaoAcessoRepository = autorizacaoAcessoRepository;
    }

    /**
     * {@code POST  /autorizacao-acessos} : Create a new autorizacaoAcesso.
     *
     * @param autorizacaoAcesso the autorizacaoAcesso to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new autorizacaoAcesso, or with status {@code 400 (Bad Request)} if the autorizacaoAcesso has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<AutorizacaoAcesso> createAutorizacaoAcesso(@Valid @RequestBody AutorizacaoAcesso autorizacaoAcesso)
        throws URISyntaxException {
        LOG.debug("REST request to save AutorizacaoAcesso : {}", autorizacaoAcesso);
        if (autorizacaoAcesso.getId() != null) {
            throw new BadRequestAlertException("A new autorizacaoAcesso cannot already have an ID", ENTITY_NAME, "idexists");
        }
        autorizacaoAcesso = autorizacaoAcessoRepository.save(autorizacaoAcesso);
        return ResponseEntity.created(new URI("/api/autorizacao-acessos/" + autorizacaoAcesso.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, autorizacaoAcesso.getId().toString()))
            .body(autorizacaoAcesso);
    }

    /**
     * {@code PUT  /autorizacao-acessos/:id} : Updates an existing autorizacaoAcesso.
     *
     * @param id the id of the autorizacaoAcesso to save.
     * @param autorizacaoAcesso the autorizacaoAcesso to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated autorizacaoAcesso,
     * or with status {@code 400 (Bad Request)} if the autorizacaoAcesso is not valid,
     * or with status {@code 500 (Internal Server Error)} if the autorizacaoAcesso couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<AutorizacaoAcesso> updateAutorizacaoAcesso(
        @PathVariable(value = "id", required = false) final UUID id,
        @Valid @RequestBody AutorizacaoAcesso autorizacaoAcesso
    ) throws URISyntaxException {
        LOG.debug("REST request to update AutorizacaoAcesso : {}, {}", id, autorizacaoAcesso);
        if (autorizacaoAcesso.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, autorizacaoAcesso.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!autorizacaoAcessoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        autorizacaoAcesso = autorizacaoAcessoRepository.save(autorizacaoAcesso);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, autorizacaoAcesso.getId().toString()))
            .body(autorizacaoAcesso);
    }

    /**
     * {@code PATCH  /autorizacao-acessos/:id} : Partial updates given fields of an existing autorizacaoAcesso, field will ignore if it is null
     *
     * @param id the id of the autorizacaoAcesso to save.
     * @param autorizacaoAcesso the autorizacaoAcesso to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated autorizacaoAcesso,
     * or with status {@code 400 (Bad Request)} if the autorizacaoAcesso is not valid,
     * or with status {@code 404 (Not Found)} if the autorizacaoAcesso is not found,
     * or with status {@code 500 (Internal Server Error)} if the autorizacaoAcesso couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<AutorizacaoAcesso> partialUpdateAutorizacaoAcesso(
        @PathVariable(value = "id", required = false) final UUID id,
        @NotNull @RequestBody AutorizacaoAcesso autorizacaoAcesso
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update AutorizacaoAcesso partially : {}, {}", id, autorizacaoAcesso);
        if (autorizacaoAcesso.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, autorizacaoAcesso.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!autorizacaoAcessoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<AutorizacaoAcesso> result = autorizacaoAcessoRepository
            .findById(autorizacaoAcesso.getId())
            .map(existingAutorizacaoAcesso -> {
                if (autorizacaoAcesso.getDescricao() != null) {
                    existingAutorizacaoAcesso.setDescricao(autorizacaoAcesso.getDescricao());
                }
                if (autorizacaoAcesso.getDataInicial() != null) {
                    existingAutorizacaoAcesso.setDataInicial(autorizacaoAcesso.getDataInicial());
                }
                if (autorizacaoAcesso.getDataFinal() != null) {
                    existingAutorizacaoAcesso.setDataFinal(autorizacaoAcesso.getDataFinal());
                }
                if (autorizacaoAcesso.getStatus() != null) {
                    existingAutorizacaoAcesso.setStatus(autorizacaoAcesso.getStatus());
                }

                return existingAutorizacaoAcesso;
            })
            .map(autorizacaoAcessoRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, autorizacaoAcesso.getId().toString())
        );
    }

    /**
     * {@code GET  /autorizacao-acessos} : get all the autorizacaoAcessos.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of autorizacaoAcessos in body.
     */
    @GetMapping("")
    public List<AutorizacaoAcesso> getAllAutorizacaoAcessos(
        @RequestParam(name = "eagerload", required = false, defaultValue = "true") boolean eagerload
    ) {
        LOG.debug("REST request to get all AutorizacaoAcessos");
        if (eagerload) {
            return autorizacaoAcessoRepository.findAllWithEagerRelationships();
        } else {
            return autorizacaoAcessoRepository.findAll();
        }
    }

    /**
     * {@code GET  /autorizacao-acessos/:id} : get the "id" autorizacaoAcesso.
     *
     * @param id the id of the autorizacaoAcesso to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the autorizacaoAcesso, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<AutorizacaoAcesso> getAutorizacaoAcesso(@PathVariable("id") UUID id) {
        LOG.debug("REST request to get AutorizacaoAcesso : {}", id);
        Optional<AutorizacaoAcesso> autorizacaoAcesso = autorizacaoAcessoRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(autorizacaoAcesso);
    }

    /**
     * {@code DELETE  /autorizacao-acessos/:id} : delete the "id" autorizacaoAcesso.
     *
     * @param id the id of the autorizacaoAcesso to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAutorizacaoAcesso(@PathVariable("id") UUID id) {
        LOG.debug("REST request to delete AutorizacaoAcesso : {}", id);
        autorizacaoAcessoRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
