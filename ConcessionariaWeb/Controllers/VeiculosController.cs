using ConcessionariaWeb.Data;
using ConcessionariaWeb.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ConcessionariaWeb.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VeiculosController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public VeiculosController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetVeiculos()
        {
            var veiculos =
                await _context
                    .Veiculos
                    .Where(v => !v.Excluido)
                    .Join(_context.Fabricantes,
                    veiculo => veiculo.FabricanteId,
                    fabricante => fabricante.Id,
                    (veiculo, fabricante) =>
                        new {
                            veiculo.Id,
                            veiculo.Modelo,
                            veiculo.AnoFabricacao,
                            veiculo.Preco,
                            FabricanteNome = fabricante.Nome,
                            veiculo.TipoVeiculo,
                            veiculo.Descricao
                        })
                    .ToListAsync();

            return Ok(veiculos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetVeiculo(int id)
        {
            var veiculo =
                await _context
                    .Veiculos
                    .Join(_context.Fabricantes,
                    veiculo => veiculo.FabricanteId,
                    fabricante => fabricante.Id,
                    (veiculo, fabricante) =>
                        new {
                            veiculo.Id,
                            veiculo.Modelo,
                            veiculo.AnoFabricacao,
                            veiculo.Preco,
                            FabricanteId = veiculo.FabricanteId,
                            FabricanteNome = fabricante.Nome,
                            veiculo.TipoVeiculo,
                            veiculo.Descricao
                        })
                    .FirstOrDefaultAsync(v => v.Id == id);

            if (veiculo == null) return NotFound();

            return Ok(veiculo);
        }

        [HttpPost]
        public async Task<ActionResult<Veiculo>> PostVeiculo(Veiculo veiculo)
        {
            var fabricanteExistente =
                await _context.Fabricantes.FindAsync(veiculo.FabricanteId);
            if (fabricanteExistente == null)
            {
                return BadRequest("Fabricante não encontrado.");
            }

            _context.Veiculos.Add (veiculo);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetVeiculo),
            new { id = veiculo.Id },
            veiculo);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutVeiculo(int id, Veiculo veiculo)
        {
            if (id != veiculo.Id) return BadRequest();

            var fabricanteExistente =
                await _context.Fabricantes.FindAsync(veiculo.FabricanteId);
            if (fabricanteExistente == null)
                return BadRequest("Fabricante não encontrado.");

            var veiculoExistente = await _context.Veiculos.FindAsync(id);
            if (veiculoExistente == null) return NotFound();

            veiculoExistente.Modelo = veiculo.Modelo;
            veiculoExistente.AnoFabricacao = veiculo.AnoFabricacao;
            veiculoExistente.Preco = veiculo.Preco;
            veiculoExistente.FabricanteId = veiculo.FabricanteId;
            veiculoExistente.TipoVeiculo = veiculo.TipoVeiculo;
            veiculoExistente.Descricao = veiculo.Descricao;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Veiculos.Any(e => e.Id == id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Administrador, Gerente")]
        public async Task<IActionResult> DeleteVeiculo(int id)
        {
            try
            {
                var veiculo = await _context.Veiculos.FindAsync(id);
                if (veiculo == null)
                {
                    return NotFound(new {
                        message = "Veículo não encontrado."
                    });
                }

                veiculo.Excluido = true;
                await _context.SaveChangesAsync();

                return Ok(new {
                    message =
                        "Veículo excluído com sucesso. As vendas associadas foram mantidas."
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500,
                new { message = "Erro interno ao excluir veículo." });
            }
        }

        [HttpGet("por-fabricante/{fabricanteId}")]
        public async Task<IActionResult>
        GetVeiculosPorFabricante(int fabricanteId)
        {
            var veiculos =
                await _context
                    .Veiculos
                    .Where(v => v.FabricanteId == fabricanteId)
                    .Select(v => new { v.Id, v.Modelo, v.Preco })
                    .ToListAsync();
            return Ok(veiculos);
        }
    }
}
