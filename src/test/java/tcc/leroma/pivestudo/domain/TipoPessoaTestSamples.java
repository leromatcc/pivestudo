package tcc.leroma.pivestudo.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class TipoPessoaTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static TipoPessoa getTipoPessoaSample1() {
        return new TipoPessoa().id(1L).descricao("descricao1");
    }

    public static TipoPessoa getTipoPessoaSample2() {
        return new TipoPessoa().id(2L).descricao("descricao2");
    }

    public static TipoPessoa getTipoPessoaRandomSampleGenerator() {
        return new TipoPessoa().id(longCount.incrementAndGet()).descricao(UUID.randomUUID().toString());
    }
}
