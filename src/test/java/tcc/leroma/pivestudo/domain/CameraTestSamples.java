package tcc.leroma.pivestudo.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class CameraTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Camera getCameraSample1() {
        return new Camera().id(1L).descricao("descricao1").enderecoRede("enderecoRede1").api("api1");
    }

    public static Camera getCameraSample2() {
        return new Camera().id(2L).descricao("descricao2").enderecoRede("enderecoRede2").api("api2");
    }

    public static Camera getCameraRandomSampleGenerator() {
        return new Camera()
            .id(longCount.incrementAndGet())
            .descricao(UUID.randomUUID().toString())
            .enderecoRede(UUID.randomUUID().toString())
            .api(UUID.randomUUID().toString());
    }
}
