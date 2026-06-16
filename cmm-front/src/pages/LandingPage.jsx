import { Link } from 'react-router-dom';
import { Button } from '../components/Layout';
import { ThemeToggle } from '../context/ThemeContext';
import './LandingPage.css';

export default function LandingPage() {
  return (
    <div className="landing">
      <nav className="landing-nav">
        <div className="landing-brand">
          <span className="brand-icon">⚙</span>
          CMM
        </div>
        <div className="landing-nav-actions">
          <ThemeToggle />
          <Link to="/login" className="nav-link">Entrar</Link>
          <Link to="/registro"><Button onDark={true}>Criar Conta</Button></Link>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-content">
          <span className="hero-tag">Computerized Maintenance Manager</span>
          <h1>Gestão inteligente de manutenção para sua infraestrutura</h1>
          <p>
            Centralize o cadastro de ativos, orquestre tickets de manutenção preventivos e corretivos,
            e mantenha sua operação funcionando sem paradas inesperadas.
          </p>
          <div className="hero-actions">
            <Link to="/login"><Button onDark={true}>Acessar o Sistema</Button></Link>
            <a href="#recursos" className="hero-link">Conhecer recursos ↓</a>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-card">
            <div className="metric">
              <span className="metric-value">98%</span>
              <span className="metric-label">Disponibilidade</span>
            </div>
            <div className="metric">
              <span className="metric-value">-40%</span>
              <span className="metric-label">Downtime</span>
            </div>
            <div className="metric">
              <span className="metric-value">R$ 2.4M</span>
              <span className="metric-label">TCO Rastreado</span>
            </div>
          </div>
        </div>
      </section>

      <section className="problem-section">
        <div className="section-inner">
          <h2>O problema que resolvemos</h2>
          <p className="section-desc">
            Empresas com infraestrutura física — prédios corporativos, indústrias, shoppings —
            lidam com centenas de ativos críticos. Planilhas e controles manuais geram falta de
            visibilidade, manutenções esquecidas e custos operacionais imprevisíveis.
          </p>
          <div className="problem-grid">
            <div className="problem-item">
              <span className="problem-icon">📋</span>
              <h3>Sem visibilidade</h3>
              <p>Histórico de quebras disperso em planilhas e anotações soltas.</p>
            </div>
            <div className="problem-item">
              <span className="problem-icon">⏰</span>
              <h3>Manutenções esquecidas</h3>
              <p>Preventivas perdidas geram falhas corretivas caras e inesperadas.</p>
            </div>
            <div className="problem-item">
              <span className="problem-icon">💰</span>
              <h3>TCO incalculável</h3>
              <p>Impossível calcular o custo total de operação sem dados centralizados.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="recursos" className="features-section">
        <div className="section-inner">
          <h2>Recursos do Sistema</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-number">01</div>
              <h3>Gestão de Ativos</h3>
              <p>Cadastre equipamentos com categoria, número de série e localização. Monitore status em tempo real: Online, Offline, Em Manutenção.</p>
            </div>
            <div className="feature-card">
              <div className="feature-number">02</div>
              <h3>Tickets de Manutenção</h3>
              <p>Abra tickets preventivos ou corretivos. O sistema altera automaticamente o status do ativo e gerencia todo o fluxo de atendimento.</p>
            </div>
            <div className="feature-card">
              <div className="feature-number">03</div>
              <h3>Controle por Perfis</h3>
              <p>Gestores administram o inventário, Técnicos executam serviços e laudam, Solicitantes abrem chamados de falha.</p>
            </div>
            <div className="feature-card">
              <div className="feature-number">04</div>
              <h3>Cálculo de Custos</h3>
              <p>Ao fechar um ticket, o sistema calcula automaticamente horas trabalhadas, peças utilizadas e o custo total da intervenção.</p>
            </div>
            <div className="feature-card">
              <div className="feature-number">05</div>
              <h3>Dashboard Inteligente</h3>
              <p>Visualize o inventário, fila de chamados, histórico de custos e indicadores de disponibilidade em um painel unificado.</p>
            </div>
            <div className="feature-card">
              <div className="feature-number">06</div>
              <h3>Fluxo de Estados</h3>
              <p>Aberta → Em Atendimento → Aguardando Peça → Concluída. Cada transição é validada e rastreada com integridade transacional.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="stack-section">
        <div className="section-inner">
          <h2>Stack Tecnológica</h2>
          <div className="stack-grid">
            <div className="stack-item">
              <strong>Front-end</strong>
              <span>React SPA</span>
            </div>
            <div className="stack-item">
              <strong>Back-end</strong>
              <span>Java Spring Boot</span>
            </div>
            <div className="stack-item">
              <strong>Banco de Dados</strong>
              <span>MySQL</span>
            </div>
            <div className="stack-item">
              <strong>Segurança</strong>
              <span>JWT + Spring Security</span>
            </div>
            <div className="stack-item">
              <strong>API Docs</strong>
              <span>Swagger / OpenAPI</span>
            </div>
            <div className="stack-item">
              <strong>Testes</strong>
              <span>JUnit 5</span>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="section-inner cta-inner">
          <h2>Pronto para modernizar sua gestão de manutenção?</h2>
          <p>Crie sua conta de gestor e comece a gerenciar seus ativos hoje.</p>
          <Link to="/registro"><Button onDark={false}>Começar Agora</Button></Link>
        </div>
      </section>

      <footer className="landing-footer">
        <p>© 2024 CMM — Computerized Maintenance Manager</p>
      </footer>
    </div>
  );
}
