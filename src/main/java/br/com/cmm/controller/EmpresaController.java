package br.com.cmm.controller;

import br.com.cmm.model.Empresa;
import br.com.cmm.repository.EmpresaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/empresas")
@CrossOrigin("*")
public class EmpresaController {

    @Autowired
    private EmpresaRepository repository;

    @GetMapping
    public List<Empresa> listarTodas() {
        return repository.findAll();
    }

    @PostMapping("/registro")
    @ResponseStatus(HttpStatus.CREATED)
    public Empresa registrar(@RequestBody Empresa empresa) {
        return repository.save(empresa);
    }

    @PostMapping("/login")
    public ResponseEntity<Empresa> login(@RequestBody Empresa credenciais) {
        Optional<Empresa> empresa = repository.findByEmailAndSenha(credenciais.getEmail(), credenciais.getSenha());
        
        if (empresa.isPresent()) {
            return ResponseEntity.ok(empresa.get()); // Login deu certo
        }
        
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); // E-mail ou senha errados
    }
}