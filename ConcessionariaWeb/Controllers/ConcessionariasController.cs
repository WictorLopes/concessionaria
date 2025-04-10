using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ConcessionariaWeb.Data;
using ConcessionariaWeb.Models;

namespace ConcessionariaWeb.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ConcessionariasController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ConcessionariasController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Concessionaria>>> GetConcessionarias()
        {
            return await _context.Concessionarias.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Concessionaria>> GetConcessionaria(int id)
        {
            var concessionaria = await _context.Concessionarias.FindAsync(id);

            if (concessionaria == null)
                return NotFound();

            return concessionaria;
        }

        [HttpPost]
        public async Task<ActionResult<Concessionaria>> PostConcessionaria(Concessionaria concessionaria)
        {
            _context.Concessionarias.Add(concessionaria);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetConcessionaria), new { id = concessionaria.Id }, concessionaria);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutConcessionaria(int id, Concessionaria concessionaria)
        {
            if (id != concessionaria.Id)
                return BadRequest();

            _context.Entry(concessionaria).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Concessionarias.Any(e => e.Id == id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteConcessionaria(int id)
        {
            var concessionaria = await _context.Concessionarias.FindAsync(id);
            if (concessionaria == null)
                return NotFound();

            _context.Concessionarias.Remove(concessionaria);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
