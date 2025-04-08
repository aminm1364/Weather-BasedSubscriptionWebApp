using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WSWA.Core.Data;
using WSWA.Core.Models;

namespace WSWA.Core.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SubscriptionController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SubscriptionController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> CreateSubscription([FromBody] Subscription subscription)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var existing = await _context.Subscriptions.FindAsync(subscription.Email.Trim().ToLower());
            if (existing != null)
                return Conflict("Email is already subscribed.");

            _context.Subscriptions.Add(subscription);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetSubscription), new { email = subscription.Email }, subscription);
        }

        [HttpGet("{email}")]
        public async Task<IActionResult> GetSubscription(string email)
        {
            var sub = await _context.Subscriptions.FindAsync(email.Trim().ToLower());
            if (sub == null)
                return NotFound("Subscription not found.");

            return Ok(sub);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] string email)
        {
            var subscription = await _context.Subscriptions.FindAsync(email.Trim().ToLower());
            if (subscription == null)
                return NotFound("Subscription not found. Please sign up first.");

            return Ok(new { message = "Login successful", location = $"{subscription.City}, {subscription.Country}" });
        }
    }
}