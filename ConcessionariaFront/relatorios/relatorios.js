const apiUrlRelatoriosVendasMensais = "https://concessionaria-back-g0fhh0a4czachmba.brazilsouth-01.azurewebsites.net/api/relatorios/vendas-mensais";
const apiUrlDashboardVendas = "https://concessionaria-back-g0fhh0a4czachmba.brazilsouth-01.azurewebsites.net/api/relatorios/dashboard-vendas";

document.addEventListener("DOMContentLoaded", function () {
  // Verificar autenticação
  const token = verificarAutenticacao();
  if (!token) {
    console.log("Autenticação falhou. Redirecionado para login.html.");
    return;
  }

  // Verificar se o usuário é Administrador ou Gerente
  const tipo = localStorage.getItem("tipo");
  if (tipo !== "Administrador" && tipo !== "Gerente") {
    console.warn("Acesso negado. Usuário não é Administrador ou Gerente.");
    window.location.href = "../index.html";
    return;
  }

  // Elementos do DOM para o dashboard
  const ctxTipoVeiculo = document.getElementById("chart-tipo-veiculo")?.getContext("2d");
  const ctxConcessionaria = document.getElementById("chart-concessionaria")?.getContext("2d");
  const ctxFabricante = document.getElementById("chart-fabricante")?.getContext("2d");

  // Elementos do DOM para o relatório
  const tabelaRelatorio = document.getElementById("tabela-relatorio");
  const mensagem = document.getElementById("mensagem");

  let chartTipoVeiculo, chartConcessionaria, chartFabricante;
  let relatorioData = [];

  // Função para exibir mensagens
  function exibirMensagem(texto, tipo) {
    mensagem.textContent = texto;
    mensagem.className = `text-center mb-4 alert alert-${tipo}`;
    mensagem.style.display = "block";
  }

  // Função para carregar os dados do dashboard
  async function carregarDashboard() {
    if (!ctxTipoVeiculo || !ctxConcessionaria || !ctxFabricante) {
      console.error("Elementos do dashboard não encontrados.");
      exibirMensagem("Erro: Elementos do dashboard não encontrados.", "danger");
      return;
    }

    const ano = document.getElementById("ano-dashboard").value;

    try {
      const resposta = await fetch(`${apiUrlDashboardVendas}?ano=${ano}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!resposta.ok) {
        const erro = await resposta.json();
        throw new Error(erro.message || "Erro ao carregar dados do dashboard.");
      }

      const dados = await resposta.json();

      if (chartTipoVeiculo) chartTipoVeiculo.destroy();
      if (chartConcessionaria) chartConcessionaria.destroy();
      if (chartFabricante) chartFabricante.destroy();

      // Gráfico de Vendas por Tipo de Veículo
      chartTipoVeiculo = new Chart(ctxTipoVeiculo, {
        type: "bar",
        data: {
          labels: dados.vendasPorTipo.map((item) => item.tipoVeiculo),
          datasets: [
            {
              label: "Valor Total (R$)",
              data: dados.vendasPorTipo.map((item) => item.valorTotal),
              backgroundColor: "rgba(54, 162, 235, 0.6)",
              borderColor: "rgba(54, 162, 235, 1)",
              borderWidth: 1,
            },
            {
              label: "Quantidade de Vendas",
              data: dados.vendasPorTipo.map((item) => item.quantidadeVendas),
              backgroundColor: "rgba(255, 99, 132, 0.6)",
              borderColor: "rgba(255, 99, 132, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });

      // Gráfico de Vendas por Concessionária
      chartConcessionaria = new Chart(ctxConcessionaria, {
        type: "pie",
        data: {
          labels: dados.vendasPorConcessionaria.map((item) => item.concessionaria),
          datasets: [
            {
              label: "Valor Total (R$)",
              data: dados.vendasPorConcessionaria.map((item) => item.valorTotal),
              backgroundColor: [
                "rgba(255, 99, 132, 0.6)",
                "rgba(54, 162, 235, 0.6)",
                "rgba(255, 206, 86, 0.6)",
                "rgba(75, 192, 192, 0.6)",
                "rgba(153, 102, 255, 0.6)",
              ],
            },
          ],
        },
      });

      // Gráfico de Vendas por Fabricante
      chartFabricante = new Chart(ctxFabricante, {
        type: "bar",
        data: {
          labels: dados.vendasPorFabricante.map((item) => item.fabricante),
          datasets: [
            {
              label: "Valor Total (R$)",
              data: dados.vendasPorFabricante.map((item) => item.valorTotal),
              backgroundColor: "rgba(75, 192, 192, 0.6)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
            {
              label: "Quantidade de Vendas",
              data: dados.vendasPorFabricante.map((item) => item.quantidadeVendas),
              backgroundColor: "rgba(153, 102, 255, 0.6)",
              borderColor: "rgba(153, 102, 255, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });

      exibirMensagem("Dashboard carregado com sucesso!", "success");
    } catch (error) {
      console.error("Erro ao carregar dados do dashboard:", error.message);
      exibirMensagem("Erro ao carregar dados do dashboard: " + error.message, "danger");
    }
  }

  // Função para carregar o relatório
  async function carregarRelatorio() {
    const ano = document.getElementById("ano").value;
    const mes = document.getElementById("mes").value;

    try {
      const resposta = await fetch(`${apiUrlRelatoriosVendasMensais}?ano=${ano}&mes=${mes}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!resposta.ok) {
        const erro = await resposta.json();
        throw new Error(erro.message || "Erro ao carregar relatório.");
      }

      relatorioData = await resposta.json();

      tabelaRelatorio.innerHTML = "";

      // Preencher a tabela
      if (relatorioData.length === 0) {
        exibirMensagem("Nenhuma venda encontrada para o período selecionado.", "warning");
        document.getElementById("exportar-pdf").disabled = true;
        document.getElementById("exportar-excel").disabled = true;
        return;
      }

      function formatarPreco(valor) {
        return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
      }
      

      relatorioData.forEach((item) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${item.tipoVeiculo}</td>
          <td>${item.concessionaria}</td>
          <td>${item.fabricante}</td>
          <td>R$ ${formatarPreco(item.valorTotal)}</td>
          <td>${item.quantidadeVendas}</td>
        `;
        tabelaRelatorio.appendChild(tr);
      });

      exibirMensagem("Relatório gerado com sucesso!", "success");
      document.getElementById("exportar-pdf").disabled = false;
      document.getElementById("exportar-excel").disabled = false;
    } catch (error) {
      console.error("Erro ao carregar relatório:", error.message);
      exibirMensagem(error.message, "danger");
      document.getElementById("exportar-pdf").disabled = true;
      document.getElementById("exportar-excel").disabled = true;
    }
  }

  if (document.getElementById("gerar-relatorio")) {
    document.getElementById("gerar-relatorio").addEventListener("click", carregarRelatorio);
  }

  if (document.getElementById("exibir-dashboard")) {
    document.getElementById("exibir-dashboard").addEventListener("click", function () {
      const secaoDashboard = document.getElementById("secao-dashboard");
      if (secaoDashboard.style.display === "none") {
        secaoDashboard.style.display = "block";
        document.getElementById("exibir-dashboard").textContent = "Ocultar Dashboard";
        carregarDashboard();
      } else {
        secaoDashboard.style.display = "none";
        document.getElementById("exibir-dashboard").textContent = "Exibir Dashboard";
        if (chartTipoVeiculo) chartTipoVeiculo.destroy();
        if (chartConcessionaria) chartConcessionaria.destroy();
        if (chartFabricante) chartFabricante.destroy();
      }
    });
  }

  if (document.getElementById("atualizar-dashboard")) {
    document.getElementById("atualizar-dashboard").addEventListener("click", carregarDashboard);
  }

  if (document.getElementById("exportar-pdf")) {
    document.getElementById("exportar-pdf").addEventListener("click", function () {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();

      doc.text("Relatório de Vendas Mensais", 10, 10);
      doc.text(
        `Período: ${
          document.getElementById("mes").options[
            document.getElementById("mes").selectedIndex
          ].text
        } de ${document.getElementById("ano").value}`,
        10,
        20
      );

      const rows = relatorioData.map((item) => [
        item.tipoVeiculo,
        item.concessionaria,
        item.fabricante,
        `R$ ${item.valorTotal.toFixed(2)}`,
        item.quantidadeVendas.toString(),
      ]);

      doc.autoTable({
        head: [
          [
            "Tipo de Veículo",
            "Concessionária",
            "Fabricante",
            "Valor Total (R$)",
            "Quantidade de Vendas",
          ],
        ],
        body: rows,
        startY: 30,
      });

      doc.save(
        `relatorio-vendas-mensais-${document.getElementById("ano").value}-${document.getElementById("mes").value}.pdf`
      );
      console.log("Relatório exportado para PDF.");
    });
  }

  if (document.getElementById("exportar-excel")) {
    document.getElementById("exportar-excel").addEventListener("click", function () {
      const wsData = [
        [
          "Tipo de Veículo",
          "Concessionária",
          "Fabricante",
          "Valor Total (R$)",
          "Quantidade de Vendas",
        ],
        ...relatorioData.map((item) => [
          item.tipoVeiculo,
          item.concessionaria,
          item.fabricante,
          item.valorTotal.toFixed(2),
          item.quantidadeVendas,
        ]),
      ];

      const ws = XLSX.utils.aoa_to_sheet(wsData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Relatório Vendas Mensais");
      XLSX.writeFile(
        wb,
        `relatorio-vendas-mensais-${document.getElementById("ano").value}-${document.getElementById("mes").value}.xlsx`
      );
      console.log("Relatório exportado para Excel.");
    });
  }

  carregarRelatorio();
});