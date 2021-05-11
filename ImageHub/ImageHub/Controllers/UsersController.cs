using System;
using System.Linq;
using System.Threading.Tasks;
using ImageHub.Data;
using ImageHub.Models;
using ImageHub.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ImageHub.Controllers
{
    [Authorize]
    [ApiController]
    [Route("services/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly AccountService _accountService;
        public UsersController(AccountService accountService, ApplicationDbContext context)
        {
            _accountService = accountService;
            _context = context;
        }

        [HttpGet]
        public JsonResult GetUsers()
        {
            return new(_context.Users.Select(u =>new {id = u.Id, name = u.UserName}));
        }
        
        [HttpGet]
        [Route("friends")]
        public JsonResult GetFriends()
        {
            string username = HttpContext?.User?.Identity?.Name;

            if (username is default(string))
                throw new ArgumentNullException("user");

            if(!_accountService.TryGetIdentifierByUsername(username, out var userId))
                throw new ArgumentNullException("user");

            return new JsonResult(_context.FriendConnections
                .Where(f => f.UserOne == userId || f.UserTwo == userId)
                .Select(f => f.UserOne == userId ? f.UserTwo : f.UserOne)
                .Select(u => new{id = u, name = _accountService.GetUsernameByIdentifier(u)})
                .ToArray());
        }

        [HttpPost]
        public async Task<IActionResult> SwitchFriendStatus([FromQuery] string userId)
        {
            string username = HttpContext?.User?.Identity?.Name;

            if (username is default(string))
                throw new ArgumentNullException("user");

            if(!_accountService.TryGetIdentifierByUsername(username, out var selfUserId))
                throw new ArgumentNullException("user");

            if (userId == selfUserId)
                throw new Exception("Cannot friend yourself.");

            var connection = _context.FriendConnections.FirstOrDefault(f =>
                (f.UserOne == userId && f.UserTwo == selfUserId) || (f.UserOne == selfUserId && f.UserTwo == userId));
            if (connection is default(FriendConnection))
            {
                var newConnection = new FriendConnection()
                    {Identifier = Guid.NewGuid().ToString(), UserOne = selfUserId, UserTwo = userId};
                await _context.FriendConnections.AddAsync(newConnection);
                await _context.SaveChangesAsync();
                return Ok();
            }

            _context.FriendConnections.Remove(connection);
            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}