package br.com.cmm.controller;

import br.com.cmm.model.OrdemManutencao;
import br.com.cmm.repository.OrdemManutencaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ordens")
@CrossOrigin("*")
public class OrdemManutencaoController {

    @Autowired
    private OrdemManutencaoRepository repository;

    @GetMapping
    public List<OrdemManutencao> listarTodas() {
        return repository.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public OrdemManutencao criar(@RequestBody OrdemManutencao ordem) {
        return repository.save(ordem);
    }
}