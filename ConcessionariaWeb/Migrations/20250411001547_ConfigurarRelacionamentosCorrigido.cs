using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ConcessionariaWeb.Migrations
{
    /// <inheritdoc />
    public partial class ConfigurarRelacionamentosCorrigido : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Veiculos_Fabricantes_FabricanteId",
                table: "Veiculos");

            migrationBuilder.DropForeignKey(
                name: "FK_Vendas_Concessionarias_ConcessionariaId",
                table: "Vendas");

            migrationBuilder.AddForeignKey(
                name: "FK_Veiculos_Fabricantes_FabricanteId",
                table: "Veiculos",
                column: "FabricanteId",
                principalTable: "Fabricantes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Vendas_Concessionarias_ConcessionariaId",
                table: "Vendas",
                column: "ConcessionariaId",
                principalTable: "Concessionarias",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Veiculos_Fabricantes_FabricanteId",
                table: "Veiculos");

            migrationBuilder.DropForeignKey(
                name: "FK_Vendas_Concessionarias_ConcessionariaId",
                table: "Vendas");

            migrationBuilder.AddForeignKey(
                name: "FK_Veiculos_Fabricantes_FabricanteId",
                table: "Veiculos",
                column: "FabricanteId",
                principalTable: "Fabricantes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Vendas_Concessionarias_ConcessionariaId",
                table: "Vendas",
                column: "ConcessionariaId",
                principalTable: "Concessionarias",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
