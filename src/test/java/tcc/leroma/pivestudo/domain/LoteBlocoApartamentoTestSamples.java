package tcc.leroma.pivestudo.domain;

import java.util.UUID;

public class LoteBlocoApartamentoTestSamples {

    public static LoteBlocoApartamento getLoteBlocoApartamentoSample1() {
        return new LoteBlocoApartamento()
            .id(UUID.fromString("23d8dc04-a48b-45d9-a01d-4b728f0ad4aa"))
            .bloco("bloco1")
            .andar("andar1")
            .numero("numero1");
    }

    public static LoteBlocoApartamento getLoteBlocoApartamentoSample2() {
        return new LoteBlocoApartamento()
            .id(UUID.fromString("ad79f240-3727-46c3-b89f-2cf6ebd74367"))
            .bloco("bloco2")
            .andar("andar2")
            .numero("numero2");
    }

    public static LoteBlocoApartamento getLoteBlocoApartamentoRandomSampleGenerator() {
        return new LoteBlocoApartamento()
            .id(UUID.randomUUID())
            .bloco(UUID.randomUUID().toString())
            .andar(UUID.randomUUID().toString())
            .numero(UUID.randomUUID().toString());
    }
}
