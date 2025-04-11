using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ConcessionariaWeb.Migrations
{
    /// <inheritdoc />
    public partial class AddVendidoToVeiculo : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Veiculos_Fabricantes_FabricanteId",
                table: "Veiculos");

            migrationBuilder.AddColumn<bool>(
                name: "Vendido",
                table: "Veiculos",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddForeignKey(
                name: "FK_Veiculos_Fabricantes_FabricanteId",
                table: "Veiculos",
                column: "FabricanteId",
                principalTable: "Fabricantes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Veiculos_Fabricantes_FabricanteId",
                table: "Veiculos");

            migrationBuilder.DropColumn(
                name: "Vendido",
                table: "Veiculos");

            migrationBuilder.AddForeignKey(
                name: "FK_Veiculos_Fabricantes_FabricanteId",
                table: "Veiculos",
                column: "FabricanteId",
                principalTable: "Fabricantes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
