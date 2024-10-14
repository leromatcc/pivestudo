package tcc.leroma.pivestudo.domain;

import java.util.UUID;

public class TipoAutomovelTestSamples {

    public static TipoAutomovel getTipoAutomovelSample1() {
        return new TipoAutomovel().id(UUID.fromString("23d8dc04-a48b-45d9-a01d-4b728f0ad4aa")).descricao("descricao1");
    }

    public static TipoAutomovel getTipoAutomovelSample2() {
        return new TipoAutomovel().id(UUID.fromString("ad79f240-3727-46c3-b89f-2cf6ebd74367")).descricao("descricao2");
    }

    public static TipoAutomovel getTipoAutomovelRandomSampleGenerator() {
        return new TipoAutomovel().id(UUID.randomUUID()).descricao(UUID.randomUUID().toString());
    }
}
