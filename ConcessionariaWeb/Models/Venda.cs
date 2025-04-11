using System.ComponentModel.DataAnnotations;

namespace ConcessionariaWeb.Models
{
    public class Venda
    {
        public int Id { get; set; }
        [Required]
        public int? ConcessionariaId { get; set; }
        public Concessionaria? Concessionaria { get; set; }
        [Required]
        public int? FabricanteId { get; set; }
        public Fabricante? Fabricante { get; set; }
        [Required]
        public int? VeiculoId { get; set; }
        public Veiculo? Veiculo { get; set; }
        [Required]
        public required string NomeCliente { get; set; }
        [Required]
        [StringLength(11, MinimumLength = 11)]
        public required string Cpf { get; set; }
        [Required]
        public required string Telefone { get; set; }
        [Required]
        public DateTime DataVenda { get; set; }
        [Required]
        public decimal PrecoVenda { get; set; }
        public string? Protocolo { get; set; }
    }
}