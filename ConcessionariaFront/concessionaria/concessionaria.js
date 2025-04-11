const apiUrlConcessionaria =
  "https://concessionaria-back-g0fhh0a4czachmba.brazilsouth-01.azurewebsites.net/api/concessionarias";
const apiUrlViaCEP = "https://viacep.com.br/ws/";

// Função para formatar o CEP
function formatarCEP(cep) {
  cep = cep.replace(/\D/g, "");
  if (cep.length === 8) {
    return `${cep.slice(0, 5)}-${cep.slice(5)}`;
  }
  return cep;
}

// Função para formatar o telefone
function formatarTelefone(telefone) {
  telefone = telefone.replace(/\D/g, "");
  if (telefone.length <= 10) {
    return telefone.replace(/(\d{2})(\d{0,4})(\d{0,4})/, "($1) $2-$3").trim();
  } else {
    return telefone.replace(/(\d{2})(\d{0,5})(\d{0,4})/, "($1) $2-$3").trim();
  }
}

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

// Cadastrar nova concessionária
const formCadastroConcessionaria = document.getElementById(
  "formCadastroConcessionaria"
);

if (formCadastroConcessionaria) {
  async function buscarCEP(cep) {
    try {
      toggleLoading(true); 

      const cepFormatado = formatarCEP(cep);
      if (!/^\d{5}-\d{3}$/.test(cepFormatado)) {
        throw new Error("CEP inválido.");
      }
      const resposta = await fetch(`${apiUrlViaCEP}${cep}/json/`);
      if (!resposta.ok) {
        throw new Error("Erro ao buscar CEP.");
      }
      const dados = await resposta.json();
      if (dados.erro) {
        throw new Error("CEP não encontrado.");
      }

      document.getElementById("rua").value = dados.logradouro || "";
      document.getElementById("cidade").value = dados.localidade || "";
      document.getElementById("estado").value = dados.uf || "";
      document.getElementById("numero").focus();
      exibirErro("cep", "");
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
      exibirErro("cep", "CEP inválido ou não encontrado.");
    } finally {
      toggleLoading(false); 
    }
  }

  document.getElementById("cep").addEventListener("blur", function () {
    const cep = this.value.trim();
    if (cep.length === 8 && /^\d{8}$/.test(cep)) {
      buscarCEP(cep);
    }
  });

  document.getElementById("telefone").addEventListener("input", function () {
    this.value = formatarTelefone(this.value);
  });

  formCadastroConcessionaria.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Limpar mensagens anteriores
    limparMensagens();

    const nome = document.getElementById("nome").value.trim();
    const cep = document.getElementById("cep").value.trim();
    const rua = document.getElementById("rua").value.trim();
    const numero = document.getElementById("numero").value.trim();
    const cidade = document.getElementById("cidade").value.trim();
    const estado = document.getElementById("estado").value.trim().toUpperCase();
    const telefone = document.getElementById("telefone").value.trim();
    const email = document.getElementById("email").value.trim();
    const capacidadeMaximaVeiculos = parseInt(
      document.getElementById("capacidadeMaxima").value
    );

    if (nome.length > 100) {
      exibirErro(
        "nome",
        "O nome da concessionária não pode exceder 100 caracteres."
      );
      return;
    }
    if (cep.length !== 8 || !/^\d{8}$/.test(cep)) {
      exibirErro("cep", "O CEP deve ter exatamente 8 dígitos.");
      return;
    }
    if (!/^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(telefone)) {
      exibirErro(
        "telefone",
        "O telefone deve ter 10 ou 11 dígitos no formato (XX) XXXX-XXXX ou (XX) XXXXX-XXXX."
      );
      return;
    }
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      exibirErro("email", "Por favor, insira um e-mail válido.");
      return;
    }
    if (capacidadeMaximaVeiculos <= 0) {
      exibirErro(
        "capacidadeMaxima",
        "A capacidade máxima deve ser um valor positivo."
      );
      return;
    }

    const cepFormatado = formatarCEP(cep);
    const novaConcessionaria = {
      nome: nome,
      rua: `${rua}, ${numero}`,
      cidade: cidade,
      estado: estado,
      cep: cepFormatado,
      telefone: telefone,
      email: email,
      CapacidadeMaximaVeiculos: capacidadeMaximaVeiculos,
    };

    try {
      toggleLoading(true); 

      const resposta = await fetch(`${apiUrlConcessionaria}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novaConcessionaria),
      });
      if (!resposta.ok) {
        throw new Error(
          `Erro na API: ${resposta.status} - ${await resposta.text()}`
        );
      }
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
  async function carregarConcessionarias() {
    try {
      toggleLoading(true); 

      const resposta = await fetch(`${apiUrlConcessionaria}`);
      if (!resposta.ok) {
        throw new Error(
          `Erro na API: ${resposta.status} - ${await resposta.text()}`
        );
      }
      const concessionarias = await resposta.json();

      concessionarias.forEach((concessionaria) => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
                    <td>${concessionaria.nome}</td>
                    <td>${concessionaria.rua}, ${concessionaria.cidade} - ${concessionaria.estado}, ${concessionaria.cep}</td>
                    <td>${concessionaria.telefone}</td>
                    <td>${concessionaria.email}</td>
                    <td>${concessionaria.capacidadeMaximaVeiculos}</td>
                    <td>
                        <a href="editar.html?id=${concessionaria.id}" class="btn btn-sm btn-warning">Editar</a>
                        <button class="btn btn-sm btn-danger" onclick="excluirConcessionaria(${concessionaria.id})">Excluir</button>
                    </td>
                `;

        tabelaConcessionarias.appendChild(tr);
      });
    } catch (error) {
      console.error("Erro ao carregar concessionárias:", error);
      exibirSucesso("Erro ao carregar concessionárias: " + error.message);
    } finally {
      toggleLoading(false); 
    }
  }

  carregarConcessionarias();
}

// Excluir concessionária
async function excluirConcessionaria(id) {
  if (confirm("Tem certeza que deseja excluir esta concessionária?")) {
    try {
      toggleLoading(true); 

      const resposta = await fetch(`${apiUrlConcessionaria}/${id}`, {
        method: "DELETE",
      });
      if (!resposta.ok) {
        throw new Error(
          `Erro na API: ${resposta.status} - ${await resposta.text()}`
        );
      }
      exibirSucesso("Concessionária excluída com sucesso!");
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error("Erro ao excluir concessionária:", error);
      exibirSucesso("Erro ao excluir concessionária: " + error.message);
    } finally {
      toggleLoading(false); 
    }
  }
}

function editarConcessionaria(id) {
  window.location.href = `editar.html?id=${id}`;
}

// Editar concessionária
const formEdicaoConcessionaria = document.getElementById(
  "formEdicaoConcessionaria"
);

if (formEdicaoConcessionaria) {
  const params = new URLSearchParams(window.location.search);
  const idConcessionaria = params.get("id");

  if (idConcessionaria) {
    carregarConcessionaria(idConcessionaria);
  }

  async function buscarCEP(cep) {
    try {
      toggleLoading(true); 

      const cepFormatado = formatarCEP(cep);
      if (!/^\d{5}-\d{3}$/.test(cepFormatado)) {
        throw new Error("CEP inválido.");
      }
      const resposta = await fetch(`${apiUrlViaCEP}${cep}/json/`);
      if (!resposta.ok) {
        throw new Error("Erro ao buscar CEP.");
      }
      const dados = await resposta.json();
      if (dados.erro) {
        throw new Error("CEP não encontrado.");
      }

      document.getElementById("rua").value = dados.logradouro || "";
      document.getElementById("cidade").value = dados.localidade || "";
      document.getElementById("estado").value = dados.uf || "";
      document.getElementById("numero").focus();
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
      exibirErro("cep", "CEP inválido ou não encontrado.");
    } finally {
      toggleLoading(false); 
    }
  }

  document.getElementById("cep").addEventListener("blur", function () {
    const cep = this.value.trim();
    if (cep.length === 8 && /^\d{8}$/.test(cep)) {
      buscarCEP(cep);
    }
  });

  document.getElementById("telefone").addEventListener("input", function () {
    this.value = formatarTelefone(this.value);
  });

  async function carregarConcessionaria(id) {
    try {
      toggleLoading(true); 

      const resposta = await fetch(`${apiUrlConcessionaria}/${id}`);
      if (!resposta.ok) {
        throw new Error(
          `Erro na API: ${resposta.status} - ${await resposta.text()}`
        );
      }
      const concessionaria = await resposta.json();

      document.getElementById("nome").value = concessionaria.nome;
      document.getElementById("cep").value = concessionaria.cep.replace(
        "-",
        ""
      );
      const [rua, numero] = concessionaria.rua.split(", ");
      document.getElementById("rua").value = rua || "";
      document.getElementById("numero").value = numero || "";
      document.getElementById("cidade").value = concessionaria.cidade;
      document.getElementById("estado").value = concessionaria.estado;
      document.getElementById("telefone").value = concessionaria.telefone;
      document.getElementById("email").value = concessionaria.email;
      document.getElementById("capacidadeMaxima").value =
        concessionaria.capacidadeMaximaVeiculos;
    } catch (error) {
      console.error("Erro ao carregar concessionária:", error);
      exibirErro(
        "nome",
        "Erro ao carregar dados da concessionária: " + error.message
      );
    } finally {
      toggleLoading(false); 
    }
  }

  formEdicaoConcessionaria.addEventListener("submit", async function (event) {
    event.preventDefault();

    // Limpar mensagens anteriores
    limparMensagens();

    const nome = document.getElementById("nome").value;
    const cep = document.getElementById("cep").value.trim();
    const rua = document.getElementById("rua").value;
    const numero = document.getElementById("numero").value.trim();
    const cidade = document.getElementById("cidade").value;
    const estado = document.getElementById("estado").value.toUpperCase();
    const telefone = document.getElementById("telefone").value;
    const email = document.getElementById("email").value;
    const capacidadeMaximaVeiculos = parseInt(
      document.getElementById("capacidadeMaxima").value
    );

    if (cep.length !== 8 || !/^\d{8}$/.test(cep)) {
      exibirErro("cep", "O CEP deve ter exatamente 8 dígitos.");
      return;
    }
    if (!/^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(telefone)) {
      exibirErro(
        "telefone",
        "O telefone deve ter 10 ou 11 dígitos no formato (XX) XXXX-XXXX ou (XX) XXXXX-XXXX."
      );
      return;
    }

    const cepFormatado = formatarCEP(cep);
    const dados = {
      id: parseInt(idConcessionaria),
      nome: nome,
      rua: `${rua}, ${numero}`,
      cidade: cidade,
      estado: estado,
      cep: cepFormatado,
      telefone: telefone,
      email: email,
      CapacidadeMaximaVeiculos: capacidadeMaximaVeiculos,
    };

    try {
      toggleLoading(true); 

      const resposta = await fetch(
        `${apiUrlConcessionaria}/${idConcessionaria}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dados),
        }
      );

      if (!resposta.ok) {
        throw new Error(
          `Erro na API: ${resposta.status} - ${await resposta.text()}`
        );
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
