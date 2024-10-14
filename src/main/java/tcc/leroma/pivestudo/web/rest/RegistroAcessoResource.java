package tcc.leroma.pivestudo.web.rest;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.StreamSupport;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tcc.leroma.pivestudo.domain.RegistroAcesso;
import tcc.leroma.pivestudo.repository.RegistroAcessoRepository;
import tcc.leroma.pivestudo.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link tcc.leroma.pivestudo.domain.RegistroAcesso}.
 */
@RestController
@RequestMapping("/api/registro-acessos")
@Transactional
public class RegistroAcessoResource {

    private static final Logger LOG = LoggerFactory.getLogger(RegistroAcessoResource.class);

    private static final String ENTITY_NAME = "registroAcesso";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final RegistroAcessoRepository registroAcessoRepository;

    public RegistroAcessoResource(RegistroAcessoRepository registroAcessoRepository) {
        this.registroAcessoRepository = registroAcessoRepository;
    }

    /**
     * {@code POST  /registro-acessos} : Create a new registroAcesso.
     *
     * @param registroAcesso the registroAcesso to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new registroAcesso, or with status {@code 400 (Bad Request)} if the registroAcesso has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<RegistroAcesso> createRegistroAcesso(@Valid @RequestBody RegistroAcesso registroAcesso)
        throws URISyntaxException {
        LOG.debug("REST request to save RegistroAcesso : {}", registroAcesso);
        if (registroAcesso.getId() != null) {
            throw new BadRequestAlertException("A new registroAcesso cannot already have an ID", ENTITY_NAME, "idexists");
        }
        registroAcesso = registroAcessoRepository.save(registroAcesso);
        return ResponseEntity.created(new URI("/api/registro-acessos/" + registroAcesso.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, registroAcesso.getId().toString()))
            .body(registroAcesso);
    }

    /**
     * {@code PUT  /registro-acessos/:id} : Updates an existing registroAcesso.
     *
     * @param id the id of the registroAcesso to save.
     * @param registroAcesso the registroAcesso to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated registroAcesso,
     * or with status {@code 400 (Bad Request)} if the registroAcesso is not valid,
     * or with status {@code 500 (Internal Server Error)} if the registroAcesso couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<RegistroAcesso> updateRegistroAcesso(
        @PathVariable(value = "id", required = false) final UUID id,
        @Valid @RequestBody RegistroAcesso registroAcesso
    ) throws URISyntaxException {
        LOG.debug("REST request to update RegistroAcesso : {}, {}", id, registroAcesso);
        if (registroAcesso.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, registroAcesso.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!registroAcessoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        registroAcesso = registroAcessoRepository.save(registroAcesso);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, registroAcesso.getId().toString()))
            .body(registroAcesso);
    }

    /**
     * {@code PATCH  /registro-acessos/:id} : Partial updates given fields of an existing registroAcesso, field will ignore if it is null
     *
     * @param id the id of the registroAcesso to save.
     * @param registroAcesso the registroAcesso to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated registroAcesso,
     * or with status {@code 400 (Bad Request)} if the registroAcesso is not valid,
     * or with status {@code 404 (Not Found)} if the registroAcesso is not found,
     * or with status {@code 500 (Internal Server Error)} if the registroAcesso couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<RegistroAcesso> partialUpdateRegistroAcesso(
        @PathVariable(value = "id", required = false) final UUID id,
        @NotNull @RequestBody RegistroAcesso registroAcesso
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update RegistroAcesso partially : {}, {}", id, registroAcesso);
        if (registroAcesso.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, registroAcesso.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!registroAcessoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<RegistroAcesso> result = registroAcessoRepository
            .findById(registroAcesso.getId())
            .map(existingRegistroAcesso -> {
                if (registroAcesso.getDataHora() != null) {
                    existingRegistroAcesso.setDataHora(registroAcesso.getDataHora());
                }
                if (registroAcesso.getCadeiaAnalisada() != null) {
                    existingRegistroAcesso.setCadeiaAnalisada(registroAcesso.getCadeiaAnalisada());
                }
                if (registroAcesso.getAcessoAutorizado() != null) {
                    existingRegistroAcesso.setAcessoAutorizado(registroAcesso.getAcessoAutorizado());
                }

                return existingRegistroAcesso;
            })
            .map(registroAcessoRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, registroAcesso.getId().toString())
        );
    }

    /**
     * {@code GET  /registro-acessos} : get all the registroAcessos.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of registroAcessos in body.
     */
    @GetMapping("")
    public List<RegistroAcesso> getAllRegistroAcessos(
        @RequestParam(name = "filter", required = false) String filter,
        @RequestParam(name = "eagerload", required = false, defaultValue = "true") boolean eagerload
    ) {
        if ("imagem-is-null".equals(filter)) {
            LOG.debug("REST request to get all RegistroAcessos where imagem is null");
            return StreamSupport.stream(registroAcessoRepository.findAll().spliterator(), false)
                .filter(registroAcesso -> registroAcesso.getImagem() == null)
                .toList();
        }
        LOG.debug("REST request to get all RegistroAcessos");
        if (eagerload) {
            return registroAcessoRepository.findAllWithEagerRelationships();
        } else {
            return registroAcessoRepository.findAll();
        }
    }

    /**
     * {@code GET  /registro-acessos/:id} : get the "id" registroAcesso.
     *
     * @param id the id of the registroAcesso to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the registroAcesso, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<RegistroAcesso> getRegistroAcesso(@PathVariable("id") UUID id) {
        LOG.debug("REST request to get RegistroAcesso : {}", id);
        Optional<RegistroAcesso> registroAcesso = registroAcessoRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(registroAcesso);
    }

    /**
     * {@code DELETE  /registro-acessos/:id} : delete the "id" registroAcesso.
     *
     * @param id the id of the registroAcesso to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRegistroAcesso(@PathVariable("id") UUID id) {
        LOG.debug("REST request to delete RegistroAcesso : {}", id);
        registroAcessoRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
