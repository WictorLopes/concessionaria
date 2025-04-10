using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ConcessionariaWeb.Migrations
{
    /// <inheritdoc />
    public partial class Relacoes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Vendas_ConcessionariaId",
                table: "Vendas",
                column: "ConcessionariaId");

            migrationBuilder.CreateIndex(
                name: "IX_Vendas_Cpf",
                table: "Vendas",
                column: "Cpf",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Vendas_VeiculoId",
                table: "Vendas",
                column: "VeiculoId");

            migrationBuilder.CreateIndex(
                name: "IX_Veiculos_FabricanteId",
                table: "Veiculos",
                column: "FabricanteId");

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

            migrationBuilder.AddForeignKey(
                name: "FK_Vendas_Veiculos_VeiculoId",
                table: "Vendas",
                column: "VeiculoId",
                principalTable: "Veiculos",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
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

            migrationBuilder.DropForeignKey(
                name: "FK_Vendas_Veiculos_VeiculoId",
                table: "Vendas");

            migrationBuilder.DropIndex(
                name: "IX_Vendas_ConcessionariaId",
                table: "Vendas");

            migrationBuilder.DropIndex(
                name: "IX_Vendas_Cpf",
                table: "Vendas");

            migrationBuilder.DropIndex(
                name: "IX_Vendas_VeiculoId",
                table: "Vendas");

            migrationBuilder.DropIndex(
                name: "IX_Veiculos_FabricanteId",
                table: "Veiculos");
        }
    }
}
