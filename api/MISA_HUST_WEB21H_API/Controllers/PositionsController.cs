using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MISA_HUST_WEB21H_API.Entities;
using MySqlConnector;

namespace MISA_HUST_WEB21H_API.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class PositionsController : ControllerBase
    {
        /// <summary>
        /// API lấy danh sách toàn bộ vị trí
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public IActionResult getAllPosition()
        {
            try
            {
                // Kết nối DB
                string MyConnectionStrings = "Server=3.0.89.182; Port=3306; Database= DAOTAO.AI.2022.NDDAT; Uid=dev; Pwd=12345678;";
                var mySqlConnection = new MySqlConnection(MyConnectionStrings);
                // Chuẩn bị hàm
                string Proc_getAllPos = "SELECT * FROM positions p ORDER BY p.PositionCode ";
                // Xử lý kết quả từ DB
                var Positions = mySqlConnection.Query<Position>(Proc_getAllPos);
                // Trả về kết quả
                return StatusCode(StatusCodes.Status200OK, Positions);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status400BadRequest, "e002");
            }
        }
    }
}
