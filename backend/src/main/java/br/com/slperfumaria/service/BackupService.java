package br.com.slperfumaria.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Stream;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class BackupService {
    private static final Logger log = LoggerFactory.getLogger(BackupService.class);
    private static final DateTimeFormatter FORMATO = DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss");

    private final JdbcTemplate jdbc;
    private final Path destino;
    private final int manter;

    public BackupService(JdbcTemplate jdbc, @Value("${backup.dir}") String destino, @Value("${backup.keep}") int manter) {
        this.jdbc = jdbc;
        this.destino = Paths.get(destino);
        this.manter = manter;
    }

    @Scheduled(cron = "${backup.cron}")
    public void agendado() {
        try {
            executar();
        } catch (Exception e) {
            log.error("Falha no backup agendado", e);
        }
    }

    public synchronized Path executar() throws IOException {
        Files.createDirectories(destino);
        String nome = "sl_perfumaria_" + LocalDateTime.now().format(FORMATO) + ".db";
        Path temp = Files.createTempDirectory("slbackup").resolve(nome);
        jdbc.execute("VACUUM INTO '" + temp.toAbsolutePath().toString().replace("'", "''") + "'");
        Path arquivo = Files.move(temp, destino.resolve(nome), StandardCopyOption.REPLACE_EXISTING);
        Files.deleteIfExists(temp.getParent());
        limpar();
        log.info("Backup salvo em {}", arquivo);
        return arquivo;
    }

    private void limpar() throws IOException {
        try (Stream<Path> arquivos = Files.list(destino)) {
            List<Path> backups = arquivos
                    .filter(p -> p.getFileName().toString().matches("sl_perfumaria_\\d{8}_\\d{6}\\.db"))
                    .sorted(Comparator.comparing(Path::getFileName).reversed())
                    .toList();
            for (Path antigo : backups.subList(Math.min(manter, backups.size()), backups.size())) {
                Files.deleteIfExists(antigo);
            }
        }
    }
}
