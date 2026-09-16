using EtkinlikYonetimi.Entity;
using Microsoft.EntityFrameworkCore;

namespace EtkinlikYonetimi.DataAccess;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; } = null!;

    public DbSet<Event> Events { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User tablosu kuralları
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasIndex(u => u.Email).IsUnique();

            entity.Property(u => u.Email).IsRequired().HasMaxLength(255);

            entity.Property(u => u.FirstName).IsRequired().HasMaxLength(100);

            entity.Property(u => u.LastName).IsRequired().HasMaxLength(100);

            entity.Property(u => u.PasswordEncrypted).IsRequired();
        });

        // Event tablosu kuralları
        modelBuilder.Entity<Event>(entity =>
        {
            entity.Property(e => e.Title).IsRequired().HasMaxLength(255);

            entity.Property(e => e.ShortDescription).IsRequired().HasMaxLength(512);

            entity.Property(e => e.LongDescriptionHtml).IsRequired();

            // 1-e-çok ilişki: bir User -> birçok Event
            entity.HasOne(e => e.CreatedByUser)
                  .WithMany(u => u.Events)
                  .HasForeignKey(e => e.CreatedByUserId)
                  .OnDelete(DeleteBehavior.Restrict);
        });
    }
}