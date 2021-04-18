using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
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
        }

        [Key]
        public string Identifier { get; set; }

        public byte[] Data { get; set; }

        public string Text { get; set; }

        public string UserIdentifier { get; set; }

        public string ContentType { get; set; }
    }
}
