using System.ComponentModel.DataAnnotations;

namespace ConcessionariaWeb.Models
{
    public class Concessionaria
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public required string Nome { get; set; }

        [Required]
        public required string Rua { get; set; }

        [Required]
        public required string Cidade { get; set; }

        [Required]
        public required string Estado { get; set; }

        [Required]
        [RegularExpression(@"^\d{5}-\d{3}$", ErrorMessage = "CEP inválido.")]
        public required string Cep { get; set; }

        [Phone]
        public required string Telefone { get; set; }

        [EmailAddress]
        public required string Email { get; set; }

        [Range(1, int.MaxValue, ErrorMessage = "A capacidade deve ser maior que 0.")]
        public int CapacidadeMaximaVeiculos { get; set; }

        public bool Excluido { get; set; } = false;
    }
}
