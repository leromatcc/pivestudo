package tcc.leroma.pivestudo.domain;

import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;

public class OperacaoTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Operacao getOperacaoSample1() {
        return new Operacao().id(1L);
    }

    public static Operacao getOperacaoSample2() {
        return new Operacao().id(2L);
    }

    public static Operacao getOperacaoRandomSampleGenerator() {
        return new Operacao().id(longCount.incrementAndGet());
    }
}
