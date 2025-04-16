// js/usuario.js

document.addEventListener("DOMContentLoaded", function () {
    // Função para limpar mensagens
    function limparMensagens() {
      const campos = ["nome", "telefone", "email", "senha", "tipo"];
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
      telefone = telefone.replace(/\D/g, "");
      if (telefone.length <= 10) {
        return telefone.replace(/(\d{2})(\d{0,4})(\d{0,4})/, "($1) $2-$3").trim();
      } else {
        return telefone.replace(/(\d{2})(\d{0,5})(\d{0,4})/, "($1) $2-$3").trim();
      }
    }
  
    // Função para validar email
    function validarEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
  
    // Listar usuários
    const tabelaUsuarios = document.getElementById("tabela-usuarios");
    if (tabelaUsuarios) {
      function carregarUsuarios() {
        try {
          toggleLoading(true);
          const data = getData();
          const users = data.users || [];
          const tipoUsuarioLogado = localStorage.getItem("tipo");
          tabelaUsuarios.innerHTML = "";
  
          if (!Array.isArray(users)) {
            throw new Error("Dados de usuários inválidos no localStorage.");
          }
  
          if (users.length === 0) {
            tabelaUsuarios.innerHTML = `
              <tr>
                <td colspan="5" class="text-center">Nenhum usuário cadastrado.</td>
              </tr>
            `;
            return;
          }
  
          users.forEach((usuario) => {
            let actions = "";
            if (tipoUsuarioLogado === "Administrador") {
              actions = `
                <button class="btn btn-warning btn-sm editar-usuario" data-email="${usuario.email}">Editar</button>
                <button class="btn btn-danger btn-sm excluir-usuario" data-email="${usuario.email}">Excluir</button>
              `;
            }
            tabelaUsuarios.innerHTML += `
              <tr>
                <td>${usuario.nome}</td>
                <td>${formatarTelefone(usuario.telefone)}</td>
                <td>${usuario.email}</td>
                <td>${usuario.tipo}</td>
                <td>${actions}</td>
              </tr>
            `;
          });
  
          // Adicionar eventos aos botões apenas para Administrador
          if (tipoUsuarioLogado === "Administrador") {
            document.querySelectorAll(".editar-usuario").forEach((button) => {
              button.addEventListener("click", function () {
                const email = this.getAttribute("data-email");
                window.location.href = `editar.html?email=${encodeURIComponent(email)}`;
              });
            });
  
            document.querySelectorAll(".excluir-usuario").forEach((button) => {
              button.addEventListener("click", function () {
                const email = this.getAttribute("data-email");
                excluirUsuario(email);
              });
            });
          }
        } catch (error) {
          console.error("Erro ao carregar usuários:", error);
          tabelaUsuarios.innerHTML = `
            <tr>
              <td colspan="5" class="text-center text-danger">Erro ao carregar usuários: ${error.message}</td>
            </tr>
          `;
        } finally {
          toggleLoading(false);
        }
      }
  
      carregarUsuarios();
    }
  
    // Cadastrar novo usuário
    const formCadastro = document.getElementById("formCadastrarUsuario");
    if (formCadastro) {
      const telefoneInput = document.getElementById("telefone");
      const tipoUsuarioLogado = localStorage.getItem("tipo");
      const selectTipo = document.getElementById("tipo");
  
      // Configurar opções de tipo com base no usuário logado
      if (tipoUsuarioLogado === "Administrador") {
        selectTipo.innerHTML = `
          <option value="Administrador">Administrador</option>
          <option value="Gerente">Gerente</option>
          <option value="Vendedor">Vendedor</option>
        `;
      } else if (tipoUsuarioLogado === "Gerente") {
        selectTipo.innerHTML = `
          <option value="Gerente">Gerente</option>
          <option value="Vendedor">Vendedor</option>
        `;
      }
  
      // Máscara para telefone
      telefoneInput.addEventListener("input", function () {
        this.value = formatarTelefone(this.value);
      });
  
      formCadastro.addEventListener("submit", function (e) {
        e.preventDefault();
  
        // Limpar mensagens anteriores
        limparMensagens();
  
        const nome = document.getElementById("nome").value.trim();
        const telefone = document.getElementById("telefone").value.replace(/\D/g, "");
        const email = document.getElementById("email").value.trim();
        const senha = document.getElementById("senha").value.trim();
        const tipo = document.getElementById("tipo").value;
  
        // Validações
        if (nome.length < 3 || nome.length > 100) {
          exibirErro("nome", "O nome deve ter entre 3 e 100 caracteres.");
          return;
        }
  
        if (telefone.length < 10 || telefone.length > 11) {
          exibirErro("telefone", "O telefone deve ter 10 ou 11 dígitos.");
          return;
        }
  
        if (!validarEmail(email)) {
          exibirErro("email", "Por favor, insira um e-mail válido.");
          return;
        }
  
        if (senha.length < 6) {
          exibirErro("senha", "A senha deve ter pelo menos 6 caracteres.");
          return;
        }
  
        if (!["Administrador", "Gerente", "Vendedor"].includes(tipo)) {
          exibirErro("tipo", "Selecione um tipo de usuário válido.");
          return;
        }
  
        // Verificar permissões para tipo
        if (tipoUsuarioLogado === "Gerente" && tipo === "Administrador") {
          exibirErro("tipo", "Gerentes não podem cadastrar Administradores.");
          return;
        }
  
        try {
          toggleLoading(true);
          const data = getData();
  
          // Verificar se o email já está em uso
          if (data.users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
            exibirErro("email", "Este e-mail já está em uso.");
            return;
          }
  
          const novoUsuario = {
            id: generateUUID(), // Função do auth.js
            nome,
            telefone,
            email,
            senha, // No ambiente real, a senha deve ser criptografada
            tipo,
          };
  
          // Adicionar ao localStorage
          data.users.push(novoUsuario);
          saveData(data);
  
          exibirSucesso("Usuário cadastrado com sucesso!");
          setTimeout(() => {
            window.location.href = "listar.html";
          }, 1500);
        } catch (error) {
          console.error("Erro ao cadastrar usuário:", error);
          exibirErro("nome", "Erro ao cadastrar usuário: " + error.message);
        } finally {
          toggleLoading(false);
        }
      });
    }
  
    // Editar usuário
    const formEdicao = document.getElementById("formEditarUsuario");
    if (formEdicao) {
      const telefoneInput = document.getElementById("telefone");
  
      // Máscara para telefone
      telefoneInput.addEventListener("input", function () {
        this.value = formatarTelefone(this.value);
      });
  
      function carregarUsuarioParaEditar() {
        const params = new URLSearchParams(window.location.search);
        const email = params.get("email");
        if (!email) {
          exibirErro("nome", "Nenhum usuário selecionado para edição.");
          setTimeout(() => {
            window.location.href = "listar.html";
          }, 1500);
          return;
        }
  
        try {
          toggleLoading(true);
          const data = getData();
          const usuario = data.users.find((u) => u.email === email);
  
          if (!usuario) {
            exibirErro("nome", "Usuário não encontrado.");
            setTimeout(() => {
              window.location.href = "listar.html";
            }, 1500);
            return;
          }
  
          document.getElementById("nome").value = usuario.nome || "";
          document.getElementById("telefone").value = formatarTelefone(usuario.telefone) || "";
          document.getElementById("email").value = usuario.email || "";
          document.getElementById("tipo").value = usuario.tipo || "";
        } catch (error) {
          console.error("Erro ao carregar usuário:", error);
          exibirErro("nome", "Erro ao carregar usuário.");
        } finally {
          toggleLoading(false);
        }
      }
  
      carregarUsuarioParaEditar();
  
      formEdicao.addEventListener("submit", function (e) {
        e.preventDefault();
  
        // Limpar mensagens anteriores
        limparMensagens();
  
        const nome = document.getElementById("nome").value.trim();
        const telefone = document.getElementById("telefone").value.replace(/\D/g, "");
        const novoEmail = document.getElementById("email").value.trim();
        const tipo = document.getElementById("tipo").value;
  
        // Validações
        if (nome.length < 3 || nome.length > 100) {
          exibirErro("nome", "O nome deve ter entre 3 e 100 caracteres.");
          return;
        }
  
        if (telefone.length < 10 || telefone.length > 11) {
          exibirErro("telefone", "O telefone deve ter 10 ou 11 dígitos.");
          return;
        }
  
        if (!validarEmail(novoEmail)) {
          exibirErro("email", "Por favor, insira um e-mail válido.");
          return;
        }
  
        if (!["Administrador", "Gerente", "Vendedor"].includes(tipo)) {
          exibirErro("tipo", "Selecione um tipo de usuário válido.");
          return;
        }
  
        try {
          toggleLoading(true);
          const data = getData();
          const params = new URLSearchParams(window.location.search);
          const email = params.get("email");
  
          // Verificar se o novo email já está em uso por outro usuário
          const outrosUsuarios = data.users.filter((u) => u.email !== email);
          if (outrosUsuarios.some((u) => u.email.toLowerCase() === novoEmail.toLowerCase())) {
            exibirErro("email", "Este e-mail já está em uso por outro usuário.");
            return;
          }
  
          // Atualizar o usuário
          const index = data.users.findIndex((u) => u.email === email);
          if (index !== -1) {
            data.users[index] = {
              ...data.users[index],
              nome,
              telefone,
              email: novoEmail,
              tipo,
            };
            saveData(data);
  
            // Atualizar email no localStorage se for o usuário logado
            const usuarioLogado = JSON.parse(localStorage.getItem("usuario"));
            if (usuarioLogado && usuarioLogado.email === email) {
              usuarioLogado.email = novoEmail;
              usuarioLogado.nome = nome;
              usuarioLogado.tipo = tipo;
              localStorage.setItem("usuario", JSON.stringify(usuarioLogado));
            }
          }
  
          exibirSucesso("Usuário atualizado com sucesso!");
          setTimeout(() => {
            window.location.href = "listar.html";
          }, 1500);
        } catch (error) {
          console.error("Erro ao atualizar usuário:", error);
          exibirErro("nome", "Erro ao atualizar usuário: " + error.message);
        } finally {
          toggleLoading(false);
        }
      });
    }
  });
  
  // Função para exclusão
  function excluirUsuario(email) {
    if (confirm(`Tem certeza que deseja excluir o usuário ${email}?`)) {
      try {
        toggleLoading(true);
        const data = getData();
  
        // Verificar se o usuário é o último administrador
        const administradores = data.users.filter((u) => u.tipo === "Administrador");
        const usuario = data.users.find((u) => u.email === email);
        if (usuario.tipo === "Administrador" && administradores.length <= 1) {
          alert("Não é possível excluir o último administrador do sistema.");
          return;
        }
  
        // Verificar se o usuário está associado a alguma venda
        if (data.vendas.some((venda) => venda.vendedorEmail === email)) {
          alert("Não é possível excluir este usuário, pois ele está associado a uma ou mais vendas.");
          return;
        }
  
        // Não permitir que o usuário exclua a si mesmo
        const usuarioLogado = JSON.parse(localStorage.getItem("usuario"));
        if (usuarioLogado && usuarioLogado.email === email) {
          alert("Você não pode excluir sua própria conta enquanto estiver logado.");
          return;
        }
  
        // Remover o usuário
        data.users = data.users.filter((u) => u.email !== email);
        saveData(data);
  
        const tabelaUsuarios = document.getElementById("tabela-usuarios");
        if (tabelaUsuarios) {
          tabelaUsuarios.innerHTML = `
            <tr>
              <td colspan="5" class="text-center text-success">Usuário excluído com sucesso!</td>
            </tr>
          `;
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        }
      } catch (error) {
        console.error("Erro ao excluir usuário:", error);
        const tabelaUsuarios = document.getElementById("tabela-usuarios");
        if (tabelaUsuarios) {
          tabelaUsuarios.innerHTML = `
            <tr>
              <td colspan="5" class="text-center text-danger">Erro ao excluir usuário: ${error.message}</td>
            </tr>
          `;
        }
      } finally {
        toggleLoading(false);
      }
    }
  }