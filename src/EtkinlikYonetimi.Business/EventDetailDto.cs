namespace EtkinlikYonetimi.Business;

public class EventDetailDto
{
    public int Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public string ShortDescription { get; set; } = string.Empty;

    public string LongDescriptionHtml { get; set; } = string.Empty;

    public string? ImageUrl { get; set; }

    public DateTime StartDate { get; set; }

    public DateTime EndDate { get; set; }

    public List<EventListItemDto> RecentEvents { get; set; } = new();
}