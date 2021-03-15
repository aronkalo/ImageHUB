using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ImageHub.Models
{
    public class MediaDto
    {
        public static MediaDto FromModel(Media media) => new MediaDto(media.Identifier, media.Text, media.UserIdentifier, media.ContentType, media.NumberOfLikes);
        private MediaDto(string identifier, string text, string userId, string contentType, int likes)
        {
            Identifier = identifier;
            Text = text;
            UserIdentifier = userId;
            ContentType = contentType;
            NumberOfLikes = likes;
        }

        public string Identifier { get; }

        public string Text { get; }

        public string UserIdentifier { get; }

        public string ContentType { get; }

        public int NumberOfLikes { get; }
    }
}
