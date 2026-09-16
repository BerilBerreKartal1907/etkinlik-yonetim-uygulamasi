namespace EtkinlikYonetimi.Business;

public interface IEventService
{
    Task<List<EventListItemDto>> GetPublicListAsync();

    Task<EventDetailDto?> GetDetailAsync(int id);

    Task<List<EventManagementListItemDto>> GetManagementListAsync();

    Task<EventResultDto> SaveAsync(EventFormDto request);

    Task<EventResultDto> DeleteAsync(int id);
}