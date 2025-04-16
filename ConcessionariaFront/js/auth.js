// js/auth.js

// Função para gerar um UUID simples (substitui Guid.NewGuid do backend)
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Função para verificar autenticação
function verificarAutenticacao() {
  const user = localStorage.getItem("currentUser");
  if (!user) {
    window.location.href = "login.html";
    return null;
  }
  return JSON.parse(user);
}

// Função para limpar mensagens de erro
function limparErros(prefixo) {
  const emailError = document.getElementById(`${prefixo}emailError`);
  const senhaError = document.getElementById(`${prefixo}senhaError`);
  if (emailError) {
    emailError.textContent = "";
    emailError.style.display = "none";
  }
  if (senhaError) {
    senhaError.textContent = "";
    senhaError.style.display = "none";
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

// Manipulação de eventos de formulário
document.addEventListener("DOMContentLoaded", function () {
  // Login (apenas na página login.html)
  if (window.location.pathname.endsWith("login.html")) {
    const formLogin = document.getElementById("formLogin");
    if (formLogin) {
      formLogin.addEventListener("submit", function (event) {
        event.preventDefault();

        // Limpar mensagens de erro anteriores
        limparErros("");

        // Mostrar o loading
        toggleLoading(true);

        const email = document.getElementById("email").value.trim();
        const senha = document.getElementById("senha").value.trim();

        // Validação no front-end
        if (!email) {
          exibirErro("email", "Por favor, insira um e-mail.");
          toggleLoading(false);
          return;
        }
        if (!senha) {
          exibirErro("senha", "Por favor, insira uma senha.");
          toggleLoading(false);
          return;
        }

        // Obter os dados do localStorage
        const data = getData();
        const user = data.users.find(u => u.email === email && u.senha === senha);

        try {
          if (!user) {
            throw new Error("E-mail ou senha incorretos.");
          }

          // Armazenar o usuário logado, nome e tipo no localStorage
          localStorage.setItem("currentUser", JSON.stringify(user));
          localStorage.setItem("nome", user.nome || "Usuário");
          localStorage.setItem("tipo", user.tipo || "Desconhecido");
          window.location.href = "index.html";
        } catch (error) {
          console.error("Erro ao fazer login:", error.message);
          exibirErro("email", error.message);
        } finally {
          toggleLoading(false);
        }
      });
    } else {
      console.log("Formulário de login (formLogin) não encontrado na página de login.");
    }
  }

  // Registro (apenas na página register.html)
  if (window.location.pathname.endsWith("register.html")) {
    const formRegister = document.getElementById("formRegister");
    if (formRegister) {
      formRegister.addEventListener("submit", function (event) {
        event.preventDefault();

        // Limpar mensagens de erro anteriores
        limparErros("");

        const nome = document.getElementById("nome").value.trim();
        const telefone = document.getElementById("telefone").value.trim();
        const email = document.getElementById("email").value.trim();
        const senha = document.getElementById("senha").value.trim();
        const tipo = document.getElementById("tipo").value.trim();

        // Validação no front-end
        if (!nome) {
          exibirErro("nome", "Por favor, insira seu nome.");
          return;
        }
        if (!telefone) {
          exibirErro("telefone", "Por favor, insira seu telefone.");
          return;
        }
        if (!email) {
          exibirErro("email", "Por favor, insira um e-mail.");
          return;
        }
        if (!senha) {
          exibirErro("senha", "Por favor, insira uma senha.");
          return;
        }

        // Obter os dados do localStorage
        const data = getData();

        // Verificar se o email já existe
        if (data.users.some(u => u.email === email)) {
          exibirErro("email", "Este e-mail já está registrado.");
          return;
        }

        // Criar novo usuário
        const newUser = {
          id: generateUUID(),
          email: email,
          senha: senha,
          nome: nome,
          telefone: telefone,
          tipo: tipo || "Vendedor",
        };

        // Adicionar o novo usuário aos dados
        data.users.push(newUser);
        saveData(data);

        alert("Usuário registrado com sucesso! Faça login para continuar.");
        window.location.href = "login.html";
      });
    } else {
      console.log("Formulário de registro (formRegister) não encontrado na página de registro.");
    }
  }
});

// Função de logout (pode ser chamada em qualquer página)
function logout() {
  localStorage.removeItem("currentUser");
  localStorage.removeItem("nome");
  localStorage.removeItem("tipo");
  window.location.href = "login.html";
}