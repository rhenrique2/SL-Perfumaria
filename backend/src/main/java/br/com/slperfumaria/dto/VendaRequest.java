package br.com.slperfumaria.dto;

import br.com.slperfumaria.model.FormaPagamento;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import java.util.List;

public record VendaRequest(
        @NotEmpty @Valid List<Item> itens,
        @PositiveOrZero Double desconto,
        @NotNull FormaPagamento formaPagamento) {

    public record Item(@NotNull Long produtoId, @NotNull @Min(1) Integer quantidade) {
    }
}
