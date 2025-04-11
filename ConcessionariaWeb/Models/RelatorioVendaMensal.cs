namespace ConcessionariaWeb.Models
{
    public class RelatorioVendaMensal
    {
        public required string TipoVeiculo { get; set; }
        public required string Concessionaria { get; set; }
        public required string Fabricante { get; set; }
        public required string Veiculo { get; set; }
        public decimal ValorTotal { get; set; }
        public int QuantidadeVendas { get; set; }
    }
}