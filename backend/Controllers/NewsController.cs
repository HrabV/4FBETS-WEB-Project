using FourBets.Data;

using FourBets.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FourBets.Controllers;

[Route("api/news")]
[ApiController]
public class NewsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IWebHostEnvironment _env;

    public NewsController(ApplicationDbContext context, IWebHostEnvironment env)
    {
        _context = context;
        _env = env;
    }

    // GET: api/News
    [HttpGet]
    public async Task<ActionResult<IEnumerable<News>>> GetNews()
    {
        return await _context.News.ToListAsync();
    }

    // GET: api/News/5
    [HttpGet("{id}")]
    public async Task<ActionResult<News>> GetNews(Guid id)
    {
        var news = await _context.News.FindAsync(id);

        if (news == null)
        {
            return NotFound();
        }

        return news;
    }

    // PUT: api/News/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutNews(Guid id, News news)
    {
        if (id != news.Id)
        {
            return BadRequest();
        }

        _context.Entry(news).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!NewsExists(id))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }

        return NoContent();
    }

    // POST: api/News
    [HttpPost]
    public async Task<ActionResult<News>> PostNews(News news)
    {
        _context.News.Add(news);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetNews", new { id = news.Id }, news);
    }

    // DELETE: api/News/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteNews(Guid id)
    {
        var news = await _context.News.FindAsync(id);
        if (news == null)
        {
            return NotFound();
        }

        _context.News.Remove(news);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool NewsExists(Guid id)
    {
        return _context.News.Any(e => e.Id == id);
    }

    [Route("UploadImage")]
    [HttpPost]
    public async Task<string> Upload()
    {
        try
        {
            var httpRequest = Request.Form;
            var postedFile = httpRequest.Files[0];
            string filename = new String(Path.GetFileNameWithoutExtension(postedFile.FileName).Take(10).ToArray()).Replace(" ", "-");
            filename = filename + DateTime.Now.ToString("yyyy-MM-dd-HH-mm-ssff") + Path.GetExtension(postedFile.FileName);
            var imagePath = _env.ContentRootPath + "/Image/" + filename;

            using (var stream = new FileStream(imagePath, FileMode.Create))
            {
                await postedFile.CopyToAsync(stream);
            }

            return filename;
        }
        catch (Exception)
        {

            return "anonymous.png";
        }
    }

}

