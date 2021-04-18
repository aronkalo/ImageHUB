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

        public MediasController(ApplicationDbContext context, AccountService accountService)
        {
            _context = context;
            _accountService = accountService;
        }

        [HttpGet]
        public JsonResult GetMedias()
        {
            string username = HttpContext?.User?.Identity?.Name;

            if (username is default(string))
                throw new ArgumentNullException("user");

            return new JsonResult(_context.Medias.AsEnumerable().Select(media => 
            {
                var mediaDto = MediaDto.FromModel(media);
                mediaDto.LikedByMe = LikedByUser(media, username);
                mediaDto.Comments = GetComments(media);
                mediaDto.NumberOfLikes = _context.Likes.Count(lik => lik.MediaIdentifier == media.Identifier);
                return mediaDto;
            }));
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

            _context.Medias.Add(new Media(Guid.NewGuid().ToString(), buffer, uploadFile.text, userId, uploadFile.file.ContentType));
            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpPost]
        [Route("{mediaId}/like")]
        public async Task<IActionResult> LikeMediaAsync(string mediaId)
        {
            if (mediaId is null)
                throw new ArgumentNullException(nameof(mediaId));

            string username = HttpContext?.User?.Identity?.Name;

            if (username is default(string))
                throw new ArgumentNullException("user");

            if (!_accountService.TryGetIdentifierByUsername(username, out var userId))
                throw new ArgumentException(nameof(username));

            var media = _context.Medias.FirstOrDefault(med => med.Identifier == mediaId);

            if (media is default(Media))
                throw new ArgumentException(nameof(mediaId));

            if (LikedByUser(media, username))
                return Ok();

            await _context.Likes.AddAsync(new Like() { Indentifier = Guid.NewGuid().ToString(), MediaIdentifier = media.Identifier, UserIdentifier = userId });
            await _context.SaveChangesAsync();
            return (Ok());
        }

        [HttpPost]
        [Route("{mediaId}/comment/{commentText}}")]
        public async Task<IActionResult> CommentMediaAsync(string mediaId, string commentText)
        {
            if (mediaId is null)
                throw new ArgumentNullException(nameof(mediaId));

            if (commentText is null)
                throw new ArgumentNullException(nameof(commentText));

            string username = HttpContext?.User?.Identity?.Name;

            if (username is default(string))
                throw new ArgumentNullException("user");

            if (!_accountService.TryGetIdentifierByUsername(username, out var userId))
                throw new ArgumentException(nameof(username));

            var media = _context.Medias.FirstOrDefault(med => med.Identifier == mediaId);

            if (media is default(Media))
                throw new ArgumentException(nameof(mediaId));

            await _context.Comments.AddAsync(new Comment() { Indentifier = Guid.NewGuid().ToString(), MediaIdentifier = media.Identifier, UserIdentifier = userId, Date = DateTime.Now, Text = commentText });
            await _context.SaveChangesAsync();
            return Ok();
        }

        private bool LikedByUser(Media media, string userName)
        {
            if (media is null)
                throw new ArgumentNullException(nameof(media));

            if (userName is null)
                throw new ArgumentNullException(nameof(userName));

            if (!_accountService.TryGetIdentifierByUsername(userName, out var userId))
                throw new ArgumentException();

            var like = _context.Likes
                .FirstOrDefault(li => li.MediaIdentifier == media.Identifier && li.UserIdentifier == userId);
            return like is not default(Like);
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
