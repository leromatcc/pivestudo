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
import tcc.leroma.pivestudo.domain.Imagem;
import tcc.leroma.pivestudo.repository.ImagemRepository;
import tcc.leroma.pivestudo.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link tcc.leroma.pivestudo.domain.Imagem}.
 */
@RestController
@RequestMapping("/api/imagems")
@Transactional
public class ImagemResource {

    private static final Logger LOG = LoggerFactory.getLogger(ImagemResource.class);

    private static final String ENTITY_NAME = "imagem";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ImagemRepository imagemRepository;

    public ImagemResource(ImagemRepository imagemRepository) {
        this.imagemRepository = imagemRepository;
    }

    /**
     * {@code POST  /imagems} : Create a new imagem.
     *
     * @param imagem the imagem to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new imagem, or with status {@code 400 (Bad Request)} if the imagem has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Imagem> createImagem(@Valid @RequestBody Imagem imagem) throws URISyntaxException {
        LOG.debug("REST request to save Imagem : {}", imagem);
        if (imagem.getId() != null) {
            throw new BadRequestAlertException("A new imagem cannot already have an ID", ENTITY_NAME, "idexists");
        }
        imagem = imagemRepository.save(imagem);
        return ResponseEntity.created(new URI("/api/imagems/" + imagem.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, imagem.getId().toString()))
            .body(imagem);
    }

    /**
     * {@code PUT  /imagems/:id} : Updates an existing imagem.
     *
     * @param id the id of the imagem to save.
     * @param imagem the imagem to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated imagem,
     * or with status {@code 400 (Bad Request)} if the imagem is not valid,
     * or with status {@code 500 (Internal Server Error)} if the imagem couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Imagem> updateImagem(
        @PathVariable(value = "id", required = false) final UUID id,
        @Valid @RequestBody Imagem imagem
    ) throws URISyntaxException {
        LOG.debug("REST request to update Imagem : {}, {}", id, imagem);
        if (imagem.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, imagem.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!imagemRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        imagem = imagemRepository.save(imagem);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, imagem.getId().toString()))
            .body(imagem);
    }

    /**
     * {@code PATCH  /imagems/:id} : Partial updates given fields of an existing imagem, field will ignore if it is null
     *
     * @param id the id of the imagem to save.
     * @param imagem the imagem to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated imagem,
     * or with status {@code 400 (Bad Request)} if the imagem is not valid,
     * or with status {@code 404 (Not Found)} if the imagem is not found,
     * or with status {@code 500 (Internal Server Error)} if the imagem couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Imagem> partialUpdateImagem(
        @PathVariable(value = "id", required = false) final UUID id,
        @NotNull @RequestBody Imagem imagem
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Imagem partially : {}, {}", id, imagem);
        if (imagem.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, imagem.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!imagemRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Imagem> result = imagemRepository
            .findById(imagem.getId())
            .map(existingImagem -> {
                if (imagem.getNome() != null) {
                    existingImagem.setNome(imagem.getNome());
                }
                if (imagem.getCaminho() != null) {
                    existingImagem.setCaminho(imagem.getCaminho());
                }
                if (imagem.getDescricao() != null) {
                    existingImagem.setDescricao(imagem.getDescricao());
                }
                if (imagem.getCadeiaDetectada() != null) {
                    existingImagem.setCadeiaDetectada(imagem.getCadeiaDetectada());
                }
                if (imagem.getDateAnalise() != null) {
                    existingImagem.setDateAnalise(imagem.getDateAnalise());
                }

                return existingImagem;
            })
            .map(imagemRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, imagem.getId().toString())
        );
    }

    /**
     * {@code GET  /imagems} : get all the imagems.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of imagems in body.
     */
    @GetMapping("")
    public List<Imagem> getAllImagems(@RequestParam(name = "eagerload", required = false, defaultValue = "true") boolean eagerload) {
        LOG.debug("REST request to get all Imagems");
        if (eagerload) {
            return imagemRepository.findAllWithEagerRelationships();
        } else {
            return imagemRepository.findAll();
        }
    }

    /**
     * {@code GET  /imagems/:id} : get the "id" imagem.
     *
     * @param id the id of the imagem to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the imagem, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Imagem> getImagem(@PathVariable("id") UUID id) {
        LOG.debug("REST request to get Imagem : {}", id);
        Optional<Imagem> imagem = imagemRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(imagem);
    }

    /**
     * {@code DELETE  /imagems/:id} : delete the "id" imagem.
     *
     * @param id the id of the imagem to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteImagem(@PathVariable("id") UUID id) {
        LOG.debug("REST request to delete Imagem : {}", id);
        imagemRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
