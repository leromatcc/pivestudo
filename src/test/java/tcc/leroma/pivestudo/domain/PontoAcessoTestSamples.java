package tcc.leroma.pivestudo.domain;

import java.util.UUID;

public class PontoAcessoTestSamples {

    public static PontoAcesso getPontoAcessoSample1() {
        return new PontoAcesso().id(UUID.fromString("23d8dc04-a48b-45d9-a01d-4b728f0ad4aa")).descricao("descricao1");
    }

    public static PontoAcesso getPontoAcessoSample2() {
        return new PontoAcesso().id(UUID.fromString("ad79f240-3727-46c3-b89f-2cf6ebd74367")).descricao("descricao2");
    }

    public static PontoAcesso getPontoAcessoRandomSampleGenerator() {
        return new PontoAcesso().id(UUID.randomUUID()).descricao(UUID.randomUUID().toString());
    }
}
