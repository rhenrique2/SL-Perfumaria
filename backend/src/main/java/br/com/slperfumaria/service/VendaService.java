package br.com.slperfumaria.service;

import br.com.slperfumaria.dto.VendaRequest;
import br.com.slperfumaria.model.ItemVenda;
import br.com.slperfumaria.model.MovimentacaoEstoque;
import br.com.slperfumaria.model.Produto;
import br.com.slperfumaria.model.Venda;
import br.com.slperfumaria.repository.ItemVendaRepository;
import br.com.slperfumaria.repository.MovimentacaoEstoqueRepository;
import br.com.slperfumaria.repository.VendaRepository;
import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class VendaService {
    private final VendaRepository vendas;
    private final MovimentacaoEstoqueRepository movimentacoes;
    private final ProdutoService produtoService;
    private final ItemVendaRepository itensVenda;

    public VendaService(VendaRepository vendas, MovimentacaoEstoqueRepository movimentacoes, ProdutoService produtoService, ItemVendaRepository itensVenda) {
        this.itensVenda = itensVenda;
        this.vendas = vendas;
        this.movimentacoes = movimentacoes;
        this.produtoService = produtoService;
    }

    @Transactional
    public Venda finalizar(VendaRequest req) {
        Map<Long, Integer> quantidades = new LinkedHashMap<>();
        req.itens().forEach(i -> quantidades.merge(i.produtoId(), i.quantidade(), Integer::sum));

        Venda venda = new Venda();
        double subtotal = 0;
        for (Map.Entry<Long, Integer> e : quantidades.entrySet()) {
            Produto produto = produtoService.porId(e.getKey());
            produtoService.baixar(produto, e.getValue());
            venda.getItens().add(new ItemVenda(venda, produto, e.getValue(), produto.getPrecoVenda()));
            subtotal += e.getValue() * produto.getPrecoVenda();
        }

        double desconto = req.desconto() == null ? 0 : req.desconto();
        if (desconto > subtotal) {
            throw new BusinessException("Desconto maior que o subtotal da venda");
        }
        venda.setDesconto(desconto);
        venda.setValorTotal(subtotal - desconto);
        venda.setFormaPagamento(req.formaPagamento().name());
        Venda salva = vendas.save(venda);

        salva.getItens().forEach(i -> movimentacoes.save(
                new MovimentacaoEstoque(i.getProduto(), "VENDA", i.getQuantidade(), "Venda #" + salva.getId())));
        return salva;
    }

    @Transactional
    public void removerItem(Long itemId) {
        ItemVenda item = itensVenda.findById(itemId)
                .orElseThrow(() -> new BusinessException("Item de venda não encontrado"));
        Venda venda = item.getVenda();
        Produto produto = item.getProduto();
        produto.setQuantidadeEstoque(produto.getQuantidadeEstoque() + item.getQuantidade());
        movimentacoes.save(new MovimentacaoEstoque(produto, "ESTORNO", item.getQuantidade(), "Removido da venda #" + venda.getId()));

        venda.getItens().remove(item);
        itensVenda.delete(item);
        if (venda.getItens().isEmpty()) {
            vendas.delete(venda);
            return;
        }
        double subtotal = venda.getItens().stream().mapToDouble(i -> i.getQuantidade() * i.getPrecoUnitario()).sum();
        double desconto = Math.min(venda.getDesconto() == null ? 0 : venda.getDesconto(), subtotal);
        venda.setDesconto(desconto);
        venda.setValorTotal(subtotal - desconto);
    }
}
