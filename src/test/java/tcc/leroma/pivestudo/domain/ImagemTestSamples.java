package tcc.leroma.pivestudo.domain;

import java.util.UUID;

public class ImagemTestSamples {

    public static Imagem getImagemSample1() {
        return new Imagem()
            .id(UUID.fromString("23d8dc04-a48b-45d9-a01d-4b728f0ad4aa"))
            .nome("nome1")
            .caminho("caminho1")
            .descricao("descricao1")
            .cadeiaDetectada("cadeiaDetectada1");
    }

    public static Imagem getImagemSample2() {
        return new Imagem()
            .id(UUID.fromString("ad79f240-3727-46c3-b89f-2cf6ebd74367"))
            .nome("nome2")
            .caminho("caminho2")
            .descricao("descricao2")
            .cadeiaDetectada("cadeiaDetectada2");
    }

    public static Imagem getImagemRandomSampleGenerator() {
        return new Imagem()
            .id(UUID.randomUUID())
            .nome(UUID.randomUUID().toString())
            .caminho(UUID.randomUUID().toString())
            .descricao(UUID.randomUUID().toString())
            .cadeiaDetectada(UUID.randomUUID().toString());
    }
}
