package br.com.slperfumaria.repository;

import br.com.slperfumaria.model.Produto;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProdutoRepository extends JpaRepository<Produto, Long> {

    @Query("""
            select p from Produto p
            where (:familia is null or p.familiaOlfativa = :familia)
              and (:termo is null
                or lower(p.nome) like :termo
                or lower(p.marca) like :termo
                or lower(coalesce(p.codigoBarras, '')) like :termo
                or lower(coalesce(p.notasTopo, '')) like :termo
                or lower(coalesce(p.notasCoracao, '')) like :termo
                or lower(coalesce(p.notasFundo, '')) like :termo)
            order by p.nome
            """)
    List<Produto> buscar(@Param("termo") String termo, @Param("familia") String familia);

    Optional<Produto> findByCodigoBarras(String codigoBarras);

    @Query("select distinct p.familiaOlfativa from Produto p order by p.familiaOlfativa")
    List<String> familias();
}
