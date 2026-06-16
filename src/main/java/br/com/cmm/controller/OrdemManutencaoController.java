package br.com.cmm.controller;

import br.com.cmm.dto.ResponderTicketRequest;
import br.com.cmm.dto.FecharOrdemRequest;
import br.com.cmm.dto.OrdemRequest;
import br.com.cmm.model.OrdemManutencao;
import br.com.cmm.model.Usuario;
import br.com.cmm.service.OrdemManutencaoService;
import br.com.cmm.service.UsuarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ordens")
@Tag(name = "Tickets", description = "Gestão do ciclo de vida dos tickets")
public class OrdemManutencaoController {

    @Autowired
    private OrdemManutencaoService ordemService;

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping
    @Operation(summary = "Listar todos os tickets")
    public List<OrdemManutencao> listarTodas() {
        return ordemService.listarTodas();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar ticket por ID")
    public OrdemManutencao buscarPorId(@PathVariable Long id) {
        return ordemService.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyRole('GESTOR', 'SOLICITANTE')")
    @Operation(summary = "Abrir novo ticket")
    public OrdemManutencao criar(@Valid @RequestBody OrdemRequest request, Authentication auth) {
        Usuario solicitante = usuarioService.buscarPorEmail(auth.getName());
        return ordemService.abrirOrdem(request, solicitante);
    }

    @PutMapping("/{id}/iniciar")
    @PreAuthorize("hasRole('TECNICO')")
    @Operation(summary = "Técnico assume o ticket")
    public OrdemManutencao iniciarAtendimento(@PathVariable Long id, Authentication auth) {
        Usuario tecnico = usuarioService.buscarPorEmail(auth.getName());
        return ordemService.iniciarAtendimento(id, tecnico);
    }

    @PutMapping("/{id}/responder")
    @PreAuthorize("hasAnyRole('GESTOR', 'TECNICO')")
    @Operation(summary = "Responder ticket com status e valor")
    public OrdemManutencao responderTicket(@PathVariable Long id, @Valid @RequestBody ResponderTicketRequest request, Authentication auth) {
        Usuario usuario = usuarioService.buscarPorEmail(auth.getName());
        return ordemService.responderTicket(id, request, usuario);
    }

    @PutMapping("/{id}/aguardar-peca")
    @PreAuthorize("hasAnyRole('GESTOR', 'TECNICO')")
    @Operation(summary = "Pausar ticket aguardando peça")
    public OrdemManutencao aguardarPeca(@PathVariable Long id) {
        return ordemService.aguardarPeca(id);
    }

    @PutMapping("/{id}/retomar")
    @PreAuthorize("hasAnyRole('GESTOR', 'TECNICO')")
    @Operation(summary = "Retomar atendimento do ticket")
    public OrdemManutencao retomarAtendimento(@PathVariable Long id) {
        return ordemService.retomarAtendimento(id);
    }

    @PutMapping("/{id}/fechar")
    @PreAuthorize("hasAnyRole('GESTOR', 'TECNICO')")
    @Operation(summary = "Fechar ticket com laudo e cálculo de custos")
    public OrdemManutencao fecharOrdem(@PathVariable Long id, @Valid @RequestBody FecharOrdemRequest request) {
        return ordemService.fecharOrdem(id, request);
    }

    @PutMapping("/{id}/cancelar")
    @PreAuthorize("hasRole('GESTOR')")
    @Operation(summary = "Cancelar ticket")
    public OrdemManutencao cancelarOrdem(@PathVariable Long id) {
        return ordemService.cancelarOrdem(id);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('GESTOR')")
    @Operation(summary = "Excluir ticket")
    public void excluirTicket(@PathVariable Long id) {
        ordemService.excluirTicket(id);
    }
}
