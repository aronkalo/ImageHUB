using ImageHub.Data;
using ImageHub.Models;
using ImageHub.Services;
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
    [Route("services/medias/[controller]")]
    public class LikesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly AccountService _accountService;

        public LikesController(ApplicationDbContext context, AccountService accountService)
        {
            _context = context;
            _accountService = accountService;
        }

        [HttpPost("{id}")]
        public async Task<IActionResult> LikeMediaAsync(string id)
        {
            if (id is null)
                throw new ArgumentNullException(nameof(id));

            string username = HttpContext?.User?.Identity?.Name;

            if (username is default(string))
                throw new ArgumentNullException("user");

            if (!_accountService.TryGetIdentifierByUsername(username, out var userId))
                throw new ArgumentException(nameof(username));

            var media = _context.Medias.FirstOrDefault(med => med.Identifier == id);

            if (media is default(Media))
                throw new ArgumentException(nameof(id));

            if (_accountService.LikedByUser(media, username))
                return Ok();

            await _context.Likes.AddAsync(new Like() { Indentifier = Guid.NewGuid().ToString(), MediaIdentifier = media.Identifier, UserIdentifier = userId });
            await _context.SaveChangesAsync();
            return (Ok());
        }
    }
}
