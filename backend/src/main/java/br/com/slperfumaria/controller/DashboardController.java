package br.com.slperfumaria.controller;

import br.com.slperfumaria.dto.DashboardResponse;
import br.com.slperfumaria.service.BackupService;
import br.com.slperfumaria.service.DashboardService;
import java.io.IOException;
import java.nio.file.Path;
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class DashboardController {
    private final DashboardService dashboard;
    private final BackupService backup;

    public DashboardController(DashboardService dashboard, BackupService backup) {
        this.dashboard = dashboard;
        this.backup = backup;
    }

    @GetMapping("/dashboard")
    public DashboardResponse resumo() {
        return dashboard.resumo();
    }

    @PostMapping("/backup")
    public Map<String, String> backup() throws IOException {
        Path arquivo = backup.executar();
        return Map.of("arquivo", arquivo.toString());
    }
}
