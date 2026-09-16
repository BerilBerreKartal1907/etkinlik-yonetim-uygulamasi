namespace EtkinlikYonetimi.Entity;

public class Event
{
    public int Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public string ShortDescription { get; set; } = string.Empty;

    public string LongDescriptionHtml { get; set; } = string.Empty;

    public string? ImageUrl { get; set; }

    public DateTime StartDate { get; set; }

    public DateTime EndDate { get; set; }

    public bool IsActive { get; set; } = true;

    public int CreatedByUserId { get; set; }

    // Navigation property: bu etkinliği oluşturan kullanıcı
    public User CreatedByUser { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }
}