package br.com.slperfumaria.repository;

import br.com.slperfumaria.dto.ItemVendido;
import br.com.slperfumaria.dto.RankingItem;
import br.com.slperfumaria.model.ItemVenda;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ItemVendaRepository extends JpaRepository<ItemVenda, Long> {

    @Query("""
            select coalesce(sum(i.quantidade * (i.precoUnitario - i.produto.precoCusto)), 0)
            from ItemVenda i where i.venda.dataVenda >= :inicio
            """)
    Double margemDesde(@Param("inicio") LocalDateTime inicio);

    @Query("""
            select new br.com.slperfumaria.dto.RankingItem(i.produto.nome, sum(i.quantidade), sum(i.quantidade * i.precoUnitario))
            from ItemVenda i where i.venda.dataVenda >= :inicio
            group by i.produto.id, i.produto.nome
            order by sum(i.quantidade) desc
            """)
    List<RankingItem> rankingProdutos(@Param("inicio") LocalDateTime inicio, Pageable pageable);

    @Query("""
            select new br.com.slperfumaria.dto.ItemVendido(i.id, i.venda.id, i.venda.dataVenda, i.produto.nome, i.quantidade, i.precoUnitario, i.venda.formaPagamento)
            from ItemVenda i where i.venda.dataVenda >= :inicio
            order by i.venda.dataVenda desc, i.id desc
            """)
    List<ItemVendido> vendidosDesde(@Param("inicio") LocalDateTime inicio);
}
