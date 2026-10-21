package br.com.slperfumaria.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "movimentacoes_estoque")
public class MovimentacaoEstoque {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "produto_id")
    private Produto produto;
    @Column(nullable = false)
    private String tipo;
    @Column(nullable = false)
    private Integer quantidade;
    private String motivo;
    @Column(name = "data_movimentacao")
    private LocalDateTime dataMovimentacao;

    protected MovimentacaoEstoque() {}

    public MovimentacaoEstoque(Produto produto, String tipo, Integer quantidade, String motivo) {
        this.produto = produto;
        this.tipo = tipo;
        this.quantidade = quantidade;
        this.motivo = motivo;
    }

    @PrePersist
    void prePersist() {
        dataMovimentacao = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public Produto getProduto() { return produto; }
    public String getTipo() { return tipo; }
    public Integer getQuantidade() { return quantidade; }
    public String getMotivo() { return motivo; }
    public LocalDateTime getDataMovimentacao() { return dataMovimentacao; }
}
