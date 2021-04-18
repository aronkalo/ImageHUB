using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ImageHub.Models
{
    public class MediaDto
    {
        public static MediaDto FromModel(Media media) => new MediaDto(media.Identifier, media.Text, media.ContentType);
      
        private MediaDto(string identifier, string text, string contentType, string userName = null, int likes = 0)
        {
            Identifier = identifier;
            Text = text;
            UserName = userName;
            ContentType = contentType;
            NumberOfLikes = likes;
            LikedByMe = false;
            Comments = null;
        }

        public string Identifier { get; }

        public string Text { get; }

        public string UserName { get; set; }

        public string ContentType { get; }

        public int NumberOfLikes { get; set; }

        public bool LikedByMe { get; set; }

        public CommentDto[] Comments { get; set; }
    }

    public static class MediaDtoExtensions
    {
        public static MediaDto Like(this MediaDto mediaDto)
        {
            mediaDto.LikedByMe = true;
            return mediaDto;
        }

        public static MediaDto SetUsername(this MediaDto mediaDto, string username)
        {
            mediaDto.UserName = username;
            return mediaDto;
        }
    }
}
