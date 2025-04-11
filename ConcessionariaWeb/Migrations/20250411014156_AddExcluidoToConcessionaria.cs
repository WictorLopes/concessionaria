using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ConcessionariaWeb.Migrations
{
    /// <inheritdoc />
    public partial class AddExcluidoToConcessionaria : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Excluido",
                table: "Concessionarias",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Excluido",
                table: "Concessionarias");
        }
    }
}
