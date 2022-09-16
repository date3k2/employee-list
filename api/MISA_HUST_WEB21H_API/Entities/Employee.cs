using MISA_HUST_WEB21H_API.Enums;
using System.ComponentModel.DataAnnotations;

namespace MISA_HUST_WEB21H_API.Entities
{
    /// <summary>
    /// Nhân viên
    /// </summary>
    public class Employee
    {
        /// <summary>
        /// ID nhân viên
        /// </summary>
        public Guid EmployeeID { get; set; }

        /// <summary>
        /// Mã nhân viên
        /// </summary>
        [Required(ErrorMessage ="LOECode")] // Thiếu thông tin mã nhân viên
        public string EmployeeCode { get; set; }

        /// <summary>
        /// Tên nhân viên
        /// </summary>
        [Required(ErrorMessage ="LOEName")] // Thiếu thông tin tên nhân viên
        public string EmployeeName { get; set; }

        /// <summary>
        /// Ngày sinh
        /// </summary>
        public DateTime? DateOfBirth { get; set; }

        /// <summary>
        /// Giới tính
        /// </summary>
        public Gender? Gender { get; set; }

        /// <summary>
        /// Số CMND/CCCD
        /// </summary>
        [Required(ErrorMessage ="LOIID")] // Thiếu thông tin số CMND/CCCD
        public string  IdentityID { get; set; }

        /// <summary>
        /// Ngày cấp
        /// </summary>
        public DateTime? IdentityIssuedDate { get; set; }

        /// <summary>
        /// Nơi cấp
        /// </summary>
        public string? IdentityIssuedPlace { get; set; }

        /// <summary>
        /// Email
        /// </summary>
        [Required(ErrorMessage ="LOEmail")] // Thiếu thông tin Email
        public string Email { get; set; }

        /// <summary>
        /// Số điện thoại
        /// </summary>
        [Required(ErrorMessage ="LOPNumber")] // Thiếu thông tin số điện thoại
        public string PhoneNumber { get; set; }

        /// <summary>
        /// ID vị trí
        /// </summary>
        public Guid? PositionId { get; set; }

        /// <summary>
        /// ID phòng ban
        /// </summary>
        public Guid? DepartmentId { get; set; }

        /// <summary>
        /// Mã số thuế cá nhân
        /// </summary>
        public string? TaxCode { get; set; }

        /// <summary>
        /// Mức lương cơ bản
        /// </summary>
        public double? Salary { get; set; }

        /// <summary>
        /// Ngày gia nhập công ty
        /// </summary>
        public DateTime? JoinDate { get; set; }

        /// <summary>
        /// Tình trạng công việc
        /// </summary>
        public WorkStatus? WorkStatus  { get; set; }

        /// <summary>
        /// Người tạo
        /// </summary>
        public string? CreatedBy { get; set; }

        /// <summary>
        /// Ngày tạo
        /// </summary>
        public DateTime? CreatedDate { get; set; }

        /// <summary>
        /// Người sửa đổi
        /// </summary>
        public string? ModifiedBy { get; set; }

        /// <summary>
        /// Ngày sửa đổi
        /// </summary>
        public DateTime? ModifiedDate { get; set; }

    }
}
