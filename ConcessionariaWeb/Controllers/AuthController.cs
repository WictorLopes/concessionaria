using ConcessionariaWeb.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ConcessionariaWeb.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IConfiguration _configuration;
        private readonly ILogger<AuthController> _logger;

        public AuthController(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            IConfiguration configuration,
            ILogger<AuthController> logger)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _configuration = configuration;
            _logger = logger;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            // Validar se o Tipo é uma das roles permitidas
            var validRoles = new[] { "Administrador", "Vendedor", "Gerente" };
            var role = model.Tipo.ToString();
            if (!validRoles.Contains(role))
            {
                return BadRequest(new { Message = "Tipo inválido. Use: Administrador, Vendedor ou Gerente." });
            }

            var user = new ApplicationUser
            {
                UserName = model.Email,
                Email = model.Email,
                Nome = model.Nome,
                Telefone = model.Telefone,
                Tipo = model.Tipo
            };

            var result = await _userManager.CreateAsync(user, model.Senha);
            if (result.Succeeded)
            {
                // Atribuir a role ao usuário
                await _userManager.AddToRoleAsync(user, role);
                return Ok(new { Message = "Usuário registrado com sucesso!" });
            }

            return BadRequest(new { Errors = result.Errors.Select(e => e.Description) });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {

            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user != null)
            {
                _logger.LogDebug("Usuário encontrado: {Email}, Nome: {Nome}, Tipo: {Tipo}", 
                    user.Email, user.Nome, user.Tipo.ToString());
            }
            else
            {
                _logger.LogWarning("Usuário não encontrado para o email: {Email}", model.Email);
            }

            if (user != null && await _userManager.CheckPasswordAsync(user, model.Senha))
            {
                _logger.LogInformation("Autenticação bem-sucedida para o email: {Email}", model.Email);

                var authClaims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, user.Email ?? string.Empty),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                    new Claim(ClaimTypes.Role, user.Tipo.ToString()),
                    new Claim("nome", user.Nome ?? user.Email ?? string.Empty)
                };



                var secretKey = _configuration["JwtSettings:SecretKey"];
                if (string.IsNullOrEmpty(secretKey))
                {
                    throw new InvalidOperationException("SecretKey is not configured.");
                }

                var key = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(secretKey));
                var token = new JwtSecurityToken(
                    issuer: _configuration["JwtSettings:Issuer"] ?? "ConcessionariaWeb",
                    audience: _configuration["JwtSettings:Audience"] ?? "ConcessionariaWeb",
                    expires: DateTime.Now.AddHours(1),
                    claims: authClaims,
                    signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature)
                );

                var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

                var response = new
                {
                    token = tokenString,
                    expiration = token.ValidTo,
                    tipo = user.Tipo.ToString(),
                    nome = user.Nome ?? user.Email
                };

                _logger.LogInformation("Resposta de login: {Response}", 
                    System.Text.Json.JsonSerializer.Serialize(response));

                return Ok(response);
            }

            _logger.LogWarning("Falha na autenticação para o email: {Email}. Credenciais inválidas.", model.Email);
            return Unauthorized(new { Message = "Credenciais inválidas." });
        }

        [HttpGet("users")]
        [Authorize(Roles = "Administrador, Gerente")]
        public IActionResult GetUsers()
        {
            var users = _userManager.Users.Select(u => new
            {
                u.Nome,
                u.Telefone,
                u.Email,
                Tipo = u.Tipo.ToString()
            }).ToList();

            return Ok(users);
        }

        [HttpDelete("users/{email}")]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> DeleteUser(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
            {
                return NotFound(new { message = "Usuário não encontrado." });
            }

            // Impedir que o administrador se exclua
            var currentUser = await _userManager.GetUserAsync(User);
            if (currentUser != null && currentUser.Email == email)
            {
                return BadRequest(new { message = "Você não pode excluir sua própria conta." });
            }

            var result = await _userManager.DeleteAsync(user);
            if (!result.Succeeded)
            {
                return BadRequest(new { message = "Erro ao excluir usuário.", errors = result.Errors });
            }

            return Ok(new { message = "Usuário excluído com sucesso." });
        }

        [HttpPut("users/{email}")]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> UpdateUser(string email, [FromBody] dynamic updateData)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
            {
                return NotFound(new { message = "Usuário não encontrado." });
            }

            // Atualizar os campos se fornecidos
            if (updateData.nome != null) user.Nome = updateData.nome.ToString();
            if (updateData.telefone != null) user.Telefone = updateData.telefone.ToString();
            if (updateData.email != null && updateData.email.ToString() != email)
            {
                var emailResult = await _userManager.SetEmailAsync(user, updateData.email.ToString());
                if (!emailResult.Succeeded)
                {
                    return BadRequest(new { message = "Erro ao atualizar o email.", errors = emailResult.Errors });
                }
                user.UserName = updateData.email.ToString(); // Atualiza o UserName também
            }
            if (updateData.tipo != null && Enum.TryParse(updateData.tipo.ToString(), out TipoUsuario novoTipo))
            {
                novoTipo = TipoUsuario.Administrador; 
                user.Tipo = novoTipo;
            }

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
            {
                return BadRequest(new { message = "Erro ao atualizar usuário.", errors = result.Errors });
            }

            // Atualizar roles com base no Tipo
            var currentRoles = await _userManager.GetRolesAsync(user);
            var newRole = user.Tipo.ToString();
            if (!currentRoles.Contains(newRole))
            {
                await _userManager.RemoveFromRolesAsync(user, currentRoles);
                await _userManager.AddToRoleAsync(user, newRole);
            }

            return Ok(new { message = "Usuário atualizado com sucesso." });
        }
    }

    public class RegisterModel
    {
        public required string Nome { get; set; }
        public required string Telefone { get; set; }
        public required string Email { get; set; }
        public required string Senha { get; set; }
        public TipoUsuario Tipo { get; set; }
    }

    public class LoginModel
    {
        public required string Email { get; set; }
        public required string Senha { get; set; }
    }
}