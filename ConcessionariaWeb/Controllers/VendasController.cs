using System;
using System.Linq;
using System.Threading.Tasks;
using ConcessionariaWeb.Data;
using ConcessionariaWeb.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ConcessionariaWeb.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VendaController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public VendaController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Venda venda)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Verificar se os IDs existem no banco de dados
            var concessionaria =
                await _context
                    .Concessionarias
                    .FindAsync(venda.ConcessionariaId);
            var veiculo = await _context.Veiculos.FindAsync(venda.VeiculoId);
            var fabricante =
                await _context.Fabricantes.FindAsync(venda.FabricanteId);

            if (concessionaria == null || veiculo == null || fabricante == null)
            {
                return BadRequest(new {
                    Message = "Concessionária, veículo ou fabricante inválido."
                });
            }

            // Validar o preço de venda
            if (venda.PrecoVenda > veiculo.Preco)
            {
                return BadRequest(new {
                    Message =
                        "O preço de venda não pode ser maior que o preço do veículo."
                });
            }

            // Validar a data de venda
            if (venda.DataVenda > DateTime.Now)
            {
                return BadRequest(new {
                    Message = "A data da venda não pode ser futura."
                });
            }

            // Verificar se o CPF já está registrado
            if (await _context.Vendas.AnyAsync(v => v.Cpf == venda.Cpf))
            {
                return Conflict(new {
                    Message = "CPF já registrado para outra venda."
                });
            }

            // Gerar um protocolo único
            venda.Protocolo = Guid.NewGuid().ToString();

            venda.Concessionaria = null;
            venda.Veiculo = null;
            venda.Fabricante = null;

            _context.Vendas.Add (venda);
            await _context.SaveChangesAsync();

            return Ok(new { Protocolo = venda.Protocolo });
        }

        [HttpGet]
        public async Task<IActionResult> ListarVendas()
        {
            var vendas =
                await _context
                    .Vendas
                    .Include(v => v.Veiculo)
                    .ThenInclude(v => v.Fabricante)
                    .Select(v =>
                        new {
                            v.Id,
                            ConcessionariaId = v.ConcessionariaId,
                            ConcessionariaNome =
                                _context
                                    .Concessionarias
                                    .Where(c => c.Id == v.ConcessionariaId)
                                    .Select(c => c.Nome)
                                    .FirstOrDefault(),
                            FabricanteNome = v.Veiculo.Fabricante.Nome,
                            VeiculoModelo = v.Veiculo.Modelo,
                            v.NomeCliente,
                            v.Cpf,
                            v.Telefone,
                            DataVenda = v.DataVenda.ToString("dd/MM/yyyy"),
                            v.PrecoVenda,
                            v.Protocolo
                        })
                    .ToListAsync();

            return Ok(vendas);
        }
    }
}
