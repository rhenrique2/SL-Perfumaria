package br.com.slperfumaria.dto;

import br.com.slperfumaria.model.MotivoSaida;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record SaidaRequest(@NotNull @Min(1) Integer quantidade, @NotNull MotivoSaida motivo) {
}
