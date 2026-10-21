package br.com.slperfumaria.controller;

import br.com.slperfumaria.dto.EntradaRequest;
import br.com.slperfumaria.dto.ProdutoRequest;
import br.com.slperfumaria.dto.SaidaRequest;
import br.com.slperfumaria.model.Produto;
import br.com.slperfumaria.service.ProdutoService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/produtos")
public class ProdutoController {
    private final ProdutoService service;

    public ProdutoController(ProdutoService service) {
        this.service = service;
    }

    @GetMapping
    public List<Produto> buscar(@RequestParam(required = false) String q, @RequestParam(required = false) String familia) {
        return service.buscar(q, familia);
    }

    @GetMapping("/familias")
    public List<String> familias() {
        return service.familias();
    }

    @GetMapping("/{id}")
    public Produto porId(@PathVariable Long id) {
        return service.porId(id);
    }

    @GetMapping("/barcode/{codigo}")
    public Produto porCodigoBarras(@PathVariable String codigo) {
        return service.porCodigoBarras(codigo);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Produto criar(@Valid @RequestBody ProdutoRequest req) {
        return service.criar(req);
    }

    @PutMapping("/{id}")
    public Produto atualizar(@PathVariable Long id, @Valid @RequestBody ProdutoRequest req) {
        return service.atualizar(id, req);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(@PathVariable Long id) {
        service.excluir(id);
    }

    @PostMapping("/{id}/entrada")
    public Produto entrada(@PathVariable Long id, @Valid @RequestBody EntradaRequest req) {
        return service.entrada(id, req);
    }

    @PostMapping("/{id}/saida")
    public Produto saida(@PathVariable Long id, @Valid @RequestBody SaidaRequest req) {
        return service.saida(id, req);
    }
}
