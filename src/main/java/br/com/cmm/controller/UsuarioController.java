package br.com.cmm.controller;

import br.com.cmm.dto.UsuarioRequest;
import br.com.cmm.dto.UsuarioResponse;
import br.com.cmm.service.UsuarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@Tag(name = "Usuários", description = "Gestão de técnicos e solicitantes")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping
    @Operation(summary = "Listar todos os usuários")
    public List<UsuarioResponse> listarTodos() {
        return usuarioService.listarTodos();
    }

    @GetMapping("/tecnicos")
    @Operation(summary = "Listar técnicos cadastrados")
    public List<UsuarioResponse> listarTecnicos() {
        return usuarioService.listarTecnicos();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Cadastrar novo usuário (técnico ou solicitante)")
    public UsuarioResponse criar(@Valid @RequestBody UsuarioRequest request) {
        return usuarioService.criarUsuario(request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Encerrar conta de técnico ou solicitante")
    public void encerrarConta(@PathVariable Long id) {
        usuarioService.encerrarConta(id);
    }
}
