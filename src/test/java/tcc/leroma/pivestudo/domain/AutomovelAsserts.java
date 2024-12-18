package tcc.leroma.pivestudo.domain;

import static org.assertj.core.api.Assertions.assertThat;

public class AutomovelAsserts {

    /**
     * Asserts that the entity has all properties (fields/relationships) set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertAutomovelAllPropertiesEquals(Automovel expected, Automovel actual) {
        assertAutomovelAutoGeneratedPropertiesEquals(expected, actual);
        assertAutomovelAllUpdatablePropertiesEquals(expected, actual);
    }

    /**
     * Asserts that the entity has all updatable properties (fields/relationships) set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertAutomovelAllUpdatablePropertiesEquals(Automovel expected, Automovel actual) {
        assertAutomovelUpdatableFieldsEquals(expected, actual);
        assertAutomovelUpdatableRelationshipsEquals(expected, actual);
    }

    /**
     * Asserts that the entity has all the auto generated properties (fields/relationships) set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertAutomovelAutoGeneratedPropertiesEquals(Automovel expected, Automovel actual) {
        assertThat(expected)
            .as("Verify Automovel auto generated properties")
            .satisfies(e -> assertThat(e.getId()).as("check id").isEqualTo(actual.getId()));
    }

    /**
     * Asserts that the entity has all the updatable fields set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertAutomovelUpdatableFieldsEquals(Automovel expected, Automovel actual) {
        assertThat(expected)
            .as("Verify Automovel relevant properties")
            .satisfies(e -> assertThat(e.getPlaca()).as("check placa").isEqualTo(actual.getPlaca()))
            .satisfies(e -> assertThat(e.getDescricao()).as("check descricao").isEqualTo(actual.getDescricao()));
    }

    /**
     * Asserts that the entity has all the updatable relationships set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertAutomovelUpdatableRelationshipsEquals(Automovel expected, Automovel actual) {
        assertThat(expected)
            .as("Verify Automovel relationships")
            .satisfies(e -> assertThat(e.getTipoAutomovel()).as("check tipoAutomovel").isEqualTo(actual.getTipoAutomovel()))
            .satisfies(e -> assertThat(e.getPessoa()).as("check pessoa").isEqualTo(actual.getPessoa()));
    }
}
