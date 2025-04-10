using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ConcessionariaWeb.Migrations
{
    /// <inheritdoc />
    public partial class AlterarVendaParaConcessionariaId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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
                name: "IX_Vendas_VeiculoId",
                table: "Vendas");

            migrationBuilder.AlterColumn<string>(
                name: "ConcessionariaId",
                table: "Vendas",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<string>(
                name: "Cpf",
                table: "Vendas",
                type: "nvarchar(11)",
                maxLength: 11,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "FabricanteId",
                table: "Vendas",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "NomeCliente",
                table: "Vendas",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Protocolo",
                table: "Vendas",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Telefone",
                table: "Vendas",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Cpf",
                table: "Vendas");

            migrationBuilder.DropColumn(
                name: "FabricanteId",
                table: "Vendas");

            migrationBuilder.DropColumn(
                name: "NomeCliente",
                table: "Vendas");

            migrationBuilder.DropColumn(
                name: "Protocolo",
                table: "Vendas");

            migrationBuilder.DropColumn(
                name: "Telefone",
                table: "Vendas");

            migrationBuilder.AlterColumn<int>(
                name: "ConcessionariaId",
                table: "Vendas",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.CreateIndex(
                name: "IX_Vendas_ConcessionariaId",
                table: "Vendas",
                column: "ConcessionariaId");

            migrationBuilder.CreateIndex(
                name: "IX_Vendas_VeiculoId",
                table: "Vendas",
                column: "VeiculoId");

            migrationBuilder.AddForeignKey(
                name: "FK_Vendas_Concessionarias_ConcessionariaId",
                table: "Vendas",
                column: "ConcessionariaId",
                principalTable: "Concessionarias",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Vendas_Veiculos_VeiculoId",
                table: "Vendas",
                column: "VeiculoId",
                principalTable: "Veiculos",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
