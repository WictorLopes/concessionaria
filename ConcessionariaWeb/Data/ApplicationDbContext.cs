using ConcessionariaWeb.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace ConcessionariaWeb.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(
            DbContextOptions<ApplicationDbContext> options
        ) :
            base(options)
        {
        }

        public DbSet<Fabricante> Fabricantes { get; set; }

        public DbSet<Veiculo> Veiculos { get; set; }

        public DbSet<Concessionaria> Concessionarias { get; set; }

        public DbSet<Venda> Vendas { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Índices únicos
            builder.Entity<Fabricante>().HasIndex(f => f.Nome).IsUnique();
            builder.Entity<Concessionaria>().HasIndex(c => c.Nome).IsUnique();
            builder.Entity<Venda>().HasIndex(v => v.Cpf).IsUnique();

            builder
                .Entity<Venda>()
                .Property(v => v.PrecoVenda)
                .HasPrecision(18, 2);

            // Relação: Venda -> Veiculo
            builder
                .Entity<Venda>()
                .HasOne(v => v.Veiculo)
                .WithMany() // Veiculo não tem uma coleção de Vendas (opcional)
                .HasForeignKey(v => v.VeiculoId)
                .OnDelete(DeleteBehavior.Restrict); // Impede exclusão em cascata

            // Relação: Veiculo -> Fabricante
            builder
                .Entity<Veiculo>()
                .HasOne(v => v.Fabricante)
                .WithMany() // Fabricante não tem uma coleção de Veiculos (opcional)
                .HasForeignKey(v => v.FabricanteId)
                .OnDelete(DeleteBehavior.Restrict);

            // Relação: Venda -> Concessionaria (opcional, mas recomendada)
            builder
                .Entity<Venda>()
                .HasOne(v => v.Concessionaria)
                .WithMany() // Concessionaria não tem uma coleção de Vendas (opcional)
                .HasForeignKey(v => v.ConcessionariaId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
