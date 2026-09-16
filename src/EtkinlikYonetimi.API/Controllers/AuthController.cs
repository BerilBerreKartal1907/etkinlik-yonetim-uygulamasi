using EtkinlikYonetimi.Business;
using Microsoft.AspNetCore.Mvc;

namespace EtkinlikYonetimi.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequestDto request)
    {
        var result = await _authService.RegisterAsync(request);

        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
    {
        var result = await _authService.LoginAsync(request);

        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    [HttpPut("profile")]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequestDto request)
    {
        var result = await _authService.UpdateProfileAsync(request);

        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    [HttpGet("profile/{userId}")]
    public async Task<IActionResult> GetProfile(int userId)
    {
        var result = await _authService.GetProfileAsync(userId);

        if (result is null)
        {
            return NotFound(new { message = "Kullanıcı bulunamadı." });
        }

        return Ok(result);
    }
}