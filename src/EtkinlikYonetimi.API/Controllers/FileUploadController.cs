using Microsoft.AspNetCore.Mvc;

namespace EtkinlikYonetimi.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FileUploadController : ControllerBase
{
    private static readonly string[] AllowedExtensions = { ".jpg", ".jpeg", ".png" };
    private const long MaxFileSizeBytes = 2 * 1024 * 1024; // 2 MB

    private readonly IWebHostEnvironment _environment;

    public FileUploadController(IWebHostEnvironment environment)
    {
        _environment = environment;
    }

    [HttpPost("image")]
    public async Task<IActionResult> UploadImage(IFormFile file)
    {
        if (file is null || file.Length == 0)
        {
            return BadRequest(new { message = "Lütfen bir dosya seçiniz." });
        }

        if (file.Length > MaxFileSizeBytes)
        {
            return BadRequest(new { message = "Dosya boyutu en fazla 2 MB olabilir." });
        }

        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();

        if (!AllowedExtensions.Contains(extension))
        {
            return BadRequest(new { message = "Sadece jpg, jpeg, png formatları desteklenmektedir." });
        }

        var uploadsFolder = Path.Combine(_environment.WebRootPath, "uploads");

        if (!Directory.Exists(uploadsFolder))
        {
            Directory.CreateDirectory(uploadsFolder);
        }

        var fileName = $"{Guid.NewGuid()}{extension}";
        var filePath = Path.Combine(uploadsFolder, fileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        var fileUrl = $"/uploads/{fileName}";

        return Ok(new { url = fileUrl });
    }
}