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
        public async Task<IActionResult> UploadMedia([FromForm]UploadFileDto uploadFile)
        {
            if (uploadFile.file is null || uploadFile.file.Length < 5)
                return Problem();

            using var stream = uploadFile.file.OpenReadStream();
            byte[] buffer = new byte[stream.Length];
            int pos = await stream.ReadAsync(buffer, 0, (int)stream.Length);

            var media = new Media(Guid.NewGuid().ToString(), buffer, uploadFile.text, null, uploadFile.file.ContentType, 0);
            _context.Medias.Add(media);
            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}
