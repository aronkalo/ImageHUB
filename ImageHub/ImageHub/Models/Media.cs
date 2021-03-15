using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ImageHub.Models
{
    public class Media
    {
        public Media(string identifier, byte[] data, string text, string userIdentifier, string contentType)
        {
            Identifier = identifier;
            Data = data;
            Text = text;
            UserIdentifier = userIdentifier;
            ContentType = contentType;
            NumberOfLikes = 0;
        }

        public string Identifier { get; }

        public byte[] Data { get; }

        public string Text { get; }

        public string UserIdentifier { get; }

        public string ContentType { get; }

        public int NumberOfLikes { get; private set; }

        public void LikeMedia() => NumberOfLikes++;
    }
}
