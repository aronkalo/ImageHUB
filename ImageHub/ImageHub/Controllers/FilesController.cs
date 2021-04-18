using ImageHub.Data;
using ImageHub.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ImageHub.Controllers
{
    //[Authorize]
    [ApiController]
    [Route("services/[controller]")]
    public class FilesController : Controller
    {
        private readonly ApplicationDbContext _context;
        public FilesController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("{id}")]
        public IActionResult GetFile(string id)
        {
            if (id is default(string))
                return Problem("Identifier not set.", statusCode: 405);

            var file = _context.Medias.FirstOrDefault(file => file.Identifier == id);
            if (file is default(Media))
                return Problem("Media not found.", statusCode: 405);

            return File(file.Data, file.ContentType);
        }
    }
}
