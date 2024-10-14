package tcc.leroma.pivestudo.domain;

import java.util.UUID;

public class TelefoneTestSamples {

    public static Telefone getTelefoneSample1() {
        return new Telefone().id(UUID.fromString("23d8dc04-a48b-45d9-a01d-4b728f0ad4aa")).tipoTelefone("tipoTelefone1").numero("numero1");
    }

    public static Telefone getTelefoneSample2() {
        return new Telefone().id(UUID.fromString("ad79f240-3727-46c3-b89f-2cf6ebd74367")).tipoTelefone("tipoTelefone2").numero("numero2");
    }

    public static Telefone getTelefoneRandomSampleGenerator() {
        return new Telefone().id(UUID.randomUUID()).tipoTelefone(UUID.randomUUID().toString()).numero(UUID.randomUUID().toString());
    }
}
