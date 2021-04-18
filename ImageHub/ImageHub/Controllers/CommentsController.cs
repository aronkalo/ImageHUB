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
    [Route("services/medias/[controller]")]
    [ApiController]
    public class CommentsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly AccountService _accountService;

        public CommentsController(ApplicationDbContext context, AccountService accountService)
        {
            _context = context;
            _accountService = accountService;
        }

        [HttpPost("{id}")]
        public async Task<IActionResult> CommentMediaAsync(string id, [FromQuery] string commentText)
        {
            if (id is null)
                throw new ArgumentNullException(nameof(id));

            if (commentText is null)
                throw new ArgumentNullException(nameof(commentText));

            string username = HttpContext?.User?.Identity?.Name;

            if (username is default(string))
                throw new ArgumentNullException("user");

            if (!_accountService.TryGetIdentifierByUsername(username, out var userId))
                throw new ArgumentException(nameof(username));

            var media = _context.Medias.FirstOrDefault(med => med.Identifier == id);

            if (media is default(Media))
                throw new ArgumentException(nameof(id));

            await _context.Comments.AddAsync(new Comment() { Indentifier = Guid.NewGuid().ToString(), MediaIdentifier = media.Identifier, UserIdentifier = userId, Date = DateTime.Now, Text = commentText });
            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}
