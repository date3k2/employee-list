using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MISA_HUST_WEB21H_API.Entities;
using MySqlConnector;

namespace MISA_HUST_WEB21H_API.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class DepartmentsController : ControllerBase
    {
        /// <summary>
        /// API lấy danh sách toàn bộ phòng ban
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public IActionResult getAllDepartment()
        {
            try
            {
                // Kết nối DB
                string MyConnectionStrings = "Server=3.0.89.182; Port=3306; Database= DAOTAO.AI.2022.NDDAT; Uid=dev; Pwd=12345678;";
                var mySqlConnection = new MySqlConnection(MyConnectionStrings);
                // Chuẩn bị hàm
                string Proc_getAllDep = "SELECT * FROM department d ORDER BY d.DepartmentCode ";
                // Xử lý kết quả từ DB
                var Department = mySqlConnection.Query<Department>(Proc_getAllDep);
                // Trả về kết quả
                return StatusCode(StatusCodes.Status200OK, Department);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status400BadRequest,"e002");
            }
        }
    }
}
