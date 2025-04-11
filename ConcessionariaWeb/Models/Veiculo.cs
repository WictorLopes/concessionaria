using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ConcessionariaWeb.Models
{
    public enum TipoVeiculo
    {
        Carro,
        Moto,
        Caminhao,
        Onibus,
        Outros
    }

    public class Veiculo
    {
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public required string Modelo { get; set; }

        [Range(1900, 2100)]
        public int AnoFabricacao { get; set; }

        [Range(0.01, double.MaxValue, ErrorMessage = "O preço deve ser positivo.")]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Preco { get; set; }

        [Required]
        public int FabricanteId { get; set; }
        public Fabricante? Fabricante { get; set; }

        [Required]
        public TipoVeiculo TipoVeiculo { get; set; }

        [StringLength(500)]
        public string? Descricao { get; set; }
        
        [Required]  
        public bool Vendido { get; set; } = false;


    }
}
