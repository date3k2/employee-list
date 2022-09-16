namespace MISA_HUST_WEB21H_API.Entities
{
    /// <summary>
    /// Thông tin vị trí
    /// </summary>
    public class Position
    {
        /// <summary>
        /// ID vị trí
        /// </summary>
       public Guid PositionId { get; set; }

        /// <summary>
        /// Mã vị trí
        /// </summary>
        public string PositionCode { get; set; }

        /// <summary>
        /// Tên vị trí
        /// </summary>
        public string PositionName { get; set; }

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
