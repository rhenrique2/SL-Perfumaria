package br.com.slperfumaria.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

public record ProdutoRequest(
        @NotBlank String nome,
        String marca,
        @NotBlank String volumetria,
        @NotBlank String familiaOlfativa,
        String notasTopo,
        String notasCoracao,
        String notasFundo,
        @NotNull @PositiveOrZero Double precoCusto,
        @NotNull @PositiveOrZero Double precoVenda,
        @NotNull @Min(0) Integer quantidadeEstoque,
        @NotNull @Min(0) Integer estoqueMinimo,
        String codigoBarras) {
}
