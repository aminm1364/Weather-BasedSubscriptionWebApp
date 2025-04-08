using System.Net.Http;
using System.Text.Json;
using Microsoft.Extensions.Configuration;
using WSWA.Core.Models;

namespace WSWA.Core.Services
{
    public class WeatherService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;
        private readonly string _baseUrl;

        public WeatherService(HttpClient httpClient, IConfiguration config)
        {
            _httpClient = httpClient;
            _apiKey = Environment.GetEnvironmentVariable("OPENWEATHER_API_KEY")
                        ?? config["OpenWeather:ApiKey"]
                        ?? throw new ArgumentNullException("Missing API key");
            _baseUrl = config["OpenWeather:BaseUrl"] ?? "https://api.openweathermap.org/data/2.5/weather";
        }

        public async Task<object?> GetWeatherAsync(string city, string country)
        {
            var url = $"{_baseUrl}?q={city},{country}&appid={_apiKey}&units=metric";
            var response = await _httpClient.GetAsync(url);
            if (!response.IsSuccessStatusCode)
            {
                return null;
            }

            var json = await response.Content.ReadAsStringAsync();
            var doc = JsonDocument.Parse(json);

            var root = doc.RootElement;

            // Extract timezone offset in seconds
            var timezoneOffset = root.TryGetProperty("timezone", out var timezoneProp)
                ? TimeSpan.FromSeconds(timezoneProp.GetInt32())
                : TimeSpan.Zero;

            var weather = new
            {
                Description = root.TryGetProperty("weather", out var weatherArr) && weatherArr.GetArrayLength() > 0 && weatherArr[0].TryGetProperty("description", out var desc)
                    ? desc.GetString()
                    : "Unknown",
                Temperature = new
                {
                    Current = root.TryGetProperty("main", out var main) && main.TryGetProperty("temp", out var temp)
                        ? temp.GetDouble()
                        : 0,
                    Min = main.TryGetProperty("temp_min", out var tempMin)
                        ? tempMin.GetDouble()
                        : 0,
                    Max = main.TryGetProperty("temp_max", out var tempMax)
                        ? tempMax.GetDouble()
                        : 0
                },
                Pressure = main.TryGetProperty("pressure", out var pressure)
                    ? pressure.GetInt32()
                    : 0,
                Humidity = main.TryGetProperty("humidity", out var humidity)
                    ? humidity.GetInt32()
                    : 0,
                WindSpeed = root.TryGetProperty("wind", out var wind) && wind.TryGetProperty("speed", out var speed)
                    ? speed.GetDouble()
                    : 0,
                Cloudiness = root.TryGetProperty("clouds", out var clouds) && clouds.TryGetProperty("all", out var cloudPercent)
                    ? MapCloudiness(cloudPercent.GetInt32())
                    : "Unknown",
                Sunrise = root.TryGetProperty("sys", out var sys) && sys.TryGetProperty("sunrise", out var sunrise)
                    ? UnixToDateTime(sunrise.GetInt64(), timezoneOffset).ToString("hh:mm tt")
                    : "N/A",
                Sunset = sys.TryGetProperty("sunset", out var sunset)
                    ? UnixToDateTime(sunset.GetInt64(), timezoneOffset).ToString("hh:mm tt")
                    : "N/A",
                Timezone = $"GMT{(timezoneOffset.TotalHours >= 0 ? "+" : "")}{timezoneOffset.TotalHours}",
            };

            return weather;
        }

        private static DateTime UnixToDateTime(long unixTime, TimeSpan offset) =>
            DateTimeOffset.FromUnixTimeSeconds(unixTime).ToOffset(offset).DateTime;

        private static string MapCloudiness(int percentage)
        {
            if (percentage < 20) return "Clear";
            if (percentage < 50) return "Partly Cloudy";
            if (percentage < 80) return "Cloudy";
            return "Overcast";
        }
        
    }
}