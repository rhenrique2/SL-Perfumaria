package br.com.slperfumaria.dto;

import java.util.List;

public record DashboardResponse(
        Double faturamentoDia,
        Long vendasDia,
        Double faturamentoMes,
        Long vendasMes,
        Double lucroBrutoMes,
        List<RankingItem> topFragrancias,
        List<ItemVendido> vendidos) {
}
