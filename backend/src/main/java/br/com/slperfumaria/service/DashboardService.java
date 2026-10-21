package br.com.slperfumaria.service;

import br.com.slperfumaria.dto.DashboardResponse;
import br.com.slperfumaria.repository.ItemVendaRepository;
import br.com.slperfumaria.repository.VendaRepository;
import java.time.LocalDate;
import java.time.LocalDateTime;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {
    private final VendaRepository vendas;
    private final ItemVendaRepository itens;

    public DashboardService(VendaRepository vendas, ItemVendaRepository itens) {
        this.vendas = vendas;
        this.itens = itens;
    }

    public DashboardResponse resumo() {
        LocalDateTime inicioDia = LocalDate.now().atStartOfDay();
        LocalDateTime inicioMes = LocalDate.now().withDayOfMonth(1).atStartOfDay();
        PageRequest top5 = PageRequest.of(0, 5);
        return new DashboardResponse(
                vendas.faturamentoDesde(inicioDia),
                vendas.quantidadeDesde(inicioDia),
                vendas.faturamentoDesde(inicioMes),
                vendas.quantidadeDesde(inicioMes),
                itens.margemDesde(inicioMes) - vendas.descontosDesde(inicioMes),
                itens.rankingProdutos(inicioMes, top5),
                itens.vendidosDesde(inicioMes));
    }
}
