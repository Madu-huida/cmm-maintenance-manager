package br.com.cmm.controller;

import br.com.cmm.dto.DashboardResponse;
import br.com.cmm.service.OrdemManutencaoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@Tag(name = "Dashboard", description = "Métricas e indicadores do sistema")
public class DashboardController {

    @Autowired
    private OrdemManutencaoService ordemService;

    @GetMapping
    @Operation(summary = "Obter dados do dashboard")
    public DashboardResponse obterDashboard() {
        return ordemService.obterDashboard();
    }
}
