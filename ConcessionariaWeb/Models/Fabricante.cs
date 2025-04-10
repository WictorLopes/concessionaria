using System.ComponentModel.DataAnnotations;

namespace ConcessionariaWeb.Models
{
    public class Fabricante
    {
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public required string Nome { get; set; }

        [StringLength(50)]
        public required string PaisOrigem { get; set; }

        [Range(1800, 2100)]
        public int AnoFundacao { get; set; }

        [Url]
        public required string Website { get; set; }
    }
}
