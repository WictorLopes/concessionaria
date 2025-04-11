const apiUrlVeiculo =
  "https://concessionaria-back-g0fhh0a4czachmba.brazilsouth-01.azurewebsites.net/api/veiculos";
const apiUrlFabricante =
  "https://concessionaria-back-g0fhh0a4czachmba.brazilsouth-01.azurewebsites.net/api/fabricantes";

// Aguarda o DOM estar carregado
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

  // Cadastrar novo veículo
  const formCadastroVeiculo = document.getElementById("formCadastroVeiculo");
  if (formCadastroVeiculo) {
    async function carregarFabricantes() {
      try {
        toggleLoading(true); 

        const resposta = await fetch(`${apiUrlFabricante}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!resposta.ok) {
          throw new Error(`Erro ao carregar fabricantes: ${resposta.status}`);
        }
        const fabricantes = await resposta.json();
        const selectFabricante = document.getElementById("fabricante");

        if (!selectFabricante) {
          throw new Error("Elemento #fabricante não encontrado no DOM.");
        }

        fabricantes.forEach((fabricante) => {
          const option = document.createElement("option");
          option.value = fabricante.id;
          option.textContent = fabricante.nome;
          selectFabricante.appendChild(option);
        });
      } catch (error) {
        console.error("Erro ao carregar fabricantes:", error);
        exibirErro("fabricante", "Erro ao carregar fabricantes.");
      } finally {
        toggleLoading(false); 
      }
    }

    carregarFabricantes();

    formCadastroVeiculo.addEventListener("submit", async function (e) {
      e.preventDefault();

      // Limpar mensagens anteriores
      limparMensagens();

      const nomeModelo = document.getElementById("nomeModelo").value.trim();
      const anoFabricacao = parseInt(
        document.getElementById("anoFabricacao").value
      );
      const preco = parseFloat(document.getElementById("preco").value);
      const fabricanteId = parseInt(
        document.getElementById("fabricante").value
      );
      const tipoVeiculo = document.getElementById("tipoVeiculo").value;
      const descricao = document.getElementById("descricao").value.trim();

      const anoAtual = new Date().getFullYear();

      // Validações
      if (!nomeModelo) {
        exibirErro("nomeModelo", "Por favor, insira o nome do modelo.");
        return;
      }
      if (nomeModelo.length > 100) {
        exibirErro(
          "nomeModelo",
          "O nome do modelo do veículo não pode exceder 100 caracteres."
        );
        return;
      }

      if (isNaN(anoFabricacao)) {
        exibirErro(
          "anoFabricacao",
          "Por favor, insira um ano de fabricação válido."
        );
        return;
      }
      if (anoFabricacao > anoAtual) {
        exibirErro(
          "anoFabricacao",
          "O ano de fabricação não pode ser no futuro."
        );
        return;
      }
      if (anoFabricacao < 1800) {
        exibirErro(
          "anoFabricacao",
          "O ano de fabricação deve ser a partir de 1800."
        );
        return;
      }

      if (isNaN(preco)) {
        exibirErro("preco", "Por favor, insira um preço válido.");
        return;
      }
      if (preco <= 0) {
        exibirErro("preco", "O preço deve ser um valor positivo.");
        return;
      }

      if (isNaN(fabricanteId)) {
        exibirErro("fabricante", "Por favor, selecione um fabricante.");
        return;
      }

      if (tipoVeiculo === "") {
        exibirErro("tipoVeiculo", "Por favor, selecione um tipo de veículo.");
        return;
      }

      if (descricao.length > 500) {
        exibirErro(
          "descricao",
          "A descrição do modelo do veículo não pode exceder 500 caracteres."
        );
        return;
      }

      const novoVeiculo = {
        modelo: nomeModelo,
        anoFabricacao,
        preco,
        fabricanteId,
        tipoVeiculo: parseInt(tipoVeiculo),
        descricao,
      };

      try {
        toggleLoading(true); 

        const resposta = await fetch(`${apiUrlVeiculo}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(novoVeiculo),
        });

        if (!resposta.ok) {
          const erro = await resposta.text();
          throw new Error(`Erro na API: ${resposta.status} - ${erro}`);
        }

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

  // Função para formatar o preço
  function formatarPreco(valor) {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  // Listar veículos
  const tabelaVeiculos = document.getElementById("tabelaVeiculos");
  if (tabelaVeiculos) {
    async function carregarVeiculos() {
      try {
        toggleLoading(true); 

        const resposta = await fetch(`${apiUrlVeiculo}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!resposta.ok) {
          throw new Error(
            `Erro na API: ${resposta.status} - ${await resposta.text()}`
          );
        }
        const veiculos = await resposta.json();

        veiculos.forEach((veiculo) => {
          const tr = document.createElement("tr");
          tr.innerHTML = `
                        <td>${veiculo.modelo}</td>
                        <td>${veiculo.anoFabricacao}</td>
                        <td>R$ ${formatarPreco(veiculo.preco)}</td>
                        <td>${veiculo.fabricanteNome}</td>
                        <td>${veiculo.tipoVeiculo}</td>
                        <td>${veiculo.descricao || "-"}</td>
                        <td>
                            <button class="btn btn-sm btn-warning me-1" onclick="editarVeiculo(${
                              veiculo.id
                            })">Editar</button>
                            <button class="btn btn-sm btn-danger" onclick="excluirVeiculo(${
                              veiculo.id
                            })">Excluir</button>
                        </td>
                    `;
          tabelaVeiculos.appendChild(tr);
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
  const formEdicaoVeiculo = document.getElementById("formEdicaoVeiculo");
  if (formEdicaoVeiculo) {
    const params = new URLSearchParams(window.location.search);
    const idVeiculo = params.get("id");

    if (!idVeiculo) {
      exibirErro("nomeModelo", "ID do veículo inválido!");
      setTimeout(() => {
        window.location.href = "listar.html";
      }, 1500);
      return;
    }

    carregarVeiculo(idVeiculo);
    carregarFabricantesEditar();

    async function carregarVeiculo(id) {
      try {
        toggleLoading(true); 

        const resposta = await fetch(`${apiUrlVeiculo}/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!resposta.ok) {
          throw new Error(
            `Erro na API: ${resposta.status} - ${await resposta.text()}`
          );
        }
        const veiculo = await resposta.json();

        document.getElementById("nomeModelo").value = veiculo.modelo;
        document.getElementById("anoFabricacao").value = veiculo.anoFabricacao;
        document.getElementById("preco").value = veiculo.preco;
        document.getElementById("tipoVeiculo").value = veiculo.tipoVeiculo;
        document.getElementById("descricao").value = veiculo.descricao || "";
        document.getElementById("fabricante").value = veiculo.fabricanteId;
      } catch (error) {
        console.error("Erro ao carregar veículo:", error);
        exibirErro("nomeModelo", "Erro ao carregar dados do veículo.");
      } finally {
        toggleLoading(false); 
      }
    }

    async function carregarFabricantesEditar() {
      try {
        toggleLoading(true); 

        const resposta = await fetch(`${apiUrlFabricante}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!resposta.ok) {
          throw new Error(`Erro ao carregar fabricantes: ${resposta.status}`);
        }
        const fabricantes = await resposta.json();
        const select = document.getElementById("fabricante");

        if (!select) {
          throw new Error("Elemento #fabricante não encontrado no DOM.");
        }

        fabricantes.forEach((fabricante) => {
          const option = document.createElement("option");
          option.value = fabricante.id;
          option.textContent = fabricante.nome;
          select.appendChild(option);
        });
      } catch (error) {
        console.error("Erro ao carregar fabricantes:", error);
        exibirErro("fabricante", "Erro ao carregar fabricantes.");
      } finally {
        toggleLoading(false); 
      }
    }

    formEdicaoVeiculo.addEventListener("submit", async function (event) {
      event.preventDefault();

      // Limpar mensagens anteriores
      limparMensagens();

      const nomeModelo = document.getElementById("nomeModelo").value.trim();
      const anoFabricacao = parseInt(
        document.getElementById("anoFabricacao").value
      );
      const preco = parseFloat(document.getElementById("preco").value);
      const fabricanteId = parseInt(
        document.getElementById("fabricante").value
      );
      const tipoVeiculo = document.getElementById("tipoVeiculo").value;
      const descricao = document.getElementById("descricao").value.trim();

      const anoAtual = new Date().getFullYear();

      // Validações
      if (!nomeModelo) {
        exibirErro("nomeModelo", "Por favor, insira o nome do modelo.");
        return;
      }
      if (nomeModelo.length > 100) {
        exibirErro(
          "nomeModelo",
          "O nome do modelo do veículo não pode exceder 100 caracteres."
        );
        return;
      }

      if (isNaN(anoFabricacao)) {
        exibirErro(
          "anoFabricacao",
          "Por favor, insira um ano de fabricação válido."
        );
        return;
      }
      if (anoFabricacao > anoAtual) {
        exibirErro(
          "anoFabricacao",
          "O ano de fabricação não pode ser no futuro."
        );
        return;
      }
      if (anoFabricacao < 1800) {
        exibirErro(
          "anoFabricacao",
          "O ano de fabricação deve ser a partir de 1800."
        );
        return;
      }

      if (isNaN(preco)) {
        exibirErro("preco", "Por favor, insira um preço válido.");
        return;
      }
      if (preco <= 0) {
        exibirErro("preco", "O preço deve ser um valor positivo.");
        return;
      }

      if (isNaN(fabricanteId)) {
        exibirErro("fabricante", "Por favor, selecione um fabricante.");
        return;
      }

      if (tipoVeiculo === "") {
        exibirErro("tipoVeiculo", "Por favor, selecione um tipo de veículo.");
        return;
      }

      if (descricao.length > 500) {
        exibirErro(
          "descricao",
          "A descrição do modelo do veículo não pode exceder 500 caracteres."
        );
        return;
      }

      const dados = {
        id: parseInt(idVeiculo),
        modelo: nomeModelo,
        anoFabricacao,
        preco,
        fabricanteId,
        tipoVeiculo: parseInt(tipoVeiculo),
        descricao,
      };

      try {
        toggleLoading(true); 

        const resposta = await fetch(`${apiUrlVeiculo}/${idVeiculo}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(dados),
        });

        if (!resposta.ok) {
          const erro = await resposta.text();
          throw new Error(`Erro na API: ${resposta.status} - ${erro}`);
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

// Funções globais para listagem
function editarVeiculo(id) {
  window.location.href = `editar.html?id=${id}`;
}

async function excluirVeiculo(id) {
  if (confirm("Tem certeza que deseja excluir este veículo?")) {
    try {
      toggleLoading(true); 

      const token = localStorage.getItem("token");
      if (!token) {
        alert("Sessão expirada. Faça login novamente.");
        localStorage.removeItem("token");
        localStorage.removeItem("nome");
        localStorage.removeItem("tipo");
        window.location.href = "/login.html";
        return;
      }

      const resposta = await fetch(`${apiUrlVeiculo}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!resposta.ok) {
        if (resposta.status === 401) {
          alert("Sessão expirada ou permissão negada. Faça login novamente.");
          localStorage.removeItem("token");
          localStorage.removeItem("nome");
          localStorage.removeItem("tipo");
          window.location.href = "/login.html";
          return;
        }
        const erro = await resposta.text();
        throw new Error(`Erro na API: ${resposta.status} - ${erro}`);
      }

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
