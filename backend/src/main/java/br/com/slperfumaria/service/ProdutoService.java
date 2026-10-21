package br.com.slperfumaria.service;

import br.com.slperfumaria.dto.EntradaRequest;
import br.com.slperfumaria.dto.ProdutoRequest;
import br.com.slperfumaria.dto.SaidaRequest;
import br.com.slperfumaria.model.MovimentacaoEstoque;
import br.com.slperfumaria.model.Produto;
import br.com.slperfumaria.repository.MovimentacaoEstoqueRepository;
import br.com.slperfumaria.repository.ProdutoRepository;
import java.util.List;
import java.util.NoSuchElementException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProdutoService {
    private final ProdutoRepository produtos;
    private final MovimentacaoEstoqueRepository movimentacoes;

    public ProdutoService(ProdutoRepository produtos, MovimentacaoEstoqueRepository movimentacoes) {
        this.produtos = produtos;
        this.movimentacoes = movimentacoes;
    }

    public List<Produto> buscar(String q, String familia) {
        String termo = isBlank(q) ? null : "%" + q.trim().toLowerCase() + "%";
        return produtos.buscar(termo, isBlank(familia) ? null : familia);
    }

    public List<String> familias() {
        return produtos.familias();
    }

    public Produto porId(Long id) {
        return produtos.findById(id).orElseThrow(() -> new NoSuchElementException("Produto não encontrado"));
    }

    public Produto porCodigoBarras(String codigo) {
        return produtos.findByCodigoBarras(codigo.trim()).orElseThrow(() -> new NoSuchElementException("Código de barras não encontrado"));
    }

    @Transactional
    public Produto criar(ProdutoRequest req) {
        Produto produto = new Produto();
        aplicar(produto, req);
        produto.setQuantidadeEstoque(req.quantidadeEstoque());
        Produto salvo = produtos.save(produto);
        if (req.quantidadeEstoque() > 0) {
            movimentacoes.save(new MovimentacaoEstoque(salvo, "ENTRADA", req.quantidadeEstoque(), "Cadastro inicial"));
        }
        return salvo;
    }

    @Transactional
    public Produto atualizar(Long id, ProdutoRequest req) {
        Produto produto = porId(id);
        aplicar(produto, req);
        return produto;
    }

    @Transactional
    public void excluir(Long id) {
        produtos.delete(porId(id));
    }

    @Transactional
    public Produto entrada(Long id, EntradaRequest req) {
        Produto produto = porId(id);
        produto.setQuantidadeEstoque(produto.getQuantidadeEstoque() + req.quantidade());
        if (req.precoCusto() != null) {
            produto.setPrecoCusto(req.precoCusto());
        }
        if (req.precoVenda() != null) {
            produto.setPrecoVenda(req.precoVenda());
        }
        movimentacoes.save(new MovimentacaoEstoque(produto, "ENTRADA", req.quantidade(), "Entrada de lote"));
        return produto;
    }

    @Transactional
    public Produto saida(Long id, SaidaRequest req) {
        Produto produto = porId(id);
        baixar(produto, req.quantidade());
        movimentacoes.save(new MovimentacaoEstoque(produto, "SAIDA", req.quantidade(), req.motivo().name()));
        return produto;
    }

    void baixar(Produto produto, int quantidade) {
        if (quantidade > produto.getQuantidadeEstoque()) {
            throw new BusinessException("Estoque insuficiente para " + produto.getNome() + " (disponível: " + produto.getQuantidadeEstoque() + ")");
        }
        produto.setQuantidadeEstoque(produto.getQuantidadeEstoque() - quantidade);
    }

    private void aplicar(Produto p, ProdutoRequest req) {
        p.setNome(req.nome().trim());
        p.setMarca(isBlank(req.marca()) ? "" : req.marca().trim());
        p.setVolumetria(req.volumetria().trim());
        p.setFamiliaOlfativa(req.familiaOlfativa().trim());
        p.setNotasTopo(req.notasTopo());
        p.setNotasCoracao(req.notasCoracao());
        p.setNotasFundo(req.notasFundo());
        p.setPrecoCusto(req.precoCusto());
        p.setPrecoVenda(req.precoVenda());
        p.setEstoqueMinimo(req.estoqueMinimo());
        String codigo = isBlank(req.codigoBarras()) ? null : req.codigoBarras().trim();
        if (codigo != null) {
            produtos.findByCodigoBarras(codigo)
                    .filter(outro -> !outro.getId().equals(p.getId()))
                    .ifPresent(outro -> {
                        throw new BusinessException("Código de barras já cadastrado para " + outro.getNome());
                    });
        }
        p.setCodigoBarras(codigo);
    }

    private static boolean isBlank(String s) {
        return s == null || s.isBlank();
    }
}
