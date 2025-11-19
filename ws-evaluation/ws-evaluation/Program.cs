using WS.Infraestructure.Connection;
using WS.Repositories.JugdeRepositories;
using WS.Repositories.RubricRepositories;
using WS.Repositories.ScoreRepositories;
using WS.Service.JudgeServices;
using WS.Service.RubricServices;
using WS.Service.ScoresServices;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddScoped<ScoreService>();
builder.Services.AddScoped<ScoreRepository>();
builder.Services.AddScoped<JudgeService>();
builder.Services.AddScoped<JugdeRepository>();
builder.Services.AddScoped<RubricService>();
builder.Services.AddScoped<RubricRepository>();
builder.Services.AddScoped<AppDbContext>();
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
