package br.com.cmm.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResponse {
    private long totalAtivos;
    private long ativosOnline;
    private long ativosOffline;
    private long ordensAbertas;
    private long ordensEmAtendimento;
    private long ordensAguardandoPeca;
    private long ordensConcluidas;
    private double custoTotalHistorico;
    private List<Map<String, Object>> ordensRecentes;
    private List<Map<String, Object>> ativosPorStatus;
}
