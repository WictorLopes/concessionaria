document.addEventListener("DOMContentLoaded", function () {
  // Função para limpar mensagens
  function limparMensagens() {
    const campos = [
      "nomeModelo",
      "anoFabricacao",
      "preco",
      "fabricante",
      "tipoVeiculo",
      "descricao",
    ];
    campos.forEach((campo) => {
      const errorDiv = document.getElementById(`${campo}Error`);
      if (errorDiv) {
        errorDiv.textContent = "";
        errorDiv.style.display = "none";
      }
    });
    const successDiv = document.getElementById("successMessage");
    if (successDiv) {
      successDiv.textContent = "";
      successDiv.style.display = "none";
    }
  }

  // Função para exibir mensagem de erro
  function exibirErro(campo, mensagem) {
    const errorDiv = document.getElementById(`${campo}Error`);
    if (errorDiv) {
      errorDiv.textContent = mensagem;
      errorDiv.style.display = "block";
    }
  }

  // Função para exibir mensagem de sucesso
  function exibirSucesso(mensagem) {
    const successDiv = document.getElementById("successMessage");
    if (successDiv) {
      successDiv.textContent = mensagem;
      successDiv.style.display = "block";
    }
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

  // Função para formatar preço
  function formatarPreco(preco) {
    return preco.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  // Função para desformatar preço
  function desformatarPreco(preco) {
    const cleaned = preco.replace(/[^\d,]/g, "").replace(",", ".");
    return parseFloat(cleaned);
  }

  // Função para obter o tipo de veículo como string
  function getTipoVeiculo(tipo) {
    const tipos = {
      0: "Carro",
      1: "Moto",
      2: "Caminhão",
      3: "Ônibus",
      4: "Outro",
    };
    return tipos[tipo] || "Desconhecido";
  }

  // Função para carregar fabricantes no select
  function carregarFabricantesSelect(selectElement) {
    try {
      const data = getData();
      const fabricantes = data.fabricantes;
      selectElement.innerHTML =
        '<option value="">Selecione um fabricante</option>';

      fabricantes.forEach((fabricante) => {
        const option = document.createElement("option");
        option.value = fabricante.id;
        option.textContent = fabricante.nome;
        selectElement.appendChild(option);
      });
    } catch (error) {
      console.error("Erro ao carregar fabricantes:", error);
      exibirErro("fabricante", "Erro ao carregar fabricantes.");
    }
  }

  // Função para buscar fabricante pelo nome
  function getNomeFabricantePorId(id) {
    const data = getData();
    const fabricante = data.fabricantes.find(f => f.id === id);
    return fabricante ? fabricante.nome : "Desconhecido";
  }
  

  // Cadastrar novo veículo
  const formCadastro = document.getElementById("formCadastroVeiculo");
  if (formCadastro) {
    const precoInput = document.getElementById("preco");
    const fabricanteSelect = document.getElementById("fabricante");

    // Carregar fabricantes no select
    carregarFabricantesSelect(fabricanteSelect);

    formCadastro.addEventListener("submit", function (e) {
      e.preventDefault();

      // Limpar mensagens anteriores
      limparMensagens();

      const nomeModelo = document.getElementById("nomeModelo").value.trim();
      const anoFabricacao = parseInt(
        document.getElementById("anoFabricacao").value
      );
      const precoFormatado = document.getElementById("preco").value;
      const preco = desformatarPreco(precoFormatado);
      const fabricanteId = document.getElementById("fabricante").value;
      const tipoVeiculo = parseInt(
        document.getElementById("tipoVeiculo").value
      );
      const descricao = document.getElementById("descricao").value.trim();

      const anoAtual = new Date().getFullYear();

      // Validações
      if (nomeModelo.length > 50) {
        exibirErro(
          "nomeModelo",
          "O nome do modelo não pode exceder 50 caracteres."
        );
        return;
      }

      if (anoFabricacao < 1800 || anoFabricacao > anoAtual + 1) {
        exibirErro(
          "anoFabricacao",
          `O ano de fabricação deve estar entre 1800 e ${anoAtual + 1}.`
        );
        return;
      }

      if (isNaN(preco) || preco <= 0) {
        exibirErro("preco", "O preço deve ser um valor positivo.");
        return;
      }

      if (!fabricanteId) {
        exibirErro("fabricante", "Selecione um fabricante.");
        return;
      }

      if (isNaN(tipoVeiculo) || tipoVeiculo < 0 || tipoVeiculo > 4) {
        exibirErro("tipoVeiculo", "Selecione um tipo de veículo válido.");
        return;
      }

      if (descricao.length > 500) {
        exibirErro("descricao", "A descrição não pode exceder 500 caracteres.");
        return;
      }

      try {
        toggleLoading(true);
        const data = getData();

        // Verificar se já existe um veículo com o mesmo modelo e ano
        if (
          data.veiculos.some(
            (v) =>
              v.modelo.toLowerCase() === nomeModelo.toLowerCase() &&
              v.anoFabricacao === anoFabricacao
          )
        ) {
          exibirErro(
            "nomeModelo",
            "Já existe um veículo com esse modelo e ano."
          );
          return;
        }

        const fabricante = data.fabricantes.find((f) => f.id === fabricanteId);
        if (!fabricante) {
          exibirErro("fabricante", "Fabricante inválido.");
          return;
        }

        const novoVeiculo = {
          id: generateUUID(), // Função do auth.js
          modelo: nomeModelo,
          anoFabricacao,
          preco,
          fabricanteId,
          fabricanteNome: fabricante.nome,
          tipoVeiculo,
          descricao: descricao || "",
        };

        // Adicionar ao localStorage
        data.veiculos.push(novoVeiculo);
        saveData(data);

        exibirSucesso("Veículo cadastrado com sucesso!");
        setTimeout(() => {
          window.location.href = "listar.html";
        }, 1500);
      } catch (error) {
        console.error("Erro ao cadastrar veículo:", error);
        exibirErro("nomeModelo", "Erro ao cadastrar veículo: " + error.message);
      } finally {
        toggleLoading(false);
      }
    });
  }

  // Listar veículos
  const tabelaVeiculos = document.getElementById("tabelaVeiculos");
  if (tabelaVeiculos) {
    function carregarVeiculos() {
      try {
        toggleLoading(true);
        const data = getData();
        const veiculos = data.veiculos;
        tabelaVeiculos.innerHTML = "";

        if (veiculos.length === 0) {
          tabelaVeiculos.innerHTML = `
            <tr>
              <td colspan="7" class="text-center">Nenhum veículo cadastrado.</td>
            </tr>
          `;
          return;
        }

        veiculos.forEach((veiculo) => {
          tabelaVeiculos.innerHTML += `
            <tr>
              <td>${veiculo.modelo}</td>
              <td>${veiculo.anoFabricacao}</td>
              <td>${formatarPreco(veiculo.preco)}</td>
              <td>${getNomeFabricantePorId(veiculo.fabricanteId)}</td>
              <td>${getTipoVeiculo(veiculo.tipoVeiculo)}</td>
              <td>${veiculo.descricao || "N/A"}</td>
              <td>
                <a href="editar.html?id=${
                  veiculo.id
                }" class="btn btn-sm btn-warning">Editar</a>
                <button class="btn btn-sm btn-danger" onclick="excluirVeiculo('${
                  veiculo.id
                }')">Excluir</button>
              </td>
            </tr>
          `;
        });
      } catch (error) {
        console.error("Erro ao carregar veículos:", error);
        tabelaVeiculos.innerHTML = `
          <tr>
            <td colspan="7" class="text-center text-danger">Erro ao carregar veículos.</td>
          </tr>
        `;
      } finally {
        toggleLoading(false);
      }
    }

    carregarVeiculos();
  }

  // Editar veículo
  const formEdicao = document.getElementById("formEdicaoVeiculo");
  if (formEdicao) {
    const fabricanteSelect = document.getElementById("fabricante");

    // Carregar fabricantes no select
    carregarFabricantesSelect(fabricanteSelect);

    function carregarVeiculoParaEditar() {
      const params = new URLSearchParams(window.location.search);
      const id = params.get("id");
      if (!id) {
        exibirErro("nomeModelo", "ID inválido!");
        setTimeout(() => {
          window.location.href = "listar.html";
        }, 1500);
        return;
      }

      try {
        toggleLoading(true);
        const data = getData();
        const veiculo = data.veiculos.find((v) => v.id === id);

        if (!veiculo) {
          exibirErro("nomeModelo", "Veículo não encontrado!");
          setTimeout(() => {
            window.location.href = "listar.html";
          }, 1500);
          return;
        }

        document.getElementById("nomeModelo").value = veiculo.modelo || "";
        document.getElementById("anoFabricacao").value =
          veiculo.anoFabricacao || "";
        document.getElementById("preco").value = veiculo.preco || "";
        document.getElementById("fabricante").value =
          veiculo.fabricanteId || "";
        document.getElementById("tipoVeiculo").value =
          veiculo.tipoVeiculo || "";
        document.getElementById("descricao").value = veiculo.descricao || "";
      } catch (error) {
        console.error("Erro ao carregar veículo:", error);
        exibirErro("nomeModelo", "Erro ao carregar veículo.");
      } finally {
        toggleLoading(false);
      }
    }

    carregarVeiculoParaEditar();

    formEdicao.addEventListener("submit", function (e) {
      e.preventDefault();

      // Limpar mensagens anteriores
      limparMensagens();

      const nomeModelo = document.getElementById("nomeModelo").value.trim();
      const anoFabricacao = parseInt(
        document.getElementById("anoFabricacao").value
      );
      const preco = parseFloat(document.getElementById("preco").value);
      const fabricanteId = document.getElementById("fabricante").value;
      const tipoVeiculo = parseInt(
        document.getElementById("tipoVeiculo").value
      );
      const descricao = document.getElementById("descricao").value.trim();

      const anoAtual = new Date().getFullYear();

      // Validações
      if (nomeModelo.length > 50) {
        exibirErro(
          "nomeModelo",
          "O nome do modelo não pode exceder 50 caracteres."
        );
        return;
      }

      if (anoFabricacao < 1800 || anoFabricacao > anoAtual + 1) {
        exibirErro(
          "anoFabricacao",
          `O ano de fabricação deve estar entre 1800 e ${anoAtual + 1}.`
        );
        return;
      }

      if (isNaN(preco) || preco <= 0) {
        exibirErro("preco", "O preço deve ser um valor positivo.");
        return;
      }

      if (!fabricanteId) {
        exibirErro("fabricante", "Selecione um fabricante.");
        return;
      }

      if (isNaN(tipoVeiculo) || tipoVeiculo < 0 || tipoVeiculo > 4) {
        exibirErro("tipoVeiculo", "Selecione um tipo de veículo válido.");
        return;
      }

      if (descricao.length > 500) {
        exibirErro("descricao", "A descrição não pode exceder 500 caracteres.");
        return;
      }

      try {
        toggleLoading(true);
        const data = getData();
        const params = new URLSearchParams(window.location.search);
        const id = params.get("id");

        // Verificar se já existe outro veículo com o mesmo modelo e ano
        const outrosVeiculos = data.veiculos.filter((v) => v.id !== id);
        if (
          outrosVeiculos.some(
            (v) =>
              v.modelo.toLowerCase() === nomeModelo.toLowerCase() &&
              v.anoFabricacao === anoFabricacao
          )
        ) {
          exibirErro(
            "nomeModelo",
            "Já existe outro veículo com esse modelo e ano."
          );
          return;
        }

        const fabricante = data.fabricantes.find((f) => f.id === fabricanteId);
        if (!fabricante) {
          exibirErro("fabricante", "Fabricante inválido.");
          return;
        }

        // Atualizar o veículo
        const index = data.veiculos.findIndex((v) => v.id === id);
        if (index !== -1) {
          data.veiculos[index] = {
            id,
            modelo: nomeModelo,
            anoFabricacao,
            preco,
            fabricanteId,
            fabricanteNome: fabricante.nome,
            tipoVeiculo,
            descricao: descricao || "",
          };
          saveData(data);
        }

        exibirSucesso("Veículo atualizado com sucesso!");
        setTimeout(() => {
          window.location.href = "listar.html";
        }, 1500);
      } catch (error) {
        console.error("Erro ao atualizar veículo:", error);
        exibirErro("nomeModelo", "Erro ao atualizar veículo: " + error.message);
      } finally {
        toggleLoading(false);
      }
    });
  }
});

// Função para exclusão
function excluirVeiculo(id) {
  if (confirm("Tem certeza que deseja excluir este veículo?")) {
    try {
      toggleLoading(true);
      const data = getData();

      // Verificar se o veículo está associado a alguma venda
      if (data.vendas.some((venda) => venda.veiculoId === id)) {
        alert(
          "Não é possível excluir este veículo, pois ele está associado a uma ou mais vendas."
        );
        return;
      }

      // Remover o veículo
      data.veiculos = data.veiculos.filter((v) => v.id !== id);
      saveData(data);

      const tabelaVeiculos = document.getElementById("tabelaVeiculos");
      if (tabelaVeiculos) {
        tabelaVeiculos.innerHTML = `
          <tr>
            <td colspan="7" class="text-center text-success">Veículo excluído com sucesso!</td>
          </tr>
        `;
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (error) {
      console.error("Erro ao excluir veículo:", error);
      const tabelaVeiculos = document.getElementById("tabelaVeiculos");
      if (tabelaVeiculos) {
        tabelaVeiculos.innerHTML = `
          <tr>
            <td colspan="7" class="text-center text-danger">Erro ao excluir veículo: ${error.message}</td>
          </tr>
        `;
      }
    } finally {
      toggleLoading(false);
    }
  }
}
