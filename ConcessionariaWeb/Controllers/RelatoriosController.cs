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
        public async Task<ActionResult<IEnumerable<RelatorioVendaMensal>>>
        GetVendasMensais(int ano, int mes)
        {
            try
            {
                var vendas =
                    await _context
                        .Vendas
                        .Where(v =>
                            v.DataVenda.Year == ano && v.DataVenda.Month == mes)
                        .Include(v => v.Veiculo)
                        .Include(v => v.Concessionaria)
                        .Include(v => v.Fabricante)
                        .ToListAsync();

                var agrupado =
                    vendas
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
                                        : "Desconhecido",
                                VeiculoModelo =
                                    v.Veiculo != null
                                        ? v.Veiculo.Modelo
                                        : "Desconhecido" // Adicionando o modelo do veículo no agrupamento
                            })
                        .Select(g =>
                            new RelatorioVendaMensal {
                                TipoVeiculo = g.Key.TipoVeiculo,
                                Concessionaria = g.Key.ConcessionariaNome,
                                Fabricante = g.Key.FabricanteNome,
                                Veiculo = g.Key.VeiculoModelo, // Preenchendo o campo Veiculo
                                ValorTotal = g.Sum(v => v.PrecoVenda),
                                QuantidadeVendas = g.Count()
                            })
                        .ToList();

                return Ok(agrupado);
            }
            catch (Exception ex)
            {
                return StatusCode(500,
                new {
                    Message = "Erro interno ao processar vendas mensais.",
                    Detalhes = ex.Message
                });
            }
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

                if (vendas == null || !vendas.Any())
                {
                    return Ok(new {
                        VendasPorTipo = new List<object>(),
                        VendasPorConcessionaria = new List<object>(),
                        VendasPorFabricante = new List<object>()
                    });
                }

                var vendasPorTipo = new List<object>();
                var vendasPorConcessionaria = new List<object>();
                var vendasPorFabricante = new List<object>();

                try
                {
                    vendasPorTipo =
                        vendas
                            .GroupBy(v =>
                                v.Veiculo != null
                                    ? v.Veiculo.TipoVeiculo.ToString()
                                    : "Desconhecido")
                            .Select(g =>
                                new {
                                    TipoVeiculo = g.Key,
                                    ValorTotal = g.Sum(v => v.PrecoVenda),
                                    QuantidadeVendas = g.Count()
                                })
                            .ToList<object>();
                }
                catch (Exception ex)
                {
                }

                try
                {
                    vendasPorConcessionaria =
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
                            .ToList<object>();
                }
                catch (Exception ex)
                {
                }

                try
                {
                    vendasPorFabricante =
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
                            .ToList<object>();
                }
                catch (Exception ex)
                {
                }

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