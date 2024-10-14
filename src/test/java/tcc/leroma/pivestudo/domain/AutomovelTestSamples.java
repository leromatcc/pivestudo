package tcc.leroma.pivestudo.domain;

import java.util.UUID;

public class AutomovelTestSamples {

    public static Automovel getAutomovelSample1() {
        return new Automovel().id(UUID.fromString("23d8dc04-a48b-45d9-a01d-4b728f0ad4aa")).placa("placa1").descricao("descricao1");
    }

    public static Automovel getAutomovelSample2() {
        return new Automovel().id(UUID.fromString("ad79f240-3727-46c3-b89f-2cf6ebd74367")).placa("placa2").descricao("descricao2");
    }

    public static Automovel getAutomovelRandomSampleGenerator() {
        return new Automovel().id(UUID.randomUUID()).placa(UUID.randomUUID().toString()).descricao(UUID.randomUUID().toString());
    }
}
