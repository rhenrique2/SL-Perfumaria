package br.com.slperfumaria.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "vendas")
public class Venda {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "valor_total", nullable = false)
    private Double valorTotal;
    @Column(name = "forma_pagamento", nullable = false)
    private String formaPagamento;
    private Double desconto = 0.0;
    @Column(name = "data_venda")
    private LocalDateTime dataVenda;
    @OneToMany(mappedBy = "venda", cascade = CascadeType.ALL)
    private List<ItemVenda> itens = new ArrayList<>();

    @PrePersist
    void prePersist() {
        dataVenda = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public Double getValorTotal() { return valorTotal; }
    public void setValorTotal(Double valorTotal) { this.valorTotal = valorTotal; }
    public String getFormaPagamento() { return formaPagamento; }
    public void setFormaPagamento(String formaPagamento) { this.formaPagamento = formaPagamento; }
    public Double getDesconto() { return desconto; }
    public void setDesconto(Double desconto) { this.desconto = desconto; }
    public LocalDateTime getDataVenda() { return dataVenda; }
    public List<ItemVenda> getItens() { return itens; }
}
