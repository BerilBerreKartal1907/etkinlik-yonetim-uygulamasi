using EtkinlikYonetimi.DataAccess;
using EtkinlikYonetimi.Entity;
using Microsoft.EntityFrameworkCore;

namespace EtkinlikYonetimi.Business;

public class EventService : IEventService
{
    private readonly AppDbContext _dbContext;

    public EventService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<List<EventListItemDto>> GetPublicListAsync()
    {
        var now = DateTime.UtcNow;

        return await _dbContext.Events
            .Where(e => e.IsActive && e.StartDate > now)
            .OrderBy(e => e.CreatedAt)
            .Select(e => new EventListItemDto
            {
                Id = e.Id,
                Title = e.Title,
                ShortDescription = e.ShortDescription,
                ImageUrl = e.ImageUrl,
                StartDate = e.StartDate,
                EndDate = e.EndDate
            })
            .ToListAsync();
    }

    public async Task<EventDetailDto?> GetDetailAsync(int id)
    {
        var eventEntity = await _dbContext.Events.FirstOrDefaultAsync(e => e.Id == id);

        if (eventEntity is null)
        {
            return null;
        }

        var recentEvents = await _dbContext.Events
            .Where(e => e.Id != id)
            .OrderByDescending(e => e.CreatedAt)
            .Take(5)
            .Select(e => new EventListItemDto
            {
                Id = e.Id,
                Title = e.Title,
                ShortDescription = e.ShortDescription,
                ImageUrl = e.ImageUrl,
                StartDate = e.StartDate,
                EndDate = e.EndDate
            })
            .ToListAsync();

        return new EventDetailDto
        {
            Id = eventEntity.Id,
            Title = eventEntity.Title,
            ShortDescription = eventEntity.ShortDescription,
            LongDescriptionHtml = eventEntity.LongDescriptionHtml,
            ImageUrl = eventEntity.ImageUrl,
            StartDate = eventEntity.StartDate,
            EndDate = eventEntity.EndDate,
            RecentEvents = recentEvents
        };
    }

    public async Task<List<EventManagementListItemDto>> GetManagementListAsync()
    {
        return await _dbContext.Events
            .Include(e => e.CreatedByUser)
            .OrderBy(e => e.StartDate)
            .Select(e => new EventManagementListItemDto
            {
                Id = e.Id,
                Title = e.Title,
                StartDate = e.StartDate,
                EndDate = e.EndDate,
                CreatedByUserFullName = e.CreatedByUser.FirstName + " " + e.CreatedByUser.LastName,
                CreatedAt = e.CreatedAt,
                IsActive = e.IsActive
            })
            .ToListAsync();
    }

    public async Task<EventResultDto> SaveAsync(EventFormDto request)
    {
        // 1. Boş alan kontrolü
        if (string.IsNullOrWhiteSpace(request.Title) ||
            string.IsNullOrWhiteSpace(request.ShortDescription) ||
            string.IsNullOrWhiteSpace(request.LongDescriptionHtml) ||
            request.StartDate == default ||
            request.EndDate == default)
        {
            return new EventResultDto { Success = false, Message = "Tüm alanları doldurunuz." };
        }

        // 2. Karakter sınırı kontrolleri
        if (request.Title.Length > 255)
        {
            return new EventResultDto { Success = false, Message = "Etkinlik başlığı en fazla 255 karakter olabilir." };
        }

        if (request.ShortDescription.Length > 512)
        {
            return new EventResultDto { Success = false, Message = "Kısa açıklama en fazla 512 karakter olabilir." };
        }

        // 3. Tarih tutarlılığı
        if (request.EndDate <= request.StartDate)
        {
            return new EventResultDto { Success = false, Message = "Bitiş tarihi başlangıç tarihinden sonra olmalıdır." };
        }

        // 4. Mükerrer başlık kontrolü (düzenlerken kendi kaydını hariç tut)
        var duplicateTitleExists = await _dbContext.Events
            .AnyAsync(e => e.Title == request.Title && e.Id != request.Id);

        if (duplicateTitleExists)
        {
            return new EventResultDto { Success = false, Message = "Bu başlıkla kayıtlı başka bir etkinlik zaten var." };
        }

        // 5. Ekleme mi, güncelleme mi?
        if (request.Id is null)
        {
            var newEvent = new Event
            {
                Title = request.Title,
                ShortDescription = request.ShortDescription,
                LongDescriptionHtml = request.LongDescriptionHtml,
                ImageUrl = request.ImageUrl,
                StartDate = request.StartDate,
                EndDate = request.EndDate,
                IsActive = request.IsActive,
                CreatedByUserId = request.CreatedByUserId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _dbContext.Events.Add(newEvent);
            await _dbContext.SaveChangesAsync();

            return new EventResultDto { Success = true, Message = "Etkinlik başarıyla oluşturuldu.", EventId = newEvent.Id };
        }
        else
        {
            var existingEvent = await _dbContext.Events.FirstOrDefaultAsync(e => e.Id == request.Id);

            if (existingEvent is null)
            {
                return new EventResultDto { Success = false, Message = "Güncellenecek etkinlik bulunamadı." };
            }

            existingEvent.Title = request.Title;
            existingEvent.ShortDescription = request.ShortDescription;
            existingEvent.LongDescriptionHtml = request.LongDescriptionHtml;
            existingEvent.ImageUrl = request.ImageUrl;
            existingEvent.StartDate = request.StartDate;
            existingEvent.EndDate = request.EndDate;
            existingEvent.IsActive = request.IsActive;
            existingEvent.UpdatedAt = DateTime.UtcNow;

            await _dbContext.SaveChangesAsync();

            return new EventResultDto { Success = true, Message = "Etkinlik başarıyla güncellendi.", EventId = existingEvent.Id };
        }
    }

    public async Task<EventResultDto> DeleteAsync(int id)
    {
        var existingEvent = await _dbContext.Events.FirstOrDefaultAsync(e => e.Id == id);

        if (existingEvent is null)
        {
            return new EventResultDto { Success = false, Message = "Silinecek etkinlik bulunamadı." };
        }

        _dbContext.Events.Remove(existingEvent);
        await _dbContext.SaveChangesAsync();

        return new EventResultDto { Success = true, Message = "Etkinlik başarıyla silindi." };
    }
}