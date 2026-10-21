package br.com.slperfumaria.repository;

import br.com.slperfumaria.model.Venda;
import java.time.LocalDateTime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface VendaRepository extends JpaRepository<Venda, Long> {

    @Query("select coalesce(sum(v.valorTotal), 0) from Venda v where v.dataVenda >= :inicio")
    Double faturamentoDesde(@Param("inicio") LocalDateTime inicio);

    @Query("select coalesce(sum(v.desconto), 0) from Venda v where v.dataVenda >= :inicio")
    Double descontosDesde(@Param("inicio") LocalDateTime inicio);

    @Query("select count(v) from Venda v where v.dataVenda >= :inicio")
    Long quantidadeDesde(@Param("inicio") LocalDateTime inicio);
}
