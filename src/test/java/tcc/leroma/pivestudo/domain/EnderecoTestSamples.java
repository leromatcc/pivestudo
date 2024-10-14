package tcc.leroma.pivestudo.domain;

import java.util.UUID;

public class EnderecoTestSamples {

    public static Endereco getEnderecoSample1() {
        return new Endereco()
            .id(UUID.fromString("23d8dc04-a48b-45d9-a01d-4b728f0ad4aa"))
            .descricao("descricao1")
            .cep("cep1")
            .logradouro("logradouro1")
            .numero("numero1")
            .complemento("complemento1")
            .referencia("referencia1")
            .cidade("cidade1")
            .estado("estado1")
            .pais("pais1");
    }

    public static Endereco getEnderecoSample2() {
        return new Endereco()
            .id(UUID.fromString("ad79f240-3727-46c3-b89f-2cf6ebd74367"))
            .descricao("descricao2")
            .cep("cep2")
            .logradouro("logradouro2")
            .numero("numero2")
            .complemento("complemento2")
            .referencia("referencia2")
            .cidade("cidade2")
            .estado("estado2")
            .pais("pais2");
    }

    public static Endereco getEnderecoRandomSampleGenerator() {
        return new Endereco()
            .id(UUID.randomUUID())
            .descricao(UUID.randomUUID().toString())
            .cep(UUID.randomUUID().toString())
            .logradouro(UUID.randomUUID().toString())
            .numero(UUID.randomUUID().toString())
            .complemento(UUID.randomUUID().toString())
            .referencia(UUID.randomUUID().toString())
            .cidade(UUID.randomUUID().toString())
            .estado(UUID.randomUUID().toString())
            .pais(UUID.randomUUID().toString());
    }
}
