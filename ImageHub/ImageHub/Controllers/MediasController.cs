using ImageHub.Data;
using ImageHub.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ImageHub.Controllers
{
    [Authorize]
    [ApiController]
    [Route("services/[controller]")]
    public class MediasController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public MediasController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public JsonResult GetMedias()
        {
            return new JsonResult(_context.Medias.Select(media => MediaDto.FromModel(media)));
        }

        [HttpPost]
        public async Task<IActionResult> UploadMedia([FromForm]IFormFile file, [FromForm]string text)
        {
            if (file is null || file.Length < 5)
                return Problem();

            using var stream = file.OpenReadStream();
            byte[] buffer = new byte[stream.Length];
            int pos = await stream.ReadAsync(buffer, 0, (int)stream.Length);

            if (pos is not 0)
                return Problem();

            var userName = User.Identity.Name;
            var user = _context.Users.FirstOrDefault(x => x.UserName == userName);

            if (user is default(ApplicationUser))
                return Problem();

            var media = new Media(Guid.NewGuid().ToString(), buffer, text, user.Id, file.ContentType);
            _context.Medias.Add(media);
            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}
