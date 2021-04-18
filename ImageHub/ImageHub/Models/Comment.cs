﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ImageHub.Models
{
    public class Comment
    {
        [Key]
        public string Indentifier { get; set; }

        public string MediaIdentifier { get; set; }

        public string UserIdentifier { get; set; }

        public string Text { get; set; }

        public DateTime Date { get; set; }
    }
}
