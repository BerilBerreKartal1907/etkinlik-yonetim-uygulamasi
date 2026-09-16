namespace EtkinlikYonetimi.Business;

public class EventListItemDto
{
    public int Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public string ShortDescription { get; set; } = string.Empty;

    public string? ImageUrl { get; set; }

    public DateTime StartDate { get; set; }

    public DateTime EndDate { get; set; }
}