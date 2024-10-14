package tcc.leroma.pivestudo.domain;

import java.util.UUID;

public class DocumentoTestSamples {

    public static Documento getDocumentoSample1() {
        return new Documento()
            .id(UUID.fromString("23d8dc04-a48b-45d9-a01d-4b728f0ad4aa"))
            .numeroDocumento("numeroDocumento1")
            .descricao("descricao1");
    }

    public static Documento getDocumentoSample2() {
        return new Documento()
            .id(UUID.fromString("ad79f240-3727-46c3-b89f-2cf6ebd74367"))
            .numeroDocumento("numeroDocumento2")
            .descricao("descricao2");
    }

    public static Documento getDocumentoRandomSampleGenerator() {
        return new Documento().id(UUID.randomUUID()).numeroDocumento(UUID.randomUUID().toString()).descricao(UUID.randomUUID().toString());
    }
}
