package br.com.slperfumaria.dto;

import java.time.LocalDateTime;

public record ItemVendido(
        Long id,
        Long vendaId,
        LocalDateTime dataVenda,
        String produto,
        Integer quantidade,
        Double precoUnitario,
        String formaPagamento) {
}
