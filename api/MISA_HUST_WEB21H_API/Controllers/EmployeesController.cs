using Microsoft.AspNetCore.Hosting.Server;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MISA_HUST_WEB21H_API.Entities;
using MISA_HUST_WEB21H_API.Enums;
using MySqlConnector;
using static Dapper.SqlMapper;
using System.Collections.Generic;
using Dapper;
using System;
using System.Linq;

namespace MISA_HUST_WEB21H_API.Controllers
{

    [Route("api/v1/[controller]")]
    [ApiController]
    public class EmployeesController : ControllerBase
    {
        /// <summary>
        /// API thêm mới nhân viên
        /// </summary>
        /// <param name="employee"> Nhân viên</param>
        /// <returns> Nhân viên được thêm mới </returns>
        [HttpPost]
        public IActionResult InsertEmployee([FromBody] Employee employee)
        {
            try
            {
                // Kết nối tới DB 
                string MyConnectionStrings = "Server=3.0.89.182; Port=3306; Database= DAOTAO.AI.2022.NDDAT; Uid=dev; Pwd=12345678;";
                var mySqlConnection = new MySqlConnection(MyConnectionStrings);

                // Chuẩn bị câu lệnh INSERT INTO
                var insert = "INSERT INTO employee(EmployeeId, EmployeeCode, EmployeeName, DateOfBirth, Gender, IdentityID, IdentityIssuedDate, IdentityIssuedPlace, Email, PhoneNumber, PositionId, DepartmentId, TaxCode, Salary, JoinDate, WorkStatus, CreatedBy, CreatedDate, ModifiedBy, ModifiedDate)" +
                    "VALUES(@EmployeeId,@EmployeeCode,@EmployeeName,@DateOfBirth,@Gender,@IdentityID,@IdentityIssuedDate,@IdentityIssuedPlace,@Email,@PhoneNumber,@PositionId,@DepartmentId,@TaxCode,@Salary,@JoinDate,@WorkStatus,@CreatedBy, @CreatedDate, @ModifiedBy, @ModifiedDate);";

                // Chuẩn bị tham số đầu vào cho INSERT INTO
                var parameters = new DynamicParameters();
                var employeeID = Guid.NewGuid();
                parameters.Add("@EmployeeId", employeeID);
                parameters.Add("@EmployeeCode", employee.EmployeeCode);
                parameters.Add("@EmployeeName", employee.EmployeeName);
                parameters.Add("@DateOfBirth", employee.DateOfBirth);
                parameters.Add("@Gender", employee.Gender);
                parameters.Add("@IdentityID", employee.IdentityID);
                parameters.Add("@IdentityIssuedDate", employee.IdentityIssuedDate);
                parameters.Add("@IdentityIssuedPlace", employee.IdentityIssuedPlace);
                parameters.Add("@Email", employee.Email);
                parameters.Add("@PhoneNumber", employee.PhoneNumber);
                parameters.Add("@PositionId", employee.PositionId);
                parameters.Add("@DepartmentId", employee.DepartmentId);
                parameters.Add("@TaxCode", employee.TaxCode);
                parameters.Add("@Salary", employee.Salary);
                parameters.Add("@JoinDate", employee.JoinDate);
                parameters.Add("@WorkStatus", employee.WorkStatus);
                parameters.Add("@CreatedBy", employee.CreatedBy);
                parameters.Add("@CreatedDate", employee.CreatedDate);
                parameters.Add("@ModifiedBy", employee.ModifiedBy);
                parameters.Add("@ModifiedDate", DateTime.Now);

                // Thực hiện chạy câu lệnh INSERT INTO trên DB
                var AffectedRows = mySqlConnection.Execute(insert, parameters);

                // Trả về dữ liệu cho client
                if (AffectedRows > 0)
                { return StatusCode(StatusCodes.Status201Created, employeeID); }
                else { return StatusCode(StatusCodes.Status400BadRequest, "e001"); }
            }
            // Exp trên DB (trùng mã nhân viên, email, mã số thuế, số CCCD)
            catch (MySqlException mySqlException)
            {
               if (mySqlException.Number == 1062)
               { return StatusCode(StatusCodes.Status400BadRequest,mySqlException.Message); }
                return StatusCode(StatusCodes.Status400BadRequest, "e001");
            }
            // Exp chung
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status400BadRequest, "e001");
            }
        }

        /// <summary>
        /// API lấy thông tin nhân viên thông qua ID
        /// </summary>
        /// <param name="EmployeeId">ID nhân viên</param>
        /// <returns>Thông tin nhân viên</returns>
        [HttpGet("{EmployeeId}")]
        public IActionResult GetEmployee([FromRoute] Guid EmployeeId)
        {
            try
            {
                // Kết nối DB
                string MyConnectionStrings = "Server=3.0.89.182; Port=3306; Database= DAOTAO.AI.2022.NDDAT; Uid=dev; Pwd=12345678;";
                var mySqlConnection = new MySqlConnection(MyConnectionStrings);
                // Chuẩn bị hàm
                string Proc_getEmp = "Proc_Employee_GetEmployeeById";
                // Chuẩn bị tham số
                var parameters = new DynamicParameters();
                parameters.Add("@$EmployeeId", EmployeeId);
                // Xử lý kết quả từ DB
                var employee = mySqlConnection.QueryFirstOrDefault<Employee>(Proc_getEmp, parameters, commandType: System.Data.CommandType.StoredProcedure);
                // Trả về kết quả
                if (employee == null) return StatusCode(StatusCodes.Status404NotFound, "e002");
                else return StatusCode(StatusCodes.Status200OK, employee);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status400BadRequest, "e001");
            }
        }

        /// <summary>
        /// API lấy thông tin tất cả nhân viên
        /// </summary>
        /// <returns>Thông tin tất cả nhân viên</returns>
        [HttpGet]
        public IActionResult GetAllEmployee()
        {
            try
            {
                // Kết nối DB
                string MyConnectionStrings = "Server=3.0.89.182; Port=3306; Database= DAOTAO.AI.2022.NDDAT; Uid=dev; Pwd=12345678;";
                var mySqlConnection = new MySqlConnection(MyConnectionStrings);
                // Chuẩn bị hàm
                string Proc_getAllEmp = "Proc_Employee_GetAllEmployee";
                // Xử lý kết quả từ DB
                var Employee = mySqlConnection.Query(Proc_getAllEmp, commandType: System.Data.CommandType.StoredProcedure);
                // Trả về kết quả
                return StatusCode(StatusCodes.Status200OK, Employee);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status400BadRequest, "e001");
            }
        }

        /// <summary>
        /// API xóa nhân viên thông qua ID
        /// </summary>
        /// <param name="EmployeeId">ID nhân viên</param>
        /// <returns></returns>
        [HttpDelete("{EmployeeId}")]
        public IActionResult DeleteEmployee([FromRoute] Guid EmployeeId)
        {
            try
            {
                // Kết nối DB
                string MyConnectionStrings = "Server=3.0.89.182; Port=3306; Database= DAOTAO.AI.2022.NDDAT; Uid=dev; Pwd=12345678;";
                var mySqlConnection = new MySqlConnection(MyConnectionStrings);
                // Chuẩn bị hàm
                string Proc_deleteEmp = "DELETE FROM employee WHERE EmployeeId= @EmployeeId ";
                // Chuẩn bị tham số
                var parameters = new DynamicParameters();
                parameters.Add("@EmployeeId", EmployeeId);
                // Xử lý kết quả từ DB
                var AffectedRows = mySqlConnection.Execute(Proc_deleteEmp, parameters);
                // Trả về kết quả
                if (AffectedRows>0)
                return StatusCode(StatusCodes.Status200OK);
                else return StatusCode(StatusCodes.Status404NotFound,"e002");
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status400BadRequest, "e001");
            }
        }

        /// <summary>
        /// API sửa thông tin nhân viên
        /// </summary>
        /// <param name="EmployeeId">ID nhân viên</param>
        /// <param name="employee"> Thông tin nhân viên cần sửa</param>
        /// <returns></returns>
        [HttpPut("{EmployeeId}")]
        public IActionResult EditEmployee([FromRoute] Guid EmployeeId, [FromBody] Employee employee)
        {
            try
            {
                // Kết nối tới DB 
                string MyConnectionStrings = "Server=3.0.89.182; Port=3306; Database= DAOTAO.AI.2022.NDDAT; Uid=dev; Pwd=12345678;";
                var mySqlConnection = new MySqlConnection(MyConnectionStrings);
                // Chuẩn bị câu lệnh 
                var Proc_EditEmp = "Proc_Employee_EditEmployee";

                // Chuẩn bị tham số đầu vào
                var parameters = new DynamicParameters();
                parameters.Add("@EmpId",EmployeeId);
                parameters.Add("@EmpCode", employee.EmployeeCode);
                parameters.Add("@EmpName", employee.EmployeeName);
                parameters.Add("@DateOfBirth", employee.DateOfBirth);
                parameters.Add("@Gender", employee.Gender);
                parameters.Add("@IdentityID", employee.IdentityID);
                parameters.Add("@IdentityIssuedDate", employee.IdentityIssuedDate);
                parameters.Add("@IdentityIssuedPlace", employee.IdentityIssuedPlace);
                parameters.Add("@Email", employee.Email);
                parameters.Add("@PhoneNumber", employee.PhoneNumber);
                parameters.Add("@PositionId", employee.PositionId);
                parameters.Add("@DepartmentId", employee.DepartmentId);
                parameters.Add("@TaxCode", employee.TaxCode);
                parameters.Add("@Salary", employee.Salary);
                parameters.Add("@JoinDate", employee.JoinDate);
                parameters.Add("@WorkStatus", employee.WorkStatus);
                parameters.Add("@ModifiedBy", employee.ModifiedBy);
                parameters.Add("@ModifiedDate", DateTime.Now);

                // Thực hiện chạy câu lệnh
                var AffectedRows = mySqlConnection.Execute(Proc_EditEmp, parameters,commandType: System.Data.CommandType.StoredProcedure);

                // Trả về dữ liệu cho client
                if (AffectedRows > 0)
                 return StatusCode(StatusCodes.Status200OK);
                else return StatusCode(StatusCodes.Status400BadRequest, "e001");
            }
            // Exp trên DB (trùng mã nhân viên, email, mã số thuế, số CCCD)
            catch (MySqlException mySqlException)
            {
                if (mySqlException.Number == 1062)
                { return StatusCode(StatusCodes.Status400BadRequest, mySqlException.Message); }
                return StatusCode(StatusCodes.Status400BadRequest, "e001");
            }
            // Exp chung
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status400BadRequest, "e001");
            }
        }

        /// <summary>
        /// API lấy mã nhân viên mới tự động tăng
        /// </summary>
        /// <returns> Mã nhân viên mới </returns>
        [HttpGet("NewCode")]
        public IActionResult GetNewCode()
        {
            try
            {
                // Kết nối DB
                string MyConnectionStrings = "Server=3.0.89.182; Port=3306; Database= DAOTAO.AI.2022.NDDAT; Uid=dev; Pwd=12345678;";
                var mySqlConnection = new MySqlConnection(MyConnectionStrings);
                // Chuẩn bị hàm
                string GetMaxCode= "SELECT MAX(e.EmployeeCode) FROM employee e;";
                // Xử lý kết quả từ DB
                string MaxCode = mySqlConnection.QueryFirstOrDefault<string>(GetMaxCode);
                string NewCode = Convert.ToString(Convert.ToInt64(MaxCode[2..]) + 1);
                // Xử lý trường hợp số 0 ở giữa
                int s = NewCode.Length;
                    for (int i = 1; i <= MaxCode.Length - s -2; i++)
                        NewCode = String.Concat("0", NewCode);
                NewCode = String.Concat("NV", NewCode);
                // Trả về kết quả
                return StatusCode(StatusCodes.Status200OK, NewCode);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status400BadRequest, "e001");
            }
        }

        /// <summary>
        /// API lọc dữ liệu tìm kiếm và phân trang
        /// </summary>
        /// <param name="keyword"> từ khóa tìm kiếm (mã nhân viên, tên nhân viên, hoặc số điện thoại)</param>
        /// <param name="PositionId"> ID vị trí cần tìm</param>
        /// <param name="DepartmentId">ID phòng ban cần tìm </param>
        /// <param name="pageSize"> Số bản ghi trong 1 trang</param>
        /// <param name="pageNumber"> Trang </param>
        /// <returns> Dữ liệu các nhân viên thỏa mãn điều kiện lọc </returns>
        [HttpGet("Filter")]
        public IActionResult Filter(
            [FromQuery] string? keyword,
            [FromQuery] Guid? PositionId,
            [FromQuery] Guid? DepartmentId,
            [FromQuery] int pageSize=10,
            [FromQuery] int pageNumber=1)
        {
            // Kết nối DB
                string MyConnectionStrings = "Server=3.0.89.182; Port=3306; Database= DAOTAO.AI.2022.NDDAT; Uid=dev; Pwd=12345678;";
            var mySqlConnection = new MySqlConnection(MyConnectionStrings);
            // Chuẩn bị hàm
            string Proc_GetPaging= "Proc_Employee_GetPaging";
            // Chuẩn bị tham số
            var parameters = new DynamicParameters();
            parameters.Add("@Skip", (pageNumber - 1) * pageSize);
            parameters.Add("@Take",pageSize);
            parameters.Add("@Sort","");
            // Khởi tạo câu lệnh điều kiện WHERE lọc dữ liệu
            string WhereClause = "";
            WhereClause = keyword == null ? " WHERE 1=1 " : $" WHERE (EmployeeCode LIKE '%{keyword}%' OR (LOWER(EmployeeName) LIKE BINARY '%{keyword.ToLower()}%') OR PhoneNumber LIKE '%{keyword}%') ";
            WhereClause += PositionId == null ? " AND 1=1 " : $" AND PositionId = '{PositionId}' ";
            WhereClause += DepartmentId == null ? " AND 1=1 " : $" AND DepartmentId = '{DepartmentId}'";
            parameters.Add("@$Where",WhereClause);
            // Thực hiện câu lệnh
            var Filter =mySqlConnection.QueryMultiple(Proc_GetPaging, parameters,commandType: System.Data.CommandType.StoredProcedure);
            // Trả về dữ liệu gồm danh sách các nhân viên thỏa mãn điều kiện và tổng số trang
            if (Filter!=null) {
                var employees = Filter.Read().ToList();
                var totalCount= Filter.Read<int>().Single();
                return StatusCode(StatusCodes.Status200OK,new PagingData() {
                    Data=employees,
                    TotalCount=totalCount
                });
            }
            return StatusCode(StatusCodes.Status404NotFound,"e002");
        }
    }
}
