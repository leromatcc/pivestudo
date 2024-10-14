package tcc.leroma.pivestudo.domain;

import java.util.UUID;

public class RegistroAcessoTestSamples {

    public static RegistroAcesso getRegistroAcessoSample1() {
        return new RegistroAcesso().id(UUID.fromString("23d8dc04-a48b-45d9-a01d-4b728f0ad4aa")).cadeiaAnalisada("cadeiaAnalisada1");
    }

    public static RegistroAcesso getRegistroAcessoSample2() {
        return new RegistroAcesso().id(UUID.fromString("ad79f240-3727-46c3-b89f-2cf6ebd74367")).cadeiaAnalisada("cadeiaAnalisada2");
    }

    public static RegistroAcesso getRegistroAcessoRandomSampleGenerator() {
        return new RegistroAcesso().id(UUID.randomUUID()).cadeiaAnalisada(UUID.randomUUID().toString());
    }
}
