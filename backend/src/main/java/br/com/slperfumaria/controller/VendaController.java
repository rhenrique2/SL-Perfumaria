package br.com.slperfumaria.controller;

import br.com.slperfumaria.dto.VendaRequest;
import br.com.slperfumaria.model.Venda;
import br.com.slperfumaria.service.VendaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/vendas")
public class VendaController {
    private final VendaService service;

    public VendaController(VendaService service) {
        this.service = service;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Venda finalizar(@Valid @RequestBody VendaRequest req) {
        return service.finalizar(req);
    }

    @DeleteMapping("/itens/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removerItem(@PathVariable Long id) {
        service.removerItem(id);
    }
}
