using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ImageHub.Models
{
    public class CommentDto
    {
        public string Text { get; set; }

        public string UserName { get; set; }

        public DateTime Date { get; set; }
    }
}
