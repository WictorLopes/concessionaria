using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ConcessionariaWeb.Migrations
{
    /// <inheritdoc />
    public partial class Migracao : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Vendas_FabricanteId",
                table: "Vendas",
                column: "FabricanteId");

            migrationBuilder.AddForeignKey(
                name: "FK_Vendas_Fabricantes_FabricanteId",
                table: "Vendas",
                column: "FabricanteId",
                principalTable: "Fabricantes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Vendas_Fabricantes_FabricanteId",
                table: "Vendas");

            migrationBuilder.DropIndex(
                name: "IX_Vendas_FabricanteId",
                table: "Vendas");
        }
    }
}
