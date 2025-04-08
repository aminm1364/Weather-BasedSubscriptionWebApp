using Microsoft.EntityFrameworkCore;
using WSWA.Core.Models;

namespace WSWA.Core.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<Subscription> Subscriptions => Set<Subscription>();
    }
}