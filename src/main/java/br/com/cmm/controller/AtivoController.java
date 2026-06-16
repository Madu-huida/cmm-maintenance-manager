package br.com.cmm.controller;

import br.com.cmm.model.Ativo;
import br.com.cmm.service.AtivoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ativos")
@Tag(name = "Ativos", description = "CRUD de equipamentos e inventário")
public class AtivoController {

    @Autowired
    private AtivoService ativoService;

    @GetMapping
    @Operation(summary = "Listar todos os ativos")
    public List<Ativo> listarTodos() {
        return ativoService.listarTodos();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Cadastrar novo ativo")
    public Ativo criar(@RequestBody Ativo ativo) {
        return ativoService.criar(ativo);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar ativo por ID")
    public Ativo buscarPorId(@PathVariable Long id) {
        return ativoService.buscarPorId(id);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar ativo")
    public Ativo atualizar(@PathVariable Long id, @RequestBody Ativo ativoAtualizado) {
        return ativoService.atualizar(id, ativoAtualizado);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Remover ativo")
    public void deletar(@PathVariable Long id) {
        ativoService.deletar(id);
    }
}
