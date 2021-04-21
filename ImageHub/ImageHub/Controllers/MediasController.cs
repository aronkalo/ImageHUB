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
    [Route("services/[controller]")]
    public class MediasController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly AccountService _accountService;

        public MediasController(AccountService accountService, ApplicationDbContext context)
        {
            _accountService = accountService;
            _context = context;
        }

        [HttpGet]
        public JsonResult GetMedias()
        {
            string username = HttpContext?.User?.Identity?.Name;

            if (username is default(string))
                throw new ArgumentNullException("user");

            return new JsonResult(_context.Medias
                .AsEnumerable()
                .OrderByDescending(med => med.Date)
                .Select(media => 
                {
                    var mediaDto = MediaDto.FromModel(media);
                    mediaDto.LikedByMe = _accountService.LikedByUser(media, username);
                    mediaDto.Comments = GetComments(media);
                    mediaDto.UserName = _accountService.TryGetUsernameByIdentifier(media.UserIdentifier, out var userName) ? userName : String.Empty;
                    mediaDto.NumberOfLikes = _context.Likes.Count(lik => lik.MediaIdentifier == media.Identifier);
                    return mediaDto;
                }).ToArray());
        }

        [HttpPost]
        public async Task<IActionResult> UploadMedia([FromForm]UploadFileDto uploadFile)
        {
            if (uploadFile.file is null || uploadFile.file.Length < 5)
                return Problem();

            string username = HttpContext?.User?.Identity?.Name;

            if (username is default(string))
                throw new ArgumentNullException("user");

            if (!_accountService.TryGetIdentifierByUsername(username, out var userId))
                throw new ArgumentException(nameof(username));

            using var stream = uploadFile.file.OpenReadStream();
            byte[] buffer = new byte[stream.Length];
            int pos = await stream.ReadAsync(buffer, 0, (int)stream.Length);

            _context.Medias.Add(new Media(Guid.NewGuid().ToString(), buffer, uploadFile.text, userId, uploadFile.file.ContentType, DateTime.Now));
            await _context.SaveChangesAsync();
            return Ok();
        }

        private CommentDto[] GetComments(Media media)
        {
            if (media is null)
                throw new ArgumentNullException(nameof(media));

            return _context.Comments
                .Where(com => com.MediaIdentifier == media.Identifier)
                .AsEnumerable()
                .Select(com => new CommentDto() {
                    Date = com.Date,
                    Text = com.Text,
                    UserName = _accountService.TryGetUsernameByIdentifier(com.UserIdentifier, out string username) ? username : null })
                .ToArray();
        }
    }
}
