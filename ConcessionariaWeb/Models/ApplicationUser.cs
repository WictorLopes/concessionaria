using Microsoft.AspNetCore.Identity;

namespace ConcessionariaWeb.Models
{
    public enum TipoUsuario
    {
        Administrador,
        Vendedor,
        Gerente
    }

    public class ApplicationUser : IdentityUser
    {
        public required string Nome { get; set; }

        public required string Telefone { get; set; }

        public TipoUsuario Tipo { get; set; }
    }
}
