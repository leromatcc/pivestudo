package tcc.leroma.pivestudo.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import tcc.leroma.pivestudo.domain.Camera;

/**
 * Spring Data JPA repository for the Camera entity.
 */
@Repository
public interface CameraRepository extends JpaRepository<Camera, Long> {
    default Optional<Camera> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Camera> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Camera> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select camera from Camera camera left join fetch camera.pontoAcesso",
        countQuery = "select count(camera) from Camera camera"
    )
    Page<Camera> findAllWithToOneRelationships(Pageable pageable);

    @Query("select camera from Camera camera left join fetch camera.pontoAcesso")
    List<Camera> findAllWithToOneRelationships();

    @Query("select camera from Camera camera left join fetch camera.pontoAcesso where camera.id =:id")
    Optional<Camera> findOneWithToOneRelationships(@Param("id") Long id);
}
