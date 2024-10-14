package tcc.leroma.pivestudo.domain;

import java.util.UUID;

public class PessoaTestSamples {

    public static Pessoa getPessoaSample1() {
        return new Pessoa().id(UUID.fromString("23d8dc04-a48b-45d9-a01d-4b728f0ad4aa")).nome("nome1");
    }

    public static Pessoa getPessoaSample2() {
        return new Pessoa().id(UUID.fromString("ad79f240-3727-46c3-b89f-2cf6ebd74367")).nome("nome2");
    }

    public static Pessoa getPessoaRandomSampleGenerator() {
        return new Pessoa().id(UUID.randomUUID()).nome(UUID.randomUUID().toString());
    }
}
