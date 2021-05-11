using System.ComponentModel.DataAnnotations;

namespace ImageHub.Models
{
    public class FriendConnection
    {
        [Key]
        public string Identifier { get; set; }
        
        public string UserOne { get; set; }
        
        public string UserTwo { get; set; }

    }
}