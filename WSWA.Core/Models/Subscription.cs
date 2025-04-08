using System.ComponentModel.DataAnnotations;

namespace WSWA.Core.Models
{
    public class Subscription
    {
        [Key]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Country { get; set; } = string.Empty;

        [Required]
        public string City { get; set; } = string.Empty;

        public string? ZipCode { get; set; }
    }
}