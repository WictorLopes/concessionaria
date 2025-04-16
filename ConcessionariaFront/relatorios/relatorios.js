// js/relatorios.js

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

    // Função para controlar o loading
    function toggleLoading(show) {
        const loading = document.getElementById("loading");
        if (loading) {
            if (show) {
                loading.classList.remove("hidden");
            } else {
                loading.classList.add("hidden");
            }
        }
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

    // Função para carregar opções de filtros
    function carregarOpcoesFiltros() {
        try {
            const data = getData();
            
            const selectConcessionaria = document.getElementById("concessionaria");
            const selectFabricante = document.getElementById("fabricante");

            // Preencher concessionárias
            if (selectConcessionaria) {
                selectConcessionaria.innerHTML = '<option value="">Todas</option>';
                data.concessionarias.forEach((concessionaria) => {
                    const option = document.createElement("option");
                    option.value = concessionaria.nome;
                    option.textContent = concessionaria.nome;
                    selectConcessionaria.appendChild(option);
                });
            }

            // Preencher fabricantes
            if (selectFabricante) {
                selectFabricante.innerHTML = '<option value="">Todos</option>';
                data.fabricantes.forEach((fabricante) => {
                    const option = document.createElement("option");
                    option.value = fabricante.nome;
                    option.textContent = fabricante.nome;
                    selectFabricante.appendChild(option);
                });
            }
        } catch (error) {
            console.error("Erro ao carregar opções de filtros:", error);
            exibirMensagem("Erro ao carregar opções de filtros.", "danger");
        }
    }

    // Função para carregar os dados do dashboard (usando localStorage)
    function carregarDashboard() {
        if (!ctxTipoVeiculo || !ctxConcessionaria || !ctxFabricante) {
            console.error("Elementos do dashboard não encontrados.");
            exibirMensagem("Erro: Elementos do dashboard não encontrados.", "danger");
            return;
        }

        const ano = parseInt(document.getElementById("ano-dashboard").value);

        try {
            toggleLoading(true);

            const data = getData();
            const vendas = data.vendas || [];
            const veiculos = data.veiculos || [];
            const concessionarias = data.concessionarias || [];
            const fabricantes = data.fabricantes || [];

            // Filtrar vendas pelo ano selecionado
            const vendasFiltradas = vendas.filter((venda) => {
                const dataVenda = new Date(venda.data);
                return dataVenda.getFullYear() === ano;
            });

            // Calcular vendas por tipo de veículo
            const vendasPorTipo = {};
            vendasFiltradas.forEach((venda) => {
                const veiculo = veiculos.find((v) => v.id === venda.veiculoId);
                if (!veiculo) return;

                const tipoVeiculo = veiculo.tipo || "Desconhecido";
                if (!vendasPorTipo[tipoVeiculo]) {
                    vendasPorTipo[tipoVeiculo] = { tipoVeiculo, valorTotal: 0, quantidadeVendas: 0 };
                }
                vendasPorTipo[tipoVeiculo].valorTotal += venda.valor;
                vendasPorTipo[tipoVeiculo].quantidadeVendas += 1;
            });
            const vendasPorTipoArray = Object.values(vendasPorTipo);

            // Calcular vendas por concessionária
            const vendasPorConcessionaria = {};
            vendasFiltradas.forEach((venda) => {
                const concessionaria = concessionarias.find((c) => c.id === venda.concessionariaId);
                const nomeConcessionaria = concessionaria ? concessionaria.nome : "Desconhecido";
                if (!vendasPorConcessionaria[nomeConcessionaria]) {
                    vendasPorConcessionaria[nomeConcessionaria] = { concessionaria: nomeConcessionaria, valorTotal: 0 };
                }
                vendasPorConcessionaria[nomeConcessionaria].valorTotal += venda.valor;
            });
            const vendasPorConcessionariaArray = Object.values(vendasPorConcessionaria);

            // Calcular vendas por fabricante
            const vendasPorFabricante = {};
            vendasFiltradas.forEach((venda) => {
                const veiculo = veiculos.find((v) => v.id === venda.veiculoId);
                if (!veiculo) return;

                const fabricante = fabricantes.find((f) => f.id === veiculo.fabricanteId);
                const nomeFabricante = fabricante ? fabricante.nome : "Desconhecido";
                if (!vendasPorFabricante[nomeFabricante]) {
                    vendasPorFabricante[nomeFabricante] = { fabricante: nomeFabricante, valorTotal: 0, quantidadeVendas: 0 };
                }
                vendasPorFabricante[nomeFabricante].valorTotal += venda.valor;
                vendasPorFabricante[nomeFabricante].quantidadeVendas += 1;
            });
            const vendasPorFabricanteArray = Object.values(vendasPorFabricante);

            // Dados para os gráficos
            const dados = {
                vendasPorTipo: vendasPorTipoArray,
                vendasPorConcessionaria: vendasPorConcessionariaArray,
                vendasPorFabricante: vendasPorFabricanteArray,
            };

            if (chartTipoVeiculo) chartTipoVeiculo.destroy();
            if (chartConcessionaria) chartConcessionaria.destroy();
            if (chartFabricante) chartFabricante.destroy();

            // Gráfico de Vendas por Tipo de Veículo
            chartTipoVeiculo = new Chart(ctxTipoVeiculo, {
                type: "bar",
                data: {
                    labels: dados.vendasPorTipo.map((item) => item.tipoVeiculo || "Desconhecido"),
                    datasets: [
                        {
                            label: "Valor Total (R$)",
                            data: dados.vendasPorTipo.map((item) => item.valorTotal || 0),
                            backgroundColor: "rgba(54, 162, 235, 0.6)",
                            borderColor: "rgba(54, 162, 235, 1)",
                            borderWidth: 1,
                        },
                        {
                            label: "Quantidade de Vendas",
                            data: dados.vendasPorTipo.map((item) => item.quantidadeVendas || 0),
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
                            title: {
                                display: true,
                                text: "Valores",
                            },
                        },
                    },
                    plugins: {
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    let label = context.dataset.label || '';
                                    if (label) {
                                        label += ': ';
                                    }
                                    if (context.dataset.label.includes("Valor Total")) {
                                        label += new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(context.parsed.y);
                                    } else {
                                        label += context.parsed.y;
                                    }
                                    return label;
                                }
                            }
                        },
                        legend: {
                            display: true,
                            position: "top",
                        },
                    },
                },
            });

            // Gráfico de Vendas por Concessionária
            chartConcessionaria = new Chart(ctxConcessionaria, {
                type: "pie",
                data: {
                    labels: dados.vendasPorConcessionaria.map((item) => item.concessionaria || "Desconhecido"),
                    datasets: [
                        {
                            label: "Valor Total (R$)",
                            data: dados.vendasPorConcessionaria.map((item) => item.valorTotal || 0),
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
                options: {
                    plugins: {
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    let label = context.label || '';
                                    if (label) {
                                        label += ': ';
                                    }
                                    label += new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(context.parsed);
                                    return label;
                                }
                            }
                        },
                        legend: {
                            display: true,
                            position: "bottom",
                        },
                    },
                },
            });

            // Gráfico de Vendas por Fabricante
            chartFabricante = new Chart(ctxFabricante, {
                type: "bar",
                data: {
                    labels: dados.vendasPorFabricante.map((item) => item.fabricante || "Desconhecido"),
                    datasets: [
                        {
                            label: "Valor Total (R$)",
                            data: dados.vendasPorFabricante.map((item) => item.valorTotal || 0),
                            backgroundColor: "rgba(75, 192, 192, 0.6)",
                            borderColor: "rgba(75, 192, 192, 1)",
                            borderWidth: 1,
                        },
                        {
                            label: "Quantidade de Vendas",
                            data: dados.vendasPorFabricante.map((item) => item.quantidadeVendas || 0),
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
                            title: {
                                display: true,
                                text: "Valores",
                            },
                        },
                    },
                    plugins: {
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    let label = context.dataset.label || '';
                                    if (label) {
                                        label += ': ';
                                    }
                                    if (context.dataset.label.includes("Valor Total")) {
                                        label += new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(context.parsed.y);
                                    } else {
                                        label += context.parsed.y;
                                    }
                                    return label;
                                }
                            }
                        },
                        legend: {
                            display: true,
                            position: "top",
                        },
                    },
                },
            });

            exibirMensagem("Dashboard carregado com sucesso!", "success");
        } catch (error) {
            console.error("Erro ao carregar dados do dashboard:", error.message);
            exibirMensagem("Erro ao carregar dados do dashboard: " + error.message, "danger");
        } finally {
            toggleLoading(false);
        }
    }

    // Função para carregar o relatório (usando localStorage)
    function carregarRelatorio() {
        const ano = parseInt(document.getElementById("ano").value);
        const mes = parseInt(document.getElementById("mes").value);
        const concessionaria = document.getElementById("concessionaria").value;
        const fabricante = document.getElementById("fabricante").value;

        try {
            toggleLoading(true);

            const data = getData();
            const vendas = data.vendas || [];
            const veiculos = data.veiculos || [];
            const concessionarias = data.concessionarias || [];
            const fabricantes = data.fabricantes || [];

            // Filtrar vendas pelo ano e mês
            let vendasFiltradas = vendas.filter((venda) => {
                const dataVenda = new Date(venda.data);
                return dataVenda.getFullYear() === ano && (dataVenda.getMonth() + 1) === mes;
            });

            // Aplicar filtro de concessionária, se selecionado
            if (concessionaria) {
                vendasFiltradas = vendasFiltradas.filter((venda) => {
                    const conc = concessionarias.find((c) => c.id === venda.concessionariaId);
                    return conc && conc.nome === concessionaria;
                });
            }

            // Aplicar filtro de fabricante, se selecionado
            if (fabricante) {
                vendasFiltradas = vendasFiltradas.filter((venda) => {
                    const veiculo = veiculos.find((v) => v.id === venda.veiculoId);
                    if (!veiculo) return false;
                    const fab = fabricantes.find((f) => f.id === veiculo.fabricanteId);
                    return fab && fab.nome === fabricante;
                });
            }

            // Agrupar vendas por tipo de veículo, concessionária, fabricante e veículo
            const vendasAgrupadas = {};
            vendasFiltradas.forEach((venda) => {
                const veiculo = veiculos.find((v) => v.id === venda.veiculoId);
                const conc = concessionarias.find((c) => c.id === venda.concessionariaId);
                const fab = veiculo ? fabricantes.find((f) => f.id === veiculo.fabricanteId) : null;

                const tipoVeiculo = veiculo ? veiculo.tipo : "Desconhecido";
                const nomeConcessionaria = conc ? conc.nome : "Desconhecido";
                const nomeFabricante = fab ? fab.nome : "Desconhecido";
                const nomeVeiculo = veiculo ? veiculo.modelo : "Desconhecido";

                const chave = `${tipoVeiculo}|${nomeConcessionaria}|${nomeFabricante}|${nomeVeiculo}`;
                if (!vendasAgrupadas[chave]) {
                    vendasAgrupadas[chave] = {
                        tipoVeiculo,
                        concessionaria: nomeConcessionaria,
                        fabricante: nomeFabricante,
                        veiculo: nomeVeiculo,
                        valorTotal: 0,
                        quantidadeVendas: 0,
                    };
                }
                vendasAgrupadas[chave].valorTotal += venda.valor;
                vendasAgrupadas[chave].quantidadeVendas += 1;
            });

            relatorioData = Object.values(vendasAgrupadas);

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
                    <td>${item.veiculo}</td>
                    <td>${formatarPreco(item.valorTotal)}</td>
                    <td>${item.quantidadeVendas}</td>
                `;
                tabelaRelatorio.appendChild(tr);
            });

            exibirMensagem("Relatório gerado com sucesso!", "success");
            document.getElementById("exportar-pdf").disabled = false;
            document.getElementById("exportar-excel").disabled = false;
        } catch (error) {
            console.error("Erro ao carregar relatório:", error.message);
            exibirMensagem("Erro ao carregar relatório: " + error.message, "danger");
            document.getElementById("exportar-pdf").disabled = true;
            document.getElementById("exportar-excel").disabled = true;
        } finally {
            toggleLoading(false);
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
                item.veiculo,
                `R$ ${item.valorTotal.toFixed(2)}`,
                item.quantidadeVendas.toString(),
            ]);

            doc.autoTable({
                head: [
                    [
                        "Tipo de Veículo",
                        "Concessionária",
                        "Fabricante",
                        "Veículo",
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
                    "Veículo",
                    "Valor Total (R$)",
                    "Quantidade de Vendas",
                ],
                ...relatorioData.map((item) => [
                    item.tipoVeiculo,
                    item.concessionaria,
                    item.fabricante,
                    item.veiculo,
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

    // Carregar opções de filtros e relatório inicial
    carregarOpcoesFiltros();
    carregarRelatorio();
});