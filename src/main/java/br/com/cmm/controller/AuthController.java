package br.com.cmm.controller;

import br.com.cmm.dto.AuthResponse;
import br.com.cmm.dto.LoginRequest;
import br.com.cmm.dto.UsuarioRequest;
import br.com.cmm.service.UsuarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Autenticação", description = "Login e registro de gestores")
public class AuthController {

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping("/login")
    @Operation(summary = "Realizar login e obter token JWT")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return usuarioService.login(request);
    }

    @PostMapping("/registro")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Registrar novo gestor")
    public AuthResponse registrar(@Valid @RequestBody UsuarioRequest request) {
        return usuarioService.registrarGestor(request);
    }
}
