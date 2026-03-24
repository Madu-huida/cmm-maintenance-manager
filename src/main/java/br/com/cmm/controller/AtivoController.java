package br.com.cmm.controller;

import br.com.cmm.model.Ativo;
import br.com.cmm.repository.AtivoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ativos")
@CrossOrigin("*") 
public class AtivoController {
   

    @Autowired
    private AtivoRepository ativoRepository;

    @GetMapping
    public List<Ativo> listarTodos() {
        return ativoRepository.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Ativo criar(@RequestBody Ativo ativo) {
        return ativoRepository.save(ativo);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ativo> buscarPorId(@PathVariable Long id) {
        return ativoRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Ativo> atualizar(@PathVariable Long id, @RequestBody Ativo ativoAtualizado) {
        return ativoRepository.findById(id)
                .map(ativo -> {
                    ativo.setNome(ativoAtualizado.getNome());
                    ativo.setCategoria(ativoAtualizado.getCategoria());
                    ativo.setNumeroSerie(ativoAtualizado.getNumeroSerie());
                    ativo.setLocalizacao(ativoAtualizado.getLocalizacao());
                    ativo.setStatus(ativoAtualizado.getStatus());
                    Ativo atualizado = ativoRepository.save(ativo);
                    return ResponseEntity.ok(atualizado);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}

