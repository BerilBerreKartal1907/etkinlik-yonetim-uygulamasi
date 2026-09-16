namespace EtkinlikYonetimi.Business;

public class EventFormDto
{
    public int? Id { get; set; }  // null ise yeni kayıt, doluysa düzenleme

    public string Title { get; set; } = string.Empty;

    public string ShortDescription { get; set; } = string.Empty;

    public string LongDescriptionHtml { get; set; } = string.Empty;

    public string? ImageUrl { get; set; }

    public DateTime StartDate { get; set; }

    public DateTime EndDate { get; set; }

    public bool IsActive { get; set; }

    public int CreatedByUserId { get; set; }
}