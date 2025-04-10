const apiUrlAuth = "https://concessionaria-back-g0fhh0a4czachmba.brazilsouth-01.azurewebsites.net/api/auth";

// Função para decodificar o token JWT
function decodeJWT(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(function (c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                })
                .join('')
        );
        const decoded = JSON.parse(jsonPayload);
        return decoded;
    } catch (error) {
        console.error("Erro ao decodificar o token:", error);
        return null;
    }
}

// Função para verificar autenticação
function verificarAutenticacao() {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "login.html";
        return null;
    }
    return token;
}

// Função de login (apenas na página login.html)
document.addEventListener("DOMContentLoaded", function () {
    // Verificar se estamos na página de login
    if (window.location.pathname.endsWith("login.html")) {
        const formLogin = document.getElementById("formLogin");
        if (formLogin) {
            formLogin.addEventListener("submit", async function (event) {
                event.preventDefault();

                const email = document.getElementById("email").value.trim();
                const senha = document.getElementById("senha").value.trim();

                const loginData = { email, senha };

                try {
                    const resposta = await fetch(`${apiUrlAuth}/login`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(loginData),
                    });

                    if (!resposta.ok) {
                        const erro = await resposta.json();
                        console.error("Erro na requisição de login:", erro);
                        throw new Error(erro.message || "Credenciais inválidas.");
                    }

                    const data = await resposta.json();

                    // Armazenar o token, nome e tipo diretamente da resposta da API
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("nome", data.nome || "Usuário");
                    localStorage.setItem("tipo", data.tipo || "Desconhecido");
                    window.location.href = "/";
                } catch (error) {
                    console.error("Erro ao fazer login:", error.message);
                    const errorDiv = document.getElementById("emailError");
                    if (errorDiv) {
                        errorDiv.textContent = error.message;
                        errorDiv.style.display = "block";
                    }
                }
            });
        } else {
            console.log("Formulário de login (formLogin) não encontrado na página de login.");
        }
    }
});