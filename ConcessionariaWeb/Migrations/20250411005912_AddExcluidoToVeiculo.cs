using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ConcessionariaWeb.Migrations
{
    /// <inheritdoc />
    public partial class AddExcluidoToVeiculo : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Vendido",
                table: "Veiculos",
                newName: "Excluido");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Excluido",
                table: "Veiculos",
                newName: "Vendido");
        }
    }
}
