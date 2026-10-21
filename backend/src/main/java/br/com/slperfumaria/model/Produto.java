package br.com.slperfumaria.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "produtos")
public class Produto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String nome;
    @Column(nullable = false)
    private String marca;
    @Column(nullable = false)
    private String volumetria;
    @Column(name = "familia_olfativa", nullable = false)
    private String familiaOlfativa;
    @Column(name = "notas_topo")
    private String notasTopo;
    @Column(name = "notas_coracao")
    private String notasCoracao;
    @Column(name = "notas_fundo")
    private String notasFundo;
    @Column(name = "preco_custo", nullable = false)
    private Double precoCusto;
    @Column(name = "preco_venda", nullable = false)
    private Double precoVenda;
    @Column(name = "quantidade_estoque", nullable = false)
    private Integer quantidadeEstoque = 0;
    @Column(name = "estoque_minimo", nullable = false)
    private Integer estoqueMinimo = 3;
    @Column(name = "codigo_barras", unique = true)
    private String codigoBarras;
    @Column(name = "criado_em", updatable = false)
    private LocalDateTime criadoEm;

    @PrePersist
    void prePersist() {
        criadoEm = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getMarca() { return marca; }
    public void setMarca(String marca) { this.marca = marca; }
    public String getVolumetria() { return volumetria; }
    public void setVolumetria(String volumetria) { this.volumetria = volumetria; }
    public String getFamiliaOlfativa() { return familiaOlfativa; }
    public void setFamiliaOlfativa(String familiaOlfativa) { this.familiaOlfativa = familiaOlfativa; }
    public String getNotasTopo() { return notasTopo; }
    public void setNotasTopo(String notasTopo) { this.notasTopo = notasTopo; }
    public String getNotasCoracao() { return notasCoracao; }
    public void setNotasCoracao(String notasCoracao) { this.notasCoracao = notasCoracao; }
    public String getNotasFundo() { return notasFundo; }
    public void setNotasFundo(String notasFundo) { this.notasFundo = notasFundo; }
    public Double getPrecoCusto() { return precoCusto; }
    public void setPrecoCusto(Double precoCusto) { this.precoCusto = precoCusto; }
    public Double getPrecoVenda() { return precoVenda; }
    public void setPrecoVenda(Double precoVenda) { this.precoVenda = precoVenda; }
    public Integer getQuantidadeEstoque() { return quantidadeEstoque; }
    public void setQuantidadeEstoque(Integer quantidadeEstoque) { this.quantidadeEstoque = quantidadeEstoque; }
    public Integer getEstoqueMinimo() { return estoqueMinimo; }
    public void setEstoqueMinimo(Integer estoqueMinimo) { this.estoqueMinimo = estoqueMinimo; }
    public String getCodigoBarras() { return codigoBarras; }
    public void setCodigoBarras(String codigoBarras) { this.codigoBarras = codigoBarras; }
    public LocalDateTime getCriadoEm() { return criadoEm; }
    public boolean isEstoqueBaixo() { return quantidadeEstoque <= estoqueMinimo; }
}
