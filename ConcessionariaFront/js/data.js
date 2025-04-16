const initialData = {
    // Usuários (users)
    users: [
      {
        id: "294064fd-43ef-40f3-b003-ca955c124570",
        email: "wictorlopes258@gmail.com",
        senha: "Teste@123",
        nome: "Wictor Lopes",
        telefone: "(81) 99953-9450",
        tipo: "Administrador",
      },
      {
        id: "5a39c18a-bdd8-4ea8-87a9-ade40a3eb8ed",
        email: "gerente@teste.com",
        senha: "Teste@123",
        nome: "Teste Gerente",
        telefone: "(81) 99953-9430",
        tipo: "Gerente",
      },
      {
        id: "65bf0654-d725-4420-8d11-5045a394866d",
        email: "adm@teste.com",
        senha: "Teste@123",
        nome: "Teste Administrador",
        telefone: "(81) 98833-5024",
        tipo: "Administrador",
      },
      {
        id: "902f2b54-87d9-4daf-8818-a4531be63d5b",
        email: "vendedor@teste.com",
        senha: "Teste@123",
        nome: "Teste Vendedor",
        telefone: "(81) 99953-9400",
        tipo: "Vendedor",
      },
    ],
  
    // Concessionárias
    concessionarias: [
      { id: 1, nome: "AutoMais Motors", rua: "Av. Paulista, 1000", cidade: "São Paulo", estado: "SP", cep: "01310-100", telefone: "(11) 99999-1000", email: "contato@automais.com.br", capacidadeMaximaVeiculos: 200, excluido: false },
      { id: 2, nome: "TopCar Veículos", rua: "Rua das Laranjeiras, 500", cidade: "Rio de Janeiro", estado: "RJ", cep: "22240-006", telefone: "(21) 98888-2000", email: "vendas@topcar.com.br", capacidadeMaximaVeiculos: 150, excluido: false },
      { id: 3, nome: "Mega Motors", rua: "Av. Amazonas, 3000", cidade: "Belo Horizonte", estado: "MG", cep: "30180-001", telefone: "(31) 97777-3000", email: "info@megamotors.com.br", capacidadeMaximaVeiculos: 180, excluido: false },
      { id: 4, nome: "ViaCar Multimarcas", rua: "Rua XV de Novembro, 800", cidade: "Curitiba", estado: "PR", cep: "80020-310", telefone: "(41) 96666-4000", email: "contato@viacar.com.br", capacidadeMaximaVeiculos: 120, excluido: false },
      { id: 5, nome: "Recife Motors", rua: "Av. Boa Viagem, 1234", cidade: "Recife", estado: "PE", cep: "51020-000", telefone: "(81) 99999-1234", email: "contato@recifemotors.com", capacidadeMaximaVeiculos: 120, excluido: false },
      { id: 6, nome: "Petrolina Veículos", rua: "Rua das Laranjeiras, 567", cidade: "Petrolina", estado: "PE", cep: "56300-000", telefone: "(87) 98888-5678", email: "vendas@petrolinaveiculos.com", capacidadeMaximaVeiculos: 80, excluido: false },
    ],
  
    // Fabricantes
    fabricantes: [
      { id: 1, nome: "Toyota", paisOrigem: "Japão", anoFundacao: 1937, website: "https://www.toyota-global.com", excluido: false },
      { id: 2, nome: "Honda", paisOrigem: "Japão", anoFundacao: 1948, website: "https://www.honda.com", excluido: false },
      { id: 3, nome: "Ford", paisOrigem: "Estados Unidos", anoFundacao: 1903, website: "https://www.ford.com", excluido: false },
      { id: 4, nome: "Chevrolet", paisOrigem: "Estados Unidos", anoFundacao: 1911, website: "https://www.chevrolet.com", excluido: false },
      { id: 5, nome: "Volkswagen", paisOrigem: "Alemanha", anoFundacao: 1937, website: "https://www.vw.com", excluido: false },
      { id: 6, nome: "Hyundai", paisOrigem: "Coreia do Sul", anoFundacao: 1967, website: "https://www.hyundai.com", excluido: false },
      { id: 7, nome: "Jeep", paisOrigem: "Estados Unidos", anoFundacao: 1941, website: "https://www.jeep.com", excluido: false },
      { id: 8, nome: "Iveco", paisOrigem: "Itália", anoFundacao: 1975, website: "https://www.iveco.com", excluido: false },
      { id: 9, nome: "Renault", paisOrigem: "França", anoFundacao: 1899, website: "https://www.renault.com", excluido: false },
      { id: 10, nome: "Ducati", paisOrigem: "Itália", anoFundacao: 1926, website: "https://www.ducati.com", excluido: false },
      { id: 11, nome: "Segway", paisOrigem: "Estados Unidos", anoFundacao: 1999, website: "https://www.segway.com", excluido: false },
    ],
  
    // Veículos (tipoVeiculo: 0=Carro, 1=Moto, 2=Caminhão/Caminhonete, 3=Ônibus, 4=Patinete)
    veiculos: [
      { id: 1, modelo: "Corolla Altis", anoFabricacao: 2022, preco: 139900.00, fabricanteId: 1, tipoVeiculo: 0, descricao: "Sedan Premium da Toyota", excluido: false },
      { id: 2, modelo: "Civic Touring", anoFabricacao: 2022, preco: 145900.00, fabricanteId: 2, tipoVeiculo: 0, descricao: "Sedan esportivo da Honda", excluido: false },
      { id: 3, modelo: "Ranger XLT", anoFabricacao: 2021, preco: 220000.00, fabricanteId: 3, tipoVeiculo: 2, descricao: "Caminhonete robusta da Ford", excluido: false },
      { id: 4, modelo: "Onix LTZ", anoFabricacao: 2023, preco: 89900.00, fabricanteId: 4, tipoVeiculo: 0, descricao: "Compacto econômico da Chevrolet", excluido: false },
      { id: 5, modelo: "T-Cross Highline", anoFabricacao: 2022, preco: 154900.00, fabricanteId: 5, tipoVeiculo: 0, descricao: "SUV premium da Volkswagen", excluido: false },
      { id: 6, modelo: "Hilux SRV", anoFabricacao: 2021, preco: 235000.00, fabricanteId: 1, tipoVeiculo: 2, descricao: "Caminhonete resistente da Toyota", excluido: false },
      { id: 7, modelo: "Fit EXL", anoFabricacao: 2020, preco: 89900.00, fabricanteId: 2, tipoVeiculo: 0, descricao: "Hatch versátil da Honda", excluido: false },
      { id: 8, modelo: "HB20", anoFabricacao: 2023, preco: 75000.00, fabricanteId: 6, tipoVeiculo: 0, descricao: "Carro compacto da Hyundai", excluido: false },
      { id: 9, modelo: "CG 160", anoFabricacao: 2022, preco: 14000.00, fabricanteId: 2, tipoVeiculo: 1, descricao: "Moto Honda de entrada", excluido: false },
      { id: 10, modelo: "Actros 2651", anoFabricacao: 2024, preco: 530000.00, fabricanteId: 3, tipoVeiculo: 2, descricao: "Caminhão Mercedes-Benz para transporte pesado", excluido: false },
      { id: 11, modelo: "Volare Attack 8", anoFabricacao: 2023, preco: 350000.00, fabricanteId: 4, tipoVeiculo: 3, descricao: "Ônibus pequeno da Volare", excluido: false },
      { id: 12, modelo: "Patinete Elétrico X1", anoFabricacao: 2024, preco: 4500.00, fabricanteId: 5, tipoVeiculo: 4, descricao: "Patinete elétrico para mobilidade urbana", excluido: false },
      { id: 13, modelo: "Compass Limited", anoFabricacao: 2023, preco: 179900.00, fabricanteId: 7, tipoVeiculo: 0, descricao: "SUV elegante da Jeep", excluido: false },
      { id: 14, modelo: "Strada Volcano", anoFabricacao: 2022, preco: 115000.00, fabricanteId: 4, tipoVeiculo: 2, descricao: "Picape compacta da Chevrolet", excluido: false },
      { id: 15, modelo: "Kona Electric", anoFabricacao: 2023, preco: 210000.00, fabricanteId: 6, tipoVeiculo: 0, descricao: "SUV elétrico da Hyundai", excluido: false },
      { id: 16, modelo: "EcoSport Titanium", anoFabricacao: 2021, preco: 105000.00, fabricanteId: 3, tipoVeiculo: 0, descricao: "SUV compacto da Ford", excluido: false },
      { id: 17, modelo: "HR-V EXL", anoFabricacao: 2023, preco: 162000.00, fabricanteId: 2, tipoVeiculo: 0, descricao: "SUV intermediário da Honda", excluido: false },
      { id: 18, modelo: "Golf GTI", anoFabricacao: 2022, preco: 199900.00, fabricanteId: 5, tipoVeiculo: 0, descricao: "Hatch esportivo da Volkswagen", excluido: false },
      { id: 19, modelo: "Master Furgão", anoFabricacao: 2022, preco: 170000.00, fabricanteId: 9, tipoVeiculo: 2, descricao: "Furgão utilitário da Renault", excluido: false },
      { id: 20, modelo: "Monster 1200 S", anoFabricacao: 2023, preco: 88000.00, fabricanteId: 10, tipoVeiculo: 1, descricao: "Moto esportiva naked da Ducati", excluido: false },
      { id: 21, modelo: "Compass Trailhawk", anoFabricacao: 2024, preco: 209900.00, fabricanteId: 7, tipoVeiculo: 0, descricao: "SUV off-road da Jeep", excluido: false },
      { id: 22, modelo: "Daily 35S14", anoFabricacao: 2023, preco: 220000.00, fabricanteId: 8, tipoVeiculo: 2, descricao: "Furgão robusto da Iveco", excluido: false },
      { id: 23, modelo: "Creta Ultimate", anoFabricacao: 2024, preco: 175000.00, fabricanteId: 6, tipoVeiculo: 0, descricao: "SUV premium da Hyundai", excluido: false },
      { id: 24, modelo: "Segway Ninebot Max G30", anoFabricacao: 2024, preco: 6800.00, fabricanteId: 11, tipoVeiculo: 4, descricao: "Patinete elétrico de longa autonomia", excluido: false },
      { id: 25, modelo: "Toro Ultra", anoFabricacao: 2022, preco: 190000.00, fabricanteId: 4, tipoVeiculo: 2, descricao: "Picape média da Chevrolet", excluido: false },
      { id: 26, modelo: "Nivus Highline", anoFabricacao: 2023, preco: 142000.00, fabricanteId: 5, tipoVeiculo: 0, descricao: "SUV urbano da Volkswagen", excluido: false },
      { id: 27, modelo: "Renegade Moab", anoFabricacao: 2021, preco: 139000.00, fabricanteId: 7, tipoVeiculo: 0, descricao: "SUV 4x4 compacto da Jeep", excluido: false },
    ],
  
    // Vendas
    vendas: [
      { id: 1, veiculoId: 1, concessionariaId: 1, precoVenda: 138000.00, dataVenda: "2024-02-15", cpf: "12345678901", fabricanteId: 1, nomeCliente: "João Silva", protocolo: "PROTOC-20240215-001", telefone: "(11) 90000-0001" },
      { id: 2, veiculoId: 2, concessionariaId: 1, precoVenda: 144000.00, dataVenda: "2024-03-10", cpf: "98765432100", fabricanteId: 2, nomeCliente: "Maria Souza", protocolo: "PROTOC-20240310-002", telefone: "(11) 90000-0002" },
      { id: 3, veiculoId: 3, concessionariaId: 2, precoVenda: 218000.00, dataVenda: "2024-01-20", cpf: "11122233345", fabricanteId: 3, nomeCliente: "Carlos Eduardo", protocolo: "PROTOC-20240120-003", telefone: "(21) 90000-0003" },
      { id: 4, veiculoId: 4, concessionariaId: 3, precoVenda: 88000.00, dataVenda: "2025-01-05", cpf: "55566677788", fabricanteId: 4, nomeCliente: "Patrícia Lima", protocolo: "PROTOC-20250105-004", telefone: "(31) 90000-0004" },
      { id: 5, veiculoId: 5, concessionariaId: 4, precoVenda: 152000.00, dataVenda: "2025-02-28", cpf: "99988877766", fabricanteId: 5, nomeCliente: "Fernanda Costa", protocolo: "PROTOC-20250228-005", telefone: "(41) 90000-0005" },
      { id: 6, veiculoId: 6, concessionariaId: 2, precoVenda: 233000.00, dataVenda: "2024-12-01", cpf: "44455566677", fabricanteId: 1, nomeCliente: "Ricardo Borges", protocolo: "PROTOC-20241201-006", telefone: "(21) 90000-0006" },
      { id: 7, veiculoId: 7, concessionariaId: 3, precoVenda: 87000.00, dataVenda: "2025-03-10", cpf: "22233344455", fabricanteId: 2, nomeCliente: "Tatiane Souza", protocolo: "PROTOC-20250310-007", telefone: "(31) 90000-0007" },
      { id: 8, veiculoId: 8, concessionariaId: 1, precoVenda: 73000.00, dataVenda: "2023-03-15", cpf: "12345678900", fabricanteId: 6, nomeCliente: "João Silva", protocolo: "PRT20230315001", telefone: "(81) 98888-0001" },
      { id: 9, veiculoId: 9, concessionariaId: 2, precoVenda: 13500.00, dataVenda: "2023-06-20", cpf: "98765432101", fabricanteId: 2, nomeCliente: "Maria Oliveira", protocolo: "PRT20230620002", telefone: "(81) 97777-0002" },
      { id: 10, veiculoId: 10, concessionariaId: 3, precoVenda: 525000.00, dataVenda: "2023-09-10", cpf: "11122233344", fabricanteId: 3, nomeCliente: "Carlos Souza", protocolo: "PRT20230910003", telefone: "(31) 97777-0003" },
      { id: 11, veiculoId: 1, concessionariaId: 3, precoVenda: 132000.00, dataVenda: "2025-02-15", cpf: "12345678944", fabricanteId: 1, nomeCliente: "João Bosco", protocolo: "PROTOC-20240215-001", telefone: "(11) 90000-0001" },
      { id: 12, veiculoId: 1, concessionariaId: 1, precoVenda: 132000.00, dataVenda: "2025-03-15", cpf: "12345678324", fabricanteId: 1, nomeCliente: "Paulo Bosco", protocolo: "PROTOC-20240215-003", telefone: "(11) 90000-0001" },
      { id: 33, veiculoId: 13, concessionariaId: 2, precoVenda: 157000.00, dataVenda: "2025-04-05", cpf: "32165498700", fabricanteId: 7, nomeCliente: "Ana Paula", protocolo: "PROTOC-20250405-008", telefone: "(21) 98888-0008" },
      { id: 34, veiculoId: 14, concessionariaId: 1, precoVenda: 92000.00, dataVenda: "2025-04-06", cpf: "78945612300", fabricanteId: 4, nomeCliente: "Bruno Martins", protocolo: "PROTOC-20250406-009", telefone: "(11) 97777-0009" },
      { id: 35, veiculoId: 15, concessionariaId: 4, precoVenda: 285000.00, dataVenda: "2025-04-07", cpf: "45678912300", fabricanteId: 6, nomeCliente: "Carla Mendes", protocolo: "PROTOC-20250407-010", telefone: "(41) 96666-0010" },
    ],
  };
  
  // Inicializa os dados no localStorage
  function initializeData() {
    if (!localStorage.getItem("concessionariaData")) {
      localStorage.setItem("concessionariaData", JSON.stringify(initialData));
    }
  }
  
  // Funções para manipular dados
  function getData() {
    return JSON.parse(localStorage.getItem("concessionariaData")) || initialData;
  }
  
  function saveData(data) {
    localStorage.setItem("concessionariaData", JSON.stringify(data));
  }
  
  // Função para obter o próximo ID de uma entidade
  function getNextId(entity) {
    const data = getData();
    const items = data[entity] || [];
    return items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;
  }