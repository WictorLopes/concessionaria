# Concessionária Web

Aplicação web para gerenciamento de vendas de veículos em concessionárias. Permite cadastrar e listar vendas, com integração entre concessionárias, fabricantes e veículos.

## Tecnologias Utilizadas

### Frontend(rodando pelo Render(https://render.com/):
- HTML5
- JavaScript (vanilla)
- Bootstrap

### Backend(rodando pela Azure(azure.microsoft.com):
- ASP.NET
- Entity Framework Core (SQL Server)
- Identity para autenticação com JWT
- Banco de Dados: SQL Server

## Funcionalidades

- **Cadastro Geral**: Permite registrar entidades principais do sistema:
  - **Vendas**: Informações como concessionária, veículo, cliente, CPF, telefone, data e preço.
  - **Concessionárias**: Dados como nome e localização.
  - **Veículos**: Detalhes como modelo, preço e fabricante associado.
  - **Fabricantes**: Registro de nomes únicos de fabricantes.
- **Autenticação**: Suporte a JWT para autenticação de usuários com roles (Administrador, Vendedor, Gerente).

## Estrutura do Projeto
```bash
CONCESSIONARIA/
├── ConcessionariaFront/         # Pasta do frontend
│   ├── assets/                  # Recursos estáticos
│   ├── concessionaria/          # Páginas relacionadas a concessionárias
│   ├── css/                     # Estilos
│   ├── fabricante/              # Páginas relacionadas a fabricantes
│   ├── js/                      # Scripts
│   │   └── libs/                # Bibliotecas JavaScript
│   ├── login/                   # Páginas de login
│   ├── usuario/                 # Páginas de usuários
│   ├── veiculo/                 # Páginas relacionadas a veículos
│   ├── vendas/                  # Páginas de vendas
│   ├── index.html               # Página inicial
│   ├── login.html               # Página de login
│   └── register.html            # Página de registro
├── ConcessionariaWeb/           # Pasta do backend
│   ├── Controllers/             # Controladores da API
│   │   └── VendaController.cs
│   ├── Data/                    # Contexto do banco de dados
│   │   └── ApplicationDbContext.cs
│   ├── Migrations/              # Migrações do Entity Framework
│   ├── Models/                  # Modelos de dados
│   ├── wwwroot/                 # (Arquivos estáticos)
│   ├── appsettings.json         # Configurações (conexão com banco)
│   ├── appsettings.Development.json
│   ├── ConcessionariaWeb.csproj # Arquivo de projeto
│   └── Program.cs               # Configuração do aplicativo
└── README.md                    
```

## Como Rodar o Projeto Localmente

### Backend
Abra o terminal na pasta do backend e execute os seguintes comandos:

```bash
# Restaurar pacotes
dotnet restore

# Executar
dotnet run

# A API estará disponível em: http://localhost:5281
```

### Frontend
```bash
Abra o terminal na pasta do frontend e execute os seguintes comandos:

# Instalar o live-server globalmente (se ainda não tiver instalado)
npm install -g live-server

# Executar
live-server

# O frontend estará disponível em: http://localhost:5500
```

## Contribuição
Contribuições são bem-vindas! Sinta-se à vontade para enviar pull requests para melhorias, correções de bugs ou adição de funcionalidades.

Atualize seu arquivo README no Git com essa estrutura organizada e revisada para facilitar a compreensão e uso por parte dos usuários do seu projeto.
