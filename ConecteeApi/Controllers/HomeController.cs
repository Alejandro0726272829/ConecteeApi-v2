using Microsoft.AspNetCore.Mvc;
using System.IO;

namespace ConecteeApi.Controllers
{
    [ApiController]
    [Route("/")]
    public class HomeController : ControllerBase
    {
        [HttpGet]
        public IActionResult Index()
        {
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "index.html");
            if (!System.IO.File.Exists(filePath))
                return NotFound();

            var html = System.IO.File.ReadAllText(filePath);
            return Content(html, "text/html");
        }
    }
}

