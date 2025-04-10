const apiUrlConcessionaria = "http://localhost:5281/api/concessionarias";
const apiUrlFabricante = "http://localhost:5281/api/fabricantes";
const apiUrlVeiculo = "http://localhost:5281/api/veiculos";
const apiUrlVenda = "http://localhost:5281/api/venda";

document.addEventListener("DOMContentLoaded", function () {
  const formCadastroVenda = document.getElementById("formCadastroVenda");
  const tabelaVendas = document.getElementById("tabelaVendas");

  // Funções auxiliares para formatação
  function formatarCPF(cpf) {
    const value = cpf.replace(/\D/g, "");
    return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  }

  function formatarTelefone(telefone) {
    const value = telefone.replace(/\D/g, "");
    return value.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  }

  // Funções para cadastro
  if (formCadastroVenda) {
    const concessionariaSelect = document.getElementById("concessionaria");
    const fabricanteSelect = document.getElementById("fabricante");
    const veiculoSelect = document.getElementById("veiculo");
    const cpfInput = document.getElementById("cpf");
    const telefoneInput = document.getElementById("telefone");

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

    async function carregarConcessionarias() {
      try {
        const resposta = await fetch(apiUrlConcessionaria, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (!resposta.ok) throw new Error("Erro ao carregar concessionárias");
        const concessionarias = await resposta.json();
        concessionarias.forEach((concessionaria) => {
          const option = document.createElement("option");
          option.value = concessionaria.id;
          option.textContent = `${concessionaria.nome} - ${concessionaria.cidade}`;
          concessionariaSelect.appendChild(option);
        });
      } catch (error) {
        console.error("Erro ao carregar concessionárias:", error);
        exibirErro("Erro ao carregar concessionárias.");
      }
    }

    async function carregarFabricantes() {
      try {
        const resposta = await fetch(apiUrlFabricante, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (!resposta.ok) throw new Error("Erro ao carregar fabricantes");
        const fabricantes = await resposta.json();
        fabricantes.forEach((fabricante) => {
          const option = document.createElement("option");
          option.value = fabricante.id;
          option.textContent = fabricante.nome;
          fabricanteSelect.appendChild(option);
        });
      } catch (error) {
        console.error("Erro ao carregar fabricantes:", error);
        exibirErro("Erro ao carregar fabricantes.");
      }
    }

    fabricanteSelect.addEventListener("change", async function () {
      const fabricanteId = parseInt(this.value);
      veiculoSelect.disabled = true;
      veiculoSelect.innerHTML = '<option value="">Selecione um veículo</option>';

      if (fabricanteId) {
        try {
          const resposta = await fetch(`${apiUrlVeiculo}/por-fabricante/${fabricanteId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          });
          if (!resposta.ok) throw new Error("Erro ao carregar veículos");
          const veiculos = await resposta.json();
          veiculos.forEach((veiculo) => {
            const option = document.createElement("option");
            option.value = veiculo.id;
            option.textContent = veiculo.modelo;
            option.dataset.preco = veiculo.preco;
            veiculoSelect.appendChild(option);
          });
          veiculoSelect.disabled = false;
        } catch (error) {
          console.error("Erro ao carregar veículos:", error);
          exibirErro("Erro ao carregar veículos.");
        }
      }
    });

    formCadastroVenda.addEventListener("submit", async function (e) {
      e.preventDefault();

      const concessionariaId = parseInt(concessionariaSelect.value);
      const fabricanteId = parseInt(fabricanteSelect.value);
      const veiculoId = parseInt(veiculoSelect.value);
      const nomeCliente = document.getElementById("nomeCliente").value.trim();
      const cpf = cpfInput.value.replace(/\D/g, "");
      const telefone = telefoneInput.value.replace(/\D/g, "");
      const dataVenda = document.getElementById("dataVenda").value;
      const precoVenda = parseFloat(document.getElementById("precoVenda").value);
      const precoVeiculo = parseFloat(veiculoSelect.selectedOptions[0].dataset.preco);

      const hoje = new Date().toISOString().split("T")[0];

      if (!validarCPF(cpf)) {
        exibirErro("CPF inválido!");
        return;
      }
      if (dataVenda > hoje) {
        exibirErro("A data da venda não pode ser futura!");
        return;
      }
      if (precoVenda > precoVeiculo) {
        exibirErro("O preço de venda não pode ser maior que o preço do veículo!");
        return;
      }

      
      const novaVenda = {
          concessionariaId,
          veiculoId,
          fabricanteId,
          nomeCliente,
          cpf,
          telefone,
          dataVenda,
          precoVenda,
          protocolo: "",
        };
        
        console.log('aqio', novaVenda)
      try {
        const resposta = await fetch(apiUrlVenda, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(novaVenda),
        });

        if (resposta.ok) {
          const result = await resposta.json();
          exibirErro(`Venda cadastrada com sucesso! Protocolo: ${result.protocolo}`);
          window.location.href = "listar.html";
        } else if (resposta.status === 409) {
          exibirErro("CPF já registrado para outra venda!");
        } else {
          const erro = await resposta.text();
          throw new Error(`Erro na API: ${resposta.status} - ${erro}`);
        }
      } catch (error) {
        console.error("Erro ao cadastrar venda:", error);
        exibirErro("Erro ao cadastrar venda: " + error.message);
      }
    });

    carregarConcessionarias();
    carregarFabricantes();
  }

  function formatarPreco(valor) {
    return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  
  // Função para listagem
  if (tabelaVendas) {
    async function carregarVendas() {
      try {
        const resposta = await fetch(apiUrlVenda, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (!resposta.ok) throw new Error("Erro ao carregar vendas");
        const vendas = await resposta.json();

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
            <td>R$ ${formatarPreco(venda.precoVenda)}</td>
            <td>${venda.protocolo}</td>
          `;
          tabelaVendas.appendChild(tr);
        });
      } catch (error) {
        console.error("Erro ao carregar vendas:", error);
        exibirErro("Erro ao carregar vendas.");
      }
    }

    carregarVendas();
  }
});

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