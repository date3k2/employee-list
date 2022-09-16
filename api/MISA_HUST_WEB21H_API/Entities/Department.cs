namespace MISA_HUST_WEB21H_API.Entities
{
    /// <summary>
    /// Thông tin phòng ban
    /// </summary>
    public class Department
    {
        
            /// <summary>
            /// ID phòng ban
            /// </summary>
            public Guid DepartmentId { get; set; }

            /// <summary>
            /// Mã phòng ban
            /// </summary>
            public string DepartmentCode { get; set; }

            /// <summary>
            /// Tên phòng ban
            /// </summary>
            public string DepartmentName { get; set; }

            /// <summary>
            /// Người tạo
            /// </summary>
            public string CreatedBy { get; set; }

            /// <summary>
            /// Ngày tạo
            /// </summary>
            public DateTime CreatedDate { get; set; }

            /// <summary>
            /// Người sửa đổi
            /// </summary>
            public string ModifiedBy { get; set; }

            /// <summary>
            /// Ngày sửa đổi
            /// </summary>
            public DateTime ModifiedDate { get; set; }
        }
}
