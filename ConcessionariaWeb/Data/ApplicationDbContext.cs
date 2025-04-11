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
                .WithMany()
                .HasForeignKey(v => v.VeiculoId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.SetNull);

            // Relação: Veiculo -> Fabricante
            builder
                .Entity<Veiculo>()
                .HasOne(v => v.Fabricante)
                .WithMany()
                .HasForeignKey(v => v.FabricanteId)
                .OnDelete(DeleteBehavior.SetNull);

            // Relação: Venda -> Concessionaria
            builder
                .Entity<Venda>()
                .HasOne(v => v.Concessionaria)
                .WithMany()
                .HasForeignKey(v => v.ConcessionariaId)
                .OnDelete(DeleteBehavior.SetNull);
        }
    }
}
