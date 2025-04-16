document.addEventListener("DOMContentLoaded", function () {
  const formCadastroVenda = document.getElementById("formCadastroVenda");
  const tabelaVendas = document.getElementById("tabelaVendas");

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

  // Função para formatar CPF
  function formatarCPF(cpf) {
    const value = cpf.replace(/\D/g, "");
    return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  }

  // Função para formatar telefone
  function formatarTelefone(telefone) {
    const value = telefone.replace(/\D/g, "");
    return value.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  }

  // Função para exibir mensagem de erro
  function exibirErro(campo, mensagem) {
    const errorDiv = document.getElementById(`${campo}Error`);
    if (errorDiv) {
      errorDiv.textContent = mensagem;
      errorDiv.style.display = "block";
    }
  }

  // Função para limpar mensagens de erro
  function limparErros() {
    const campos = [
      "concessionaria",
      "fabricante",
      "veiculo",
      "nomeCliente",
      "cpf",
      "telefone",
      "dataVenda",
      "precoVenda",
      "geral",
    ];
    campos.forEach((campo) => {
      const errorDiv = document.getElementById(`${campo}Error`);
      if (errorDiv) {
        errorDiv.textContent = "";
        errorDiv.style.display = "none";
      }
    });
  }

  // Função para desformatar preço
  function desformatarPreco(valor) {
    return parseFloat(valor.replace(/\./g, "").replace(",", "."));
  }

  // Função para formatar preço
  function formatarPreco(valor) {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  // Função para gerar um protocolo simples
  function gerarProtocolo() {
    const timestamp = Date.now();
    return `VENDA-${timestamp}`;
  }

  // Cadastrar nova venda
  if (formCadastroVenda) {
    const concessionariaSelect = document.getElementById("concessionaria");
    const fabricanteSelect = document.getElementById("fabricante");
    const veiculoSelect = document.getElementById("veiculo");
    const cpfInput = document.getElementById("cpf");
    const telefoneInput = document.getElementById("telefone");

    // Máscaras para CPF e telefone
    cpfInput.addEventListener("input", function () {
      let value = this.value.replace(/\D/g, "");
      if (value.length > 11) value = value.slice(0, 11);
      value = value.replace(/(\d{3})(\d)/, "$1.$2");
      value = value.replace(/(\d{3})(\d)/, "$1.$2");
      value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
      this.value = value;
    });

    telefoneInput.addEventListener("input", function () {
      let value = this.value.replace(/\D/g, "");
      if (value.length > 11) value = value.slice(0, 11);
      value = value.replace(/(\d{2})(\d)/, "($1) $2");
      value = value.replace(/(\d{5})(\d)/, "$1-$2");
      this.value = value;
    });

    // Carregar concessionárias
    function carregarConcessionarias() {
      try {
        const data = getData();
        const concessionarias = data.concessionarias;
        concessionarias.forEach((concessionaria) => {
          const option = document.createElement("option");
          option.value = concessionaria.id;
          option.textContent = `${concessionaria.nome} - ${concessionaria.cidade}`;
          concessionariaSelect.appendChild(option);
        });
      } catch (error) {
        console.error("Erro ao carregar concessionárias:", error);
        exibirErro("geral", "Erro ao carregar concessionárias.");
      }
    }

    // Carregar fabricantes
    function carregarFabricantes() {
      try {
        const data = getData();
        const fabricantes = data.fabricantes;
        fabricantes.forEach((fabricante) => {
          const option = document.createElement("option");
          option.value = fabricante.id;
          option.textContent = fabricante.nome;
          fabricanteSelect.appendChild(option);
        });
      } catch (error) {
        console.error("Erro ao carregar fabricantes:", error);
        exibirErro("geral", "Erro ao carregar fabricantes.");
      }
    }

    // Carregar veículos por fabricante
    fabricanteSelect.addEventListener("change", function () {
      const fabricanteId = parseInt(this.value);
      veiculoSelect.disabled = true;
      veiculoSelect.innerHTML =
        '<option value="">Selecione um veículo</option>';

      if (fabricanteId) {
        try {
          const data = getData();
          const veiculos = data.veiculos.filter(
            (veiculo) => veiculo.fabricanteId === fabricanteId
          );
          veiculos.forEach((veiculo) => {
            const option = document.createElement("option");
            option.value = veiculo.id;
            option.textContent = `${veiculo.modelo} - ${formatarPreco(
              veiculo.preco
            )}`;
            option.dataset.preco = veiculo.preco;
            veiculoSelect.appendChild(option);
          });
          veiculoSelect.disabled = false;
        } catch (error) {
          console.error("Erro ao carregar veículos:", error);
          exibirErro("geral", "Erro ao carregar veículos.");
        }
      }
    });

    // Submissão do formulário de cadastro de venda
    formCadastroVenda.addEventListener("submit", function (e) {
      e.preventDefault();

      // Limpar mensagens de erro
      limparErros();

      const concessionariaId = parseInt(concessionariaSelect.value);
      const fabricanteId = parseInt(fabricanteSelect.value);
      const veiculoId = parseInt(veiculoSelect.value);
      const nomeCliente = document.getElementById("nomeCliente").value.trim();
      const cpf = cpfInput.value.replace(/\D/g, "");
      const telefone = telefoneInput.value.replace(/\D/g, "");
      const dataVenda = document.getElementById("dataVenda").value;
      const precoVendaFormatado = document.getElementById("precoVenda").value;
      const precoVenda = desformatarPreco(precoVendaFormatado);
      const precoVeiculo = parseFloat(
        veiculoSelect.selectedOptions[0].dataset.preco
      );

      const hoje = new Date().toISOString().split("T")[0];

      // Validações
      if (!concessionariaId) {
        exibirErro("concessionaria", "Selecione uma concessionária!");
        return;
      }
      if (!fabricanteId) {
        exibirErro("fabricante", "Selecione um fabricante!");
        return;
      }
      if (!veiculoId) {
        exibirErro("veiculo", "Selecione um veículo!");
        return;
      }
      if (!nomeCliente) {
        exibirErro("nomeCliente", "Informe o nome do cliente!");
        return;
      }
      if (!validarCPF(cpf)) {
        exibirErro("cpf", "CPF inválido!");
        return;
      }
      if (telefone.length < 10 || telefone.length > 11) {
        exibirErro("telefone", "Telefone inválido!");
        return;
      }
      if (!dataVenda) {
        exibirErro("dataVenda", "Informe a data da venda!");
        return;
      }
      if (dataVenda > hoje) {
        exibirErro("dataVenda", "A data da venda não pode ser futura!");
        return;
      }
      if (isNaN(precoVenda) || precoVenda <= 0) {
        exibirErro(
          "precoVenda",
          "O preço de venda deve ser um valor positivo!"
        );
        return;
      }
      if (precoVenda > precoVeiculo) {
        exibirErro(
          "precoVenda",
          "O preço de venda não pode ser maior que o preço do veículo!"
        );
        return;
      }

      try {
        toggleLoading(true);
        const data = getData();

        // Verificar se o CPF já está registrado
        if (data.vendas.some((venda) => venda.cpf === cpf)) {
          exibirErro("cpf", "CPF já registrado para outra venda!");
          return;
        }

        // Criar nova venda
        const novaVenda = {
          id: generateUUID(), // Usando a função do auth.js
          concessionariaId,
          veiculoId,
          fabricanteId,
          nomeCliente,
          cpf,
          telefone,
          dataVenda,
          precoVenda,
          protocolo: gerarProtocolo(),
          concessionariaNome: data.concessionarias.find(
            (c) => c.id === concessionariaId
          ).nome,
          fabricanteNome: data.fabricantes.find((f) => f.id === fabricanteId)
            .nome,
          veiculoModelo: data.veiculos.find((v) => v.id === veiculoId).modelo,
        };

        // Adicionar venda ao localStorage
        data.vendas.push(novaVenda);
        saveData(data);

        // Exibir mensagem de sucesso
        exibirErro(
          "geral",
          `Venda cadastrada com sucesso! Protocolo: ${novaVenda.protocolo}`,
          "text-success"
        );
        setTimeout(() => {
          window.location.href = "listar.html";
        }, 1500);
      } catch (error) {
        console.error("Erro ao cadastrar venda:", error);
        exibirErro("geral", "Erro ao cadastrar venda: " + error.message);
      } finally {
        toggleLoading(false);
      }
    });

    // Carregar dados iniciais
    carregarConcessionarias();
    carregarFabricantes();
  }

  // Listar vendas
  if (tabelaVendas) {
    function carregarVendas() {
      try {
        toggleLoading(true);
        const data = getData();
        const vendas = data.vendas;

        // Corrigir vendas antigas que não têm os nomes
        vendas.forEach((venda) => {
          if (
            !venda.concessionariaNome ||
            !venda.fabricanteNome ||
            !venda.veiculoModelo
          ) {
            const concessionaria = data.concessionarias.find(
              (c) => c.id === venda.concessionariaId
            );
            const fabricante = data.fabricantes.find(
              (f) => f.id === venda.fabricanteId
            );
            const veiculo = data.veiculos.find((v) => v.id === venda.veiculoId);

            venda.concessionariaNome = concessionaria
              ? concessionaria.nome
              : "Desconhecida";
            venda.fabricanteNome = fabricante
              ? fabricante.nome
              : "Desconhecido";
            venda.veiculoModelo = veiculo ? veiculo.modelo : "Desconhecido";
          }
        });

        // Salvar dados corrigidos
        saveData(data);

        if (vendas.length === 0) {
          tabelaVendas.innerHTML = `
            <tr>
              <td colspan="9" class="text-center">Nenhuma venda cadastrada.</td>
            </tr>
          `;
          return;
        }

        vendas.forEach((venda) => {
          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>${venda.concessionariaNome}</td>
            <td>${venda.fabricanteNome}</td>
            <td>${venda.veiculoModelo}</td>
            <td>${venda.nomeCliente}</td>
            <td>${formatarCPF(venda.cpf)}</td>
            <td>${formatarTelefone(venda.telefone)}</td>
            <td>${venda.dataVenda}</td>
            <td>${formatarPreco(venda.precoVenda)}</td>
            <td>${venda.protocolo}</td>
          `;
          tabelaVendas.appendChild(tr);
        });
      } catch (error) {
        console.error("Erro ao carregar vendas:", error);
        exibirErro("geral", "Erro ao carregar vendas.");
      } finally {
        toggleLoading(false);
      }
    }

    carregarVendas();
  }
});

// Função para validar CPF
function validarCPF(cpf) {
  cpf = cpf.replace(/\D/g, "");
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  let soma = 0,
    resto;
  for (let i = 1; i <= 9; i++) soma += parseInt(cpf.charAt(i - 1)) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(9))) return false;
  soma = 0;
  for (let i = 1; i <= 10; i++) soma += parseInt(cpf.charAt(i - 1)) * (12 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(10))) return false;
  return true;
}
