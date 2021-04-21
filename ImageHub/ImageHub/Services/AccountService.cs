using ImageHub.Data;
using ImageHub.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ImageHub.Services
{
    public class AccountService
    {
        private readonly ApplicationDbContext _context;
        
        public ApplicationDbContext Context
        {
            get => _context;
        }

        public AccountService(ApplicationDbContext context)
        {
            _context = context;
        }

        public bool TryGetUserByIdentifier(string identifier, out ApplicationUser user)
        {
            user = _context.Users.FirstOrDefault(us => us.Id == identifier);
            return user is not default(ApplicationUser);
        }

        public bool TryGetUserByName(string name, out ApplicationUser user)
        {
            user = _context.Users.FirstOrDefault(us => us.UserName == name);
            return user is not default(ApplicationUser);
        }

        public bool TryGetUsernameByIdentifier(string identifier, out string username)
        {
            username = _context.Users.FirstOrDefault(us => us.Id == identifier)?.UserName;
            return username is not default(string);
        }

        public bool TryGetIdentifierByUsername(string username, out string identifier)
        {
            identifier = _context.Users.FirstOrDefault(us => us.UserName == username)?.Id;
            return identifier is not default(string);
        }

        public bool LikedByUser(Media media, string userName)
        {
            if (media is null)
                throw new ArgumentNullException(nameof(media));

            if (userName is null)
                throw new ArgumentNullException(nameof(userName));

            if (!TryGetIdentifierByUsername(userName, out var userId))
                throw new ArgumentException();

            var like = _context.Likes
                .FirstOrDefault(li => li.MediaIdentifier == media.Identifier && li.UserIdentifier == userId);
            return like is not default(Like);
        }
    }
}
