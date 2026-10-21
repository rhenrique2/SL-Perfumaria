package br.com.slperfumaria.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

public record EntradaRequest(
        @NotNull @Min(1) Integer quantidade,
        @PositiveOrZero Double precoCusto,
        @PositiveOrZero Double precoVenda) {
}
