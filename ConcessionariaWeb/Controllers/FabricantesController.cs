using ConcessionariaWeb.Data;
using ConcessionariaWeb.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ConcessionariaWeb.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FabricantesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public FabricantesController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Fabricante>>>
        GetFabricantes()
        {
            return await _context.Fabricantes.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Fabricante>> GetFabricante(int id)
        {
            var fabricante = await _context.Fabricantes.FindAsync(id);

            if (fabricante == null) return NotFound();

            return fabricante;
        }

        [HttpPost]
        public async Task<ActionResult<Fabricante>>
        PostFabricante(Fabricante fabricante)
        {
            try
            {
                _context.Fabricantes.Add (fabricante);
                await _context.SaveChangesAsync();
                return Ok(new {
                    message = "Fabricante cadastrado com sucesso.",
                    fabricante
                });
            }
            catch (DbUpdateException ex)
            when (
            ex.InnerException is Microsoft.Data.SqlClient.SqlException sqlEx &&
            sqlEx.Number == 2601
            )
            {
                // 2601 é o código do SQL Server para violação de índice único
                return Conflict(new {
                    message = "Nome do fabricante já existe."
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500,
                new {
                    message = "Erro interno ao cadastrar fabricante.",
                    error = ex.Message
                });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult>
        PutFabricante(int id, Fabricante fabricante)
        {
            if (id != fabricante.Id) return BadRequest();

            _context.Entry(fabricante).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Fabricantes.Any(e => e.Id == id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Administrador, Gerente")]
        public async Task<IActionResult> DeleteFabricante(int id)
        {
            try
            {
                var fabricante = await _context.Fabricantes.FindAsync(id);
                if (fabricante == null)
                {
                    return NotFound(new {
                        message = "Fabricante não encontrado."
                    });
                }

                // Buscar todos os veículos associados a este fabricante
                var veiculosDoFabricante =
                    await _context
                        .Veiculos
                        .Where(v => v.FabricanteId == id)
                        .ToListAsync();

                // Marcar todos como excluídos
                foreach (var veiculo in veiculosDoFabricante)
                {
                    veiculo.Excluido = true;
                }

                await _context.SaveChangesAsync();

                return Ok(new {
                    message =
                        "Fabricante excluído. Veículos do fabricante marcados como excluídos."
                });
            }
            catch (Exception)
            {
                return StatusCode(500,
                new { message = "Erro interno ao excluir fabricante." });
            }
        }
    }
}
