using Microsoft.EntityFrameworkCore; // Add this using directive
using WS.Infraestructure.Connection;
using WS.Repositories.AIAnalysisRepositories;
using WS.Service.AIAnalysisServices;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddDbContext<AppDbContext>(options => // Replace AddScoped with AddDbContext
    options.UseSqlServer(builder.Configuration.GetConnectionString("Default"))); // Ensure UseSqlServer is correctly used
builder.Services.AddScoped<AIAnalysisService>();
builder.Services.AddScoped<AIAnalysisRepository>();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthorization();

app.MapControllers();

app.Run();
