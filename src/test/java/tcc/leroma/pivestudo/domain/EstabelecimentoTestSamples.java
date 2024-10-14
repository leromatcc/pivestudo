package tcc.leroma.pivestudo.domain;

import java.util.UUID;

public class EstabelecimentoTestSamples {

    public static Estabelecimento getEstabelecimentoSample1() {
        return new Estabelecimento().id(UUID.fromString("23d8dc04-a48b-45d9-a01d-4b728f0ad4aa")).descricao("descricao1");
    }

    public static Estabelecimento getEstabelecimentoSample2() {
        return new Estabelecimento().id(UUID.fromString("ad79f240-3727-46c3-b89f-2cf6ebd74367")).descricao("descricao2");
    }

    public static Estabelecimento getEstabelecimentoRandomSampleGenerator() {
        return new Estabelecimento().id(UUID.randomUUID()).descricao(UUID.randomUUID().toString());
    }
}
