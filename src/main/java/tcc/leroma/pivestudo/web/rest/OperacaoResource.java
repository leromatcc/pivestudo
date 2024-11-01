package tcc.leroma.pivestudo.web.rest;

import jakarta.persistence.EntityManager;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.AutoConfigureOrder;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.MultipartBodyBuilder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestTemplate;
import tcc.leroma.pivestudo.domain.*;
import tcc.leroma.pivestudo.domain.enumeration.TipoAcessoAutorizado;
import tcc.leroma.pivestudo.interop.CallScripts;
import tcc.leroma.pivestudo.repository.*;
import tcc.leroma.pivestudo.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;



import java.io.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import javax.imageio.ImageIO;

import java.text.SimpleDateFormat;
/**
 * REST controller for managing {@link tcc.leroma.pivestudo.domain.Operacao}.
 */
@RestController
@RequestMapping("/api/operacaos")
@Transactional
public class OperacaoResource {

    private static final Logger LOG = LoggerFactory.getLogger(OperacaoResource.class);

    private static final String ENTITY_NAME = "operacao";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final OperacaoRepository operacaoRepository;

    @Autowired
    public AutomovelRepository automovelRepository;

    @Autowired
    public PontoAcessoRepository pontoAcessoRepository;

    @Autowired
    public AutorizacaoAcessoRepository autorizacaoAcessoRepository;

    @Autowired
    public RegistroAcessoRepository registroAcessoRepository;

    public OperacaoResource(OperacaoRepository operacaoRepository) {
        this.operacaoRepository = operacaoRepository;

    }

    /**
     * {@code POST  /operacaos} : Create a new operacao.
     *
     * @param operacao the operacao to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new operacao, or with status {@code 400 (Bad Request)} if the operacao has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Operacao> createOperacao(@Valid @RequestBody Operacao operacao) throws URISyntaxException {
        LOG.debug("REST request to save Operacao : {}", operacao);
        if (operacao.getId() != null) {
            throw new BadRequestAlertException("A new operacao cannot already have an ID", ENTITY_NAME, "idexists");
        }


        operacao = operacaoRepository.save(operacao);


        LOG.info("(OperacaoResource) operacao: {}",operacao);
        LOG.info("(OperacaoResource) ew URI(\"/api/operacaos/\" + operacao.getId()): {}", new URI("/api/operacaos/" + operacao.getId()));
        // LOG.info("(OperacaoResource) : ", );

        // pythonEnvio1();
        // pythonEnvio2(operacao);

        // pythonEnvio3(operacao);
        // pythonEnvio4(operacao);
        // pythonEnvio5(operacao);
        pythonProcessaLocal(operacao);

        return ResponseEntity.created(new URI("/api/operacaos/" + operacao.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, operacao.getId().toString()))
            .body(operacao);
    }

    private void pythonEnvio1(){


        RestTemplate restTemplate = new RestTemplate();
        String uri = "http://localhost:8000/detector/python/envio";

        // //  saida fica quebrada
        // String result = restTemplate.getForObject(uri, String.class);
        // LOG.info("(OperacaoResource) result: {}", result);

        ResponseEntity<String> response = restTemplate.getForEntity(uri, String.class);

        LOG.info("(OperacaoResource) response.getStatusCode(): {} - response.getBody().length(): {}", response.getStatusCode(), response.getBody().length());

    }

    private static void pythonEnvio2(Operacao operacao) {

        LOG.info("(OperacaoResource.pythonEnvio2) operacao.getId(): {}", operacao.getId());
        LOG.info("(OperacaoResource.pythonEnvio2) operacao.getArquivoImagemContentType(): {}", operacao.getArquivoImagemContentType());
        LOG.info("(OperacaoResource.pythonEnvio2) MediaType.MULTIPART_FORM_DATA: {}", MediaType.MULTIPART_FORM_DATA);
        LOG.info("(OperacaoResource.pythonEnvio2) operacao.getArquivoImagem().length: {}", operacao.getArquivoImagem().length);
    }

    private static void pythonEnvio3(Operacao operacao) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();

        body.add("file", operacao.getArquivoImagem());

        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

        String serverUrl = "http://localhost:8000/detector/upload/";

        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> response = restTemplate.postForEntity(serverUrl, requestEntity, String.class);

        LOG.info("(OperacaoResource) response: {}", response);
    }

    private static void pythonEnvio4(Operacao operacao) {

        byte[] bytes = operacao.getArquivoImagem();
        String serverUrl = "http://localhost:8000/detector/upload/";

        try {
            URI theUri = new URI(serverUrl);

            HttpRequest request = HttpRequest
                .newBuilder()
                .uri( theUri )
                .header( "Content-Type", "text/plain;charset=UTF-8")
                .POST( HttpRequest.BodyPublishers.ofByteArray(bytes) )
                .build();



            HttpClient client = HttpClient.newHttpClient();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            LOG.info("(OperacaoResource.pythonEnvio4) response.body(): {}", response.body());
            response.body();

        } catch (IOException e) {
            throw new RuntimeException(e);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        } catch (URISyntaxException e) {
            throw new RuntimeException(e);
        }

    }

    private static void pythonEnvio5(Operacao operacao) {
        String url = "http://localhost:8000/detector/upload/";

        // Create HttpHeaders
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        // Convert MultipartFile to Resource
        Resource resource = new ByteArrayResource(operacao.getArquivoImagem());

        // Create the body of the request
        MultipartBodyBuilder builder = new MultipartBodyBuilder();
        builder.part("file", resource, MediaType.APPLICATION_OCTET_STREAM);

        MultiValueMap<String, HttpEntity<?>> requestEntity =   builder.build();


        RestTemplate restTemplate = new RestTemplate();
        // Send the request
        ResponseEntity<String> response = restTemplate.postForEntity(url, requestEntity, String.class);

        response.getBody();
        LOG.info("(OperacaoResource.pythonEnvio5) response.body(): {}", response.getBody());
    }

    private static void pythonEnvio6(Operacao operacao) {
        String url = "http://localhost:8000/detector/upload/";

        // Create HttpHeaders
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        // Convert MultipartFile to Resource
        byte[] encodedImage = Base64.getEncoder().encode(operacao.getArquivoImagem());
        Resource resource = new ByteArrayResource(encodedImage);

        // Create the body of the request
        MultipartBodyBuilder builder = new MultipartBodyBuilder();
        builder.part("file", resource, MediaType.APPLICATION_OCTET_STREAM);

        MultiValueMap<String, HttpEntity<?>> requestEntity =   builder.build();


        RestTemplate restTemplate = new RestTemplate();
        // Send the request
        ResponseEntity<String> response = restTemplate.postForEntity(url, requestEntity, String.class);

        response.getBody();
        LOG.info("(OperacaoResource.pythonEnvio5) response.body(): {}", response.getBody());
    }


    private void pythonProcessaLocal(Operacao operacao){

        CallScripts csp = new CallScripts();
        //salvar imagem operacao.getArquivoImagem()
        // pegar caminho imagem
        // passar como parametro

        // create the object of ByteArrayInputStream class
        // and initialized it with the byte array.
        ByteArrayInputStream inStreambj = new ByteArrayInputStream(operacao.getArquivoImagem());


        try {
            // read image from byte array
            BufferedImage newImage = ImageIO.read(inStreambj);
            // write output image
            File novoArquivo = new File("./pythonDetectImages/images/operacao/"+generateUniqueFileName());
            LOG.info("novoArquivo:{}", novoArquivo.getAbsolutePath());
            LOG.info("novoArquivo.getName():{}", novoArquivo.getName());
            ImageIO.write(newImage, "jpg", novoArquivo);
            System.out.println("Image generated from the byte array.");

            String cadeiaAnalisada = "NAOACESSO";
            //cadeiaAnalisada = "14010Y2";
            //cadeiaAnalisada = "7LUV110";
            cadeiaAnalisada = csp.callPythonScript(novoArquivo.getName());
            cadeiaAnalisada = cadeiaAnalisada.trim();
            LOG.info("resultado: [{}]", cadeiaAnalisada);

            if(cadeiaAnalisada.length() <1 || "".equals(cadeiaAnalisada)){
                cadeiaAnalisada = "NAOACESSO";
            }

            Optional<Automovel> opt = automovelRepository.findByPlacaContaining(cadeiaAnalisada);
            if( opt!=null && opt.isPresent()){
                Automovel  automovel = (Automovel) opt.get();
                LOG.info("Automovel encontrado: {}", automovel);
                if("NAOACESSO".equals(cadeiaAnalisada)){
                    createRegistroAcesso(cadeiaAnalisada, TipoAcessoAutorizado.RECUSADO, automovel);
                } else {
                    createRegistroAcesso(cadeiaAnalisada, TipoAcessoAutorizado.AUTORIZADO, automovel);
                }
            } else {
                LOG.info("Automovel nao encontrado: {}");
            }

        } catch (IOException e) {
            throw new RuntimeException(e);
        }



    }

    private void createRegistroAcesso(String cadeiaAnalisada,
                                      TipoAcessoAutorizado tipoAcessoAutorizado,
                                      Automovel automovel){

        LOG.info("createRegistroAcesso.cadeiaAnalisada:[{}]", cadeiaAnalisada);
        LOG.info("createRegistroAcesso.tipoAcessoAutorizado:[{}]", tipoAcessoAutorizado);
        LOG.info("createRegistroAcesso.automovel:[{}]", automovel);

        RegistroAcesso registroAcesso = new RegistroAcesso()
            .dataHora( Instant.now().truncatedTo(ChronoUnit.MILLIS) )
            .cadeiaAnalisada(cadeiaAnalisada)
            .acessoAutorizado(tipoAcessoAutorizado);

        registroAcesso.setAutomovel(automovel);

        PontoAcesso pontoAcesso = pontoAcessoRepository.findAll().get(0);
        registroAcesso.setPontoAcesso(pontoAcesso);

        AutorizacaoAcesso autorizacaoAcesso = autorizacaoAcessoRepository.findAll().get(0);
        registroAcesso.setAutorizacaoAcesso(autorizacaoAcesso);

        LOG.debug("Request to save RegistroAcesso : {}", registroAcesso);
        if (registroAcesso.getId() != null) {
            throw new BadRequestAlertException("A new registroAcesso cannot already have an ID", ENTITY_NAME, "idexists");
        }
        registroAcesso = registroAcessoRepository.save(registroAcesso);

        LOG.info("registroAcesso: [{}]", registroAcesso);
    }

    private static String generateUniqueFileName()
    {
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyyMMddHHmmss");
        String timestamp = dateFormat.format(new Date());
        return "outputImage_" + timestamp + ".jpg";
    }




    /**
     * {@code PUT  /operacaos/:id} : Updates an existing operacao.
     *
     * @param id the id of the operacao to save.
     * @param operacao the operacao to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated operacao,
     * or with status {@code 400 (Bad Request)} if the operacao is not valid,
     * or with status {@code 500 (Internal Server Error)} if the operacao couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Operacao> updateOperacao(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Operacao operacao
    ) throws URISyntaxException {
        LOG.debug("REST request to update Operacao : {}, {}", id, operacao);
        if (operacao.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, operacao.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!operacaoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        operacao = operacaoRepository.save(operacao);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, operacao.getId().toString()))
            .body(operacao);
    }

    /**
     * {@code PATCH  /operacaos/:id} : Partial updates given fields of an existing operacao, field will ignore if it is null
     *
     * @param id the id of the operacao to save.
     * @param operacao the operacao to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated operacao,
     * or with status {@code 400 (Bad Request)} if the operacao is not valid,
     * or with status {@code 404 (Not Found)} if the operacao is not found,
     * or with status {@code 500 (Internal Server Error)} if the operacao couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Operacao> partialUpdateOperacao(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Operacao operacao
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Operacao partially : {}, {}", id, operacao);
        if (operacao.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, operacao.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!operacaoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Operacao> result = operacaoRepository
            .findById(operacao.getId())
            .map(existingOperacao -> {
                if (operacao.getArquivoImagem() != null) {
                    existingOperacao.setArquivoImagem(operacao.getArquivoImagem());
                }
                if (operacao.getArquivoImagemContentType() != null) {
                    existingOperacao.setArquivoImagemContentType(operacao.getArquivoImagemContentType());
                }

                return existingOperacao;
            })
            .map(operacaoRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, operacao.getId().toString())
        );
    }

    /**
     * {@code GET  /operacaos} : get all the operacaos.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of operacaos in body.
     */
    @GetMapping("")
    public List<Operacao> getAllOperacaos() {
        LOG.debug("REST request to get all Operacaos");
        return operacaoRepository.findAll();
    }

    /**
     * {@code GET  /operacaos/:id} : get the "id" operacao.
     *
     * @param id the id of the operacao to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the operacao, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Operacao> getOperacao(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Operacao : {}", id);
        Optional<Operacao> operacao = operacaoRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(operacao);
    }

    /**
     * {@code DELETE  /operacaos/:id} : delete the "id" operacao.
     *
     * @param id the id of the operacao to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOperacao(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete Operacao : {}", id);
        operacaoRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
