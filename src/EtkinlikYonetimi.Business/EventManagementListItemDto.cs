namespace EtkinlikYonetimi.Business;

public class EventManagementListItemDto
{
    public int Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public DateTime StartDate { get; set; }

    public DateTime EndDate { get; set; }

    public string CreatedByUserFullName { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }

    public bool IsActive { get; set; }
}