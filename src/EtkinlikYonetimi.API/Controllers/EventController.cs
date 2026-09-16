using EtkinlikYonetimi.Business;
using Microsoft.AspNetCore.Mvc;

namespace EtkinlikYonetimi.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EventController : ControllerBase
{
    private readonly IEventService _eventService;

    public EventController(IEventService eventService)
    {
        _eventService = eventService;
    }

    // GET /api/event
    // Etkinlik Listesi sayfası için - sadece aktif + ileri tarihli
    [HttpGet]
    public async Task<IActionResult> GetPublicList()
    {
        var result = await _eventService.GetPublicListAsync();
        return Ok(result);
    }

    // GET /api/event/{id}
    // Etkinlik Detay sayfası için
    [HttpGet("{id}")]
    public async Task<IActionResult> GetDetail(int id)
    {
        var result = await _eventService.GetDetailAsync(id);

        if (result is null)
        {
            return NotFound(new { message = "Etkinlik bulunamadı." });
        }

        return Ok(result);
    }

    // GET /api/event/management
    // Etkinlik Yönetimi sayfası için - tüm etkinlikler (admin)
    [HttpGet("management")]
    public async Task<IActionResult> GetManagementList()
    {
        var result = await _eventService.GetManagementListAsync();
        return Ok(result);
    }

    // POST /api/event
    // Etkinlik Kayıt Formu için - ekleme + düzenleme aynı endpoint
    [HttpPost]
    public async Task<IActionResult> Save([FromBody] EventFormDto request)
    {
        var result = await _eventService.SaveAsync(request);

        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    // DELETE /api/event/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _eventService.DeleteAsync(id);

        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }
}