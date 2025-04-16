document.addEventListener("DOMContentLoaded", function () {
  // Função para limpar mensagens
  function limparMensagens() {
    const campos = [
      "nome",
      "cep",
      "rua",
      "numero",
      "cidade",
      "estado",
      "telefone",
      "email",
      "capacidadeMaxima",
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

  // Função para formatar telefone
  function formatarTelefone(telefone) {
    const value = telefone.replace(/\D/g, "");
    return value.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  }

  // Função para formatar CEP
  function formatarCEP(cep) {
    const value = cep.replace(/\D/g, "");
    return value.replace(/(\d{5})(\d{3})/, "$1-$2");
  }

  // Cadastrar nova concessionária
  const formCadastro = document.getElementById("formCadastroConcessionaria");
  if (formCadastro) {
    const cepInput = document.getElementById("cep");
    const telefoneInput = document.getElementById("telefone");

    // Máscaras para CEP e telefone
    cepInput.addEventListener("input", function () {
      let value = this.value.replace(/\D/g, "");
      if (value.length > 8) value = value.slice(0, 8);
      this.value = value;
    });

    telefoneInput.addEventListener("input", function () {
      let value = this.value.replace(/\D/g, "");
      if (value.length > 11) value = value.slice(0, 11);
      value = value.replace(/(\d{2})(\d)/, "($1) $2");
      value = value.replace(/(\d{5})(\d)/, "$1-$2");
      this.value = value;
    });

    formCadastro.addEventListener("submit", function (e) {
      e.preventDefault();

      // Limpar mensagens anteriores
      limparMensagens();

      const nome = document.getElementById("nome").value.trim();
      const cep = document.getElementById("cep").value.replace(/\D/g, "");
      const rua = document.getElementById("rua").value.trim();
      const numero = document.getElementById("numero").value.trim();
      const cidade = document.getElementById("cidade").value.trim();
      const estado = document.getElementById("estado").value.trim().toUpperCase();
      const telefone = document.getElementById("telefone").value.replace(/\D/g, "");
      const email = document.getElementById("email").value.trim();
      const capacidadeMaxima = parseInt(document.getElementById("capacidadeMaxima").value);

      // Validações
      if (nome.length > 100) {
        exibirErro("nome", "O nome não pode exceder 100 caracteres.");
        return;
      }

      if (cep.length !== 8) {
        exibirErro("cep", "O CEP deve ter exatamente 8 dígitos.");
        return;
      }

      if (rua.length > 100) {
        exibirErro("rua", "A rua não pode exceder 100 caracteres.");
        return;
      }

      if (numero.length > 10) {
        exibirErro("numero", "O número não pode exceder 10 caracteres.");
        return;
      }

      if (cidade.length > 50) {
        exibirErro("cidade", "A cidade não pode exceder 50 caracteres.");
        return;
      }

      if (estado.length !== 2) {
        exibirErro("estado", "O estado deve ter exatamente 2 caracteres (ex.: SP).");
        return;
      }

      if (telefone.length < 10 || telefone.length > 11) {
        exibirErro("telefone", "O telefone deve ter 10 ou 11 dígitos.");
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        exibirErro("email", "Por favor, insira um e-mail válido.");
        return;
      }

      if (isNaN(capacidadeMaxima) || capacidadeMaxima < 1) {
        exibirErro("capacidadeMaxima", "A capacidade máxima deve ser maior que 0.");
        return;
      }

      try {
        toggleLoading(true);
        const data = getData();

        // Verificar se já existe uma concessionária com o mesmo nome
        if (data.concessionarias.some((c) => c.nome.toLowerCase() === nome.toLowerCase())) {
          exibirErro("nome", "Já existe uma concessionária com esse nome.");
          return;
        }

        const novaConcessionaria = {
          id: generateUUID(), // Função do auth.js
          nome,
          cep,
          rua,
          numero,
          cidade,
          estado,
          telefone,
          email,
          CapacidadeMaximaVeiculos: capacidadeMaxima,
        };

        // Adicionar ao localStorage
        data.concessionarias.push(novaConcessionaria);
        saveData(data);

        exibirSucesso("Concessionária cadastrada com sucesso!");
        setTimeout(() => {
          window.location.href = "listar.html";
        }, 1500);
      } catch (error) {
        console.error("Erro ao cadastrar concessionária:", error);
        exibirErro("nome", "Erro ao cadastrar concessionária: " + error.message);
      } finally {
        toggleLoading(false);
      }
    });
  }

  // Listar concessionárias
  const tabelaConcessionarias = document.getElementById("tabelaConcessionarias");
  if (tabelaConcessionarias) {
    function carregarConcessionarias() {
      try {
        toggleLoading(true);
        const data = getData();
        const concessionarias = data.concessionarias;
        tabelaConcessionarias.innerHTML = "";

        if (concessionarias.length === 0) {
          tabelaConcessionarias.innerHTML = `
            <tr>
              <td colspan="6" class="text-center">Nenhuma concessionária cadastrada.</td>
            </tr>
          `;
          return;
        }

        concessionarias.forEach((concessionaria) => {
          tabelaConcessionarias.innerHTML += `
            <tr>
              <td>${concessionaria.nome}</td>
              <td>${concessionaria.rua}, ${concessionaria.numero}, ${concessionaria.cidade} - ${concessionaria.estado}, ${formatarCEP(concessionaria.cep)}</td>
              <td>${formatarTelefone(concessionaria.telefone)}</td>
              <td>${concessionaria.email}</td>
              <td>${concessionaria.CapacidadeMaximaVeiculos}</td>
              <td>
                <a href="editar.html?id=${concessionaria.id}" class="btn btn-sm btn-warning">Editar</a>
                <button class="btn btn-sm btn-danger" onclick="excluirConcessionaria('${concessionaria.id}')">Excluir</button>
              </td>
            </tr>
          `;
        });
      } catch (error) {
        console.error("Erro ao carregar concessionárias:", error);
        tabelaConcessionarias.innerHTML = `
          <tr>
            <td colspan="6" class="text-center text-danger">Erro ao carregar concessionárias.</td>
          </tr>
        `;
      } finally {
        toggleLoading(false);
      }
    }

    carregarConcessionarias();
  }

  // Editar concessionária
  const formEdicao = document.getElementById("formEdicaoConcessionaria");
  if (formEdicao) {
    function carregarConcessionariaParaEditar() {
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
        const concessionaria = data.concessionarias.find((c) => c.id === id);

        if (!concessionaria) {
          exibirErro("nome", "Concessionária não encontrada!");
          setTimeout(() => {
            window.location.href = "listar.html";
          }, 1500);
          return;
        }

        document.getElementById("nome").value = concessionaria.nome || "";
        document.getElementById("cep").value = concessionaria.cep || "";
        document.getElementById("rua").value = concessionaria.rua || "";
        document.getElementById("numero").value = concessionaria.numero || "";
        document.getElementById("cidade").value = concessionaria.cidade || "";
        document.getElementById("estado").value = concessionaria.estado || "";
        document.getElementById("telefone").value = formatarTelefone(concessionaria.telefone) || "";
        document.getElementById("email").value = concessionaria.email || "";
        document.getElementById("capacidadeMaxima").value = concessionaria.CapacidadeMaximaVeiculos || "";
      } catch (error) {
        console.error("Erro ao carregar concessionária:", error);
        exibirErro("nome", "Erro ao carregar concessionária.");
      } finally {
        toggleLoading(false);
      }
    }

    carregarConcessionariaParaEditar();

    const cepInput = document.getElementById("cep");
    const telefoneInput = document.getElementById("telefone");

    // Máscaras para CEP e telefone
    cepInput.addEventListener("input", function () {
      let value = this.value.replace(/\D/g, "");
      if (value.length > 8) value = value.slice(0, 8);
      this.value = value;
    });

    telefoneInput.addEventListener("input", function () {
      let value = this.value.replace(/\D/g, "");
      if (value.length > 11) value = value.slice(0, 11);
      value = value.replace(/(\d{2})(\d)/, "($1) $2");
      value = value.replace(/(\d{5})(\d)/, "$1-$2");
      this.value = value;
    });

    formEdicao.addEventListener("submit", function (e) {
      e.preventDefault();

      // Limpar mensagens anteriores
      limparMensagens();

      const nome = document.getElementById("nome").value.trim();
      const cep = document.getElementById("cep").value.replace(/\D/g, "");
      const rua = document.getElementById("rua").value.trim();
      const numero = document.getElementById("numero").value.trim();
      const cidade = document.getElementById("cidade").value.trim();
      const estado = document.getElementById("estado").value.trim().toUpperCase();
      const telefone = document.getElementById("telefone").value.replace(/\D/g, "");
      const email = document.getElementById("email").value.trim();
      const capacidadeMaxima = parseInt(document.getElementById("capacidadeMaxima").value);

      // Validações
      if (nome.length > 100) {
        exibirErro("nome", "O nome não pode exceder 100 caracteres.");
        return;
      }

      if (cep.length !== 8) {
        exibirErro("cep", "O CEP deve ter exatamente 8 dígitos.");
        return;
      }

      if (rua.length > 100) {
        exibirErro("rua", "A rua não pode exceder 100 caracteres.");
        return;
      }

      if (numero.length > 10) {
        exibirErro("numero", "O número não pode exceder 10 caracteres.");
        return;
      }

      if (cidade.length > 50) {
        exibirErro("cidade", "A cidade não pode exceder 50 caracteres.");
        return;
      }

      if (estado.length !== 2) {
        exibirErro("estado", "O estado deve ter exatamente 2 caracteres (ex.: SP).");
        return;
      }

      if (telefone.length < 10 || telefone.length > 11) {
        exibirErro("telefone", "O telefone deve ter 10 ou 11 dígitos.");
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        exibirErro("email", "Por favor, insira um e-mail válido.");
        return;
      }

      if (isNaN(capacidadeMaxima) || capacidadeMaxima < 1) {
        exibirErro("capacidadeMaxima", "A capacidade máxima deve ser maior que 0.");
        return;
      }

      try {
        toggleLoading(true);
        const data = getData();
        const params = new URLSearchParams(window.location.search);
        const id = params.get("id");

        // Verificar se já existe outra concessionária com o mesmo nome
        const outrasConcessionarias = data.concessionarias.filter((c) => c.id !== id);
        if (outrasConcessionarias.some((c) => c.nome.toLowerCase() === nome.toLowerCase())) {
          exibirErro("nome", "Já existe outra concessionária com esse nome.");
          return;
        }

        // Atualizar a concessionária
        const index = data.concessionarias.findIndex((c) => c.id === id);
        if (index !== -1) {
          data.concessionarias[index] = {
            id,
            nome,
            cep,
            rua,
            numero,
            cidade,
            estado,
            telefone,
            email,
            CapacidadeMaximaVeiculos: capacidadeMaxima,
          };
          saveData(data);
        }

        exibirSucesso("Concessionária atualizada com sucesso!");
        setTimeout(() => {
          window.location.href = "listar.html";
        }, 1500);
      } catch (error) {
        console.error("Erro ao atualizar concessionária:", error);
        exibirErro("nome", "Erro ao atualizar concessionária: " + error.message);
      } finally {
        toggleLoading(false);
      }
    });
  }
});

// Função para exclusão
function excluirConcessionaria(id) {
  if (confirm("Tem certeza que deseja excluir esta concessionária?")) {
    try {
      toggleLoading(true);
      const data = getData();

      // Verificar se a concessionária está associada a alguma venda
      if (data.vendas.some((venda) => venda.concessionariaId === id)) {
        alert("Não é possível excluir esta concessionária, pois ela está associada a uma ou mais vendas.");
        return;
      }

      // Remover a concessionária
      data.concessionarias = data.concessionarias.filter((c) => c.id !== id);
      saveData(data);

      const tabelaConcessionarias = document.getElementById("tabelaConcessionarias");
      if (tabelaConcessionarias) {
        tabelaConcessionarias.innerHTML = `
          <tr>
            <td colspan="6" class="text-center text-success">Concessionária excluída com sucesso!</td>
          </tr>
        `;
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (error) {
      console.error("Erro ao excluir concessionária:", error);
      const tabelaConcessionarias = document.getElementById("tabelaConcessionarias");
      if (tabelaConcessionarias) {
        tabelaConcessionarias.innerHTML = `
          <tr>
            <td colspan="6" class="text-center text-danger">Erro ao excluir concessionária: ${error.message}</td>
          </tr>
        `;
      }
    } finally {
      toggleLoading(false);
    }
  }
}