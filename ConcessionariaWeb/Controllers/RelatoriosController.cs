using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ConcessionariaWeb.Data;
using ConcessionariaWeb.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ConcessionariaWeb.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RelatoriosController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public RelatoriosController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("vendas-mensais")]
        [Authorize(Roles = "Administrador,Gerente")]
        public async Task<ActionResult<IEnumerable<object>>>
        GetVendasMensais(int ano, int mes)
        {
            var vendas =
                await _context
                    .Vendas
                    .Where(v =>
                        v.DataVenda.Year == ano && v.DataVenda.Month == mes)
                    .Include(v => v.Veiculo)
                    .Include(v => v.Concessionaria)
                    .Include(v => v.Fabricante)
                    .GroupBy(v =>
                        new {
                            TipoVeiculo =
                                v.Veiculo != null
                                    ? v.Veiculo.TipoVeiculo.ToString()
                                    : "Desconhecido",
                            ConcessionariaNome =
                                v.Concessionaria != null
                                    ? v.Concessionaria.Nome
                                    : "Desconhecida",
                            FabricanteNome =
                                v.Fabricante != null
                                    ? v.Fabricante.Nome
                                    : "Desconhecido"
                        })
                    .Select(g =>
                        new {
                            TipoVeiculo = g.Key.TipoVeiculo,
                            Concessionaria = g.Key.ConcessionariaNome,
                            Fabricante = g.Key.FabricanteNome,
                            ValorTotal = g.Sum(v => v.PrecoVenda),
                            QuantidadeVendas = g.Count()
                        })
                    .ToListAsync();

            return Ok(vendas);
        }

        [HttpGet("dashboard-vendas")]
        [Authorize(Roles = "Administrador,Gerente")]
        public async Task<ActionResult<object>> GetDashboardVendas(int ano)
        {
            try
            {
                var vendas =
                    await _context
                        .Vendas
                        .Where(v => v.DataVenda.Year == ano)
                        .Include(v => v.Veiculo)
                        .Include(v => v.Concessionaria)
                        .Include(v => v.Fabricante)
                        .ToListAsync();

                var vendasPorTipo =
                    vendas
                        .GroupBy(v =>
                            v.Veiculo != null ? v.Veiculo.TipoVeiculo.ToString() : "Desconhecido")
                        .Select(g =>
                            new {
                                TipoVeiculo = g.Key,
                                ValorTotal = g.Sum(v => v.PrecoVenda),
                                QuantidadeVendas = g.Count()
                            })
                        .ToList();

                var vendasPorConcessionaria =
                    vendas
                        .GroupBy(v =>
                            v.Concessionaria != null
                                ? v.Concessionaria.Nome
                                : "Desconhecida")
                        .Select(g =>
                            new {
                                Concessionaria = g.Key,
                                ValorTotal = g.Sum(v => v.PrecoVenda),
                                QuantidadeVendas = g.Count()
                            })
                        .ToList();

                var vendasPorFabricante =
                    vendas
                        .GroupBy(v =>
                            v.Fabricante != null
                                ? v.Fabricante.Nome
                                : "Desconhecido")
                        .Select(g =>
                            new {
                                Fabricante = g.Key,
                                ValorTotal = g.Sum(v => v.PrecoVenda),
                                QuantidadeVendas = g.Count()
                            })
                        .ToList();

                return Ok(new {
                    VendasPorTipo = vendasPorTipo,
                    VendasPorConcessionaria = vendasPorConcessionaria,
                    VendasPorFabricante = vendasPorFabricante
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500,
                new {
                    Message = "Erro interno ao processar o dashboard.",
                    Detalhes = ex.Message
                });
            }
        }
    }
}
