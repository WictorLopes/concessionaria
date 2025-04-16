document.addEventListener("DOMContentLoaded", function () {
  // Regex para validar URLs
  const urlRegex = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/;

  // Função para limpar mensagens
  function limparMensagens() {
    const campos = ["nome", "paisOrigem", "anoFundacao", "website"];
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

  // Cadastrar novo fabricante
  const formCadastro = document.getElementById("formFabricante");
  if (formCadastro) {
    formCadastro.addEventListener("submit", function (e) {
      e.preventDefault();

      // Limpar mensagens anteriores
      limparMensagens();

      const nome = document.getElementById("nome").value.trim();
      const paisOrigem = document.getElementById("paisOrigem").value.trim();
      const anoFundacao = parseInt(document.getElementById("anoFundacao").value);
      let website = document.getElementById("website").value.trim();

      const anoAtual = new Date().getFullYear();

      // Validações
      if (nome.length > 100) {
        exibirErro("nome", "O nome do fabricante não pode exceder 100 caracteres.");
        return;
      }

      if (paisOrigem.length > 50) {
        exibirErro("paisOrigem", "O nome do país não pode exceder 50 caracteres.");
        return;
      }

      if (anoFundacao > anoAtual) {
        exibirErro("anoFundacao", "O ano de fundação não pode ser no futuro.");
        return;
      }

      if (anoFundacao < 1800) {
        exibirErro("anoFundacao", "O ano de fundação deve ser a partir de 1800.");
        return;
      }

      // Validação do website
      if (website) {
        // Adiciona https:// se não tiver
        if (!website.startsWith("http://") && !website.startsWith("https://")) {
          website = "https://" + website;
        }

        // Testa se é uma URL válida
        if (!urlRegex.test(website)) {
          exibirErro("website", "Por favor, insira um website válido (ex.: https://exemplo.com).");
          return;
        }
      }

      try {
        toggleLoading(true);
        const data = getData();

        // Verificar se já existe um fabricante com o mesmo nome
        if (data.fabricantes.some((f) => f.nome.toLowerCase() === nome.toLowerCase())) {
          exibirErro("nome", "Já existe um fabricante com esse nome.");
          return;
        }

        const novoFabricante = {
          id: generateUUID(), // Função do auth.js
          nome,
          paisOrigem,
          anoFundacao,
          website: website || null,
        };

        // Adicionar ao localStorage
        data.fabricantes.push(novoFabricante);
        saveData(data);

        exibirSucesso("Fabricante cadastrado com sucesso!");
        setTimeout(() => {
          window.location.href = "listar.html";
        }, 1500);
      } catch (error) {
        console.error("Erro ao cadastrar fabricante:", error);
        exibirErro("nome", "Erro ao cadastrar fabricante: " + error.message);
      } finally {
        toggleLoading(false);
      }
    });
  }

  // Listar fabricantes
  const tabelaFabricantes = document.getElementById("tabelaFabricantes");
  if (tabelaFabricantes) {
    function carregarFabricantes() {
      try {
        toggleLoading(true);
        const data = getData();
        const fabricantes = data.fabricantes;
        tabelaFabricantes.innerHTML = "";

        if (fabricantes.length === 0) {
          tabelaFabricantes.innerHTML = `
            <tr>
              <td colspan="5" class="text-center">Nenhum fabricante cadastrado.</td>
            </tr>
          `;
          return;
        }

        fabricantes.forEach((fabricante) => {
          tabelaFabricantes.innerHTML += `
            <tr>
              <td>${fabricante.nome}</td>
              <td>${fabricante.paisOrigem}</td>
              <td>${fabricante.anoFundacao}</td>
              <td><a href="${fabricante.website}" target="_blank">${fabricante.website || "N/A"}</a></td>
              <td>
                <a href="editar.html?id=${fabricante.id}" class="btn btn-sm btn-warning">Editar</a>
                <button class="btn btn-sm btn-danger" onclick="excluirFabricante('${fabricante.id}')">Excluir</button>
              </td>
            </tr>
          `;
        });
      } catch (error) {
        console.error("Erro ao carregar fabricantes:", error);
        tabelaFabricantes.innerHTML = `
          <tr>
            <td colspan="5" class="text-center text-danger">Erro ao carregar fabricantes.</td>
          </tr>
        `;
      } finally {
        toggleLoading(false);
      }
    }

    carregarFabricantes();
  }

  // Editar fabricante
  const formEditar = document.getElementById("formEditarFabricante");
  if (formEditar) {
    function carregarFabricanteParaEditar() {
      const params = new URLSearchParams(window.location.search);
      const id = params.get("id");
      if (!id) {
        exibirErro("nome", "ID inválido!");
        setTimeout(() => {
          window.location.href = "listar.html";
        }, 1500);
        return;
      }

      try {
        toggleLoading(true);
        const data = getData();
        const fabricante = data.fabricantes.find((f) => f.id === id);

        if (!fabricante) {
          exibirErro("nome", "Fabricante não encontrado!");
          setTimeout(() => {
            window.location.href = "listar.html";
          }, 1500);
          return;
        }

        document.getElementById("nome").value = fabricante.nome || "";
        document.getElementById("paisOrigem").value = fabricante.paisOrigem || "";
        document.getElementById("anoFundacao").value = fabricante.anoFundacao || "";
        document.getElementById("website").value = fabricante.website || "";
        document.getElementById("idFabricante").value = fabricante.id;
      } catch (error) {
        console.error("Erro ao carregar fabricante:", error);
        exibirErro("nome", "Erro ao carregar fabricante.");
      } finally {
        toggleLoading(false);
      }
    }

    carregarFabricanteParaEditar();

    formEditar.addEventListener("submit", function (e) {
      e.preventDefault();

      // Limpar mensagens anteriores
      limparMensagens();

      const id = document.getElementById("idFabricante").value;
      const nome = document.getElementById("nome").value.trim();
      const paisOrigem = document.getElementById("paisOrigem").value.trim();
      const anoFundacao = parseInt(document.getElementById("anoFundacao").value);
      let website = document.getElementById("website").value.trim();

      const anoAtual = new Date().getFullYear();

      // Validações
      if (nome.length > 100) {
        exibirErro("nome", "O nome do fabricante não pode exceder 100 caracteres.");
        return;
      }

      if (paisOrigem.length > 50) {
        exibirErro("paisOrigem", "O nome do país não pode exceder 50 caracteres.");
        return;
      }

      if (anoFundacao > anoAtual) {
        exibirErro("anoFundacao", "O ano de fundação não pode ser no futuro.");
        return;
      }

      if (anoFundacao < 1800) {
        exibirErro("anoFundacao", "O ano de fundação deve ser a partir de 1800.");
        return;
      }

      // Validação do website
      if (website) {
        if (!website.startsWith("http://") && !website.startsWith("https://")) {
          website = "https://" + website;
        }

        if (!urlRegex.test(website)) {
          exibirErro("website", "Por favor, insira um website válido (ex.: https://exemplo.com).");
          return;
        }
      }

      try {
        toggleLoading(true);
        const data = getData();

        // Verificar se já existe outro fabricante com o mesmo nome
        const outrosFabricantes = data.fabricantes.filter((f) => f.id !== id);
        if (outrosFabricantes.some((f) => f.nome.toLowerCase() === nome.toLowerCase())) {
          exibirErro("nome", "Já existe outro fabricante com esse nome.");
          return;
        }

        // Atualizar o fabricante
        const index = data.fabricantes.findIndex((f) => f.id === id);
        if (index !== -1) {
          data.fabricantes[index] = {
            id,
            nome,
            paisOrigem,
            anoFundacao,
            website: website || null,
          };
          saveData(data);
        }

        exibirSucesso("Fabricante atualizado com sucesso!");
        setTimeout(() => {
          window.location.href = "listar.html";
        }, 1500);
      } catch (error) {
        console.error("Erro ao atualizar fabricante:", error);
        exibirErro("nome", "Erro ao atualizar fabricante: " + error.message);
      } finally {
        toggleLoading(false);
      }
    });
  }
});

// Função para exclusão
function excluirFabricante(id) {
  if (confirm("Tem certeza que deseja excluir este fabricante?")) {
    try {
      toggleLoading(true);
      const data = getData();

      // Verificar se o fabricante está associado a algum veículo
      if (data.veiculos.some((veiculo) => veiculo.fabricanteId === id)) {
        alert("Não é possível excluir este fabricante, pois ele está associado a um ou mais veículos.");
        return;
      }

      // Remover o fabricante
      data.fabricantes = data.fabricantes.filter((f) => f.id !== id);
      saveData(data);

      const tabelaFabricantes = document.getElementById("tabelaFabricantes");
      if (tabelaFabricantes) {
        tabelaFabricantes.innerHTML = `
          <tr>
            <td colspan="5" class="text-center text-success">Fabricante excluído com sucesso!</td>
          </tr>
        `;
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (error) {
      console.error("Erro ao excluir fabricante:", error);
      const tabelaFabricantes = document.getElementById("tabelaFabricantes");
      if (tabelaFabricantes) {
        tabelaFabricantes.innerHTML = `
          <tr>
            <td colspan="5" class="text-center text-danger">Erro ao excluir fabricante: ${error.message}</td>
          </tr>
        `;
      }
    } finally {
      toggleLoading(false);
    }
  }
}