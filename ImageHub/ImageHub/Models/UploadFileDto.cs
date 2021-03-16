using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ImageHub.Models
{
    public class UploadFileDto
    {
        public IFormFile file { get; set; }

        public string text { get; set; }
    }
}
